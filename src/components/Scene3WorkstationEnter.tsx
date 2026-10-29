import React from 'react';
import { Monitor, Cpu, Sparkles, ChevronDown, CheckCircle2 } from 'lucide-react';

interface Scene3WorkstationEnterProps {
  opacity: number;
  onScrollToNext: () => void;
}

export const Scene3WorkstationEnter: React.FC<Scene3WorkstationEnterProps> = ({
  opacity,
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
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-purple-500/40 text-purple-300 text-xs font-mono tracking-wider backdrop-blur pointer-events-auto">
          <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
          <Cpu className="w-3.5 h-3.5 text-purple-400" />
          <span>SCENE 03 // WORKSTATION ENGAGEMENT &amp; SEATING</span>
        </div>

        <div className="hidden sm:inline-flex items-center gap-2 text-xs font-mono text-cyan-400">
          <Monitor className="w-3.5 h-3.5" />
          <span>DISPLAY: ULTRAWIDE 32:9 ONLINE</span>
        </div>
      </div>

      {/* Main Right-Side Workstation Telemetry Block */}
      <div className="w-full max-w-xl ml-auto mr-4 md:mr-12 pointer-events-auto space-y-4 my-auto">
        <div className="inline-flex items-center gap-2 text-purple-400 font-mono text-xs tracking-widest uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
          <span>Scene 03 // Workstation Transition</span>
        </div>

        <div className="bg-slate-950/85 p-6 rounded-2xl border border-purple-500/30 backdrop-blur-md shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-purple-500/20 pb-3">
            <h3 className="text-xl font-extrabold text-white">
              Engineering Console Docked
            </h3>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono text-xs border border-purple-500/30">
              Interactive 3D Stage
            </span>
          </div>

          <p className="text-slate-300 text-sm leading-relaxed">
            The avatar completes its approach, swivels into position, takes a seat at the workstation, and engages the keyboard interface.
          </p>

          {/* Subsystem Telemetry Checkpoints */}
          <div className="grid grid-cols-2 gap-2.5 pt-1 text-xs font-mono">
            {[
              { label: 'Ergonomic Desk', status: 'Height 0.74m' },
              { label: 'Curved Display', status: 'HDR Dynamic Canvas' },
              { label: 'Character Rig', status: 'Seated Typing Blended' },
              { label: 'Workstation GPU', status: 'RTX 4090 / Local CUDA' },
            ].map((item, idx) => (
              <div key={idx} className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <div>
                  <div className="text-slate-400 text-[10px] uppercase">{item.label}</div>
                  <div className="text-white font-semibold">{item.status}</div>
                </div>
              </div>
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
            Scroll to reveal flagship project showcase
          </span>
          <ChevronDown className="w-4 h-4 animate-bounce text-purple-400 group-hover:translate-y-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
