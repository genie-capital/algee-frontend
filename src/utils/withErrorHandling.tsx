import React, { useState } from 'react';
import ErrorAlert from '../components/common/ErrorAlert';

type WithErrorHandlingProps = Record<string, never>
  // Any props that come into the component

function withErrorHandling<P extends WithErrorHandlingProps>(
  WrappedComponent: React.ComponentType<P>
) {
  // Try to create a nice displayName for React Dev Tools
  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';

  const ComponentWithErrorHandling = (props: P) => {
    const [error, setError] = useState<string | null>(null);

    const handleError = (err: any) => {
      const errorMessage = err.response?.data?.message || err.message || 'An unexpected error occurred';
      setError(errorMessage);
      console.error(`Error in ${displayName}:`, err);
    };

    const clearError = () => {
      setError(null);
    };

    return (
      <>
        {error && <ErrorAlert message={error} onDismiss={clearError} />}
        <WrappedComponent
          {...props}
          handleError={handleError}
          clearError={clearError}
        />
      </>
    );
  };

  ComponentWithErrorHandling.displayName = `WithErrorHandling(${displayName})`;

  return ComponentWithErrorHandling;
}

export default withErrorHandling;