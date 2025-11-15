"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView, Variants } from "framer-motion";
import achievementsData from "@/data/achievements.json";
import GlitchText from "./GlitchText";

interface Achievement {
  timestamp: string;
  entry: string;
}

// Typing effect hook with reduced motion support
function useTypingEffect(text: string, speed: number = 50, enabled: boolean = true) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    if (!enabled) {
      setDisplayedText(text);
      setIsTyping(false);
      return;
    }

    let currentIndex = 0;
    setDisplayedText('');
    setIsTyping(true);

    const interval = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayedText(text.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, enabled]);

  return { displayedText, isTyping };
}

// Extract competition names and keywords from entry for accent coloring
function parseEntry(entry: string): { parts: Array<{ text: string; isCompetition: boolean }> } {
  // Keywords to highlight in red
  const highlightPatterns = [
    /math\.olympiad\([^)]+\)/g,
    /math\.amc\d+/g,
    /republic\.olympiad/g,
    /crimson\.18u18\.global/g,
    /18u18\.global/g,
    /inspirit\.ai/g,
    /ikyrgyz\.project/g,
    /research:/g,
    /press:/g,
  ];

  const parts: Array<{ text: string; isCompetition: boolean }> = [];
  let lastIndex = 0;
  const foundMatches: Array<{ start: number; end: number }> = [];

  highlightPatterns.forEach(pattern => {
    const matches = entry.matchAll(pattern);
    for (const match of matches) {
      if (match.index !== undefined) {
        foundMatches.push({ start: match.index, end: match.index + match[0].length });
      }
    }
  });

  // Sort matches by start position
  foundMatches.sort((a, b) => a.start - b.start);

  // Merge overlapping matches
  const mergedMatches: Array<{ start: number; end: number }> = [];
  for (const match of foundMatches) {
    if (mergedMatches.length === 0 || mergedMatches[mergedMatches.length - 1].end < match.start) {
      mergedMatches.push(match);
    } else {
      mergedMatches[mergedMatches.length - 1].end = Math.max(
        mergedMatches[mergedMatches.length - 1].end,
        match.end
      );
    }
  }

  // Build parts array
  for (const match of mergedMatches) {
    if (match.start > lastIndex) {
      parts.push({ text: entry.slice(lastIndex, match.start), isCompetition: false });
    }
    parts.push({ text: entry.slice(match.start, match.end), isCompetition: true });
    lastIndex = match.end;
  }

  if (lastIndex < entry.length) {
    parts.push({ text: entry.slice(lastIndex), isCompetition: false });
  }

  // If no matches found, return entire entry as single part
  if (parts.length === 0) {
    parts.push({ text: entry, isCompetition: false });
  }

  return { parts };
}

export default function Achievements() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    // Check for prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    // Defer initial state update to avoid synchronous setState
    requestAnimationFrame(() => {
      setReducedMotion(mediaQuery.matches);
    });

    const handleChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: reducedMotion ? 0 : 0.25,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: reducedMotion ? 0.01 : 0.6,
        ease: [0.17, 0.67, 0.83, 0.67] as const,
      },
    },
  };

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center px-6 md:px-12 lg:px-20 py-24 overflow-hidden"
      style={{ backgroundColor: '#080808' }}
    >
      {/* Scanline overlay - same as hero */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `repeating-linear-gradient(
            0deg,
            rgba(200, 200, 200, 0.015) 0px,
            transparent 1px,
            transparent 2px
          )`,
          opacity: 0.5,
        }}
      />

      <div className="relative z-10 max-w-4xl w-full">
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: reducedMotion ? 0.01 : 0.6 }}
          className="mb-8"
        >
          {/* Access level meta */}
          <div
            className="text-xs md:text-sm font-mono mb-4"
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              color: '#888888',
              letterSpacing: '0.02em',
            }}
          >
            <GlitchText intensity="low">[ACCESS LEVEL: public]</GlitchText>
          </div>

          {/* Section header */}
          <div
            className="text-sm md:text-base font-mono mb-4"
            style={{
              fontFamily: "'OCR-A Extended', 'IBM Plex Mono', monospace",
              color: '#c8c8c8',
              letterSpacing: '0.04em',
            }}
          >
            <GlitchText intensity="low">&gt; achievements.log</GlitchText>
          </div>

          {/* Terminal command */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: reducedMotion ? 0 : 0.3, duration: reducedMotion ? 0.01 : 0.6 }}
            className="text-xs md:text-sm font-mono mb-6"
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              color: '#888888',
              letterSpacing: '0.02em',
            }}
          >
            <GlitchText intensity="low">$ head -n -10 achievements.log</GlitchText>
          </motion.div>
        </motion.div>

        {/* Log entries */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="space-y-1 font-mono text-xs md:text-sm"
          style={{
            fontFamily: "'OCR-A Extended', 'IBM Plex Mono', monospace",
          }}
        >
          {achievementsData.map((achievement: Achievement, index: number) => {
            const { parts } = parseEntry(achievement.entry);
            const typingSpeed = reducedMotion ? 0 : 50; // 50ms per char
            const shouldType = !reducedMotion && index < 3; // Only type first 3 entries
            
            return (
              <AchievementLine
                key={achievement.timestamp}
                achievement={achievement}
                parts={parts}
                index={index}
                variants={itemVariants}
                typingSpeed={typingSpeed}
                shouldType={shouldType}
                reducedMotion={reducedMotion}
              />
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

function AchievementLine({
  achievement,
  parts,
  index,
  variants,
  typingSpeed,
  shouldType,
  reducedMotion,
}: {
  achievement: Achievement;
  parts: Array<{ text: string; isCompetition: boolean }>;
  index: number;
  variants: Variants;
  typingSpeed: number;
  shouldType: boolean;
  reducedMotion: boolean;
}) {
  const fullEntry = achievement.entry;
  const { displayedText, isTyping }: { displayedText: string; isTyping: boolean } = useTypingEffect(
    fullEntry,
    typingSpeed,
    shouldType && !reducedMotion
  );

  // Render text with competition highlighting
  const renderText = (text: string) => {
    if (!shouldType || reducedMotion) {
      // Static rendering - use pre-parsed parts
      return parts.map((part, partIndex) => (
        <span
          key={partIndex}
          style={{
            color: part.isCompetition ? '#ff0033' : '#c8c8c8',
          }}
        >
          <GlitchText intensity="low">{part.text}</GlitchText>
        </span>
      ));
    }

    // Typing effect - parse displayed text on the fly
    const displayParts = parseEntry(displayedText);
    return displayParts.parts.map((part, partIndex) => (
      <span
        key={partIndex}
        style={{
          color: part.isCompetition ? '#ff0033' : '#c8c8c8',
        }}
      >
        <GlitchText intensity="low">{part.text}</GlitchText>
      </span>
    ));
  };

  return (
    <motion.div
      variants={variants}
      className="leading-tight"
      style={{
        color: '#c8c8c8',
        letterSpacing: '0.02em',
      }}
    >
      <span style={{ color: '#c8c8c8' }}><GlitchText intensity="low">{`[${achievement.timestamp}]`}</GlitchText></span>{' '}
      {renderText(shouldType && !reducedMotion ? displayedText : achievement.entry)}
      {isTyping && !reducedMotion && (
        <span
          className="inline-block w-[2px] h-[1em] ml-[3px] align-baseline"
          style={{
            background: '#00ffd5',
            animation: 'cursor-blink 1s step-end infinite',
          }}
        />
      )}
    </motion.div>
  );
}
