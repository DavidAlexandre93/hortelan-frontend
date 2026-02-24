import { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import { motion } from '../lib/motionReact';

export default function GSAPTypingText({
  texts,
  speed = 45,
  eraseSpeed = 24,
  holdDuration = 1500,
  startDelay = 0,
  className,
  sx,
}) {
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const timeoutRef = useRef(null);
  const normalizedTexts = useMemo(() => (texts?.length ? texts : ['']), [texts]);

  useEffect(() => {
    let textIndex = 0;
    let charIndex = 0;
    let deleting = false;

    const loop = () => {
      const word = normalizedTexts[textIndex] || '';

      if (!deleting) {
        charIndex += 1;
        setDisplayedText(word.slice(0, charIndex));

        if (charIndex >= word.length) {
          deleting = true;
          setIsDeleting(false);
          timeoutRef.current = setTimeout(loop, holdDuration);
          return;
        }

        setIsDeleting(false);
        timeoutRef.current = setTimeout(loop, speed);
        return;
      }

      charIndex -= 1;
      setDisplayedText(word.slice(0, Math.max(charIndex, 0)));
      setIsDeleting(true);

      if (charIndex <= 0) {
        deleting = false;
        textIndex = (textIndex + 1) % normalizedTexts.length;
      }

      timeoutRef.current = setTimeout(loop, eraseSpeed);
    };

    timeoutRef.current = setTimeout(loop, startDelay);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [eraseSpeed, holdDuration, normalizedTexts, speed, startDelay]);

  return (
    <Box className={className} sx={{ display: 'inline-flex', alignItems: 'center', ...sx }}>
      <Box component="span" sx={{ whiteSpace: 'pre-wrap' }}>
        {displayedText}
      </Box>
      <Box
        component={motion.span}
        aria-hidden
        sx={{
          ml: 0.4,
          fontWeight: 700,
          color: isDeleting ? 'warning.main' : 'primary.main',
          animation: 'hortelan-caret-blink 0.8s step-end infinite',
          '@keyframes hortelan-caret-blink': {
            '0%, 45%': { opacity: 1 },
            '50%, 100%': { opacity: 0 },
          },
        }}
      >
        |
      </Box>
    </Box>
  );
}

GSAPTypingText.propTypes = {
  className: PropTypes.string,
  eraseSpeed: PropTypes.number,
  holdDuration: PropTypes.number,
  speed: PropTypes.number,
  startDelay: PropTypes.number,
  sx: PropTypes.object,
  texts: PropTypes.arrayOf(PropTypes.string).isRequired,
};
