import React, { useState, useEffect } from 'react';
import { Terminal, Cpu, Database, Server, Code, Sparkles, ChevronDown } from 'lucide-react';

interface Scene2WorkstationProps {
  opacity: number;
  onScrollToNext: () => void;
}

const TERMINAL_LOGS = [
  'INITIALIZING WORKSTATION RIG: RTX 4090 / CUDA 12.4',
  'LOADING LOCAL EMBEDDING PIPELINE: BAAI/bge-large-en-v1.5',
  'CONNECTING VECTOR STORE: PostgreSQL 18 + pgvector (HNSW Index)',
  'CALCULATING COSINE DISTANCE: query_emb <-> corpus_matrix [768-D]',
  'ROUTING INFERENCE ENGINE: Ollama / Llama-3.3-70B fallback to Gemini-2.5-Flash',
  'MEMORY LATENCY BENCHMARK: 14.2ms p95 semantic retrieval',
  'SYSTEM READY: LOCAL AGENT BOUNDARY ACTIVATED.',
];

export const Scene2Workstation: React.FC<Scene2WorkstationProps> = ({
  opacity,
  onScrollToNext,
}) => {
  const [activeTab, setActiveTab] = useState<'terminal' | 'stack'>('terminal');
  const [displayedLogs, setDisplayedLogs] = useState<string[]>([]);

  useEffect(() => {
    if (opacity < 0.2) return;
    let i = 0;
    const interval = setInterval(() => {
      if (i < TERMINAL_LOGS.length) {
        setDisplayedLogs(TERMINAL_LOGS.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 400);

    return () => clearInterval(interval);
  }, [opacity]);

  if (opacity <= 0.01) return null;

  return (
    <div
      className="absolute inset-0 flex flex-col justify-between p-6 md:p-12 transition-opacity duration-200 pointer-events-none"
      style={{ opacity }}
    >
      {/* Top indicator */}
      <div className="w-full max-w-7xl mx-auto pt-16 flex justify-between items-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 text-xs font-mono tracking-wider backdrop-blur pointer-events-auto">
          <Cpu className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
          <span>SCENE 02 // WORKSTATION INITIALIZATION</span>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-400">
          <Server className="w-3.5 h-3.5 text-purple-400" />
          <span>HOST: NITHISH-LAB-01</span>
        </div>
      </div>

      {/* Center workstation HUD panel */}
      <div className="w-full max-w-2xl ml-auto mr-4 md:mr-16 pointer-events-auto space-y-4">
        <div className="card-blur rounded-2xl border border-cyan-500/30 overflow-hidden shadow-2xl shadow-cyan-950/60">
          {/* Header tabs */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/90 border-b border-cyan-500/20 text-xs font-mono">
            <div className="flex items-center gap-2 text-cyan-300">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span>avatar_rig@dev:~/inference</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('terminal')}
                className={`px-2.5 py-1 rounded text-xs transition-colors ${
                  activeTab === 'terminal'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Agent Stream
              </button>
              <button
                onClick={() => setActiveTab('stack')}
                className={`px-2.5 py-1 rounded text-xs transition-colors ${
                  activeTab === 'stack'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                ML Stack
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="p-4 bg-slate-950/90 min-h-[180px] font-mono text-xs">
            {activeTab === 'terminal' ? (
              <div className="space-y-1.5 text-slate-300">
                {displayedLogs.map((log, idx) => (
                  <div key={idx} className="flex items-start gap-2 leading-relaxed">
                    <span className="text-cyan-500 select-none">&gt;</span>
                    <span
                      className={
                        idx === displayedLogs.length - 1 ? 'text-cyan-300 font-semibold' : ''
                      }
                    >
                      {log}
                    </span>
                  </div>
                ))}
                {displayedLogs.length < TERMINAL_LOGS.length && (
                  <div className="w-2 h-4 bg-cyan-400 animate-pulse inline-block ml-4" />
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-900/70 border border-slate-800">
                  <div className="flex items-center gap-1.5 text-cyan-400 font-semibold mb-1">
                    <Database className="w-3.5 h-3.5" /> Vector Retrieval
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    pgvector, HNSW, cosine ranking for long-term agent episodic memory.
                  </p>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-900/70 border border-slate-800">
                  <div className="flex items-center gap-1.5 text-purple-400 font-semibold mb-1">
                    <Code className="w-3.5 h-3.5" /> Multi-Model Routing
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    Hybrid offline/cloud routing balancing latency, cost, and task complexity.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <p className="text-xs text-slate-400 font-mono text-right flex items-center justify-end gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          Seated at dual-screen curved console • Initializing flagship agent
        </p>
      </div>

      {/* Bottom prompt */}
      <div className="flex flex-col items-center justify-center gap-2 pb-6 w-full pointer-events-auto">
        <button
          onClick={onScrollToNext}
          className="flex flex-col items-center gap-1 text-slate-400 hover:text-cyan-400 transition-colors group cursor-pointer"
        >
          <span className="text-xs font-mono tracking-widest uppercase flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-purple-400" />
            Scroll down to power up Robin
          </span>
          <ChevronDown className="w-5 h-5 animate-bounce text-purple-400 group-hover:translate-y-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
