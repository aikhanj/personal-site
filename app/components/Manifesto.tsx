'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import GlitchText from '@/components/GlitchText';

export default function Manifesto() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const manifestoLines = [
    'what do you do when there is an evil',
    'you cannot defeat by just means?',
    '',
    'do you stain your hands with evil',
    'to destroy evil?',
    '',
    'or do you remain steadfastly just',
    'and righteous even if it means',
    'surrendering to evil?',
  ];

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center px-8 py-24"
      style={{ background: '#0a0a0a' }}
    >
      {/* Scanline overlay */}
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

      <div className="max-w-4xl w-full relative z-10">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-cyan text-sm md:text-base tracking-[0.3em] uppercase font-light mb-2 rgb-split">
            <GlitchText intensity="medium">{'>'} SYSTEM.manifesto</GlitchText>
          </h2>
          <div className="h-[2px] w-24 bg-cyan" style={{ boxShadow: '0 0 10px var(--cyan), 0 0 20px var(--cyan)' }} />
        </motion.div>

        {/* Title */}
        <motion.h3
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-4xl md:text-6xl font-black mb-16 text-text brutalist-heavy"
        >
          <span className="inline-block hover-corrupt">
            <GlitchText intensity="high" randomGlitchInterval={5000}>WHY I BUILD</GlitchText>
          </span>
        </motion.h3>
       
        {/* Manifesto Text */}
        <div
          className="space-y-6 border-l-[3px] pl-8 corruption-spread"
          style={{
            borderColor: 'var(--crimson)',
            boxShadow: '-3px 0 15px var(--glow-crimson)'
          }}
        >
          {manifestoLines.map((line, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.4 + index * 0.15, duration: 0.6 }}
              className="group relative"
            >
              {line ? (
                <>
                  <p className="text-xl md:text-3xl font-light text-text-dim hover:text-text transition-colors duration-300 cursor-default">
                    <GlitchText
                      intensity="medium"
                      trigger={false}
                      randomGlitchInterval={8000 + index * 1000}
                    >
                      {line}
                    </GlitchText>
                  </p>
                  {/* Corruption sweep effect on hover */}
                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-100 pointer-events-none"
                    style={{
                      background: 'linear-gradient(90deg, transparent 0%, rgba(255, 0, 51, 0.15) 30%, rgba(255, 0, 255, 0.1) 50%, rgba(0, 255, 213, 0.1) 70%, transparent 100%)',
                      animation: 'glitch-repair 0.4s ease-in-out',
                    }}
                  />
                </>
              ) : (
                <div className="h-6" />
              )}
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
          <p className="flicker-slow corrupted-text">
            <GlitchText intensity="low" randomGlitchInterval={10000}>
              systems rot when left unattended. bureaucracies calcify. corruption
              spreads like entropy. but code—code can be clean. logic can cut
              through the noise. every algorithm is a statement of intent. every
              deployment is an act of reconstruction.
            </GlitchText>
          </p>
        </motion.div>

        {/* System status indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 1.5, duration: 0.6 }}
          className="mt-12 flex items-center gap-3 text-xs signal-detected"
          style={{ color: 'var(--crimson)' }}
        >
          <div
            className="w-3 h-3 bg-crimson"
            style={{
              animation: 'pulse-red 1.5s ease-in-out infinite',
              boxShadow: '0 0 10px var(--crimson), 0 0 20px var(--crimson)'
            }}
          />
          <span className="tracking-[0.3em] uppercase font-bold">
            <GlitchText intensity="high" randomGlitchInterval={3000}>[STATUS: RECONSTRUCTING]</GlitchText>
          </span>
        </motion.div>
      </div>

      <style jsx>{`
        @keyframes glitch-repair {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes pulse-red {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.2);
          }
        }
      `}</style>
    </section>
  );
}

