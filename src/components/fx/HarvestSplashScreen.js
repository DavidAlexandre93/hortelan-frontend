import { useMemo, useRef, useState } from 'react';
import { motion, useReducedMotion } from '../../lib/motionReact';
import useGSAP from '../../hooks/useGSAP';

export default function HarvestSplashScreen() {
  const rootRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();
  const [hidden, setHidden] = useState(false);

  const cropLine = useMemo(
    () =>
      Array.from({ length: 42 }, (_, index) => ({
        id: `soy-${index}`,
        swayDelay: `${(index % 6) * 0.12}s`,
      })),
    []
  );

  useGSAP(
    ({ selector }) => {
      if (hidden) return undefined;

      const overlay = selector('.harvest-splash-overlay')[0];
      const label = selector('.harvest-splash-label')[0];
      const harvester = selector('.harvest-splash-harvester')[0];
      const harvestedTrack = selector('.harvest-splash-harvested-track')[0];
      const crops = selector('.harvest-splash-crop');

      const animations = [];
      const timeout = setTimeout(() => setHidden(true), shouldReduceMotion ? 1100 : 3600);

      const animate = (element, keyframes, options) => {
        if (!element) return;
        const animation = element.animate(keyframes, options);
        animations.push(animation);
      };

      animate(
        label,
        [
          { opacity: 0, transform: 'translate(-50%, 12px)' },
          { opacity: 1, transform: 'translate(-50%, 0px)' },
          { opacity: 0, transform: 'translate(-50%, -10px)' },
        ],
        { duration: shouldReduceMotion ? 820 : 2200, delay: 160, fill: 'forwards', easing: 'ease-in-out' }
      );

      animate(
        harvester,
        [
          { transform: 'translateX(-120vw)' },
          { transform: 'translateX(-8vw)' },
          { transform: 'translateX(112vw)' },
        ],
        {
          duration: shouldReduceMotion ? 900 : 2400,
          delay: 260,
          fill: 'forwards',
          easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
        }
      );

      animate(
        harvestedTrack,
        [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }],
        {
          duration: shouldReduceMotion ? 860 : 2250,
          delay: 310,
          fill: 'forwards',
          easing: 'linear',
        }
      );

      crops.forEach((crop, index) => {
        animate(
          crop,
          [
            { transform: 'translateY(0px) scale(1)', opacity: 0.95 },
            { transform: 'translateY(-10px) scale(0.72)', opacity: 0 },
          ],
          {
            duration: shouldReduceMotion ? 320 : 540,
            delay: (shouldReduceMotion ? 360 : 720) + index * (shouldReduceMotion ? 16 : 36),
            fill: 'forwards',
            easing: 'ease-in',
          }
        );
      });

      animate(
        overlay,
        [{ opacity: 1 }, { opacity: 1 }, { opacity: 0 }],
        { duration: shouldReduceMotion ? 1050 : 3450, fill: 'forwards', easing: 'ease-in' }
      );

      return () => {
        clearTimeout(timeout);
        animations.forEach((animation) => animation.cancel());
      };
    },
    { dependencies: [hidden, shouldReduceMotion], scope: rootRef }
  );

  if (hidden) return null;

  return (
    <motion.div ref={rootRef} className="harvest-splash-root" aria-hidden="true">
      <div className="harvest-splash-overlay">
        <div className="harvest-splash-label">Colhendo a plantação de soja para abrir o site...</div>

        <div className="harvest-splash-field">
          <div className="harvest-splash-soil" />
          <div className="harvest-splash-harvested-track" />
          <div className="harvest-splash-crops-line">
            {cropLine.map((soy) => (
              <span key={soy.id} className="harvest-splash-crop" style={{ animationDelay: soy.swayDelay }}>
                <span className="harvest-splash-crop-head" />
                <span className="harvest-splash-crop-stem" />
              </span>
            ))}
          </div>
        </div>

        <div className="harvest-splash-harvester">🚜</div>
      </div>

      <style>
        {`
          .harvest-splash-root {
            position: fixed;
            inset: 0;
            z-index: 2000;
            pointer-events: none;
          }

          .harvest-splash-overlay {
            position: absolute;
            inset: 0;
            overflow: hidden;
            background: linear-gradient(180deg, #b7ec8d 0%, #71bf59 38%, #4a8a3d 100%);
          }

          .harvest-splash-label {
            position: absolute;
            left: 50%;
            top: 16%;
            transform: translateX(-50%);
            border-radius: 999px;
            padding: 0.65rem 1rem;
            font-size: clamp(0.88rem, 1.45vw, 1.04rem);
            color: #f4fff6;
            background: rgba(25, 71, 35, 0.62);
            backdrop-filter: blur(6px);
            font-weight: 600;
            text-align: center;
            white-space: nowrap;
          }

          .harvest-splash-field {
            position: absolute;
            left: 0;
            right: 0;
            top: 50%;
            transform: translateY(-50%);
            padding: 0 clamp(0.8rem, 3vw, 2.2rem);
          }

          .harvest-splash-soil {
            position: absolute;
            inset: auto 0 0 0;
            height: clamp(42px, 7vw, 80px);
            border-radius: 12px;
            background: linear-gradient(180deg, #8b5a2b 0%, #5f3a19 100%);
          }

          .harvest-splash-harvested-track {
            position: absolute;
            left: 0;
            bottom: 0;
            height: clamp(42px, 7vw, 80px);
            width: 100%;
            border-radius: 12px;
            background: linear-gradient(180deg, rgba(70, 44, 22, 0.82), rgba(48, 29, 14, 0.92));
            transform-origin: left center;
            transform: scaleX(0);
          }

          .harvest-splash-crops-line {
            position: relative;
            z-index: 2;
            display: grid;
            grid-template-columns: repeat(42, minmax(0, 1fr));
            align-items: end;
            gap: 0.15rem;
          }

          .harvest-splash-crop {
            position: relative;
            display: inline-flex;
            flex-direction: column;
            align-items: center;
            justify-content: flex-end;
            height: clamp(56px, 9vw, 92px);
            opacity: 0.97;
            transform-origin: bottom center;
            animation: soySway 1.3s ease-in-out infinite alternate;
            filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.2));
          }

          .harvest-splash-crop-head {
            width: clamp(12px, 1.1vw, 17px);
            height: clamp(16px, 1.5vw, 24px);
            border-radius: 60% 60% 45% 45%;
            background: linear-gradient(180deg, #9be07f 0%, #59b548 100%);
            box-shadow: inset 0 -2px 2px rgba(15, 90, 31, 0.22);
          }

          .harvest-splash-crop-stem {
            width: clamp(4px, 0.35vw, 6px);
            height: clamp(34px, 5.4vw, 58px);
            margin-top: 1px;
            border-radius: 999px;
            background: linear-gradient(180deg, #4f9e3a 0%, #2f6d26 100%);
          }

          .harvest-splash-harvester {
            position: absolute;
            left: 0;
            top: calc(50% - clamp(20px, 3vw, 34px));
            font-size: clamp(2.1rem, 5.2vw, 4rem);
            z-index: 3;
            filter: drop-shadow(0 6px 10px rgba(0, 0, 0, 0.25));
          }

          @keyframes soySway {
            from { transform: rotate(-2deg) translateY(0px); }
            to { transform: rotate(2deg) translateY(-4px); }
          }

          @media (max-width: 899px) {
            .harvest-splash-label {
              top: 12%;
              white-space: normal;
              max-width: 90vw;
            }

            .harvest-splash-crops-line {
              grid-template-columns: repeat(21, minmax(0, 1fr));
              row-gap: 0.2rem;
            }
          }
        `}
      </style>
    </motion.div>
  );
}
