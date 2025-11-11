"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import GlitchText from "./GlitchText";

const titleVariants = ["> khan/", "/usr/bin/khan"];

export default function Hero() {
  // Randomly select title variant on mount using lazy initializer
  const [titleVariant] = useState<string>(() => 
    titleVariants[Math.floor(Math.random() * titleVariants.length)]
  );
  const [showMetadata, setShowMetadata] = useState(false);
  const [showQuote, setShowQuote] = useState(false);
  const [jitterOffset, setJitterOffset] = useState(0);

  useEffect(() => {

    // Show metadata after a short delay
    const timer1 = setTimeout(() => setShowMetadata(true), 400);
    
    // Show quote last, after longer delay
    const timer2 = setTimeout(() => setShowQuote(true), 1200);

    // Subtle vertical jitter every 6-8 seconds
    const jitterInterval = setInterval(() => {
      const offset = Math.random() < 0.5 ? 1 : 2;
      setJitterOffset(offset);
      setTimeout(() => setJitterOffset(0), 100);
    }, 7000 + Math.random() * 1000); // Random between 7-8 seconds

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearInterval(jitterInterval);
    };
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden terminal-hero">
      {/* Faint scanlines overlay */}
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

      {/* Main content - left-aligned, slightly low on screen */}
      <div className="relative z-10 px-6 md:px-12 lg:px-20 pt-[32vh]">
        <div className="space-y-3">
          {/* Title - terminal artifact style */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="hero-title"
            style={{
              transform: `translateY(${jitterOffset}px)`,
              transition: "transform 0.1s ease-out",
            }}
          >
            <GlitchText intensity="low" initialScramble={true} initialScrambleDuration={600}>{titleVariant}</GlitchText>
          </motion.div>

          {/* Metadata line */}
          {showMetadata && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="hero-metadata"
            >
              <GlitchText intensity="low" initialScramble={true} initialScrambleDuration={500}>[domain: municipal-ai] [focus: film, systems, change]</GlitchText>
            </motion.div>
          )}
        </div>
      </div>

      {/* Russian Quote - right-aligned, fades in last */}
      {showQuote && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="absolute bottom-20 right-6 md:right-12 lg:right-20 hero-quote text-right max-w-md"
        >
          <GlitchText intensity="high" randomGlitchInterval={2000} initialScramble={true} initialScrambleDuration={700}>Неправильный не я.</GlitchText> <br /> <GlitchText intensity="high" randomGlitchInterval={2000} initialScramble={true} initialScrambleDuration={700}>Неправильный весь этот мир.</GlitchText>
        </motion.div>
      )}
    </section>
  );
}
