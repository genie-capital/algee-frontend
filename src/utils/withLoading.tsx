import React, { useState } from 'react';
import LoadingSpinner from '../components/common/LoadingSpinner';

type WithLoadingProps = Record<string, never>

function withLoading<P extends WithLoadingProps>(
  WrappedComponent: React.ComponentType<P>
) {
  // Try to create a nice displayName for React Dev Tools
  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';

  const ComponentWithLoading = (props: P) => {
    const [loading, setLoading] = useState<boolean>(false);

    const startLoading = () => {
      setLoading(true);
    };

    const stopLoading = () => {
      setLoading(false);
    };

    const withLoading = async <T,>(promise: Promise<T>): Promise<T> => {
      try {
        startLoading();
        return await promise;
      } finally {
        stopLoading();
      }
    };

    return (
      <>
        {loading && <LoadingSpinner />}
        <WrappedComponent
          {...props}
          loading={loading}
          startLoading={startLoading}
          stopLoading={stopLoading}
          withLoading={withLoading}
        />
      </>
    );
  };

  ComponentWithLoading.displayName = `WithLoading(${displayName})`;

  return ComponentWithLoading;
}

export default withLoading;