import React, { useState } from 'react';
import { Activity, Cpu, Gauge, Layers, Minimize2, Maximize2, Box, Eye } from 'lucide-react';
import type { WorldTelemetry } from '../three/PortfolioWorld';
import type { CharacterType } from '../three/CharacterModel';

interface LiveTelemetryProps {
  stats: WorldTelemetry | null;
  scrollProgress: number;
  scrollDirection: 'forward' | 'reverse' | 'idle';
  characterType: CharacterType;
}

export const LiveTelemetry: React.FC<LiveTelemetryProps> = ({
  stats,
  scrollProgress,
  scrollDirection,
  characterType,
}) => {
  const [minimized, setMinimized] = useState(() => (typeof window !== 'undefined' ? window.innerWidth < 768 : false));

  if (!stats) return null;

  const fpsColor =
    stats.fps >= 55 ? 'text-emerald-400' : stats.fps >= 30 ? 'text-amber-400' : 'text-rose-400';

  const directionBadge =
    scrollDirection === 'forward'
      ? { label: '↓ FORWARD SCRUB', color: 'border-cyan-500/40 text-cyan-400 bg-cyan-950/40' }
      : scrollDirection === 'reverse'
      ? { label: '↑ REVERSE SCRUB', color: 'border-purple-500/40 text-purple-400 bg-purple-950/40' }
      : { label: '• IDLE POSITION', color: 'border-slate-700 text-slate-400 bg-slate-900/40' };

  return (
    <aside aria-label="Performance Telemetry HUD" className="fixed top-20 right-4 z-40 max-w-xs transition-all duration-300">
      <div className="bg-slate-950/90 rounded-2xl border border-cyan-500/30 shadow-2xl shadow-cyan-950/40 overflow-hidden font-mono text-xs backdrop-blur-md">
        {/* Header bar */}
        <div className="flex items-center justify-between px-3.5 py-2.5 bg-slate-900/90 border-b border-cyan-500/20">
          <div className="flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span className="font-bold tracking-wider text-slate-200 uppercase text-[11px]">
              WebGL 3D Telemetry HUD
            </span>
          </div>
          <button
            onClick={() => setMinimized(!minimized)}
            className="text-slate-400 hover:text-white p-1 rounded transition-colors cursor-pointer"
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
              <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                <div className="flex items-center gap-1.5 text-slate-400 text-[10px] uppercase">
                  <Gauge className="w-3 h-3 text-cyan-400" />
                  <span>Real-Time FPS</span>
                </div>
                <div className={`text-xl font-bold mt-1 ${fpsColor}`}>
                  {stats.fps} <span className="text-[10px] text-slate-500 font-normal">FPS</span>
                </div>
              </div>

              <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                <div className="flex items-center gap-1.5 text-slate-400 text-[10px] uppercase">
                  <Cpu className="w-3 h-3 text-purple-400" />
                  <span>Frame Cost</span>
                </div>
                <div className="text-xl font-bold mt-1 text-slate-200">
                  {stats.frameTimeMs} <span className="text-[10px] text-slate-500 font-normal">ms</span>
                </div>
              </div>
            </div>

            {/* WebGL Render Metrics */}
            <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase">
                <span className="flex items-center gap-1">
                  <Layers className="w-3 h-3 text-cyan-400" />
                  <span>Draw Calls:</span>
                </span>
                <span className="font-bold text-white">{stats.drawCalls}</span>
              </div>

              <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase">
                <span className="flex items-center gap-1">
                  <Box className="w-3 h-3 text-purple-400" />
                  <span>Triangles:</span>
                </span>
                <span className="font-bold text-white">{stats.triangles.toLocaleString()}</span>
              </div>

              <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase">
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3 text-sky-400" />
                  <span>Rig Animation:</span>
                </span>
                <span className="font-bold text-cyan-300 uppercase">{stats.activeAction}</span>
              </div>

              <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase">
                <span>Model Skeleton:</span>
                <span className="font-bold text-slate-200">
                  {characterType === 'humanoid' ? 'Mixamo Xbot (67 bones)' : 'Cyber Rig (Robot)'}
                </span>
              </div>
            </div>

            {/* Scroll Scrubbing Direction */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase">
                <span>Progress:</span>
                <span className="font-bold text-cyan-400">{(scrollProgress * 100).toFixed(1)}%</span>
              </div>

              <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden border border-slate-800">
                <div
                  className="bg-gradient-to-r from-cyan-400 to-purple-500 h-full transition-all duration-75"
                  style={{ width: `${Math.round(scrollProgress * 100)}%` }}
                />
              </div>

              <div className={`px-2 py-1 rounded border text-[10px] text-center font-bold tracking-wider ${directionBadge.color}`}>
                {directionBadge.label}
              </div>
            </div>
          </div>
        ) : (
          <div className="px-3 py-2 flex items-center justify-between gap-3 text-[11px]">
            <span className={`font-bold ${fpsColor}`}>{stats.fps} FPS</span>
            <span className="text-slate-400">{(scrollProgress * 100).toFixed(0)}%</span>
            <span className="text-cyan-400 uppercase">{stats.activeAction}</span>
          </div>
        )}
      </div>
    </aside>
  );
};
