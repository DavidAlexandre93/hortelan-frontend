import React from "react";
import { motion } from "framer-motion";

export default function HarvesterSVG() {
  return (
    <svg width="460" height="300" viewBox="0 0 460 300" style={{ position: "absolute", left: 0, top: 0 }}>
      <defs>
        <linearGradient id="jdGreen" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#2da25a" />
          <stop offset="1" stopColor="#16683a" />
        </linearGradient>

        <linearGradient id="jdYellow" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#f3cc3e" />
          <stop offset="1" stopColor="#b98b10" />
        </linearGradient>

        <linearGradient id="metal" x1="0" x2="1">
          <stop offset="0" stopColor="#e7ebf2" />
          <stop offset="1" stopColor="#9aa3b2" />
        </linearGradient>

        <linearGradient id="glass" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#8de2ff" stopOpacity="0.95" />
          <stop offset="1" stopColor="#1c4f7d" stopOpacity="0.92" />
        </linearGradient>

        <radialGradient id="tire" cx="35%" cy="35%" r="70%">
          <stop offset="0" stopColor="#6b7280" />
          <stop offset="1" stopColor="#0b0f16" />
        </radialGradient>

        <filter id="drop" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="10" stdDeviation="8" floodColor="#000" floodOpacity="0.28" />
        </filter>
      </defs>

      {/* sombra projetada no chão */}
      <ellipse cx="250" cy="238" rx="170" ry="28" fill="rgba(0,0,0,0.22)" filter="url(#drop)" />

      {/* HEADER (frente) */}
      <g transform="translate(28,165)">
        <rect x="0" y="8" width="188" height="66" rx="24" fill="url(#jdYellow)" stroke="rgba(90,70,8,0.55)" strokeWidth="4" />

        {/* reel girando */}
        <motion.g
          style={{ originX: "78px", originY: "41px" }}
          animate={{ rotate: 360 }}
          transition={{ duration: 0.55, repeat: Infinity, ease: "linear" }}
        >
          <circle cx="78" cy="41" r="18" fill="#7c5c0c" opacity="0.92" />
          {Array.from({ length: 8 }).map((_, i) => (
            <rect
              key={i}
              x="76"
              y="14"
              width="4"
              height="54"
              rx="2"
              fill="#2b1d05"
              transform={`rotate(${i * 45} 78 41)`}
            />
          ))}
        </motion.g>

        {/* dentes */}
        {Array.from({ length: 13 }).map((_, i) => (
          <rect key={i} x={18 + i * 13} y="16" width="5" height="56" rx="3" fill="rgba(50,35,10,0.9)" transform="skewX(-10)" />
        ))}
      </g>

      {/* Corpo principal */}
      <g transform="translate(170,78)">
        <rect x="0" y="0" width="248" height="142" rx="28" fill="url(#jdGreen)" stroke="rgba(10,40,20,0.65)" strokeWidth="4" />
        <path d="M18 38 H230" stroke="rgba(255,255,255,0.25)" strokeWidth="4" />
        <path d="M18 62 H230" stroke="rgba(0,0,0,0.20)" strokeWidth="3" />
        <rect x="16" y="88" width="98" height="18" rx="9" fill="rgba(0,0,0,0.18)" />
      </g>

      {/* Cabine com reflexo */}
      <g transform="translate(322,104)">
        <rect x="0" y="0" width="92" height="76" rx="18" fill="url(#glass)" stroke="rgba(12,25,40,0.6)" strokeWidth="3" />
        {/* reflexo */}
        <polygon points="10,10 80,10 56,72" fill="rgba(255,255,255,0.22)" />
        <path d="M12 18 H78" stroke="rgba(255,255,255,0.30)" strokeWidth="4" />
        <path d="M14 36 H74" stroke="rgba(255,255,255,0.16)" strokeWidth="3" />
      </g>

      {/* Tubo */}
      <g transform="translate(368,86) rotate(-12)">
        <rect x="0" y="0" width="120" height="12" rx="8" fill="url(#metal)" />
        <rect x="92" y="-18" width="48" height="12" rx="8" fill="url(#metal)" transform="rotate(25 92 -18)" />
      </g>

      {/* Rodas + “track” */}
      <g>
        <circle cx="258" cy="224" r="36" fill="url(#tire)" stroke="rgba(0,0,0,0.55)" strokeWidth="4" />
        <circle cx="258" cy="224" r="16" fill="rgba(230,235,242,0.75)" />

        <circle cx="366" cy="228" r="36" fill="url(#tire)" stroke="rgba(0,0,0,0.55)" strokeWidth="4" />
        <circle cx="366" cy="228" r="16" fill="rgba(230,235,242,0.75)" />

        <rect x="222" y="248" width="180" height="22" rx="11" fill="rgba(15,15,15,0.76)" />
        {Array.from({ length: 10 }).map((_, i) => (
          <rect key={i} x={230 + i * 17} y="252" width="10" height="14" rx="4" fill="rgba(255,255,255,0.12)" />
        ))}
      </g>

      {/* ligação header -> corpo */}
      <path d="M186 198 C150 196, 130 200, 110 218" stroke="rgba(0,0,0,0.35)" strokeWidth="8" fill="none" strokeLinecap="round" />
    </svg>
  );
}
