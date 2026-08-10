import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, LogOut } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { Avatar } from '@/components';

export interface NavItem {
  label: string;
  to: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  end?: boolean;
}

interface AppLayoutProps {
  navItems: NavItem[];
  role: 'employee' | 'manager' | 'admin';
  children: React.ReactNode;
}

export function AppLayout({ navItems, children }: AppLayoutProps) {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile drawer on route navigation
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  // Derive current page title for mobile top bar
  const activeItem = navItems.find((item) => {
    if (item.end) return location.pathname === item.to;
    return location.pathname.startsWith(item.to);
  });
  const pageTitle = activeItem?.label ?? 'MindTrack';

  // Shared Sidebar Content (Logo, Nav, User Profile)
  const renderSidebarContent = (onClose?: () => void) => (
    <div className="flex h-full flex-col bg-gradient-to-b from-[#050505] via-[#0A0A0A] to-[#111111]">

      {/* ── Logo ───────────────────────── */}
      <div className="relative flex items-center justify-center px-3 py-4 border-b border-white/10">
        <img
          src="/logo.jpeg"
          alt="MindTrack Logo"
          className="h-24 w-auto object-contain"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />

        {onClose && (
          <button
            onClick={onClose}
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white transition-all border-none cursor-pointer"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* ── Navigation ─────────────────── */}
      <nav className="flex-1 overflow-y-auto px-4 py-6">

        <div className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `
                group flex items-center gap-4 rounded-2xl px-4 py-3
                transition-all duration-200 no-underline
                ${isActive
                    ? 'bg-gradient-to-r from-[#00E676]/25 to-[#00C853]/10 text-[#00E676] shadow-lg shadow-[#00E676]/10'
                    : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                  }
              `
                }
              >
                <Icon
                  size={20}
                  className="transition-transform duration-200 group-hover:scale-110"
                />

                <span className="font-medium text-[15px]">
                  {item.label}
                </span>
              </NavLink>
            );
          })}
        </div>
      </nav>

      <div className="border-t border-white/10 p-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-zinc-400 hover:bg-red-500/10 hover:text-red-400 transition-all bg-transparent border-none cursor-pointer"
        >
          <LogOut size={18} />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(0,230,118,0.08),_transparent_32%),linear-gradient(180deg,_#f8faf9_0%,_#f4f7f5_100%)] font-[Inter,sans-serif] antialiased">

      {/* ── 1. Desktop Fixed 280px Sidebar ── */}
      <aside className="hidden lg:sticky lg:top-0 lg:h-screen lg:flex lg:w-[280px] lg:shrink-0 lg:flex-col overflow-hidden bg-[#0B0F13] border-r border-zinc-800">
        {renderSidebarContent()}
      </aside>

      {/* ── 2. Mobile Drawer Overlay ── */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-fadeIn"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 w-[280px] bg-[#09090B] border-r border-[#1E1E24] flex flex-col shadow-2xl z-50 animate-slideInRight">
            {renderSidebarContent(() => setIsMobileMenuOpen(false))}
          </aside>
        </div>
      )}

      {/* ── 3. Main Content Container (8px Grid & Max-width Constraints) ── */}
      <div className="flex min-h-screen min-w-0 flex-1 flex-col">

        {/* Mobile Header Bar (hidden on desktop lg+) */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-zinc-200/80 bg-white/90 px-6 shadow-[0_10px_30px_rgba(15,23,42,0.04)] backdrop-blur-sm sm:px-6 lg:hidden">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="cursor-pointer rounded-xl border-none bg-transparent p-2 text-zinc-700 transition-colors hover:bg-zinc-100"
              aria-label="Open navigation menu"
            >
              <Menu size={22} />
            </button>
            <span className="text-base font-semibold text-zinc-900">{pageTitle}</span>
          </div>
          <Avatar name={user?.name ?? 'User'} size="sm" />
        </header>

        {/* Page Content */}
        <main className="mx-auto flex min-w-0 w-full max-w-7xl flex-1 flex-col px-6 py-8 sm:px-8 sm:py-10 lg:px-10">
          {children}
        </main>
      </div>
    </div>
  );
}
