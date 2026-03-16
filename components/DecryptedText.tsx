"use client";

import { useState, useEffect, useRef } from "react";
import { useInView } from "framer-motion";
import GlitchText from "./GlitchText";

interface DecryptedTextProps {
  children: React.ReactNode;
  copyable?: boolean;
  copyText?: string;
  className?: string;
  href?: string;
}

const CHARS = "!@#$%^&*()_+{}:\"<>?|[];',./`~";

export default function DecryptedText({
  children,
  copyable = false,
  copyText,
  className = "",
  href,
}: DecryptedTextProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [displayText, setDisplayText] = useState("");
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const targetText = typeof children === "string" ? children : copyText || "";
  const encryptedText = "█".repeat(targetText.length);

  // Detect touch devices
  useEffect(() => {
    setIsTouch(window.matchMedia("(hover: none)").matches);
  }, []);

  // Auto-reveal on mobile when scrolled into view
  useEffect(() => {
    if (isTouch && isInView) {
      // Add a small delay so they can see the blocks before it decrypts
      const timeout = setTimeout(() => {
        setIsHovered(true);
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [isTouch, isInView]);

  useEffect(() => {
    if (isHovered) {
      setIsDecrypting(true);
      let iterations = 0;
      const interval = setInterval(() => {
        setDisplayText((prev) =>
          targetText
            .split("")
            .map((char, index) => {
              if (index < iterations) return targetText[index];
              return CHARS[Math.floor(Math.random() * CHARS.length)];
            })
            .join("")
        );
        if (iterations >= targetText.length) {
          clearInterval(interval);
          setIsDecrypting(false);
        }
        iterations += 1; // Decryption speed
      }, 30);
      return () => clearInterval(interval);
    } else {
      setDisplayText(encryptedText);
      setIsDecrypting(false);
    }
  }, [isHovered, targetText, encryptedText]);

  const handleClick = async (e: React.MouseEvent) => {
    if (copyable && copyText) {
      e.preventDefault();
      try {
        await navigator.clipboard.writeText(copyText);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy text", err);
      }
    }
  };

  const content = (
    <span
      ref={ref}
      className={`relative inline-block cursor-pointer transition-colors duration-300 ${
        isHovered && !isDecrypting ? "text-[#00ffd5]" : "text-[#555]"
      } ${className}`}
      onMouseEnter={() => !isTouch && setIsHovered(true)}
      onMouseLeave={() => {
        if (!isTouch) {
          setIsHovered(false);
          setIsCopied(false);
        }
      }}
      onClick={handleClick}
    >
      {isCopied ? (
        <GlitchText intensity="high" trigger={true}>
          [COPIED_TO_CLIPBOARD]
        </GlitchText>
      ) : (
        <span className={isHovered && !isDecrypting ? "drop-shadow-[0_0_8px_rgba(0,255,213,0.5)]" : ""}>
          {displayText}
        </span>
      )}
    </span>
  );

  if (href && !copyable) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="inline-block">
        {content}
      </a>
    );
  }

  return content;
}
