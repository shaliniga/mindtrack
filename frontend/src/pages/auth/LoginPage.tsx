import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button, Input, Select } from '@/components';
import { useAuthStore } from '@/stores/authStore';
import type { Role } from '@/types';

const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type LoginForm = z.infer<typeof loginSchema>;
type RegisterForm = z.infer<typeof registerSchema>;
type Mode = 'login' | 'register';

const MOCK_USERS: Record<Role, { id: string; name: string; email: string; role: Role }> = {
  employee: { id: 'emp-1', name: 'Alex Johnson', email: 'employee@demo.com', role: 'employee' },
  manager: { id: 'mgr-1', name: 'Sarah Williams', email: 'manager@demo.com', role: 'manager' },
  admin: { id: 'adm-1', name: 'James Carter', email: 'admin@demo.com', role: 'admin' },
};

const ROLE_DASHBOARD: Record<Role, string> = {
  employee: '/employee/dashboard',
  manager: '/manager',
  admin: '/admin/dashboard',
};

const ROLE_OPTIONS = [
  { value: 'employee', label: 'Employee' },
  { value: 'manager', label: 'Manager' },
  { value: 'admin', label: 'HR Admin' },
];

const FEATURES = [
  { icon: '📊', text: 'Track your daily mood, stress & energy levels' },
  { icon: '🔍', text: 'Spot burnout indicators before they escalate' },
  { icon: '🔒', text: '100% private & secure — notes stay confidential' },
];

