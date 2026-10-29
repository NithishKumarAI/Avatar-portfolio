import { motion } from 'framer-motion';

const AWARDS = [
  {
    icon: 'IBM',
    category: 'IBM Certification',
    title: 'IBM AI Developer Professional Certificate',
    desc: 'Professional certification covering AI, Generative AI, Flask, Prompt Engineering, and AI application workflows',
    date: '2024',
    color: '#a855f7',
  },
  {
    icon: 'CS',
    category: '11 to 11 Hackathon',
    title: 'CodeStorm Elite Award',
    desc: 'Award winner at hackathon conducted by Sri Ramakrishna Institute of Technology',
    date: 'April 2025',
    color: '#eab308',
  },
  {
    icon: 'IEEE',
    category: 'Research Publication',
    title: 'IEEE ICISS 2026 Publication',
    desc: 'Published research paper on multilingual NLP learning systems for Indian languages',
    date: '2026',
    color: '#22c55e',
  },
  {
    icon: '10',
    category: 'Top 10 Finalist',
    title: 'Hack the Horizon Finalist',
    desc: 'Selected among top 10 teams out of 80 participants at KPR Institute of Engineering and Technology',
    date: 'February 2025',
    color: '#06b6d4',
  },
];

export default function Awards() {
  return (
    <section id="awards" className="py-24 relative overflow-hidden bg-black/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-5xl font-black text-white mb-16 flex items-center gap-4 uppercase tracking-widest"
        >
          <span className="w-2 md:w-3 h-10 md:h-12 bg-yellow-500 block rounded-r-lg" />
          CREDIBILITY & AWARDS
        </motion.h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {AWARDS.map((award, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl hover:-translate-y-2 transition-transform border-l-4"
              style={{
                borderLeftColor: award.color,
                boxShadow: '0 4px 30px rgba(0, 0, 0, 0.5)',
              }}
            >
              <div className="text-4xl mb-4">{award.icon}</div>
              <div
                className="text-xs font-bold tracking-widest mb-2"
                style={{ color: award.color, fontFamily: 'JetBrains Mono, monospace' }}
              >
                {award.category}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{award.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{award.desc}</p>
              <p
                className="text-xs font-bold tracking-widest mt-4"
                style={{ color: award.color, fontFamily: 'JetBrains Mono, monospace' }}
              >
                {award.date}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
