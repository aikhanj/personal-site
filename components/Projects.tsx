"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import projectsData from "@/data/projects.json";

interface Project {
  id: string;
  name: string;
  role: string;
  stack: string[];
  status: string;
  links: {
    repo: string;
    live: string;
  };
  body: string;
}

export default function Projects() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [focusedIndex, setFocusedIndex] = useState<number>(0);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const reducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setFocusedIndex((prev) => Math.min(prev + 1, projectsData.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setFocusedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const project = projectsData[focusedIndex] as Project;
        if (project) {
          setExpandedId(expandedId === project.id ? null : project.id);
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        setExpandedId(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [focusedIndex, expandedId]);

  const toggleExpand = useCallback((id: string) => {
    setExpandedId(expandedId === id ? null : id);
  }, [expandedId]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: reducedMotion ? 0 : 0.08,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: reducedMotion ? 0.01 : 0.4,
        ease: "easeOut",
      },
    },
  };

  const contentVariants = {
    collapsed: {
      height: 0,
      opacity: 0,
      transition: {
        duration: reducedMotion ? 0.01 : 0.3,
        ease: "easeInOut",
      },
    },
    expanded: {
      height: "auto",
      opacity: 1,
      transition: {
        duration: reducedMotion ? 0.01 : 0.3,
        ease: "easeInOut",
      },
    },
  };

  return (
    <section
      className="relative min-h-screen flex items-center justify-center px-6 md:px-12 lg:px-20 py-24 overflow-hidden"
      style={{ backgroundColor: "#080808" }}
    >
      {/* Scanline overlay - same as achievements */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `repeating-linear-gradient(
            0deg,
            rgba(200, 200, 200, 0.015) 0px,
            transparent 1px,
            transparent 2px
          )`,
          opacity: 0.5,
        }}
      />

      <div ref={containerRef} className="relative z-10 max-w-4xl w-full">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: reducedMotion ? 0.01 : 0.6 }}
          className="mb-8"
          style={{
            fontFamily: "var(--font-ibm-plex-mono, 'IBM Plex Mono'), monospace",
          }}
        >
          {/* Access level meta */}
          <div
            className="text-xs md:text-sm mb-4"
            style={{
              color: "#888888",
              letterSpacing: "0.02em",
            }}
          >
            [ACCESS LEVEL: public]
          </div>

          {/* Section header */}
          <div
            className="text-sm md:text-base mb-4"
            style={{
              fontFamily: "'OCR-A Extended', 'IBM Plex Mono', monospace",
              color: "#c8c8c8",
              letterSpacing: "0.04em",
            }}
          >
            &gt; projects.dossier
          </div>

          {/* Terminal command */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: reducedMotion ? 0 : 0.3, duration: reducedMotion ? 0.01 : 0.6 }}
            className="text-xs md:text-sm mb-6"
            style={{
              fontFamily: "var(--font-ibm-plex-mono, 'IBM Plex Mono'), monospace",
              color: "#888888",
              letterSpacing: "0.02em",
            }}
          >
            $ top 5
          </motion.div>
        </motion.div>

        {/* Projects List */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="space-y-1"
        >
          {(projectsData as Project[]).map((project, index) => {
            const isExpanded = expandedId === project.id;
            const isFocused = focusedIndex === index;
            const isHovered = hoveredId === project.id;

            return (
              <motion.div
                key={project.id}
                variants={itemVariants}
                className="relative"
                onMouseEnter={() => setHoveredId(project.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Header Line - Clickable */}
                <button
                  onClick={() => toggleExpand(project.id)}
                  className="w-full text-left focus:outline-none focus-visible:outline-none"
                  style={{
                    fontFamily:
                      "var(--font-ibm-plex-mono, 'IBM Plex Mono'), monospace",
                    color: "#c8c8c8",
                  }}
                  onFocus={() => setFocusedIndex(index)}
                >
                  <div
                    className="py-2 relative"
                    style={{
                      fontWeight: isExpanded ? 600 : 500,
                      textDecoration: isHovered ? "underline" : "none",
                      textDecorationColor: isHovered ? "#00ffd5" : "transparent",
                      textDecorationThickness: "1px",
                      textUnderlineOffset: "2px",
                      textShadow: isHovered
                        ? "1px 0 0 rgba(255, 0, 51, 0.3), -1px 0 0 rgba(0, 255, 213, 0.3)"
                        : "none",
                    }}
                  >
                    <span className="text-xs md:text-sm" style={{ color: "#888888" }}>
                      &gt;{" "}
                    </span>
                    <span className="text-sm md:text-base">{project.name}</span>
                    <span className="text-xs md:text-sm" style={{ color: "#888888" }}>
                      {"  —  "}
                    </span>
                    <span className="text-sm md:text-base">{project.role}</span>
                    {/* Blinking caret when expanded */}
                    {isExpanded && (
                      <motion.span
                        className="inline-block ml-1"
                        style={{
                          width: "2px",
                          height: "1em",
                          backgroundColor: "#c8c8c8",
                          verticalAlign: "baseline",
                        }}
                        animate={{
                          opacity: [1, 0, 1],
                        }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                    )}
                    {/* Focus indicator */}
                    {isFocused && !isHovered && (
                      <span
                        className="absolute left-0 top-0 bottom-0 w-1"
                        style={{ backgroundColor: "#00ffd5", opacity: 0.5 }}
                      />
                    )}
                  </div>
                </button>

                {/* Expandable Content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      variants={contentVariants}
                      initial="collapsed"
                      animate="expanded"
                      exit="collapsed"
                      className="overflow-hidden"
                      style={{
                        fontFamily:
                          "var(--font-ibm-plex-mono, 'IBM Plex Mono'), monospace",
                      }}
                    >
                      <div className="pl-6 pb-4 space-y-3">
                        {/* Meta Row */}
                        <div
                          className="text-xs"
                          style={{
                            color: "#888888",
                            letterSpacing: "0.02em",
                            lineHeight: "1.6",
                          }}
                        >
                          <span>[stack: </span>
                          <span style={{ color: "#c8c8c8" }}>
                            {project.stack.join(", ")}
                          </span>
                          <span>] </span>
                          <span>[status: </span>
                          <span style={{ color: "#c8c8c8" }}>{project.status}</span>
                          <span>] </span>
                          <span>[links: </span>
                          <a
                            href={project.links.repo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline"
                            style={{
                              color: "#c8c8c8",
                              textDecorationColor: "#00ffd5",
                            }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            repo
                          </a>
                          <span> | </span>
                          <a
                            href={project.links.live}
                            className="hover:underline"
                            style={{
                              color: "#c8c8c8",
                              textDecorationColor: "#00ffd5",
                            }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            live
                          </a>
                          <span>]</span>
                        </div>

                        {/* Body */}
                        <div
                          className="text-sm leading-relaxed lowercase"
                          style={{
                            color: "#c8c8c8",
                            letterSpacing: "0.01em",
                          }}
                        >
                          {project.body}
                        </div>

                        {/* Tag Chips */}
                        <div
                          className="text-xs pt-1"
                          style={{
                            color: "#888888",
                            fontFamily:
                              "var(--font-ibm-plex-mono, 'IBM Plex Mono'), monospace",
                            letterSpacing: "0.02em",
                          }}
                        >
                          {project.stack.join("  ")}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Footer note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ delay: 0.8, duration: reducedMotion ? 0.01 : 0.6 }}
          className="mt-16 text-xs"
          style={{
            fontFamily: "var(--font-ibm-plex-mono, 'IBM Plex Mono'), monospace",
            color: "#888888",
            letterSpacing: "0.02em",
          }}
        >
          <p>[END_OF_RECORD]</p>
        </motion.div>
      </div>
    </section>
  );
}
