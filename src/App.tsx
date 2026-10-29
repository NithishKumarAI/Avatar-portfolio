import { useState, useEffect, useRef, useCallback } from 'react';
import { ThreeCanvas } from './components/ThreeCanvas';
import { Navigation } from './components/Navigation';
import { LiveTelemetry } from './components/LiveTelemetry';
import { Scene1Hero } from './components/Scene1Hero';
import { Scene2About } from './components/Scene2About';
import { Scene3WorkstationEnter } from './components/Scene3WorkstationEnter';
import { Scene4Projects } from './components/Scene4Projects';
import { Scene5ToolkitJourneyContact } from './components/Scene5ToolkitJourneyContact';
import { PhotoComparisonModal } from './components/PhotoComparisonModal';
import { ResearchModal } from './components/ResearchModal';
import type { WorldTelemetry } from './three/PortfolioWorld';
import type { CharacterType } from './three/CharacterModel';
import { Sliders, BookOpen } from 'lucide-react';

export default function App() {
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [scrollDirection, setScrollDirection] = useState<'forward' | 'reverse' | 'idle'>('idle');
  const [telemetry, setTelemetry] = useState<WorldTelemetry | null>(null);
  const [characterType, setCharacterType] = useState<CharacterType>('humanoid');
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState<boolean>(false);
  const [isResearchModalOpen, setIsResearchModalOpen] = useState<boolean>(false);
  const [showManualSlider, setShowManualSlider] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const lastScrollY = useRef<number>(0);
  const idleTimer = useRef<number | null>(null);

  // Monitor native page scroll to calculate normalized progress (0.0 -> 1.0)
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll <= 0) return;
      const current = window.scrollY;
      const progress = Math.min(1, Math.max(0, current / totalScroll));
      setScrollProgress(progress);

      // Detect scroll direction
      if (current > lastScrollY.current + 2) {
        setScrollDirection('forward');
      } else if (current < lastScrollY.current - 2) {
        setScrollDirection('reverse');
      }
      lastScrollY.current = current;

      if (idleTimer.current) window.clearTimeout(idleTimer.current);
      idleTimer.current = window.setTimeout(() => {
        setScrollDirection('idle');
      }, 250);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (idleTimer.current) window.clearTimeout(idleTimer.current);
    };
  }, []);

  // Jump to specific progress position
  const handleJumpToProgress = useCallback((targetProgress: number) => {
    const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
    const targetY = targetProgress * totalScroll;
    window.scrollTo({ top: targetY, behavior: 'smooth' });
  }, []);

  // Calculate dynamic opacities for the sequential scene overlays
  const getScene1Opacity = () => {
    if (scrollProgress < 0.18) return 1;
    if (scrollProgress < 0.25) return 1 - (scrollProgress - 0.18) / 0.07;
    return 0;
  };

  const getScene2Opacity = () => {
    if (scrollProgress < 0.20) return 0;
    if (scrollProgress < 0.27) return (scrollProgress - 0.20) / 0.07;
    if (scrollProgress < 0.42) return 1;
    if (scrollProgress < 0.48) return 1 - (scrollProgress - 0.42) / 0.06;
    return 0;
  };

  const getScene3Opacity = () => {
    if (scrollProgress < 0.45) return 0;
    if (scrollProgress < 0.52) return (scrollProgress - 0.45) / 0.07;
    if (scrollProgress < 0.62) return 1;
    if (scrollProgress < 0.68) return 1 - (scrollProgress - 0.62) / 0.06;
    return 0;
  };

  const getScene4Opacity = () => {
    if (scrollProgress < 0.65) return 0;
    if (scrollProgress < 0.71) return (scrollProgress - 0.65) / 0.06;
    if (scrollProgress < 0.83) return 1;
    if (scrollProgress < 0.88) return 1 - (scrollProgress - 0.83) / 0.05;
    return 0;
  };

  const getScene5Opacity = () => {
    if (scrollProgress < 0.85) return 0;
    if (scrollProgress < 0.90) return (scrollProgress - 0.85) / 0.05;
    return 1;
  };

  // Determine active chapter for navigation
  const activeChapter: 'home' | 'about' | 'workstation' | 'projects' | 'toolkit' | 'contact' =
    scrollProgress >= 0.96
      ? 'contact'
      : scrollProgress >= 0.85
      ? 'toolkit'
      : scrollProgress >= 0.65
      ? 'projects'
      : scrollProgress >= 0.45
      ? 'workstation'
      : scrollProgress >= 0.20
      ? 'about'
      : 'home';

  // Manual scrubber handler
  const handleManualScrub = (val: number) => {
    const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ top: val * totalScroll, behavior: 'auto' });
  };

  return (
    <div ref={containerRef} className="relative min-h-[550vh] bg-slate-950 text-white select-none">
      {/* 1. Real-Time Hardware-Accelerated 3D WebGL Canvas Layer */}
      <ThreeCanvas
        progress={scrollProgress}
        characterType={characterType}
        onTelemetryUpdate={setTelemetry}
      />

      {/* 2. Top Header Navigation */}
      <Navigation
        activeChapter={activeChapter}
        onJumpToProgress={handleJumpToProgress}
        characterType={characterType}
        onToggleCharacter={setCharacterType}
        onOpenResearch={() => setIsResearchModalOpen(true)}
      />

      {/* 3. Live 3D WebGL Telemetry HUD */}
      <LiveTelemetry
        stats={telemetry}
        scrollProgress={scrollProgress}
        scrollDirection={scrollDirection}
        characterType={characterType}
      />

      {/* 4. Scene 1 Overlay: Avatar Waves & Says Hi (Left Content, Right Character) */}
      <div className="fixed inset-0 pointer-events-none z-10">
        <Scene1Hero
          opacity={getScene1Opacity()}
          characterType={characterType}
          onToggleCharacter={setCharacterType}
          onScrollToNext={() => handleJumpToProgress(0.32)}
        />
      </div>

      {/* 5. Scene 2 Overlay: Walking & About Me (Left Character, Right Content) */}
      <div className="fixed inset-0 pointer-events-none z-10">
        <Scene2About
          opacity={getScene2Opacity()}
          onScrollToNext={() => handleJumpToProgress(0.55)}
        />
      </div>

      {/* 6. Scene 3 Overlay: Workstation Transition & Sitting */}
      <div className="fixed inset-0 pointer-events-none z-10">
        <Scene3WorkstationEnter
          opacity={getScene3Opacity()}
          onScrollToNext={() => handleJumpToProgress(0.74)}
        />
      </div>

      {/* 7. Scene 4 Overlay: Flagship Project Showcase (Robin, Forge, Memory Engine, etc.) */}
      <div className="fixed inset-0 pointer-events-none z-10">
        <Scene4Projects
          opacity={getScene4Opacity()}
          onScrollToNext={() => handleJumpToProgress(0.90)}
        />
      </div>

      {/* 8. Scene 5 Overlay: Technical Toolkit, Journey & Contact */}
      <div className="fixed inset-0 pointer-events-none z-10">
        <Scene5ToolkitJourneyContact opacity={getScene5Opacity()} />
      </div>

      {/* 9. Bottom Floating Interactive Controller */}
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
              step="0.002"
              value={scrollProgress}
              onChange={(e) => handleManualScrub(parseFloat(e.target.value))}
              className="w-36 sm:w-56 accent-cyan-400 cursor-ew-resize"
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

      {/* 10. Modals */}
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
