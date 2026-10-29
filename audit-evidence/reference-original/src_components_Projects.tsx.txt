import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ExternalLink, Github, TrendingUp, Zap, Target, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef, useState } from 'react';
import ProjectImpactChart from './ProjectImpactChart';

const PROJECT_VISUAL = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600"%3E%3Crect width="800" height="600" fill="%23050b18"/%3E%3Cg stroke="%2338bdf8" stroke-opacity="0.35" fill="none"%3E%3Cpath d="M72 420C210 245 374 515 516 260S686 270 736 170"/%3E%3Cpath d="M80 170L220 310L390 180L560 350L720 210"/%3E%3Cpath d="M120 500L265 370L420 465L610 300L735 390"/%3E%3C/g%3E%3Cg fill="%238b5cf6" fill-opacity="0.45"%3E%3Ccircle cx="80" cy="170" r="10"/%3E%3Ccircle cx="220" cy="310" r="10"/%3E%3Ccircle cx="390" cy="180" r="10"/%3E%3Ccircle cx="560" cy="350" r="10"/%3E%3Ccircle cx="720" cy="210" r="10"/%3E%3C/g%3E%3Cg fill="%2338bdf8" fill-opacity="0.5"%3E%3Ccircle cx="72" cy="420" r="8"/%3E%3Ccircle cx="516" cy="260" r="8"/%3E%3Ccircle cx="736" cy="170" r="8"/%3E%3Ccircle cx="420" cy="465" r="8"/%3E%3C/g%3E%3C/svg%3E';

const projects = [
  {
  title: 'Cognitive Memory Engine',
  tagline: 'RAG-Powered Learning Intelligence System',
  description: 'Developed a production-style AI memory system combining semantic retrieval, vector search, learning analytics, and recommendation workflows to create a personalized learning intelligence platform.',
  achievements: [
    'Implemented semantic memory retrieval using pgvector, HNSW indexing, and BGE embeddings',
    'Built an end-to-end RAG pipeline with Gemini-powered grounded responses and source attribution',
    'Designed learning analytics and recommendation services from structured memory data',
    'Deployed a full-stack AI application using Docker and Google Cloud Run'
  ],
  tech: [
    'FastAPI',
    'PostgreSQL',
    'pgvector',
    'Gemini',
    'BGE Embeddings',
    'Next.js',
    'Docker',
    'Google Cloud',
    'RAG',
    'Semantic Search'
  ],
  liveUrl: 'https://cognitive-memory-frontend-244986175934.asia-south1.run.app',
  githubUrl: 'https://github.com/NithishKumarAI/cognitive-memory-engine',
  gradient: 'from-cyan-500 to-blue-500',
  impactMetric: {
    value: 768,
    displayValue: '768-D VECTOR',
    label: 'SEMANTIC SEARCH',
    prefix: ''
  },
  image: PROJECT_VISUAL
},
  {
    title: 'AI Diary Assistant',
    tagline: 'Cloud AI Journaling Workflow',
    description: 'Built and deployed a cloud-based AI journaling platform integrating browser-native speech transcription, Gemini multi-model fallback routing, and Notion memory APIs for automated diary generation and retrieval workflows.',
    achievements: [
      'Built browser-native speech-to-text workflows using Groq Whisper API',
      'Implemented Gemini multi-model fallback routing for resilient AI inference',
      'Integrated Notion APIs as a persistent cloud memory layer',
      ],
    tech: ['Multi-Model Routing','Python', 'Streamlit', 'Gemini API', 'Groq Whisper API', 'Notion API','GitHub','Streamlit Cloud','LLM Routing'],
    liveUrl: 'https://ai-diary-assistant-522323461346.asia-south1.run.app/',
    githubUrl: 'https://github.com/NithishKumarAI/ai-personal-assistant-system',
    gradient: 'from-blue-500 to-violet-500',
    impactMetric: { value: 92, displayValue: 'AI DIARY', label: 'CLOUD WORKFLOW', prefix: '' },
    image: PROJECT_VISUAL
  },
 {
  title: 'Food Delivery ETA Prediction',
  tagline: 'Production ML Pipeline',
  description: 'Built and deployed an end-to-end ML system for food delivery ETA prediction using feature engineering, CatBoost inference workflows, Docker containerization, and Google Cloud deployment.',
  achievements: [
    'Engineered preprocessing, feature engineering, and reusable inference pipelines',
    'Benchmarked CatBoost, XGBoost, Random Forest, and LightGBM models',
    'Containerized the application with Docker and deployed on Google Cloud Run',
  ],
  tech: [
    'Python',
    'Pandas',
    'Scikit-learn',
    'CatBoost',
    'XGBoost',
    'LightGBM',
    'Streamlit',
    'Docker',
    'Google Cloud Run',
    'ML Pipelines'
  ],
  liveUrl: 'https://food-delivery-api-814424211655.asia-south1.run.app',
  githubUrl: 'https://github.com/NithishKumarAI/food-delivery-eta-pipeline',
  gradient: 'from-orange-500 to-red-500',
  impactMetric: {
    value: 84,
    displayValue: '0.84 R²',
    label: 'ETA MODEL',
    prefix: ''
  },
  image: PROJECT_VISUAL
}
];

