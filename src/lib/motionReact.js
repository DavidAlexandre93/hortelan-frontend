import { forwardRef, useEffect, useMemo, useRef, useState } from 'react';

function toMs(duration) {
  if (typeof duration !== 'number') return '0.45s';
  return `${duration}s`;
}

function composeTransform(baseTransform, values = {}) {
  const transforms = [baseTransform].filter(Boolean);
  if (values.x !== undefined) transforms.push(`translateX(${typeof values.x === 'number' ? `${values.x}px` : values.x})`);
  if (values.y !== undefined) transforms.push(`translateY(${typeof values.y === 'number' ? `${values.y}px` : values.y})`);
  if (values.scale !== undefined) transforms.push(`scale(${values.scale})`);
  if (values.scaleX !== undefined) transforms.push(`scaleX(${values.scaleX})`);
  if (values.scaleY !== undefined) transforms.push(`scaleY(${values.scaleY})`);
  if (values.rotate !== undefined) transforms.push(`rotate(${typeof values.rotate === 'number' ? `${values.rotate}deg` : values.rotate})`);
  if (values.rotateX !== undefined) transforms.push(`rotateX(${typeof values.rotateX === 'number' ? `${values.rotateX}deg` : values.rotateX})`);
  if (values.rotateY !== undefined) transforms.push(`rotateY(${typeof values.rotateY === 'number' ? `${values.rotateY}deg` : values.rotateY})`);
  return transforms.join(' ').trim() || undefined;
}

function mapMotionStyle(target = {}, baseStyle = {}) {
  const style = { ...target };
  const transform = composeTransform(baseStyle.transform, target);
  if (transform) style.transform = transform;
  delete style.x;
  delete style.y;
  delete style.scale;
  delete style.scaleX;
  delete style.scaleY;
  delete style.rotate;
  delete style.rotateX;
  delete style.rotateY;
  return style;
}

function createMotionComponent(Component) {
  const MotionComponent = forwardRef(
    ({ initial, animate, transition, whileHover, whileInView, viewport, style, onMouseEnter, onMouseLeave, ...props }, ref) => {
      const [mounted, setMounted] = useState(false);
      const [hovered, setHovered] = useState(false);
      const [isInView, setIsInView] = useState(false);
      const localRef = useRef(null);

      useEffect(() => {
        setMounted(true);
      }, []);

      useEffect(() => {
        if (!whileInView || !localRef.current) return undefined;

        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              setIsInView(true);
              if (viewport?.once) observer.disconnect();
            } else if (!viewport?.once) {
              setIsInView(false);
            }
          },
          { threshold: viewport?.amount || 0.15 }
        );

        observer.observe(localRef.current);
        return () => observer.disconnect();
      }, [localRef, viewport?.amount, viewport?.once, whileInView]);

      const stateStyle = useMemo(() => {
        let active = {};
        if (mounted && animate) active = { ...active, ...animate };
        if (mounted && whileInView && isInView) active = { ...active, ...whileInView };
        if (hovered && whileHover) active = { ...active, ...whileHover };

        const base = mounted ? active : initial || {};
        return mapMotionStyle(base, style || {});
      }, [animate, hovered, initial, isInView, mounted, style, whileHover, whileInView]);

      return (
        <Component
          ref={(node) => {
            localRef.current = node;
            if (typeof ref === 'function') ref(node);
            else if (ref) ref.current = node;
          }}
          {...props}
          onMouseEnter={(event) => {
            setHovered(true);
            if (onMouseEnter) onMouseEnter(event);
          }}
          onMouseLeave={(event) => {
            setHovered(false);
            if (onMouseLeave) onMouseLeave(event);
          }}
          style={{
            ...style,
            ...stateStyle,
            transition: `all ${toMs(transition?.duration)} ${transition?.ease || 'ease-out'}`,
          }}
        />
      );
    }
  );

  MotionComponent.displayName = `Motion(${typeof Component === 'string' ? Component : Component.displayName || Component.name || 'Component'})`;
  return MotionComponent;
}

export const motion = new Proxy(createMotionComponent, {
  get: (_, tag) => createMotionComponent(tag),
});

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
