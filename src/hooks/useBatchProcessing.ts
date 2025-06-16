import { useState, useCallback } from 'react';
import { creditScoringService } from '../services/creditScoringService';
import { useAuth } from '../contexts/AuthContext';

interface BatchProcessingState {
  isProcessing: boolean;
  totalClients: number;
  processedClients: number;
  failedClients: number;
  isComplete: boolean;
  error: string | null;
  results: any[] | null;
}

export const useBatchProcessing = () => {
  const { user } = useAuth();
  const [state, setState] = useState<BatchProcessingState>({
    isProcessing: false,
    totalClients: 0,
    processedClients: 0,
    failedClients: 0,
    isComplete: false,
    error: null,
    results: null
  });

  const processBatch = useCallback(async (clientIds: number[], uploadBatchId?: number) => {
    setState(prev => ({
      ...prev,
      isProcessing: true,
      totalClients: clientIds.length,
      processedClients: 0,
      failedClients: 0,
      isComplete: false,
      error: null,
      results: null
    }));

    try {
      const response = await creditScoringService.calculateBatchResults(
        clientIds,
        uploadBatchId,
        user?.institutionId
      );

      if (response.success) {
        setState(prev => ({
          ...prev,
          isComplete: true,
          processedClients: response.data.successfulCalculations,
          failedClients: response.data.failedCalculations,
          results: response.data.results
        }));
      } else {
        setState(prev => ({
          ...prev,
          error: response.message || 'Failed to process batch'
        }));
      }
    } catch (err) {
      setState(prev => ({
        ...prev,
        error: 'An error occurred while processing the batch'
      }));
    }
  }, [user?.institutionId]);

  const reset = useCallback(() => {
    setState({
      isProcessing: false,
      totalClients: 0,
      processedClients: 0,
      failedClients: 0,
      isComplete: false,
      error: null,
      results: null
    });
  }, []);

  return {
    ...state,
    processBatch,
    reset
  };
}; 