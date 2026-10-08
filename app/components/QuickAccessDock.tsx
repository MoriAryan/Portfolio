"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Github,
  Linkedin,
  Mail,
  Code2,
  FileText,
  Archive,
  ExternalLink,
} from "lucide-react";

interface DockItem {
  id: string;
  label: string;
  sublabel?: string;
  icon: React.ReactNode;
  url: string;
  isExternal: boolean;
}

interface QuickAccessDockProps {
  email?: string;
  socials?: Array<{
    platform: string;
    url: string;
    displayText?: string;
  }>;
}

export default function QuickAccessDock({ email, socials = [] }: QuickAccessDockProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const githubUrl =
    socials.find((s) => s.platform?.toLowerCase() === "github")?.url ||
    "https://github.com/MoriAryan";
  const linkedinUrl =
    socials.find((s) => s.platform?.toLowerCase() === "linkedin")?.url ||
    "https://linkedin.com/in/mori-aryan";
  const leetcodeUrl =
    socials.find((s) => s.platform?.toLowerCase() === "leetcode" || s.platform?.toLowerCase() === "code")?.url ||
    "https://leetcode.com";

  const items: DockItem[] = [
    {
      id: "github",
      label: "GitHub",
      sublabel: "Source Repositories",
      icon: <Github size={20} />,
      url: githubUrl,
      isExternal: true,
    },
    {
      id: "linkedin",
      label: "LinkedIn",
      sublabel: "Professional Profile",
      icon: <Linkedin size={20} />,
      url: linkedinUrl,
      isExternal: true,
    },
    {
      id: "leetcode",
      label: "LeetCode",
      sublabel: "400+ Solved",
      icon: <Code2 size={20} />,
      url: leetcodeUrl,
      isExternal: true,
    },
    {
      id: "email",
      label: "Email",
      sublabel: "Say Hello",
      icon: <Mail size={20} />,
      url: `mailto:${email || "moriaryan2024@gmail.com"}`,
      isExternal: false,
    },
    {
      id: "resume",
      label: "Resume",
      sublabel: "PDF Download",
      icon: <FileText size={20} />,
      url: "/resume",
      isExternal: false,
    },
    {
      id: "vault",
      label: "The Vault",
      sublabel: "Side Projects",
      icon: <Archive size={20} />,
      url: "#vault",
      isExternal: false,
    },
  ];

  return (
    <div className="fixed bottom-6 inset-x-0 z-40 flex justify-center pointer-events-none px-4 select-none">
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 25, delay: 0.3 }}
        className="pointer-events-auto flex items-center gap-1.5 p-2 rounded-2xl bg-[#0e0e14]/90 backdrop-blur-xl border border-slate-800/90 shadow-[0_12px_40px_rgba(0,0,0,0.7),0_0_20px_rgba(225,29,42,0.15)]"
      >
        {items.map((item) => {
          const isHovered = hoveredId === item.id;

          return (
            <div key={item.id} className="relative flex flex-col items-center">
              {/* Dynamic Expanding Label Tooltip */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.85 }}
                    animate={{ opacity: 1, y: -10, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 450, damping: 25 }}
                    className="absolute bottom-full mb-1 pointer-events-none whitespace-nowrap z-50 flex flex-col items-center"
                  >
                    <div className="px-3 py-1.5 rounded-lg bg-[#14141c] border border-[#e11d2a]/40 shadow-[0_4px_20px_rgba(0,0,0,0.8),0_0_12px_rgba(225,29,42,0.3)] text-center">
                      <p className="text-xs font-bold text-white tracking-wide font-mono flex items-center gap-1">
                        {item.label}
                        {item.isExternal && <ExternalLink size={10} className="text-[#ff4d5a]" />}
                      </p>
                      {item.sublabel && (
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                          {item.sublabel}
                        </p>
                      )}
                    </div>
                    {/* Tooltip caret */}
                    <div className="w-2 h-2 rotate-45 bg-[#14141c] border-r border-b border-[#e11d2a]/40 -mt-1" />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Icon Button */}
              <motion.a
                href={item.url}
                target={item.isExternal ? "_blank" : undefined}
                rel={item.isExternal ? "noopener noreferrer" : undefined}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
                whileHover={{ scale: 1.22, y: -3 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 22 }}
                className={`relative p-3 rounded-xl transition-colors flex items-center justify-center cursor-pointer ${
                  isHovered
                    ? "bg-[#e11d2a]/20 text-white border border-[#e11d2a]/60 shadow-[0_0_16px_rgba(225,29,42,0.45)]"
                    : "text-slate-400 hover:text-white bg-[#14141c]/60 border border-transparent"
                }`}
                aria-label={item.label}
              >
                {item.icon}
              </motion.a>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}
