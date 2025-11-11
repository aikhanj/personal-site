"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface BootSequenceProps {
  onComplete: () => void;
}

const systemMessages = [
  "[REBUILDING: SYSTEMS]",
  "[UPDATING: GOVERNMENT]",
  "[INITIATING: TRUTH]",
];

const russianQuote = "Неправильный не я. Неправильный весь этот мир...";
const quoteWords = russianQuote.split(" ");

export default function BootSequence({ onComplete }: BootSequenceProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [displayedMessage, setDisplayedMessage] = useState("");
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [quoteWordsVisible, setQuoteWordsVisible] = useState<string[]>([]);
  const [showWhiteNoise, setShowWhiteNoise] = useState(true);

  useEffect(() => {
    // White noise phase
    const noiseTimer = setTimeout(() => {
      setShowWhiteNoise(false);
      setCurrentStep(1);
    }, 800);

    return () => clearTimeout(noiseTimer);
  }, []);

  useEffect(() => {
    if (currentStep === 1) {
      // Terminal authentication sequence
      let messageIndex = 0;
      let charIndex = 0;

      const typeInterval = setInterval(() => {
        if (messageIndex < systemMessages.length) {
          const currentMsg = systemMessages[messageIndex];
          if (charIndex < currentMsg.length) {
            setDisplayedMessage(currentMsg.substring(0, charIndex + 1));
            charIndex++;
          } else {
            setTimeout(() => {
              messageIndex++;
              charIndex = 0;
              setDisplayedMessage("");
              if (messageIndex >= systemMessages.length) {
                clearInterval(typeInterval);
                setCurrentStep(2);
              }
            }, 500);
          }
        }
      }, 50);

      return () => clearInterval(typeInterval);
    }
  }, [currentStep]);

  useEffect(() => {
    if (currentStep === 2) {
      // Typewriter effect for Russian quote with flickering words
      let wordIndex = 0;

      const wordInterval = setInterval(() => {
        if (wordIndex < quoteWords.length) {
          // Add word with flicker effect
          const newWord = quoteWords[wordIndex];
          setQuoteWordsVisible((prev) => [...prev, newWord]);

          // Flicker effect for each word
          setTimeout(() => {
            setQuoteWordsVisible((prev) => {
              const updated = [...prev];
              updated[wordIndex] = "";
              return updated;
            });
            setTimeout(() => {
              setQuoteWordsVisible((prev) => {
                const updated = [...prev];
                updated[wordIndex] = newWord;
                return updated;
              });
            }, 100);
          }, 200);

          wordIndex++;
        } else {
          clearInterval(wordInterval);
          // Red pulse heartbeat effect
          setTimeout(() => {
            setCurrentStep(3);
          }, 1000);
        }
      }, 300);

      return () => clearInterval(wordInterval);
    }
  }, [currentStep]);

  useEffect(() => {
    if (currentStep === 3) {
      // Red pulse heartbeat
      const pulseTimer = setTimeout(() => {
        setCurrentStep(4);
      }, 600);

      return () => clearTimeout(pulseTimer);
    }
  }, [currentStep]);

  useEffect(() => {
    if (currentStep === 4) {
      // Fade to hero
      setTimeout(() => {
        onComplete();
      }, 500);
    }
  }, [currentStep, onComplete]);

  return (
    <AnimatePresence>
      {currentStep < 4 && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[10001] bg-black flex items-center justify-center"
        >
          {/* White Noise Effect */}
          {showWhiteNoise && (
            <motion.div
              initial={{ opacity: 1 }}
              animate={{ opacity: [1, 0.8, 1] }}
              transition={{ duration: 0.1, repeat: Infinity }}
              className="absolute inset-0"
              style={{
                background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                opacity: 0.3,
                mixBlendMode: "screen",
              }}
            />
          )}

          {/* Terminal Content */}
          {!showWhiteNoise && (
            <div className="text-[#00ffd5] font-mono text-sm md:text-base">
              {currentStep === 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-2"
                >
                  <div className="mb-4">
                    <span className="text-[#ff0033]">$</span>{" "}
                    <span className="animate-pulse">_</span>
                  </div>
                  <div className="text-[#d0d0d0]">
                    {displayedMessage}
                    <span className="animate-pulse">_</span>
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="max-w-2xl text-center px-4"
                >
                  <div className="text-[#d0d0d0] text-lg md:text-xl leading-relaxed">
                    {quoteWordsVisible.map((word, index) => (
                      <span key={index} className="inline-block mr-2">
                        {word || "\u00A0"}
                      </span>
                    ))}
                    <span className="animate-pulse">_</span>
                  </div>
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div
                  initial={{ scale: 1, opacity: 1 }}
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [1, 0.8, 1],
                  }}
                  transition={{
                    duration: 0.6,
                    times: [0, 0.5, 1],
                  }}
                  className="w-32 h-32 rounded-full border-4 border-[#ff0033]"
                  style={{
                    boxShadow: "0 0 40px #ff0033, 0 0 80px #ff0033",
                  }}
                />
              )}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

