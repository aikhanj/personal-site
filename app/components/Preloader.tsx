'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface PreloaderProps {
  onComplete: () => void;
}

const bootSequence = [
  '[SYSTEM] initializing...',
  '[AUTH] validating credentials...',
  '[SECURITY] patching vulnerabilities...',
  '[GOVERNMENT] resisting entropy of ideals...',
  '[MIDDLEWARE] determinism patched with hope.',
  '[ETHICS] narcissism disguised as righteousness?',
  '[STATUS] ready.',
];

export default function Preloader({ onComplete }: PreloaderProps) {
  const [lines, setLines] = useState<string[]>([]);
  const [showPulse, setShowPulse] = useState(false);

  useEffect(() => {
    let currentIndex = 0;
    
    const interval = setInterval(() => {
      if (currentIndex < bootSequence.length) {
        setLines(prev => [...prev, bootSequence[currentIndex]]);
        currentIndex++;
      } else {
        clearInterval(interval);
        setShowPulse(true);
        setTimeout(() => {
          onComplete();
        }, 1000);
      }
    }, 300);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ backgroundColor: '#080808' }}
    >
      {/* White noise background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuNSIvPjwvc3ZnPg==')] animate-pulse" />
      </div>

      <div className="relative z-10 w-full max-w-2xl px-8">
        {/* Terminal lines */}
        <div className="space-y-2 font-mono text-sm">
          {lines.map((line, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.1 }}
              className="text-text flicker-slow"
            >
              {line}
            </motion.div>
          ))}
        </div>

        {/* Red pulse heartbeat */}
        {showPulse && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mt-8 h-2 w-2 mx-auto bg-crimson pulse-red"
            style={{
              boxShadow: '0 0 20px var(--crimson), 0 0 40px var(--crimson)',
            }}
          />
        )}
      </div>
    </motion.div>
  );
}

