import React, { useState } from 'react';
import { ExternalLink, Mic, Volume2, Shield, Lock, Layers, Sparkles, Cpu, CheckCircle2 } from 'lucide-react';

interface Scene3RobinProps {
  opacity: number;
}

export const Scene3Robin: React.FC<Scene3RobinProps> = ({ opacity }) => {
  const [isSimulatingVoice, setIsSimulatingVoice] = useState(false);
  const voiceQuery =
    'Robin, summarize unread emails from the ML research team and prepare my 4 PM calendar briefing.';
  const voiceResponse =
    'Analyzed 3 emails locally. Dr. Rao sent the revised ablation results on BGE retrieval. You have 45 minutes of free focus time before your 4 PM sync.';

  if (opacity <= 0.01) return null;

  return (
    <div
      className="absolute inset-0 flex flex-col justify-between p-6 md:p-12 transition-opacity duration-200 pointer-events-none"
      style={{ opacity }}
    >
      {/* Top indicator */}
      <div className="w-full max-w-7xl mx-auto pt-16 flex justify-between items-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-950/80 border border-purple-500/50 text-purple-300 text-xs font-mono tracking-wider backdrop-blur pointer-events-auto shadow-lg shadow-purple-950/50">
          <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
          <span>SCENE 03 // MONITOR ACTIVATED: FLAGSHIP REVEAL</span>
        </div>

        <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-700 text-xs font-mono text-cyan-400">
          <Cpu className="w-3.5 h-3.5" />
          <span>STATUS: ONLINE &amp; RESPONSIVE</span>
        </div>
      </div>

      {/* Main Robin showcase card */}
      <div className="w-full max-w-4xl mx-auto pointer-events-auto my-auto space-y-6">
        <div className="card-blur p-6 md:p-8 rounded-3xl border border-purple-500/40 shadow-2xl shadow-purple-950/80 relative overflow-hidden backdrop-blur-2xl">
          {/* Subtle neon glow backdrops */}
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-cyan-600/20 rounded-full blur-3xl pointer-events-none" />

          {/* Header row with Robin branding */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-purple-500/20 relative z-10">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src="/robin-master.png"
                  alt="Robin Logo"
                  className="w-16 h-16 rounded-2xl p-1 bg-slate-950/80 border border-purple-500/40 shadow-lg shadow-purple-500/20 object-contain"
                />
                <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-950 flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    Robin
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-[11px] font-mono uppercase tracking-widest">
                    Everyone's PA
                  </span>
                </div>
                <p className="text-slate-400 text-sm mt-0.5">
                  Local-first personal AI assistant for Windows. One conversation for your email, calendar, files &amp; tasks.
                </p>
              </div>
            </div>

            {/* Quick action buttons */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <a
                href="https://robinpa.in"
                target="_blank"
                rel="noreferrer"
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-lg shadow-purple-600/30 transition-all cursor-pointer"
              >
                <span>Visit robinpa.in</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <a
                href="https://github.com/NithishKumarAI"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-mono transition-all cursor-pointer"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                <span className="hidden sm:inline">Repo</span>
              </a>
            </div>
          </div>

          {/* Interactive Voice & Local AI Feature Demo */}
          <div className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
            {/* Feature 1 */}
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-semibold">
                <Lock className="w-4 h-4 text-cyan-400" />
                <span>LOCAL-FIRST SAFETY</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Zero cloud lock-in. Actions require verified permission boundaries before modifying calendars or sending emails.
              </p>
              <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-mono pt-1">
                <CheckCircle2 className="w-3 h-3" /> Offline storage encrypted
              </div>
            </div>

            {/* Feature 2 */}
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-purple-400 text-xs font-mono font-semibold">
                <Layers className="w-4 h-4 text-purple-400" />
                <span>EPISODIC MEMORY</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Persistent context engine remembering people, meeting notes, project deadlines, and preferences across sessions.
              </p>
              <div className="flex items-center gap-1.5 text-[11px] text-purple-300 font-mono pt-1">
                <CheckCircle2 className="w-3 h-3" /> Sub-50ms vector recall
              </div>
            </div>

            {/* Feature 3 */}
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-pink-400 text-xs font-mono font-semibold">
                <Mic className="w-4 h-4 text-pink-400" />
                <span>NATURAL CONVERSATION</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Ultra-low latency speech pipeline with local Whisper transcription and real-time streaming feedback.
              </p>
              <div className="flex items-center gap-1.5 text-[11px] text-pink-300 font-mono pt-1">
                <CheckCircle2 className="w-3 h-3" /> Voice-native interaction
              </div>
            </div>
          </div>

          {/* Interactive Voice Simulator Box */}
          <div className="mt-5 p-4 rounded-2xl bg-purple-950/30 border border-purple-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={() => setIsSimulatingVoice(!isSimulatingVoice)}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  isSimulatingVoice
                    ? 'bg-rose-500/20 border-rose-500 text-rose-400 animate-pulse'
                    : 'bg-purple-600/30 border-purple-500/50 text-purple-300 hover:bg-purple-600/50'
                }`}
                title="Simulate speech interaction"
              >
                {isSimulatingVoice ? <Volume2 className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
              <div className="text-xs font-mono">
                <div className="text-purple-300 font-semibold flex items-center gap-1.5">
                  <span className="px-1.5 py-0.5 rounded text-[9px] bg-purple-500/30 border border-purple-500/40 text-purple-200">
                    SIMULATED DEMO
                  </span>
                  <span>{isSimulatingVoice ? 'AGENT SPEAKING...' : 'LIVE VOICE INTERACTION PREVIEW'}</span>
                </div>
                <div className="text-slate-400 text-[11px] truncate max-w-sm mt-0.5">
                  {isSimulatingVoice ? voiceResponse : voiceQuery}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>Windows App • Client Encrypted</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom prompt */}
      <div className="flex items-center justify-center pb-6 w-full pointer-events-auto">
        <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">
          Scroll up anytime to scrub back through the workstation &amp; avatar
        </span>
      </div>
    </div>
  );
};
