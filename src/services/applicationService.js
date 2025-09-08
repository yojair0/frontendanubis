import api from './api';

export const applicationService = {
  createApplication: async (applicationData) => {
    return await api.post('/applications', {
      animalName: applicationData.animalName,
      animalType: applicationData.animalType,
      motivacion: applicationData.motivacion,
      experiencia: applicationData.experiencia,
      vivienda: applicationData.vivienda,
      disponibilidad: applicationData.disponibilidad
    });
  },

  getMyApplications: async () => {
    return await api.get('/applications/my-applications');
  }
};