function ProjectCard({ project, index }: { project: typeof projects[0], index: number }) {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 500, damping: 100 });
  const mouseY = useSpring(y, { stiffness: 500, damping: 100 });

  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-7deg", "7deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();

    const width = rect.width;
    const height = rect.height;

    const mouseXFromCenter = e.clientX - rect.left - width / 2;
    const mouseYFromCenter = e.clientY - rect.top - height / 2;

    x.set(mouseXFromCenter / width);
    y.set(mouseYFromCenter / height);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative perspective-1000 min-w-[350px] md:min-w-[600px] lg:min-w-[900px] snap-center"
    >
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ transform: "translateZ(-50px)" }}
      />

      <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-[2rem] border border-white/10 overflow-hidden hover:border-cyan-400/50 transition-colors duration-500 shadow-2xl h-full flex flex-col lg:flex-row">

        <div className="p-8 lg:p-10 flex flex-col justify-between space-y-6 lg:w-1/2" style={{ transform: "translateZ(20px)" }}>
          <div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="inline-block"
            >
              <h3 className={`text-3xl font-bold mb-2 bg-gradient-to-r ${project.gradient} bg-clip-text text-transparent`}>
                {project.title}
              </h3>
            </motion.div>
            <p className="text-cyan-400 text-lg font-medium mb-4">
              {project.tagline}
            </p>
            <p className="text-gray-300 text-base leading-relaxed line-clamp-3 hover:line-clamp-none transition-all">
              {project.description}
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-cyan-400 font-semibold uppercase tracking-wider text-xs">
              <Target className="w-4 h-4" />
              <span>Key Achievements</span>
            </div>
            <div className="grid gap-2">
              {project.achievements.slice(0, 5).map((achievement, i) => (
                <motion.div
                  key={i}
                  className="flex items-start gap-2"
                >
                  <Zap className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300 text-sm">{achievement}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {project.tech.map((tech) => (
              <span
                key={tech}
                className={`px-3 py-1 bg-white/5 rounded-full text-xs text-cyan-300 border border-white/10 hover:bg-white/10 transition-colors`}
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="flex gap-4 pt-2">
            {project.liveUrl && (
              <motion.a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${project.gradient} rounded-full text-white font-bold text-sm shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all`}
              >
                <ExternalLink size={16} />
                Live Demo
              </motion.a>
            )}
            {project.githubUrl && (
              <motion.a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-full text-white font-bold text-sm hover:bg-white/10 transition-all"
              >
                <Github size={16} />
                Code
              </motion.a>
            )}
          </div>
        </div>

        <div className="relative h-[300px] lg:h-auto lg:w-1/2 bg-gradient-to-br from-slate-800 to-slate-900 p-8 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />

          <motion.div
            className="absolute inset-0 opacity-20"
            style={{
              scale: 1.1,
              translateX: useTransform(mouseX, [-0.5, 0.5], ["-5%", "5%"]),
              translateY: useTransform(mouseY, [-0.5, 0.5], ["-5%", "5%"]),
            }}
          >
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </motion.div>

          <motion.div
            className="relative z-10 w-full max-w-[280px]"
            style={{ transform: "translateZ(50px)" }}
          >
            <div className={`bg-gradient-to-br ${project.gradient} bg-opacity-10 rounded-3xl p-6 border border-white/10 backdrop-blur-md shadow-xl`}>
              <div className="text-center">
                <TrendingUp className="w-12 h-12 text-white mx-auto mb-4 drop-shadow-lg" />
                <div className={`${project.impactMetric.displayValue.length > 10 ? 'text-2xl md:text-3xl leading-tight' : 'text-5xl'} font-black text-white mb-2 tracking-tight drop-shadow-lg`}>
                  {project.impactMetric.displayValue ?? (
                    <>
                      {project.impactMetric.prefix}{project.impactMetric.value}
                      {!project.impactMetric.prefix && '%'}
                    </>
                  )}
                </div>
                <div className="text-sm text-white/90 font-bold uppercase tracking-widest leading-tight">
                  {project.impactMetric.label}
                </div>
              </div>
              <div className="mt-6 h-[100px]">
                <ProjectImpactChart value={project.impactMetric.value} />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Projects() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  // Swipe detection logic
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      scrollRight();
    } else if (isRightSwipe) {
      scrollLeft();
    }

    // Reset
    setTouchStart(0);
    setTouchEnd(0);
  };

  const scrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: -window.innerWidth * 0.8, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: window.innerWidth * 0.8, behavior: 'smooth' });
    }
  };

  return (
    <section id="projects" className="py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Featured Projects
            </span>
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-blue-400 to-cyan-400 mx-auto rounded-full" />
          <p className="text-gray-400 mt-4 text-lg">
            Swipe to explore my latest work
          </p>
        </motion.div>

        <div className="relative">
          {/* Scroll Buttons for Desktop */}
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 bg-slate-800/80 p-3 rounded-full text-white hover:bg-cyan-500 hover:scale-110 transition-all hidden md:block backdrop-blur-sm border border-white/10"
          >
            <ChevronLeft size={24} />
          </button>

          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 bg-slate-800/80 p-3 rounded-full text-white hover:bg-cyan-500 hover:scale-110 transition-all hidden md:block backdrop-blur-sm border border-white/10"
          >
            <ChevronRight size={24} />
          </button>

          {/* Horizontal Scroll Container */}
          <div
            ref={containerRef}
            className="flex overflow-x-auto gap-6 md:gap-8 pb-12 snap-x snap-mandatory hide-scrollbar"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {projects.map((project, index) => (
              <ProjectCard key={project.title} project={project} index={index} />
            ))}

            {/* CTA Card as the last item */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="min-w-[300px] flex items-center justify-center snap-center"
            >
              <div className="text-center p-8 bg-white/5 rounded-3xl border border-white/10 hover:border-cyan-400/30 transition-colors">
                <Github size={48} className="mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-bold text-white mb-2">View More</h3>
                <p className="text-gray-400 mb-6">Check out more projects on GitHub</p>
                <a
                  href="https://github.com/NithishKumarAI"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full text-white font-semibold hover:opacity-90 transition-opacity"
                >
                  Visit GitHub
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
