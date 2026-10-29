import React from 'react';
import { Terminal, ChevronDown, Download, Sparkles, ExternalLink } from 'lucide-react';
import { GithubIcon } from './SocialIcons';
import type { CharacterType } from '../three/CharacterModel';

interface Scene1HeroProps {
  opacity: number;
  characterType: CharacterType;
  onToggleCharacter: (type: CharacterType) => void;
  onScrollToNext: () => void;
}

export const Scene1Hero: React.FC<Scene1HeroProps> = ({
  opacity,
  characterType,
  onToggleCharacter,
  onScrollToNext,
}) => {
  if (opacity <= 0.01) return null;

  return (
    <div
      className="absolute inset-0 flex flex-col justify-between p-6 md:p-12 transition-opacity duration-300 pointer-events-none z-10"
      style={{ opacity }}
    >
      {/* Top Protocol Status Bar */}
      <div className="flex items-center justify-between w-full max-w-7xl mx-auto pt-16">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-cyan-500/30 text-cyan-400 text-xs font-mono tracking-wider backdrop-blur pointer-events-auto">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <Terminal className="w-3.5 h-3.5" />
          <span>REAL-TIME 3D RIGGED HUMANOID • ACTIVE</span>
        </div>

        {/* Avatar Model Selector */}
        <div className="flex items-center gap-1.5 p-1 rounded-full bg-slate-900/90 border border-slate-700/80 backdrop-blur pointer-events-auto">
          <button
            onClick={() => onToggleCharacter('humanoid')}
            className={`px-3 py-1 rounded-full text-xs font-mono transition-all cursor-pointer ${
              characterType === 'humanoid'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Humanoid Rig (Xbot)
          </button>
          <button
            onClick={() => onToggleCharacter('cyber')}
            className={`px-3 py-1 rounded-full text-xs font-mono transition-all cursor-pointer ${
              characterType === 'cyber'
                ? 'bg-purple-500 text-white font-bold shadow-md shadow-purple-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Cyber Rig
          </button>
        </div>
      </div>

      {/* Main Left-Side Hero Information Block */}
      <div className="w-full max-w-2xl mx-auto md:mx-0 md:ml-12 pointer-events-auto space-y-6">
        <div className="inline-flex items-center gap-2 text-cyan-400 font-mono text-xs tracking-widest uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
          <span>Scene 01 // Welcome Protocol</span>
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white drop-shadow-2xl">
            NITHISH KUMAR R
          </h1>

          {/* 4 Professional Roles */}
          <div className="flex flex-wrap gap-2 pt-1">
            {[
              'AI Engineer',
              'LLM & Agentic AI Developer',
              'Python Backend Engineer',
              'Aspiring AI Research Scientist',
            ].map((role) => (
              <span
                key={role}
                className="px-2.5 py-1 rounded-lg bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-medium backdrop-blur"
              >
                {role}
              </span>
            ))}
          </div>
        </div>

        {/* Short Introduction */}
        <p className="text-base sm:text-lg text-slate-300 leading-relaxed drop-shadow bg-slate-950/75 p-5 rounded-2xl border border-white/10 backdrop-blur-md">
          I build intelligent AI systems, autonomous assistants, and practical machine learning applications.
        </p>

        {/* Buttons Row */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={onScrollToNext}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-400 hover:from-cyan-400 hover:to-sky-300 text-slate-950 font-bold text-xs font-mono shadow-lg shadow-cyan-500/25 transition-all cursor-pointer transform hover:-translate-y-0.5"
          >
            <Sparkles className="w-4 h-4" />
            <span>Explore My Work</span>
          </button>

          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 hover:border-cyan-400 text-white font-mono text-xs font-semibold shadow-md transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Download Resume</span>
          </a>

          <a
            href="https://github.com/NithishKumarAI"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 hover:border-purple-400 text-white font-mono text-xs font-semibold shadow-md transition-all cursor-pointer"
          >
            <GithubIcon className="w-3.5 h-3.5 text-purple-400" />
            <span>GitHub</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
        </div>
      </div>

      {/* Bottom Scroll Prompt */}
      <div className="flex flex-col items-center justify-center gap-1.5 pb-6 w-full pointer-events-auto">
        <button
          onClick={onScrollToNext}
          className="flex flex-col items-center gap-1 text-slate-400 hover:text-cyan-400 transition-colors group cursor-pointer"
        >
          <span className="text-xs font-mono tracking-widest uppercase flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            Scroll to follow avatar &amp; explore
          </span>
          <ChevronDown className="w-4 h-4 animate-bounce text-cyan-400 group-hover:translate-y-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
