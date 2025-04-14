
/**
 * Format a number as Indian Rupees (INR)
 */
export const formatINR = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Format a number based on the specified currency
 * Default is now INR instead of USD
 */
export const formatCurrency = (amount: number, currency: string = 'INR'): string => {
  if (currency === 'NA') return 'NA';
  
  // Always use INR regardless of the currency parameter
  return formatINR(amount);
};

/**
 * Format a date string to a readable format
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    // If not a valid date object, try to parse MM/DD/YYYY format
    const parts = dateString.split('/');
    if (parts.length === 3) {
      return `${parts[1]}/${parts[0]}/${parts[2]}`;
    }
    return dateString;
  }
  
  return date.toLocaleDateString('en-US', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};
