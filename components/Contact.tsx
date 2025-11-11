"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import GlitchText from "./GlitchText";

export default function Contact() {
  const [showEmail, setShowEmail] = useState(false);
  const [glitchTrigger, setGlitchTrigger] = useState(false);

  useEffect(() => {
    // Trigger glitch periodically when email is visible
    if (showEmail) {
      const interval = setInterval(() => {
        setGlitchTrigger(true);
        setTimeout(() => setGlitchTrigger(false), 100);
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [showEmail]);

  const handleReveal = () => {
    setShowEmail(true);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
      <div className="max-w-4xl w-full">
        <div className="font-mono space-y-6">
          {/* Command Line Prompt */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-base md:text-lg"
          >
            <span className="text-[#00ffd5]"><GlitchText intensity="low">$</GlitchText></span>{" "}
            <span className="text-[#d0d0d0]"><GlitchText intensity="low">connect --protocol=email</GlitchText></span>
            {!showEmail && (
              <motion.button
                onClick={handleReveal}
                className="ml-4 text-[#ff0033] hover:text-[#ff3366] transition-colors cursor-pointer"
                whileHover={{
                  scale: 1.05,
                  x: [0, -1, 1, 0],
                }}
                transition={{ duration: 0.1 }}
              >
                [execute]
              </motion.button>
            )}
          </motion.div>

          {/* Email Reveal */}
          {showEmail && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-base md:text-lg"
            >
              <span className="text-[#00ffd5]"><GlitchText intensity="low">[</GlitchText></span>
              <span className="text-[#d0d0d0]"><GlitchText intensity="low">response</GlitchText></span>
              <span className="text-[#00ffd5]"><GlitchText intensity="low">]</GlitchText></span>{" "}
              <span className="text-[#d0d0d0]"><GlitchText intensity="low">connecting...</GlitchText></span>
              <br />
              <span className="text-[#00ffd5]"><GlitchText intensity="low">[</GlitchText></span>
              <span className="text-[#d0d0d0]"><GlitchText intensity="low">secure</GlitchText></span>
              <span className="text-[#00ffd5]"><GlitchText intensity="low">]</GlitchText></span>{" "}
              <span className="text-[#d0d0d0]"><GlitchText intensity="low">protocol established</GlitchText></span>
              <br />
              <span className="text-[#00ffd5]"><GlitchText intensity="low">[</GlitchText></span>
              <span className="text-[#d0d0d0]"><GlitchText intensity="low">connect</GlitchText></span>
              <span className="text-[#00ffd5]"><GlitchText intensity="low">]</GlitchText></span>{" "}
              <span className="text-[#d0d0d0]"><GlitchText intensity="low">if youre at princeton, lets grab a coffee</GlitchText></span>
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
        </div>
      </div>
    </section>
  );
}

