export const defaultAuthenticationPath = '/login';
export const defaultProtectedRoute = '/dashboard';
export const authenticationRoute = [
  '/login',
  '/register',
  '/forgot-password',
  '/two-factor-authentication',
  '/reset-password',
];
export const protectedRoutes = [
  '/dashboard',
  '/appointments',
  '/profile',
  '/settings',
];
export const authCookieName = 'auth_token';
export const cookieExpirationDays = 7;

// Role-based route constants - these routes require specific roles
export const adminOnlyRoutes = [
  '/admin-settings',
  '/manage-users',
  '/manage-customers',
  '/analytics',
];
export const consultantOnlyRoutes = [
  '/appointments',
  '/patient-records',
  '/treatment-plans',
  '/medical-reports',
  '/consultant-profile',
];
export const commonProtectedRoutes = ['/dashboard', '/profile', '/settings'];
export const publicRoutes = [
  '/login',
  '/register',
  '/forgot-password',
  '/two-factor-authentication',
  '/reset-password',
];
