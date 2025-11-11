"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

interface GlitchTextProps {
  children: string;
  className?: string;
  intensity?: "low" | "medium" | "high";
  trigger?: boolean;
  randomGlitch?: boolean;
  randomGlitchInterval?: number;
  initialScramble?: boolean;
  initialScrambleDuration?: number;
}

const glitchChars = "!@#$%^&*()_+-=[]{}|;:,.<>?";

export default function GlitchText({
  children,
  className = "",
  intensity = "medium",
  trigger = false,
  randomGlitch = true,
    randomGlitchInterval = 6000,
  initialScramble = false,
  initialScrambleDuration = 500,
}: GlitchTextProps) {
  const [glitched, setGlitched] = useState(initialScramble);
  const [displayText, setDisplayText] = useState(() => {
    // Start with scrambled text if initialScramble is enabled
    if (initialScramble) {
      const chars = children.split("");
      const glitchedChars = chars.map((char) => {
        if (char === " ") return " ";
        return glitchChars[Math.floor(Math.random() * glitchChars.length)];
      });
      return glitchedChars.join("");
    }
    return children;
  });
  const randomGlitchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const glitchIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isTriggerActiveRef = useRef(false);
  const glitchEndTimeRef = useRef(0);

  const intensityMap = {
    low: { duration: 30, chars: 0.1, randomChars: 0.05 },
    medium: { duration: 40, chars: 0.2, randomChars: 0.1 },
    high: { duration: 50, chars: 0.3, randomChars: 0.15 },
  };

  // Main glitch loop that runs continuously
  useEffect(() => {
    const config = intensityMap[intensity];
    
    const glitchLoop = () => {
      const now = Date.now();
      const isGlitching = now < glitchEndTimeRef.current;
      
      if (isGlitching) {
        setGlitched(true);
        const chars = children.split("");
        
        // Determine character probability based on trigger state
        const charProbability = isTriggerActiveRef.current 
          ? config.chars 
          : config.randomChars;
        
        const glitchedChars = chars.map((char, i) => {
          if (char === " ") return " ";
          if (Math.random() < charProbability) {
            return glitchChars[Math.floor(Math.random() * glitchChars.length)];
          }
          return char;
        });
        setDisplayText(glitchedChars.join(""));
      } else {
        setDisplayText(children);
        setGlitched(false);
      }
    };

    glitchIntervalRef.current = setInterval(glitchLoop, 50);

    return () => {
      if (glitchIntervalRef.current) {
        clearInterval(glitchIntervalRef.current);
      }
    };
  }, [children, intensity]);

  // Handle trigger (hover) glitches
  useEffect(() => {
    if (trigger) {
      const config = intensityMap[intensity];
      isTriggerActiveRef.current = true;
      glitchEndTimeRef.current = Math.max(
        glitchEndTimeRef.current,
        Date.now() + config.duration
      );
    } else {
      isTriggerActiveRef.current = false;
    }
  }, [trigger, intensity]);

  // Handle initial scramble on mount
  useEffect(() => {
    if (initialScramble) {
      const config = intensityMap[intensity];
      const startTime = Date.now();
      setGlitched(true);
      glitchEndTimeRef.current = startTime + initialScrambleDuration;
      
      // Gradually reveal the correct text
      const revealInterval = setInterval(() => {
        const now = Date.now();
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / initialScrambleDuration, 1);
        
        if (progress >= 1) {
          setDisplayText(children);
          setGlitched(false);
          glitchEndTimeRef.current = 0;
          clearInterval(revealInterval);
        } else {
          // Gradually reduce scrambling - start with high probability, end with 0
          const chars = children.split("");
          const charProbability = config.chars * (1 - progress);
          
          const glitchedChars = chars.map((char, i) => {
            if (char === " ") return " ";
            if (Math.random() < charProbability) {
              return glitchChars[Math.floor(Math.random() * glitchChars.length)];
            }
            return char;
          });
          setDisplayText(glitchedChars.join(""));
        }
      }, 50);
      
      return () => {
        clearInterval(revealInterval);
      };
    }
  }, [initialScramble, initialScrambleDuration, children, intensity]);

  // Handle random glitches
  useEffect(() => {
    if (!randomGlitch) return;

    const config = intensityMap[intensity];
    
    const scheduleRandomGlitch = () => {
      // Random delay between intervals (50% to 150% of base interval)
      const delay = randomGlitchInterval * (0.5 + Math.random());
      
      randomGlitchTimeoutRef.current = setTimeout(() => {
        // Random duration for the glitch (shorter than trigger glitches)
        const glitchDuration = config.duration * (0.3 + Math.random() * 0.4);
        glitchEndTimeRef.current = Math.max(
          glitchEndTimeRef.current,
          Date.now() + glitchDuration
        );
        
        // Schedule next random glitch
        scheduleRandomGlitch();
      }, delay);
    };

    scheduleRandomGlitch();

    return () => {
      if (randomGlitchTimeoutRef.current) {
        clearTimeout(randomGlitchTimeoutRef.current);
      }
    };
  }, [randomGlitch, randomGlitchInterval, intensity]);

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
      )}
    </motion.span>
  );
}

