"use client";

import { motion } from "framer-motion";
import DecryptedText from "./DecryptedText";

export default function Contact() {
  return (
    <section className="relative min-h-screen flex items-center justify-center py-24 md:py-32">
      <div className="w-[90%] max-w-4xl mx-auto px-4 md:px-0">
        <motion.div 
          className="font-mono space-y-6 text-sm md:text-base text-[#d0d0d0]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="space-y-6 md:space-y-8">
            <div className="flex flex-col sm:flex-row sm:gap-8">
              <span className="text-[#555] w-24 block sm:inline-block mb-1 sm:mb-0">status</span>
              <span className="text-[#d0d0d0]">
                seeking hard problems, weird ideas, people who ship.
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:gap-8 items-start sm:items-center">
              <span className="text-[#555] w-24 block sm:inline-block mb-1 sm:mb-0">contact</span>
              <DecryptedText copyable copyText="ajumashukurov@gmail.com">
                ajumashukurov@gmail.com
              </DecryptedText>
            </div>

            <div className="flex flex-col sm:flex-row sm:gap-8 items-start sm:items-center">
              <span className="text-[#555] w-24 block sm:inline-block mb-1 sm:mb-0">network</span>
              <div className="flex gap-4 md:gap-6">
                <DecryptedText href="https://github.com/aikhanj">
                  github
                </DecryptedText>
                <DecryptedText href="https://linkedin.com/in/aikhanj">
                  linkedin
                </DecryptedText>
                <DecryptedText href="https://x.com/jumashukurov">
                  twitter
                </DecryptedText>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
