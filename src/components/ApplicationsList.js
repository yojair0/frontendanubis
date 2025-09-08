import React, { useState, useEffect } from 'react';
import { applicationService } from '../services/applicationService';

const ApplicationsList = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const applicationsData = await applicationService.getMyApplications();
      setApplications(applicationsData);
    } catch (error) {
      setError('Error al cargar las postulaciones');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return '#ffc107';
      case 'APPROVED':
        return '#28a745';
      case 'REJECTED':
        return '#dc3545';
      default:
        return '#6c757d';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'PENDING':
        return 'Pendiente';
      case 'APPROVED':
        return 'Aprobada';
      case 'REJECTED':
        return 'Rechazada';
      default:
        return status;
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '20px' }}>Cargando postulaciones...</div>;
  }

  if (error) {
    return <div style={{ color: 'red', textAlign: 'center', padding: '20px' }}>{error}</div>;
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h2>Mis Postulaciones</h2>
      
      {applications.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#666' }}>
          No tienes postulaciones aún. ¡Ve a la sección de mascotas y postula para adoptar!
        </p>
      ) : (
        <div>
          {applications.map((application) => (
            <div 
              key={application.id} 
              style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '20px',
                marginBottom: '20px',
                backgroundColor: '#f8f9fa'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h3 style={{ margin: 0, color: '#333' }}>
                  Postulación #{application.id.slice(-6)}
                </h3>
                <span 
                  style={{ 
                    padding: '5px 15px',
                    borderRadius: '20px',
                    color: 'white',
                    backgroundColor: getStatusColor(application.status),
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}
                >
                  {getStatusText(application.status)}
                </span>
              </div>
              
              <div style={{ marginBottom: '10px' }}>
                <strong>Mascota ID:</strong> {application.petId}
              </div>
              <div style={{ marginBottom: '10px' }}>
                <strong>Motivo:</strong> {application.reason}
              </div>
              <div style={{ marginBottom: '10px' }}>
                <strong>Experiencia:</strong> {application.experience}
              </div>
              <div style={{ marginBottom: '10px' }}>
                <strong>Espacio de vivienda:</strong> {application.livingSpace}
              </div>
              <div style={{ marginBottom: '10px' }}>
                <strong>Horario de trabajo:</strong> {application.workSchedule}
              </div>
              <div style={{ marginBottom: '10px' }}>
                <strong>Tiene otras mascotas:</strong> {application.hasOtherPets ? 'Sí' : 'No'}
              </div>
              <div style={{ marginBottom: '10px', fontSize: '14px', color: '#666' }}>
                <strong>Fecha de postulación:</strong> {new Date(application.createdAt).toLocaleDateString()}
              </div>
              {application.adminNotes && (
                <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#e9ecef', borderRadius: '5px' }}>
                  <strong>Notas del administrador:</strong> {application.adminNotes}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApplicationsList;
