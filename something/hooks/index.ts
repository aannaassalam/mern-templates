// Export user role hooks
export {
  useCanAccessAdmin,
  useCanAccessConsultant,
  useHasRole,
  useUserRole,
} from './useUserRole';

// Export utility functions
export {
  getCurrentUser,
  getCurrentUserRole,
  isUserAdmin,
  isUserAuthenticated,
  isUserConsultant,
} from '../utils';
