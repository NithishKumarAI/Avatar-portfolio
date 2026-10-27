import React from 'react';
import { BookOpen, UserCheck } from 'lucide-react';

interface NavigationProps {
  activeScene: 1 | 2 | 3;
  onJumpToScene: (scene: 1 | 2 | 3) => void;
  onOpenResearch: () => void;
  onOpenPhotoModal: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeScene,
  onJumpToScene,
  onOpenResearch,
  onOpenPhotoModal,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-30 px-4 md:px-8 py-3.5 card-blur border-b border-cyan-500/20 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/30 text-white font-black text-sm">
            N
          </div>
          <div>
            <div className="text-sm font-extrabold text-white tracking-wide flex items-center gap-2">
              <span>NITHISH KUMAR R</span>
              <span className="hidden sm:inline px-1.5 py-0.5 rounded text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                AI SYSTEMS
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono hidden md:block">
              Machine Learning • Autonomous Agents • Robin PA
            </div>
          </div>
        </div>

        {/* Scene Jump Nav */}
        <div className="hidden lg:flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800 font-mono text-xs">
          <button
            onClick={() => onJumpToScene(1)}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeScene === 1
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            01. Wave &amp; Hi
          </button>
          <button
            onClick={() => onJumpToScene(2)}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeScene === 2
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            02. Workstation
          </button>
          <button
            onClick={() => onJumpToScene(3)}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeScene === 3
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            03. Robin Reveal
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenResearch}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/80 text-xs font-mono transition-all cursor-pointer"
            title="View Research & Architecture Comparison"
          >
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Research Audit</span>
          </button>

          <button
            onClick={onOpenPhotoModal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-950/60 hover:bg-purple-900/60 text-purple-300 hover:text-white border border-purple-500/40 text-xs font-mono transition-all cursor-pointer"
            title="Inspect Photograph Resemblance"
          >
            <UserCheck className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden md:inline">Photo Resemblance</span>
          </button>

          <a
            href="https://github.com/NithishKumarAI/Portfolio"
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
            title="Reference GitHub Portfolio"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
          </a>
        </div>
      </div>
    </header>
  );
};
