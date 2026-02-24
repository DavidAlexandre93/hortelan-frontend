import { useMemo } from 'react';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from '../../lib/motionReact';

const ORBITERS = ['🛰️', '📡', '🤖', '🧠', '🌿', '💧'];

export default function HortelanPlayfulEffects() {
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();

  const progressScale = useSpring(scrollYProgress, {
    stiffness: 160,
    damping: 28,
    mass: 0.3,
  });

  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [0.12, 0.26]);
  const heartbeatScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  const heartPoints = useMemo(
    () => [
      { position: { top: 96, left: 20 }, label: 'Saúde da horta: estável', delay: 0 },
      { position: { top: 126, right: 24 }, label: 'Saúde da horta: vigorosa', delay: 0.2 },
      { position: { bottom: 26, left: 18 }, label: 'Saúde da horta: hidratada', delay: 0.4 },
    ],
    []
  );

  if (shouldReduceMotion) {
    return null;
  }

  return (
    <>
      <div className="hortelan-scroll-progress-track" aria-hidden="true">
        <motion.div className="hortelan-scroll-progress-bar" style={{ scaleX: progressScale }} />
      </div>

      <motion.div className="hortelan-atmosphere-layer" style={{ opacity: overlayOpacity }} aria-hidden="true">
        {ORBITERS.map((symbol, index) => (
          <motion.span
            key={symbol}
            className="hortelan-orbiter"
            style={{
              left: '50%',
              top: '18%',
              fontSize: `${1.05 + index * 0.09}rem`,
            }}
            animate={{ rotate: 360 }}
            transition={{
              repeat: Infinity,
              ease: 'linear',
              duration: 10 + index * 2,
              delay: index * 0.12,
            }}
          >
            <span style={{ display: 'inline-block', transform: `translateX(${78 + index * 18}px)` }}>{symbol}</span>
          </motion.span>
        ))}
      </motion.div>

      <div className="hortelan-heartbeat-layer" aria-hidden="true">
        {heartPoints.map((point) => (
          <motion.span
            key={point.label}
            className="hortelan-heartbeat-point"
            role="img"
            aria-label={point.label}
            style={{ ...point.position, scale: heartbeatScale }}
            animate={{ scale: [0.95, 1.18, 1] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut', delay: point.delay }}
          >
            ❤️
          </motion.span>
        ))}
      </div>

      <style>
        {`
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
            width: 100%;
            transform-origin: 0% 50%;
            background: linear-gradient(90deg, #7bc96f, #17b978, #12b0c9, #6f8cff);
            box-shadow: 0 0 14px rgba(23, 185, 120, 0.75);
          }

          .hortelan-atmosphere-layer {
            position: fixed;
            inset: 0;
            z-index: 1496;
            pointer-events: none;
            overflow: hidden;
            background: radial-gradient(circle at 10% 20%, rgba(111, 140, 255, 0.2), transparent 42%),
              radial-gradient(circle at 80% 30%, rgba(23, 185, 120, 0.2), transparent 40%),
              radial-gradient(circle at 35% 75%, rgba(18, 176, 201, 0.18), transparent 46%);
          }

          .hortelan-orbiter {
            position: absolute;
            filter: drop-shadow(0 2px 8px rgba(18, 176, 201, 0.4));
            opacity: 0.85;
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
            opacity: 0.95;
          }

          @media (prefers-reduced-motion: reduce) {
            .hortelan-scroll-progress-track,
            .hortelan-atmosphere-layer,
            .hortelan-heartbeat-layer {
              display: none;
            }
          }
        `}
      </style>
    </>
  );
}
