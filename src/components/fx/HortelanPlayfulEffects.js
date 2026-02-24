import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from '../../lib/motionReact';
import useGSAP from '../../hooks/useGSAP';

const TOTAL_PLANTS = 8;
const TOTAL_RAINDROPS = 42;
const TOTAL_STARS = 30;
const TOTAL_FIREFLIES = 14;

function getTimeMode() {
  const hour = new Date().getHours();
  return hour >= 6 && hour < 18 ? 'day' : 'night';
}

export default function HortelanPlayfulEffects() {
  const shouldReduceMotion = useReducedMotion();
  const scope = useRef(null);
  const [timeMode] = useState(getTimeMode);
  const [interactionEnergy, setInteractionEnergy] = useState(0);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const isDay = timeMode === 'day';
  const { scrollYProgress } = useScroll();

  const smoothEnergy = useSpring(interactionEnergy, { stiffness: 130, damping: 26, mass: 0.45 });
  const scrollScale = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 });

  const skyBlend = useTransform(scrollYProgress, [0, 1], isDay ? [0.12, 0.45] : [0.2, 0.56]);
  const rainOpacity = useTransform(smoothEnergy, [0, 1], isDay ? [0.04, 0.95] : [0.06, 0.2]);
  const plantGrowth = useTransform(smoothEnergy, [0, 1], isDay ? [0.52, 1.12] : [0.92, 1.08]);

  useEffect(() => {
    if (shouldReduceMotion) return undefined;

    const increaseEnergy = (boost = 0.08) => {
      setInteractionEnergy((value) => Math.min(1, value + boost));
    };

    const onPointerMove = (event) => {
      increaseEnergy(0.018);
      const x = (event.clientX / window.innerWidth - 0.5) * 2;
      const y = (event.clientY / window.innerHeight - 0.5) * 2;
      setPointer({ x, y });
    };
    const onPointerDown = () => increaseEnergy(0.2);
    const onWheel = () => increaseEnergy(0.12);
    const onKeyDown = () => increaseEnergy(0.1);

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('keydown', onKeyDown);

    const decay = window.setInterval(() => {
      setInteractionEnergy((value) => Math.max(0, value - 0.032));
    }, 320);

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', onKeyDown);
      window.clearInterval(decay);
    };
  }, [shouldReduceMotion]);

  useGSAP(
    ({ selector }) => {
      if (shouldReduceMotion) return undefined;

      const animations = [];
      const randomBetween = (min, max) => min + Math.random() * (max - min);
      const animate = (element, keyframes, options) => {
        if (!element) return;
        animations.push(element.animate(keyframes, options));
      };

      selector('.fx-sun-core').forEach((element) => {
        animate(
          element,
          [{ transform: 'scale(1)' }, { transform: 'scale(1.08)' }, { transform: 'scale(1)' }],
          { duration: 2600, easing: 'ease-in-out', iterations: Infinity }
        );
      });

      selector('.fx-cloud').forEach((element, index) => {
        animate(
          element,
          [{ transform: 'translateX(0px)' }, { transform: 'translateX(36px)' }, { transform: 'translateX(0px)' }],
          { duration: 7200 + index * 700, easing: 'ease-in-out', iterations: Infinity }
        );
      });

      selector('.fx-moon').forEach((element) => {
        animate(
          element,
          [
            { boxShadow: '0 0 30px rgba(196, 215, 255, 0.58)' },
            { boxShadow: '0 0 48px rgba(229, 238, 255, 0.82)' },
            { boxShadow: '0 0 30px rgba(196, 215, 255, 0.58)' },
          ],
          { duration: 2800, easing: 'ease-in-out', iterations: Infinity }
        );
      });

      selector('.fx-star').forEach((element) => {
        animate(
          element,
          [
            { opacity: randomBetween(0.2, 0.72), transform: 'scale(0.8)' },
            { opacity: 1, transform: 'scale(1.24)' },
            { opacity: randomBetween(0.35, 0.75), transform: 'scale(0.86)' },
          ],
          { duration: randomBetween(1300, 2400), easing: 'ease-in-out', iterations: Infinity }
        );
      });

      selector('.fx-firefly').forEach((element) => {
        animate(
          element,
          [
            { transform: 'translate3d(0px, 0px, 0px)', opacity: 0.15 },
            {
              transform: `translate3d(${randomBetween(-18, 24)}px, ${randomBetween(-26, 20)}px, 0px)`,
              opacity: 0.92,
            },
            { transform: 'translate3d(0px, 0px, 0px)', opacity: 0.16 },
          ],
          { duration: randomBetween(2600, 4600), easing: 'ease-in-out', iterations: Infinity }
        );
      });

      selector('.fx-rain-drop').forEach((element, index) => {
        animate(
          element,
          [
            { transform: 'translateY(-48%) rotate(16deg)', opacity: isDay ? 0.1 : 0.08 },
            { transform: 'translateY(180%) rotate(16deg)', opacity: isDay ? 0.95 : 0.42 },
          ],
          { duration: isDay ? 840 : 1320, easing: 'linear', iterations: Infinity, delay: index * 24 }
        );
      });

      selector('.fx-plant').forEach((element) => {
        animate(
          element,
          [{ transform: 'rotate(-3deg)' }, { transform: 'rotate(3deg)' }, { transform: 'rotate(-2deg)' }],
          { duration: randomBetween(2200, 3400), easing: 'ease-in-out', iterations: Infinity }
        );
      });

      return () => animations.forEach((animation) => animation.cancel());
    },
    { dependencies: [isDay, shouldReduceMotion], scope }
  );

  const plants = useMemo(() => Array.from({ length: TOTAL_PLANTS }, (_, index) => ({ id: `plant-${index}`, height: 30 + index * 8 })), []);
  const raindrops = useMemo(() => Array.from({ length: TOTAL_RAINDROPS }, (_, index) => index), []);
  const stars = useMemo(() => Array.from({ length: TOTAL_STARS }, (_, index) => index), []);
  const fireflies = useMemo(() => Array.from({ length: TOTAL_FIREFLIES }, (_, index) => index), []);

  if (shouldReduceMotion) return null;

  return (
    <motion.div
      ref={scope}
      className={`hortelan-fx-scene ${timeMode}`}
      style={{ '--sky-overlay': skyBlend, '--pointer-x': pointer.x, '--pointer-y': pointer.y }}
      aria-hidden="true"
    >
      <div className="fx-progress-track">
        <motion.div className="fx-progress-value" style={{ scaleX: scrollScale }} />
      </div>

      <div className="fx-sky-body">
        {isDay ? (
          <>
            <div className="fx-sun-core" />
            <div className="fx-cloud fx-cloud-a" />
            <div className="fx-cloud fx-cloud-b" />
            <div className="fx-cloud fx-cloud-c" />
          </>
        ) : (
          <>
            <div className="fx-moon" />
            {stars.map((star) => (
              <span key={`star-${star}`} className="fx-star" style={{ left: `${4 + ((star * 31) % 94)}%`, top: `${5 + ((star * 23) % 52)}%` }} />
            ))}
            {fireflies.map((firefly) => (
              <span
                key={`firefly-${firefly}`}
                className="fx-firefly"
                style={{ left: `${3 + ((firefly * 37) % 92)}%`, top: `${54 + ((firefly * 13) % 28)}%` }}
              />
            ))}
          </>
        )}
      </div>

      <motion.div className="fx-rain-layer" style={{ opacity: rainOpacity }}>
        {raindrops.map((drop) => (
          <span key={`rain-${drop}`} className="fx-rain-drop" style={{ left: `${3 + ((drop * 17) % 96)}%` }} />
        ))}
      </motion.div>

      <div className="fx-soil" />

      <div className="fx-plants-row">
        {plants.map((plant, index) => (
          <motion.div
            key={plant.id}
            className="fx-plant"
            style={{ left: `${8 + index * 10.5}%`, height: `${plant.height}px`, scaleY: plantGrowth, opacity: isDay ? undefined : 0.95 }}
          >
            <span className="stem" />
            <span className="leaf leaf-left" />
            <span className="leaf leaf-right" />
          </motion.div>
        ))}
      </div>

      <style>
        {`
          .hortelan-fx-scene { position: fixed; inset: 0; pointer-events: none; z-index: 1200; overflow: hidden; }
          .fx-progress-track { position: fixed; top: 0; left: 0; height: 4px; width: 100%; background: rgba(255, 255, 255, 0.16); }
          .fx-progress-value { width: 100%; height: 100%; transform-origin: left center; background: linear-gradient(90deg, #76d275, #12b0c9, #6f8cff); }
          .fx-sky-body {
            position: absolute; inset: 0 0 17% 0;
            background: linear-gradient(180deg, ${isDay ? '#89ccff 0%, #e7f6ff 70%' : '#081636 0%, #1d2f63 70%'});
            transform: translate3d(calc(var(--pointer-x) * 8px), calc(var(--pointer-y) * 6px), 0);
            transition: transform 180ms ease-out;
          }
          .fx-sky-body::after { content: ''; position: absolute; inset: 0; background: radial-gradient(circle at 50% 0%, rgba(255,255,255,var(--sky-overlay)), transparent 52%); }
          .fx-sun-core, .fx-moon { position: absolute; border-radius: 50%; top: 8%; left: 12%; width: clamp(90px, 10vw, 140px); aspect-ratio: 1; }
          .fx-sun-core { background: radial-gradient(circle at 40% 38%, #fffef0, #ffd35f 72%); box-shadow: 0 0 70px rgba(255, 197, 79, 0.85); }
          .fx-moon { left: auto; right: 14%; background: radial-gradient(circle at 35% 35%, #ffffff, #d4dded 74%); }
          .fx-cloud { position: absolute; border-radius: 999px; background: rgba(255, 255, 255, 0.72); filter: blur(1px); }
          .fx-cloud-a { top: 16%; right: 20%; width: 150px; height: 50px; }
          .fx-cloud-b { top: 27%; right: 8%; width: 120px; height: 38px; opacity: 0.84; }
          .fx-cloud-c { top: 10%; right: 40%; width: 98px; height: 32px; opacity: 0.65; }
          .fx-star, .fx-firefly { position: absolute; border-radius: 50%; }
          .fx-star { width: 4px; height: 4px; background: #f9fdff; box-shadow: 0 0 8px rgba(244, 252, 255, 0.8); }
          .fx-firefly { width: 6px; height: 6px; background: #c6ff70; box-shadow: 0 0 16px rgba(198, 255, 112, 0.92); }
          .fx-rain-layer { position: absolute; inset: 14% 0 20% 0; }
          .fx-rain-drop { position: absolute; width: 2px; height: 64px; background: linear-gradient(to bottom, rgba(212,245,255,0), rgba(139,230,255,0.9)); transform: rotate(16deg); }
          .fx-soil { position: absolute; left: 0; right: 0; bottom: 0; height: 22%; background: linear-gradient(180deg, #61402b, #2b1a12); box-shadow: inset 0 8px 24px rgba(0, 0, 0, 0.45); }
          .fx-plants-row { position: absolute; inset: auto 0 8% 0; height: 26%; }
          .fx-plant { position: absolute; bottom: 0; width: 18px; transform-origin: center bottom; }
          .fx-plant .stem { position: absolute; bottom: 0; left: 50%; width: 4px; height: 100%; transform: translateX(-50%); border-radius: 999px; background: linear-gradient(180deg, #8fd469, #2f8c2d); }
          .fx-plant .leaf { position: absolute; width: 16px; height: 9px; background: linear-gradient(180deg, #98e27d, #4ea83f); border-radius: 100% 10% 100% 10%; top: 30%; }
          .fx-plant .leaf-left { right: 8px; transform: rotate(-28deg); }
          .fx-plant .leaf-right { left: 8px; transform: rotate(28deg) scaleX(-1); }
          .night .fx-soil { background: linear-gradient(180deg, #3c2b22, #150d12); }
          @media (prefers-reduced-motion: reduce) { .hortelan-fx-scene { display: none; } }
        `}
      </style>
    </motion.div>
  );
}
