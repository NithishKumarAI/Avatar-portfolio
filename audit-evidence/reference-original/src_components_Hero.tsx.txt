import { useEffect, useRef, useState, lazy, Suspense } from 'react';
import ResumeLink from './ResumeLink';

const ProfileSphere = lazy(() => import('./ProfileSphere'));

const BIOS = [
  'Artificial Intelligence student focused on <strong>machine learning, AI systems, and LLMs</strong>. Learning the foundations deeply while building practical AI products.',
  'Exploring <strong>AI research and applied ML engineering</strong>. I like turning models, data, and experiments into useful real-world systems.',
  'Building toward work in <strong>LLMs, retrieval systems, model evaluation, and AI applications</strong> with a research-first engineering mindset.',
  'Interested in <strong>how intelligent systems reason, adapt, and fail</strong>. I study model behavior so AI products can become more reliable.',
  'Focused on <strong>end-to-end AI workflows</strong>: data preparation, model training, evaluation, deployment, and continuous improvement.',
  'I enjoy building <strong>AI-powered products</strong> that connect strong ML concepts with clean user-facing experiences.',
  'Learning advanced AI concepts through <strong>hands-on experiments, research papers, and production-minded projects</strong>.',
  'My goal is to grow into an <strong>AI Research Scientist</strong> who can also engineer systems that work outside the lab.',
  'Currently sharpening skills across <strong>Python, ML pipelines, neural networks, NLP, and large language models</strong>.',
  'I care about <strong>responsible AI</strong>: evaluation, bias awareness, interpretability, and building systems users can trust.',
  'Research interests include <strong>LLM reasoning, retrieval-augmented generation, multimodal AI, and applied machine learning</strong>.',
  'I am driven by curiosity, disciplined experimentation, and the challenge of building <strong>real-world AI applications</strong>.',
];

