import { useState, useCallback } from 'react';

type ErrorHandlerReturn = {
  error: string | null;
  setError: (message: string | null) => void;
  clearError: () => void;
  handleError: (err: any) => void;
};

export const useErrorHandler = (initialError: string | null = null): ErrorHandlerReturn => {
  const [error, setErrorState] = useState<string | null>(initialError);

  const setError = useCallback((message: string | null) => {
    setErrorState(message);
  }, []);

  const clearError = useCallback(() => {
    setErrorState(null);
  }, []);

  const handleError = useCallback((err: any) => {
    const errorMessage = err.response?.data?.message || err.message || 'An unexpected error occurred';
    setErrorState(errorMessage);
    console.error('Error:', err);
  }, []);

  return { error, setError, clearError, handleError };
};