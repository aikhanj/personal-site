'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';

export default function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [emailRevealed, setEmailRevealed] = useState(false);

  const email = 'aj5828@princeton.edu';

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center px-8 py-24"
    >
      <div className="max-w-4xl w-full">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-cyan text-sm md:text-base tracking-[0.3em] uppercase font-light mb-2">
            {'>'} SYSTEM.connect
          </h2>
          <div className="h-px w-24 bg-cyan" />
        </motion.div>

        <motion.h3
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-3xl md:text-5xl font-bold mb-16 text-text"
        >
          establish connection
        </motion.h3>

        {/* Terminal Interface */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="border border-crimson/30 p-8 font-mono"
          style={{ backgroundColor: '#080808' }}
        >
          {/* Command Prompt */}
          <div className="space-y-4">
            <div className="text-text-dim text-sm md:text-base">
              <span className="text-crimson">user@aikhan</span>
              <span className="text-cyan">:</span>
              <span className="text-cyan">~</span>
              <span className="text-text">$</span>
              <span className="ml-2">connect --protocol=email</span>
            </div>

            {/* Response */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="text-text-dim text-sm md:text-base space-y-2"
            >
              <p>[INFO] establishing secure channel...</p>
              <p>[INFO] verifying credentials...</p>
              <p className="text-cyan">[SUCCESS] connection authorized</p>
            </motion.div>

            {/* Email Reveal */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="pt-6 border-t border-text-dim/20"
            >
              <button
                onClick={() => setEmailRevealed(true)}
                className="group flex items-center gap-3 text-crimson hover:text-cyan transition-colors text-sm md:text-base"
                onMouseEnter={() => setEmailRevealed(true)}
              >
                <span className="text-text-dim">{'>'}</span>
                <span className="tracking-wider">REVEAL_CONTACT</span>
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                >
                  _
                </motion.span>
              </button>

              {/* Email Address */}
              {emailRevealed && (
                <motion.div
                  initial={{ opacity: 0, x: -10, filter: 'blur(5px)' }}
                  animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                  transition={{ duration: 0.4 }}
                  className="mt-6 space-y-4"
                >
                  <div className="text-sm text-text-dim">
                    [CONTACT_INFO] :: decrypting...
                  </div>
                  <a
                    href={`mailto:${email}`}
                    className="block text-xl md:text-3xl text-crimson hover:text-cyan transition-colors glitch-subtle group"
                  >
                    {email.split('').map((char, i) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.02 * i, duration: 0.1 }}
                        className="inline-block"
                      >
                        {char}
                      </motion.span>
                    ))}
                  </a>
                  <div className="text-xs text-text-dim font-mono">
                    {'// encrypted channel available 24/7'}
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
            [NOTE] :: collaboration opportunities: municipal ai systems, research
            partnerships, system reconstruction projects
          </p>
          <p className="text-text-dim/50">
            {'// response time: variable. quality: guaranteed.'}
          </p>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 2, duration: 0.6 }}
          className="mt-24 pt-12 border-t border-text-dim/10 text-center"
        >
          <p className="text-text-dim text-xs font-mono flicker-slow">
            [SYSTEM] :: built with intent :: deployed with purpose :: maintained
            by belief
          </p>
          <p className="text-text-dim/50 text-xs font-mono mt-4">
            © {new Date().getFullYear()} AIKHAN :: all systems operational
          </p>
        </motion.div>
      </div>
    </section>
  );
}

