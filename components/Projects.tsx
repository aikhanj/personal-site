"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion, Variants } from "framer-motion";
import projectsData from "@/data/projects.json";

interface Project {
  id: string;
  pid: number;
  cpu: number;
  name: string;
  status: "running" | "active" | "sleeping" | "idle";
  uptime: string;
  purpose: string;
  stack: string[];
  links: {
    repo: string;
    live: string;
  };
}

// Status color mapping - lowkey
const statusColors: Record<string, string> = {
  running: "#00ffd5", // cyan
  active: "#888888", // gray
  sleeping: "#555555", // dark gray
  idle: "#444444", // darker gray
};

export default function Projects() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [focusedIndex, setFocusedIndex] = useState<number>(0);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const reducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);

  const projects = projectsData as Project[];

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Regular navigation
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setFocusedIndex((prev) => Math.min(prev + 1, projects.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setFocusedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const project = projects[focusedIndex];
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
  }, [focusedIndex, expandedId, projects]);

  const toggleExpand = useCallback(
    (id: string) => {
      setExpandedId(expandedId === id ? null : id);
    },
    [expandedId]
  );

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: reducedMotion ? 0 : 0.05,
        delayChildren: 0.2,
      },
    },
  };

  const rowVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reducedMotion ? 0.01 : 0.4,
        ease: "easeOut",
      },
    },
  };

  return (
    <section
      className="relative min-h-screen flex items-center justify-center py-24 md:py-32"
      style={{ backgroundColor: "#0a0a0a" }}
    >
      <div ref={containerRef} className="relative z-10 w-[90%] max-w-[920px] mx-auto px-4 md:px-0">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: reducedMotion ? 0.01 : 0.6 }}
          className="mb-10 md:mb-12"
        >
          <div
            className="text-sm md:text-base text-[#888]"
            style={{
              fontFamily: "var(--font-ibm-plex-mono, 'IBM Plex Mono'), monospace",
              letterSpacing: "0.04em",
            }}
          >
            &gt; projects.active
          </div>
        </motion.div>

        {/* Process Table */}
        <div className="hidden md:block">
          <div className="overflow-x-auto">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="font-mono text-xs md:text-sm"
              style={{
                fontFamily: "var(--font-ibm-plex-mono, 'IBM Plex Mono'), monospace",
                color: "#c8c8c8",
                letterSpacing: "0.02em",
              }}
            >
              {/* Table Header */}
              <div
                className="mb-6 pb-2 border-b"
                style={{
                  borderColor: "#222",
                  color: "#666",
                  fontSize: "0.75rem",
                }}
              >
                <div className="flex gap-4 md:gap-8 uppercase tracking-wider">
                  <span className="w-12 tabular-nums">PID</span>
                  <span className="w-12 tabular-nums">CPU</span>
                  <span className="flex-1 min-w-[180px]">NAME</span>
                  <span className="w-20">STATUS</span>
                  <span className="w-20 tabular-nums">UPTIME</span>
                  <span className="flex-1 min-w-[200px]">PURPOSE</span>
                </div>
              </div>

              {/* Process Rows */}
              {projects.map((project, index) => {
                const isExpanded = expandedId === project.id;
                const isHovered = hoveredId === project.id;

                return (
                  <motion.div key={project.id} variants={rowVariants}>
                    {/* Main Process Row */}
                    <button
                      onClick={() => toggleExpand(project.id)}
                      onMouseEnter={() => setHoveredId(project.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      onFocus={() => setFocusedIndex(index)}
                      className="w-full text-left focus:outline-none transition-colors duration-200"
                      style={{
                        backgroundColor: isHovered ? "rgba(255,255,255,0.02)" : "transparent",
                      }}
                      aria-expanded={isExpanded}
                      aria-label={`Project ${project.name}, Status ${project.status}`}
                    >
                      <div className="flex gap-4 md:gap-8 py-3 items-center border-b border-[#111]">
                        <span className="w-12 tabular-nums text-[#555]">{String(project.pid)}</span>
                        <span className="w-12 tabular-nums text-[#555]">{project.cpu.toFixed(1)}</span>
                        <span
                          className="flex-1 min-w-[180px] transition-colors duration-200"
                          style={{ color: isHovered ? "#00ffd5" : "#d0d0d0" }}
                        >
                          {project.name}
                        </span>
                        <span
                          className="w-20 lowercase"
                          style={{ color: statusColors[project.status] }}
                        >
                          {project.status}
                        </span>
                        <span className="w-20 tabular-nums text-[#555]">{project.uptime}</span>
                        <span className="flex-1 min-w-[200px] text-[#888] truncate">
                          {project.purpose}
                        </span>
                      </div>
                    </button>

                    {/* Expanded Details Sub-row */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{
                            duration: reducedMotion ? 0.01 : 0.3,
                            ease: "easeInOut",
                          }}
                          className="overflow-hidden"
                        >
                          <div
                            className="pl-4 md:pl-8 py-4 text-xs bg-[#0c0c0c] border-b border-[#111]"
                            style={{
                              color: "#888",
                              borderLeft: "2px solid #333",
                              marginLeft: "1rem",
                            }}
                          >
                            <div className="mb-2">
                              <span className="text-[#555]">stack: </span>
                              <span className="text-[#a0a0a0]">{project.stack.join(" · ")}</span>
                            </div>
                            <div className="flex gap-4">
                              <span className="text-[#555]">links: </span>
                              {project.links.repo && (
                                <a
                                  href={project.links.repo}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[#00ffd5] hover:underline"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  repo
                                </a>
                              )}
                              {project.links.live && (
                                <a
                                  href={project.links.live}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[#00ffd5] hover:underline"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  live
                                </a>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>

        {/* Mobile Process Cards */}
        <div className="md:hidden">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="flex flex-col gap-4"
            style={{
              fontFamily: "var(--font-ibm-plex-mono, 'IBM Plex Mono'), monospace",
            }}
          >
            {projects.map((project, index) => {
              const isExpanded = expandedId === project.id;

              return (
                <motion.div key={`${project.id}-mobile`} variants={rowVariants}>
                  <div className="rounded-lg bg-[#0c0c0c] border border-[#1a1a1a] overflow-hidden">
                    <button
                      type="button"
                      onClick={() => toggleExpand(project.id)}
                      onFocus={() => setFocusedIndex(index)}
                      className="w-full text-left px-5 py-4 focus:outline-none"
                      aria-expanded={isExpanded}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[#d0d0d0] text-base">{project.name}</span>
                        <span
                          className="text-xs"
                          style={{ color: statusColors[project.status] }}
                        >
                          {project.status}
                        </span>
                      </div>
                      <p className="text-sm text-[#888] mb-3 leading-relaxed">
                        {project.purpose}
                      </p>
                      <div className="flex gap-4 text-[0.65rem] uppercase tracking-wider text-[#555]">
                        <span>pid {project.pid}</span>
                        <span>cpu {project.cpu.toFixed(1)}%</span>
                        <span>up {project.uptime}</span>
                      </div>
                    </button>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="px-5 pb-4 pt-2 text-xs border-t border-[#1a1a1a] bg-[#080808]"
                        >
                          <div className="mb-3">
                            <span className="text-[#555] block mb-1">stack</span>
                            <span className="text-[#888]">{project.stack.join(" · ")}</span>
                          </div>
                          <div className="flex gap-6">
                            {project.links.repo && (
                              <a
                                href={project.links.repo}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#00ffd5] hover:underline"
                                onClick={(e) => e.stopPropagation()}
                              >
                                repo ↗
                              </a>
                            )}
                            {project.links.live && (
                              <a
                                href={project.links.live}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#00ffd5] hover:underline"
                                onClick={(e) => e.stopPropagation()}
                              >
                                live ↗
                              </a>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
