'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function Hero() {
  const [quoteVisible, setQuoteVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setQuoteVisible(true), 800);
    return () => clearTimeout(timer);
  }, []);

  const quoteText = 'Неправильный не я. Неправильный весь этот мир...';
  const words = quoteText.split(' ');

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden scanlines crt-effect">
      {/* Background glitch overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-b from-crimson/10 to-transparent" />
      </div>

      <div className="relative z-10 text-center px-8 max-w-5xl mx-auto">
        {/* Main Title - AIKHAN with glitch */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative mb-8"
        >
          <span
            className="text-[clamp(4rem,15vw,12rem)] font-bold tracking-tighter block glitch glow-crimson"
            data-text="AIKHAN"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 700,
              color: 'var(--text)',
            }}
          >
            AIKHAN
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mb-12"
        >
          <p className="text-cyan text-lg md:text-2xl tracking-widest font-light">
            municipal ai · film · systems · change
          </p>
        </motion.div>

        {/* Quote - Typing effect */}
        {quoteVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="mt-16 border-l-2 border-crimson pl-6 py-4 max-w-3xl mx-auto"
          >
            <div className="text-left">
              {words.map((word, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    delay: index * 0.15,
                    duration: 0.1,
                  }}
                  className="inline-block mr-2 text-text-dim text-base md:text-xl italic flicker-slow"
                >
                  {word}
                </motion.span>
              ))}
            </div>
          </motion.div>
        )}

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-crimson text-xs tracking-widest"
          >
            [SCROLL_TO_CONTINUE]
          </motion.div>
        </motion.div>
      </div>

      {/* Static overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02] mix-blend-overlay">
        <div className="absolute inset-0 bg-repeat" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundSize: '128px 128px',
        }} />
      </div>
    </section>
  );
}

