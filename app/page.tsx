'use client';

import { useState } from 'react';
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

  return (
    <>
      <AnimatePresence mode="wait">
        {loading && (
          <Preloader onComplete={() => setLoading(false)} />
        )}
      </AnimatePresence>

      {!loading && (
        <main className="relative" style={{ backgroundColor: '#080808' }}>
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
