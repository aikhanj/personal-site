"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import GlitchText from "./GlitchText";
import Terminal from "./Terminal";

const titleVariants = ["> khan/", "/usr/bin/khan"];

export default function Hero() {
  // Randomly select title variant on mount using lazy initializer
  const [titleVariant] = useState<string>(() => 
    titleVariants[Math.floor(Math.random() * titleVariants.length)]
  );
  const [showMetadata, setShowMetadata] = useState(false);
  const [showQuote, setShowQuote] = useState(false);
  const [jitterOffset, setJitterOffset] = useState(0);
  const [windowHeight, setWindowHeight] = useState(0);
  const [windowWidth, setWindowWidth] = useState(0);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Calculate window dimensions for quote positioning
    const updateDimensions = () => {
      setWindowHeight(window.innerHeight);
      setWindowWidth(window.innerWidth);
    };

    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse position to -1 to 1
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      setMousePos({ x, y });
    };

    // Set initial dimensions
    updateDimensions();

    // Update on resize
    window.addEventListener('resize', updateDimensions);
    window.addEventListener('mousemove', handleMouseMove);

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
      window.removeEventListener('resize', updateDimensions);
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearInterval(jitterInterval);
    };
  }, []);

  // Calculate dynamic chromatic aberration based on mouse position
  const dynamicShadow = `
    ${-mousePos.x * 5}px 0 0 rgba(255, 0, 51, 0.4),
    ${mousePos.x * 5}px 0 0 rgba(0, 255, 213, 0.4),
    0 ${-mousePos.y * 2}px 10px rgba(255, 0, 255, 0.2)
  `;

  return (
    <section className="relative min-h-screen overflow-hidden terminal-hero">
      {/* Scanlines overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `repeating-linear-gradient(
            0deg,
            rgba(200, 200, 200, 0.02) 0px,
            transparent 1px,
            transparent 2px
          )`,
          opacity: 0.5,
        }}
      />


      {/* Main content - 90% width container */}
      <div className="relative z-10 w-[90%] max-w-6xl mx-auto pt-28 pb-24 md:pt-[32vh] md:pb-32">
        <div className="space-y-4">
          {/* Title - terminal artifact style */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="hero-title"
            style={{
              transform: `translateY(${jitterOffset}px)`,
              transition: "transform 0.1s ease-out",
              textShadow: dynamicShadow,
              animation: 'none' // Override static animation for mouse-reactive shadow
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
              style={{ textShadow: dynamicShadow.replace('5px', '2px') }}
            >
              <GlitchText intensity="low" initialScramble={true} initialScrambleDuration={500}>[domain: kyrgyzstan] [focus: film, systems, change]</GlitchText>
            </motion.div>
          )}
        </div>
      </div>

      {/* Terminal - centered in hero */}
      <div
        className="absolute left-1/2 top-[45%] -translate-x-1/2 -translate-y-1/2 z-10 w-full"
      >
        <Terminal />
      </div>

      {/* Russian Quote - positioned at bottom right based on screen height */}
      {showQuote && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="absolute z-10 hero-quote text-right max-w-md screen-tear"
          style={{
            right: windowWidth >= 1024 ? '5rem' : windowWidth >= 768 ? '3rem' : '1.5rem',
            bottom: windowHeight > 0 ? `${Math.max(60, windowHeight * 0.08)}px` : '60px',
            textShadow: dynamicShadow
          }}
        >
          <GlitchText intensity="extreme" randomGlitchInterval={1500} initialScramble={true} initialScrambleDuration={900}>Неправильный не я.</GlitchText> <br /> <GlitchText intensity="extreme" randomGlitchInterval={1500} initialScramble={true} initialScrambleDuration={900}>Неправильный весь этот мир.</GlitchText>
        </motion.div>
      )}
    </section>
  );
}
