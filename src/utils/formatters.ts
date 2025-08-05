// export const formatCurrency = (amount: number): string => {
//   return new Intl.NumberFormat('fr-CM', {
//     style: 'currency',
//     currency: 'XAF',
//     minimumFractionDigits: 0,
//     maximumFractionDigits: 0,
//     currencyDisplay: 'symbol'
//   }).format(amount);
// };

// export const formatPercentage = (value: number): string => {
//   return `${(value * 100).toFixed(1)}%`;
// };

export const formatCurrency = (amount: number): string => {
  // Ensure amount is a valid number
  if (typeof amount !== 'number' || isNaN(amount)) {
    return 'FCFA 0';
  }

  try {
    // Primary formatter with Cameroon locale
    return new Intl.NumberFormat('fr-CM', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      currencyDisplay: 'symbol'
    }).format(amount);
  } catch (error) {
    // Fallback for browsers that don't support fr-CM locale
    try {
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'XAF',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
        currencyDisplay: 'symbol'
      }).format(amount);
    } catch (fallbackError) {
      // Final fallback with manual formatting
      const formattedNumber = new Intl.NumberFormat('fr-FR', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount);
      return `FCFA ${formattedNumber}`;
    }
  }
};

export const formatPercentage = (value: number): string => {
  // Ensure value is a valid number
  if (typeof value !== 'number' || isNaN(value)) {
    return '0.0%';
  }
  
  return `${(value * 100).toFixed(1)}%`;
};

// Additional utility function for compact currency display (e.g., 1.2M FCFA)
export const formatCurrencyCompact = (amount: number): string => {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return 'FCFA 0';
  }

  const absAmount = Math.abs(amount);
  
  if (absAmount >= 1000000000) {
    return `FCFA ${(amount / 1000000000).toFixed(1)}B`;
  } else if (absAmount >= 1000000) {
    return `FCFA ${(amount / 1000000).toFixed(1)}M`;
  } else if (absAmount >= 1000) {
    return `FCFA ${(amount / 1000).toFixed(1)}K`;
  } else {
    return formatCurrency(amount);
  }
};