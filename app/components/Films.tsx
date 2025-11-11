'use client';

import { motion, useInView, useReducedMotion } from 'framer-motion';
import { useRef, useState, useEffect, useCallback } from 'react';
import filmsData from '@/data/films.json';

interface Film {
  id: string;
  title: string;
  year: number;
  director: string;
  note: string;
}

// Convert title to UPPER_SNAKE_CASE
function toSnakeCase(title: string): string {
  return title
    .toUpperCase()
    .replace(/[^A-Z0-9\s]/g, '')
    .replace(/\s+/g, '_');
}

// Generate consistent timestamp for a film (based on title + year hash)
function generateTimestamp(year: number, title: string): string {
  // Create a simple hash from title + year for consistent month/day
  const hash = (title + year).split('').reduce((acc, char) => {
    return ((acc << 5) - acc) + char.charCodeAt(0);
  }, 0);
  
  // Map hash to month (1-12) and day (1-28 for consistency)
  const month = Math.abs(hash % 12) + 1;
  const day = Math.abs(hash % 28) + 1;
  
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

// Character-by-character decrypt animation component
function DecryptText({ 
  text, 
  delay = 0, 
  speed = 50,
  className = '' 
}: { 
  text: string; 
  delay?: number; 
  speed?: number;
  className?: string;
}) {
  const [displayed, setDisplayed] = useState('');
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      setDisplayed(text);
      return;
    }

    setDisplayed('');
    
    const timeout = setTimeout(() => {
      let currentIndex = 0;
      const interval = setInterval(() => {
        if (currentIndex < text.length) {
          setDisplayed(text.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          clearInterval(interval);
        }
      }, speed);

      return () => clearInterval(interval);
    }, delay);

    return () => {
      clearTimeout(timeout);
    };
  }, [text, delay, speed, reducedMotion]);

  return <span className={className}>{displayed}</span>;
}

