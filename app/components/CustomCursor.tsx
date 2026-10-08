"use client";

import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(true);

  // Mouse coordinates
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth lagging spring for outer reticle
  const springConfig = { damping: 24, stiffness: 350, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Detect touch / non-pointer device
    if (
      typeof window === "undefined" ||
      window.matchMedia("(pointer: coarse)").matches ||
      "ontouchstart" in window
    ) {
      return;
    }

    setIsTouchDevice(false);

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    // Detect hoverable targets
    const handleOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const isInteractive =
        target.closest("a") ||
        target.closest("button") ||
        target.closest("input") ||
        target.closest("textarea") ||
        target.closest("[role='button']") ||
        target.closest(".interactive-target") ||
        target.closest(".skill-chip") ||
        target.closest(".glass-card");

      setIsHovered(Boolean(isInteractive));
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.documentElement.addEventListener("mouseleave", handleMouseLeave);
    document.documentElement.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseover", handleOver);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.documentElement.removeEventListener("mouseleave", handleMouseLeave);
      document.documentElement.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseover", handleOver);
    };
  }, [mouseX, mouseY, isVisible]);

  if (isTouchDevice) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      {/* Central Crimson Laser Dot */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-[#ff2a3b] shadow-[0_0_8px_#ff2a3b]"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: "-50%",
          translateY: "-50%",
          opacity: isVisible ? 1 : 0,
        }}
        transition={{ duration: 0.1 }}
      />

      {/* Lagging Tactical Reticle */}
      <motion.div
        className="fixed top-0 left-0 rounded-full flex items-center justify-center"
        style={{
          x: smoothX,
          y: smoothY,
          translateX: "-50%",
          translateY: "-50%",
          opacity: isVisible ? 1 : 0,
        }}
        animate={{
          width: isHovered ? 44 : isClicked ? 22 : 30,
          height: isHovered ? 44 : isClicked ? 22 : 30,
          borderColor: isHovered
            ? "rgba(255, 42, 59, 0.85)"
            : "rgba(225, 29, 42, 0.4)",
          backgroundColor: isHovered
            ? "rgba(225, 29, 42, 0.08)"
            : "transparent",
          boxShadow: isHovered
            ? "0 0 20px rgba(225, 29, 42, 0.35)"
            : "0 0 6px rgba(225, 29, 42, 0.15)",
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 25,
        }}
      >
        <div
          className={`w-full h-full rounded-full border transition-all duration-150 ${
            isHovered
              ? "border-[#ff2a3b] border-dashed animate-[spin_10s_linear_infinite]"
              : "border-[#e11d2a]/50"
          }`}
        />
      </motion.div>
    </div>
  );
}
