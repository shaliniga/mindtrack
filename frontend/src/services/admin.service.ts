import api from './api';

export const adminService = {
  getUsers: async () => {
    const response = await api.get('/admin/users');
    return response.data.data;
  },

  createUser: async (data: any) => {
    const response = await api.post('/admin/users', data);
    return response.data.data;
  },

  updateRole: async (userId: string, role: string) => {
    const response = await api.put(`/admin/users/${userId}/role`, { role });
    return response.data.data;
  },

  setStatus: async (userId: string, isActive: boolean) => {
    const response = await api.put(`/admin/users/${userId}/status`, { is_active: isActive });
    return response.data.data;
  },

  getStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data.data;
  },

  getTrend: async (days: number = 30) => {
    const response = await api.get(`/admin/analytics/trend?days=${days}`);
    return response.data.data;
  },

  getDepts: async () => {
    const response = await api.get('/admin/analytics/departments');
    return response.data.data;
  },
};
