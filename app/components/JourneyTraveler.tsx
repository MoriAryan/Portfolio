"use client";

import React from "react";
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from "framer-motion";

export default function JourneyTraveler() {
  const isReduced = useReducedMotion();
  const { scrollYProgress } = useScroll();

  const smoothY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 25,
    mass: 0.6,
  });

  const travelerY = useTransform(smoothY, [0, 1], ["6vh", "90vh"]);
  const travelerOpacity = useTransform(smoothY, [0, 0.05, 0.95, 1], [0, 0.7, 0.7, 0]);

  if (isReduced) return null;

  return (
    <div
      aria-hidden="true"
      className="hidden xl:block fixed left-5 top-0 bottom-0 pointer-events-none z-30 select-none"
    >
      {/* Delicate vertical guide */}
      <div className="absolute top-12 bottom-12 left-1.5 w-px bg-gradient-to-b from-transparent via-slate-800/50 to-transparent" />

      {/* Subtle traveling node */}
      <motion.div
        style={{
          y: travelerY,
          opacity: travelerOpacity,
        }}
        className="relative flex items-center"
      >
        <div className="w-3 h-3 rounded-full bg-[#111118] border border-[#e11d2a] shadow-[0_0_8px_rgba(225,29,42,0.5)] flex items-center justify-center">
          <div className="w-1 h-1 rounded-full bg-[#ff2a3b]" />
        </div>
      </motion.div>
    </div>
  );
}
