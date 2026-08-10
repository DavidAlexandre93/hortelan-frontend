import { useCallback, useEffect, useState } from 'react';
import { operationalApi } from '../../services/operationalApi';

const liveDataEnabled = import.meta.env.VITE_ENABLE_LIVE_DATA === 'true';

export default function useOperationalMonitoring() {
  const [state, setState] = useState(() => ({
    status: liveDataEnabled ? 'loading' : 'demo',
    snapshot: null,
    error: null,
  }));

  const load = useCallback(async (signal) => {
    if (!liveDataEnabled) return;
    try {
      const snapshot = await operationalApi.getMonitoring({ signal });
      setState({ status: 'success', snapshot, error: null });
    } catch (error) {
      if (error?.kind === 'cancellation') return;
      setState({ status: 'error', snapshot: null, error });
    }
  }, []);

  const retry = useCallback(() => {
    setState((current) => ({ ...current, status: 'loading', error: null }));
    void load();
  }, [load]);

  useEffect(() => {
    const controller = new AbortController();
    const timer = window.setTimeout(() => void load(controller.signal), 0);
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [load]);

  return { ...state, retry, liveDataEnabled };
}
