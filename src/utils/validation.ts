/**
 * Shared validation utilities
 */

export interface PayRateValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validates a pay rate value
 * @param payRate - The pay rate value to validate (as string or number)
 * @returns Validation result with isValid flag and optional error message
 */
export function validatePayRate(payRate: string | number): PayRateValidationResult {
  const payRateValue = typeof payRate === 'string' ? parseFloat(payRate) : payRate;
  
  if (isNaN(payRateValue) || payRateValue < 0 || payRateValue > 10000) {
    return {
      isValid: false,
      error: 'Pay rate must be between 0 and 10,000'
    };
  }
  
  return { isValid: true };
}

/**
 * Validates a platform rate value
 * @param rate - The rate value to validate (as string or number)
 * @returns Validation result with isValid flag and optional error message
 */
export function validatePlatformRate(rate: string | number): PayRateValidationResult {
  const rateValue = typeof rate === 'string' ? parseFloat(rate) : rate;
  
  if (isNaN(rateValue) || rateValue < 0 || rateValue > 10000) {
    return {
      isValid: false,
      error: 'Rate must be between 0 and 10,000'
    };
  }
  
  return { isValid: true };
}
