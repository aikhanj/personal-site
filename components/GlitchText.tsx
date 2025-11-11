"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface GlitchTextProps {
  children: string;
  className?: string;
  intensity?: "low" | "medium" | "high";
  trigger?: boolean;
}

const glitchChars = "!@#$%^&*()_+-=[]{}|;:,.<>?";

export default function GlitchText({
  children,
  className = "",
  intensity = "medium",
  trigger = false,
}: GlitchTextProps) {
  const [glitched, setGlitched] = useState(false);
  const [displayText, setDisplayText] = useState(children);

  const intensityMap = {
    low: { duration: 60, chars: 0.1 },
    medium: { duration: 80, chars: 0.2 },
    high: { duration: 100, chars: 0.3 },
  };

  useEffect(() => {
    if (!trigger) return;

    const config = intensityMap[intensity];
    setGlitched(true);

    // Glitch the text
    const glitchInterval = setInterval(() => {
      const chars = children.split("");
      const glitchedChars = chars.map((char, i) => {
        if (char === " ") return " ";
        if (Math.random() < config.chars) {
          return glitchChars[Math.floor(Math.random() * glitchChars.length)];
        }
        return char;
      });
      setDisplayText(glitchedChars.join(""));
    }, 50);

    // Repair after duration
    setTimeout(() => {
      clearInterval(glitchInterval);
      setDisplayText(children);
      setGlitched(false);
    }, config.duration);

    return () => clearInterval(glitchInterval);
  }, [trigger, children, intensity]);

  return (
    <motion.span
      className={`relative inline-block ${className}`}
      animate={
        glitched
          ? {
              x: [0, -2, 2, -1, 1, 0],
              y: [0, 1, -1, 0],
            }
          : {}
      }
      transition={{ duration: 0.08, ease: "easeOut" }}
    >
      <span className="relative z-10">{displayText}</span>
      {glitched && (
        <>
          <span
            className="absolute inset-0 z-0 text-[#ff0033]"
            style={{
              clipPath: "inset(0 0 0 0)",
              transform: "translate(2px, -2px)",
              opacity: 0.8,
            }}
          >
            {displayText}
          </span>
          <span
            className="absolute inset-0 z-0 text-[#00ffd5]"
            style={{
              clipPath: "inset(0 0 0 0)",
              transform: "translate(-2px, 2px)",
              opacity: 0.8,
            }}
          >
            {displayText}
          </span>
        </>
      )}
    </motion.span>
  );
}

