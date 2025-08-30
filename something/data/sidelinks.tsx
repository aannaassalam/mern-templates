import {
  IconApps,
  IconBarrierBlock,
  IconBoxSeam,
  IconCalendar,
  IconChartHistogram,
  IconChecklist,
  IconComponents,
  IconError404,
  IconExclamationCircle,
  IconFileText,
  IconHexagonNumber1,
  IconHexagonNumber2,
  IconHexagonNumber3,
  IconHexagonNumber4,
  IconHexagonNumber5,
  IconLayoutDashboard,
  IconLock,
  IconMessages,
  IconReportMedical,
  IconRouteAltLeft,
  IconServerOff,
  IconSettings,
  IconStethoscope,
  IconTruck,
  IconUsers,
  IconUserShield,
} from '@tabler/icons-react';

export interface NavLink {
  title: string;
  label?: string;
  href: string;
  icon: JSX.Element;
  roles?: string[]; // Add roles field
}

export interface SideLink extends NavLink {
  sub?: NavLink[];
}

// Admin-specific navigation links
export const adminSideLinks: SideLink[] = [
  {
    title: 'Dashboard',
    label: '',
    href: '/dashboard',
    icon: <IconLayoutDashboard size={18} />,
    roles: ['admin'],
  },
  {
    title: 'Customer Management',
    label: '',
    href: '/manage-customers',
    icon: <IconUsers size={18} />,
    roles: ['admin'],
  },
  {
    title: 'Consultant Management',
    label: '',
    href: '/manage-consultants',
    icon: <IconUserShield size={18} />,
    roles: ['admin'],
  },
  {
    title: 'Appointments',
    label: '5',
    href: '/appointments',
    icon: <IconCalendar size={18} />,
    roles: ['admin'],
  },
  {
    title: 'Reports',
    label: '',
    href: '/reports',
    icon: <IconFileText size={18} />,
    roles: ['admin'],
  },
  {
    title: 'System Settings',
    label: '',
    href: '/admin-settings',
    icon: <IconSettings size={18} />,
    roles: ['admin'],
  },
  {
    title: 'Analytics',
    label: '',
    href: '/analytics',
    icon: <IconChartHistogram size={18} />,
    roles: ['admin'],
  },
];

// Consultant-specific navigation links
export const consultantSideLinks: SideLink[] = [
  {
    title: 'Dashboard',
    label: '',
    href: '/dashboard',
    icon: <IconLayoutDashboard size={18} />,
    roles: ['consultant'],
  },
  {
    title: 'Appointments',
    label: '3',
    href: '/appointments',
    icon: <IconCalendar size={18} />,
    roles: ['consultant'],
  },
  {
    title: 'Patient Records',
    label: '',
    href: '/patient-records',
    icon: <IconFileText size={18} />,
    roles: ['consultant'],
  },
  {
    title: 'Treatment Plans',
    label: '',
    href: '/treatment-plans',
    icon: <IconStethoscope size={18} />,
    roles: ['consultant'],
  },
  {
    title: 'Medical Reports',
    label: '',
    href: '/medical-reports',
    icon: <IconReportMedical size={18} />,
    roles: ['consultant'],
  },
];

// Common links accessible to both roles
export const commonSideLinks: SideLink[] = [
  {
    title: 'Settings',
    label: '',
    href: '/settings',
    icon: <IconSettings size={18} />,
    roles: ['admin', 'consultant'],
  },
  {
    title: 'Profile',
    label: '',
    href: '/profile',
    icon: <IconUserShield size={18} />,
    roles: ['admin', 'consultant'],
  },
];

// Function to get role-specific sidebar links
export const getSideLinksForRole = (role: string): SideLink[] => {
  switch (role) {
    case 'admin':
      return [...adminSideLinks, ...commonSideLinks];
    case 'consultant':
      return [...consultantSideLinks, ...commonSideLinks];
    default:
      return commonSideLinks;
  }
};

export const sidelinks: SideLink[] = [
  {
    title: 'Dashboard',
    label: '',
    href: '/',
    icon: <IconLayoutDashboard size={18} />,
  },
  {
    title: 'Tasks',
    label: '3',
    href: '/tasks',
    icon: <IconChecklist size={18} />,
  },
  {
    title: 'Chats',
    label: '9',
    href: '/chats',
    icon: <IconMessages size={18} />,
  },
  {
    title: 'Apps',
    label: '',
    href: '/apps',
    icon: <IconApps size={18} />,
  },
  {
    title: 'Authentication',
    label: '',
    href: '',
    icon: <IconUserShield size={18} />,
    sub: [
      {
        title: 'Sign In (email + password)',
        label: '',
        href: '/sign-in',
        icon: <IconHexagonNumber1 size={18} />,
      },
      {
        title: 'Sign In (Box)',
        label: '',
        href: '/sign-in-2',
        icon: <IconHexagonNumber2 size={18} />,
      },
      {
        title: 'Sign Up',
        label: '',
        href: '/sign-up',
        icon: <IconHexagonNumber3 size={18} />,
      },
      {
        title: 'Forgot Password',
        label: '',
        href: '/forgot-password',
        icon: <IconHexagonNumber4 size={18} />,
      },
      {
        title: 'OTP',
        label: '',
        href: '/otp',
        icon: <IconHexagonNumber5 size={18} />,
      },
    ],
  },
  {
    title: 'Users',
    label: '',
    href: '/users',
    icon: <IconUsers size={18} />,
  },
  {
    title: 'Requests',
    label: '10',
    href: '/requests',
    icon: <IconRouteAltLeft size={18} />,
    sub: [
      {
        title: 'Trucks',
        label: '9',
        href: '/trucks',
        icon: <IconTruck size={18} />,
      },
      {
        title: 'Cargos',
        label: '',
        href: '/cargos',
        icon: <IconBoxSeam size={18} />,
      },
    ],
  },
  {
    title: 'Analysis',
    label: '',
    href: '/analysis',
    icon: <IconChartHistogram size={18} />,
  },
  {
    title: 'Extra Components',
    label: '',
    href: '/extra-components',
    icon: <IconComponents size={18} />,
  },
  {
    title: 'Error Pages',
    label: '',
    href: '',
    icon: <IconExclamationCircle size={18} />,
    sub: [
      {
        title: 'Not Found',
        label: '',
        href: '/404',
        icon: <IconError404 size={18} />,
      },
      {
        title: 'Internal Server Error',
        label: '',
        href: '/500',
        icon: <IconServerOff size={18} />,
      },
      {
        title: 'Maintenance Error',
        label: '',
        href: '/503',
        icon: <IconBarrierBlock size={18} />,
      },
      {
        title: 'Unauthorised Error',
        label: '',
        href: '/401',
        icon: <IconLock size={18} />,
      },
    ],
  },
  {
    title: 'Settings',
    label: '',
    href: '/settings',
    icon: <IconSettings size={18} />,
  },
];
