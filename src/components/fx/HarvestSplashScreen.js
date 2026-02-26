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

export default function HarvestSplashScreen({ onComplete, durationSec = 14 }) {
  const pixiHostRef = useRef(null);
  const [finished, setFinished] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressRef = useRef(0);

  useEffect(() => {
    const durationMs = durationSec * 1000;
    const startedAt = performance.now();
    let rafId = 0;

    const step = (now) => {
      const normalized = Math.min(1, (now - startedAt) / durationMs);
      const eased = easeOutExpo(normalized);
      progressRef.current = eased;
      setProgress(eased);

      if (normalized < 1) {
        rafId = requestAnimationFrame(step);
      } else {
        setFinished(true);
        onComplete?.();
      }
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [durationSec, onComplete]);

  useEffect(() => {
    const pixiHost = pixiHostRef.current;
    if (!pixiHost) return undefined;

    let disposed = false;
    let app = null;
    let emitter = null;
    const modulePixi = 'pixi.js';
    const moduleEmitter = '@pixi/particle-emitter';

    import(/* @vite-ignore */ modulePixi)
      .then((pixiModule) => {
        if (!pixiModule || disposed || !pixiHost) return null;

        const PIXI = pixiModule;
        app = new PIXI.Application({
          resizeTo: pixiHost,
          antialias: true,
          backgroundAlpha: 0,
          powerPreference: 'high-performance',
        });
        pixiHost.appendChild(app.view);

        const farLayer = new PIXI.Container();
        const nearLayer = new PIXI.Container();
        const plantsLayer = new PIXI.Container();
        const harvestedLayer = new PIXI.Container();
        const machineLayer = new PIXI.Container();
        const fxLayer = new PIXI.Container();
        app.stage.addChild(farLayer, harvestedLayer, plantsLayer, nearLayer, fxLayer, machineLayer);

        const makeTexture = (drawFn) => {
          const canvas = document.createElement('canvas');
          canvas.width = 1024;
          canvas.height = 512;
          const ctx = canvas.getContext('2d');
          if (!ctx) return PIXI.Texture.EMPTY;
          drawFn(ctx, canvas.width, canvas.height);
          return PIXI.Texture.from(canvas);
        };

        const fieldFarTex = makeTexture((ctx, w, h) => {
          ctx.fillStyle = '#1f6f2a';
          ctx.fillRect(0, 0, w, h);
          ctx.globalAlpha = 0.35;
          for (let y = -40; y < h + 40; y += 30) {
            ctx.fillStyle = 'rgba(255,255,255,0.10)';
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(w, y - 18);
            ctx.lineTo(w, y + 6);
            ctx.lineTo(0, y + 24);
            ctx.closePath();
            ctx.fill();
          }
          ctx.globalAlpha = 1;
        });

        const fieldNearTex = makeTexture((ctx, w, h) => {
          ctx.fillStyle = '#1f6f2a';
          ctx.fillRect(0, 0, w, h);
          ctx.globalAlpha = 0.35;
          for (let y = -40; y < h + 40; y += 30) {
            ctx.fillStyle = 'rgba(0,0,0,0.10)';
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(w, y - 18);
            ctx.lineTo(w, y + 6);
            ctx.lineTo(0, y + 24);
            ctx.closePath();
            ctx.fill();
          }
          ctx.globalAlpha = 1;
        });

        const harvestedTex = makeTexture((ctx, w, h) => {
          ctx.fillStyle = '#2f7d35';
          ctx.fillRect(0, 0, w, h);
        });

        const far = new PIXI.TilingSprite(fieldFarTex, app.screen.width, app.screen.height);
        const near = new PIXI.TilingSprite(fieldNearTex, app.screen.width, app.screen.height);
        far.alpha = 0.9;
        near.alpha = 0.65;
        near.y = 12;
        farLayer.addChild(far);
        nearLayer.addChild(near);

        const harvested = new PIXI.TilingSprite(harvestedTex, 1, app.screen.height);
        harvested.alpha = 0.95;
        harvestedLayer.addChild(harvested);

        const plantTexture = (() => {
          const c = document.createElement('canvas');
          c.width = 40;
          c.height = 40;
          const ctx = c.getContext('2d');
          if (!ctx) return PIXI.Texture.EMPTY;
          ctx.strokeStyle = '#0b3b14';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(20, 18);
          ctx.lineTo(20, 36);
          ctx.stroke();
          ctx.fillStyle = '#58d180';
          ctx.beginPath();
          ctx.ellipse(20, 12, 10, 8, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#46b96b';
          ctx.beginPath();
          ctx.ellipse(12, 22, 8, 6, -0.5, 0, Math.PI * 2);
          ctx.fill();
          return PIXI.Texture.from(c);
        })();

        const plants = [];
        for (let x = 30; x < app.screen.width + 80; x += 32) {
          for (let y = 90; y < app.screen.height - 40; y += 38) {
            if (((x * 13 + y * 7) % 11) < 4) {
              const sprite = new PIXI.Sprite(plantTexture);
              sprite.anchor.set(0.5, 1);
              sprite.x = x + (Math.random() - 0.5) * 8;
              sprite.y = y + (Math.random() - 0.5) * 8;
              sprite.scale.set(0.8 + Math.random() * 0.55);
              sprite.rotation = (Math.random() - 0.5) * 0.15;
              sprite.baseX = sprite.x;
              plants.push(sprite);
              plantsLayer.addChild(sprite);
            }
          }
        }

        const machine = new PIXI.Container();
        machineLayer.addChild(machine);
        const body = new PIXI.Graphics();
        body.beginFill(0xf2c94c, 1);
        body.drawRoundedRect(-70, -46, 140, 72, 16);
        body.endFill();
        body.lineStyle(3, 0x5f4b10, 0.9);
        body.drawRoundedRect(-70, -46, 140, 72, 16);
        machine.addChild(body);

        const header = new PIXI.Graphics();
        header.beginFill(0xe2553a, 1);
        header.drawRoundedRect(-125, 10, 120, 40, 14);
        header.endFill();
        header.lineStyle(3, 0x5a1f15, 0.9);
        header.drawRoundedRect(-125, 10, 120, 40, 14);
        for (let i = 0; i < 10; i += 1) {
          header.beginFill(0xffe6d2, 0.7);
          header.drawRect(-115 + i * 12, 14, 2, 32);
          header.endFill();
        }
        machine.addChild(header);

        return import(/* @vite-ignore */ moduleEmitter)
          .then((emitterModule) => {
            if (!emitterModule || disposed) return null;

            const { Emitter } = emitterModule;
            const dustContainer = new PIXI.ParticleContainer(1000, {
              scale: true,
              position: true,
              alpha: true,
            });
            fxLayer.addChild(dustContainer);

            const dustTex = (() => {
              const c = document.createElement('canvas');
              c.width = 24;
              c.height = 24;
              const ctx = c.getContext('2d');
              if (!ctx) return PIXI.Texture.EMPTY;
              const g = ctx.createRadialGradient(12, 12, 2, 12, 12, 12);
              g.addColorStop(0, 'rgba(235,225,180,0.9)');
              g.addColorStop(1, 'rgba(235,225,180,0)');
              ctx.fillStyle = g;
              ctx.fillRect(0, 0, 24, 24);
              return PIXI.Texture.from(c);
            })();

            emitter = new Emitter(dustContainer, {
              lifetime: { min: 0.6, max: 1.6 },
              frequency: 0.01,
              spawnChance: 1,
              particlesPerWave: 1,
              emitterLifetime: -1,
              maxParticles: 900,
              pos: { x: 0, y: 0 },
              addAtBack: false,
              behaviors: [
                { type: 'alpha', config: { alpha: { list: [{ time: 0, value: 0 }, { time: 0.2, value: 0.55 }, { time: 1, value: 0 }] } } },
                { type: 'scale', config: { scale: { list: [{ time: 0, value: 0.35 }, { time: 1, value: 1 }] } } },
                { type: 'moveSpeed', config: { speed: { list: [{ time: 0, value: 120 }, { time: 1, value: 40 }] } } },
                { type: 'rotationStatic', config: { min: 0, max: 360 } },
                { type: 'spawnShape', config: { type: 'rect', data: { x: -18, y: -10, w: 18, h: 20 } } },
              ],
              textures: [dustTex],
            });

            return null;
          })
          .catch(() => null)
          .then(() => {
            let last = performance.now();
            app.ticker.add(() => {
              const currentProgress = progressRef.current;
              const w = app.screen.width;
              const h = app.screen.height;
              const x = -120 + currentProgress * (w + 240);
              const y = h * 0.62 + Math.sin(currentProgress * Math.PI * 10) * 2;

              machine.x = x;
              machine.y = y;
              far.tilePosition.x = -currentProgress * 90;
              near.tilePosition.x = -currentProgress * 160;

              const harvestedWidth = Math.max(0, Math.min(w, x + 40));
              harvested.width = Math.max(1, harvestedWidth);

              plants.forEach((sprite) => {
                sprite.visible = sprite.baseX > harvestedWidth;
              });

              if (emitter) {
                emitter.updateOwnerPos(x - 30, y + 30);
                const now = performance.now();
                const dt = (now - last) / 1000;
                last = now;
                emitter.update(dt);
              }
            });

            return null;
          });
      })
      .catch(() => null);

    return () => {
      disposed = true;
      if (emitter) emitter.destroy();
      if (app) {
        const view = app.view;
        app.destroy(true, { children: true, texture: true, baseTexture: true });
        if (view && pixiHost.contains(view)) pixiHost.removeChild(view);
      }
    };
  }, []);

  if (finished) return null;

  return (
    <div style={styles.splashRoot} aria-hidden="true">
      <div style={{ ...styles.revealLayer, clipPath: `inset(0 ${(1 - progress) * 100}% 0 0)` }} />

      <div style={styles.canvasLayer}>
        <div ref={pixiHostRef} style={{ position: 'absolute', inset: 0 }} />

        <div style={styles.brand}>
          <div style={styles.brandTitle}>Safra Vision</div>
          <div style={styles.brandSub}>Carregando…</div>
        </div>
      </div>
    </div>
  );
}
