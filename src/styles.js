export const styles = {
  root: { position: "relative", width: "100vw", height: "100vh", overflow: "hidden", background: "#0b1220" },
  scene: { position: "absolute", inset: 0 },

  homeLayer: { position: "absolute", inset: 0, background: "#F7FAFC" },
  revealMask: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(90deg, rgba(255,255,255,0.00) 0%, rgba(255,255,255,0.18) 40%, rgba(255,255,255,0.00) 100%)",
    pointerEvents: "none",
    mixBlendMode: "overlay",
  },

  soyMask: { position: "absolute", inset: 0, pointerEvents: "none" },
  cutMask: { position: "absolute", inset: 0, pointerEvents: "none" },

  // Campo full-screen
  fieldFull: { position: "absolute", inset: 0, background: "#1c4a22" },
  fieldBaseA: {
    position: "absolute",
    inset: 0,
    background:
      "radial-gradient(circle at 20% 30%, rgba(70,160,85,0.55), rgba(0,0,0,0) 55%), radial-gradient(circle at 80% 65%, rgba(55,130,70,0.55), rgba(0,0,0,0) 58%), linear-gradient(180deg, #2e7d32 0%, #1f5d26 60%, #18481f 100%)",
    filter: "saturate(1.10)",
  },
  fieldBaseB: {
    position: "absolute",
    inset: 0,
    background:
      "repeating-linear-gradient(115deg, rgba(0,0,0,0.00) 0px, rgba(0,0,0,0.00) 14px, rgba(0,0,0,0.08) 14px, rgba(0,0,0,0.08) 19px)",
    opacity: 0.55,
    mixBlendMode: "multiply",
  },
  fieldVignette: {
    position: "absolute",
    inset: 0,
    background: "radial-gradient(circle at 50% 45%, rgba(0,0,0,0.0), rgba(0,0,0,0.35) 78%)",
    pointerEvents: "none",
  },

  // Área colhida
  cutFull: { position: "absolute", inset: 0, background: "linear-gradient(180deg, #8b5e34 0%, #6f4728 55%, #5a3a20 100%)" },
  stubbleRows: {
    position: "absolute",
    inset: 0,
    background:
      "repeating-linear-gradient(115deg, rgba(255,255,255,0.00) 0px, rgba(255,255,255,0.00) 16px, rgba(0,0,0,0.18) 16px, rgba(0,0,0,0.18) 20px)",
    opacity: 0.55,
  },
  stubbleNoise: {
    position: "absolute",
    inset: 0,
    background:
      "radial-gradient(circle at 20% 70%, rgba(0,0,0,0.16), rgba(0,0,0,0) 42%), radial-gradient(circle at 80% 30%, rgba(0,0,0,0.12), rgba(0,0,0,0) 46%)",
    mixBlendMode: "multiply",
  },
  stubbleVignette: { position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 50%, rgba(0,0,0,0), rgba(0,0,0,0.22) 78%)" },

  leafBlobA: { position: "absolute", left: "8vw", top: "58vh", width: 340, height: 250, background: "radial-gradient(circle at 30% 40%, rgba(10,30,12,0.35), rgba(0,0,0,0) 62%)", filter: "blur(2px)" },
  leafBlobB: { position: "absolute", left: "66vw", top: "44vh", width: 420, height: 300, background: "radial-gradient(circle at 30% 40%, rgba(10,30,12,0.32), rgba(0,0,0,0) 65%)", filter: "blur(2px)" },
  leafBlobC: { position: "absolute", left: "30vw", top: "20vh", width: 520, height: 380, background: "radial-gradient(circle at 30% 40%, rgba(0,0,0,0.18), rgba(0,0,0,0) 62%)", filter: "blur(3px)" },

  // Corte (com blur dinâmico aplicado no componente)
  edgeShadow: { position: "absolute", top: 0, bottom: 0, width: 22, background: "linear-gradient(90deg, rgba(0,0,0,0.28), rgba(0,0,0,0))", pointerEvents: "none" },

  // Harvester wrap
  harvesterWrap: { position: "absolute", top: "50vh", left: 0, width: 460, height: 300, pointerEvents: "none" },

  // Canvas particles
  particlesCanvas: { position: "absolute", inset: 0, pointerEvents: "none" },

  // HUD
  hud: {
    position: "absolute",
    left: 34,
    top: 26,
    zIndex: 5,
    color: "#0F172A",
    fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
  },
  loadingText: { fontSize: 18, fontWeight: 800, opacity: 0.92, textShadow: "0 1px 0 rgba(255,255,255,0.35)" },
  progressOuter: { marginTop: 10, width: 420, height: 14, borderRadius: 999, background: "rgba(226,232,240,0.95)", overflow: "hidden", boxShadow: "0 10px 28px rgba(0,0,0,0.10)" },
  progressInner: { height: "100%", width: "100%", borderRadius: 999, background: "linear-gradient(90deg, #3AA66A, #6FCF97)" },

  fade: { position: "absolute", inset: 0, background: "#FFFFFF", pointerEvents: "none" },

  // Home mock
  homeMock: { position: "absolute", inset: 0, background: "#F7FAFC", fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial" },
  homeTop: { height: 90, background: "#fff", borderBottom: "1px solid rgba(15,23,42,0.08)", display: "flex", alignItems: "center", padding: "0 40px" },
  homeTitle: { fontSize: 40, fontWeight: 900, color: "#0F172A" },
  homeCards: { padding: 40, display: "grid", gap: 22, width: 420 },
  card: { background: "#fff", border: "2px solid rgba(15,23,42,0.08)", borderRadius: 22, padding: 20, boxShadow: "0 14px 28px rgba(0,0,0,0.06)" },
  cardTitle: { fontSize: 18, fontWeight: 800, color: "#111827" },
  cardBar: { marginTop: 14, height: 26, borderRadius: 16, background: "rgba(226,232,240,0.8)" },
  homeBottomPill: { position: "absolute", left: 40, bottom: 40, padding: "12px 18px", borderRadius: 999, background: "#fff", border: "2px solid rgba(15,23,42,0.08)", color: "#334155", fontWeight: 800, boxShadow: "0 14px 28px rgba(0,0,0,0.06)", width: "fit-content" },
};
