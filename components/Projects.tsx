"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import projectsData from "@/data/projects.json";

interface Project {
  id: string;
  title: string;
  plainTitle: string;
  description: string;
  tech: string[];
  status: string;
}

export default function Projects() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [titleStates, setTitleStates] = useState<boolean[]>(
    new Array(projectsData.length).fill(false)
  );

  const toggleTitle = (index: number) => {
    setTitleStates((prev) => {
      const newState = [...prev];
      newState[index] = !newState[index];
      return newState;
    });
  };

  useEffect(() => {
    // Flicker titles periodically
    const interval = setInterval(() => {
      projectsData.forEach((_, index) => {
        if (Math.random() > 0.7) {
          toggleTitle(index);
          setTimeout(() => toggleTitle(index), 100);
        }
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
      <div className="max-w-6xl w-full">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold mb-12 text-[#d0d0d0] tracking-tight"
        >
          projects
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projectsData.map((project: Project, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="relative border-2 border-[#ff0033] p-6 bg-black/50 backdrop-blur-sm cursor-pointer"
              style={{
                boxShadow:
                  hoveredIndex === index
                    ? "0 0 20px #ff0033, inset 0 0 20px rgba(255, 0, 51, 0.1)"
                    : "0 0 10px rgba(255, 0, 51, 0.3)",
              }}
              whileHover={{
                scale: 1.02,
                transition: { duration: 0.1 },
              }}
              animate={
                hoveredIndex === index
                  ? {
                      x: [0, -1, 1, -1, 0],
                      y: [0, 1, -1, 0],
                    }
                  : {}
              }
              transition={{
                x: { duration: 0.08, repeat: Infinity },
                y: { duration: 0.08, repeat: Infinity },
              }}
            >
              {/* CRT Distortion on Hover */}
              {hoveredIndex === index && (
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  animate={{
                    opacity: [0, 0.1, 0],
                  }}
                  transition={{
                    duration: 0.1,
                    repeat: Infinity,
                  }}
                  style={{
                    background:
                      "radial-gradient(circle, rgba(0, 255, 213, 0.1) 0%, transparent 70%)",
                    transform: "skewX(-2deg)",
                  }}
                />
              )}

              {/* Flickering Title */}
              <h3 className="text-xl md:text-2xl font-bold mb-4 text-[#00ffd5]">
                {titleStates[index] ? project.plainTitle : project.title}
              </h3>

              {/* Description */}
              <p className="text-sm md:text-base text-[#d0d0d0] mb-4 leading-relaxed">
                {project.description}
              </p>

              {/* Tech Tags */}
              <div className="flex flex-wrap gap-2">
                {project.tech.map((tech, techIndex) => (
                  <span
                    key={techIndex}
                    className="text-xs text-[#ff0033] border border-[#ff0033] px-2 py-1"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Cyan Glow Border */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  border: hoveredIndex === index ? "1px solid #00ffd5" : "none",
                  boxShadow:
                    hoveredIndex === index
                      ? "0 0 15px #00ffd5, inset 0 0 15px rgba(0, 255, 213, 0.1)"
                      : "none",
                }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

