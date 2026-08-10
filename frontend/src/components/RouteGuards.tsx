import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import type { Role } from '@/types';

// ─── ProtectedRoute ───────────────────────────────────────
// Redirects to /login if user is not authenticated
interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

// ─── RoleGuard ────────────────────────────────────────────
// Redirects to the correct dashboard if the user's role doesn't match
interface RoleGuardProps {
  children: React.ReactNode;
  requiredRole: Role;
}

const ROLE_DASHBOARD: Record<Role, string> = {
  employee: '/employee/dashboard',
  manager:  '/manager',
  admin:    '/admin/dashboard',
};

export function RoleGuard({ children, requiredRole }: RoleGuardProps) {
  const user = useAuthStore((s) => s.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== requiredRole) {
    // Wrong role — send them to their own dashboard
    return <Navigate to={ROLE_DASHBOARD[user.role]} replace />;
  }

  return <>{children}</>;
}
