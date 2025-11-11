'use client';

import { motion, useInView, useReducedMotion } from 'framer-motion';
import { useRef, useState, useEffect, useCallback } from 'react';
import filmsData from '@/data/films.json';

interface Film {
  id: string;
  title: string;
  year: number;
  director: string;
  date?: string;
  note: string;
  tags?: string[];
}

// Typing effect hook with reduced motion support
function useTypingEffect(text: string, speed: number = 50, enabled: boolean = true) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    if (!enabled) {
      setDisplayedText(text);
      setIsTyping(false);
      return;
    }

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
  }, [text, speed, enabled]);

  return { displayedText, isTyping };
}

// Convert title to UPPER_SNAKE_CASE
function toSnakeCase(title: string): string {
  return title
    .toUpperCase()
    .replace(/[^A-Z0-9\s]/g, '')
    .replace(/\s+/g, '_');
}

// Generate consistent timestamp for a film (use date if available, otherwise generate)
function generateTimestamp(film: Film): string {
  if (film.date) {
    return film.date;
  }
  
  // Create a simple hash from title + year for consistent month/day
  const hash = (film.title + film.year).split('').reduce((acc, char) => {
    return ((acc << 5) - acc) + char.charCodeAt(0);
  }, 0);
  
  // Map hash to month (1-12) and day (1-28 for consistency)
  const month = Math.abs(hash % 12) + 1;
  const day = Math.abs(hash % 28) + 1;
  
  return `${film.year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export default function Films() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const reducedMotion = useReducedMotion() ?? false;
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const [grepFilter, setGrepFilter] = useState<string | null>(null);
  const [userInput, setUserInput] = useState('');
  const sectionRef = useRef<HTMLElement>(null);

  // Filter films based on grep
  const filteredFilms = grepFilter 
    ? filmsData.filter(film => film.note.toLowerCase().includes(grepFilter.toLowerCase()))
    : filmsData;

  // Reset focus when filter changes
  useEffect(() => {
    if (grepFilter && focusedIndex !== null) {
      setFocusedIndex(null);
      setExpandedIndex(null);
    }
  }, [grepFilter]);

  // Keyboard navigation
  useEffect(() => {
    if (!sectionRef.current) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if user is typing "grep faith"
      if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
        setUserInput(prev => {
          const newInput = (prev + e.key).slice(-20); // Keep last 20 chars
          if (newInput.toLowerCase().includes('grep faith')) {
            setGrepFilter('faith');
            setTimeout(() => setGrepFilter(null), 5000); // Clear after 5s
            return '';
          }
          return newInput;
        });
      }

      // Only handle navigation if section is focused or in view
      if (!isInView) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setFocusedIndex(prev => {
          const next = prev === null ? 0 : Math.min(prev + 1, filteredFilms.length - 1);
          return next;
        });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setFocusedIndex(prev => {
          const next = prev === null ? filteredFilms.length - 1 : Math.max(prev - 1, 0);
          return next;
        });
      } else if (e.key === 'Enter' && focusedIndex !== null) {
        e.preventDefault();
        setExpandedIndex(prev => prev === focusedIndex ? null : focusedIndex);
      } else if (e.key === 'Escape') {
        setFocusedIndex(null);
        setExpandedIndex(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isInView, focusedIndex, filteredFilms.length]);

  const handleEntryClick = useCallback((index: number) => {
    setExpandedIndex(prev => prev === index ? null : index);
    setFocusedIndex(index);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: reducedMotion ? 0 : 0.25,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: reducedMotion ? 0.01 : 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center px-6 md:px-12 lg:px-20 py-24 overflow-hidden"
      style={{ backgroundColor: '#080808' }}
    >
      {/* Scanline overlay - same as achievements */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `repeating-linear-gradient(
            0deg,
            rgba(200, 200, 200, 0.015) 0px,
            transparent 1px,
            transparent 2px
          )`,
          opacity: 0.5,
        }}
      />

      <div className="relative z-10 max-w-4xl w-full">
        <motion.div
          ref={ref}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: reducedMotion ? 0.01 : 0.6 }}
          className="mb-8"
        >
          {/* Access level meta */}
          <div
            className="text-xs md:text-sm font-mono mb-4"
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              color: '#888888',
              letterSpacing: '0.02em',
            }}
          >
            [ACCESS LEVEL: restricted]
          </div>

          {/* Section header */}
          <div
            className="text-sm md:text-base font-mono mb-4"
            style={{
              fontFamily: "'OCR-A Extended', 'IBM Plex Mono', monospace",
              color: '#c8c8c8',
              letterSpacing: '0.04em',
            }}
          >
            &gt; cinema.log
          </div>

          {/* Terminal command */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: reducedMotion ? 0 : 0.3, duration: reducedMotion ? 0.01 : 0.6 }}
            className="text-xs md:text-sm font-mono mb-6"
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              color: '#888888',
              letterSpacing: '0.02em',
            }}
          >
            $ tail -5 /mnt/memory/letterboxd.log
          </motion.div>
        </motion.div>

        {/* Films List */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="space-y-1 font-mono text-xs md:text-sm"
          style={{
            fontFamily: "'OCR-A Extended', 'IBM Plex Mono', monospace",
          }}
        >
          {filteredFilms.map((film: Film, index: number) => {
            const timestamp = generateTimestamp(film);
            const titleSnake = toSnakeCase(film.title);
            const isExpanded = expandedIndex === index;
            const isFocused = focusedIndex === index;
            const typingSpeed = reducedMotion ? 0 : 50;
            const shouldType = !reducedMotion && index < 3; // Only type first 3 entries

            return (
              <FilmLine
                key={film.id}
                film={film}
                timestamp={timestamp}
                titleSnake={titleSnake}
                index={index}
                variants={itemVariants}
                typingSpeed={typingSpeed}
                shouldType={shouldType}
                reducedMotion={reducedMotion}
                isExpanded={isExpanded}
                isFocused={isFocused}
                onClick={() => handleEntryClick(index)}
                onFocus={() => setFocusedIndex(index)}
              />
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

function FilmLine({
  film,
  timestamp,
  titleSnake,
  index,
  variants,
  typingSpeed,
  shouldType,
  reducedMotion,
  isExpanded,
  isFocused,
  onClick,
  onFocus,
}: {
  film: Film;
  timestamp: string;
  titleSnake: string;
  index: number;
  variants: any;
  typingSpeed: number;
  shouldType: boolean;
  reducedMotion: boolean;
  isExpanded: boolean;
  isFocused: boolean;
  onClick: () => void;
  onFocus: () => void;
}) {
  // Build the entry line: TITLE_IN_SNAKE_CASE — note (dir. Director)
  const fullEntry = `${titleSnake} — ${film.note} (dir. ${film.director})`;
  const { displayedText, isTyping } = useTypingEffect(
    fullEntry,
    typingSpeed,
    shouldType && !reducedMotion
  );

  const displayText = shouldType && !reducedMotion ? displayedText : fullEntry;

  // Parse the displayed text to style different parts
  const parseDisplayText = (text: string) => {
    const parts: Array<{ text: string; type: 'title' | 'divider' | 'note' | 'director' }> = [];
    
    // Find title (everything before " — ")
    const dividerIndex = text.indexOf(' — ');
    if (dividerIndex === -1) {
      // Still typing title
      parts.push({ text, type: 'title' });
      return parts;
    }

    const title = text.substring(0, dividerIndex);
    parts.push({ text: title, type: 'title' });
    parts.push({ text: ' — ', type: 'divider' });

    // Find note and director
    const rest = text.substring(dividerIndex + 3);
    const dirIndex = rest.indexOf(' (dir. ');
    
    if (dirIndex === -1) {
      // Still typing note
      parts.push({ text: rest, type: 'note' });
      return parts;
    }

    const note = rest.substring(0, dirIndex);
    const directorPart = rest.substring(dirIndex);
    
    parts.push({ text: note, type: 'note' });
    
    // Parse director part: " (dir. Name)"
    const dirMatch = directorPart.match(/^ \(dir\. (.+)\)$/);
    if (dirMatch) {
      parts.push({ text: ' (dir. ', type: 'director' });
      parts.push({ text: dirMatch[1], type: 'director' });
      parts.push({ text: ')', type: 'director' });
    } else {
      parts.push({ text: directorPart, type: 'director' });
    }

    return parts;
  };

  const parts = parseDisplayText(displayText);

  return (
    <motion.div
      variants={variants}
      className="leading-tight"
    >
      <button
        onClick={onClick}
        onFocus={onFocus}
        className="w-full text-left focus:outline-none focus:ring-2 focus:ring-[#00b8b8] focus:ring-offset-2 focus:ring-offset-[#080808] transition-all"
        aria-expanded={isExpanded}
        aria-label={`Film entry: ${film.title} ${film.year}`}
      >
        <span style={{ color: '#c8c8c8' }}>[{timestamp}]</span>{' '}
        {parts.map((part, partIndex) => {
          let color = '#c8c8c8';
          let fontStyle = 'normal';

          if (part.type === 'title') {
            color = '#c8c8c8';
          } else if (part.type === 'divider') {
            color = '#00b8b8';
          } else if (part.type === 'note') {
            color = '#c8c8c8';
            fontStyle = 'italic';
          } else if (part.type === 'director') {
            color = '#888888';
          }

          return (
            <span
              key={partIndex}
              style={{
                color,
                fontStyle,
                letterSpacing: '0.02em',
              }}
            >
              {part.text}
            </span>
          );
        })}
        {isTyping && !reducedMotion && (
          <span
            className="inline-block w-[2px] h-[1em] ml-[3px] align-baseline"
            style={{
              background: '#00ffd5',
              animation: 'cursor-blink 1s step-end infinite',
            }}
          />
        )}
      </button>

      {/* Expanded detail */}
      {isExpanded && film.tags && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: reducedMotion ? 0.01 : 0.2 }}
          className="ml-0 pl-0 py-1 text-xs"
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            color: '#888888',
            letterSpacing: '0.02em',
          }}
        >
          tags:[{film.tags.map(tag => `[${tag}]`).join(' ')}]
        </motion.div>
      )}
    </motion.div>
  );
}