export default function Hero() {
  const bioRef = useRef<HTMLParagraphElement>(null);
  const [currentBioIndex, setCurrentBioIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const animationRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const typeWriter = (html: string, speed = 25) => {
    setIsTyping(true);
    setDisplayedText('');
    let i = 0;
    const stripped = html.replace(/<[^>]+>/g, '');
    const tick = () => {
      if (i <= stripped.length) {
        setDisplayedText(stripped.slice(0, i));
        i++;
        animationRef.current = setTimeout(tick, speed);
      } else {
        // After plain text animation show rich html
        setDisplayedText(html);
        setIsTyping(false);
      }
    };
    tick();
  };

  useEffect(() => {
    typeWriter(BIOS[0]);
    return () => {
      if (animationRef.current) clearTimeout(animationRef.current);
    };
  }, []);

  const generateNewBio = () => {
    if (isTyping) return;
    if (animationRef.current) clearTimeout(animationRef.current);
    const next = (currentBioIndex + 1) % BIOS.length;
    setCurrentBioIndex(next);
    typeWriter(BIOS[next]);
  };



  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ paddingTop: '4rem' }}
    >
      {/* 3D Sphere - positioned behind profile pic area */}
      <Suspense fallback={null}>
        <ProfileSphere />
      </Suspense>

      {/* AI system status badge */}
      <div
        className="inline-block px-3 py-1 mb-6 text-xs font-bold tracking-widest text-cyan-400 border border-cyan-500/30 rounded-full bg-cyan-500/10 animate-pulse"
        style={{ fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.15em', zIndex: 2, position: 'relative' }}
      >
        AI SYSTEM ACTIVE
      </div>

      {/* Profile picture - no glow, clean border */}
      <div className="relative flex items-center justify-center mb-6" style={{ zIndex: 2 }}>
          <img
            src="/profile-photo.jpg"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://ui-avatars.com/api/?name=Nithish+Kumar+R&background=0D8ABC&color=fff&size=256';
            }}
            alt="Nithish Kumar R"
            className="relative rounded-full object-cover border-4"
            style={{
              width: 200,
              height: 200,
              borderColor: 'rgba(255,255,255,0.1)',
            }}
            fetchPriority="high"
          />
      </div>

      {/* Name */}
      <h1
        className="font-bold text-white text-center mb-1"
        style={{
          fontSize: 'clamp(2.5rem, 7vw, 5rem)',
          letterSpacing: '0.05em',
          fontFamily: 'Inter, sans-serif',
          textShadow: '0 0 40px rgba(6,182,212,0.3)',
        }}
      >
        Nithish Kumar R
      </h1>

      {/* Title */}
      <h2
        className="text-cyan-400 tracking-widest font-bold mb-8"
        style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.9rem', letterSpacing: '0.3em' }}
      >
        Aspiring AI Research Scientist | AI &amp; ML Engineer
      </h2>

      {/* Bio terminal box */}
      <div
        className="relative mx-auto mb-6"
        style={{
          maxWidth: 520,
          width: '90%',
          background: 'rgba(10,10,15,0.75)',
          border: '1px solid rgba(6,182,212,0.3)',
          borderRadius: 8,
          padding: '1rem 1.25rem',
        }}
      >
        {/* Terminal header */}
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" />
          <span
            className="ml-2 text-gray-400 text-xs"
            style={{ fontFamily: 'JetBrains Mono, monospace' }}
          >
            NEURAL_CORE // BIO_GENERATOR
          </span>
        </div>

        <p
          ref={bioRef}
          className="text-gray-300 text-sm leading-relaxed"
          style={{ fontFamily: 'JetBrains Mono, monospace', minHeight: 60 }}
        >
          <span className="text-cyan-400 mr-1">&gt;</span>
          {isTyping ? (
            <>
              {displayedText}
              <span className="inline-block w-0.5 h-4 bg-cyan-400 ml-0.5 animate-pulse" />
            </>
          ) : (
            <span dangerouslySetInnerHTML={{ __html: displayedText }} />
          )}
        </p>
      </div>

      {/* Generate bio button */}
      <button
        onClick={generateNewBio}
        disabled={isTyping}
        className="group flex items-center gap-2 px-6 py-2.5 rounded-full transition-all mb-10"
        style={{
          background: 'rgba(6,182,212,0.1)',
          border: '1px solid rgba(6,182,212,0.5)',
          color: '#22d3ee',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '0.7rem',
          letterSpacing: '0.15em',
          cursor: isTyping ? 'not-allowed' : 'pointer',
          opacity: isTyping ? 0.6 : 1,
        }}
      >
        <span style={{ fontSize: '0.9rem' }}>✦</span>
        GENERATE NEW BIO
      </button>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-10" style={{ maxWidth: 480, width: '90%' }}>
        {[
          { value: '1.5+', label: 'YEARS EXP' },
          { value: 'ICISS', label: 'IEEE 2026', color: '#22d3ee' },
          { value: '7.25', label: 'CGPA', color: '#c084fc' },
          { value: '3+', label: 'PROJECTS' },
        ].map(({ value, label, color }) => (
          <div
            key={label}
            className="flex flex-col items-center justify-center p-3 rounded-lg"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <span className="font-bold text-xl" style={{ color: color ?? '#fff', fontFamily: 'JetBrains Mono, monospace' }}>
              {value}
            </span>
            <span className="text-gray-500 text-xs mt-1" style={{ letterSpacing: '0.1em', fontFamily: 'JetBrains Mono, monospace' }}>
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* CTA buttons */}
      <div className="flex flex-col sm:flex-row gap-3 items-center mb-16">
        <a
          href="#projects"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="px-6 py-2.5 rounded text-sm font-bold transition-all"
          style={{
            background: 'rgba(6,182,212,0.1)',
            border: '1px solid rgba(6,182,212,0.5)',
            color: '#22d3ee',
            fontFamily: 'JetBrains Mono, monospace',
            letterSpacing: '0.05em',
          }}
        >
          VIEW MY WORK
        </a>
        <ResumeLink variant="primary" />
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 text-gray-500 text-xs tracking-widest"
        style={{ transform: 'translateX(-50%)', fontFamily: 'JetBrains Mono, monospace' }}
      >
        SCROLL ↓
      </div>
    </section>
  );
}
