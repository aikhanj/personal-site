"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import GlitchText from "./GlitchText";

const manifestoLines = [
    ' ',
    'i want to learn',
    'as much as possible',
    'without using people',
    'as stepping stones',
    ' ',

];

export default function Manifesto() {
  const [hoveredLine, setHoveredLine] = useState<number | null>(null);

  return (
    <section className="relative min-h-screen flex items-center justify-center py-24 md:py-32">
      <div className="w-[90%] max-w-4xl mx-auto px-4 md:px-0">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-2xl md:text-3xl lg:text-4xl font-bold mb-24 md:mb-20 text-[#d0d0d0] tracking-tight"
        >
          my goals
        </motion.h2>
        <div className="space-y-8 md:space-y-6">
          {manifestoLines.map((line, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              onMouseEnter={() => setHoveredLine(index)}
              onMouseLeave={() => setHoveredLine(null)}
              className="relative group cursor-pointer"
              whileHover={{
                x: [0, -1, 1, 0],
                transition: { duration: 0.08, repeat: 2 },
              }}
            >
              <p className="text-base md:text-lg lg:text-xl text-[#d0d0d0] font-light leading-relaxed">
                <GlitchText
                  trigger={hoveredLine === index}
                  intensity="low"
                  className="block"
                >
                  {line}
                </GlitchText>
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

