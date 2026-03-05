"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Github,
  Linkedin,
  Mail,
  Code,
  ExternalLink,
  ChevronDown,
  Database,
  Cpu,
  Globe
} from 'lucide-react';

// --- INTERFACES (Fixes TypeScript Errors) ---

interface Socials {
  linkedin: string;
  github: string;
  email: string;
}

interface PersonalInfo {
  name: string;
  role: string;
  email: string;
  phone: string;
  socials: Socials;
}

interface Experience {
  title: string;
  company: string;
  period: string;
  desc: string[];
}

interface Project {
  title: string;
  category: string;
  tech: string[];
  description: string;
  link: string;
  featured: boolean;
}

interface SkillCategory {
  category: string;
  items: string[];
  icon: React.ReactNode;
}

// --- DATA SECTION ---

const personalInfo: PersonalInfo = {
  name: "Mori Aryan",
  role: "Full Stack Developer & AI Researcher",
  email: "moriaryan2024@gmail.com",
  phone: "+91-7069233316",
  socials: {
    linkedin: "https://linkedin.com", // Replace with actual link
    github: "https://github.com",     // Replace with actual link
    email: "mailto:moriaryan2024@gmail.com"
  }
};

const aboutText = "I build production-ready web apps and applied ML systems. Currently a Machine Learning Research Intern working on transformer-based hyperspectral image super-resolution. I focus on reliable engineering and turning research into working products.";

const experiences: Experience[] = [
  {
    title: "Machine Learning Research Intern",
    company: "SVNIT (ISRO-Sponsored Project)",
    period: "Dec 2025 - Present",
    desc: [
      "Working on Super-Resolution and Fusion of Hyperspectral and Multispectral Images.",
      "Implemented transformer-based models and self-attention components in PyTorch.",
      "Validated model performance using frequency-domain analysis (FFT)."
    ]
  }
];

const projects: Project[] = [
  {
    title: "Rabuste Full-Stack Cafe Management Platform",
    category: "Full Stack",
    tech: ["Next.js", "TypeScript", "Tailwind CSS"],
    description: "A production-ready cafe platform with ordering, payments, coupons rewards, and a mobile-first interface.",
    link: "https://rabustecoffee.vercel.app",
    featured: true
  },
  {
    title: "NextEvent Now",
    category: "Web App",
    tech: ["React.js", "Node.js", "MongoDB"],
    description: "Campus event discovery platform used by 100+ students to track academic and cultural events.",
    link: "https://nexteventnow.netlify.app",
    featured: false
  },
  {
    title: "Sehat Mitra AI Assistant",
    category: "AI / ML",
    tech: ["React.js", "Python (Flask)", "NLP"],
    description: "Healthcare assistant using NLP to analyze symptoms and generate rule-based prescriptions.",
    link: "https://github.com/akashprofile/makernova-project",
    featured: true
  },
  // {
  //   title: "F1 Lap Time Predictor",
  //   category: "AI / ML",
  //   tech: ["Python", "XGBoost", "Pandas"],
  //   description: "Built for GDGC Datathon 2025. Analyzes race telemetry to predict lap times with high accuracy.",
  //   link: "#",
  //   featured: false
  // },
  // {
  //   title: "Transformer From Scratch",
  //   category: "AI / ML",
  //   tech: ["PyTorch", "Python"],
  //   description: "Implemented a full Transformer architecture manually to understand Attention mechanisms.",
  //   link: "#",
  //   featured: false
  // }
];

const skills: SkillCategory[] = [
  { category: "Languages", items: ["Python", "C", "C++", "JavaScript"], icon: <Code size={20} /> },
  { category: "Web Dev", items: ["Next.js", "React.js", "HTML/CSS", "Tailwind"], icon: <Globe size={20} /> },
  { category: "AI / ML", items: ["PyTorch", "XGBoost", "OpenCV", "Scikit-Learn"], icon: <Cpu size={20} /> },
  { category: "Backend/DB", items: ["Node.js", "SQL", "MongoDB", "Google Cloud"], icon: <Database size={20} /> }
];

