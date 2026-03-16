'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

const ESSAYS = [
  '01_shattering_the_image_of_yourself',
];

const SPINNER = ['|', '/', '-', '\\'];

type Entry = {
  id: number;
  kind: 'cmd' | 'out';
  text: string;
  link?: string;
};

export default function Terminal() {
  const router = useRouter();
  const [history, setHistory] = useState<Entry[]>([]);
  const [value, setValue] = useState('');
  const [cursorPos, setCursorPos] = useState(0);
  const [busy, setBusy] = useState(false);
  const [focused, setFocused] = useState(false);
  const [hintVisible, setHintVisible] = useState(true);
  const [frame, setFrame] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(0);

  const nextId = () => ++idRef.current;

  const syncCursor = () => {
    const pos = inputRef.current?.selectionStart;
    if (pos != null) setCursorPos(pos);
  };

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!busy) return;
    const id = setInterval(() => setFrame(f => (f + 1) % 4), 100);
    return () => clearInterval(id);
  }, [busy]);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [history, busy, frame]);

  const exec = useCallback((raw: string): Entry[] => {
    const cmd = raw.trim();
    const [command, ...args] = cmd.toLowerCase().split(' ');

    if (command === 'help' || command === '/help' || command === '?') {
      return [{ id: nextId(), kind: 'out', text: 'available commands: about, focus, projects, essays, contact, clear, whoami, sudo' }];
    }
    
    if (command === 'about') {
      return [{ id: nextId(), kind: 'out', text: 'aikhan. [domain: kyrgyzstan] [focus: film, systems, change]. dedicated to rebuilding through logic and light.' }];
    }

    if (command === 'whoami') {
      return [{ id: nextId(), kind: 'out', text: 'guest@system.local' }];
    }

    if (command === 'sudo') {
      return [{ id: nextId(), kind: 'out', text: 'effective user: root. but you still lack the conviction to alter this reality.' }];
    }

    if (command === 'focus') {
      return [{ id: nextId(), kind: 'out', text: 'primary: municipal ai\nsecondary: film theory\ntertiary: systemic reconstruction' }];
    }

    if (command === 'contact') {
      return [{ id: nextId(), kind: 'out', text: 'initiating handshake... find me at the intersection of decentralization and bishkek.' }];
    }

    if (command === 'essays' || command === '/essays') {
      return ESSAYS.map(s => ({
        id: nextId(),
        kind: 'out' as const,
        text: `> ${s}`,
        link: `/essays/${s}`,
      }));
    }

    if (command === 'projects') {
      return [
        { id: nextId(), kind: 'out', text: 'recovering project registry...' },
        { id: nextId(), kind: 'out', text: '1. local-system-v1: bishkek municipal optimization' },
        { id: nextId(), kind: 'out', text: '2. cinematic-logic: narrative as a system' },
        { id: nextId(), kind: 'out', text: 'type "ls /projects" for more (stub)' },
      ];
    }

    if (command === 'exit') {
      return [{ id: nextId(), kind: 'out', text: 'disconnection is not an option.' }];
    }

    if (!cmd) return [];
    return [{ id: nextId(), kind: 'out', text: `command not found: ${command}. type "help" for a list of commands.` }];
  }, []);

  const run = useCallback((raw: string) => {
    if (busy) return;
    setHintVisible(false);

    const cmd = raw.trim();
    const cmdEntry: Entry = { id: nextId(), kind: 'cmd', text: cmd };

    if (cmd.toLowerCase() === 'cls' || cmd.toLowerCase() === 'clear') {
      setHistory([]);
      return;
    }

    if (!cmd) {
      setHistory(prev => [...prev, cmdEntry]);
      return;
    }

    setHistory(prev => [...prev, cmdEntry]);
    setBusy(true);

    const delay = 500 + Math.random() * 400;
    setTimeout(() => {
      const results = exec(raw);
      setBusy(false);
      setHistory(prev => [...prev, ...results]);
    }, delay);
  }, [busy, exec]);

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const cmd = value;
      setValue('');
      setCursorPos(0);
      run(cmd);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    // cursor position updates on next tick after DOM settles
    requestAnimationFrame(syncCursor);
  };

  const focusInput = () => inputRef.current?.focus();

  // Split value at cursor position for visual rendering
  const beforeCursor = value.slice(0, cursorPos);
  const afterCursor = value.slice(cursorPos);

  const fontStyle = {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 'clamp(0.75rem, 1.4vw, 0.875rem)',
    lineHeight: 1.7,
    letterSpacing: '0.02em',
  } as const;

  const textColor = focused ? '#e8e8e8' : '#d0d0d0';

  return (
    <div
      className="w-full flex flex-col items-center px-4"
      style={{ cursor: 'text' }}
      onClick={focusInput}
    >
      <div className="w-full max-w-[600px]">
        {/* ── Active input line ── */}
        <div className="relative" style={fontStyle}>
          <div className="pointer-events-none select-none flex items-center">
            <span className="whitespace-pre" style={{ color: '#555' }}>
              khan@xxxxxxxx:~${' '}
            </span>
            <span style={{ color: textColor, transition: 'color 0.15s' }}>
              {beforeCursor}
            </span>
            {!busy && (
              <span
                className="inline-block"
                style={{
                  color: '#d0d0d0',
                  animation: 'cursor-blink 1s step-end infinite',
                  marginLeft: '0px',
                }}
              >
                &#9610;
              </span>
            )}
            <span style={{ color: textColor, transition: 'color 0.15s' }}>
              {afterCursor}
            </span>
          </div>

          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={handleChange}
            onKeyDown={handleKey}
            onKeyUp={syncCursor}
            onSelect={syncCursor}
            onClick={e => { e.stopPropagation(); syncCursor(); }}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            disabled={busy}
            className="absolute top-0 left-0 w-full h-full border-none outline-none"
            style={{
              background: 'transparent',
              color: 'transparent',
              caretColor: 'transparent',
              fontSize: 'inherit',
              fontFamily: 'inherit',
              letterSpacing: 'inherit',
              lineHeight: 'inherit',
              padding: 0,
              margin: 0,
            }}
            spellCheck={false}
            autoComplete="off"
            autoCapitalize="off"
            aria-label="Terminal input"
          />
        </div>

        {/* ── Hint ── */}
        {hintVisible && history.length === 0 && !busy && (
          <div
            style={{
              ...fontStyle,
              fontSize: 'clamp(0.625rem, 1.2vw, 0.75rem)',
              color: '#333',
              marginTop: '0.5rem',
            }}
          >
            try: /help
          </div>
        )}

        {/* ── Output log ── */}
        {(history.length > 0 || busy) && (
          <div
            ref={logRef}
            className="overflow-y-auto scrollbar-hide"
            style={{
              ...fontStyle,
              maxHeight: '25vh',
              marginTop: '0.5rem',
            }}
          >
            {history.map(entry => (
              <div key={entry.id} className="whitespace-pre-wrap break-all">
                {entry.kind === 'cmd' ? (
                  <span style={{ color: '#444' }}>
                    khan@xxxxxxxx:~$ {entry.text}
                  </span>
                ) : entry.link ? (
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={e => {
                      e.stopPropagation();
                      router.push(entry.link!);
                    }}
                    onKeyDown={e => {
                      if (e.key === 'Enter') router.push(entry.link!);
                    }}
                    style={{
                      color: '#d0d0d0',
                      cursor: 'pointer',
                      borderBottom: '1px solid #333',
                      paddingBottom: '1px',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.color = '#00ffd5';
                      e.currentTarget.style.borderBottomColor = '#00ffd5';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.color = '#d0d0d0';
                      e.currentTarget.style.borderBottomColor = '#333';
                    }}
                  >
                    {entry.text}
                  </span>
                ) : (
                  <span style={{ color: '#999' }}>{entry.text}</span>
                )}
              </div>
            ))}
            {busy && (
              <div style={{ color: '#555' }}>
                [{SPINNER[frame]}] loading
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
