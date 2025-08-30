import { toast } from 'sonner';

import { ERROR_MESSAGE } from '@/constants/common.constant';

// Define interfaces for API error responses
interface ApiErrorResponse {
  message?: string;
  error?: {
    message?: string;
  };
}

/**
 * Enhanced error handler for API responses
 * Extracts error message from API response and shows toast notification
 */
export const handleApiError = (
  error: unknown,
  customMessage?: string
): void => {
  console.error('API Error:', error);

  let errorMessage = customMessage || ERROR_MESSAGE;

  // Check if error has response data structure
  if (
    error &&
    typeof error === 'object' &&
    'response' in error &&
    error.response &&
    typeof error.response === 'object' &&
    'data' in error.response &&
    error.response.data &&
    typeof error.response.data === 'object'
  ) {
    const responseData = error.response.data as ApiErrorResponse;

    // Try to get message from response data (direct message)
    if (responseData.message && typeof responseData.message === 'string') {
      errorMessage = responseData.message;
    }
    // Fallback to error object message if no direct message
    else if (
      responseData.error &&
      typeof responseData.error === 'object' &&
      responseData.error.message &&
      typeof responseData.error.message === 'string'
    ) {
      errorMessage = responseData.error.message;
    }
  }
  // Handle axios error structure
  else if (
    error &&
    typeof error === 'object' &&
    'message' in error &&
    typeof error.message === 'string'
  ) {
    errorMessage = error.message;
  }

  // Show error toast
  toast.error(errorMessage);
};

/**
 * Enhanced success handler for API responses
 * Shows success toast notification
 */
export const handleApiSuccess = (message: string): void => {
  toast.success(message);
};

/**
 * Extract error message from API response without showing toast
 * Useful for custom error handling
 */
export const extractErrorMessage = (error: unknown): string => {
  if (
    error &&
    typeof error === 'object' &&
    'response' in error &&
    error.response &&
    typeof error.response === 'object' &&
    'data' in error.response &&
    error.response.data &&
    typeof error.response.data === 'object'
  ) {
    const responseData = error.response.data as ApiErrorResponse;

    // Try to get message from response data (direct message)
    if (responseData.message && typeof responseData.message === 'string') {
      return responseData.message;
    }
    // Fallback to error object message if no direct message
    else if (
      responseData.error &&
      typeof responseData.error === 'object' &&
      responseData.error.message &&
      typeof responseData.error.message === 'string'
    ) {
      return responseData.error.message;
    }
  }
  // Handle axios error structure
  else if (
    error &&
    typeof error === 'object' &&
    'message' in error &&
    typeof error.message === 'string'
  ) {
    return error.message;
  }

  return ERROR_MESSAGE;
};
