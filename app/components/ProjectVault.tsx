"use client";

import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
} from "framer-motion";
import {
  Heart,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  X,
} from "lucide-react";
import Image from "next/image";
import { track } from "@/lib/track";

/* ------------------------------------------------------------------ */
/*  Types & Data                                                       */
/* ------------------------------------------------------------------ */

export interface VaultProject {
  id: string;
  slug: string;
  title: string;
  hook: string;
  tech: string[];
  year: string;
  status: string;
  link: string;
  image: string;
}

// Fallback data when no props are passed (used when DB is unavailable)
const DEFAULT_PROJECTS: VaultProject[] = [
  {
    id: "p1",
    slug: "rabuste-coffee",
    title: "Rabuste Full-Stack Cafe Platform",
    hook: "A production-ready cafe management system with ordering, payments & rewards.",
    tech: ["Next.js", "TypeScript", "Supabase", "Prisma", "Razorpay", "Tailwind"],
    year: "2025",
    status: "Live",
    link: "https://rabustecoffee.vercel.app",
    image: "/image.png",
  },
  {
    id: "p2",
    slug: "sehat-mitra",
    title: "Sehat Mitra AI Assistant",
    hook: "Healthcare assistant that turns symptoms into preliminary prescriptions using NLP.",
    tech: ["React.js", "Python (Flask)", "NLP"],
    year: "2025",
    status: "Completed",
    link: "https://github.com/akashprofile/makernova-project",
    image: "/image copy.png",
  },
  {
    id: "p3",
    slug: "nextevent-now",
    title: "NextEvent Now",
    hook: "Campus event discovery — never miss a fest, talk, or hackathon again.",
    tech: ["React.js", "Node.js", "MongoDB"],
    year: "2024",
    status: "Live",
    link: "https://nexteventnow.netlify.app",
    image: "/image copy 2.png",
  },
];

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export default function ProjectVault({ projects: propProjects }: { projects?: VaultProject[] }) {
  const PROJECTS = propProjects && propProjects.length > 0 ? propProjects : DEFAULT_PROJECTS;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState<1 | -1>(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [likedProjects, setLikedProjects] = useState<Record<string, boolean>>({});
  const [showHeartBurst, setShowHeartBurst] = useState(false);
  const [burstCoords, setBurstCoords] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
  const [isInView, setIsInView] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const lastTapRef = useRef<number>(0);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const prefersReduced = useReducedMotion();

  const totalCards = PROJECTS.length;
  const activeProject = PROJECTS[currentIndex];
  const selectedProject = PROJECTS.find((p) => p.id === selectedId) ?? null;
  const isCurrentLiked = Boolean(likedProjects[activeProject?.id]);

  /* ----- Viewport Tracking (once per session) ----- */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
        if (entry.isIntersecting) {
          if (typeof window !== "undefined") {
            const viewed = sessionStorage.getItem("vault_viewed");
            if (!viewed) {
              sessionStorage.setItem("vault_viewed", "true");
              track({ type: "vault_view" });
            }
          }
        }
      },
      { threshold: 0.15 }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  /* ----- Navigation: Next & Prev ----- */
  const goNext = useCallback(() => {
    if (currentIndex < totalCards - 1) {
      setSlideDirection(1);
      setCurrentIndex((prev) => prev + 1);
    }
  }, [currentIndex, totalCards]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      setSlideDirection(-1);
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex]);

  const goToCard = useCallback(
    (index: number) => {
      if (index === currentIndex) return;
      setSlideDirection(index > currentIndex ? 1 : -1);
      setCurrentIndex(index);
    },
    [currentIndex]
  );

  /* ----- Like Action (Double click/tap) ----- */
  const triggerLike = useCallback(
    (coords?: { x: number; y: number }) => {
      if (!activeProject) return;

      setLikedProjects((prev) => {
        const nextState = !prev[activeProject.id];
        track({
          type: "vote",
          projectSlug: activeProject.slug,
          meta: { value: nextState ? "like" : "unlike" },
        });
        return { ...prev, [activeProject.id]: nextState };
      });

      if (coords) {
        setBurstCoords(coords);
      } else {
        setBurstCoords({ x: 50, y: 50 });
      }

      setShowHeartBurst(true);
      setTimeout(() => setShowHeartBurst(false), 700);
    },
    [activeProject]
  );

  /* ----- Click & Double-Click on Card ----- */
  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickXPercent = ((e.clientX - rect.left) / rect.width) * 100;
    const clickYPercent = ((e.clientY - rect.top) / rect.height) * 100;

    const now = Date.now();
    // Double click / tap detected
    if (now - lastTapRef.current < 320) {
      triggerLike({ x: clickXPercent, y: clickYPercent });
      lastTapRef.current = 0;
      return;
    }
    lastTapRef.current = now;

    // Single click: left 25% goes prev, right 25% goes next
    if (clickXPercent < 25) {
      goPrev();
    } else if (clickXPercent > 75) {
      goNext();
    }
  };

  /* ----- Mobile Touch Swiping (no scroll hijacking) ----- */
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const dx = e.changedTouches[0].clientX - touchStartRef.current.x;
    const dy = e.changedTouches[0].clientY - touchStartRef.current.y;
    touchStartRef.current = null;

    // Only swipe if horizontal movement is dominant and > 35px
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 35) {
      if (dx < 0) {
        goNext();
      } else {
        goPrev();
      }
    }
  };

  /* ----- Keyboard Navigation ----- */
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!isInView || selectedId) return;

      if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isInView, selectedId, goNext, goPrev]);

  /* ----- Slide Animation Variants ----- */
  const slideVariants = {
    enter: (direction: number) =>
      prefersReduced
        ? { opacity: 0 }
        : {
            x: direction > 0 ? 120 : -120,
            opacity: 0,
            scale: 0.98,
          },
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 380,
        damping: 34,
        mass: 0.8,
      },
    },
    exit: (direction: number) =>
      prefersReduced
        ? { opacity: 0 }
        : {
            x: direction > 0 ? -200 : 200,
            opacity: 0,
            scale: 0.96,
            transition: {
              type: "spring" as const,
              stiffness: 500,
              damping: 40,
            },
          },
  };

  return (
    <section
      ref={sectionRef}
      id="vault"
      className="py-20 px-4 md:px-6 max-w-7xl mx-auto w-full scroll-mt-20"
    >
      {/* Section Heading aligned exactly with other portfolio sections */}
      <div className="mb-10">
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold animated-gradient-text"
        >
          Project Vault
        </motion.h2>
        <p className="text-slate-400 text-sm mt-2">
          Click the sides or swipe to explore • Double-click or double-tap to like
        </p>
      </div>

      {/* Hidden Image Preloader — all project images cached eagerly */}
      <div className="hidden" aria-hidden="true">
        {PROJECTS.map((p) => (
          <Image
            key={`preload-${p.id}`}
            src={p.image}
            alt=""
            width={1}
            height={1}
            priority
            unoptimized
          />
        ))}
      </div>

      {/* Main Deck Outer Wrapper */}
      <div className="relative w-full pt-4 pb-2">
        {/* Left Navigation Chevron Button (Desktop) */}
        {currentIndex > 0 && (
          <button
            type="button"
            onClick={goPrev}
            className="hidden md:flex absolute -left-5 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-slate-900/90 border border-slate-700/80 hover:border-blue-500/80 text-white shadow-2xl items-center justify-center transition-all hover:scale-110 active:scale-95"
            aria-label="Previous project (ArrowLeft)"
            title="Previous (ArrowLeft)"
          >
            <ChevronLeft size={24} />
          </button>
        )}

        {/* Right Navigation Chevron Button (Desktop) */}
        {currentIndex < totalCards - 1 && (
          <button
            type="button"
            onClick={goNext}
            className="hidden md:flex absolute -right-5 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-slate-900/90 border border-slate-700/80 hover:border-blue-500/80 text-white shadow-2xl items-center justify-center transition-all hover:scale-110 active:scale-95"
            aria-label="Next project (ArrowRight)"
            title="Next (ArrowRight)"
          >
            <ChevronRight size={24} />
          </button>
        )}

        {/* Deck Stack Viewport */}
        <div
          className="relative w-full h-[80vh] md:h-[75vh] min-h-[500px] max-h-[800px] rounded-2xl select-none"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          style={{ touchAction: "pan-y" }}
        >
          {/* Peeking Under-Card 2 */}
          {currentIndex + 2 < totalCards && (
            <div
              className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none transition-all duration-300"
              style={{
                transform: "translateY(-14px) scale(0.96)",
                opacity: 0.35,
                zIndex: 1,
                border: "1px solid rgba(255, 255, 255, 0.08)",
                background: "#020617",
              }}
              aria-hidden="true"
            >
              <Image
                src={PROJECTS[currentIndex + 2].image}
                alt=""
                fill
                className="object-cover object-top"
                sizes="(max-width: 768px) 100vw, 1152px"
              />
              <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-[2px]" />
            </div>
          )}

          {/* Peeking Under-Card 1 */}
          {currentIndex + 1 < totalCards && (
            <div
              className="absolute inset-0 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:opacity-90"
              style={{
                transform: "translateY(-7px) scale(0.98)",
                opacity: 0.65,
                zIndex: 2,
                border: "1px solid rgba(255, 255, 255, 0.12)",
                background: "#020617",
              }}
              onClick={goNext}
              aria-hidden="true"
            >
              <Image
                src={PROJECTS[currentIndex + 1].image}
                alt=""
                fill
                className="object-cover object-top"
                sizes="(max-width: 768px) 100vw, 1152px"
              />
              <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-[1px]" />
            </div>
          )}

          {/* Active Front Card */}
          <AnimatePresence mode="popLayout" custom={slideDirection}>
            {activeProject && (
              <motion.div
                key={activeProject.id}
                custom={slideDirection}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                onClick={handleCardClick}
                className="absolute inset-0 rounded-2xl overflow-hidden bg-slate-950 cursor-pointer shadow-[0_20px_60px_rgba(0,0,0,0.8)] border border-slate-800/90"
                style={{ zIndex: 10 }}
              >
                {/* Screenshot Image — fills the entire card */}
                <div className="relative w-full h-full">
                  <Image
                    src={activeProject.image}
                    alt={activeProject.title}
                    fill
                    priority
                    className="object-cover object-top"
                    sizes="(max-width: 768px) 100vw, 1152px"
                  />
                </div>

                {/* Top-right: Counter Pill only — no progress bars obscuring the image */}
                <div
                  className="absolute top-3 right-3 md:top-4 md:right-4 z-20"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="text-xs font-mono font-medium text-white/90 bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-full">
                    {currentIndex + 1} / {totalCards}
                  </div>
                </div>

                {/* Dot indicators — minimal, at top-left */}
                <div
                  className="absolute top-3 left-3 md:top-4 md:left-4 z-20 flex items-center gap-1.5"
                  onClick={(e) => e.stopPropagation()}
                >
                  {PROJECTS.map((p, idx) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => goToCard(idx)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        idx === currentIndex
                          ? "bg-white scale-110"
                          : idx < currentIndex
                          ? "bg-white/50"
                          : "bg-white/25"
                      }`}
                      aria-label={`View ${p.title}`}
                    />
                  ))}
                </div>

                {/* Double-Click Heart Burst Animation */}
                <AnimatePresence>
                  {showHeartBurst && (
                    <motion.div
                      className="absolute pointer-events-none z-40 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
                      style={{ left: `${burstCoords.x}%`, top: `${burstCoords.y}%` }}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: [0, 1.4, 1.1], opacity: [0, 1, 0.95] }}
                      exit={{ scale: 1.5, opacity: 0 }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                      <Heart className="w-20 h-20 text-rose-500 fill-rose-500 filter drop-shadow-[0_0_30px_rgba(244,63,94,0.85)]" />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Bottom overlay — tight gradient that only covers the text zone */}
                <div
                  className="absolute inset-x-0 bottom-0 z-20"
                  style={{
                    background: 'linear-gradient(to top, rgba(2,6,23,0.95) 0%, rgba(2,6,23,0.85) 50px, rgba(2,6,23,0.4) 80px, transparent 120px)',
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="px-5 md:px-7 pb-5 pt-16 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                    {/* Left: Title & Hook Teaser */}
                    <div className="space-y-1 min-w-0 flex-1">
                      <h3 className="text-lg md:text-xl font-bold text-white tracking-tight truncate">
                        {activeProject.title}
                      </h3>
                      <p className="text-xs md:text-sm text-slate-300/80 line-clamp-1 leading-snug">
                        {activeProject.hook}
                      </p>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      {/* Like Toggle */}
                      <button
                        type="button"
                        onClick={() => triggerLike()}
                        className={`min-h-[36px] min-w-[36px] px-3 py-1.5 rounded-full border flex items-center gap-1.5 text-xs font-medium transition-all ${
                          isCurrentLiked
                            ? "bg-rose-950/70 border-rose-500/60 text-rose-300"
                            : "bg-white/10 border-white/15 text-white/70 hover:text-white hover:bg-white/20"
                        }`}
                        aria-label={isCurrentLiked ? "Unlike project" : "Like project"}
                      >
                        <Heart
                          size={14}
                          className={isCurrentLiked ? "fill-rose-500 text-rose-500" : ""}
                        />
                        <span className="hidden sm:inline">{isCurrentLiked ? "Liked" : "Like"}</span>
                      </button>

                      {/* Live Link */}
                      {activeProject.link && (
                        <a
                          href={activeProject.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="min-h-[36px] min-w-[36px] p-2 rounded-full bg-white/10 border border-white/15 hover:bg-white/20 text-white/70 hover:text-white flex items-center justify-center transition-all"
                          aria-label={`Open ${activeProject.title} live demo`}
                        >
                          <ExternalLink size={14} />
                        </a>
                      )}

                      {/* View Details Button */}
                      <button
                        type="button"
                        onClick={() => {
                          track({
                            type: "project_open",
                            projectSlug: activeProject.slug,
                          });
                          setSelectedId(activeProject.id);
                        }}
                        className="min-h-[36px] px-4 py-1.5 rounded-full bg-white/15 hover:bg-white/25 border border-white/20 text-white text-xs font-medium transition-all"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Lightweight Detail Bottom Sheet */}
      <AnimatePresence>
        {selectedProject && (
          <>
            {/* Backdrop */}
            <motion.div
              className="vault-sheet-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setSelectedId(null)}
            />

            {/* Sheet */}
            <motion.div
              className="vault-sheet"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={
                prefersReduced
                  ? { duration: 0.2, ease: "easeInOut" }
                  : { type: "spring", stiffness: 400, damping: 34 }
              }
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.4 }}
              onDragEnd={(_, info) => {
                if (info.offset.y > 100) setSelectedId(null);
              }}
            >
              {/* Drag Handle */}
              <div className="vault-sheet-handle-wrap">
                <div className="vault-sheet-handle" />
              </div>

              {/* Close Button */}
              <button
                type="button"
                className="vault-sheet-close"
                onClick={() => setSelectedId(null)}
                aria-label="Close project details"
              >
                <X size={20} />
              </button>

              {/* Cover Image */}
              <div className="vault-sheet-cover">
                <Image
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  fill
                  className="vault-card-img"
                  sizes="(max-width: 768px) 100vw, 800px"
                />
              </div>

              {/* Content */}
              <div className="vault-sheet-body">
                <h2 className="vault-sheet-title">{selectedProject.title}</h2>
                <p className="vault-sheet-hook">{selectedProject.hook}</p>

                <div className="vault-sheet-meta">
                  <span>{selectedProject.year}</span>
                  <span className="vault-sheet-status">
                    <span className="vault-status-dot" />
                    {selectedProject.status}
                  </span>
                </div>

                <div className="vault-sheet-tech">
                  {selectedProject.tech.map((t) => (
                    <span key={t} className="vault-tech-pill">
                      {t}
                    </span>
                  ))}
                </div>

                {selectedProject.link && (
                  <a
                    href={selectedProject.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="vault-sheet-link"
                  >
                    <ExternalLink size={16} />
                    <span>View Project</span>
                  </a>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
