import api from './api';

export const moodService = {
  logMood: async (data: any) => {
    const response = await api.post('/mood', data);
    return response.data.data;
  },

  getToday: async () => {
    const response = await api.get('/mood/today');
    return response.data.data;
  },

  updateMood: async (id: string, data: any) => {
    const response = await api.put(`/mood/${id}`, data);
    return response.data.data;
  },

  getHistory: async (from?: string, to?: string) => {
    const params = new URLSearchParams();
    if (from) params.append('from', from);
    if (to) params.append('to', to);
    
    const response = await api.get(`/mood/history?${params.toString()}`);
    return response.data.data;
  },

  getStats: async (days: number = 7) => {
    const response = await api.get(`/mood/stats?days=${days}`);
    return response.data.data;
  },
};
