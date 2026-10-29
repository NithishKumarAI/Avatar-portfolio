import React from 'react';
import { Bot, Brain, Database, Sparkles, ChevronDown } from 'lucide-react';

interface Scene2AboutProps {
  opacity: number;
  onScrollToNext: () => void;
}

export const Scene2About: React.FC<Scene2AboutProps> = ({ opacity, onScrollToNext }) => {
  if (opacity <= 0.01) return null;

  return (
    <div
      className="absolute inset-0 flex flex-col justify-between p-6 md:p-12 transition-opacity duration-300 pointer-events-none z-10"
      style={{ opacity }}
    >
      {/* Top Protocol Status Bar */}
      <div className="flex items-center justify-between w-full max-w-7xl mx-auto pt-16">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-cyan-500/30 text-cyan-400 text-xs font-mono tracking-wider backdrop-blur pointer-events-auto">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>SCENE 02 // CHARACTER TRAVERSAL &amp; ARCHITECTURE</span>
        </div>

        <div className="hidden sm:inline-flex items-center gap-2 text-xs font-mono text-slate-400">
          <span>COORDINATES: WORKSTATION APPROACH</span>
        </div>
      </div>

      {/* Main Right-Side About Me & What I Build Block */}
      <div className="w-full max-w-2xl ml-auto mr-4 md:mr-12 pointer-events-auto space-y-5 my-auto">
        <div className="inline-flex items-center gap-2 text-cyan-400 font-mono text-xs tracking-widest uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
          <span>Scene 02 // About Me &amp; Philosophy</span>
        </div>

        <div className="space-y-3 bg-slate-950/80 p-6 rounded-2xl border border-cyan-500/20 backdrop-blur-md shadow-2xl">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Engineering Autonomous Intelligence
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            AI Engineer focused on autonomous agents, multi-agent orchestrations, local LLM architectures, and robust backend engineering.
          </p>
        </div>

        {/* What I Build - 3 Distinct Cards */}
        <div className="space-y-3">
          <h3 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest px-1">
            What I Build
          </h3>

          <div className="grid grid-cols-1 gap-3">
            {/* Card 1: AI Agents */}
            <div className="p-4 rounded-xl bg-slate-900/85 border border-cyan-500/30 hover:border-cyan-400/60 transition-all backdrop-blur shadow-lg group">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 group-hover:scale-105 transition-transform">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                    AI Agents &amp; Autonomous Workflows
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Multi-agent systems, task planning, self-correcting execution pipelines, tool integration, and deterministic state machines.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2: LLM Apps & Memory */}
            <div className="p-4 rounded-xl bg-slate-900/85 border border-purple-500/30 hover:border-purple-400/60 transition-all backdrop-blur shadow-lg group">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 group-hover:scale-105 transition-transform">
                  <Brain className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
                    LLM Applications &amp; Memory Systems
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Context-aware architectures, retrieval augmentation, semantic memory, persistent agent recall, and hybrid search with pgvector/Qdrant.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 3: ML & Backend */}
            <div className="p-4 rounded-xl bg-slate-900/85 border border-sky-500/30 hover:border-sky-400/60 transition-all backdrop-blur shadow-lg group">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400 group-hover:scale-105 transition-transform">
                  <Database className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white group-hover:text-sky-300 transition-colors">
                    Machine Learning &amp; Backend Systems
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Scalable Python architectures, real-time streaming, telemetry instrumentation, low-latency APIs, and production Docker pipelines.
                  </p>
                </div>
              </div>
            </div>
          </div>
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
            Scroll to workstation seating transition
          </span>
          <ChevronDown className="w-4 h-4 animate-bounce text-cyan-400 group-hover:translate-y-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
