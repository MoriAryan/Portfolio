"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Github,
  Linkedin,
  Mail,
  ExternalLink,
  Code,
  Globe,
  Database,
  Cpu,
  Wrench,
  BookOpen,
  ArrowRight,
  GraduationCap,
  Trophy,
  Briefcase,
  FlaskConical,
  Zap,
  FileText,
  Layers,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
import ProjectVault from "./ProjectVault";
import type { VaultProject } from "./ProjectVault";
import HeroWall from "./HeroWall";
import CustomCursor from "./CustomCursor";
import ProjectChapterModal from "./ProjectChapterModal";
import JourneyTraveler from "./JourneyTraveler";
import QuickAccessDock from "./QuickAccessDock";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyData = any;

interface PortfolioProps {
  profile: AnyData;
  experiences: AnyData[];
  featuredProjects: AnyData[];
  vaultProjects: VaultProject[];
  skills: AnyData[];
  achievements: AnyData[];
  positions: AnyData[];
  timeline: AnyData[];
  sections: AnyData[];
  research: AnyData;
  education: AnyData[];
}

/* ------------------------------------------------------------------ */
/*  Icon Map                                                           */
/* ------------------------------------------------------------------ */

const ICON_MAP: Record<string, React.ReactNode> = {
  code: <Code size={18} />,
  globe: <Globe size={18} />,
  database: <Database size={18} />,
  cpu: <Cpu size={18} />,
  wrench: <Wrench size={18} />,
  book: <BookOpen size={18} />,
};

/* ------------------------------------------------------------------ */
/*  Animation Utilities                                                */
/* ------------------------------------------------------------------ */

const spring = { type: "spring" as const, stiffness: 350, damping: 28 };

const fadeUp = {
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { ...spring },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const staggerChild = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { ...spring } },
};

/* ------------------------------------------------------------------ */
/*  Section Wrapper                                                    */
/* ------------------------------------------------------------------ */

function Section({
  id,
  children,
  className = "",
  dark = false,
}: {
  id: string;
  children: React.ReactNode;
  className?: string;
  dark?: boolean;
}) {
  return (
    <section
      id={id}
      className={`py-20 md:py-24 px-5 md:px-8 scroll-mt-20 ${
        dark ? "bg-[#0a0a0f]/60" : ""
      } ${className}`}
    >
      <div className="max-w-5xl mx-auto w-full">{children}</div>
    </section>
  );
}

