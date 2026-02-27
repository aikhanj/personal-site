'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import Preloader from '@/app/components/Preloader';
import Hero from '@/components/Hero';
import Manifesto from '@/components/Manifesto';
import Achievements from '@/components/Achievements';
import Projects from '@/components/Projects';
import Films from '@/app/components/Films';
import Contact from '@/components/Contact';

export default function Home() {
  const [loading, setLoading] = useState(true);

  // Skip preloader if already shown this session (e.g. navigating back)
  useEffect(() => {
    if (sessionStorage.getItem('preloaderShown')) {
      setLoading(false);
    }
  }, []);

  const handlePreloaderComplete = () => {
    sessionStorage.setItem('preloaderShown', '1');
    setLoading(false);
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {loading && (
          <Preloader onComplete={handlePreloaderComplete} />
        )}
      </AnimatePresence>

      {!loading && (
        <main className="relative" style={{ backgroundColor: '#0a0a0a' }}>
          <Hero />
          <Manifesto />
          <Achievements />
          <Projects />
          <Films />
          <Contact />
        </main>
      )}
    </>
  );
}
