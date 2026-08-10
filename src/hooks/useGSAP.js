import { useLayoutEffect } from 'react';

function toDurationMs(seconds) {
  if (typeof seconds !== 'number') return 700;
  return seconds * 1000;
}

const EASING_ALIASES = {
  none: 'linear',
  'sine.in': 'cubic-bezier(0.47, 0, 0.745, 0.715)',
  'sine.out': 'cubic-bezier(0.39, 0.575, 0.565, 1)',
  'sine.inOut': 'cubic-bezier(0.445, 0.05, 0.55, 0.95)',
  'power1.out': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  'power2.out': 'cubic-bezier(0.215, 0.61, 0.355, 1)',
  'power3.out': 'cubic-bezier(0.165, 0.84, 0.44, 1)',
  'power4.out': 'cubic-bezier(0.23, 1, 0.32, 1)',
};

export function normalizeAnimationEasing(easing) {
  if (!easing) return 'ease-out';
  if (EASING_ALIASES[easing]) return EASING_ALIASES[easing];
  if (/^(linear|ease|ease-in|ease-out|ease-in-out|cubic-bezier\(.+\)|steps\(.+\))$/.test(easing)) return easing;
  return 'ease-out';
}

function buildKeyframes(fromVars = {}, toVars = {}) {
  const from = {};
  const to = {};

  const applyFrame = (target, vars) => {
    Object.entries(vars).forEach(([key, value]) => {
      if (['duration', 'repeat', 'yoyo', 'ease', 'stagger', 'delay'].includes(key)) return;
      if (key === 'x') {
        target.transform =
          `${target.transform || ''} translateX(${typeof value === 'number' ? `${value}px` : value})`.trim();
      } else if (key === 'y') {
        target.transform =
          `${target.transform || ''} translateY(${typeof value === 'number' ? `${value}px` : value})`.trim();
      } else if (key === 'scale') {
        target.transform = `${target.transform || ''} scale(${value})`.trim();
      } else {
        target[key] = value;
      }
    });
  };

  applyFrame(from, fromVars);
  applyFrame(to, toVars);
  return [from, to];
}

export default function useGSAP(callback, options = {}) {
  const { dependencies = [], scope } = options;

  useLayoutEffect(() => {
    const animations = [];

    const animateElement = (element, fromVars, toVars, withFrom) => {
      if (!element || typeof element.animate !== 'function') return;
      const [fromFrame, toFrame] = withFrom ? buildKeyframes(fromVars, toVars) : buildKeyframes({}, fromVars);
      const vars = withFrom ? toVars : fromVars;
      const animation = element.animate([fromFrame, toFrame], {
        duration: toDurationMs(vars.duration),
        iterations: vars.repeat === -1 ? Infinity : 1,
        direction: vars.yoyo ? 'alternate' : 'normal',
        easing: normalizeAnimationEasing(vars.ease),
        fill: 'forwards',
        delay: typeof vars.delay === 'number' ? vars.delay * 1000 : 0,
      });
      animations.push(animation);
    };

    const miniGsap = {
      to(targets, vars) {
        const list = Array.isArray(targets) ? targets : [targets];
        list.forEach((item, index) => {
          animateElement(item, { ...vars, delay: (vars.stagger || 0) * index + (vars.delay || 0) }, null, false);
        });
      },
      fromTo(targets, fromVars, toVars) {
        const list = Array.isArray(targets) ? targets : [targets];
        list.forEach((item, index) => {
          animateElement(
            item,
            fromVars,
            { ...toVars, delay: (toVars.stagger || 0) * index + (toVars.delay || 0) },
            true
          );
        });
      },
    };

    const ctx = {
      gsap: miniGsap,
      selector: (selector) => {
        if (!scope?.current) return [];
        return Array.from(scope.current.querySelectorAll(selector));
      },
      root: scope?.current || null,
    };

    const cleanup = callback(ctx);

    return () => {
      animations.forEach((animation) => animation.cancel());
      if (typeof cleanup === 'function') cleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
}
