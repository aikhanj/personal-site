"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import projectsData from "@/data/projects.json";
import GlitchText from "./GlitchText";

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

// Status color mapping
const statusColors: Record<string, string> = {
  running: "#ff0033", // crimson
  active: "#00b8b8", // cyan variant
  sleeping: "#b6b600", // yellow
  idle: "#7a7a7a", // gray
};

// Typing effect hook
function useTypingEffect(
  text: string,
  speed: number = 90,
  enabled: boolean = true
) {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    if (!enabled) {
      setDisplayedText(text);
      setIsTyping(false);
      return;
    }

    let currentIndex = 0;
    setDisplayedText("");
    setIsTyping(true);

    const interval = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayedText(text.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, enabled]);

  return { displayedText, isTyping };
}

export default function Projects() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [focusedIndex, setFocusedIndex] = useState<number>(0);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [killedPid, setKilledPid] = useState<number | null>(null);
  const [restartedPid, setRestartedPid] = useState<number | null>(null);
  const [commandInput, setCommandInput] = useState("");
  const [showCommandInput, setShowCommandInput] = useState(false);
  const reducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const commandInputRef = useRef<HTMLInputElement>(null);

  const projects = projectsData as Project[];

  // Typing effect for first row name
  const firstProject = projects[0];
  const { displayedText: firstRowName, isTyping: isTypingFirstRow } =
    useTypingEffect(
      firstProject?.name || "",
      reducedMotion ? 0 : 90,
      !reducedMotion
    );

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Handle kill command input
      if (showCommandInput && commandInputRef.current) {
        if (e.key === "Enter") {
          const match = commandInput.match(/kill\s+(\d+)/i);
          if (match) {
            const pid = parseInt(match[1]);
            const project = projects.find((p) => p.pid === pid);
            if (project) {
              setKilledPid(pid);
              setTimeout(() => {
                setKilledPid(null);
                setRestartedPid(pid);
                setTimeout(() => {
                  setRestartedPid(null);
                }, 2000);
              }, 900);
            }
            setCommandInput("");
            setShowCommandInput(false);
          }
          return;
        }
        if (e.key === "Escape") {
          setCommandInput("");
          setShowCommandInput(false);
          return;
        }
        return;
      }

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
      } else if (
        (e.key === "k" || e.key === "K") &&
        e.ctrlKey &&
        !showCommandInput
      ) {
        // Easter egg: Ctrl+K to start kill command
        e.preventDefault();
        setShowCommandInput(true);
        setCommandInput("kill ");
        setTimeout(() => {
          commandInputRef.current?.focus();
        }, 0);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [focusedIndex, expandedId, showCommandInput, commandInput, projects]);

  const toggleExpand = useCallback(
    (id: string) => {
      setExpandedId(expandedId === id ? null : id);
    },
    [expandedId]
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: reducedMotion ? 0 : 0.1,
        delayChildren: 0.4,
      },
    },
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: reducedMotion ? 0.01 : 0.3,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <section
      className="relative min-h-screen flex items-center justify-center px-6 md:px-12 lg:px-20 py-24 overflow-hidden"
      style={{ backgroundColor: "#080808" }}
    >
      {/* Scanline overlay */}
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

      <div ref={containerRef} className="relative z-10 max-w-[920px] w-full">
        {/* Header */}
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
          {/* Access level */}
          <div
            className="text-xs md:text-sm mb-4"
            style={{
              color: "#888888",
              letterSpacing: "0.02em",
            }}
          >
            <GlitchText intensity="low">[ACCESS LEVEL: root]</GlitchText>
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
            <GlitchText intensity="low">&gt; processes.active</GlitchText>
          </div>

          {/* Terminal command */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{
              delay: reducedMotion ? 0 : 0.3,
              duration: reducedMotion ? 0.01 : 0.6,
            }}
            className="text-xs md:text-sm mb-6"
            style={{
              fontFamily: "var(--font-ibm-plex-mono, 'IBM Plex Mono'), monospace",
              color: "#888888",
              letterSpacing: "0.02em",
            }}
          >
            <GlitchText intensity="low">$ ps aux | grep &quot;aikhan&quot;</GlitchText>
          </motion.div>
        </motion.div>

        {/* Process Table */}
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
              className="mb-6 pb-1 border-b"
              style={{
                borderColor: "#333333",
                color: "#888888",
                fontSize: "0.7rem",
              }}
            >
              <div className="flex gap-4 md:gap-8">
                <span className="w-8"><GlitchText intensity="low">root</GlitchText></span>
                <span className="w-12 tabular-nums"><GlitchText intensity="low">PID</GlitchText></span>
                <span className="w-12 tabular-nums"><GlitchText intensity="low">CPU</GlitchText></span>
                <span className="flex-1 min-w-[180px]"><GlitchText intensity="low">NAME</GlitchText></span>
                <span className="w-20"><GlitchText intensity="low">STATUS</GlitchText></span>
                <span className="w-20 tabular-nums"><GlitchText intensity="low">UPTIME</GlitchText></span>
                <span className="flex-1 min-w-[200px]"><GlitchText intensity="low">PURPOSE</GlitchText></span>
              </div>
            </div>

            {/* Process Rows */}
            {projects.map((project, index) => {
              const isExpanded = expandedId === project.id;
              const isFocused = focusedIndex === index;
              const isHovered = hoveredId === project.id;
              const isKilled = killedPid === project.pid;
              const isRestarted = restartedPid === project.pid;
              const isRunning = project.status === "running";
              const isFirstRow = index === 0;

              // Use typed name for first row, regular name for others
              const displayName =
                isFirstRow && !reducedMotion ? firstRowName : project.name;

              return (
                <motion.div key={project.id} variants={rowVariants}>
                  {/* Main Process Row */}
                  <button
                    onClick={() => toggleExpand(project.id)}
                    onMouseEnter={() => setHoveredId(project.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    onFocus={() => setFocusedIndex(index)}
                    className="w-full text-left focus:outline-none focus-visible:outline-2 focus-visible:outline-cyan focus-visible:outline-offset-2"
                    style={{
                      opacity: isKilled ? 0 : 1,
                      transition: isKilled
                        ? "opacity 0.9s ease-out"
                        : "none",
                      backgroundColor: "transparent",
                    }}
                    aria-expanded={isExpanded}
                    aria-label={`Process ${project.name}, PID ${project.pid}, Status ${project.status}`}
                  >
                    <div
                      className={`flex gap-4 md:gap-8 py-1 items-center ${
                        isRunning && !reducedMotion ? "process-heartbeat" : ""
                      }`}
                      style={{
                        backgroundColor: "transparent",
                        borderBottom: "none",
                      }}
                    >
                      <span className="w-8"><GlitchText intensity="low" trigger={isHovered}>root</GlitchText></span>
                      <span className="w-12 tabular-nums"><GlitchText intensity="low" trigger={isHovered}>{String(project.pid)}</GlitchText></span>
                      <span className="w-12 tabular-nums"><GlitchText intensity="low" trigger={isHovered}>{project.cpu.toFixed(1)}</GlitchText></span>
                      <span
                        className="flex-1 min-w-[180px]"
                        style={{
                          color: isHovered ? "#00ffd5" : "#00ffd5",
                          textShadow: isHovered
                            ? "1px 0 0 rgba(255, 0, 51, 0.3), -1px 0 0 rgba(0, 255, 213, 0.3)"
                            : "none",
                          transition: isHovered ? "text-shadow 0.2s" : "none",
                        }}
                      >
                        <GlitchText intensity="low" trigger={isHovered}>{displayName}</GlitchText>
                        {isFirstRow && isTypingFirstRow && !reducedMotion && (
                          <span
                            className="inline-block ml-1 w-[2px] h-[1em] align-baseline"
                            style={{
                              backgroundColor: "#00ffd5",
                              animation: "cursor-blink 1s step-end infinite",
                            }}
                          />
                        )}
                      </span>
                      <span
                        className="w-20 lowercase"
                        style={{ color: statusColors[project.status] }}
                      >
                        <GlitchText intensity="low" trigger={isHovered}>{project.status}</GlitchText>
                      </span>
                      <span className="w-20 tabular-nums"><GlitchText intensity="low" trigger={isHovered}>{project.uptime}</GlitchText></span>
                      <span
                        className="flex-1 min-w-[200px]"
                        style={{ color: "#bdbdbd" }}
                      >
                        <GlitchText intensity="low" trigger={isHovered}>{project.purpose}</GlitchText>
                      </span>
                    </div>
                  </button>

                  {/* Expanded Details Sub-row */}
                  <AnimatePresence>
                    {isExpanded && !isKilled && (
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
                          className="pl-4 md:pl-8 py-2 text-xs"
                          style={{
                            color: "#888888",
                            borderLeft: "1px solid #333333",
                            marginLeft: "1rem",
                          }}
                        >
                          <div className="mb-1">
                            <span><GlitchText intensity="low">[stack: </GlitchText></span>
                            <span style={{ color: "#c8c8c8" }}>
                              <GlitchText intensity="low">{project.stack.join(" ")}</GlitchText>
                            </span>
                            <span><GlitchText intensity="low">]</GlitchText></span>
                          </div>
                          <div>
                            <span><GlitchText intensity="low">[links: </GlitchText></span>
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
                              <GlitchText intensity="low">{`repo=${project.links.repo}`}</GlitchText>
                            </a>
                            <span><GlitchText intensity="low"> | </GlitchText></span>
                            <a
                              href={project.links.live}
                              className="hover:underline"
                              style={{
                                color: "#c8c8c8",
                                textDecorationColor: "#00ffd5",
                              }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <GlitchText intensity="low">{`live=${project.links.live}`}</GlitchText>
                            </a>
                            <span><GlitchText intensity="low">]</GlitchText></span>
                          </div>
                          {isRestarted && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="mt-2"
                              style={{ color: "#ff0033" }}
                            >
                              <GlitchText intensity="medium">[RESTARTED]</GlitchText>
                            </motion.div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Kill Command Input (Easter Egg) */}
        <AnimatePresence>
          {showCommandInput && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mt-4"
              style={{
                fontFamily: "var(--font-ibm-plex-mono, 'IBM Plex Mono'), monospace",
                color: "#888888",
                fontSize: "0.7rem",
              }}
            >
              <GlitchText intensity="low">$ </GlitchText>
              <input
                ref={commandInputRef}
                type="text"
                value={commandInput}
                onChange={(e) => setCommandInput(e.target.value)}
                className="bg-transparent border-none outline-none focus:outline-none"
                style={{
                  color: "#c8c8c8",
                  fontFamily: "var(--font-ibm-plex-mono, 'IBM Plex Mono'), monospace",
                  width: "200px",
                }}
                autoFocus
              />
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes cursor-blink {
          0%,
          50% {
            opacity: 1;
          }
          51%,
          100% {
            opacity: 0;
          }
        }
        @keyframes heartbeat {
          0%,
          100% {
            filter: brightness(1);
          }
          50% {
            filter: brightness(1.01);
          }
        }
        .process-heartbeat {
          animation: heartbeat 7s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .process-heartbeat {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}
