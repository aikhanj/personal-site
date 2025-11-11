"use client";

import { motion } from "framer-motion";
import filmsData from "@/data/films.json";
import GlitchText from "./GlitchText";

interface Film {
  id: string;
  title: string;
  year: number;
  director: string;
  note: string;
}

export default function Films() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
      <div className="max-w-4xl w-full">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold mb-12 text-[#d0d0d0] tracking-tight"
        >
          <GlitchText intensity="low">letterboxd</GlitchText>
        </motion.h2>

        <div className="space-y-6 font-mono">
          {filmsData.map((film: Film, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-base md:text-lg text-[#d0d0d0]"
            >
              <span className="text-[#ff0033]"><GlitchText intensity="low">{">"}</GlitchText></span>{" "}
              <span className="text-[#d0d0d0]"><GlitchText intensity="low">{film.title}</GlitchText></span>{" "}
              <span className="text-[#00ffd5]"><GlitchText intensity="low">{`(${film.year})`}</GlitchText></span>
              <GlitchText intensity="low">{": "}</GlitchText>
              <span className="text-[#d0d0d0] italic"><GlitchText intensity="low">{film.note}</GlitchText></span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

