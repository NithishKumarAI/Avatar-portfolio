import React from 'react';
import { Sparkles, Terminal, ChevronDown, UserCheck, ShieldCheck } from 'lucide-react';

interface Scene1HeroProps {
  opacity: number;
  onOpenPhotoModal: () => void;
  onScrollToNext: () => void;
}

export const Scene1Hero: React.FC<Scene1HeroProps> = ({
  opacity,
  onOpenPhotoModal,
  onScrollToNext,
}) => {
  if (opacity <= 0.01) return null;

  return (
    <div
      className="absolute inset-0 flex flex-col justify-between p-6 md:p-12 transition-opacity duration-200 pointer-events-none"
      style={{ opacity }}
    >
      {/* Top status bar */}
      <div className="flex items-center justify-between w-full max-w-7xl mx-auto pt-16">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-400 text-xs font-mono tracking-wider backdrop-blur pointer-events-auto">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>NEURAL AVATAR V1.0 • RESEMBLANCE VERIFIED</span>
        </div>

        <button
          onClick={onOpenPhotoModal}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-950/60 border border-purple-500/40 text-purple-300 hover:text-white hover:bg-purple-900/60 transition-all text-xs font-mono backdrop-blur pointer-events-auto shadow-lg hover:shadow-purple-500/20"
        >
          <UserCheck className="w-3.5 h-3.5 text-purple-400" />
          <span>Compare With Real Photo</span>
        </button>
      </div>

      {/* Main hero title & greetings */}
      <div className="w-full max-w-4xl mx-auto space-y-6 pointer-events-auto">
        <div className="inline-flex items-center gap-2 text-cyan-400 font-mono text-sm tracking-widest uppercase">
          <Terminal className="w-4 h-4" />
          <span>Scene 01 // Welcome Protocol</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white drop-shadow-2xl">
          Hi, I'm{' '}
          <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-purple-400 bg-clip-text text-transparent">
            Nithish Kumar
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-slate-300 max-w-2xl leading-relaxed drop-shadow card-blur p-4 rounded-2xl border border-white/10">
          AI Engineer & Machine Learning Researcher focused on{' '}
          <span className="text-cyan-300 font-semibold">LLMs, retrieval systems, and local autonomous agents</span>.
          Building production-grade intelligent systems that think, reason, and adapt.
        </p>

        {/* Action row with Resume Link */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono shadow-lg shadow-cyan-500/25 transition-all cursor-pointer"
          >
            <span>View Resume (PDF)</span>
          </a>

          {['RAG Architectures', 'pgvector & HNSW', 'Local Agent Runtimes', 'FastAPI & Next.js', 'PyTorch & Transformers'].map(
            (tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-md bg-slate-900/80 border border-slate-700/60 text-slate-300 text-xs font-mono backdrop-blur"
              >
                {tag}
              </span>
            )
          )}
        </div>
      </div>

      {/* Bottom prompt to scroll */}
      <div className="flex flex-col items-center justify-center gap-2 pb-6 w-full pointer-events-auto">
        <button
          onClick={onScrollToNext}
          className="flex flex-col items-center gap-1 text-slate-400 hover:text-cyan-400 transition-colors group cursor-pointer"
        >
          <span className="text-xs font-mono tracking-widest uppercase flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            Scroll down to enter workstation
          </span>
          <ChevronDown className="w-5 h-5 animate-bounce text-cyan-400 group-hover:translate-y-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
