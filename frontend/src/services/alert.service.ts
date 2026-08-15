import api from './api';

export const alertService = {
  getAlerts: async () => {
    const response = await api.get('/alerts');
    return response.data.data;
  },

  resolve: async (id: string) => {
    const response = await api.put(`/alerts/${id}/resolve`);
    return response.data.data;
  },

  dismiss: async (id: string) => {
    const response = await api.put(`/alerts/${id}/dismiss`);
    return response.data.data;
  },
};
