import { useCallback, useEffect, useRef } from 'react';

export default function useLatestRequest() {
  const activeRequest = useRef(null);
  const sequence = useRef(0);

  useEffect(() => () => activeRequest.current?.abort(), []);

  return useCallback(async (request) => {
    activeRequest.current?.abort();
    const controller = new AbortController();
    const requestId = sequence.current + 1;
    sequence.current = requestId;
    activeRequest.current = controller;

    try {
      const result = await request({ signal: controller.signal, requestId });
      return requestId === sequence.current && !controller.signal.aborted
        ? { current: true, data: result }
        : { current: false, data: undefined };
    } finally {
      if (requestId === sequence.current) activeRequest.current = null;
    }
  }, []);
}
