'use client';

import React from 'react';

interface NavbarProps {
  onMobileMenuClick?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onMobileMenuClick }) => {
  // Get user initials for fallback
  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const defaultProfileImage =
    'https://www.shutterstock.com/image-photo/passport-photo-portrait-young-man-260nw-2437772333.jpg';

  return <nav>Navbar</nav>;
};

export default Navbar;
