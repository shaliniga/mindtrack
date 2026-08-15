import api from './api';

export const managerService = {
  getTeam: async () => {
    const response = await api.get('/managers/me/team');
    return response.data.data;
  },

  getTeamStats: async () => {
    const response = await api.get('/managers/me/team/stats');
    return response.data.data;
  },

  getTeamTrend: async (days: number = 30) => {
    const response = await api.get(`/managers/me/team/trend?days=${days}`);
    return response.data.data;
  },

  getMember: async (employeeId: string) => {
    const response = await api.get(`/managers/me/team/${employeeId}`);
    return response.data.data;
  },

  getProfile: async () => {
    const response = await api.get('/managers/me');
    return response.data.data;
  },

  updateProfile: async (data: any) => {
    const response = await api.put('/managers/me', data);
    return response.data.data;
  },
};
