import { Users, Bell, User } from 'lucide-react';
import { AppLayout } from './AppLayout';
import type { NavItem } from './AppLayout';
import type React from 'react';

const NAV_ITEMS: NavItem[] = [
  { label: 'Team',    to: '/manager',         icon: Users, end: true },
  { label: 'Alerts',  to: '/manager/alerts',  icon: Bell },
  { label: 'Profile', to: '/manager/profile', icon: User },
];

interface ManagerLayoutProps {
  children: React.ReactNode;
}

export function ManagerLayout({ children }: ManagerLayoutProps) {
  return (
    <AppLayout navItems={NAV_ITEMS} role="manager">
      {children}
    </AppLayout>
  );
}
