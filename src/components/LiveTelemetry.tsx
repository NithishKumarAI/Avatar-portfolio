import React, { useState } from 'react';
import { Activity, Cpu, Film, Gauge, HardDrive, Minimize2, Maximize2 } from 'lucide-react';
import type { TelemetryStats } from './CinematicCanvasScrubber';

interface LiveTelemetryProps {
  stats: TelemetryStats | null;
  scrollProgress: number;
}

export const LiveTelemetry: React.FC<LiveTelemetryProps> = ({ stats, scrollProgress }) => {
  const [minimized, setMinimized] = useState(() => (typeof window !== 'undefined' ? window.innerWidth < 768 : false));

  if (!stats) return null;

  const fpsColor =
    stats.fps >= 55 ? 'text-emerald-400' : stats.fps >= 30 ? 'text-amber-400' : 'text-rose-400';

  const directionBadge =
    stats.scrollDirection === 'forward'
      ? { label: '↓ SCROLLING DOWN (FORWARD)', color: 'border-cyan-500/40 text-cyan-400 bg-cyan-950/40' }
      : stats.scrollDirection === 'reverse'
      ? { label: '↑ SCROLLING UP (REVERSE)', color: 'border-purple-500/40 text-purple-400 bg-purple-950/40' }
      : { label: '• STATIONARY (IDLE)', color: 'border-slate-700 text-slate-400 bg-slate-900/40' };

  return (
    <aside aria-label="Performance Telemetry HUD" className="fixed top-20 right-4 z-40 max-w-xs transition-all duration-300">
      <div className="card-blur rounded-2xl border border-cyan-500/30 shadow-2xl shadow-cyan-950/40 overflow-hidden font-mono text-xs">
        {/* Header bar */}
        <div className="flex items-center justify-between px-3.5 py-2.5 bg-slate-900/90 border-b border-cyan-500/20">
          <div className="flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span className="font-bold tracking-wider text-slate-200 uppercase text-[11px]">
              VFX Performance HUD
            </span>
          </div>
          <button
            onClick={() => setMinimized(!minimized)}
            className="text-slate-400 hover:text-white p-1 rounded transition-colors"
            title={minimized ? 'Expand HUD' : 'Minimize HUD'}
          >
            {minimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Content body */}
        {!minimized ? (
          <div className="p-3.5 space-y-3">
            {/* FPS and Frame timing */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                <div className="flex items-center gap-1.5 text-slate-400 text-[10px] uppercase">
                  <Gauge className="w-3 h-3 text-cyan-400" />
                  <span>Real-Time FPS</span>
                </div>
                <div className={`text-xl font-bold mt-1 ${fpsColor}`}>
                  {stats.fps} <span className="text-[10px] text-slate-500 font-normal">FPS</span>
                </div>
              </div>

              <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                <div className="flex items-center gap-1.5 text-slate-400 text-[10px] uppercase">
                  <Cpu className="w-3 h-3 text-purple-400" />
                  <span>Frame Draw</span>
                </div>
                <div className="text-xl font-bold mt-1 text-slate-200">
                  {stats.renderTimeMs}{' '}
                  <span className="text-[10px] text-slate-500 font-normal">ms</span>
                </div>
              </div>
            </div>

            {/* Frame counter & Direction */}
            <div className="space-y-1.5 bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
              <div className="flex justify-between items-center text-[10px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Film className="w-3 h-3 text-cyan-400" /> Frame Index:
                </span>
                <span className="text-cyan-300 font-semibold">
                  {stats.currentFrame} / {stats.totalFrames}
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 transition-all duration-75"
                  style={{ width: `${Math.round(scrollProgress * 100)}%` }}
                />
              </div>

              <div className="pt-1 flex items-center justify-between text-[10px]">
                <span className="text-slate-400">Scroll Progress:</span>
                <span className="text-white font-bold">{Math.round(scrollProgress * 100)}%</span>
              </div>
            </div>

            {/* Bidirectional direction badge */}
            <div
              className={`px-2.5 py-1.5 rounded-lg border text-[10px] text-center font-bold tracking-wider ${directionBadge.color}`}
            >
              {directionBadge.label}
            </div>

            {/* Architecture specs */}
            <div className="text-[10px] space-y-1 text-slate-400 pt-1 border-t border-slate-800/80">
              <div className="flex justify-between">
                <span>Avg Presentation:</span>
                <span className="text-slate-200 font-semibold">{stats.avgFrameDurationMs} ms</span>
              </div>
              <div className="flex justify-between">
                <span>Worst Duration:</span>
                <span className={`font-semibold ${stats.worstFrameDurationMs > 25 ? 'text-amber-400' : 'text-slate-200'}`}>
                  {stats.worstFrameDurationMs} ms
                </span>
              </div>
              <div className="flex justify-between">
                <span>Dropped Frames:</span>
                <span className={`font-semibold ${stats.droppedFramesCount > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {stats.droppedFramesCount}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="flex items-center gap-1">
                  <HardDrive className="w-2.5 h-2.5 text-slate-400" /> Payload (Disk):
                </span>
                <span className="text-slate-200 font-semibold">4.85 MB (WebP)</span>
              </div>
              <div className="flex justify-between">
                <span>Reduced Motion:</span>
                <span className={`font-semibold ${stats.reducedMotion ? 'text-amber-400' : 'text-slate-400'}`}>
                  {stats.reducedMotion ? 'ACTIVE' : 'OFF'}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="px-3 py-1.5 bg-slate-950 flex items-center justify-between gap-3">
            <span className={`font-bold ${fpsColor}`}>{stats.fps} FPS</span>
            <span className="text-slate-400">
              F{stats.currentFrame}/{stats.totalFrames}
            </span>
            <span className="text-cyan-400 font-bold">{Math.round(scrollProgress * 100)}%</span>
          </div>
        )}
      </div>
    </aside>
  );
};
