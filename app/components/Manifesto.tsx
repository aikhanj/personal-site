'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export default function Manifesto() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const manifestoLines = [
    'born in bishkek.',
    'raised between systems that refused to evolve.',
    "i'm not here to play the game.",
    "i'm here to rewrite it.",
  ];

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center px-8 py-24"
    >
      <div className="max-w-4xl w-full">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-cyan text-sm md:text-base tracking-[0.3em] uppercase font-light mb-2">
            {'>'} SYSTEM.manifesto
          </h2>
          <div className="h-px w-24 bg-cyan" />
        </motion.div>

        {/* Title */}
        <motion.h3
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-4xl md:text-6xl font-bold mb-16 text-text"
        >
          <span className="inline-block hover-glitch">why i build</span>
        </motion.h3>

        {/* Manifesto Text */}
        <div className="space-y-6 border-l-2 border-crimson/30 pl-8">
          {manifestoLines.map((line, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.4 + index * 0.15, duration: 0.6 }}
              className="group relative"
            >
              <p className="text-xl md:text-3xl font-light text-text-dim hover:text-text transition-colors duration-300 cursor-default group-hover:glitch-subtle">
                {line}
              </p>
              {/* Glitch repair effect on hover */}
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-100"
                style={{
                  background: 'linear-gradient(90deg, transparent 0%, rgba(255, 0, 51, 0.1) 50%, transparent 100%)',
                  animation: 'glitch-repair 0.3s ease-in-out',
                }}
              />
            </motion.div>
          ))}
        </div>

        {/* Additional context */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="mt-16 text-text-dim text-sm md:text-base leading-relaxed max-w-2xl"
        >
          <p className="flicker-slow">
            systems rot when left unattended. bureaucracies calcify. corruption
            spreads like entropy. but code—code can be clean. logic can cut
            through the noise. every algorithm is a statement of intent. every
            deployment is an act of reconstruction.
          </p>
        </motion.div>

        {/* System status indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 1.5, duration: 0.6 }}
          className="mt-12 flex items-center gap-3 text-xs text-crimson"
        >
          <div className="w-2 h-2 bg-crimson animate-pulse" />
          <span className="tracking-wider">[STATUS: RECONSTRUCTING]</span>
        </motion.div>
      </div>

      <style jsx>{`
        @keyframes glitch-repair {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </section>
  );
}

