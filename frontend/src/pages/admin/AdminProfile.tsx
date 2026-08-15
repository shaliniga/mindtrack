import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { User, Key, Shield, Mail, Eye, EyeOff } from 'lucide-react';
import { Button, Card, Input, PageHeader } from '@/components';
import { AdminLayout } from '@/layouts';
import { useAuthStore } from '@/stores/authStore';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '@/services/admin.service';
import { authService } from '@/services/auth.service';

const profileSchema = z.object({
  name: z.string().min(2, 'Full name must be at least 2 characters'),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(6, 'Enter your current password'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type ProfileForm = z.infer<typeof profileSchema>;
type PasswordForm = z.infer<typeof passwordSchema>;

export default function AdminProfile() {
  const { user, updateUser } = useAuthStore();
  const queryClient = useQueryClient();

  const [showCurrentPwd, setShowCurrentPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);

  const profileForm = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name ?? '' },
  });

  const pwdForm = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  });

  const { data: profile } = useQuery({
    queryKey: ['admin', 'profile'],
    queryFn: adminService.getProfile,
  });

  useEffect(() => {
    if (profile) {
      profileForm.reset({
        name: profile.name || user?.name || '',
      });
    }
  }, [profile, user, profileForm.reset]);

  const profileMutation = useMutation({
    mutationFn: adminService.updateProfile,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'profile'] });
      updateUser({ name: data.name });
      toast.success('Account profile details updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    },
  });

  const pwdMutation = useMutation({
    mutationFn: authService.changePassword,
    onSuccess: () => {
      toast.success('Security password updated successfully');
      pwdForm.reset();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update password');
    },
  });

  async function onProfileSubmit(data: ProfileForm) {
    profileMutation.mutate(data);
  }

  async function onPwdSubmit(data: PasswordForm) {
    pwdMutation.mutate({
      oldPassword: data.currentPassword,
      newPassword: data.newPassword,
    });
  }

  const initials = user?.name
    ? (user.name[0] + (user.name.split(' ')[1]?.[0] ?? '')).toUpperCase()
    : 'A';

  return (
    <AdminLayout>
      <div className="flex w-full flex-col gap-6 animate-fadeIn">
        <PageHeader
          title="Account & Profile Settings"
          subtitle="Manage your personal information, display settings, and security credentials"
        />

        {/* ── User Overview Hero Banner ── */}
        <Card className="flex flex-col justify-between gap-6 border-zinc-200 bg-gradient-to-r from-white via-emerald-50/30 to-white p-8 sm:flex-row sm:items-center sm:p-10">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00E676] to-[#00A87E] text-white text-xl font-black flex items-center justify-center shadow-lg shadow-[#00E676]/20 shrink-0">
              {initials}
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-4 flex-wrap">
                <h2 className="text-xl font-bold text-zinc-900 m-0">{user?.name}</h2>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#E8FDF5] text-[#00C853]">
                  <Shield size={12} /> Active Admin
                </span>
              </div>
              <span className="text-sm text-zinc-500 flex items-center gap-1.5">
                <Mail size={14} className="text-zinc-400" /> {user?.email}
              </span>
            </div>
          </div>
        </Card>

        {/* ── Two-Column Forms Grid ── */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

          {/* Profile Information Card */}
          <Card className="flex flex-col gap-6 p-8">
            <div className="flex items-center gap-4 pb-4 border-b border-zinc-100">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#00C853] flex items-center justify-center shrink-0">
                <User size={18} />
              </div>
              <div>
                <h3 className="text-base font-bold text-zinc-900 m-0">Personal Profile</h3>
                <p className="text-xs text-zinc-500 m-0 mt-0.5">Your official account display settings</p>
              </div>
            </div>

            <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="flex flex-col gap-6">
              <Input
                label="Full Name"
                placeholder="Alex Johnson"
                leftIcon={<User size={16} />}
                error={profileForm.formState.errors.name?.message}
                {...profileForm.register('name')}
              />

              <div className="pt-4 border-t border-zinc-100 flex justify-end">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  loading={profileMutation.isPending}
                  className="font-bold shadow-md shadow-[#00E676]/20 px-6 h-10"
                >
                  Save Profile Changes
                </Button>
              </div>
            </form>
          </Card>

          {/* Security Credentials Card */}
          <Card className="flex flex-col gap-6 p-8">
            <div className="flex items-center gap-4 pb-4 border-b border-zinc-100">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Key size={18} />
              </div>
              <div>
                <h3 className="text-base font-bold text-zinc-900 m-0">Security & Password</h3>
                <p className="text-xs text-zinc-500 m-0 mt-0.5">Update your sign-in authentication password</p>
              </div>
            </div>

            <form onSubmit={pwdForm.handleSubmit(onPwdSubmit)} className="flex flex-col gap-6">
              <Input
                label="Current Password"
                type={showCurrentPwd ? 'text' : 'password'}
                placeholder="••••••••"
                leftIcon={<Key size={16} />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowCurrentPwd((p) => !p)}
                    className="p-1 text-zinc-400 hover:text-zinc-700 bg-transparent border-none cursor-pointer flex items-center transition-colors"
                    aria-label="Toggle password visibility"
                  >
                    {showCurrentPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                }
                error={pwdForm.formState.errors.currentPassword?.message}
                {...pwdForm.register('currentPassword')}
              />

              <Input
                label="New Password"
                type={showNewPwd ? 'text' : 'password'}
                placeholder="Min 6 characters"
                leftIcon={<Key size={16} />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowNewPwd((p) => !p)}
                    className="p-1 text-zinc-400 hover:text-zinc-700 bg-transparent border-none cursor-pointer flex items-center transition-colors"
                    aria-label="Toggle password visibility"
                  >
                    {showNewPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                }
                error={pwdForm.formState.errors.newPassword?.message}
                {...pwdForm.register('newPassword')}
              />

              <Input
                label="Confirm New Password"
                type={showConfirmPwd ? 'text' : 'password'}
                placeholder="Re-enter new password"
                leftIcon={<Key size={16} />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowConfirmPwd((p) => !p)}
                    className="p-1 text-zinc-400 hover:text-zinc-700 bg-transparent border-none cursor-pointer flex items-center transition-colors"
                    aria-label="Toggle password visibility"
                  >
                    {showConfirmPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                }
                error={pwdForm.formState.errors.confirmPassword?.message}
                {...pwdForm.register('confirmPassword')}
              />

              <div className="pt-4 border-t border-zinc-100 flex justify-end">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  loading={pwdMutation.isPending}
                  className="font-bold shadow-md shadow-[#00E676]/20 px-6 h-10"
                >
                  Update Password
                </Button>
              </div>
            </form>
          </Card>

        </div>
      </div>
    </AdminLayout>
  );
}
