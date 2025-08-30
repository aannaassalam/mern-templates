import moment from 'moment';

import { ERROR_MESSAGE } from '@/constants/common.constant';
import { ApiError, User } from '@/constants/interface.constant';

export const setCookie = (name: string, value: string, days: number) => {
  const expires = moment().add(days, 'days').toDate().toUTCString(); // Convert moment to Date and then to UTC string
  document.cookie = `${name}=${value}; expires=${expires}; path=/;`;
};

// localStorage utility functions
export const setLocalStorage = (key: string, value: unknown) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

export const getLocalStorage = (key: string) => {
  if (typeof window !== 'undefined') {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }
  return null;
};

export const removeLocalStorage = (key: string) => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(key);
  }
};

export const getErrorMessage = (error: unknown): string => {
  if (isApiError(error)) {
    return error.response?.data?.message || ERROR_MESSAGE;
  }
  return ERROR_MESSAGE; // Default error message if the error is not structured as expected
};

// Type guard to check if error is ApiError
function isApiError(error: unknown): error is ApiError {
  return typeof error === 'object' && error !== null && 'response' in error;
}

// Auth user utility functions
export const getCurrentUser = (): User | null => {
  try {
    const user = getLocalStorage('auth_user');
    return user as User | null;
  } catch (error) {
    console.warn('Failed to get current user:', error);
    return null;
  }
};

export const getCurrentUserRole = (): string | null => {
  try {
    const user = getCurrentUser();
    return user?.role || null;
  } catch (error) {
    console.warn('Failed to get current user role:', error);
    return null;
  }
};

export const isUserAuthenticated = (): boolean => {
  try {
    const token = getLocalStorage('auth_token');
    const user = getCurrentUser();
    return !!(token && user && user._id);
  } catch (error) {
    console.warn('Failed to check authentication status:', error);
    return false;
  }
};

export const isUserAdmin = (): boolean => {
  return getCurrentUserRole() === 'admin';
};

export const isUserConsultant = (): boolean => {
  return getCurrentUserRole() === 'consultant';
};

// Export the new error handling utilities
export {
  extractErrorMessage,
  handleApiError,
  handleApiSuccess,
} from './apiErrorHandler';
