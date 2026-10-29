import React, { useState } from 'react';
import {
  Code,
  Terminal,
  Cpu,
  Database,
  GraduationCap,
  Award,
  Mail,
  Download,
  Send,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';
import { GithubIcon } from './SocialIcons';

interface Scene5Props {
  opacity: number;
}

export const Scene5ToolkitJourneyContact: React.FC<Scene5Props> = ({ opacity }) => {
  const [activeTab, setActiveTab] = useState<'toolkit' | 'journey' | 'research' | 'contact'>('toolkit');
  const [contactSent, setContactSent] = useState(false);
  const [message, setMessage] = useState('');

  if (opacity <= 0.01) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setContactSent(true);
    setTimeout(() => {
      setMessage('');
      setContactSent(false);
    }, 4000);
  };

  return (
    <div
      className="absolute inset-0 flex flex-col justify-between p-6 md:p-12 transition-opacity duration-300 pointer-events-none z-10"
      style={{ opacity }}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between w-full max-w-7xl mx-auto pt-16">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-cyan-500/30 text-cyan-400 text-xs font-mono tracking-wider backdrop-blur pointer-events-auto">
          <Terminal className="w-3.5 h-3.5" />
          <span>SCENE 05 // ECOSYSTEM, JOURNEY &amp; CONTACT</span>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900/90 border border-slate-700 backdrop-blur pointer-events-auto">
          {[
            { id: 'toolkit', label: 'Technical Toolkit' },
            { id: 'journey', label: 'Journey' },
            { id: 'research', label: 'Research' },
            { id: 'contact', label: 'Connect' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="w-full max-w-4xl mx-auto pointer-events-auto my-auto space-y-4">
        {/* TAB 1: TECHNICAL TOOLKIT */}
        {activeTab === 'toolkit' && (
          <div className="bg-slate-950/90 p-6 md:p-8 rounded-2xl border border-cyan-500/30 backdrop-blur-xl shadow-2xl space-y-6">
            <div>
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">
                Core Competencies &amp; Infrastructure
              </span>
              <h3 className="text-2xl font-extrabold text-white mt-1">
                Technical Toolkit
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Category 1: AI & ML */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-cyan-500/20 space-y-3">
                <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                  <Cpu className="w-4 h-4" />
                  <span>AI &amp; Machine Learning</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'PyTorch',
                    'Hugging Face',
                    'Transformers',
                    'LangChain',
                    'LangGraph',
                    'LlamaIndex',
                    'Ollama / vLLM',
                    'bge-large embeddings',
                    'XGBoost & LightGBM',
                  ].map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-[11px] font-mono"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Category 2: Backend & Cloud */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-purple-500/20 space-y-3">
                <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
                  <Database className="w-4 h-4" />
                  <span>Backend &amp; Storage</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'Python 3.12+',
                    'FastAPI',
                    'PostgreSQL + pgvector',
                    'Redis',
                    'Qdrant',
                    'ChromaDB',
                    'Docker',
                    'AWS (EC2, S3)',
                    'Linux Runtimes',
                  ].map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 rounded bg-purple-950/60 border border-purple-500/30 text-purple-300 text-[11px] font-mono"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Category 3: Architecture & Tools */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-sky-500/20 space-y-3">
                <div className="flex items-center gap-2 text-sky-400 font-bold text-sm">
                  <Code className="w-4 h-4" />
                  <span>Architecture &amp; Tools</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'Multi-Agent Workflows',
                    'Hybrid Semantic Search',
                    'HNSW Vector Indexing',
                    'Microservice Architecture',
                    'Git & CI/CD Pipelines',
                    'REST & WebSockets',
                    'Telemetry & Profiling',
                  ].map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 rounded bg-sky-950/60 border border-sky-500/30 text-sky-300 text-[11px] font-mono"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: JOURNEY & MILESTONES */}
        {activeTab === 'journey' && (
          <div className="bg-slate-950/90 p-6 md:p-8 rounded-2xl border border-cyan-500/30 backdrop-blur-xl shadow-2xl space-y-6">
            <div>
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">
                Career Milestones &amp; Evolution
              </span>
              <h3 className="text-2xl font-extrabold text-white mt-1">
                Engineering Journey
              </h3>
            </div>

            <div className="space-y-4">
              {[
                {
                  period: '2024 — Present',
                  role: 'Flagship AI Systems & Autonomous Agents',
                  company: 'Robin Personal AI & Open Source',
                  desc: 'Architecting Robin: a local-first personal assistant for Windows with zero cloud latency and semantic memory engines. Building scalable microservices and agent tooling.',
                },
                {
                  period: '2023 — 2024',
                  role: 'AI / ML Engineer & Researcher',
                  company: 'Machine Learning Pipelines & Research',
                  desc: 'Designed high-throughput inference endpoints, vector retrieval with pgvector, and tabular predictive algorithms for real-time delivery logistics.',
                },
                {
                  period: '2020 — 2024',
                  role: 'Bachelor of Engineering in Computer Science & AI',
                  company: 'Academic Foundations',
                  desc: 'Specialized in machine learning algorithms, deep learning, distributed backend systems, and statistical mathematics.',
                },
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4 p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="w-2 rounded bg-cyan-400 shrink-0" />
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-base font-bold text-white">{item.role}</h4>
                      <span className="text-xs font-mono text-cyan-400">{item.period}</span>
                    </div>
                    <div className="text-xs font-mono text-purple-300">{item.company}</div>
                    <p className="text-xs text-slate-300 leading-relaxed pt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: RESEARCH & RECOGNITION */}
        {activeTab === 'research' && (
          <div className="bg-slate-950/90 p-6 md:p-8 rounded-2xl border border-cyan-500/30 backdrop-blur-xl shadow-2xl space-y-6">
            <div>
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">
                Academic Publications &amp; Honors
              </span>
              <h3 className="text-2xl font-extrabold text-white mt-1">
                Research &amp; Recognition
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-900/80 border border-purple-500/20 space-y-2">
                <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
                  <GraduationCap className="w-4 h-4" />
                  <span>Research Areas</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Focusing on local neural model quantization, retrieval latency optimization, and continuous memory decay for autonomous personal agents.
                </p>
                <div className="pt-1 text-[11px] font-mono text-cyan-400">
                  Key Topic: Episodic Recall in Multi-Turn Long Contexts
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-cyan-500/20 space-y-2">
                <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                  <Award className="w-4 h-4" />
                  <span>Recognition &amp; Milestones</span>
                </div>
                <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                  <li>Built &amp; deployed Robin Personal AI for Windows ecosystem</li>
                  <li>Open-source author on GitHub with active developer tooling</li>
                  <li>Production RAG and agent systems serving real-world workflows</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: CONTACT & CONNECT */}
        {activeTab === 'contact' && (
          <div className="bg-slate-950/90 p-6 md:p-8 rounded-2xl border border-cyan-500/30 backdrop-blur-xl shadow-2xl space-y-6">
            <div>
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">
                Collaborate &amp; Inquire
              </span>
              <h3 className="text-2xl font-extrabold text-white mt-1">
                Get In Touch
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: Direct Links */}
              <div className="space-y-4">
                <p className="text-xs text-slate-300 leading-relaxed">
                  Interested in collaborating on AI agents, machine learning architectures, or discussing engineering roles? Reach out directly:
                </p>

                <div className="space-y-2">
                  <a
                    href="mailto:nithishkumar.ai@gmail.com"
                    className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-cyan-400 text-white text-xs font-mono transition-colors"
                  >
                    <Mail className="w-4 h-4 text-cyan-400" />
                    <span>nithishkumar.ai@gmail.com</span>
                  </a>

                  <a
                    href="https://github.com/NithishKumarAI"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-purple-400 text-white text-xs font-mono transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <GithubIcon className="w-4 h-4 text-purple-400" />
                      <span>github.com/NithishKumarAI</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </a>

                  <a
                    href="/resume.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-cyan-400 text-white text-xs font-mono transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Download className="w-4 h-4 text-cyan-400" />
                      <span>Download Resume (PDF)</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </a>
                </div>
              </div>

              {/* Right Column: Direct Message Box */}
              <form onSubmit={handleSubmit} className="space-y-3">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Leave a message or project inquiry..."
                  rows={4}
                  className="w-full p-3 rounded-xl bg-slate-900/90 border border-slate-800 focus:border-cyan-400 text-white text-xs font-mono placeholder:text-slate-500 focus:outline-none transition-colors resize-none"
                />

                <button
                  type="submit"
                  disabled={contactSent}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono transition-all cursor-pointer shadow-md shadow-cyan-500/20"
                >
                  {contactSent ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span>Message Dispatched!</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Direct Transmission</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Footer System Status */}
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between text-[11px] font-mono text-slate-400 pt-4 border-t border-slate-800/60 pointer-events-auto">
        <div>NITHISH.AI V3 // REAL-TIME 3D SIMULATION</div>
        <div className="flex items-center gap-3">
          <span>PORT: 3001</span>
          <span>•</span>
          <span className="text-cyan-400">ALL SYSTEMS NOMINAL</span>
        </div>
      </div>
    </div>
  );
};
