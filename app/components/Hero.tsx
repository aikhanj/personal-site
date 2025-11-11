'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

// Typing effect hook
function useTypingEffect(text: string, speed: number = 50) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    let currentIndex = 0;
    setDisplayedText('');
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
  }, [text, speed]);

  return { displayedText, isTyping };
}

export default function Hero() {
  const metaLine = 'user@municipal-ai:~$';
  const actionLine = 'executing manifest…';
  const quoteText = 'Неправильный не я. Неправильный весь этот мир...';

  const [showMeta, setShowMeta] = useState(false);
  const [showAction, setShowAction] = useState(false);
  const [showQuote, setShowQuote] = useState(false);

  const { displayedText: actionDisplayed, isTyping: actionTyping } = useTypingEffect(
    actionLine,
    60
  );
  const { displayedText: quoteDisplayed, isTyping: quoteTyping } = useTypingEffect(
    quoteText,
    80
  );

  useEffect(() => {
    // Sequence: meta -> action -> quote
    const timer1 = setTimeout(() => setShowMeta(true), 300);
    const timer2 = setTimeout(() => setShowAction(true), 800);
    const timer3 = setTimeout(() => setShowQuote(true), 2500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <section className="relative min-h-screen flex items-start pt-[28vh] overflow-hidden scanlines crt-effect">
      {/* Subtle noise overlay - barely visible */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.015] mix-blend-overlay">
        <div 
          className="absolute inset-0 bg-repeat" 
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            backgroundSize: '128px 128px',
          }} 
        />
      </div>

      {/* Right side grid/noise - faint */}
      <div className="absolute right-0 top-0 bottom-0 w-[44%] pointer-events-none opacity-[0.02] hidden md:block">
        <div 
          className="absolute inset-0 bg-repeat"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grid' width='40' height='40' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 40 0 L 0 0 0 40' fill='none' stroke='%23ffffff' stroke-width='0.5' opacity='0.1'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23grid)'/%3E%3C/svg%3E")`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Main content - left-aligned, asymmetric */}
      <div className="relative z-10 px-6 md:px-12 lg:px-20 w-full md:w-[56%]">
        <div className="space-y-4 md:space-y-6">
          {/* Tier 1: Meta Line */}
          {showMeta && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="text-text-dim text-xs md:text-sm font-mono tracking-wide"
            >
              {metaLine}
            </motion.div>
          )}

          {/* Tier 2: Action Line with typing effect */}
          {showAction && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="text-text text-base md:text-xl lg:text-2xl font-mono tracking-wide"
            >
              <span className="chromatic-aberration">{actionDisplayed}</span>
              {actionTyping && (
                <span className="terminal-cursor" />
              )}
            </motion.div>
          )}

          {/* Tier 3: Quote - slower typing, subtle */}
          {showQuote && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="mt-6 md:mt-8 text-text-dim text-xs md:text-sm lg:text-base font-mono italic tracking-wide leading-relaxed max-w-2xl"
            >
              <span className="chromatic-aberration-subtle">{quoteDisplayed}</span>
              {quoteTyping && (
                <span className="terminal-cursor opacity-60" />
              )}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
