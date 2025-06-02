import { useState, useCallback } from 'react';

type LoadingHandlerReturn = {
  loading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
  withLoading: <T>(promise: Promise<T>) => Promise<T>;
};

export const useLoading = (initialState = false): LoadingHandlerReturn => {
  const [loading, setLoading] = useState(initialState);

  const startLoading = useCallback(() => {
    setLoading(true);
  }, []);

  const stopLoading = useCallback(() => {
    setLoading(false);
  }, []);

  const withLoading = useCallback(async <T,>(promise: Promise<T>): Promise<T> => {
    try {
      startLoading();
      return await promise;
    } finally {
      stopLoading();
    }
  }, [startLoading, stopLoading]);

  return { loading, startLoading, stopLoading, withLoading };
};