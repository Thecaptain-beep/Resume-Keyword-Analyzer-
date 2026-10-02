import api from './api';

export const dashboardService = {
  async getStats() {
    const res = await api.get('/dashboard/stats');
    return res.data;
  },

  async getRecent() {
    const res = await api.get('/dashboard/recent');
    return res.data;
  }
};
