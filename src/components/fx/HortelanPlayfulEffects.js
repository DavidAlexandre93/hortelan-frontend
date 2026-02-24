import { useEffect, useState } from 'react';

const FIRST_VISIT_KEY = 'hortelan:first-visit-effects-done';
const MAX_CURSOR_TRAIL = 14;
const ORBITERS = ['🛰️', '📡', '🤖', '🧠', '🌿', '💧'];

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

function makeParticle(x, y, className, symbol) {
  const particle = document.createElement('span');
  particle.className = className;
  particle.textContent = symbol;
  particle.style.left = `${x}px`;
  particle.style.top = `${y}px`;
  document.body.appendChild(particle);

  window.setTimeout(() => {
    particle.remove();
  }, 1700);
}

function runWelcomeBloom() {
  const total = 30;
  const centerX = window.innerWidth / 2;
  const centerY = Math.min(window.innerHeight * 0.35, 260);

  Array.from({ length: total }).forEach((_, index) => {
    window.setTimeout(() => {
      const spreadX = (Math.random() - 0.5) * window.innerWidth * 0.75;
      const spreadY = (Math.random() - 0.5) * 260;
      const symbol = index % 4 === 0 ? '🌱' : index % 3 === 0 ? '🌸' : index % 2 === 0 ? '✨' : '🍃';
      makeParticle(centerX + spreadX, centerY + spreadY, 'hortelan-particle hortelan-particle--welcome', symbol);
    }, index * 45);
  });
}

function createCursorTrailDot() {
  const dot = document.createElement('span');
  dot.className = 'hortelan-cursor-trail-dot';
  document.body.appendChild(dot);
  return dot;
}

