import React, { useState } from 'react';
import { ExternalLink, Sparkles, Terminal, ChevronDown } from 'lucide-react';
import { GithubIcon } from './SocialIcons';

interface Scene4ProjectsProps {
  opacity: number;
  onScrollToNext: () => void;
}

interface ProjectData {
  id: string;
  title: string;
  category: string;
  badges: string[];
  description: string;
  metrics: { label: string; value: string }[];
  tags: string[];
  githubUrl: string;
  liveUrl?: string;
  isFlagship?: boolean;
}

const PROJECTS: ProjectData[] = [
  {
    id: 'robin',
    title: "Robin — Everyone's PA",
    category: 'Flagship Autonomous AI',
    badges: ['Windows PA', 'Semantic Memory', 'Speech Pipeline', 'Agentic Tools'],
    description:
      'An autonomous local-first personal AI assistant built for Windows. Features persistent semantic memory, voice interaction, system-level task automation, and private on-device reasoning.',
    metrics: [
      { label: 'Privacy Guarantee', value: '100% On-Device Offline' },
      { label: 'Speech Latency', value: '< 145ms Real-Time' },
      { label: 'Tool Execution', value: 'Multi-Agent Kernel' },
      { label: 'Memory Storage', value: 'Local SQLite + Vector' },
    ],
    tags: ['Python', 'FastAPI', 'PySide6 / Qt', 'Whisper.cpp', 'Ollama', 'Llama-3.3'],
    githubUrl: 'https://github.com/NithishKumarAI',
    liveUrl: 'https://robinpa.in',
    isFlagship: true,
  },
  {
    id: 'forge',
    title: 'Forge — Autonomous Code Refinement',
    category: 'Agentic Dev Tooling',
    badges: ['AST Self-Healing', 'Iterative Linting', 'Multi-Model Fallback'],
    description:
      'Autonomous code generation and refinement engine with iterative self-healing pipelines. Analyzes compile errors, constructs abstract syntax trees, and verifies solutions against test suites.',
    metrics: [
      { label: 'Self-Correction Rate', value: '88.4% First-Pass' },
      { label: 'Test Coverage', value: 'Automated Pytest' },
      { label: 'Supported Runtimes', value: 'Python, TypeScript, Go' },
    ],
    tags: ['LangGraph', 'Python', 'Docker Sandboxing', 'Tree-Sitter'],
    githubUrl: 'https://github.com/NithishKumarAI',
  },
  {
    id: 'memory-engine',
    title: 'Cognitive Memory Engine',
    category: 'Memory Systems & RAG',
    badges: ['Episodic Clustering', 'Recency Decay', 'Hierarchical Vector Recall'],
    description:
      'Hierarchical semantic vector memory layer with episodic clustering and recency decay. Equips long-running AI agents with human-like memory consolidation and fast associative recall.',
    metrics: [
      { label: 'Retrieval p95', value: '14.2ms Latency' },
      { label: 'Decay Function', value: 'Half-Life Exponential' },
      { label: 'Index Architecture', value: 'HNSW + Cosine' },
    ],
    tags: ['PostgreSQL', 'pgvector', 'FastAPI', 'Sentence-Transformers'],
    githubUrl: 'https://github.com/NithishKumarAI',
  },
  {
    id: 'eta-prediction',
    title: 'Food Delivery ETA Prediction',
    category: 'Predictive Machine Learning',
    badges: ['Spatio-Temporal Features', 'Ensemble Models', 'Real-Time Serving'],
    description:
      'Real-time spatio-temporal predictive model engineered with XGBoost, LightGBM, and FastAPI serving. Predicts hyper-local order dispatch times under high-density urban traffic variance.',
    metrics: [
      { label: 'MAE Improvement', value: '-22.6% Error Reduction' },
      { label: 'Inference Throughput', value: '2,400 req/sec' },
      { label: 'Feature Pipeline', value: 'Automated Feature Store' },
    ],
    tags: ['XGBoost', 'LightGBM', 'FastAPI', 'Redis', 'Docker'],
    githubUrl: 'https://github.com/NithishKumarAI',
  },
  {
    id: 'ai-diary',
    title: 'AI Diary Assistant',
    category: 'Reflective NLP Agent',
    badges: ['Sentiment Telemetry', 'Semantic Recall', 'Long-Horizon Reflection'],
    description:
      'Context-aware journaling agent with sentiment telemetry and semantic recall. Provides insightful longitudinal self-reflection, weekly emotional digests, and proactive cognitive check-ins.',
    metrics: [
      { label: 'Sentiment Precision', value: '94.1% F1 Score' },
      { label: 'Context Horizon', value: 'Multi-Month Recall' },
    ],
    tags: ['Next.js', 'FastAPI', 'Transformers', 'ChromaDB'],
    githubUrl: 'https://github.com/NithishKumarAI',
  },
];