export default function Films() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const reducedMotion = useReducedMotion();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const [grepFilter, setGrepFilter] = useState<string | null>(null);
  const [userInput, setUserInput] = useState('');
  const sectionRef = useRef<HTMLElement>(null);

  // Generate tags from director and note (simplified)
  function generateTags(film: Film): string[] {
    const tags: string[] = [];
    
    // Extract genre hints from note
    if (film.note.toLowerCase().includes('melanchol') || film.note.toLowerCase().includes('longing')) {
      tags.push('melancholy');
    }
    if (film.note.toLowerCase().includes('silence') || film.note.toLowerCase().includes('form')) {
      tags.push('contemplative');
    }
    if (film.note.toLowerCase().includes('faith') || film.note.toLowerCase().includes('truth')) {
      tags.push('philosophical');
    }
    
    // Region hints from director
    if (film.director.includes('Tarkovsky') || film.director.includes('Kieślowski')) {
      tags.push('eastern_europe');
    }
    if (film.director.includes('Wong') || film.director.includes('Suzuki')) {
      tags.push('asia');
    }
    if (film.director.includes('Manchevski')) {
      tags.push('balkans');
    }
    
    // Default tag
    if (tags.length === 0) {
      tags.push('drama');
    }
    
    return tags;
  }

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

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center px-8 py-24"
      style={{ backgroundColor: '#0a0a0a' }}
    >
      <div className="w-full" style={{ maxWidth: '780px' }}>
        {/* Section Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: reducedMotion ? 0 : 0.6 }}
          className="mb-8"
        >
          <h2 
            className="text-sm mb-2"
            style={{
              fontFamily: 'var(--font-share-tech-mono), "OCR-A Extended", monospace',
              color: '#e5e5e5',
              letterSpacing: '0.04em',
            }}
          >
            {reducedMotion ? '> cinema.log' : (
              <DecryptText text="> cinema.log" delay={0} speed={45} />
            )}
          </h2>
          
          <div 
            className="text-xs mb-4"
            style={{
              fontFamily: 'var(--font-ibm-plex-mono), monospace',
              color: '#666',
            }}
          >
            {reducedMotion ? '[ACCESS LEVEL: restricted]' : (
              <DecryptText text="[ACCESS LEVEL: restricted]" delay={200} speed={40} />
            )}
          </div>

          <div 
            className="text-xs mb-8"
            style={{
              fontFamily: 'var(--font-ibm-plex-mono), monospace',
              color: '#666',
            }}
          >
            {reducedMotion ? '$ tail -5 /mnt/memory/letterboxd.log' : (
              <DecryptText text="$ tail -5 /mnt/memory/letterboxd.log" delay={400} speed={40} />
            )}
          </div>
        </motion.div>

        {/* Films List */}
        <div className="space-y-1">
          {filteredFilms.map((film: Film, index: number) => {
            const timestamp = generateTimestamp(film.year, film.title);
            const titleSnake = toSnakeCase(film.title);
            const isExpanded = expandedIndex === index;
            const isFocused = focusedIndex === index;
            const tags = generateTags(film);
            const lineDelay = 600 + index * 120;

            return (
              <div key={film.id}>
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : {}}
                  transition={{ 
                    delay: reducedMotion ? 0 : lineDelay / 1000,
                    duration: reducedMotion ? 0 : 0.3 
                  }}
                  onClick={() => handleEntryClick(index)}
                  onFocus={() => setFocusedIndex(index)}
                  onBlur={() => {
                    // Don't clear focus on blur, let keyboard handle it
                  }}
                  className="w-full text-left py-2 px-0 focus:outline-none focus:ring-2 focus:ring-[#00b8b8] focus:ring-offset-2 focus:ring-offset-[#0a0a0a] transition-all"
                  style={{
                    fontFamily: 'var(--font-ibm-plex-mono), monospace',
                    fontSize: '1rem',
                    lineHeight: '1.6',
                  }}
                  aria-expanded={isExpanded}
                  aria-label={`Film entry: ${film.title} ${film.year}`}
                >
                  <FilmEntryLine
                    timestamp={timestamp}
                    title={titleSnake}
                    year={film.year}
                    note={film.note}
                    isFocused={isFocused}
                    reducedMotion={reducedMotion}
                    delay={lineDelay}
                  />
                </motion.button>

                {/* Expanded detail */}
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: reducedMotion ? 0 : 0.2 }}
                    className="ml-0 pl-0 py-1"
                    style={{
                      fontFamily: 'var(--font-ibm-plex-mono), monospace',
                      fontSize: '0.875rem',
                      color: '#b45a5a',
                    }}
                  >
                    tags:[{tags.map(tag => `[${tag}]`).join(' ')}]
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// Film entry line component with hover effects
function FilmEntryLine({
  timestamp,
  title,
  year,
  note,
  isFocused,
  reducedMotion,
  delay,
}: {
  timestamp: string;
  title: string;
  year: number;
  note: string;
  isFocused: boolean;
  reducedMotion: boolean;
  delay: number;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [showChromatic, setShowChromatic] = useState(false);
  const [yearFlash, setYearFlash] = useState(false);
  const [yearStabilized, setYearStabilized] = useState(false);
  const [displayedLength, setDisplayedLength] = useState(0);

  // Extract year from timestamp (first 4 digits)
  const yearStr = timestamp.substring(0, 4);
  const restOfTimestamp = timestamp.substring(4);
  
  // Build the full line for decrypt
  const fullLine = `[${timestamp}] ${title} — ${note}`;
  const totalLength = fullLine.length;

  // Decrypt animation
  useEffect(() => {
    if (reducedMotion) {
      setDisplayedLength(totalLength);
      return;
    }

    setDisplayedLength(0);
    const timeout = setTimeout(() => {
      let current = 0;
      const interval = setInterval(() => {
        if (current < totalLength) {
          setDisplayedLength(current + 1);
          current++;
        } else {
          clearInterval(interval);
        }
      }, 50);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timeout);
  }, [delay, totalLength, reducedMotion]);

  // Parse the displayed portion to extract parts with proper styling
  const displayedText = fullLine.substring(0, displayedLength);
  
  // Find positions of each part in the full line
  const timestampEnd = `[${timestamp}]`.length;
  const titleStart = timestampEnd + 1; // +1 for space
  const titleEnd = titleStart + title.length;
  const dividerStart = titleEnd;
  const dividerEnd = dividerStart + 3; // " — "
  const noteStart = dividerEnd;

  return (
    <div
      onMouseEnter={() => {
        setIsHovered(true);
        if (!reducedMotion) {
          setShowChromatic(true);
          setYearFlash(true);
          setTimeout(() => {
            setShowChromatic(false);
            setYearFlash(false);
            setYearStabilized(true);
          }, 200);
        } else {
          setYearStabilized(true);
        }
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        setYearStabilized(false);
      }}
      className="relative"
    >
      {/* Render with proper styling based on position */}
      {displayedText.split('').map((char, index) => {
        // Determine which part this character belongs to
        let color = '#666';
        let fontFamily = 'var(--font-ibm-plex-mono), monospace';
        let letterSpacing = 'normal';
        let fontStyle = 'normal';
        let className = '';
        
        if (index < timestampEnd) {
          // Timestamp part
          color = '#666';
          // Check if this is the year part (characters 1-4 after the bracket)
          if (index >= 1 && index <= 4) {
            // Flash cyan on hover, then stabilize to cyan
            if (isHovered && (yearFlash || yearStabilized)) {
              color = '#00b8b8';
            } else {
              color = '#666';
            }
          }
        } else if (index >= titleStart && index < titleEnd) {
          // Title part
          color = '#e5e5e5';
          fontFamily = 'var(--font-share-tech-mono), "OCR-A Extended", monospace';
          letterSpacing = '0.04em';
        } else if (index >= dividerStart && index < dividerEnd) {
          // Divider part
          color = '#00b8b8';
        } else if (index >= noteStart) {
          // Note part
          color = '#b45a5a';
          fontStyle = 'italic';
          if (showChromatic) {
            className = 'chromatic-aberration-hover';
          }
        }
        
        return (
          <span
            key={index}
            style={{
              color,
              fontFamily,
              letterSpacing,
              fontStyle,
              transition: reducedMotion ? 'none' : 'color 0.2s ease',
            }}
            className={className}
          >
            {char}
          </span>
        );
      })}
    </div>
  );
}
