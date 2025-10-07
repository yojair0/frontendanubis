import api from './api';

export const authService = {
  register: async (userData) => {

    const response = await api.post('/auth/register', {
      fullName: userData.fullName,
      email: userData.email,
      password: userData.password,
      phone: userData.phone
    });
    
    console.log(response.data);
    return response.data;
  },

  verifyCode: async (userData, verificationCode) => {

    const response = await api.post(`/auth/verify-email`,{
      email: userData.email,
      code: verificationCode
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
    const token = localStorage.getItem('token');
    
    if (token) {
      // Verificar si el token está expirado
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const now = Date.now() / 1000;
        console.log('Token info:');
        console.log('  - Token expires at:', new Date(payload.exp * 1000));
        console.log('  - Current time:', new Date(now * 1000));
        console.log('  - Token valid:', payload.exp > now);
        console.log('  - User role from token:', payload.role);
        
        if (payload.exp <= now) {
          console.warn('Token expirado, removiendo...');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          return null;
        }
      } catch (e) {
        console.error('Error decodificando token:', e);
      }
    }
    
    return user ? JSON.parse(user) : null;
  },

  getUserProfile: async () => {
    return await api.get('/users/profile');
  },

  updateProfile: async (userData) => {
    return await api.put('/users/profile', userData);
  }
};