export default function LoginPage() {
  const [mode, setMode] = useState<Mode>('login');
  const [role, setRole] = useState<Role>('employee');
  const [showPwd, setShowPwd] = useState(false);
  const [showCPwd, setShowCPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useAuthStore();
  const navigate = useNavigate();

  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const registerForm = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  });

  function switchMode(next: Mode) {
    setMode(next);
    loginForm.reset();
    registerForm.reset();
    setShowPwd(false);
    setShowCPwd(false);
  }

  async function onLogin(data: LoginForm) {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    const mockUser = MOCK_USERS[role];
    login({ ...mockUser, email: data.email }, 'mock-jwt-token');
    toast.success(`Welcome back, ${mockUser.name.split(' ')[0]}! 👋`);
    navigate(ROLE_DASHBOARD[role], { replace: true });
    setLoading(false);
  }

  async function onRegister(data: RegisterForm) {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    toast.success('Account created! You can now sign in.');
    switchMode('login');
    loginForm.setValue('email', data.email);
    setLoading(false);
  }

  return (
    <div className="flex min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(0,230,118,0.16),_transparent_34%),linear-gradient(135deg,_#f8fffb_0%,_#f4f7f5_100%)] font-[Inter,sans-serif]">

      {/* ── Left Hero Panel (Desktop) ───────────────── */}
      <div className="relative hidden flex-[0_0_46%] flex-col justify-center gap-12 overflow-hidden rounded-[2rem] m-4 p-12 text-white lg:flex xl:p-16"
        style={{ background: 'linear-gradient(145deg, #00E676 0%, #00B060 50%, #008744 100%)' }}
      >
        {/* Decorative background glow circles */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-black/10 blur-2xl pointer-events-none" />

        {/* Top: Clean Logo Container */}
        <div className="relative z-10">
          <div className="flex justify-center">
            <div className="flex justify-center">
              <img
                src="/logo.jpeg"
                alt="MindTrack Logo"
                className="h-30 w-auto object-contain block"
              />
            </div>
          </div>

          <div className="relative z-10 flex flex-col gap-6 my-auto py-10">
            <div>
              <span className="inline-block text-xs font-bold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full text-white mb-3">
                Mental Wellness Platform
              </span>
              <h1 className="text-3xl xl:text-4xl font-extrabold text-white leading-tight tracking-tight">
                Your team's mental wellness, simplified.
              </h1>
              <p className="text-white/85 text-base mt-3 leading-relaxed max-w-lg">
                Log your mood daily, understand wellness patterns, and empower your organization to thrive together.
              </p>
            </div>

            {/* Feature List */}
            <div className="flex flex-col gap-6 mt-2">
              {FEATURES.map((f) => (
                <div
                  key={f.text}
                  className="flex items-center gap-4 bg-white/10 hover:bg-white/15 border border-white/15 px-6 py-4 rounded-xl backdrop-blur-sm transition-colors duration-150"
                >
                  <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-lg shrink-0">
                    {f.icon}
                  </div>
                  <span className="text-white/95 text-sm font-medium">
                    {f.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Right Panel: Form ───────────────────────── */}
      <div className="flex flex-1 items-center justify-center overflow-y-auto p-6 sm:p-10 lg:p-12">
        <div className="w-full max-w-md">

          {/* Mobile Logo Branding */}
          <div className="flex justify-center mb-8 lg:hidden">
            <div className="bg-black/90 p-3 rounded-2xl border border-zinc-800 shadow-md">
              <img src="/logo.jpeg" alt="MindTrack Logo" className="h-10 w-auto object-contain block" />
            </div>
          </div>

          {/* Form Card */}
          <div className="animate-fadeIn rounded-[1.75rem] border border-zinc-200/80 bg-white/90 p-10 shadow-[0_24px_80px_rgba(15,23,42,0.12)] backdrop-blur-sm sm:p-12">

            {/* Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-extrabold text-zinc-900 tracking-tight m-0">
                {mode === 'login' ? 'Welcome back 👋' : 'Create an account'}
              </h2>
              <p className="text-sm text-zinc-500 mt-1.5 m-0">
                {mode === 'login'
                  ? 'Sign in to access your MindTrack wellness dashboard'
                  : 'Join your organization on MindTrack today'}
              </p>
            </div>

            {/* Role Selector */}
            <div className="mb-5">
              <Select
                id="role-select"
                label="Sign in as"
                options={ROLE_OPTIONS}
                value={role}
                onValueChange={(v) => setRole(v as Role)}
              />
            </div>

            {/* ── Login Form ── */}
            {mode === 'login' && (
              <form onSubmit={loginForm.handleSubmit(onLogin)} className="flex flex-col gap-6">
                <Input
                  id="login-email"
                  label="Email address"
                  type="email"
                  placeholder="name@company.com"
                  leftIcon={<Mail size={16} />}
                  error={loginForm.formState.errors.email?.message}
                  {...loginForm.register('email')}
                />

                <Input
                  id="login-password"
                  label="Password"
                  type={showPwd ? 'text' : 'password'}
                  placeholder="Enter your password"
                  leftIcon={<Lock size={16} />}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowPwd((p) => !p)}
                      className="p-1 text-zinc-400 hover:text-zinc-700 bg-transparent border-none cursor-pointer flex items-center transition-colors"
                      aria-label="Toggle password visibility"
                    >
                      {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  }
                  error={loginForm.formState.errors.password?.message}
                  {...loginForm.register('password')}
                />

                <div className="mt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    loading={loading}
                    rightIcon={<ArrowRight size={18} />}
                    className="font-bold shadow-lg shadow-[#00E676]/20 h-11"
                  >
                    Sign In
                  </Button>
                </div>
              </form>
            )}

            {/* ── Register Form ── */}
            {mode === 'register' && (
              <form onSubmit={registerForm.handleSubmit(onRegister)} className="flex flex-col gap-6">
                <Input
                  id="reg-name"
                  label="Full name"
                  type="text"
                  placeholder="Alex Johnson"
                  leftIcon={<User size={16} />}
                  error={registerForm.formState.errors.name?.message}
                  {...registerForm.register('name')}
                />

                <Input
                  id="reg-email"
                  label="Email address"
                  type="email"
                  placeholder="name@company.com"
                  leftIcon={<Mail size={16} />}
                  error={registerForm.formState.errors.email?.message}
                  {...registerForm.register('email')}
                />

                <Input
                  id="reg-password"
                  label="Password"
                  type={showPwd ? 'text' : 'password'}
                  placeholder="Create a password"
                  leftIcon={<Lock size={16} />}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowPwd((p) => !p)}
                      className="p-1 text-zinc-400 hover:text-zinc-700 bg-transparent border-none cursor-pointer flex items-center transition-colors"
                    >
                      {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  }
                  error={registerForm.formState.errors.password?.message}
                  {...registerForm.register('password')}
                />

                <Input
                  id="reg-confirm-password"
                  label="Confirm password"
                  type={showCPwd ? 'text' : 'password'}
                  placeholder="Repeat your password"
                  leftIcon={<Lock size={16} />}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowCPwd((p) => !p)}
                      className="p-1 text-zinc-400 hover:text-zinc-700 bg-transparent border-none cursor-pointer flex items-center transition-colors"
                    >
                      {showCPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  }
                  error={registerForm.formState.errors.confirmPassword?.message}
                  {...registerForm.register('confirmPassword')}
                />

                <div className="mt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    loading={loading}
                    rightIcon={<CheckCircle2 size={18} />}
                    className="font-bold shadow-lg shadow-[#00E676]/20 h-11"
                  >
                    Create Account
                  </Button>
                </div>
              </form>
            )}

            {/* Toggle Link */}
            <div className="mt-8 pt-6 border-t border-zinc-100 text-center">
              {mode === 'login' ? (
                <p className="m-0 text-sm text-zinc-500">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => switchMode('register')}
                    className="bg-transparent border-none p-0 cursor-pointer text-[#00C853] font-bold text-sm hover:underline transition-all"
                  >
                    Register
                  </button>
                </p>
              ) : (
                <p className="m-0 text-sm text-zinc-500">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => switchMode('login')}
                    className="bg-transparent border-none p-0 cursor-pointer text-[#00C853] font-bold text-sm hover:underline transition-all"
                  >
                    Sign In
                  </button>
                </p>
              )}
            </div>
          </div>

          {/* Footer Subtext */}
          <p className="text-center mt-6 text-xs text-zinc-400 font-medium">
            MindTrack · Mental Wellness Platform · Demo v1
          </p>
        </div>
      </div>
    </div>
  );
}
