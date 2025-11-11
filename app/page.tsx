'use client';

import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import Preloader from '@/app/components/Preloader';
import Hero from '@/app/components/Hero';
import Manifesto from '@/app/components/Manifesto';
import Achievements from '@/app/components/Achievements';
import Projects from '@/app/components/Projects';
import Films from '@/app/components/Films';
import Contact from '@/app/components/Contact';

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
        <main className="relative bg-black">
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
