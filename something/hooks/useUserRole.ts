import { useSelector } from 'react-redux';

import { getCurrentUserRole, isUserAdmin, isUserConsultant } from '@/utils';
import { useSuspenseQuery } from '@tanstack/react-query';

/**
 * Hook to get current user role and role-based utilities
 * This hook can be used in components to access user role information
 */
export const useUserRole = () => {
  const { data: user } = useSuspenseQuery({
    queryKey: ['user'],
    queryFn: () => Promise.resolve({ role: '' }), // Placeholder, replace with actual user fetch if needed
  });

  // Get role from Redux store first, fallback to localStorage
  const userRole = user?.role || getCurrentUserRole();

  const isAdmin = userRole === 'admin' || isUserAdmin();
  const isConsultant = userRole === 'consultant' || isUserConsultant();

  return {
    userRole,
    user,
    isAdmin,
    isConsultant,
    isAuthenticated: !!user,
  };
};

/**
 * Hook to check if user has specific role
 */
export const useHasRole = (requiredRole: string | string[]) => {
  const { userRole } = useUserRole();

  if (Array.isArray(requiredRole)) {
    return requiredRole.includes(userRole || '');
  }

  return userRole === requiredRole;
};

/**
 * Hook to check if user can access admin routes
 */
export const useCanAccessAdmin = () => {
  const { isAdmin } = useUserRole();
  return isAdmin;
};

/**
 * Hook to check if user can access consultant routes
 */
export const useCanAccessConsultant = () => {
  const { isConsultant } = useUserRole();
  return isConsultant;
};
