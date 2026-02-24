import { useLayoutEffect } from 'react';

export default function useGSAP(callback, options = {}) {
  const { dependencies = [], scope } = options;

  useLayoutEffect(() => {
    const ctx = {
      selector: (selector) => {
        if (!scope?.current) return [];
        return Array.from(scope.current.querySelectorAll(selector));
      },
      root: scope?.current || null,
    };

    const cleanup = callback(ctx);
    return () => {
      if (typeof cleanup === 'function') cleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
}
