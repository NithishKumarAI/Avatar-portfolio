import React from 'react';
import { BookOpen, VolumeX, Eye } from 'lucide-react';
import type { CharacterType } from '../three/CharacterModel';

interface NavigationProps {
  activeChapter: 'home' | 'about' | 'workstation' | 'projects' | 'toolkit' | 'contact';
  onJumpToProgress: (p: number) => void;
  characterType: CharacterType;
  onToggleCharacter: (type: CharacterType) => void;
  onOpenResearch: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeChapter,
  onJumpToProgress,
  characterType,
  onToggleCharacter,
  onOpenResearch,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-30 px-4 md:px-8 py-3 bg-slate-950/80 border-b border-cyan-500/20 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand */}
        <div
          onClick={() => onJumpToProgress(0)}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/30 text-white font-black text-sm group-hover:scale-105 transition-transform">
            N
          </div>
          <div>
            <div className="text-sm font-extrabold text-white tracking-wide flex items-center gap-2">
              <span>NITHISH KUMAR R</span>
              <span className="hidden sm:inline px-1.5 py-0.5 rounded text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                AI ENGINEER
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono hidden md:block">
              Real-Time 3D Interactive Portfolio // V3
            </div>
          </div>
        </div>

        {/* Chapter Jump Nav Pills */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 font-mono text-xs">
          {[
            { id: 'home', label: 'Home', p: 0.0 },
            { id: 'about', label: 'About Me', p: 0.32 },
            { id: 'workstation', label: 'Workstation', p: 0.55 },
            { id: 'projects', label: 'Projects', p: 0.75 },
            { id: 'toolkit', label: 'Toolkit & Journey', p: 0.90 },
            { id: 'contact', label: 'Contact', p: 0.98 },
          ].map((ch) => (
            <button
              key={ch.id}
              onClick={() => onJumpToProgress(ch.p)}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeChapter === ch.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {ch.label}
            </button>
          ))}
        </nav>

        {/* Controls & Modals */}
        <div className="flex items-center gap-2">
          {/* Quick Model Selector in Header */}
          <button
            onClick={() => onToggleCharacter(characterType === 'humanoid' ? 'cyber' : 'humanoid')}
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-xs font-mono text-slate-300 transition-all cursor-pointer"
            title="Toggle Character Model (Humanoid Xbot / Cyber)"
          >
            <Eye className="w-3.5 h-3.5 text-cyan-400" />
            <span>Rig: {characterType === 'humanoid' ? 'Humanoid' : 'Cyber'}</span>
          </button>

          {/* Research Architecture Button */}
          <button
            onClick={onOpenResearch}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/80 text-xs font-mono transition-all cursor-pointer"
            title="View Architecture & Verification Audit"
          >
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Audit</span>
          </button>

          {/* Audio Indicator (Disabled / Muted) */}
          <div
            className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-500 cursor-not-allowed"
            title="Audio disabled per system constraints"
          >
            <VolumeX className="w-3.5 h-3.5" />
          </div>

          {/* GitHub Repo */}
          <a
            href="https://github.com/NithishKumarAI"
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
            title="Nithish Kumar GitHub"
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
