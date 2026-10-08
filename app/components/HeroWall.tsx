"use client";

import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import {
  Github,
  Linkedin,
  Mail,
  Code,
  ExternalLink,
  ChevronDown,
} from "lucide-react";
import Image from "next/image";

interface SocialLink {
  platform: string;
  url: string;
  displayText?: string;
  icon?: string;
  visible?: boolean;
}

interface HeroWallProps {
  profile: {
    name?: string;
    role?: string;
    currentFocus?: string;
    email?: string;
    socialLinks?: SocialLink[];
  };
}

const SOCIAL_ICON_MAP: Record<string, React.ReactNode> = {
  github: <Github size={18} />,
  linkedin: <Linkedin size={18} />,
  mail: <Mail size={18} />,
  code: <Code size={18} />,
};

export default function HeroWall({ profile }: HeroWallProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  // Scroll tracking: gracefully fades and recedes the background seal
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 240,
    damping: 32,
    restDelta: 0.001,
  });

  // Background logo scroll fade
  const logoScale = useTransform(smoothProgress, [0, 0.7, 1], [1, 0.88, 0.75]);
  const logoOpacity = useTransform(smoothProgress, [0, 0.55, 1], [0.18, 0.08, 0]);
  const logoY = useTransform(smoothProgress, [0, 1], [0, -60]);

  // Foreground content scroll fade
  const contentOpacity = useTransform(smoothProgress, [0, 0.5], [1, 0]);
  const contentY = useTransform(smoothProgress, [0, 0.5], [0, -30]);

  // Subtle pointer spotlight on the wall
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  const socials = (profile.socialLinks || []).filter((s) => s.visible !== false);

  return (
    <header
      id="intro"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-[92svh] flex flex-col justify-center items-center px-6 overflow-hidden pt-16 selection:bg-[#e11d2a]/30"
    >
      {/* 1. Dark Textured Wall Background */}
      <div className="absolute inset-0 bg-[#08080a] grid-bg opacity-70" />

      {/* 2. Soft, subtle pointer illumination (not blinding) */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          background: `radial-gradient(700px circle at ${mousePos.x}% ${mousePos.y}%, rgba(225, 29, 42, 0.05), transparent 75%)`,
        }}
      />

      {/* 3. Deep Atmospheric Vignette */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_30%,#08080a_85%)]" />

      {/* 4. THE CBI OFFICE WALL SEAL — Subtle, brooding, authoritative watermark */}
      <motion.div
        style={{
          scale: logoScale,
          opacity: logoOpacity,
          y: logoY,
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0 select-none flex items-center justify-center"
      >
        <div className="relative w-[360px] h-[360px] sm:w-[500px] sm:h-[500px] md:w-[620px] md:h-[620px]">
          <Image
            src="/logo.png"
            alt="Mori Aryan Background Seal"
            fill
            priority
            sizes="(max-width: 768px) 360px, (max-width: 1200px) 500px, 620px"
            className="object-contain filter grayscale-[20%] contrast-125"
          />
        </div>
      </motion.div>

      {/* 5. FOREGROUND CONTENT — High contrast, crisp, and human */}
      <motion.div
        style={{
          opacity: contentOpacity,
          y: contentY,
        }}
        className="relative z-10 max-w-3xl text-center flex flex-col items-center"
      >
        {/* Natural Badge */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#111116]/80 border border-slate-800 text-slate-300 text-xs font-mono mb-6 backdrop-blur-md"
        >
          <span className="w-2 h-2 rounded-full bg-[#e11d2a] live-dot" />
          <span>SVNIT Surat</span>
          <span className="text-slate-600">•</span>
          <span>B.Tech Computer Science</span>
        </motion.div>

        {/* Crisp Name */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.08 }}
          className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight text-white uppercase mb-4 leading-none"
        >
          {profile.name || "MORI ARYAN"}
        </motion.h1>

        {/* Clear, Personal Role Statement */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.16 }}
          className="text-lg sm:text-xl text-slate-300 max-w-xl mb-4 font-normal leading-relaxed"
        >
          {profile.role || "Full Stack Developer & AI Researcher"}
        </motion.p>

        {/* Current Focus Highlight */}
        {profile.currentFocus && (
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.22 }}
            className="text-xs sm:text-sm text-slate-400 font-mono mb-8 max-w-lg"
          >
            Currently working on:{" "}
            <span className="text-slate-200">{profile.currentFocus}</span>
          </motion.p>
        )}

        {/* Clean Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.28 }}
          className="flex flex-wrap items-center justify-center gap-3 mb-8"
        >
          <a
            href="#projects"
            className="px-6 py-2.5 rounded-lg bg-[#e11d2a] hover:bg-[#ff2a3b] text-white font-medium text-sm transition-all shadow-[0_0_20px_rgba(225,29,42,0.35)] hover:-translate-y-0.5"
          >
            View Projects
          </a>
          <a
            href="#vault"
            className="px-6 py-2.5 rounded-lg bg-[#14141c] border border-slate-700/80 hover:border-slate-500 text-slate-200 font-medium text-sm transition-all hover:bg-[#1a1a24] hover:-translate-y-0.5"
          >
            Project Vault
          </a>
          <a
            href="/resume"
            className="px-5 py-2.5 rounded-lg bg-[#0e0e13] border border-slate-800 hover:border-slate-600 text-slate-300 text-sm font-mono transition-all hover:text-white hover:-translate-y-0.5"
          >
            Resume
          </a>
        </motion.div>

        {/* Clean Social Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="flex items-center justify-center gap-2"
        >
          {socials.map((s, i) => (
            <a
              key={i}
              href={s.url}
              target={s.platform === "Email" ? undefined : "_blank"}
              rel="noopener noreferrer"
              className="p-2.5 rounded-lg bg-[#121218]/90 border border-slate-800 hover:border-slate-600 text-slate-400 hover:text-white transition-all hover:scale-105"
              title={s.displayText || s.platform}
            >
              {SOCIAL_ICON_MAP[s.icon?.toLowerCase() || s.platform?.toLowerCase()] || (
                <ExternalLink size={17} />
              )}
            </a>
          ))}
        </motion.div>
      </motion.div>

      {/* 6. Subtle Scroll Down Cue */}
      <motion.div
        animate={{ y: [0, 6, 0] }}
        transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
        className="absolute bottom-5 flex flex-col items-center gap-1 text-slate-500 pointer-events-none select-none"
      >
        <ChevronDown size={18} className="text-slate-500" />
      </motion.div>
    </header>
  );
}