function SectionHeading({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-10">
      <motion.div {...fadeUp} className="flex items-center gap-2.5 mb-2">
        <span className="w-2 h-2 rounded-full bg-[#e11d2a]" />
        <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
          {title}
        </h2>
      </motion.div>
      {subtitle && (
        <motion.p
          {...fadeUp}
          className="text-slate-400 text-sm md:text-base max-w-2xl leading-relaxed pl-4.5"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  MAIN PORTFOLIO COMPONENT                                           */
/* ------------------------------------------------------------------ */

export default function Portfolio({
  profile,
  experiences,
  featuredProjects,
  vaultProjects,
  skills,
  achievements,
  positions,
  research,
  education,
}: PortfolioProps) {
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<AnyData | null>(null);

  return (
    <div className="portfolio-root min-h-screen bg-[#08080a] text-slate-200 selection:bg-[#e11d2a]/30 font-sans relative">
      {/* Custom Tactical Cursor */}
      <CustomCursor />

      {/* Subtle Journey Traveler */}
      <JourneyTraveler />

      {/* Project Chapter Deep-Dive Modal */}
      <ProjectChapterModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />

      {/* ============================================================ */}
      {/* NAVBAR                                                       */}
      {/* ============================================================ */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-md border-b border-slate-800/80 bg-[#08080a]/90">
        <div className="max-w-6xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
          {/* OPEN, BIG LOGO in top-left */}
          <a
            href="#intro"
            className="flex items-center gap-3 group select-none cursor-pointer"
          >
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 shrink-0">
              <Image
                src="/logo.png"
                alt="Mori Aryan Logo"
                fill
                priority
                className="object-contain filter drop-shadow-[0_0_10px_rgba(225,29,42,0.4)] group-hover:scale-105 transition-transform"
              />
            </div>
            <span className="text-sm sm:text-base font-bold text-white tracking-wider font-mono">
              MORI ARYAN
            </span>
          </a>

          {/* Concise, Essential Navigation Links */}
          <div className="hidden sm:flex items-center gap-7 text-xs font-medium text-slate-300">
            <a href="#projects" className="nav-link hover:text-white transition-colors">
              Projects
            </a>
            <a href="#experience" className="nav-link hover:text-white transition-colors">
              Experience
            </a>
            <a href="#vault" className="nav-link hover:text-white transition-colors">
              Vault
            </a>
            <a href="#contact" className="nav-link hover:text-white transition-colors">
              Contact
            </a>
          </div>

          <a
            href="/resume"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#14141c] border border-slate-800 hover:border-[#e11d2a]/50 text-xs font-medium text-slate-200 hover:text-white transition-all shadow-sm"
          >
            <FileText size={14} className="text-[#e11d2a]" />
            <span>Resume</span>
          </a>
        </div>
      </nav>

      {/* Interactive Quick-Access Action Dock for outside platforms */}
      <QuickAccessDock email={profile.email} socials={profile.socialLinks} />

      {/* ============================================================ */}
      {/* 1. HERO — Introduction with subtle background seal           */}
      {/* ============================================================ */}
      <HeroWall profile={profile} />

      {/* ============================================================ */}
      {/* 2. EDUCATION                                                 */}
      {/* ============================================================ */}
      <Section id="education" dark>
        <SectionHeading
          title="Education"
          subtitle="Where I've built my foundation in computer science and engineering."
        />

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-5"
        >
          {education.map((edu: AnyData, i: number) => (
            <motion.div
              key={`edu-${i}`}
              variants={staggerChild}
              className="glass-card p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="p-2 rounded-lg bg-[#e11d2a]/10 text-[#ff4d5a] border border-[#e11d2a]/20">
                    <GraduationCap size={20} />
                  </div>
                  <span className="text-xs font-mono text-slate-400 bg-[#14141c] px-2.5 py-1 rounded border border-slate-800">
                    {edu.period}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-1">
                  {edu.institution}
                </h3>
                <p className="text-sm text-slate-300 mb-2">{edu.degree}</p>
                {edu.field && (
                  <p className="text-xs text-slate-400">Major: {edu.field}</p>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </Section>

      {/* ============================================================ */}
      {/* 3. EXPERIENCE & RESEARCH                                     */}
      {/* ============================================================ */}
      <Section id="experience">
        <SectionHeading
          title="Experience & Research"
          subtitle="Research internships and practical engineering work in machine learning and systems."
        />

        <div className="space-y-6">
          {/* ISRO-Sponsored Research Feature Card */}
          {research && (
            <motion.div
              {...fadeUp}
              className="glass-card p-6 sm:p-8 border-l-4 border-l-[#e11d2a]"
            >
              <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-[#e11d2a]/15 text-[#ff4d5a] border border-[#e11d2a]/30 shrink-0">
                    <FlaskConical size={22} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      {research.title || "Machine Learning Research Intern"}
                    </h3>
                    <p className="text-sm text-slate-300 mt-0.5">
                      {research.organization}
                      {research.sponsor && ` • ${research.sponsor}`}
                    </p>
                    {research.supervisor && (
                      <p className="text-xs text-slate-400 mt-0.5">
                        Supervised by: {research.supervisor}
                      </p>
                    )}
                  </div>
                </div>
                <span className="text-xs font-mono text-slate-400 bg-[#14141c] px-3 py-1 rounded-md border border-slate-800">
                  {research.period}
                </span>
              </div>

              {research.researchTopic && (
                <div className="p-3.5 rounded-lg bg-[#0e0e14] border border-slate-800/80 text-sm text-slate-300 font-medium mb-5">
                  <span className="text-[#ff4d5a] font-mono text-xs uppercase block mb-1">
                    Research Topic
                  </span>
                  {research.researchTopic}
                </div>
              )}

              {/* Research Description Bullets */}
              <ul className="space-y-2.5 mb-6">
                {(research.description || []).map((bullet: string, i: number) => (
                  <li key={i} className="text-sm text-slate-300 flex items-start gap-2.5">
                    <span className="text-[#e11d2a] font-bold mt-0.5 shrink-0">▸</span>
                    <span className="leading-relaxed">{bullet}</span>
                  </li>
                ))}
              </ul>

              {/* Metrics Grid */}
              {research.metrics &&
                Object.values(research.metrics).some((v: unknown) => v) && (
                  <div className="pt-4 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {research.metrics.psnr && (
                      <div className="bg-[#12121a] rounded-lg p-3 text-center border border-slate-800">
                        <div className="text-lg font-mono font-bold text-white">
                          {research.metrics.psnr}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono uppercase mt-0.5">
                          PSNR
                        </div>
                      </div>
                    )}
                    {research.metrics.ssim && (
                      <div className="bg-[#12121a] rounded-lg p-3 text-center border border-slate-800">
                        <div className="text-lg font-mono font-bold text-white">
                          {research.metrics.ssim}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono uppercase mt-0.5">
                          SSIM
                        </div>
                      </div>
                    )}
                    {research.metrics.datasetSize && (
                      <div className="bg-[#12121a] rounded-lg p-3 text-center border border-slate-800">
                        <div className="text-lg font-mono font-bold text-white">
                          {research.metrics.datasetSize}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono uppercase mt-0.5">
                          Dataset
                        </div>
                      </div>
                    )}
                    {research.metrics.bands && (
                      <div className="bg-[#12121a] rounded-lg p-3 text-center border border-slate-800">
                        <div className="text-lg font-mono font-bold text-white">
                          {research.metrics.bands}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono uppercase mt-0.5">
                          Bands
                        </div>
                      </div>
                    )}
                  </div>
                )}
            </motion.div>
          )}

          {/* Other Experience Entries if present */}
          {experiences
            .filter((exp: AnyData) => exp.title !== research?.title)
            .map((exp: AnyData, idx: number) => (
              <motion.div key={`exp-${idx}`} {...fadeUp} className="glass-card p-6">
                <div className="flex items-start justify-between flex-wrap gap-2 mb-2">
                  <div>
                    <h3 className="text-lg font-bold text-white">{exp.title}</h3>
                    <p className="text-sm text-slate-300">{exp.organization}</p>
                  </div>
                  <span className="text-xs font-mono text-slate-400 bg-[#14141c] px-2.5 py-1 rounded border border-slate-800">
                    {exp.period}
                  </span>
                </div>
                {exp.description && (
                  <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                    {exp.description}
                  </p>
                )}
              </motion.div>
            ))}
        </div>
      </Section>

      {/* ============================================================ */}
      {/* 4. FEATURED PROJECTS                                         */}
      {/* ============================================================ */}
      <Section id="projects" dark>
        <SectionHeading
          title="Featured Projects"
          subtitle="Selected systems, web platforms, and engineering builds I've worked on."
        />

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-6"
        >
          {featuredProjects.map((proj: AnyData) => (
            <FeaturedProjectCard
              key={proj._id || proj.slug}
              project={proj}
              onInspect={() => setSelectedProject(proj)}
            />
          ))}
        </motion.div>
      </Section>

      {/* ============================================================ */}
      {/* 5. SKILLS                                                    */}
      {/* ============================================================ */}
      <Section id="skills">
        <SectionHeading
          title="Technical Skills"
          subtitle="Core languages, libraries, and tools I use. Hover over a skill to see where it was applied."
        />

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {skills.map((cat: AnyData) => (
            <motion.div
              key={cat._id || cat.category}
              variants={staggerChild}
              className="glass-card p-5 group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2.5 mb-4 text-[#ff4d5a]">
                  <span className="p-1.5 rounded bg-[#e11d2a]/10 border border-[#e11d2a]/20">
                    {ICON_MAP[cat.icon] || <Code size={18} />}
                  </span>
                  <h3 className="font-bold text-white text-sm tracking-wide">
                    {cat.category}
                  </h3>
                </div>

                <div className="flex flex-wrap gap-2">
                  {(cat.items || []).map((item: AnyData) => {
                    const isHovered = hoveredSkill === item.name;
                    return (
                      <button
                        key={item.name}
                        type="button"
                        onMouseEnter={() => setHoveredSkill(item.name)}
                        onMouseLeave={() => setHoveredSkill(null)}
                        onClick={() =>
                          setHoveredSkill((prev) =>
                            prev === item.name ? null : item.name
                          )
                        }
                        className={`text-xs px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer font-mono ${
                          item.isTopSkill
                            ? "bg-[#e11d2a]/15 text-white border-[#e11d2a]/40 font-medium"
                            : "bg-[#14141d] text-slate-300 border-slate-800"
                        } ${
                          isHovered
                            ? "ring-2 ring-[#e11d2a] shadow-[0_0_12px_rgba(225,29,42,0.4)] scale-105"
                            : "hover:border-slate-600"
                        }`}
                      >
                        {item.name}
                        {item.isTopSkill && (
                          <span className="ml-1 text-[#ff4d5a]">★</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Show linked projects on hover */}
              <AnimatePresence>
                {hoveredSkill &&
                  (cat.items || []).some(
                    (item: AnyData) =>
                      item.name === hoveredSkill &&
                      item.projectSlugs?.length > 0
                  ) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 pt-3 border-t border-slate-800"
                    >
                      <p className="text-[10px] text-slate-500 uppercase font-mono tracking-wider mb-1.5">
                        Used in
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {(cat.items || [])
                          .find((item: AnyData) => item.name === hoveredSkill)
                          ?.projectSlugs?.map((slug: string) => (
                            <span
                              key={slug}
                              className="text-[10px] font-mono px-2 py-0.5 bg-[#e11d2a]/20 text-white rounded border border-[#e11d2a]/30"
                            >
                              {slug}
                            </span>
                          ))}
                      </div>
                    </motion.div>
                  )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      </Section>

      {/* ============================================================ */}
      {/* 6. ACHIEVEMENTS                                              */}
      {/* ============================================================ */}
      <Section id="achievements" dark>
        <SectionHeading
          title="Achievements & Hackathons"
          subtitle="Honors, competitive hackathons, and challenges won along the journey."
        />

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 md:grid-cols-3 gap-5"
        >
          {achievements.map((ach: AnyData, i: number) => (
            <motion.div
              key={`ach-${i}`}
              variants={staggerChild}
              className="glass-card p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <Trophy size={18} />
                  </div>
                  <span className="text-xs font-mono text-slate-400 bg-[#14141c] px-2 py-0.5 rounded border border-slate-800">
                    {ach.year}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mb-1.5 leading-snug">
                  {ach.title}
                </h3>
              </div>
              <p className="text-xs font-medium text-amber-400/90 mt-2 bg-amber-500/10 px-2.5 py-1 rounded inline-block w-fit border border-amber-500/20">
                {ach.result}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </Section>

      {/* ============================================================ */}
      {/* 7. POSITIONS OF RESPONSIBILITY                               */}
      {/* ============================================================ */}
      <Section id="positions">
        <SectionHeading
          title="Positions of Responsibility"
          subtitle="Leadership roles in campus chapters and technical festivals at SVNIT Surat."
        />

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-5"
        >
          {positions.map((pos: AnyData, i: number) => (
            <motion.div
              key={`pos-${i}`}
              variants={staggerChild}
              className="glass-card p-6"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-[#e11d2a]/10 text-[#ff4d5a] border border-[#e11d2a]/20">
                    <Briefcase size={18} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">
                      {pos.title}
                    </h3>
                    <p className="text-xs text-slate-300">{pos.organization}</p>
                  </div>
                </div>
                <span className="text-xs font-mono text-slate-400 bg-[#14141c] px-2.5 py-1 rounded border border-slate-800">
                  Since {pos.since}
                </span>
              </div>
              {pos.description && (
                <p className="text-xs sm:text-sm text-slate-400 mt-3 leading-relaxed">
                  {pos.description}
                </p>
              )}
            </motion.div>
          ))}
        </motion.div>
      </Section>

      {/* ============================================================ */}
      {/* 8. PROJECT VAULT                                             */}
      {/* ============================================================ */}
      <ProjectVault projects={vaultProjects} />

      {/* ============================================================ */}
      {/* 9. CONTACT                                                   */}
      {/* ============================================================ */}
      <Section id="contact" dark>
        <div className="max-w-xl mx-auto text-center">
          <SectionHeading
            title="Get in Touch"
            subtitle="I'm always open to discussing new opportunities, research collaborations, or engineering ideas."
          />

          <motion.div
            {...fadeUp}
            className="flex flex-col sm:flex-row gap-3.5 justify-center mt-6"
          >
            <a
              href={`mailto:${profile.email || "moriaryan2024@gmail.com"}`}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#e11d2a] hover:bg-[#ff2a3b] text-white font-medium rounded-lg text-sm transition-all shadow-[0_0_20px_rgba(225,29,42,0.35)] hover:-translate-y-0.5"
            >
              <Mail size={16} /> Send an Email
            </a>
            <a
              href="/resume"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#14141c] border border-slate-800 hover:border-slate-600 text-slate-200 font-medium rounded-lg text-sm transition-all hover:text-white hover:-translate-y-0.5"
            >
              <FileText size={16} /> View Resume <ArrowRight size={14} />
            </a>
          </motion.div>

          <div className="mt-16 text-slate-500 text-xs font-mono">
            © {new Date().getFullYear()} {profile.name || "Mori Aryan"} • SVNIT Surat
          </div>
        </div>
      </Section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Featured Project Card Component                                    */
/* ------------------------------------------------------------------ */

function FeaturedProjectCard({
  project,
  onInspect,
}: {
  project: AnyData;
  onInspect: () => void;
}) {
  const mainLink = project.links?.[0]?.url || "";

  return (
    <motion.div
      variants={staggerChild}
      whileHover={{ y: -4 }}
      transition={spring}
      className="glass-card overflow-hidden flex flex-col justify-between group"
    >
      <div>
        {/* Cover image banner */}
        {project.cover ? (
          <div className="relative h-48 sm:h-52 overflow-hidden bg-[#101016]">
            <img
              src={project.cover}
              alt={project.title}
              className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
            />
            <div className="project-cover-overlay absolute inset-0" />
            <span className="absolute top-3 left-3 text-[10px] font-mono px-2 py-0.5 rounded bg-[#08080a]/80 backdrop-blur-md border border-slate-800 text-slate-300">
              {project.year || "2025"}
            </span>
            {project.status && (
              <span className="absolute top-3 right-3 text-[10px] font-mono px-2 py-0.5 rounded bg-[#08080a]/80 backdrop-blur-md border border-slate-800 text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                {project.status}
              </span>
            )}
          </div>
        ) : (
          <div className="h-16 bg-[#12121a] border-b border-slate-800 flex items-center justify-between px-5">
            <span className="text-[10px] font-mono text-slate-400">
              {project.year || "2025"}
            </span>
            {project.status && (
              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                {project.status}
              </span>
            )}
          </div>
        )}

        <div className="p-5 sm:p-6">
          <h3 className="text-xl font-bold text-white group-hover:text-[#ff4d5a] transition-colors mb-2">
            {project.title}
          </h3>

          <p className="text-sm text-slate-300 mb-4 line-clamp-2 leading-relaxed">
            {project.hook}
          </p>

          <div className="flex flex-wrap gap-1.5 mb-2">
            {(project.tech || []).slice(0, 5).map((t: string) => (
              <span
                key={t}
                className="text-xs font-mono text-slate-300 bg-[#161622] px-2.5 py-0.5 rounded border border-slate-800"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-5 sm:p-6 pt-0 flex items-center justify-between gap-3 border-t border-slate-800/80 mt-2">
        <button
          type="button"
          onClick={onInspect}
          className="text-xs font-medium text-[#ff4d5a] hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Layers size={14} />
          <span>Project Details</span>
          <ChevronRight size={13} />
        </button>

        {mainLink && (
          <a
            href={mainLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-slate-300 hover:text-white flex items-center gap-1 transition-colors"
          >
            <span>Live Demo</span>
            <ExternalLink size={13} />
          </a>
        )}
      </div>
    </motion.div>
  );
}