import api from './api';

export const petService = {
  // Obtener todas las mascotas (público)
  getAllPets: async () => {
    const response = await api.get('/pets');
    return response.data;
  },

  //Obtener una mascota en base a su ID 
  getPetById: async (id) => {
    const response = await api.get(`/pets/${id}`);
    return response.data;
  },

  // Obtener mascotas de la fundación autenticada
  getMyPets: async () => {
    const response = await api.get('/pets/foundation/my-pets');
    return response.data;
  },

  // Subir imagen de mascota (fundación o admin)
  uploadPetImage: async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post('/pets/upload-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return response.data; // { imageUrl: '...' }
  },

  // Crear una nueva mascota (solo fundación)
  createPet: async (petData) => {
    const response = await api.post('/pets', petData);
    return response.data;
  },

  // Actualizar una mascota (fundación o admin)
  updatePet: async (id, petData) => {
    const response = await api.put(`/pets/${id}`, petData);
    return response.data;
  },

  // Eliminar una mascota (fundación o admin)
  deletePet: async (id) => {
    const response = await api.delete(`/pets/${id}`);
    return response.data; // normalmente un mensaje de éxito
  }
  

};

