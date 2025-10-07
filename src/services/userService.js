import api from './api';

export const userService = {
  // Obtener perfil del usuario actual
  getUserProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  // Actualizar perfil del usuario
  updateProfile: async (userData) => {
    const response = await api.put('/users/profile', userData);
    return response.data;
  },

  // Cambiar contraseña
  changePassword: async (passwordData) => {
    const response = await api.put('/users/change-password', passwordData);
    return response.data;
  },

  // Obtener todos los usuarios (solo admin)
  getAllUsers: async () => {
    const response = await api.get('/admin/users');
    return response.data;
  },

  // Crear nuevo usuario (solo admin)
  createUser: async (userData) => {
    const response = await api.post('/admin/create-user', userData);
    return response.data;
  },

  // Actualizar usuario (solo admin)
  updateUser: async (userId, userData) => {
    const response = await api.put(`/admin/users/${userId}`, userData);
    return response.data;
  },

  // Eliminar usuario (solo admin)
  deleteUser: async (userId) => {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  },

  // Obtener usuario por ID (solo admin)
  getUserById: async (userId) => {
    const response = await api.get(`/admin/users/${userId}`);
    return response.data;
  },

  // Obtener estadísticas de usuarios (solo admin)
  getUserStats: async () => {
    const response = await api.get('/admin/users/stats');
    return response.data;
  }
};