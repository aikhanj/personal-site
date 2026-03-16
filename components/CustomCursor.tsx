'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if device supports touch to avoid rendering custom cursor on mobile
    if (window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    const updateCursor = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      
      // Check if hovering over clickable element
      const target = e.target as HTMLElement;
      setIsPointer(
        window.getComputedStyle(target).cursor === 'pointer' ||
        target.tagName.toLowerCase() === 'a' ||
        target.tagName.toLowerCase() === 'button' ||
        target.closest('a') !== null ||
        target.closest('button') !== null
      );
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener('mousemove', updateCursor);
    document.documentElement.addEventListener('mouseenter', handleMouseEnter);
    document.documentElement.addEventListener('mouseleave', handleMouseLeave);

    // Show initially
    setIsVisible(true);

    return () => {
      window.removeEventListener('mousemove', updateCursor);
      document.documentElement.removeEventListener('mouseenter', handleMouseEnter);
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  if (typeof window === 'undefined') return null;
  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 w-10 h-10 rounded-full pointer-events-none z-[9999] flex items-center justify-center"
      style={{
        border: '1px solid var(--crimson)',
        mixBlendMode: 'difference',
        opacity: 0.8,
      }}
      animate={{
        x: position.x - 20,
        y: position.y - 20,
        scale: isPointer ? 1.5 : 1,
        backgroundColor: isPointer ? 'rgba(255, 0, 51, 0.1)' : 'transparent',
        borderColor: isPointer ? 'var(--cyan)' : 'var(--crimson)',
      }}
      transition={{
        type: 'spring',
        damping: 30,
        stiffness: 400,
        mass: 0.5
      }}
    >
      <motion.div
        className="w-1 h-1 rounded-full bg-white absolute"
        animate={{
          scale: isPointer ? 0 : 1,
          opacity: isPointer ? 0 : 1,
        }}
        transition={{ duration: 0.2 }}
      />
      
      {isPointer && (
        <motion.div 
          className="absolute w-[2px] h-full bg-[var(--cyan)]"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 0.4 }}
          transition={{ duration: 0.2 }}
        />
      )}
      {isPointer && (
        <motion.div 
          className="absolute h-[2px] w-full bg-[var(--cyan)]"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 0.4 }}
          transition={{ duration: 0.2 }}
        />
      )}
    </motion.div>
  );
}
