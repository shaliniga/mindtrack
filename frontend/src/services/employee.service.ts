import api from './api';

export const employeeService = {
  getProfile: async () => {
    const response = await api.get('/employees/me');
    return response.data.data;
  },

  updateProfile: async (data: any) => {
    const response = await api.put('/employees/me', data);
    return response.data.data;
  },
};
