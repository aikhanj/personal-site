'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import GlitchText from '@/components/GlitchText';

type Line = {
  ru: string;
  en: string;
  intensity: 'low' | 'medium' | 'high' | 'extreme';
};

const lines: Line[] = [
  { ru: '', en: '', intensity: 'low' },
  { ru: '', en: '', intensity: 'low' },
  { ru: '', en: '', intensity: 'low' },
  { ru: '', en: '', intensity: 'low' },
  { ru: '', en: '', intensity: 'low' },

  { ru: 'То как тебя воспринимают люди, это не ты', en: 'How people perceive you is not you', intensity: 'high' },
  { ru: '', en: '', intensity: 'low' },
  { ru: 'Я привык быть самым умным среди сверстников', en: 'I was used to being the smartest among my peers', intensity: 'medium' },
  { ru: '', en: '', intensity: 'low' },
  { ru: 'Звучит высокомерно, да?', en: 'Sounds arrogant, right?', intensity: 'medium' },
  { ru: '', en: '', intensity: 'low' },
  { ru: 'Сука как же я ненавижу это писать', en: 'Fuck how much I hate writing this', intensity: 'extreme' },
  { ru: '', en: '', intensity: 'low' },
  { ru: 'Но это правда', en: 'But it\'s the truth', intensity: 'medium' },
  { ru: '', en: '', intensity: 'low' },
  { ru: 'Я привык к комплиментам о таланте, уме, тд', en: 'I got used to compliments about talent, intelligence, etc', intensity: 'medium' },
  { ru: '', en: '', intensity: 'low' },
  { ru: 'Это приятно', en: 'It feels good', intensity: 'low' },
  { ru: '', en: '', intensity: 'low' },
  { ru: 'Но это вредно', en: 'But it\'s harmful', intensity: 'high' },
  { ru: '', en: '', intensity: 'low' },
  { ru: 'Как курить сигареты', en: 'Like smoking cigarettes', intensity: 'high' },
  { ru: '', en: '', intensity: 'low' },
  { ru: 'Комплименты это зависимость', en: 'Compliments are an addiction', intensity: 'extreme' },
  { ru: '', en: '', intensity: 'low' },
  { ru: 'Из за них я теперь должен и думать как меня воспринимают другие', en: 'Because of them I now have to think about how others perceive me', intensity: 'medium' },
  { ru: '', en: '', intensity: 'low' },
  { ru: 'Думают ли что я умный?', en: 'Do they think I\'m smart?', intensity: 'high' },
  { ru: '', en: '', intensity: 'low' },
  { ru: 'Придя в университет, я понял что не смогу поддерживать внешнее восприятие', en: 'Coming to university, I realized I couldn\'t maintain the external perception', intensity: 'medium' },
  { ru: '', en: '', intensity: 'low' },
  { ru: 'Это разрушило мое эго', en: 'It destroyed my ego', intensity: 'extreme' },
  { ru: '', en: '', intensity: 'low' },
  { ru: 'Я больше не самый умный', en: 'I\'m no longer the smartest', intensity: 'high' },
  { ru: '', en: '', intensity: 'low' },
  { ru: 'Не самый особенный', en: 'Not the most special', intensity: 'high' },
  { ru: '', en: '', intensity: 'low' },
  { ru: 'Не самый редкий', en: 'Not the most rare', intensity: 'high' },
  { ru: '', en: '', intensity: 'low' },
  { ru: 'Не самый', en: 'Not the most', intensity: 'extreme' },
  { ru: '', en: '', intensity: 'low' },
  { ru: 'Кто же я теперь?', en: 'Who am I now?', intensity: 'extreme' },
  { ru: '', en: '', intensity: 'low' },
  { ru: 'Как мне быть собой если общество мне уже навязало восприятие?', en: 'How can I be myself if society already imposed a perception on me?', intensity: 'high' },
  { ru: '', en: '', intensity: 'low' },
  { ru: 'Как мне быть собой если общество дало мне роль?', en: 'How can I be myself if society gave me a role?', intensity: 'high' },
  { ru: '', en: '', intensity: 'low' },
  { ru: 'Моя ли это вина или вина общества?', en: 'Is it my fault or society\'s?', intensity: 'extreme' },
  { ru: '', en: '', intensity: 'low' },
  { ru: 'Хочу ли я быть собой вообще?', en: 'Do I even want to be myself?', intensity: 'extreme' },
  { ru: '', en: '', intensity: 'low' },
  { ru: 'Существует ли настоящий я или нет?', en: 'Does the real me even exist?', intensity: 'extreme' },
  { ru: '', en: '', intensity: 'low' },
  { ru: '', en: '', intensity: 'low' },
  { ru: '', en: '', intensity: 'low' },
  { ru: '', en: '', intensity: 'low' },
  { ru: '', en: '', intensity: 'low' },
];

