import { useEffect, useRef, useState } from 'react';

const styles = {
  splashRoot: {
    position: 'fixed',
    inset: 0,
    zIndex: 9999,
    overflow: 'hidden',
    background: '#0b1b0f',
    pointerEvents: 'none',
  },
  revealLayer: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(180deg, rgba(8, 23, 12, 0.74) 0%, rgba(8, 23, 12, 0.9) 100%)',
    willChange: 'clip-path',
  },
  canvasLayer: { position: 'absolute', inset: 0 },
  brand: {
    position: 'absolute',
    left: 24,
    top: 18,
    padding: '10px 12px',
    borderRadius: 14,
    background: 'rgba(0,0,0,0.35)',
    color: 'white',
    backdropFilter: 'blur(6px)',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.24)',
  },
  brandTitle: { fontWeight: 900, letterSpacing: 0.2 },
  brandSub: { opacity: 0.85, fontSize: 12, marginTop: 2 },
};

const easeOutExpo = (x) => (x === 1 ? 1 : 1 - 2 ** (-10 * x));

function createPlants(width, height) {
  const plants = [];
  for (let x = 30; x < width + 80; x += 32) {
    for (let y = 110; y < height - 30; y += 38) {
      if (((x * 13 + y * 7) % 11) < 4) {
        plants.push({
          x: x + (Math.random() - 0.5) * 8,
          y: y + (Math.random() - 0.5) * 8,
          scale: 0.8 + Math.random() * 0.55,
          baseRotation: (Math.random() - 0.5) * 0.16,
        });
      }
    }
  }
  return plants;
}

