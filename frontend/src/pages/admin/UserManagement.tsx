import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Search, UserPlus, Users } from 'lucide-react';
import { Card, Table, Button, Input, Select, Modal, PageHeader, Badge } from '@/components';
import type { Column } from '@/components';
import { AdminLayout } from '@/layouts';
import type { Role } from '@/types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '@/services/admin.service';

interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: 'active' | 'inactive';
  joinedDate: string;
}

const addUserSchema = z.object({
  name:     z.string().min(2, 'Name must be at least 2 characters'),
  email:    z.string().email('Invalid email address'),
  role:     z.enum(['employee', 'manager', 'admin']),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type AddUserForm = z.infer<typeof addUserSchema>;

export default function UserManagement() {
  const queryClient = useQueryClient();
  const [search, setSearch]         = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: rawUsers = [] } = useQuery({
    queryKey: ['admin', 'users'],
    queryFn: adminService.getUsers,
  });

  const users: SystemUser[] = rawUsers.map((u: any) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role as Role,
    status: u.is_active ? 'active' as const : 'inactive' as const,
    joinedDate: new Date(u.created_at).toISOString().split('T')[0],
  }));

  const setStatusMutation = useMutation({
    mutationFn: ({ userId, isActive }: { userId: string; isActive: boolean }) =>
      adminService.setStatus(userId, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      toast.success('User account status updated');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update user status');
    },
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: Role }) =>
      adminService.updateRole(userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      toast.success('User account role updated');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update user role');
    },
  });

  const createUserMutation = useMutation({
    mutationFn: adminService.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      toast.success('New user account registered successfully');
      setIsModalOpen(false);
      reset();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to register user');
    },
  });

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<AddUserForm>({
    resolver: zodResolver(addUserSchema),
    defaultValues: { name: '', email: '', role: 'employee', password: '' },
  });

  function handleStatusToggle(id: string) {
    const userItem = users.find((u) => u.id === id);
    if (!userItem) return;
    setStatusMutation.mutate({
      userId: id,
      isActive: userItem.status === 'inactive',
    });
  }

  function handleRoleChange(id: string, newRole: Role) {
    updateRoleMutation.mutate({
      userId: id,
      role: newRole,
    });
  }

  async function onSubmit(data: AddUserForm) {
    createUserMutation.mutate(data);
  }

  const filteredUsers = users.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole   = filterRole === 'all' || u.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const columns: Column<SystemUser>[] = [
    {
      key: 'name',
      header: 'Full Name',
      render: (v) => <span className="font-bold text-zinc-900">{v as string}</span>,
    },
    {
      key: 'email',
      header: 'Email Address',
      render: (v) => <span className="text-zinc-600 text-xs font-medium">{v as string}</span>,
    },
    {
      key: 'role',
      header: 'Assigned Role',
      render: (v, row) => (
        <div className="w-36">
          <Select
            options={[
              { value: 'employee', label: 'Employee' },
              { value: 'manager',  label: 'Manager' },
              { value: 'admin',    label: 'HR Admin' },
            ]}
            value={v as Role}
            onValueChange={(val) => handleRoleChange(row.id, val as Role)}
          />
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (v) => (
        <Badge variant={v === 'active' ? 'resolved' : 'dismissed'}>
          {String(v).toUpperCase()}
        </Badge>
      ),
    },
    {
      key: 'joinedDate',
      header: 'Member Since',
      render: (v) => <span className="text-zinc-400 text-xs font-medium">{v as string}</span>,
    },
    {
      key: 'actions',
      header: 'Account Actions',
      render: (_, row) => (
        <Button
          variant={row.status === 'active' ? 'danger' : 'secondary'}
          size="sm"
          onClick={() => handleStatusToggle(row.id)}
          className="text-xs font-semibold h-8"
        >
          {row.status === 'active' ? 'Deactivate' : 'Activate'}
        </Button>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="flex w-full flex-col gap-6 animate-fadeIn">
        <PageHeader
          title="User Account Directory"
          subtitle="Provision new employee credentials, update system roles, and toggle account activation"
          action={
            <Button
              variant="primary"
              size="md"
              leftIcon={<UserPlus size={16} />}
              onClick={() => setIsModalOpen(true)}
              className="font-bold shadow-md shadow-[#00E676]/20 h-10 px-6"
            >
              Add New User
            </Button>
          }
        />

        {/* ── Search & Filter Controls Card (8px spacing: p-8, gap-6) ── */}
        <Card className="flex flex-col items-center gap-6 p-8 sm:flex-row">
          <div className="flex-1 w-full">
            <Input
              label="Search User Records"
              placeholder="Search by name or email address..."
              leftIcon={<Search size={16} />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="w-full sm:w-60">
            <Select
              label="Filter by Role"
              options={[
                { value: 'all',      label: 'All Roles' },
                { value: 'employee', label: 'Employee' },
                { value: 'manager',  label: 'Manager' },
                { value: 'admin',    label: 'HR Admin' },
              ]}
              value={filterRole}
              onValueChange={(val) => setFilterRole(val)}
            />
          </div>
        </Card>

        {/* ── User Table Section ── */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between pb-1">
            <h2 className="text-base font-semibold text-zinc-900 m-0">Directory Records</h2>
            <span className="text-xs text-zinc-400 font-medium">Showing {filteredUsers.length} users</span>
          </div>

          <Table
            columns={columns}
            data={filteredUsers}
            keyExtractor={(row) => row.id}
            emptyIcon={<Users size={32} />}
            emptyMessage="No user accounts matching the search criteria"
          />
        </div>

        {/* ── Add User Modal Dialog ── */}
        <Modal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Register New User Account"
          description="Create system credentials and assign an initial access privilege role"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
            <Input
              label="Full Name"
              placeholder="Alex Johnson"
              error={errors.name?.message}
              {...register('name')}
            />
            <Input
              label="Company Email"
              type="email"
              placeholder="alex@company.com"
              error={errors.email?.message}
              {...register('email')}
            />
            <Select
              label="Access Privilege Role"
              options={[
                { value: 'employee', label: 'Employee' },
                { value: 'manager',  label: 'Manager' },
                { value: 'admin',    label: 'HR Admin' },
              ]}
              value={watch('role')}
              onValueChange={(val) => setValue('role', val as Role)}
            />
            <Input
              label="Temporary Password"
              type="password"
              placeholder="Min 6 characters"
              error={errors.password?.message}
              {...register('password')}
            />
            <div className="flex items-center justify-end gap-4 pt-4 border-t border-zinc-100 mt-2">
              <Button
                type="button"
                variant="secondary"
                size="md"
                onClick={() => setIsModalOpen(false)}
                className="font-semibold"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="md"
                loading={createUserMutation.isPending}
                className="font-bold shadow-md shadow-[#00E676]/20 px-6"
              >
                Create Account
              </Button>
            </div>
          </form>
        </Modal>

      </div>
    </AdminLayout>
  );
}