// Title appears at 300ms, then 1s pause, then lines stagger in slowly
const TITLE_DELAY = 300;
const LINES_START = TITLE_DELAY + 700 + 1000;

const delays: number[] = [];
let textCount = 0;
lines.forEach(({ ru }) => {
  if (ru) {
    delays.push(LINES_START + textCount * 220);
    textCount++;
  } else {
    delays.push(LINES_START + textCount * 220);
  }
});

const scrambleDuration = {
  low: 350,
  medium: 500,
  high: 650,
  extreme: 800,
};

const glitchInterval = {
  low: 14000,
  medium: 11000,
  high: 8000,
  extreme: 6000,
};

export default function Essay() {
  const [lang, setLang] = useState<'ru' | 'en'>('ru');
  const [titleRevealed, setTitleRevealed] = useState(false);
  const [revealed, setRevealed] = useState<boolean[]>(lines.map(() => false));

  useEffect(() => {
    const titleTimer = setTimeout(() => setTitleRevealed(true), TITLE_DELAY);
    const lineTimers = lines.map((_, i) =>
      setTimeout(() => {
        setRevealed(prev => {
          const next = [...prev];
          next[i] = true;
          return next;
        });
      }, delays[i])
    );
    return () => {
      clearTimeout(titleTimer);
      lineTimers.forEach(clearTimeout);
    };
  }, []);

  return (
    <main
      className="relative min-h-screen flex flex-col items-center px-5 md:px-12"
      style={{ backgroundColor: '#0a0a0a' }}
    >
      {/* Top bar */}
      <div className="fixed top-8 left-8 right-8 md:top-12 md:left-12 md:right-12 z-20 flex items-center justify-between">
        <Link
          href="/"
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 'clamp(0.7rem, 1.2vw, 0.8rem)',
            color: '#444',
            letterSpacing: '0.02em',
            textDecoration: 'none',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = '#d0d0d0'; }}
          onMouseLeave={e => { e.currentTarget.style.color = '#444'; }}
        >
          {'< back'}
        </Link>

        {/* Translate toggle */}
        <button
          onClick={() => setLang(l => l === 'ru' ? 'en' : 'ru')}
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 'clamp(0.6rem, 1vw, 0.7rem)',
            color: '#444',
            letterSpacing: '0.04em',
            background: 'none',
            border: '1px solid #222',
            padding: '4px 10px',
            cursor: 'pointer',
            transition: 'color 0.15s, border-color 0.15s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.color = '#d0d0d0';
            e.currentTarget.style.borderColor = '#444';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = '#444';
            e.currentTarget.style.borderColor = '#222';
          }}
        >
          {lang === 'ru' ? 'en' : 'ru'}
        </button>

        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 'clamp(0.6rem, 1.1vw, 0.75rem)',
            color: '#2a2a2a',
            letterSpacing: '0.06em',
          }}
        >
          {titleRevealed ? (
            <GlitchText
              intensity="medium"
              initialScramble={true}
              initialScrambleDuration={700}
              randomGlitch={true}
              randomGlitchInterval={15000}
            >
              01_shattering_the_image_of_yourself
            </GlitchText>
          ) : (
            <span style={{ opacity: 0 }}>01_shattering_the_image_of_yourself</span>
          )}
        </div>
      </div>

      {/* Spacer for fixed top bar */}
      <div className="mt-28 md:mt-36 mb-12 md:mb-16" />

      {/* Originally written note */}
      <div
        className="mb-14 md:mb-20"
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 'clamp(0.55rem, 1vw, 0.65rem)',
          color: '#333',
          letterSpacing: '0.04em',
          fontStyle: 'italic',
        }}
      >
        originally written in russian
      </div>

      {/* Lines */}
      <div className="w-[85%] md:w-[80%] max-w-xl pb-20">
        {lines.map(({ ru, en, intensity }, i) => {
          const text = lang === 'ru' ? ru : en;
          return (
            <div
              key={i}
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 'clamp(0.8rem, 1.8vw, 1.05rem)',
                color: '#d0d0d0',
                lineHeight: 2.1,
                letterSpacing: '0.01em',
                minHeight: text ? undefined : '1.8em',
              }}
            >
              {text && revealed[i] ? (
                <GlitchText
                  key={lang}
                  intensity={intensity}
                  initialScramble={true}
                  initialScrambleDuration={scrambleDuration[intensity]}
                  randomGlitch={true}
                  randomGlitchInterval={glitchInterval[intensity] + Math.random() * 5000}
                >
                  {text}
                </GlitchText>
              ) : text ? (
                <span style={{ opacity: 0 }}>{text}</span>
              ) : null}
            </div>
          );
        })}
      </div>

    </main>
  );
}
