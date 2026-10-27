import React, { useEffect, useRef, useState, useCallback } from 'react';

interface CinematicCanvasScrubberProps {
  progress: number;
  onProgressChange?: (progress: number) => void;
  onTelemetryUpdate?: (stats: TelemetryStats) => void;
}

export interface TelemetryStats {
  fps: number;
  currentFrame: number;
  totalFrames: number;
  renderTimeMs: number;
  avgFrameDurationMs: number;
  worstFrameDurationMs: number;
  droppedFramesCount: number;
  scrollDirection: 'forward' | 'reverse' | 'idle';
  scrollVelocity: number;
  loadedFrames: number;
  isReady: boolean;
  activeScene: 1 | 2 | 3;
  reducedMotion: boolean;
}

const TOTAL_FRAMES = 101;
const FRAME_BASE_URL = '/scenes/frames/frame_';
const ANCHOR_FRAMES = [1, 20, 41, 65, 80, 101];

export const CinematicCanvasScrubber: React.FC<CinematicCanvasScrubberProps> = ({
  progress,
  onTelemetryUpdate,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_FRAMES).fill(null));
  const [loadedCount, setLoadedCount] = useState<number>(0);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);

  // Animation & smoothing state
  const targetFrameRef = useRef<number>(1);
  const currentRenderedFrameRef = useRef<number>(1);
  const lastProgressRef = useRef<number>(progress);
  const lastScrollTimeRef = useRef<number>(performance.now());
  const rafIdRef = useRef<number | null>(null);

  // FPS & Frame timing calculations
  const frameTimesRef = useRef<number[]>([]);
  const frameDurationsRef = useRef<number[]>([]);
  const worstDurationRef = useRef<number>(0);
  const droppedFramesRef = useRef<number>(0);
  const lastRafTimeRef = useRef<number>(performance.now());
  const lastFpsUpdateRef = useRef<number>(performance.now());
  const calculatedFpsRef = useRef<number>(60);
  const scrollDirectionRef = useRef<'forward' | 'reverse' | 'idle'>('idle');

  // Detect reduced-motion preference
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Canvas drawing helper with crisp cover fit
  const drawSingleFrame = useCallback((img: HTMLImageElement): number => {
    const canvas = canvasRef.current;
    if (!canvas || !img || !img.complete || img.naturalWidth === 0) return 0;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return 0;

    const tStart = performance.now();

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;

    // Cover calculation
    const hRatio = cw / iw;
    const vRatio = ch / ih;
    const ratio = Math.max(hRatio, vRatio);

    const nw = iw * ratio;
    const nh = ih * ratio;
    const nx = (cw - nw) / 2;
    const ny = (ch - nh) / 2;

    ctx.drawImage(img, 0, 0, iw, ih, nx, ny, nw, nh);

    return performance.now() - tStart;
  }, []);

  // Progressive Batched Loading (Prevents loading 101 images simultaneously)
  useEffect(() => {
    let mounted = true;
    const loadedArr: (HTMLImageElement | null)[] = new Array(TOTAL_FRAMES).fill(null);
    let completed = 0;

    const loadSingle = (index: number): Promise<HTMLImageElement> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        const padded = index.toString().padStart(3, '0');
        img.src = `${FRAME_BASE_URL}${padded}.webp`;
        img.onload = () => {
          if (!mounted) return;
          loadedArr[index - 1] = img;
          completed++;
          setLoadedCount(completed);
          if (completed === TOTAL_FRAMES) setIsReady(true);
          resolve(img);
        };
        img.onerror = () => {
          if (!mounted) return;
          completed++;
          setLoadedCount(completed);
          reject();
        };
      });
    };

    // Step 1: Load Frame 1 immediately for instant paint
    loadSingle(1).then((firstImg) => {
      if (!mounted) return;
      drawSingleFrame(firstImg);

      // Step 2: Load anchor keyframes next (ensures each scene keyframe is immediately responsive)
      const remainingAnchors = ANCHOR_FRAMES.filter((f) => f !== 1);
      Promise.all(remainingAnchors.map(loadSingle)).then(() => {
        if (!mounted) return;

        // Step 3: Progressive stream of remaining frames in micro-batches
        const unbuffered: number[] = [];
        for (let i = 2; i <= TOTAL_FRAMES; i++) {
          if (!ANCHOR_FRAMES.includes(i)) unbuffered.push(i);
        }

        let batchIdx = 0;
        const BATCH_SIZE = 5;

        const loadNextBatch = () => {
          if (!mounted || batchIdx >= unbuffered.length) return;
          const slice = unbuffered.slice(batchIdx, batchIdx + BATCH_SIZE);
          batchIdx += BATCH_SIZE;
          Promise.all(slice.map(loadSingle)).finally(() => {
            if (window.requestIdleCallback) {
              window.requestIdleCallback(loadNextBatch, { timeout: 100 });
            } else {
              setTimeout(loadNextBatch, 30);
            }
          });
        };

        loadNextBatch();
      });
    });

    imagesRef.current = loadedArr;

    return () => {
      mounted = false;
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [drawSingleFrame]);

  // Update target frame based on incoming progress (0.0 -> 1.0)
  useEffect(() => {
    const clamped = Math.max(0, Math.min(1, progress));
    const target = Math.min(TOTAL_FRAMES, Math.max(1, Math.round(clamped * (TOTAL_FRAMES - 1)) + 1));
    targetFrameRef.current = target;

    const delta = progress - lastProgressRef.current;
    if (Math.abs(delta) > 0.0005) {
      scrollDirectionRef.current = delta > 0 ? 'forward' : 'reverse';
    } else {
      scrollDirectionRef.current = 'idle';
    }
    lastProgressRef.current = progress;
    lastScrollTimeRef.current = performance.now();
  }, [progress]);

  // Smooth render loop with actual frame presentation measurement
  useEffect(() => {
    const renderLoop = (now: number) => {
      const deltaFromLast = now - lastRafTimeRef.current;
      lastRafTimeRef.current = now;

      // Track frame duration & dropped frames (any frame taking > 20ms at 60Hz)
      if (deltaFromLast > 0 && deltaFromLast < 200) {
        frameDurationsRef.current.push(deltaFromLast);
        if (frameDurationsRef.current.length > 60) frameDurationsRef.current.shift();
        if (deltaFromLast > worstDurationRef.current) {
          worstDurationRef.current = deltaFromLast;
        }
        if (deltaFromLast > 22.0) {
          droppedFramesRef.current++;
        }
      }

      // Calculate FPS over 1-second rolling window
      frameTimesRef.current.push(now);
      while (frameTimesRef.current.length > 0 && frameTimesRef.current[0] < now - 1000) {
        frameTimesRef.current.shift();
      }
      if (now - lastFpsUpdateRef.current > 200) {
        calculatedFpsRef.current = frameTimesRef.current.length;
        lastFpsUpdateRef.current = now;
      }

      // Check idle scroll
      if (now - lastScrollTimeRef.current > 150) {
        scrollDirectionRef.current = 'idle';
      }

      // Smooth frame interpolation (lerp towards target)
      const target = targetFrameRef.current;
      const current = currentRenderedFrameRef.current;
      const diff = target - current;

      let nextFrame = current;
      if (Math.abs(diff) > 0.01) {
        nextFrame = current + diff * 0.28;
        if (Math.abs(target - nextFrame) < 0.1) {
          nextFrame = target;
        }
        currentRenderedFrameRef.current = nextFrame;
      }

      const frameIndex = Math.min(TOTAL_FRAMES, Math.max(1, Math.round(nextFrame)));
      
      // Fallback to nearest loaded anchor frame if current frame is still streaming
      let imgToDraw = imagesRef.current[frameIndex - 1];
      if (!imgToDraw || !imgToDraw.complete) {
        // Find nearest loaded anchor
        const nearest = ANCHOR_FRAMES.reduce((prev, curr) => {
          if (imagesRef.current[curr - 1]?.complete) {
            return Math.abs(curr - frameIndex) < Math.abs(prev - frameIndex) ? curr : prev;
          }
          return prev;
        }, 1);
        imgToDraw = imagesRef.current[nearest - 1];
      }

      let renderTime = 0;
      if (imgToDraw && imgToDraw.complete) {
        renderTime = drawSingleFrame(imgToDraw);
      }

      // Determine active scene
      let activeScene: 1 | 2 | 3 = 1;
      if (frameIndex > 65) {
        activeScene = 3;
      } else if (frameIndex > 35) {
        activeScene = 2;
      }

      // Compute rolling average duration
      const avgDuration =
        frameDurationsRef.current.length > 0
          ? frameDurationsRef.current.reduce((a, b) => a + b, 0) /
            frameDurationsRef.current.length
          : 16.6;

      // Report telemetry
      if (onTelemetryUpdate) {
        onTelemetryUpdate({
          fps: calculatedFpsRef.current,
          currentFrame: frameIndex,
          totalFrames: TOTAL_FRAMES,
          renderTimeMs: Math.round(renderTime * 100) / 100,
          avgFrameDurationMs: Math.round(avgDuration * 10) / 10,
          worstFrameDurationMs: Math.round(worstDurationRef.current * 10) / 10,
          droppedFramesCount: droppedFramesRef.current,
          scrollDirection: scrollDirectionRef.current,
          scrollVelocity: Math.abs(diff),
          loadedFrames: loadedCount,
          isReady: loadedCount >= TOTAL_FRAMES,
          activeScene,
          reducedMotion,
        });
      }

      rafIdRef.current = requestAnimationFrame(renderLoop);
    };

    rafIdRef.current = requestAnimationFrame(renderLoop);
    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [drawSingleFrame, loadedCount, onTelemetryUpdate, reducedMotion]);

  // Handle window resizing
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;

      // Redraw current frame
      const frameIndex = Math.min(
        TOTAL_FRAMES,
        Math.max(1, Math.round(currentRenderedFrameRef.current))
      );
      const img = imagesRef.current[frameIndex - 1] || imagesRef.current[0];
      if (img && img.complete) {
        drawSingleFrame(img);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [drawSingleFrame]);

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden bg-slate-950">
      <canvas
        ref={canvasRef}
        className="w-full h-full object-cover filter brightness-95 contrast-105"
        style={{ width: '100vw', height: '100vh' }}
      />

      <div className="absolute inset-0 bg-radial-gradient from-transparent via-slate-950/20 to-slate-950/80 pointer-events-none" />
      <div className="absolute inset-0 scanline opacity-20 pointer-events-none" />

      {/* Progressive Streaming Indicator */}
      {!isReady && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-auto bg-slate-900/80 backdrop-blur px-5 py-2.5 rounded-full border border-cyan-500/30">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>PROGRESSIVE STREAM: {loadedCount}/{TOTAL_FRAMES} FRAMES</span>
          </div>
          <div className="w-48 h-1 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-150"
              style={{ width: `${(loadedCount / TOTAL_FRAMES) * 100}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
