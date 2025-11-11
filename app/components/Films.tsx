'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import filmsData from '@/data/films.json';

export default function Films() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

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
            {'>'} SYSTEM.cinema
          </h2>
          <div className="h-px w-24 bg-cyan" />
        </motion.div>

        <motion.h3
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-3xl md:text-5xl font-bold mb-8 text-text"
        >
          encrypted notes
        </motion.h3>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-text-dim text-sm md:text-base mb-16 max-w-2xl"
        >
          films that understand: form is function. silence is strategy. every
          frame is a choice.
        </motion.p>

        {/* Films List */}
        <div className="space-y-6">
          {filmsData.map((film, index) => (
            <motion.div
              key={film.id}
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.6 + index * 0.1, duration: 0.6 }}
              className="group border-l-2 border-text-dim/30 hover:border-crimson pl-6 py-4 transition-all duration-300 cursor-default"
            >
              {/* Film Header */}
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-cyan text-xs font-mono">{'>'}</span>
                <h4 className="text-lg md:text-xl font-semibold text-text group-hover:text-crimson transition-colors">
                  {film.title}
                </h4>
                <span className="text-text-dim text-sm">({film.year})</span>
              </div>

              {/* Director */}
              <div className="text-text-dim text-xs md:text-sm mb-3 pl-5">
                dir. {film.director}
              </div>

              {/* Note */}
              <div className="pl-5">
                <p className="text-text-dim group-hover:text-text text-sm md:text-base italic transition-colors">
                  {film.note}
                </p>
              </div>

              {/* Decrypt effect on hover */}
              <motion.div
                className="h-px bg-gradient-to-r from-crimson/0 via-crimson/50 to-crimson/0 mt-4 opacity-0 group-hover:opacity-100 transition-opacity"
                initial={false}
              />
            </motion.div>
          ))}
        </div>

        {/* Footer note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 1.5, duration: 0.6 }}
          className="mt-16 text-text-dim text-xs font-mono space-y-2"
        >
          <p className="flicker-slow">
            [NOTE] :: cinema as code. every cut is logic. every frame: intent.
          </p>
          <p className="text-text-dim/50">
            // more notes encrypted. decryption pending.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

