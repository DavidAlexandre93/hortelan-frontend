import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, useMotionValue, useTransform, animate, useSpring } from "framer-motion";
import HarvesterSVG from "./HarvesterSVG";
import HomeMock from "./HomeMock";
import useParticlesCanvas from "./useParticlesCanvas";
import { styles } from "./styles";

export default function SplashHarvestPro({ onFinish }) {
  const [done, setDone] = useState(false);
  const containerRef = useRef(null);

  const p = useMotionValue(0);

  // Spring só para o HUD (barra), sem afetar a velocidade da colheitadeira
  const pSpring = useSpring(p, { stiffness: 120, damping: 22, mass: 0.6 });

  // dimensões responsivas
  const [W, setW] = useState(() => (typeof window !== "undefined" ? window.innerWidth : 1200));
  const [H, setH] = useState(() => (typeof window !== "undefined" ? window.innerHeight : 720));

  useEffect(() => {
    const onResize = () => {
      setW(window.innerWidth);
      setH(window.innerHeight);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Movimento principal linear e constante
  const harvX = useTransform(p, [0, 1], [-460, W + 160]);
  const cutX = useTransform(p, [0, 1], [0, W]);

  // blur dinâmico por velocidade (motion blur)
  const prevX = useRef(0);
  const blurMV = useMotionValue(0);

  useEffect(() => {
    const unsub = harvX.on("change", (x) => {
      const dx = Math.abs(x - prevX.current);
      prevX.current = x;
      // dx ~ pixels por frame; escala para blur
      const blur = Math.min(2, dx * 0.06);
      blurMV.set(blur);
    });
    return () => unsub();
  }, [harvX, blurMV]);

  // Partículas (Canvas 2D)
  const { canvasRef, emitAt } = useParticlesCanvas({
    getSize: () => ({ width: W, height: H }),
  });

  useEffect(() => {
    const controls = animate(p, 1, {
      duration: 24,
      ease: "linear",
      onComplete: () => {
        setDone(true);
        setTimeout(() => onFinish?.(), 320);
      },
    });
    return () => controls.stop();
  }, [onFinish, p]);

  // “soja procedural” full-screen (mais densa)
  const plants = useMemo(() => {
    const count = 2600;
    const arr = [];
    for (let i = 0; i < count; i++) {
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const s = 0.55 + Math.random() * 2.2;
      const o = 0.25 + Math.random() * 0.75;
      const hue = 108 + Math.random() * 28;
      const light = 22 + Math.random() * 18;
      arr.push({ id: i, x, y, s, o, hue, light });
    }
    return arr;
  }, []);

  // Emite partículas próximo ao header (posição aproximada)
  useEffect(() => {
    const unsub = harvX.on("change", (x) => {
      const px = x + 90; // header center approx
      const py = H * 0.62; // altura do header
      emitAt(px, py, 7);
    });
    return () => unsub();
  }, [harvX, H, emitAt]);

  return (
    <div ref={containerRef} style={styles.root}>
      {/* HOME por trás */}
      <div style={styles.homeLayer}>
        <HomeMock />
      </div>

      {/* Reveal da home conforme cutX aumenta */}
      <motion.div
        style={{
          ...styles.revealMask,
          clipPath: useTransform(cutX, (v) => `inset(0 ${Math.max(0, W - v)}px 0 0 round 0px)`),
        }}
      />

      {/* Cena (full soja) */}
      <div style={styles.scene}>
        {/* Soja não colhida (direita do corte) */}
        <motion.div
          style={{
            ...styles.soyMask,
            clipPath: useTransform(cutX, (v) => `inset(0 0 0 ${Math.min(W, v)}px)`),
          }}
        >
          <SoyPlantsFull plants={plants} />
        </motion.div>

        {/* Área colhida (esquerda do corte) */}
        <motion.div
          style={{
            ...styles.cutMask,
            clipPath: useTransform(cutX, (v) => `inset(0 ${Math.max(0, W - v)}px 0 0)`),
          }}
        >
          <CutStubbleFull />
        </motion.div>

        {/* Motion blur no corte + sombra */}
        <motion.div
          style={{
            ...styles.edgeShadow,
            x: cutX,
            filter: useTransform(blurMV, (b) => `blur(${Math.max(4, b * 0.9)}px)`),
            opacity: useTransform(blurMV, (b) => Math.min(0.55, 0.25 + b * 0.05)),
          }}
        />

        {/* Colheitadeira (com blur dinâmico) */}
        <motion.div
          style={{
            ...styles.harvesterWrap,
            x: harvX,
            filter: useTransform(blurMV, (b) => `drop-shadow(0 10px 18px rgba(0,0,0,0.26)) blur(${Math.min(1.2, b * 0.4)}px)`),
          }}
        >
          <HarvesterSVG />
        </motion.div>

        {/* Partículas (Canvas overlay) */}
        <canvas ref={canvasRef} style={styles.particlesCanvas} />

        {/* HUD */}
        <div style={styles.hud}>
          <div style={styles.loadingText}>Carregando…</div>
          <div style={styles.progressOuter}>
            <motion.div
              style={{
                ...styles.progressInner,
                scaleX: useTransform(pSpring, [0, 1], [0, 1]),
                transformOrigin: "0% 50%",
              }}
            />
          </div>
        </div>
      </div>

      {/* fade-out */}
      <motion.div
        style={styles.fade}
        initial={{ opacity: 0 }}
        animate={{ opacity: done ? 1 : 0 }}
        transition={{ duration: 0.25 }}
      />
    </div>
  );
}

/* ---------- Subcomponentes ---------- */

function SoyPlantsFull({ plants }) {
  return (
    <div style={styles.fieldFull}>
      <div style={styles.fieldBaseA} />
      <div style={styles.fieldBaseB} />
      <div style={styles.fieldVignette} />

      {plants.map((p) => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.x}vw`,
            top: `${p.y}vh`,
            width: `${p.s * 9}px`,
            height: `${p.s * 9}px`,
            borderRadius: 999,
            background: `hsla(${p.hue}, 48%, ${p.light}%, ${p.o})`,
            boxShadow: `
              0 0 0 ${p.s * 1.3}px hsla(${p.hue}, 55%, ${Math.max(12, p.light - 10)}%, ${p.o * 0.28}),
              0 ${p.s * 2.2}px ${p.s * 2.4}px rgba(0,0,0,0.12)
            `,
            filter: `blur(${Math.max(0, 1.2 - p.s)}px)`,
            transform: "translateZ(0)",
          }}
        />
      ))}

      <div style={styles.leafBlobA} />
      <div style={styles.leafBlobB} />
      <div style={styles.leafBlobC} />
    </div>
  );
}

function CutStubbleFull() {
  return (
    <div style={styles.cutFull}>
      <div style={styles.stubbleRows} />
      <div style={styles.stubbleNoise} />
      <div style={styles.stubbleVignette} />
    </div>
  );
}
