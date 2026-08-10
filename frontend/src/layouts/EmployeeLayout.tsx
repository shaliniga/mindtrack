import { LayoutDashboard, PenLine, BarChart2, User } from 'lucide-react';
import { AppLayout } from './AppLayout';
import type { NavItem } from './AppLayout';
import type React from 'react';

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard',  to: '/employee/dashboard', icon: LayoutDashboard, end: true },
  { label: 'Log Mood',   to: '/employee/log-mood',  icon: PenLine },
  { label: 'History',    to: '/employee/history',    icon: BarChart2 },
  { label: 'Profile',    to: '/employee/profile',    icon: User },
];

interface EmployeeLayoutProps {
  children: React.ReactNode;
}

export function EmployeeLayout({ children }: EmployeeLayoutProps) {
  return (
    <AppLayout navItems={NAV_ITEMS} role="employee">
      {children}
    </AppLayout>
  );
}
