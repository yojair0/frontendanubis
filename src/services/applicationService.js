import api from './api';

export const applicationService = {
  // Crear nueva postulación
  createApplication: async (applicationData) => {
    const response = await api.post('/applications/create', applicationData);
    return response.data;
  },

  // Obtener mis postulaciones
  getMyApplications: async () => {
    const response = await api.get('/applications/user/my-applications');
    return response.data;
  },

  // Ver todas las postulaciones (solo admin)
  getAllApplications: async () => {
    const response = await api.get('/applications');
    return response.data;
  },

  // Actualizar estado de postulación (solo admin)
  updateApplicationStatus: async (applicationId, status, adminNotes = '') => {
    const response = await api.put(`/applications/${applicationId}/status`, {
      status,
      adminNotes
    });
    return response.data;
  }
};
