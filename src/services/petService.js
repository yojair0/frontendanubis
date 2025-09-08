import api from './api';

export const petService = {
  // Obtener todas las mascotas disponibles (público, no requiere token)
  getAllPets: async () => {
    const response = await api.get('/pets');
    return response.data;
  },

  // Obtener una mascota específica
  getPetById: async (id) => {
    const response = await api.get(`/pets/${id}`);
    return response.data;
  }
};
