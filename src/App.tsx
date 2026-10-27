import { useState, useEffect, useRef, useCallback } from 'react';
import {
  CinematicCanvasScrubber,
  type TelemetryStats,
} from './components/CinematicCanvasScrubber';
import { Navigation } from './components/Navigation';
import { LiveTelemetry } from './components/LiveTelemetry';
import { Scene1Hero } from './components/Scene1Hero';
import { Scene2Workstation } from './components/Scene2Workstation';
import { Scene3Robin } from './components/Scene3Robin';
import { PhotoComparisonModal } from './components/PhotoComparisonModal';
import { ResearchModal } from './components/ResearchModal';
import { Sliders, BookOpen } from 'lucide-react';

export default function App() {
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [telemetry, setTelemetry] = useState<TelemetryStats | null>(null);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState<boolean>(false);
  const [isResearchModalOpen, setIsResearchModalOpen] = useState<boolean>(false);
  const [showManualSlider, setShowManualSlider] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement | null>(null);

  // Monitor window scroll to calculate normalized progress (0.0 -> 1.0)
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll <= 0) return;
      const current = window.scrollY;
      const progress = Math.min(1, Math.max(0, current / totalScroll));
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Jump to specific scene helper
  const handleJumpToScene = useCallback((scene: 1 | 2 | 3) => {
    const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
    let target = 0;
    if (scene === 1) target = 0;
    if (scene === 2) target = totalScroll * 0.48;
    if (scene === 3) target = totalScroll * 0.95;

    window.scrollTo({ top: target, behavior: 'smooth' });
  }, []);

  // Calculate dynamic cross-fade opacities for the 3 scenes
  // Scene 1: 0% -> 35%
  // Scene 2: 35% -> 68%
  // Scene 3: 68% -> 100%
  const getScene1Opacity = () => {
    if (scrollProgress < 0.25) return 1;
    if (scrollProgress < 0.38) return 1 - (scrollProgress - 0.25) / 0.13;
    return 0;
  };

  const getScene2Opacity = () => {
    if (scrollProgress < 0.30) return 0;
    if (scrollProgress < 0.42) return (scrollProgress - 0.30) / 0.12;
    if (scrollProgress < 0.62) return 1;
    if (scrollProgress < 0.72) return 1 - (scrollProgress - 0.62) / 0.10;
    return 0;
  };

  const getScene3Opacity = () => {
    if (scrollProgress < 0.65) return 0;
    if (scrollProgress < 0.78) return (scrollProgress - 0.65) / 0.13;
    return 1;
  };

  const activeScene: 1 | 2 | 3 =
    scrollProgress > 0.65 ? 3 : scrollProgress > 0.32 ? 2 : 1;

  // Manual scrubber handler
  const handleManualScrub = (val: number) => {
    const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ top: val * totalScroll, behavior: 'auto' });
  };

  return (
    <div ref={containerRef} className="relative min-h-[400vh] bg-slate-950 text-white select-none">
      {/* 1. Pre-rendered Cinematic Canvas Layer (Hardware Accelerated 60fps) */}
      <CinematicCanvasScrubber
        progress={scrollProgress}
        onTelemetryUpdate={setTelemetry}
      />

      {/* 2. Top Header Navigation */}
      <Navigation
        activeScene={activeScene}
        onJumpToScene={handleJumpToScene}
        onOpenResearch={() => setIsResearchModalOpen(true)}
        onOpenPhotoModal={() => setIsPhotoModalOpen(true)}
      />

      {/* 3. Live VFX Performance HUD Telemetry */}
      <LiveTelemetry stats={telemetry} scrollProgress={scrollProgress} />

      {/* 4. Scene 1 Overlay: Avatar Waves & Says Hi */}
      <div className="fixed inset-0 pointer-events-none z-10">
        <Scene1Hero
          opacity={getScene1Opacity()}
          onOpenPhotoModal={() => setIsPhotoModalOpen(true)}
          onScrollToNext={() => handleJumpToScene(2)}
        />
      </div>

      {/* 5. Scene 2 Overlay: Avatar Turns and Sits at Workstation */}
      <div className="fixed inset-0 pointer-events-none z-10">
        <Scene2Workstation
          opacity={getScene2Opacity()}
          onScrollToNext={() => handleJumpToScene(3)}
        />
      </div>

      {/* 6. Scene 3 Overlay: Monitor Activates and Reveals Robin */}
      <div className="fixed inset-0 pointer-events-none z-10">
        <Scene3Robin opacity={getScene3Opacity()} />
      </div>

      {/* 7. Bottom Floating Interactive Controller */}
      <div className="fixed bottom-4 left-4 z-40 flex items-center gap-2">
        <button
          onClick={() => setShowManualSlider(!showManualSlider)}
          className="p-2.5 rounded-2xl bg-slate-900/90 border border-slate-700/80 text-cyan-400 hover:text-white shadow-xl backdrop-blur transition-all cursor-pointer flex items-center gap-2 text-xs font-mono"
          title="Toggle Manual Scrub Bar"
        >
          <Sliders className="w-4 h-4" />
          <span className="hidden sm:inline">Manual Scrubber</span>
        </button>

        {showManualSlider && (
          <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-slate-900/90 border border-cyan-500/30 shadow-xl backdrop-blur animate-fade-in font-mono text-xs">
            <span className="text-slate-400">Scrub:</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.005"
              value={scrollProgress}
              onChange={(e) => handleManualScrub(parseFloat(e.target.value))}
              className="w-36 sm:w-48 accent-cyan-400 cursor-ew-resize"
            />
            <span className="text-cyan-300 font-bold w-12 text-right">
              {Math.round(scrollProgress * 100)}%
            </span>
          </div>
        )}

        <button
          onClick={() => setIsResearchModalOpen(true)}
          className="p-2.5 rounded-2xl bg-purple-950/70 border border-purple-500/40 text-purple-300 hover:text-white shadow-xl backdrop-blur transition-all cursor-pointer flex items-center gap-2 text-xs font-mono"
        >
          <BookOpen className="w-4 h-4" />
          <span className="hidden md:inline">Research &amp; Trade-offs</span>
        </button>
      </div>

      {/* 8. Modals */}
      <PhotoComparisonModal
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
      />

      <ResearchModal
        isOpen={isResearchModalOpen}
        onClose={() => setIsResearchModalOpen(false)}
      />
    </div>
  );
}
