'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import achievementsData from '@/data/achievements.json';

export default function Achievements() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center px-8 py-24"
    >
      <div className="max-w-5xl w-full">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-cyan text-sm md:text-base tracking-[0.3em] uppercase font-light mb-2">
            {'>'} SYSTEM.logs
          </h2>
          <div className="h-px w-24 bg-cyan" />
        </motion.div>

        <motion.h3
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-3xl md:text-5xl font-bold mb-16 text-text"
        >
          achievements<span className="text-crimson terminal-cursor" />
        </motion.h3>

        {/* Log Entries */}
        <div className="space-y-1 font-mono text-xs md:text-sm">
          {achievementsData.map((achievement, index) => (
            <motion.div
              key={achievement.timestamp}
              initial={{ opacity: 0, x: -20, filter: 'blur(5px)' }}
              animate={isInView ? { opacity: 1, x: 0, filter: 'blur(0px)' } : {}}
              transition={{
                delay: 0.4 + index * 0.15,
                duration: 0.6,
                ease: 'easeOut',
              }}
              className="group py-3 px-4 border-l-2 border-transparent hover:border-crimson hover:bg-crimson/5 transition-all duration-200 cursor-default"
            >
              <div className="flex flex-col md:flex-row md:items-start gap-2 md:gap-4">
                {/* Timestamp */}
                <span className="text-text-dim whitespace-nowrap font-light">
                  [{achievement.timestamp}]
                </span>

                {/* Type */}
                <span
                  className={`uppercase tracking-wider whitespace-nowrap ${
                    achievement.type === 'research'
                      ? 'text-cyan'
                      : 'text-crimson'
                  }`}
                >
                  {achievement.type}:
                </span>

                {/* Title */}
                <span className="text-text group-hover:text-white transition-colors flex-1">
                  {achievement.title}
                </span>

                {/* Publication */}
                <span className="text-text-dim text-xs md:text-sm">
                  – {achievement.publication}
                </span>
              </div>

              {/* Decrypt effect overlay */}
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none"
                initial={false}
              >
                <div
                  className="h-full w-full"
                  style={{
                    background:
                      'linear-gradient(90deg, transparent 0%, rgba(0, 255, 213, 0.05) 50%, transparent 100%)',
                  }}
                />
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Footer status */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 1.5, duration: 0.6 }}
          className="mt-12 text-text-dim text-xs font-mono"
        >
          <p className="flicker-slow">
            [END_OF_LOG] :: total entries: {achievementsData.length} :: status:
            ongoing
          </p>
        </motion.div>
      </div>
    </section>
  );
}

