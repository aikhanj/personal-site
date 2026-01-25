'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import GlitchText from '@/components/GlitchText';

export default function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [emailRevealed, setEmailRevealed] = useState(false);

  const email = 'aj5828@princeton.edu';

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
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-cyan text-sm md:text-base tracking-[0.3em] uppercase font-light mb-2 rgb-split">
            <GlitchText intensity="medium">{'>'} SYSTEM.connect</GlitchText>
          </h2>
          <div className="h-[2px] w-24 bg-cyan" style={{ boxShadow: '0 0 10px var(--cyan), 0 0 20px var(--cyan)' }} />
        </motion.div>

        <motion.h3
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-3xl md:text-5xl font-black mb-16 text-text brutalist-heavy"
        >
          <span className="hover-corrupt">
            <GlitchText intensity="high" randomGlitchInterval={5000}>ESTABLISH CONNECTION</GlitchText>
          </span>
        </motion.h3>

        {/* Terminal Interface */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="border-2 border-crimson p-8 font-mono"
          style={{
            backgroundColor: '#0a0a0a',
            boxShadow: '0 0 20px var(--glow-crimson), inset 0 0 30px rgba(255, 0, 51, 0.05)',
          }}
        >
          {/* Command Prompt */}
          <div className="space-y-4">
            <div className="text-text-dim text-sm md:text-base">
              <span className="text-crimson glow-crimson">
                <GlitchText intensity="low">user@aikhan</GlitchText>
              </span>
              <span className="text-cyan">:</span>
              <span className="text-cyan">~</span>
              <span className="text-text">$</span>
              <span className="ml-2">
                <GlitchText intensity="low" initialScramble={true} initialScrambleDuration={500}>connect --protocol=email</GlitchText>
              </span>
            </div>

            {/* Response */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="text-text-dim text-sm md:text-base space-y-2"
            >
              <p><GlitchText intensity="low">[INFO] establishing secure channel...</GlitchText></p>
              <p><GlitchText intensity="low">[INFO] verifying credentials...</GlitchText></p>
              <p className="text-cyan signal-detected">
                <GlitchText intensity="medium">[SUCCESS] connection authorized</GlitchText>
              </p>
            </motion.div>

            {/* Email Reveal */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="pt-6 border-t-2 border-crimson/40"
            >
              <button
                onClick={() => setEmailRevealed(true)}
                className="group flex items-center gap-3 text-crimson hover:text-cyan transition-colors text-sm md:text-base hover-strobe"
                onMouseEnter={() => setEmailRevealed(true)}
              >
                <span className="text-text-dim">{'>'}</span>
                <span className="tracking-[0.2em] uppercase font-bold">
                  <GlitchText intensity="medium">REVEAL_CONTACT</GlitchText>
                </span>
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ repeat: Infinity, duration: 0.5 }}
                  className="text-magenta"
                >
                  _
                </motion.span>
              </button>

              {/* Email Address */}
              {emailRevealed && (
                <motion.div
                  initial={{ opacity: 0, x: -10, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                  transition={{ duration: 0.6 }}
                  className="mt-6 space-y-4"
                >
                  <div className="text-sm text-text-dim signal-detected">
                    <GlitchText intensity="high" initialScramble={true} initialScrambleDuration={800}>
                      [SIGNAL_DETECTED] :: decrypting...
                    </GlitchText>
                  </div>
                  <a
                    href={`mailto:${email}`}
                    className="block text-xl md:text-3xl text-crimson hover:text-cyan transition-colors hover-corrupt group"
                    style={{
                      textShadow: '0 0 10px var(--glow-crimson), 0 0 20px var(--glow-crimson)',
                    }}
                  >
                    <GlitchText intensity="extreme" initialScramble={true} initialScrambleDuration={1200} randomGlitchInterval={3000}>
                      {email}
                    </GlitchText>
                  </a>
                  <div className="text-xs text-magenta font-mono glow-magenta">
                    <GlitchText intensity="low">{'// encrypted channel available 24/7'}</GlitchText>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 1.6, duration: 0.6 }}
          className="mt-12 space-y-4 text-text-dim text-xs md:text-sm"
        >
          <p className="flicker-slow">
            <GlitchText intensity="low" randomGlitchInterval={12000}>
              Looking for: hard problems, weird ideas, people who ship.
            </GlitchText>
          </p>
          <p className="text-text-dim/50">
            <GlitchText intensity="low">{'// <24hr response · ships fast · no fluff'}</GlitchText>
          </p>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 2, duration: 0.6 }}
          className="mt-24 pt-12 border-t-2 border-crimson/20 text-center"
        >
          <p className="text-text-dim text-xs font-mono flicker-slow signal-detected">
            <GlitchText intensity="medium" randomGlitchInterval={8000}>
              [SYSTEM] :: built with intent :: deployed with purpose :: maintained by belief
            </GlitchText>
          </p>
          <p className="text-crimson/70 text-xs font-mono mt-4 tracking-[0.2em]">
            <GlitchText intensity="low">
              © {new Date().getFullYear()} AIKHAN :: ALL SYSTEMS OPERATIONAL
            </GlitchText>
          </p>
        </motion.div>
      </div>
    </section>
  );
}

