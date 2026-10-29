import { useEffect, useRef, useState, useCallback } from 'react';
import { PortfolioWorld, type WorldTelemetry } from '../three/PortfolioWorld';
import type { CharacterType } from '../three/CharacterModel';

interface ThreeCanvasProps {
  progress: number;
  characterType?: CharacterType;
  onTelemetryUpdate?: (stats: WorldTelemetry) => void;
  onBubbleAnchorUpdate?: (anchor: { x: number; y: number; visible: boolean }) => void;
}

export function ThreeCanvas({
  progress,
  characterType = 'humanoid',
  onTelemetryUpdate,
  onBubbleAnchorUpdate,
}: ThreeCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const worldRef = useRef<PortfolioWorld | null>(null);
  const [bubbleAnchor, setBubbleAnchor] = useState<{ x: number; y: number; visible: boolean }>({
    x: 0,
    y: 0,
    visible: false,
  });

  // Initialize Three.js PortfolioWorld
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const world = new PortfolioWorld(canvas);
    worldRef.current = world;
    (window as any).__portfolioWorld = world;

    if (onTelemetryUpdate) {
      world.onTelemetry = onTelemetryUpdate;
    }

    world.start();

    // Handle responsive resize
    const handleResize = () => {
      world.resize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
      world.dispose();
      worldRef.current = null;
    };
  }, []);

  // Sync scroll progress to 3D world
  useEffect(() => {
    if (worldRef.current) {
      worldRef.current.updateProgress(progress);

      // In Scene 1 (progress < 0.22), update speech bubble anchor
      if (progress < 0.22) {
        const anchor = worldRef.current.getSpeechBubbleAnchor();
        setBubbleAnchor(anchor);
        if (onBubbleAnchorUpdate) {
          onBubbleAnchorUpdate(anchor);
        }
      }
    }
  }, [progress, onBubbleAnchorUpdate]);

  // Sync character type toggle
  useEffect(() => {
    if (worldRef.current) {
      worldRef.current.setCharacterType(characterType);
    }
  }, [characterType]);

  // Calculate Speech Bubble Opacity for Scene 1
  const getBubbleOpacity = useCallback(() => {
    if (progress < 0.02) return 1;
    if (progress < 0.16) return 1 - (progress - 0.02) / 0.14;
    return 0;
  }, [progress]);

  const bubbleOpacity = getBubbleOpacity();

  return (
    <>
      {/* Pinned Hardware-Accelerated WebGL Canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full pointer-events-none z-0"
      />

      {/* 3D-Anchored Speech Bubble: "Hi, I'm Nithish!" */}
      {bubbleOpacity > 0.01 && bubbleAnchor.visible && (
        <div
          style={{
            transform: `translate3d(${bubbleAnchor.x - 70}px, ${bubbleAnchor.y - 65}px, 0)`,
            opacity: bubbleOpacity,
          }}
          className="fixed pointer-events-none z-20 transition-opacity duration-300"
        >
          <div className="relative bg-slate-900/90 border border-cyan-400/50 backdrop-blur-md px-4 py-2 rounded-2xl shadow-xl shadow-cyan-500/20 text-sm font-semibold text-cyan-200 whitespace-nowrap">
            <span>👋 Hi, I&apos;m Nithish!</span>
            {/* Bubble tail pointing down to character head */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-cyan-400/50" />
          </div>
        </div>
      )}
    </>
  );
}
