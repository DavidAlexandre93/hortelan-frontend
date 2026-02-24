import { useEffect, useState } from 'react';

const FIRST_VISIT_KEY = 'hortelan:first-visit-effects-done';

function makeParticle(x, y, className, symbol) {
  const particle = document.createElement('span');
  particle.className = className;
  particle.textContent = symbol;
  particle.style.left = `${x}px`;
  particle.style.top = `${y}px`;
  document.body.appendChild(particle);

  window.setTimeout(() => {
    particle.remove();
  }, 1500);
}

function runWelcomeBloom() {
  const total = 22;
  const centerX = window.innerWidth / 2;
  const centerY = Math.min(window.innerHeight * 0.3, 240);

  Array.from({ length: total }).forEach((_, index) => {
    window.setTimeout(() => {
      const spreadX = (Math.random() - 0.5) * window.innerWidth * 0.6;
      const spreadY = (Math.random() - 0.5) * 220;
      const symbol = index % 3 === 0 ? '🌱' : index % 2 === 0 ? '✨' : '🍃';
      makeParticle(centerX + spreadX, centerY + spreadY, 'hortelan-particle hortelan-particle--welcome', symbol);
    }, index * 55);
  });
}

export default function HortelanPlayfulEffects() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      return undefined;
    }

    if (!window.localStorage.getItem(FIRST_VISIT_KEY)) {
      runWelcomeBloom();
      window.localStorage.setItem(FIRST_VISIT_KEY, 'true');
    }

    let ticking = false;

    const updateScroll = () => {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      const currentProgress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
      setScrollProgress(Math.max(0, Math.min(currentProgress, 100)));

      if (Math.random() > 0.82) {
        const x = Math.random() * window.innerWidth;
        const y = window.innerHeight - 40 - Math.random() * 120;
        const symbol = Math.random() > 0.5 ? '🍀' : '✨';
        makeParticle(x, y, 'hortelan-particle hortelan-particle--scroll', symbol);
      }

      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScroll);
        ticking = true;
      }
    };

    const onClick = (event) => {
      const symbols = ['🌿', '✨', '💧', '🌻'];
      const symbol = symbols[Math.floor(Math.random() * symbols.length)];
      makeParticle(event.clientX, event.clientY, 'hortelan-particle hortelan-particle--click', symbol);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('click', onClick);

    updateScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('click', onClick);
    };
  }, []);

  return (
    <>
      <div className="hortelan-scroll-progress-track" aria-hidden="true">
        <div className="hortelan-scroll-progress-bar" style={{ width: `${scrollProgress}%` }} />
      </div>

      <style>
        {`
          .hortelan-scroll-progress-track {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 4px;
            z-index: 1500;
            pointer-events: none;
            background: rgba(255, 255, 255, 0.18);
            backdrop-filter: blur(6px);
          }

          .hortelan-scroll-progress-bar {
            height: 100%;
            background: linear-gradient(90deg, #7bc96f, #17b978, #12b0c9);
            box-shadow: 0 0 12px rgba(23, 185, 120, 0.7);
            transition: width 140ms ease-out;
          }

          .hortelan-particle {
            position: fixed;
            z-index: 1499;
            pointer-events: none;
            transform: translate(-50%, -50%);
            animation: hortelan-float 1.45s ease-out forwards;
            will-change: transform, opacity;
            text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
          }

          .hortelan-particle--welcome {
            font-size: 1.35rem;
            animation-duration: 1.5s;
          }

          .hortelan-particle--scroll {
            font-size: 1.2rem;
            animation-duration: 1.35s;
          }

          .hortelan-particle--click {
            font-size: 1.45rem;
            animation-duration: 1.25s;
          }

          @keyframes hortelan-float {
            0% {
              opacity: 0;
              transform: translate(-50%, -20%) scale(0.7) rotate(-5deg);
            }
            20% {
              opacity: 1;
            }
            100% {
              opacity: 0;
              transform: translate(-50%, -180%) scale(1.12) rotate(12deg);
            }
          }

          @media (prefers-reduced-motion: reduce) {
            .hortelan-scroll-progress-track,
            .hortelan-particle {
              display: none;
            }
          }
        `}
      </style>
    </>
  );
}