const achievements: string[] = [
  "Smart India Hackathon (SIH) 2025 Internal Round Participant",
  "IBM Hackathon 2025 Participant",
  "Finalist - ACM Summer Challenge 2025",
  "Co-Head MindBend (Gujarat's Largest Techno-Managerial Fest)"
];

// --- COMPONENTS ---

const SectionHeading = ({ children }: { children: React.ReactNode }) => (
  <motion.h2
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    className="text-3xl md:text-4xl font-bold mb-10 animated-gradient-text"
  >
    {children}
  </motion.h2>
);

const Card = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    whileHover={{ y: -8, scale: 1.02, rotate: -0.5 }}
    transition={{ type: 'spring', stiffness: 200, damping: 18 }}
    className={`bg-slate-900/50 border border-slate-800 p-6 rounded-xl hover:border-blue-500/50 transition-all duration-300 ${className}`}
  >
    {children}
  </motion.div>
);

// Framer Motion variants for staggered project reveal
const gridVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14 } }
};
const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.95 } }
};

// --- MAIN PAGE ---

export default function Portfolio() {
  const [activeTab, setActiveTab] = useState("all");

  const skillProficiency: Record<string, number> = {
    "Languages": 92,
    "Web Dev": 88,
    "AI / ML": 82,
    "Backend/DB": 78
  };

  // Logic: If tab is "all", show all. If tab matches category exactly, show it.
  const filteredProjects = activeTab === "all"
    ? projects
    : projects.filter(p => p.category === activeTab || (activeTab === "featured" && p.featured));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-blue-500/30 font-sans">

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-md border-b border-slate-800/50 bg-slate-950/80">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div />
          <div className="hidden md:flex gap-6 text-sm font-medium text-slate-400">
            <a href="#about" className="hover:text-blue-400 transition-colors">About</a>
            <a href="#experience" className="hover:text-blue-400 transition-colors">Experience</a>
            <a href="#projects" className="hover:text-blue-400 transition-colors">Projects</a>
            <a href="#contact" className="hover:text-blue-400 transition-colors">Contact</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative h-screen flex flex-col justify-center items-center px-6 text-center overflow-hidden pt-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(59,130,246,0.1),transparent_50%)]" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4 }}
          className="z-10 max-w-4xl"
        >
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
            Hi, I'm <span className="text-blue-500">{personalInfo.name}</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-400 mb-8 max-w-2xl mx-auto">
            {personalInfo.role}
          </p>
          <div className="flex justify-center gap-4 mb-10">
            <a href={personalInfo.socials.github} target="_blank" rel="noopener noreferrer" className="p-3 bg-slate-900 rounded-full hover:bg-slate-800 transition-colors border border-slate-800"><Github size={24} /></a>
            <a href={personalInfo.socials.linkedin} target="_blank" rel="noopener noreferrer" className="p-3 bg-slate-900 rounded-full hover:bg-slate-800 transition-colors border border-slate-800"><Linkedin size={24} /></a>
            <a href={personalInfo.socials.email} className="p-3 bg-slate-900 rounded-full hover:bg-slate-800 transition-colors border border-slate-800"><Mail size={24} /></a>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#projects"
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all shadow-lg shadow-blue-500/25"
            >
              View My Work
            </a>

            <a
              href="https://drive.google.com/uc?export=download&id=1f-dVcWAM7ZMcS5K5roiiRNoJ8TmiODKM"
              target="_blank"
              className="px-8 py-3 bg-slate-900 border border-slate-700 hover:border-slate-500 text-white rounded-lg font-semibold transition-all"
            >
              Download Resume
            </a>
          </div>


        </motion.div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 text-slate-500"
        >
          <ChevronDown size={30} />
        </motion.div>
      </header>

      {/* About & Skills Grid */}
      <section id="about" className="py-20 px-6 max-w-6xl mx-auto scroll-mt-20">
        <div className="grid md:grid-cols-2 gap-16">
          <div>
            <SectionHeading>About Me</SectionHeading>
            <p className="text-slate-400 leading-relaxed text-lg mb-6">
              {aboutText}
            </p>
            <div className="flex gap-4 flex-wrap">
              {achievements.map((ach, i) => (
                <span key={i} className="text-sm px-3 py-1 bg-purple-500/10 text-purple-300 rounded-full border border-purple-500/20">
                  {ach}
                </span>
              ))}
            </div>
          </div>

          <div>
            <SectionHeading>Technical Arsenal</SectionHeading>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {skills.map((skill, i) => (
                <Card key={i} className="p-4">
                  <div className="flex items-center gap-3 mb-3 text-blue-400">
                    {skill.icon}
                    <h3 className="font-semibold text-white">{skill.category}</h3>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {skill.items.map((item, j) => (
                      <span key={j} className="text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded">
                        {item}
                      </span>
                    ))}
                  </div>
                  {/* <div className="mt-2">
                      <div className="text-xs text-slate-400 mb-2">Proficiency</div>
                      <div className="skill-bar" style={{'--w': `${skillProficiency[skill.category] || 70}%`} as React.CSSProperties}>
                        <div className="skill-fill" style={{ width: `${skillProficiency[skill.category] || 70}%` }} />
                      </div>
                    </div> */}
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-20 px-6 bg-slate-900/30 scroll-mt-20">
        <div className="max-w-4xl mx-auto">
          <SectionHeading>Experience</SectionHeading>
          <div className="space-y-8">
            {experiences.map((exp, i) => (
              <div key={i} className="relative pl-8 border-l-2 border-slate-800">
                <div className="absolute -left-[9px] top-0 w-4 h-4 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                <div className="mb-2">
                  <h3 className="text-xl font-bold text-white">{exp.title}</h3>
                  <div className="flex justify-between items-center text-sm text-slate-400 mt-1">
                    <span>{exp.company}</span>
                    <span>{exp.period}</span>
                  </div>
                </div>
                <ul className="list-disc list-outside ml-4 text-slate-400 space-y-2">
                  {exp.desc.map((item, j) => (
                    <li key={j}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 px-6 max-w-6xl mx-auto scroll-mt-20">
        <SectionHeading>Featured Projects</SectionHeading>

        {/* Project Filter Tabs */}
        <div className="flex gap-4 mb-10 overflow-x-auto pb-2 scrollbar-hide">
          {["all", "Full Stack", "AI / ML", "Web App"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${activeTab === tab
                ? "bg-blue-600 text-white"
                : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
                }`}
            >
              {tab === "all" ? "All Projects" : tab}
            </button>
          ))}
        </div>

        <motion.div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" variants={gridVariants} initial="hidden" whileInView="show" viewport={{ once: true }}>
          {filteredProjects.map((project, i) => (
            <motion.div key={i} variants={itemVariants}>
              <Card className="flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-blue-500/10 rounded-lg" aria-hidden />
                  <div className="flex gap-2">
                    <a href={project.link || '#'} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-white">
                      <ExternalLink size={18} className="cursor-pointer" />
                    </a>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">{project.title}</h3>
                <p className="text-slate-400 text-sm mb-4 flex-grow">{project.description}</p>
                <div className="flex flex-wrap gap-2 mt-auto">
                  {project.tech.map((t, j) => (
                    <span key={j} className="text-xs font-mono text-blue-300 bg-blue-900/20 px-2 py-1 rounded">
                      {t}
                    </span>
                  ))}
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Footer / Contact */}
      <footer id="contact" className="py-20 px-6 border-t border-slate-800 text-center">
        <h2 className="text-3xl font-bold mb-6 text-white">Let's Build Something Amazing</h2>
        <p className="text-slate-400 mb-8 max-w-md mx-auto">
          Whether it's discussing deep learning architectures or building the next big web app, I'm always open to new opportunities.
        </p>
        <a
          href={`mailto:${personalInfo.email}`}
          className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-950 font-bold rounded-lg hover:bg-slate-200 transition-colors"
        >
          <Mail size={20} /> Say Hello
        </a>
        <div className="mt-12 text-slate-600 text-sm">
          © {new Date().getFullYear()} Mori Aryan. Built with Next.js & Tailwind.
        </div>
      </footer>
    </div>
  );
}