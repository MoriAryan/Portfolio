"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, GitBranch, Layers, AlertCircle, Sparkles, RefreshCw, CheckCircle2 } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface ProjectChapterModalProps {
  project: any | null;
  onClose: () => void;
}

export default function ProjectChapterModal({
  project,
  onClose,
}: ProjectChapterModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (project) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  const chapters = project.chapters || {};
  const hasChapters = Boolean(
    project.problem ||
      chapters.howIBuiltIt ||
      chapters.theHardParts ||
      chapters.result ||
      chapters.whatIdChange
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 md:p-10">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#040407]/80 backdrop-blur-md"
        />

        {/* Modal Window / Dossier */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: "spring", stiffness: 350, damping: 28 }}
          className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#0c0c11] border border-[#e11d2a]/30 shadow-[0_0_60px_rgba(0,0,0,0.8),0_0_40px_rgba(225,29,42,0.12)] z-10 text-slate-200"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-[#161620] border border-slate-800 text-slate-400 hover:text-white hover:border-[#e11d2a]/50 hover:bg-[#e11d2a]/20 transition-all cursor-pointer"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>

          {/* Cover image if available */}
          {project.cover && (
            <div className="relative w-full h-52 sm:h-64 overflow-hidden bg-[#101017]">
              <img
                src={project.cover}
                alt={project.title}
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c11] via-[#0c0c11]/40 to-transparent" />
            </div>
          )}

          <div className="p-6 sm:p-8 space-y-6">
            {/* Header info */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-[11px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-[#e11d2a]/15 text-[#ff4d5a] border border-[#e11d2a]/30">
                  Project Overview
                </span>
                {project.year && (
                  <span className="text-[11px] font-mono text-slate-500">
                    {project.year}
                  </span>
                )}
                {project.status && (
                  <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1 ml-auto">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    {project.status}
                  </span>
                )}
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {project.title}
              </h2>

              {project.hook && (
                <p className="text-slate-400 text-sm sm:text-base mt-2 leading-relaxed">
                  {project.hook}
                </p>
              )}
            </div>

            {/* Tech stack */}
            {project.tech?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-800/80">
                {project.tech.map((t: string) => (
                  <span
                    key={t}
                    className="text-xs font-mono text-slate-300 bg-[#161622] px-2.5 py-1 rounded-md border border-slate-800"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}

            {/* Links */}
            {project.links?.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {project.links.map((link: { label: string; url: string }, i: number) => (
                  <a
                    key={i}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#e11d2a] hover:bg-[#ff2a3b] text-white text-xs sm:text-sm font-semibold tracking-wide transition-all shadow-[0_0_15px_rgba(225,29,42,0.35)]"
                  >
                    {link.label || "Visit Project"}
                    <ExternalLink size={14} />
                  </a>
                ))}
              </div>
            )}

            {/* Chaptered deep-dive breakdown */}
            {hasChapters ? (
              <div className="space-y-6 pt-4 border-t border-slate-800">
                {/* 1. The Problem */}
                {project.problem && (
                  <div className="p-4 rounded-xl bg-[#12121a] border border-slate-800/80">
                    <div className="flex items-center gap-2 text-[#ff4d5a] font-semibold text-sm mb-2">
                      <AlertCircle size={16} />
                      <h3>The Problem</h3>
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                      {project.problem}
                    </p>
                  </div>
                )}

                {/* 2. How I Built It */}
                {chapters.howIBuiltIt && (
                  <div className="p-4 rounded-xl bg-[#12121a] border border-slate-800/80">
                    <div className="flex items-center gap-2 text-slate-200 font-semibold text-sm mb-2">
                      <Layers size={16} className="text-[#e11d2a]" />
                      <h3>Architecture & How I Built It</h3>
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                      {chapters.howIBuiltIt}
                    </p>
                  </div>
                )}

                {/* 3. The Hard Parts */}
                {chapters.theHardParts && (
                  <div className="p-4 rounded-xl bg-[#12121a] border border-slate-800/80">
                    <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm mb-2">
                      <Sparkles size={16} />
                      <h3>The Hard Parts & Engineering Hurdles</h3>
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                      {chapters.theHardParts}
                    </p>
                  </div>
                )}

                {/* 4. Results & Impact */}
                {chapters.result && (
                  <div className="p-4 rounded-xl bg-[#12121a] border border-slate-800/80">
                    <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm mb-2">
                      <CheckCircle2 size={16} />
                      <h3>Results & Impact</h3>
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                      {chapters.result}
                    </p>
                  </div>
                )}

                {/* 5. What I'd Change */}
                {chapters.whatIdChange && (
                  <div className="p-4 rounded-xl bg-[#12121a] border border-slate-800/80">
                    <div className="flex items-center gap-2 text-sky-400 font-semibold text-sm mb-2">
                      <RefreshCw size={16} />
                      <h3>What I&apos;d Do Differently</h3>
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                      {chapters.whatIdChange}
                    </p>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
