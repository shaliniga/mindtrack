import api from './api';

export const moodService = {
  logMood: async (data: any) => {
    const payload = {
      mood_score: data.moodScore,
      stress_level: data.stressLevel,
      energy_level: data.energyLevel,
      sleep_hours: data.sleepHours,
      sleep_quality: data.sleepQuality,
      notes: data.notes,
    };
    const response = await api.post('/mood', payload);
    return response.data.data;
  },

  getToday: async () => {
    const response = await api.get('/mood/today');
    return response.data.data;
  },

  updateMood: async (id: string, data: any) => {
    const payload = {
      mood_score: data.moodScore,
      stress_level: data.stressLevel,
      energy_level: data.energyLevel,
      sleep_hours: data.sleepHours,
      sleep_quality: data.sleepQuality,
      notes: data.notes,
    };
    const response = await api.put(`/mood/${id}`, payload);
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
