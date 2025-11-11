"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import achievementsData from "@/data/achievements.json";

interface Achievement {
  timestamp: string;
  type: string;
  title: string;
  publication: string;
  status: string;
}

export default function Achievements() {
  const [visibleItems, setVisibleItems] = useState<number[]>([]);

  useEffect(() => {
    // Decryption fade-in effect
    achievementsData.forEach((_, index) => {
      setTimeout(() => {
        setVisibleItems((prev) => [...prev, index]);
      }, index * 200);
    });
  }, []);

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
          achievements
        </motion.h2>

        <div className="space-y-4 font-mono">
          {achievementsData.map((achievement: Achievement, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={
                visibleItems.includes(index)
                  ? { opacity: 1, x: 0 }
                  : { opacity: 0, x: -20 }
              }
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-sm md:text-base text-[#d0d0d0]"
            >
              <span className="text-[#00ffd5]">[</span>
              <span className="text-[#d0d0d0]">{achievement.timestamp}</span>
              <span className="text-[#00ffd5]">]</span>{" "}
              <span className="text-[#ff0033]">{achievement.type}</span>
              {": "}
              <span className="text-[#d0d0d0]">{achievement.title}</span>
              {achievement.publication && (
                <>
                  {" – "}
                  <span className="text-[#00ffd5]">{achievement.publication}</span>
                </>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

