import { useEffect, useRef, useCallback } from "react";

export default function useParticlesCanvas({ getSize }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const partsRef = useRef([]);
  const lastRef = useRef(performance.now());

  const emitAt = useCallback((x, y, count = 6) => {
    const parts = partsRef.current;
    for (let i = 0; i < count; i++) {
      parts.push({
        x: x + (Math.random() - 0.5) * 18,
        y: y + (Math.random() - 0.5) * 14,
        vx: -60 - Math.random() * 120,
        vy: -30 + Math.random() * 60,
        life: 0.6 + Math.random() * 0.7,
        size: 1.2 + Math.random() * 3.2,
      });
    }
    // limita pra não explodir
    if (parts.length > 700) parts.splice(0, parts.length - 700);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    const tick = (now) => {
      const dt = Math.min(0.033, (now - lastRef.current) / 1000);
      lastRef.current = now;

      const { width, height } = getSize();
      canvas.width = Math.floor(width * devicePixelRatio);
      canvas.height = Math.floor(height * devicePixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);

      ctx.clearRect(0, 0, width, height);

      const parts = partsRef.current;

      // update
      for (const p of parts) {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vy += 60 * dt; // gravidade
        p.life -= dt;
      }

      // draw
      ctx.globalCompositeOperation = "lighter";
      for (const p of parts) {
        if (p.life <= 0) continue;
        const a = Math.max(0, Math.min(1, p.life / 1.2));
        ctx.fillStyle = `rgba(${Math.floor(170 + 40 * (1 - a))}, ${Math.floor(150 + 30 * (1 - a))}, ${Math.floor(
          110 + 20 * (1 - a)
        )}, ${0.9 * a})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";

      // cull
      partsRef.current = parts.filter((p) => p.life > 0 && p.x > -200 && p.y < height + 200);

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [getSize]);

  return { canvasRef, emitAt };
}
