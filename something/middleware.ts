// middleware.ts
import { jwtDecode } from 'jwt-decode';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import {
  adminOnlyRoutes,
  authCookieName,
  authenticationRoute,
  commonProtectedRoutes,
  consultantOnlyRoutes,
  defaultAuthenticationPath,
  publicRoutes,
} from './constants/config.constant';

interface DecodedToken {
  id: string;
  role?: string;
  iat: number;
  exp: number;
}

interface AuthUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  photo?: string;
  phone?: string;
  department?: string;
  specialization?: string;
  experience?: string;
  status?: 'active' | 'inactive';
}

// Helper function to get user data from cookies or headers
const getUserFromStorage = (req: NextRequest): AuthUser | null => {
  try {
    // Try to get user data from a cookie if it exists
    const userCookie = req.cookies.get('auth_user');
    if (userCookie) {
      const userData = JSON.parse(userCookie.value);
      if (userData && userData.role) {
        return userData as AuthUser;
      }
    }

    // If no user cookie, we'll need to rely on JWT token
    return null;
  } catch (error) {
    console.warn('Failed to get user from storage:', error);
    return null;
  }
};

// Helper function to get user role from auth user data or JWT token
const getUserRole = (req: NextRequest): string | null => {
  try {
    const token = req.cookies.get(authCookieName);
    if (!token) return null;

    // Try to get user data from storage first
    const authUser = getUserFromStorage(req);
    if (authUser && authUser.role) {
      return authUser.role;
    }

    // Fallback to JWT token
    const decoded = jwtDecode<DecodedToken>(token.value);
    return decoded.role || null;
  } catch (error) {
    console.warn('Failed to get user role:', error);
    return null;
  }
};

export function middleware(req: NextRequest) {
  const token = req.cookies.get(authCookieName);
  const path = req.nextUrl.pathname;

  // Public routes: allow access without authentication
  if (publicRoutes.includes(path) || authenticationRoute.includes(path)) {
    // If already authenticated and trying to access auth routes, redirect to dashboard
    if (token && authenticationRoute.includes(path)) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
    return NextResponse.next();
  }

  // If not authenticated and trying to access protected route
  if (
    !token &&
    (adminOnlyRoutes.includes(path) ||
      consultantOnlyRoutes.includes(path) ||
      commonProtectedRoutes.includes(path))
  ) {
    return NextResponse.redirect(new URL(defaultAuthenticationPath, req.url));
  }

  // If authenticated, check role for role-based routes
  if (token) {
    const userRole = getUserRole(req);

    // If we can't determine the user role, redirect to login
    if (!userRole) {
      console.warn('Unable to determine user role, redirecting to login');
      return NextResponse.redirect(new URL(defaultAuthenticationPath, req.url));
    }

    console.log('Middleware triggered for path:', path);
    console.log('User role:', userRole);
    console.log('Route checks:', {
      isCommonProtected: commonProtectedRoutes.includes(path),
      isConsultantOnly: consultantOnlyRoutes.includes(path),
      isAdminOnly: adminOnlyRoutes.includes(path),
    });

    // Admin-only routes
    if (adminOnlyRoutes.includes(path) && userRole !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    // Consultant-only routes
    if (consultantOnlyRoutes.includes(path) && userRole !== 'consultant') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    // Common protected routes: both admin and consultant can access
    if (commonProtectedRoutes.includes(path)) {
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

// Apply middleware to all protected and role-based routes
export const config = {
  matcher: [
    '/admin-settings',
    '/manage-users',
    '/analytics',
    '/appointments',
    '/patient-records',
    '/treatment-plans',
    '/medical-reports',
    '/consultant-profile',
    '/dashboard',
    '/profile',
    '/settings',
    '/login',
    '/register',
    '/forgot-password',
    '/two-factor-authentication',
    '/reset-password',
  ],
};
