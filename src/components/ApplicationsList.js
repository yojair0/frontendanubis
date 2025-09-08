import React, { useState, useEffect } from 'react';
import { applicationService } from '../services/applicationService';

const ApplicationsList = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchApplications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const response = await applicationService.getMyApplications();
      setApplications(response.data);
    } catch (error) {
      setError('Error al cargar las postulaciones');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return '#ffc107';
      case 'ACCEPTED':
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
      case 'ACCEPTED':
        return 'Aceptada';
      case 'REJECTED':
        return 'Rechazada';
      default:
        return status;
    }
  };

  const getAnimalTypeText = (type) => {
    switch (type) {
      case 'DOG':
        return 'Perro';
      case 'CAT':
        return 'Gato';
      case 'OTHER':
        return 'Otro';
      default:
        return type;
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
          No tienes postulaciones aún. Crea tu primera postulación.
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
                  Animal: {application.animalName}
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
                <strong>Tipo:</strong> {getAnimalTypeText(application.animalType)}
              </div>
              <div style={{ marginBottom: '10px' }}>
                <strong>Motivación:</strong> {application.motivacion}
              </div>
              <div style={{ marginBottom: '10px' }}>
                <strong>Experiencia:</strong> {application.experiencia}
              </div>
              <div style={{ marginBottom: '10px' }}>
                <strong>Vivienda:</strong> {application.vivienda}
              </div>
              <div style={{ marginBottom: '10px' }}>
                <strong>Disponibilidad:</strong> {application.disponibilidad}
              </div>
              <div style={{ marginBottom: '10px', fontSize: '14px', color: '#666' }}>
                <strong>Fecha de postulación:</strong> {new Date(application.submittedAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApplicationsList;
