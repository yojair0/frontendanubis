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
    const response = await api.get('/applications/all');
    return response.data;
  },

  // Ver mis postulaciones (solo fundacion)
  getApplications: async () => {
    const response = await api.get('/applications/foundation/my-applications');
    return response.data;
  },

  // Actualizar estado de postulación (fundacion o admin)
  updateApplicationStatus: async (applicationId, status, foundationResponse = '') => {
    const token = localStorage.getItem('token');
    let tokenPayload = null;
    
    try {
      tokenPayload = JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      console.error('Error decodificando token:', e);
    }
    
    const body = { status, foundationResponse };
    
    // Usar endpoint correcto del AdminController según documentación
    const response = await api.put(`/admin/applications/${applicationId}/status`, body);
    return response.data;
  },

  // Obtener postulaciones de una mascota específica
  getApplicationsByPet: async (petId) => {
    const response = await api.get(`/applications/pet/${petId}`);
    return response.data;
  },

  // Obtener detalles de una postulación específica
  getApplicationDetails: async (applicationId) => {
    const response = await api.get(`/applications/${applicationId}`);
    return response.data;
  },

  // Eliminar postulación (solo admin)
  deleteApplication: async (applicationId) => {
    const response = await api.delete(`/applications/${applicationId}`);
    return response.data;
  },

  // Función alternativa de respaldo
  updateApplicationStatusAlternative: async (applicationId, status, foundationResponse = '') => {
    const response = await api.put(`/admin/applications/${applicationId}/status`, {
      status,
      foundationResponse
    });
    return response.data;
  }
};
