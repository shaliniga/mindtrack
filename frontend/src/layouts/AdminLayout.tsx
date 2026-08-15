import { LayoutDashboard, UserCog, TrendingUp, User } from 'lucide-react';
import { AppLayout } from './AppLayout';
import type { NavItem } from './AppLayout';
import type React from 'react';

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard',  to: '/admin/dashboard', icon: LayoutDashboard, end: true },
  { label: 'Users',      to: '/admin/users',      icon: UserCog },
  { label: 'Analytics',  to: '/admin/analytics',  icon: TrendingUp },
  { label: 'Profile',    to: '/admin/profile',    icon: User },
];

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <AppLayout navItems={NAV_ITEMS} role="admin">
      {children}
    </AppLayout>
  );
}