export const Scene4Projects: React.FC<Scene4ProjectsProps> = ({ opacity, onScrollToNext }) => {
  const [selectedProject, setSelectedProject] = useState<string>('robin');

  if (opacity <= 0.01) return null;

  const current = PROJECTS.find((p) => p.id === selectedProject) || PROJECTS[0];

  return (
    <div
      className="absolute inset-0 flex flex-col justify-between p-6 md:p-12 transition-opacity duration-300 pointer-events-none z-10"
      style={{ opacity }}
    >
      {/* Top Protocol Status Bar */}
      <div className="flex items-center justify-between w-full max-w-7xl mx-auto pt-16">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-purple-500/50 text-purple-300 text-xs font-mono tracking-wider backdrop-blur pointer-events-auto shadow-lg shadow-purple-950/50">
          <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
          <span>SCENE 04 // FLAGSHIP PROJECT SHOWCASE</span>
        </div>

        <div className="hidden sm:inline-flex items-center gap-2 text-xs font-mono text-cyan-400">
          <Terminal className="w-3.5 h-3.5" />
          <span>WORKSTATION CONSOLE: 5 SYSTEMS DEPLOYED</span>
        </div>
      </div>

      {/* Main Right-Side Project Showcase Panel */}
      <div className="w-full max-w-2xl ml-auto mr-4 md:mr-12 pointer-events-auto space-y-4 my-auto">
        {/* Project Selector Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950/80 border border-slate-800 overflow-x-auto scrollbar-none backdrop-blur">
          {PROJECTS.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedProject(p.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-all cursor-pointer ${
                selectedProject === p.id
                  ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              {p.id === 'robin' ? '★ Robin (Flagship)' : p.title.split('—')[0].trim()}
            </button>
          ))}
        </div>

        {/* Active Project Card */}
        <div className="bg-slate-950/90 p-6 md:p-7 rounded-2xl border border-purple-500/35 backdrop-blur-xl shadow-2xl shadow-purple-950/70 space-y-5 relative overflow-hidden">
          {/* Subtle Accent Glow */}
          <div className="absolute -top-20 -right-20 w-52 h-52 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-52 h-52 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none" />

          {/* Header Row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-purple-500/20 pb-4 relative z-10">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-widest">
                  {current.category}
                </span>
                {current.isFlagship && (
                  <span className="px-2 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-[10px] font-mono uppercase font-bold">
                    Flagship Windows PA
                  </span>
                )}
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mt-1">
                {current.title}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              {current.liveUrl && (
                <a
                  href={current.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md transition-all cursor-pointer"
                >
                  <span>Visit Site</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
              <a
                href={current.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-mono transition-all cursor-pointer"
              >
                <GithubIcon className="w-3.5 h-3.5 text-purple-400" />
                <span>Repo</span>
              </a>
            </div>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-1.5">
            {current.badges.map((b) => (
              <span
                key={b}
                className="px-2.5 py-0.5 rounded-md bg-purple-950/70 border border-purple-500/30 text-purple-300 text-[11px] font-mono"
              >
                {b}
              </span>
            ))}
          </div>

          {/* Description */}
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            {current.description}
          </p>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-2.5 pt-1 text-xs font-mono">
            {current.metrics.map((m, idx) => (
              <div key={idx} className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800/80">
                <div className="text-slate-400 text-[10px] uppercase">{m.label}</div>
                <div className="text-cyan-300 font-bold mt-0.5">{m.value}</div>
              </div>
            ))}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {current.tags.map((t) => (
              <span
                key={t}
                className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-400 text-[10px] font-mono"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Scroll Prompt */}
      <div className="flex flex-col items-center justify-center gap-1.5 pb-6 w-full pointer-events-auto">
        <button
          onClick={onScrollToNext}
          className="flex flex-col items-center gap-1 text-slate-400 hover:text-purple-400 transition-colors group cursor-pointer"
        >
          <span className="text-xs font-mono tracking-widest uppercase flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-purple-400" />
            Scroll to Technical Toolkit, Journey &amp; Contact
          </span>
          <ChevronDown className="w-4 h-4 animate-bounce text-purple-400 group-hover:translate-y-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
