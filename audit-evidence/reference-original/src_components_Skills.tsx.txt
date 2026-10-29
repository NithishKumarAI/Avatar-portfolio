import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useRef } from 'react';

const skillCategories = [
  {
    title: 'AI & Machine Learning',
    skills: [
      { name: 'LLM Applications', level: 84 },
      { name: 'NLP Systems', level: 82 },
      { name: 'RAG', level: 78 },
      { name: 'Speech-to-Text', level: 80 },
      { name: 'Generative AI', level: 83 },
      { name: 'AI Workflows', level: 86 },
    ],
    color: 'from-blue-500 to-cyan-500',
  },
  {
    title: 'Programming & Backend',
    skills: [
      { name: 'Python', level: 88 },
      { name: 'Flask', level: 80 },
      { name: 'REST APIs', level: 82 },
      { name: 'CRUD Operations', level: 84 },
      { name: 'API Integration', level: 85 },
      { name: 'Backend Workflows', level: 81 },
    ],
    color: 'from-cyan-500 to-teal-500',
  },
  {
    title: 'Data & Databases',
    skills: [
      { name: 'SQL', level: 86 },
      { name: 'MySQL', level: 85 },
      { name: 'pandas', level: 78 },
      { name: 'NumPy', level: 76 },
      { name: 'Schema Design', level: 83 },
      { name: 'Query Optimization', level: 82 },
    ],
    color: 'from-teal-500 to-emerald-500',
  },
  {
    title: 'Tools & Platforms',
    skills: [
      { name: 'Git', level: 82 },
      { name: 'GitHub', level: 84 },
      { name: 'XAMPP', level: 80 },
      { name: 'Ollama', level: 74 },
      { name: 'Notion API', level: 76 },
      { name: 'Development Tools', level: 83 },
    ],
    color: 'from-emerald-500 to-green-500',
  },
];

function SkillCard({ category, index }: { category: typeof skillCategories[0], index: number }) {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 500, damping: 100 });
  const mouseY = useSpring(y, { stiffness: 500, damping: 100 });

  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-5deg", "5deg"]);

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
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm p-8 rounded-2xl border border-blue-500/20 hover:border-cyan-400/50 transition-all perspective-1000"
    >
      <h3 className={`text-2xl font-bold mb-6 bg-gradient-to-r ${category.color} bg-clip-text text-transparent`} style={{ transform: "translateZ(20px)" }}>
        {category.title}
      </h3>
      <div className="space-y-5" style={{ transform: "translateZ(10px)" }}>
        {category.skills.map((skill, skillIndex) => (
          <div key={skill.name}>
            <div className="flex justify-between mb-2">
              <span className="text-gray-300 font-medium">{skill.name}</span>
              <span className="text-cyan-400 font-semibold">{skill.level}%</span>
            </div>
            <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${skill.level}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: skillIndex * 0.1 }}
                className={`h-full bg-gradient-to-r ${category.color} rounded-full`}
              />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default function Skills() {
  return (
    <section id="skills" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Skills & Expertise
            </span>
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-blue-400 to-cyan-400 mx-auto rounded-full" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {skillCategories.map((category, categoryIndex) => (
            <SkillCard key={category.title} category={category} index={categoryIndex} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-12 text-center"
        >
          <p className="text-gray-400 text-lg">
            Constantly learning and adapting to emerging technologies in AI and web development
          </p>
        </motion.div>
      </div>
    </section>
  );
}