function drawScene(ctx, width, height, progress, plants) {
  const machineX = -120 + progress * (width + 240);
  const machineY = height * 0.62 + Math.sin(progress * Math.PI * 10) * 2;
  const harvestedWidth = Math.max(0, Math.min(width, machineX + 40));

  ctx.clearRect(0, 0, width, height);

  const sky = ctx.createLinearGradient(0, 0, 0, height);
  sky.addColorStop(0, '#165326');
  sky.addColorStop(1, '#0b1f0f');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, width, height);

  ctx.globalAlpha = 0.7;
  ctx.fillStyle = '#2f7d35';
  ctx.fillRect(0, 0, harvestedWidth, height);

  ctx.globalAlpha = 0.24;
  ctx.fillStyle = '#ffffff';
  for (let y = -40; y < height + 40; y += 30) {
    ctx.beginPath();
    ctx.moveTo(0, y - progress * 90);
    ctx.lineTo(width, y - 18 - progress * 90);
    ctx.lineTo(width, y + 6 - progress * 90);
    ctx.lineTo(0, y + 24 - progress * 90);
    ctx.closePath();
    ctx.fill();
  }

  ctx.globalAlpha = 0.3;
  ctx.fillStyle = '#000000';
  for (let y = -20; y < height + 40; y += 30) {
    ctx.beginPath();
    ctx.moveTo(0, y - progress * 160);
    ctx.lineTo(width, y - 18 - progress * 160);
    ctx.lineTo(width, y + 6 - progress * 160);
    ctx.lineTo(0, y + 24 - progress * 160);
    ctx.closePath();
    ctx.fill();
  }

  ctx.globalAlpha = 1;
  plants.forEach((plant) => {
    if (plant.x <= harvestedWidth) return;

    const sway = Math.sin(progress * 12 + plant.x * 0.02) * 0.09;
    const rotation = plant.baseRotation + sway;
    const h = 20 * plant.scale;

    ctx.save();
    ctx.translate(plant.x, plant.y);
    ctx.rotate(rotation);
    ctx.fillStyle = '#0b3b14';
    ctx.fillRect(-1, -h, 2, h);

    ctx.fillStyle = '#58d180';
    ctx.beginPath();
    ctx.ellipse(0, -h - 6, 8 * plant.scale, 6 * plant.scale, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#46b96b';
    ctx.beginPath();
    ctx.ellipse(-6 * plant.scale, -h + 3, 6 * plant.scale, 4 * plant.scale, -0.4, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#6fe39a';
    ctx.beginPath();
    ctx.ellipse(5 * plant.scale, -h + 4, 5 * plant.scale, 4 * plant.scale, 0.35, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });

  ctx.save();
  ctx.translate(machineX, machineY);

  ctx.fillStyle = 'rgba(0,0,0,0.2)';
  ctx.beginPath();
  ctx.ellipse(0, 55, 90, 18, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#f2c94c';
  ctx.strokeStyle = '#5f4b10';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(-70, -46, 140, 72, 16);
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.roundRect(20, -78, 50, 50, 14);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = 'rgba(74,163,217,0.55)';
  ctx.strokeStyle = 'rgba(40,80,107,0.6)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(30, -70, 30, 30, 10);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#e2553a';
  ctx.strokeStyle = '#5a1f15';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(-125, 10, 120, 40, 14);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = 'rgba(255,230,210,0.7)';
  for (let i = 0; i < 10; i += 1) {
    ctx.fillRect(-115 + i * 12, 14, 2, 32);
  }

  ctx.fillStyle = '#111111';
  [[-30, 36], [40, 36]].forEach(([x, y]) => {
    ctx.beginPath();
    ctx.arc(x, y, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#8a8a8a';
    ctx.beginPath();
    ctx.arc(x, y, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#111111';
  });

  for (let i = 0; i < 26; i += 1) {
    const px = -30 + (Math.random() - 0.5) * 32;
    const py = 28 + (Math.random() - 0.5) * 24;
    const r = 4 + Math.random() * 8;
    const alpha = 0.16 + Math.random() * 0.28;
    const dust = ctx.createRadialGradient(px, py, 1, px, py, r);
    dust.addColorStop(0, `rgba(235,225,180,${alpha})`);
    dust.addColorStop(1, 'rgba(235,225,180,0)');
    ctx.fillStyle = dust;
    ctx.beginPath();
    ctx.arc(px, py, r, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

export default function HarvestSplashScreen({ onComplete, durationSec = 14 }) {
  const canvasRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [finished, setFinished] = useState(false);
  const animationState = useRef({ rafId: 0, plants: [] });
  const progressRef = useRef(0);

  useEffect(() => {
    const duration = durationSec * 1000;
    const started = performance.now();

    const step = (now) => {
      const t = Math.min(1, (now - started) / duration);
      const easedProgress = easeOutExpo(t);
      progressRef.current = easedProgress;
      setProgress(easedProgress);

      if (t < 1) {
        animationState.current.rafId = requestAnimationFrame(step);
      } else {
        setFinished(true);
        onComplete?.();
      }
    };

    animationState.current.rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationState.current.rafId);
  }, [durationSec, onComplete]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || finished) return undefined;

    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    const resize = () => {
      const ratio = window.devicePixelRatio || 1;
      canvas.width = Math.floor(window.innerWidth * ratio);
      canvas.height = Math.floor(window.innerHeight * ratio);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      animationState.current.plants = createPlants(window.innerWidth, window.innerHeight);
    };

    resize();
    window.addEventListener('resize', resize);

    let rafId = 0;
    const drawFrame = () => {
      drawScene(ctx, window.innerWidth, window.innerHeight, progressRef.current, animationState.current.plants);
      rafId = requestAnimationFrame(drawFrame);
    };
    drawFrame();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
    };
  }, [finished]);

  if (finished) return null;

  return (
    <div style={styles.splashRoot} aria-hidden="true">
      <div style={{ ...styles.revealLayer, clipPath: `inset(0 ${(1 - progress) * 100}% 0 0)` }} />

      <div style={styles.canvasLayer}>
        <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0 }} />

        <div style={styles.brand}>
          <div style={styles.brandTitle}>Safra Vision</div>
          <div style={styles.brandSub}>Carregando…</div>
        </div>
      </div>
    </div>
  );
}
