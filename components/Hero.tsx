"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import GlitchText from "./GlitchText";

export default function Hero() {
  const [glitchTrigger, setGlitchTrigger] = useState(false);

  useEffect(() => {
    // Trigger glitch periodically
    const interval = setInterval(() => {
      setGlitchTrigger(true);
      setTimeout(() => setGlitchTrigger(false), 100);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* CRT Background Effects */}
      <div className="absolute inset-0">
        {/* Flickering CRT Reflections */}
        <motion.div
          className="absolute inset-0"
          animate={{
            opacity: [0.05, 0.08, 0.05],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            background:
              "linear-gradient(135deg, rgba(255, 0, 51, 0.1) 0%, rgba(0, 255, 213, 0.1) 100%)",
          }}
        />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 text-center px-4">
        {/* Glitching AIKHAN */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-6"
        >
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight">
            <GlitchText
              trigger={glitchTrigger}
              intensity="high"
              className="text-[#d0d0d0] drop-shadow-[0_0_20px_rgba(255,0,51,0.5)]"
            >
              AIKHAN
            </GlitchText>
          </h1>
        </motion.div>

        {/* Subheadline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-8"
        >
          <p className="text-lg md:text-xl text-[#d0d0d0] font-light tracking-wider">
            municipal ai · film · systems · change
          </p>
        </motion.div>

        {/* Russian Quote */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <p className="text-base md:text-lg text-[#d0d0d0] italic leading-relaxed">
            "Неправильный не я. Неправильный весь этот мир..."
          </p>
        </motion.div>
      </div>

      {/* Moving Scanlines Overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `repeating-linear-gradient(
            0deg,
            rgba(0, 255, 213, 0.03) 0px,
            rgba(0, 255, 213, 0.03) 1px,
            transparent 1px,
            transparent 2px
          )`,
          animation: "scanline 10s linear infinite",
        }}
      />
    </section>
  );
}

