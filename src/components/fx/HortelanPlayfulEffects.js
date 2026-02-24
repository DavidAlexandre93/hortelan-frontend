import { useEffect, useState } from 'react';

const FIRST_VISIT_KEY = 'hortelan:first-visit-effects-done';
const MAX_CURSOR_TRAIL = 14;

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

      if (Math.random() > 0.86) {
        const x = Math.random() * window.innerWidth;
        const y = window.innerHeight - 40 - Math.random() * 180;
        const symbol = Math.random() > 0.5 ? '🍀' : '💧';
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

    const onPointerMove = (event) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
    };

    const onClick = (event) => {
      const symbols = ['🌿', '✨', '💧', '🌻', '🍓', '🥕'];
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
      sections.forEach((section) => {
        section.classList.remove('hortelan-scroll-reveal', 'hortelan-scroll-reveal--visible');
        section.style.removeProperty('--hortelan-reveal-delay');
      });
      document.body.style.removeProperty('--hortelan-scroll-depth');
    };
  }, []);

  return (
    <>
      <div className="hortelan-scroll-progress-track" aria-hidden="true">
        <div className="hortelan-scroll-progress-bar" style={{ width: `${scrollProgress}%` }} />
      </div>

      <style>
        {`
          body {
            background-position-y: var(--hortelan-scroll-depth, 0px);
            transition: background-position 180ms linear;
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

          @media (prefers-reduced-motion: reduce) {
            .hortelan-scroll-progress-track,
            .hortelan-particle,
            .hortelan-cursor-trail-dot {
              display: none;
            }
          }
        `}
      </style>
    </>
  );
}
