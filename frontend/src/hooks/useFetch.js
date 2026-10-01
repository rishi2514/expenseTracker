import { useCallback, useEffect, useRef, useState } from "react";
import { getErrorMessage } from "../utils/error";

/**
 * Small generic data-fetching hook.
 *
 * @param {Function} fetcher async function returning the API body ({ data, meta, ... })
 * @param {*} params value the fetch depends on (memoise objects/arrays in the caller)
 * @param {boolean} enabled when false the fetch is skipped (defaults to true)
 *
 * Keeps only the latest response (stale responses are discarded) and exposes
 * `refetch` for after-mutation refreshes.
 */
export default function useFetch(fetcher, params = null, enabled = true) {
  const [state, setState] = useState({
    data: null,
    meta: null,
    loading: enabled,
    error: null,
  });

  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;
  const sequenceRef = useRef(0);

  const refetch = useCallback(async () => {
    const requestId = sequenceRef.current + 1;
    sequenceRef.current = requestId;
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetcherRef.current();
      if (sequenceRef.current !== requestId) return undefined;
      setState({
        data: response?.data ?? null,
        meta: response?.meta ?? null,
        loading: false,
        error: null,
      });
      return response;
    } catch (error) {
      if (sequenceRef.current !== requestId) return undefined;
      setState((prev) => ({
        ...prev,
        loading: false,
        error: getErrorMessage(error),
      }));
      return undefined;
    }
  }, []);

  useEffect(() => {
    if (!enabled) {
      setState((prev) => ({ ...prev, loading: false }));
      return undefined;
    }
    refetch();
    // Invalidate any in-flight request when deps change / on unmount.
    return () => {
      sequenceRef.current += 1;
    };
  }, [enabled, params, refetch]);

  return { ...state, refetch };
}
