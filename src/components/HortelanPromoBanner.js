import { useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import { motion } from '../lib/motionReact';
import useGSAP from '../hooks/useGSAP';

export default function HortelanPromoBanner({ sx, className }) {
  const scopeRef = useRef(null);
  const [pointer, setPointer] = useState({ x: 0, y: 0, glowX: 50, glowY: 50 });

  useGSAP(
    ({ selector }) => {
      const banner = selector('.promo-banner-media')[0];
      const rays = selector('.promo-banner-ray');
      if (!banner) return undefined;

      const animations = [];
      animations.push(
        banner.animate(
          [
            { transform: 'scale(1) translateY(0px)', filter: 'saturate(1)' },
            { transform: 'scale(1.012) translateY(-4px)', filter: 'saturate(1.08)' },
            { transform: 'scale(1) translateY(0px)', filter: 'saturate(1)' },
          ],
          { duration: 4200, easing: 'ease-in-out', iterations: Infinity }
        )
      );

      rays.forEach((ray, index) => {
        animations.push(
          ray.animate(
            [
              { opacity: 0.15, transform: 'translateY(0px)' },
              { opacity: 0.5, transform: 'translateY(-8px)' },
              { opacity: 0.15, transform: 'translateY(0px)' },
            ],
            { duration: 2300 + index * 280, easing: 'ease-in-out', iterations: Infinity }
          )
        );
      });

      return () => animations.forEach((animation) => animation.cancel());
    },
    { scope: scopeRef }
  );

  const handlePointerMove = (event) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const xRatio = (event.clientX - bounds.left) / bounds.width;
    const yRatio = (event.clientY - bounds.top) / bounds.height;
    setPointer({
      x: (xRatio - 0.5) * 12,
      y: (yRatio - 0.5) * 10,
      glowX: xRatio * 100,
      glowY: yRatio * 100,
    });
  };

  const interactiveStyle = useMemo(
    () => ({
      '--pointer-x': `${pointer.x.toFixed(2)}deg`,
      '--pointer-y': `${pointer.y.toFixed(2)}deg`,
      '--glow-x': `${pointer.glowX.toFixed(2)}%`,
      '--glow-y': `${pointer.glowY.toFixed(2)}%`,
    }),
    [pointer]
  );

  return (
    <Box
      ref={scopeRef}
      component={motion.div}
      className={`promo-banner-shell ${className || ''}`.trim()}
      onPointerMove={handlePointerMove}
      onPointerLeave={() => setPointer({ x: 0, y: 0, glowX: 50, glowY: 50 })}
      style={interactiveStyle}
      sx={{
        position: 'relative',
        borderRadius: 2,
        overflow: 'hidden',
        transform: 'perspective(1100px) rotateX(calc(var(--pointer-y) * -1)) rotateY(var(--pointer-x))',
        transition: 'transform 180ms ease-out, box-shadow 180ms ease-out',
        boxShadow: (theme) => theme.shadows[10],
        '&:hover': {
          boxShadow: (theme) => theme.shadows[16],
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: '-40% -15%',
          zIndex: 2,
          pointerEvents: 'none',
          background:
            'radial-gradient(circle at var(--glow-x) var(--glow-y), rgba(255,255,255,0.42), rgba(255,255,255,0) 42%)',
          mixBlendMode: 'screen',
        },
        ...sx,
      }}
    >
      <Box
        component="img"
        className="promo-banner-media"
        src="/static/logos.png"
        alt="Banner Hortelan Agtech Ltda - Tecnologia Sustentável para Hortas Inteligentes"
        sx={{ width: '100%', display: 'block', borderRadius: 2 }}
      />
      <Box
        className="promo-banner-rays"
        sx={{
          position: 'absolute',
          inset: 'auto 0 0 0',
          height: 44,
          pointerEvents: 'none',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
          px: 2,
          gap: 1,
        }}
      >
        {[0, 1, 2].map((ray) => (
          <Box
            key={ray}
            className="promo-banner-ray"
            sx={{
              borderRadius: 999,
              background: 'linear-gradient(90deg, rgba(116, 227, 161, 0), rgba(116, 227, 161, 0.85), rgba(116, 227, 161, 0))',
            }}
          />
        ))}
      </Box>
    </Box>
  );
}

HortelanPromoBanner.propTypes = {
  className: PropTypes.string,
  sx: PropTypes.object,
};

HortelanPromoBanner.defaultProps = {
  className: undefined,
  sx: {},
};
