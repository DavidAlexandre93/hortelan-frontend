import { forwardRef, useEffect, useMemo, useState } from 'react';

function createMotionTag(tag) {
  const MotionTag = forwardRef(({ animate, transition, ...props }, ref) => {
    void animate;
    void transition;
    return tag === 'span' ? <span ref={ref} {...props} /> : <div ref={ref} {...props} />;
  });
  MotionTag.displayName = `Motion${tag.toUpperCase()}`;
  return MotionTag;
}

export const motion = {
  div: createMotionTag('div'),
  span: createMotionTag('span'),
};

export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = () => setReduced(mediaQuery.matches);
    handleChange();
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return reduced;
}

export function useScroll() {
  const [scrollYProgress, setScrollYProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const pageHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = pageHeight > 0 ? window.scrollY / pageHeight : 0;
      setScrollYProgress(Math.min(Math.max(progress, 0), 1));
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return { scrollYProgress };
}

export function useSpring(value) {
  return value;
}

function interpolate(value, inputRange, outputRange) {
  for (let index = 0; index < inputRange.length - 1; index += 1) {
    const startInput = inputRange[index];
    const endInput = inputRange[index + 1];

    if (value >= startInput && value <= endInput) {
      const progress = (value - startInput) / (endInput - startInput || 1);
      const startOutput = outputRange[index];
      const endOutput = outputRange[index + 1];
      return startOutput + progress * (endOutput - startOutput);
    }
  }

  return value <= inputRange[0] ? outputRange[0] : outputRange[outputRange.length - 1];
}

export function useTransform(value, inputRange, outputRange) {
  return useMemo(() => interpolate(value, inputRange, outputRange), [value, inputRange, outputRange]);
}
