import api from './api';

export const userService = {
  async getProfile() {
    const res = await api.get('/user/profile');
    return res.data;
  },

  async updateProfile(fullName) {
    const res = await api.put('/user/profile', { fullName });
    return res.data;
  },

  async changePassword(currentPassword, newPassword) {
    const res = await api.put('/user/change-password', { currentPassword, newPassword });
    return res.data;
  }
};
