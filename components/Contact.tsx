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
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold mb-12 text-[#d0d0d0] tracking-tight"
        >
          contact
        </motion.h2>

        <div className="font-mono space-y-6">
          {/* Command Line Prompt */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-base md:text-lg"
          >
            <span className="text-[#00ffd5]">$</span>{" "}
            <span className="text-[#d0d0d0]">connect --protocol=email</span>
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
              <span className="text-[#00ffd5]">[</span>
              <span className="text-[#d0d0d0]">response</span>
              <span className="text-[#00ffd5]">]</span>{" "}
              <span className="text-[#d0d0d0]">connecting...</span>
              <br />
              <span className="text-[#00ffd5]">[</span>
              <span className="text-[#d0d0d0]">response</span>
              <span className="text-[#00ffd5]">]</span>{" "}
              <span className="text-[#d0d0d0]">protocol established</span>
              <br />
              <span className="text-[#00ffd5]">[</span>
              <span className="text-[#d0d0d0]">email</span>
              <span className="text-[#00ffd5]">]</span>{" "}
              <GlitchText
                trigger={glitchTrigger}
                intensity="medium"
                className="text-[#ff0033]"
              >
                aj5828@princeton.edu
              </GlitchText>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}

