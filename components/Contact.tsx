"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import GlitchText from "./GlitchText";

export default function Contact() {
  const [showEmail, setShowEmail] = useState(false);
  const [glitchTrigger, setGlitchTrigger] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [visibleLines, setVisibleLines] = useState<boolean[]>([false, false, false, false, false]);

  useEffect(() => {
    // Sequentially reveal lines when email is shown
    if (showEmail) {
      const delays = [0, 400, 800, 1200, 1600]; // Delay for each line in milliseconds
      
      delays.forEach((delay, index) => {
        setTimeout(() => {
          setVisibleLines((prev) => {
            const updated = [...prev];
            updated[index] = true;
            return updated;
          });
        }, delay);
      });
    }
  }, [showEmail]);

  useEffect(() => {
    // Trigger glitch periodically when email is visible
    if (showEmail && visibleLines[3]) {
      const interval = setInterval(() => {
        setGlitchTrigger(true);
        setTimeout(() => setGlitchTrigger(false), 100);
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [showEmail, visibleLines]);

  const handleReveal = () => {
    setShowEmail(true);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center py-24 md:py-32">
      <div className="w-[90%] max-w-4xl mx-auto px-4 md:px-0">
        <div className="font-mono space-y-8 md:space-y-6 text-sm">
          {/* Command Line Prompt */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[#00ffd5]"><GlitchText intensity="low">$</GlitchText></span>{" "}
            <span className="text-[#d0d0d0]"><GlitchText intensity="low">connect --protocol=email</GlitchText><br /></span>
            {!showEmail && (
              <motion.button
                onClick={handleReveal}
                className="ml-4 text-[#ff0033] hover:text-[#ff3366] transition-colors cursor-pointer"
                
                transition={{ duration: 0.1 }}
              >
                [execute]
              </motion.button>
            )}
          </motion.div>

          {/* Email Reveal */}
          {showEmail && (
            <div>
              {/* Line 1: [response] connecting... */}
              {visibleLines[0] && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <br />
                  <span className="text-[#00ffd5]"><GlitchText intensity="low">[</GlitchText></span>
                  <span className="text-[#d0d0d0]"><GlitchText intensity="low">response</GlitchText></span>
                  <span className="text-[#00ffd5]"><GlitchText intensity="low">]</GlitchText></span>{" "}
                  <span className="text-[#d0d0d0]"><GlitchText intensity="low">connecting...</GlitchText></span>
                </motion.div>
              )}
              
              {/* Line 2: [secure] protocol established */}
              {visibleLines[1] && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <br />
                  <span className="text-[#00ffd5]"><GlitchText intensity="low">[</GlitchText></span>
                  <span className="text-[#d0d0d0]"><GlitchText intensity="low">security</GlitchText></span>
                  <span className="text-[#00ffd5]"><GlitchText intensity="low">]</GlitchText></span>{" "}
                  <span className="text-[#d0d0d0]"><GlitchText intensity="low">protocol established...</GlitchText></span>
                </motion.div>
              )}
              
              {/* Line 3: [connect] if youre at princeton, lets grab a coffee */}
              {visibleLines[2] && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <br />
                  <span className="text-[#00ffd5]"><GlitchText intensity="low">[</GlitchText></span>
                  <span className="text-[#d0d0d0]"><GlitchText intensity="low">connection</GlitchText></span>
                  <span className="text-[#00ffd5]"><GlitchText intensity="low">]</GlitchText></span>{" "}
                  <span className="text-[#d0d0d0]"><GlitchText intensity="low">if youre at princeton, lets grab a coffee...</GlitchText></span>
                </motion.div>
              )}
              
              {/* Line 4: [email] ajumashukurov@gmail.com */}
              {visibleLines[3] && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <br />
                  <span className="text-[#00ffd5]"><GlitchText intensity="low">[</GlitchText></span>
                  <span className="text-[#d0d0d0]"><GlitchText intensity="low">email</GlitchText></span>
                  <span className="text-[#00ffd5]"><GlitchText intensity="low">]</GlitchText></span>{" "}
                  <GlitchText
                    trigger={glitchTrigger}
                    intensity="medium"
                    className="text-[#ff0033]"
                  >
                    ajumashukurov@gmail.com
                  </GlitchText>
                </motion.div>
              )}
              
              {/* Line 5: Social links */}
              {visibleLines[4] && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <br />
                  <a
                    href="https://github.com/aikhanj"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block"
                    onMouseEnter={() => setHoveredLink("github")}
                    onMouseLeave={() => setHoveredLink(null)}
                    style={{
                      color: "#ff0033",
                    }}
                  >
                    <GlitchText intensity="medium" trigger={hoveredLink === "github"}>github</GlitchText>
                  </a>
                  <span className="text-[#ff0033]"> </span>
                  <a
                    href="https://linkedin.com/in/aikhanj"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block"
                    onMouseEnter={() => setHoveredLink("linkedin")}
                    onMouseLeave={() => setHoveredLink(null)}
                    style={{
                      color: "#ff0033",
                    }}
                  >
                    <GlitchText intensity="medium" trigger={hoveredLink === "linkedin"}>linkedin</GlitchText>
                  </a>
                  <span className="text-[#ff0033]"> </span>
                  <a
                    href="https://x.com/jumashukurov"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block"
                    onMouseEnter={() => setHoveredLink("twitter")}
                    onMouseLeave={() => setHoveredLink(null)}
                    style={{
                      color: "#ff0033",
                    }}
                  >
                    <GlitchText intensity="medium" trigger={hoveredLink === "twitter"}>twitter</GlitchText>
                  </a>
                </motion.div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

