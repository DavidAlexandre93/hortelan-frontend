import { useLayoutEffect, useRef } from 'react';

export default function useScopedAnimation(callback, scope) {
  const callbackRef = useRef(callback);

  useLayoutEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useLayoutEffect(() => {
    const root = scope?.current;
    if (!root) return undefined;

    return callbackRef.current({
      root,
      selector: (selector) => Array.from(root.querySelectorAll(selector)),
    });
  }, [scope]);
}
