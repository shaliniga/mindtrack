import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { lazy, Suspense } from 'react';
import { ProtectedRoute, RoleGuard } from '@/components/RouteGuards';
import { Spinner, ErrorBoundary } from '@/components';

// ─── Auth ──────────────────────────────────────────────────
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));

// ─── Employee ─────────────────────────────────────────────
const EmployeeDashboard = lazy(() => import('@/pages/employee/EmployeeDashboard'));
const LogMood           = lazy(() => import('@/pages/employee/LogMood'));
const MoodHistory       = lazy(() => import('@/pages/employee/MoodHistory'));
const EmployeeProfile   = lazy(() => import('@/pages/employee/EmployeeProfile'));

// ─── Manager ──────────────────────────────────────────────
const ManagerDashboard = lazy(() => import('@/pages/manager/ManagerDashboard'));
const MemberDetail     = lazy(() => import('@/pages/manager/MemberDetail'));
const ManagerAlerts    = lazy(() => import('@/pages/manager/ManagerAlerts'));

// ─── Admin ────────────────────────────────────────────────
const AdminDashboard  = lazy(() => import('@/pages/admin/AdminDashboard'));
const UserManagement  = lazy(() => import('@/pages/admin/UserManagement'));
const AdminAnalytics  = lazy(() => import('@/pages/admin/AdminAnalytics'));

// ─── Page Loader ──────────────────────────────────────────
function PageLoader() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      minHeight: '100vh', background: 'var(--color-bg)',
    }}>
      <Spinner size="lg" />
    </div>
  );
}

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <BrowserRouter>
          <Toaster
            position="top-right"
            richColors
            toastOptions={{ style: { fontFamily: 'Inter, sans-serif', fontSize: '0.875rem' } }}
          />
        <Suspense fallback={<PageLoader />}>
          <Routes>
          {/* Public */}
          <Route path="/login" element={<LoginPage />} />

          {/* Employee — protected + role guard */}
          <Route path="/employee/dashboard" element={
            <ProtectedRoute><RoleGuard requiredRole="employee"><EmployeeDashboard /></RoleGuard></ProtectedRoute>
          } />
          <Route path="/employee/log-mood" element={
            <ProtectedRoute><RoleGuard requiredRole="employee"><LogMood /></RoleGuard></ProtectedRoute>
          } />
          <Route path="/employee/history" element={
            <ProtectedRoute><RoleGuard requiredRole="employee"><MoodHistory /></RoleGuard></ProtectedRoute>
          } />
          <Route path="/employee/profile" element={
            <ProtectedRoute><RoleGuard requiredRole="employee"><EmployeeProfile /></RoleGuard></ProtectedRoute>
          } />

          {/* Manager — protected + role guard */}
          <Route path="/manager" element={
            <ProtectedRoute><RoleGuard requiredRole="manager"><ManagerDashboard /></RoleGuard></ProtectedRoute>
          } />
          <Route path="/manager/member/:id" element={
            <ProtectedRoute><RoleGuard requiredRole="manager"><MemberDetail /></RoleGuard></ProtectedRoute>
          } />
          <Route path="/manager/alerts" element={
            <ProtectedRoute><RoleGuard requiredRole="manager"><ManagerAlerts /></RoleGuard></ProtectedRoute>
          } />

          {/* Admin — protected + role guard */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute><RoleGuard requiredRole="admin"><AdminDashboard /></RoleGuard></ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute><RoleGuard requiredRole="admin"><UserManagement /></RoleGuard></ProtectedRoute>
          } />
          <Route path="/admin/analytics" element={
            <ProtectedRoute><RoleGuard requiredRole="admin"><AdminAnalytics /></RoleGuard></ProtectedRoute>
          } />

          {/* Redirects */}
          <Route path="/"      element={<Navigate to="/login" replace />} />
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="*"      element={<Navigate to="/login" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  </ErrorBoundary>
  </QueryClientProvider>
  );
}

export default App;
