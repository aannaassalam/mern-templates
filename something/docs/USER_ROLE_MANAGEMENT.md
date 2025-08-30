# User Role Management System

This document explains how to get user role from auth user data and implement role-based access control in the application.

## Overview

The application now supports comprehensive user role management with the following features:

1. **Middleware-level protection** - Routes are protected based on user roles
2. **Client-side role checking** - Components can check user roles and render conditionally
3. **Utility functions** - Helper functions to get user data and roles
4. **Role-based components** - HOCs and components for role-based rendering

## Available Roles

- `admin` - Full access to all features
- `consultant` - Access to consultant-specific features
- `user` - Basic user access (if implemented)

## Route Protection

### Route Categories

1. **Public Routes** - No authentication required
2. **Authentication Routes** - Login, register, etc.
3. **Admin Only Routes** - Only accessible by admin users
4. **Consultant Only Routes** - Only accessible by consultant users
5. **Common Protected Routes** - Accessible by both admin and consultant users

### Route Configuration

Routes are configured in `constants/config.constant.js`:

```javascript
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
```

## Getting User Role

### 1. Using Utility Functions

```typescript
import {
  getCurrentUser,
  getCurrentUserRole,
  isUserAdmin,
  isUserConsultant,
} from '@/utils';

// Get current user data
const user = getCurrentUser();

// Get current user role
const userRole = getCurrentUserRole();

// Check if user is admin
const isAdmin = isUserAdmin();

// Check if user is consultant
const isConsultant = isUserConsultant();
```

### 2. Using React Hooks

```typescript
import { useUserRole, useHasRole, useCanAccessAdmin } from '@/hooks/useUserRole';

function MyComponent() {
  const { userRole, user, isAdmin, isConsultant, isAuthenticated } = useUserRole();
  const canAccessAdmin = useCanAccessAdmin();
  const hasAdminOrConsultantRole = useHasRole(['admin', 'consultant']);

  return (
    <div>
      <p>Current role: {userRole}</p>
      {isAdmin && <AdminPanel />}
      {isConsultant && <ConsultantPanel />}
    </div>
  );
}
```

### 3. Using Redux Store

```typescript
import { useSelector } from 'react-redux';
import { selectUser } from '@/store/slices/auth.slice';

function MyComponent() {
  const user = useSelector(selectUser);
  const userRole = user?.role;

  return (
    <div>
      <p>User: {user?.name}</p>
      <p>Role: {userRole}</p>
    </div>
  );
}
```

## Role-Based Component Rendering

### 1. Using Role Guard Components

```typescript
import { AdminOnly, ConsultantOnly, RoleGuard } from '@/components/auth/RoleGuard';

function MyComponent() {
  return (
    <div>
      <AdminOnly fallback={<div>Admin access required</div>}>
        <AdminPanel />
      </AdminOnly>

      <ConsultantOnly>
        <ConsultantPanel />
      </ConsultantOnly>

      <RoleGuard allowedRoles={['admin', 'consultant']}>
        <SharedContent />
      </RoleGuard>
    </div>
  );
}
```

### 2. Using Higher-Order Components (HOC)

```typescript
import { withRoleGuard } from '@/components/auth/RoleGuard';

const AdminDashboard = withRoleGuard(Dashboard, {
  allowedRoles: 'admin',
  fallback: <div>Admin access required</div>
});

const ConsultantDashboard = withRoleGuard(Dashboard, {
  allowedRoles: 'consultant',
  redirectTo: '/login'
});
```

### 3. Manual Role Checking

```typescript
import { useUserRole } from '@/hooks/useUserRole';

function MyComponent() {
  const { isAdmin, isConsultant } = useUserRole();

  return (
    <div>
      {isAdmin && (
        <div>
          <h2>Admin Features</h2>
          <AdminPanel />
        </div>
      )}

      {isConsultant && (
        <div>
          <h2>Consultant Features</h2>
          <ConsultantPanel />
        </div>
      )}

      {(isAdmin || isConsultant) && (
        <div>
          <h2>Common Features</h2>
          <CommonPanel />
        </div>
      )}
    </div>
  );
}
```

## Middleware Implementation

The middleware (`middleware.ts`) now:

1. **Gets user role from auth user data stored in cookies**
2. **Falls back to JWT token if cookie data is not available**
3. **Redirects users based on their role and the route they're trying to access**
4. **Provides detailed logging for debugging**

### How it Works

1. User logs in
2. User data is stored in localStorage AND cookies
3. Middleware reads user data from cookies
4. Route access is determined based on user role
5. Unauthorized users are redirected appropriately

## Data Storage

User data is stored in multiple places for different purposes:

1. **localStorage** - For client-side access (`auth_user` key)
2. **Cookies** - For middleware access (`auth_user` cookie)
3. **Redux Store** - For reactive state management
4. **JWT Token** - For API authentication (`auth_token` cookie)

## Error Handling

The system includes comprehensive error handling:

- Invalid tokens redirect to login
- Missing user data redirects to login
- Insufficient permissions redirect to dashboard
- Failed API calls are logged and handled gracefully

## Usage Examples

### Example 1: Dashboard with Role-Based Sections

```typescript
import { useUserRole } from '@/hooks/useUserRole';
import { AdminOnly, ConsultantOnly } from '@/components/auth/RoleGuard';

function Dashboard() {
  const { user, userRole } = useUserRole();

  return (
    <div className="dashboard">
      <h1>Welcome, {user?.name}!</h1>
      <p>Role: {userRole}</p>

      <AdminOnly>
        <section className="admin-section">
          <h2>Admin Panel</h2>
          <ManageUsersButton />
          <SystemSettingsButton />
        </section>
      </AdminOnly>

      <ConsultantOnly>
        <section className="consultant-section">
          <h2>Consultant Panel</h2>
          <AppointmentsButton />
          <PatientRecordsButton />
        </section>
      </ConsultantOnly>

      <section className="common-section">
        <h2>Common Features</h2>
        <ProfileButton />
        <SettingsButton />
      </section>
    </div>
  );
}
```

### Example 2: Protected Route Component

```typescript
import { withRoleGuard } from '@/components/auth/RoleGuard';

const AdminSettings = () => {
  return (
    <div>
      <h1>Admin Settings</h1>
      <UserManagement />
      <SystemConfiguration />
    </div>
  );
};

export default withRoleGuard(AdminSettings, {
  allowedRoles: 'admin',
  fallback: <div>You need admin privileges to access this page.</div>
});
```

## Best Practices

1. **Always check authentication first** before checking roles
2. **Use the appropriate method** for your use case (hooks, utilities, or Redux)
3. **Provide fallback content** for unauthorized users
4. **Test role-based functionality** thoroughly
5. **Keep role definitions centralized** in constants
6. **Log security-related actions** for debugging and monitoring

## Testing

To test the role-based functionality:

1. Log in as different user types (admin, consultant)
2. Navigate to different protected routes
3. Verify that role-based components render correctly
4. Check that unauthorized access is properly blocked
5. Test the middleware redirects

## Troubleshooting

### Common Issues

1. **Role not detected**: Check if user data is properly stored in cookies
2. **Middleware not working**: Verify that routes are included in middleware config
3. **Components not rendering**: Ensure user is authenticated and has correct role
4. **Infinite redirects**: Check route configuration and role assignments

### Debug Information

The middleware logs helpful information:

- Current path being accessed
- User role detected
- Route protection checks
- Redirect decisions

Check the browser console for these logs when debugging.
