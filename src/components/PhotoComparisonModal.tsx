import React, { useState } from 'react';
import { X, CheckCircle2, Sliders, Sparkles } from 'lucide-react';

interface PhotoComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PhotoComparisonModal: React.FC<PhotoComparisonModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [activeView, setActiveView] = useState<'slider' | 'side-by-side'>('slider');

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="photo-comparison-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl animate-fade-in"
    >
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto card-blur rounded-3xl border border-cyan-500/40 shadow-2xl shadow-cyan-950/80 p-6 md:p-8">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-slate-900/80 border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-2 pb-6 border-b border-slate-800">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>PRIORITY 1 VERIFICATION // RESEMBLANCE AUDIT</span>
          </div>
          <h2 id="photo-comparison-title" className="text-2xl sm:text-3xl font-extrabold text-white">
            Actual Photograph vs. Cinematic Avatar
          </h2>
          <p className="text-slate-400 text-sm">
            Inspect the high-fidelity preservation of facial features, curly hairstyle, mustache, skin tone, and studio lighting.
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex justify-center gap-2 my-4">
          <button
            onClick={() => setActiveView('slider')}
            className={`px-4 py-1.5 rounded-xl text-xs font-mono transition-all ${
              activeView === 'slider'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/30'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            Split-Screen Reveal Slider
          </button>
          <button
            onClick={() => setActiveView('side-by-side')}
            className={`px-4 py-1.5 rounded-xl text-xs font-mono transition-all ${
              activeView === 'side-by-side'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/30'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            Side-By-Side Comparison
          </button>
        </div>

        {/* Main Comparison Area */}
        {activeView === 'slider' ? (
          <div className="relative w-full aspect-video sm:h-[460px] rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 select-none shadow-inner">
            {/* Real photo (Left / Base) */}
            <img
              src="/profile-photo.jpg"
              alt="Actual Photograph of Nithish Kumar"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ objectPosition: 'center 22%' }}
            />
            <div className="absolute top-4 left-4 px-3 py-1 rounded-md bg-black/80 backdrop-blur border border-white/20 text-white font-mono text-xs z-10 shadow">
              📸 Actual Photo (Portfolio Reference)
            </div>

            {/* Generated Cinematic Avatar (Right / Clipped overlay) */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
            >
              <img
                src="/scenes/scene_1_wave.jpg"
                alt="Cinematic Neural Avatar"
                className="absolute inset-0 w-full h-full object-cover"
                style={{ objectPosition: 'center 22%' }}
              />
              <div className="absolute top-4 right-4 px-3 py-1 rounded-md bg-purple-950/90 backdrop-blur border border-purple-500/40 text-purple-200 font-mono text-xs z-10 shadow">
                ✨ Cinematic Neural Avatar
              </div>
            </div>

            {/* Divider Line */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-cyan-400 shadow-[0_0_15px_#22d3ee] cursor-ew-resize z-20 flex items-center justify-center"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="w-8 h-8 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center shadow-lg cursor-ew-resize">
                <Sliders className="w-4 h-4 rotate-90" />
              </div>
            </div>

            {/* Hidden native input slider over top */}
            <input
              type="range"
              min="0"
              max="100"
              value={sliderPosition}
              onChange={(e) => setSliderPosition(Number(e.target.value))}
              aria-label="Comparison slider position"
              className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="text-xs font-mono text-slate-400">📸 Actual Photograph:</div>
              <div className="rounded-2xl overflow-hidden border border-slate-800 aspect-[4/3] bg-slate-950">
                <img
                  src="/profile-photo.jpg"
                  alt="Actual Photograph"
                  className="w-full h-full object-cover"
                  style={{ objectPosition: 'center 22%' }}
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-xs font-mono text-purple-400">✨ Cinematic AI Keyframe (Scene 1):</div>
              <div className="rounded-2xl overflow-hidden border border-purple-500/40 aspect-[4/3] bg-slate-950">
                <img
                  src="/scenes/scene_1_wave.jpg"
                  alt="Cinematic AI Avatar"
                  className="w-full h-full object-cover"
                  style={{ objectPosition: 'center 22%' }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Audit Details */}
        <div className="mt-6 p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3 font-mono text-xs">
          <div className="text-slate-300 font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Key Facial Characteristics Preserved:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-400">
            <div>• <strong className="text-slate-200">Hair:</strong> Natural wavy/curly texture with upward lift</div>
            <div>• <strong className="text-slate-200">Facial Hair:</strong> Accurate neat mustache &amp; subtle chin stubble</div>
            <div>• <strong className="text-slate-200">Eyes &amp; Smile:</strong> Warm, engaging expression &amp; dark irises</div>
            <div>• <strong className="text-slate-200">Skin Tone:</strong> Warm South Asian subsurface skin tones</div>
          </div>
        </div>
      </div>
    </div>
  );
};