export default function HortelanPlayfulEffects() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const heartPoints = [
    { className: 'hortelan-heartbeat-point--top-left', label: 'Saúde da horta: estável' },
    { className: 'hortelan-heartbeat-point--top-right', label: 'Saúde da horta: vigorosa' },
    { className: 'hortelan-heartbeat-point--bottom-left', label: 'Saúde da horta: hidratada' }
  ];

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      return undefined;
    }

    if (!window.localStorage.getItem(FIRST_VISIT_KEY)) {
      runWelcomeBloom();
      window.localStorage.setItem(FIRST_VISIT_KEY, 'true');
    }

    const sections = Array.from(document.querySelectorAll('main section, [data-animate-on-scroll], .MuiCard-root, .MuiPaper-root'));
    sections.forEach((section, index) => {
      const node = section;
      node.classList.add('hortelan-scroll-reveal');
      node.style.setProperty('--hortelan-reveal-delay', `${Math.min(index * 30, 320)}ms`);
    });

    const atmosphereLayer = document.createElement('div');
    atmosphereLayer.className = 'hortelan-atmosphere-layer';
    document.body.appendChild(atmosphereLayer);

    const orbitNodes = ORBITERS.map((symbol, index) => {
      const orbiter = document.createElement('span');
      orbiter.className = 'hortelan-orbiter';
      orbiter.textContent = symbol;
      orbiter.style.setProperty('--hortelan-orbit-duration', `${12 + index * 2.4}s`);
      orbiter.style.setProperty('--hortelan-orbit-radius', `${80 + index * 18}px`);
      orbiter.style.setProperty('--hortelan-orbit-angle', `${index * (360 / ORBITERS.length)}deg`);
      orbiter.style.setProperty('--hortelan-orbit-size', `${1.1 + index * 0.08}rem`);
      atmosphereLayer.appendChild(orbiter);
      return orbiter;
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('hortelan-scroll-reveal--visible');
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
    );

    sections.forEach((section) => observer.observe(section));

    const trailDots = Array.from({ length: MAX_CURSOR_TRAIL }, () => createCursorTrailDot());
    const trailPositions = trailDots.map(() => ({ x: window.innerWidth / 2, y: window.innerHeight / 2 }));

    let ticking = false;
    let pointerX = window.innerWidth / 2;
    let pointerY = window.innerHeight / 2;

    const drawTrail = () => {
      trailPositions[0].x += (pointerX - trailPositions[0].x) * 0.35;
      trailPositions[0].y += (pointerY - trailPositions[0].y) * 0.35;

      for (let i = 1; i < trailPositions.length; i += 1) {
        trailPositions[i].x += (trailPositions[i - 1].x - trailPositions[i].x) * 0.42;
        trailPositions[i].y += (trailPositions[i - 1].y - trailPositions[i].y) * 0.42;
      }

      trailDots.forEach((dot, index) => {
        const size = Math.max(4, 10 - index * 0.48);
        dot.style.width = `${size}px`;
        dot.style.height = `${size}px`;
        dot.style.left = `${trailPositions[index].x}px`;
        dot.style.top = `${trailPositions[index].y}px`;
        dot.style.opacity = `${Math.max(0.08, 0.85 - index * 0.055)}`;
      });

      window.requestAnimationFrame(drawTrail);
    };

    const updateScroll = () => {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      const currentProgress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
      setScrollProgress(Math.max(0, Math.min(currentProgress, 100)));

      document.body.style.setProperty('--hortelan-scroll-depth', `${Math.min(window.scrollY * 0.08, 32)}px`);
      document.body.style.setProperty('--hortelan-scroll-energy', `${Math.min(currentProgress / 100, 1)}`);

      if (Math.random() > 0.86) {
        const x = Math.random() * window.innerWidth;
        const y = window.innerHeight - 40 - Math.random() * 180;
        const symbol = Math.random() > 0.5 ? '🍀' : '💧';
        makeParticle(x, y, 'hortelan-particle hortelan-particle--scroll', symbol);
      }

      if (Math.random() > 0.8) {
        const raindrop = document.createElement('span');
        raindrop.className = 'hortelan-rain-drop';
        raindrop.textContent = Math.random() > 0.5 ? '💧' : '🫧';
        raindrop.style.left = `${randomBetween(8, 92)}vw`;
        raindrop.style.animationDuration = `${randomBetween(1.4, 2.4)}s`;
        atmosphereLayer.appendChild(raindrop);
        window.setTimeout(() => raindrop.remove(), 2600);
      }

      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScroll);
        ticking = true;
      }
    };

    const onPointerMove = (event) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
    };

    const onClick = (event) => {
      const symbols = ['🌿', '✨', '💧', '🌻', '🍓', '🥕', '📶', '🤖', '🛰️'];
      const symbol = symbols[Math.floor(Math.random() * symbols.length)];

      for (let i = 0; i < 5; i += 1) {
        const jitterX = event.clientX + (Math.random() - 0.5) * 42;
        const jitterY = event.clientY + (Math.random() - 0.5) * 28;
        window.setTimeout(() => {
          makeParticle(jitterX, jitterY, 'hortelan-particle hortelan-particle--click', symbol);
        }, i * 40);
      }

      const clickable = event.target.closest('button, a, [role="button"], .MuiCard-root');
      if (clickable) {
        clickable.classList.remove('hortelan-click-pulse');
        window.requestAnimationFrame(() => clickable.classList.add('hortelan-click-pulse'));
      }

      if (Math.random() > 0.42) {
        const ripple = document.createElement('span');
        ripple.className = 'hortelan-water-ripple';
        ripple.style.left = `${event.clientX}px`;
        ripple.style.top = `${event.clientY}px`;
        atmosphereLayer.appendChild(ripple);
        window.setTimeout(() => ripple.remove(), 900);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('click', onClick);

    updateScroll();
    drawTrail();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('click', onClick);
      observer.disconnect();
      trailDots.forEach((dot) => dot.remove());
      orbitNodes.forEach((node) => node.remove());
      atmosphereLayer.remove();
      sections.forEach((section) => {
        section.classList.remove('hortelan-scroll-reveal', 'hortelan-scroll-reveal--visible');
        section.style.removeProperty('--hortelan-reveal-delay');
      });
      document.body.style.removeProperty('--hortelan-scroll-depth');
      document.body.style.removeProperty('--hortelan-scroll-energy');
    };
  }, []);

  return (
    <>
      <div className="hortelan-scroll-progress-track" aria-hidden="true">
        <div className="hortelan-scroll-progress-bar" style={{ width: `${scrollProgress}%` }} />
      </div>

      <div className="hortelan-heartbeat-layer" aria-hidden="true">
        {heartPoints.map((point) => (
          <span key={point.className} className={`hortelan-heartbeat-point ${point.className}`} role="img" aria-label={point.label}>
            ❤️
          </span>
        ))}
      </div>

      <style>
        {`
          body {
            background-position-y: var(--hortelan-scroll-depth, 0px);
            transition: background-position 180ms linear;
          }

          body::before {
            content: '';
            position: fixed;
            inset: 0;
            pointer-events: none;
            z-index: 0;
            opacity: calc(0.08 + var(--hortelan-scroll-energy, 0) * 0.16);
            background: radial-gradient(circle at 10% 20%, rgba(111, 140, 255, 0.2), transparent 42%),
              radial-gradient(circle at 80% 30%, rgba(23, 185, 120, 0.2), transparent 40%),
              radial-gradient(circle at 35% 75%, rgba(18, 176, 201, 0.18), transparent 46%);
            transition: opacity 180ms linear;
          }

          .hortelan-atmosphere-layer {
            position: fixed;
            inset: 0;
            pointer-events: none;
            z-index: 1496;
            overflow: hidden;
          }

          .hortelan-orbiter {
            position: absolute;
            left: 50%;
            top: 18%;
            font-size: var(--hortelan-orbit-size, 1.2rem);
            animation: hortelan-orbit var(--hortelan-orbit-duration, 14s) linear infinite;
            transform-origin: 0 0;
            filter: drop-shadow(0 2px 8px rgba(18, 176, 201, 0.4));
            opacity: 0.85;
          }

          .hortelan-rain-drop {
            position: absolute;
            top: -10%;
            font-size: 1.05rem;
            opacity: 0.8;
            animation: hortelan-rain-fall 1.9s linear forwards;
          }

          .hortelan-water-ripple {
            position: fixed;
            width: 16px;
            height: 16px;
            transform: translate(-50%, -50%);
            border-radius: 999px;
            border: 2px solid rgba(18, 176, 201, 0.6);
            box-shadow: 0 0 0 0 rgba(18, 176, 201, 0.3);
            animation: hortelan-ripple 900ms ease-out forwards;
          }

          .hortelan-scroll-progress-track {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 5px;
            z-index: 1500;
            pointer-events: none;
            background: rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(8px);
          }

          .hortelan-scroll-progress-bar {
            height: 100%;
            background: linear-gradient(90deg, #7bc96f, #17b978, #12b0c9, #6f8cff);
            box-shadow: 0 0 14px rgba(23, 185, 120, 0.75);
            transition: width 120ms ease-out;
          }

          .hortelan-heartbeat-layer {
            position: fixed;
            inset: 0;
            z-index: 1497;
            pointer-events: none;
          }

          .hortelan-heartbeat-point {
            position: fixed;
            font-size: clamp(1.1rem, 1.2vw, 1.35rem);
            filter: drop-shadow(0 0 10px rgba(255, 53, 102, 0.4));
            animation: hortelan-heartbeat 1.5s ease-in-out infinite;
            opacity: 0.95;
          }

          .hortelan-heartbeat-point--top-left {
            top: 96px;
            left: 20px;
          }

          .hortelan-heartbeat-point--top-right {
            top: 126px;
            right: 24px;
            animation-delay: 240ms;
          }

          .hortelan-heartbeat-point--bottom-left {
            bottom: 26px;
            left: 18px;
            animation-delay: 480ms;
          }

          .hortelan-particle {
            position: fixed;
            z-index: 1499;
            pointer-events: none;
            transform: translate(-50%, -50%);
            animation: hortelan-float 1.55s ease-out forwards;
            will-change: transform, opacity;
            text-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
          }

          .hortelan-particle--welcome {
            font-size: 1.45rem;
            animation-duration: 1.7s;
          }

          .hortelan-particle--scroll {
            font-size: 1.2rem;
            animation-duration: 1.45s;
          }

          .hortelan-particle--click {
            font-size: 1.5rem;
            animation-duration: 1.2s;
          }

          .hortelan-cursor-trail-dot {
            position: fixed;
            z-index: 1498;
            pointer-events: none;
            transform: translate(-50%, -50%);
            border-radius: 999px;
            background: radial-gradient(circle, rgba(123, 201, 111, 0.95), rgba(18, 176, 201, 0.6));
            filter: blur(0.2px);
            box-shadow: 0 0 10px rgba(23, 185, 120, 0.4);
            mix-blend-mode: screen;
          }

          .hortelan-scroll-reveal {
            opacity: 0;
            transform: translateY(14px) scale(0.99);
            transition: transform 500ms cubic-bezier(0.2, 0.9, 0.2, 1), opacity 500ms ease-out;
            transition-delay: var(--hortelan-reveal-delay, 0ms);
          }

          .hortelan-scroll-reveal--visible {
            opacity: 1;
            transform: translateY(0) scale(1);
          }

          .hortelan-click-pulse {
            animation: hortelan-click-pulse 460ms ease-out;
          }

          @keyframes hortelan-float {
            0% {
              opacity: 0;
              transform: translate(-50%, -15%) scale(0.72) rotate(-6deg);
            }
            22% {
              opacity: 1;
            }
            100% {
              opacity: 0;
              transform: translate(-50%, -200%) scale(1.14) rotate(14deg);
            }
          }

          @keyframes hortelan-click-pulse {
            0% {
              transform: translateZ(0) scale(1);
              box-shadow: 0 0 0 rgba(23, 185, 120, 0);
            }
            35% {
              transform: translateZ(0) scale(1.03);
              box-shadow: 0 0 0 8px rgba(23, 185, 120, 0.18);
            }
            100% {
              transform: translateZ(0) scale(1);
              box-shadow: 0 0 0 rgba(23, 185, 120, 0);
            }
          }

          @keyframes hortelan-orbit {
            from {
              transform: rotate(var(--hortelan-orbit-angle, 0deg)) translateX(var(--hortelan-orbit-radius, 100px)) rotate(0deg);
            }
            to {
              transform: rotate(calc(var(--hortelan-orbit-angle, 0deg) + 1turn)) translateX(var(--hortelan-orbit-radius, 100px)) rotate(-1turn);
            }
          }

          @keyframes hortelan-rain-fall {
            0% {
              transform: translateY(-4vh) translateX(0) rotate(0deg);
              opacity: 0;
            }
            20% {
              opacity: 0.9;
            }
            100% {
              transform: translateY(108vh) translateX(22px) rotate(8deg);
              opacity: 0;
            }
          }

          @keyframes hortelan-ripple {
            0% {
              transform: translate(-50%, -50%) scale(0.35);
              opacity: 0.9;
            }
            100% {
              transform: translate(-50%, -50%) scale(8);
              opacity: 0;
            }
          }

          @keyframes hortelan-heartbeat {
            0%,
            100% {
              transform: scale(0.95);
            }
            20% {
              transform: scale(1.2);
            }
            40% {
              transform: scale(1);
            }
            60% {
              transform: scale(1.15);
            }
            80% {
              transform: scale(1);
            }
          }

          @media (prefers-reduced-motion: reduce) {
            .hortelan-scroll-progress-track,
            .hortelan-particle,
            .hortelan-cursor-trail-dot,
            .hortelan-atmosphere-layer,
            .hortelan-heartbeat-layer {
              display: none;
            }

            body::before {
              display: none;
            }
          }
        `}
      </style>
    </>
  );
}
