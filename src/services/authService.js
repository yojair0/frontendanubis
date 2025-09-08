import api from './api';

export const authService = {
  register: async (userData) => {
    const response = await api.post('/auth/register', {
      fullName: userData.fullName,
      email: userData.email,
      password: userData.password,
      phone: userData.phone,
      role: userData.role
    });
    return response.data;
  },

  verifyCode: async (email, verificationCode) => {
    const response = await api.post('/auth/verify-code', { 
      email, 
      verificationCode 
    });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },

  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  getUserProfile: async () => {
    return await api.get('/users/profile');
  },

  updateProfile: async (userData) => {
    return await api.put('/users/profile', userData);
  }
};
