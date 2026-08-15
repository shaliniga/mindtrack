import api from './api';
import type { User } from '@/types';

export interface AuthResponse {
  token: string;
  user: User;
}

export const authService = {
  login: async (data: any): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', data);
    return response.data.data;
  },

  register: async (data: any): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', data);
    return response.data.data;
  },

  changePassword: async (data: any): Promise<void> => {
    await api.post('/auth/change-password', data);
  },

  getManagers: async (): Promise<{ id: string; name: string }[]> => {
    const response = await api.get('/auth/managers');
    return response.data.data;
  },
};
