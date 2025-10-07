import React, { useState, useEffect } from 'react';
import { applicationService } from '../services/applicationService';
import { petService } from '../services/petService';
import { useToast } from './Toast';

const ApplicationsList = () => {
  const [applications, setApplications] = useState([]);
  const [petNames, setPetNames] = useState({});
  const [loading, setLoading] = useState(true);
  const [hasShownToast, setHasShownToast] = useState(false);
  const toast = useToast();

  // Función para obtener nombres de mascotas
  const fetchPetNames = async (petIds) => {
    const names = {};
    
    for (const petId of petIds) {
      try {
        const petData = await petService.getPetById(petId);
        names[petId] = petData.name;
      } catch (error) {
        console.error(`Error al obtener mascota ${petId}:`, error);
        names[petId] = `ID: ${petId}`; // Fallback al ID si hay error
      }
    }
    
    return names;
  };

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      try {
        const applicationsData = await applicationService.getMyApplications();
        setApplications(applicationsData);
        
        // Obtener nombres de mascotas
        if (applicationsData.length > 0) {
          const uniquePetIds = [...new Set(applicationsData.map(app => app.petId))];
          const names = await fetchPetNames(uniquePetIds);
          setPetNames(names);
        }
        
        // Solo mostrar toast una vez cuando se cargan las postulaciones
        if (applicationsData.length > 0 && !hasShownToast) {
          toast.info(`Encontraste ${applicationsData.length} postulación${applicationsData.length !== 1 ? 'es' : ''}`);
          setHasShownToast(true);
        }
      } catch (error) {
        console.error('Error:', error);
        if (!hasShownToast) {
          toast.error('Error al cargar las postulaciones. Por favor intenta de nuevo.');
          setHasShownToast(true);
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchApplications();
  }, []); // Sin dependencias para ejecutar solo una vez

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        Cargando postulaciones...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h2>Mis Postulaciones</h2>
      {applications.length === 0 ? (
        <div style={{
          textAlign: 'center', 
          padding: '60px 20px',
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          borderRadius: '15px',
          border: '2px dashed #dee2e6'
        }}>
          <div style={{ fontSize: '80px', marginBottom: '20px' }}></div>
          <h3 style={{ color: '#6c757d', marginBottom: '10px' }}>No tienes postulaciones aún</h3>
          <p style={{ color: '#adb5bd', maxWidth: '400px', margin: '0 auto' }}>
            Explora las mascotas disponibles y postúlate para adoptar. Tus solicitudes aparecerán aquí para que puedas seguir su estado.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '20px' }}>
          {applications.map((application) => {
            const getStatusColor = (status) => {
              switch (status?.toLowerCase()) {
                case 'pending': return '#ffc107';
                case 'approved': return '#28a745';
                case 'rejected': return '#dc3545';
                default: return '#6c757d';
              }
            };

            const getStatusText = (status) => {
              switch (status?.toLowerCase()) {
                case 'pending': return 'Pendiente';
                case 'approved': return 'Aprobada';
                case 'rejected': return 'Rechazada';
                default: return status;
              }
            };

            return (
              <div key={application.id} style={{ 
                background: 'white',
                borderRadius: '15px',
                padding: '25px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                border: '1px solid #e9ecef',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '20px' 
                }}>
                  <h3 style={{ 
                    margin: 0, 
                    color: '#333',
                    fontSize: '20px'
                  }}>
                    Postulación #{application.id?.slice(-6) || 'N/A'}
                  </h3>
                  <span style={{
                    background: getStatusColor(application.status),
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '25px',
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}>
                    {getStatusText(application.status)}
                  </span>
                </div>
                
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                  gap: '20px',
                  marginBottom: '20px'
                }}>
                  <div style={{
                    background: '#f8f9fa',
                    padding: '15px',
                    borderRadius: '10px'
                  }}>
                    <p style={{ margin: '0 0 8px 0' }}>
                      <strong style={{ color: '#495057' }}>Fecha de solicitud:</strong>
                    </p>
                    <p style={{ margin: 0, color: '#333', fontSize: '16px' }}>
                      {new Date(application.createdAt).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  
                  <div style={{
                    background: '#f8f9fa',
                    padding: '15px',
                    borderRadius: '10px'
                  }}>
                    <p style={{ margin: '0 0 8px 0' }}>
                      <strong style={{ color: '#495057' }}>Mascota:</strong>
                    </p>
                    <p style={{ 
                      margin: 0, 
                      color: '#333', 
                      fontSize: '16px',
                      fontWeight: '500',
                      background: '#e3f2fd',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      display: 'inline-block',
                      border: '1px solid #bbdefb'
                    }}>
                      {petNames[application.petId] || 'Cargando...'}
                    </p>
                  </div>
                </div>

                <div style={{
                  background: '#f1f3f4',
                  padding: '20px',
                  borderRadius: '10px',
                  marginBottom: '15px'
                }}>
                  <h4 style={{ margin: '0 0 10px 0', color: '#495057' }}>Tu motivo para adoptar:</h4>
                  <p style={{ 
                    margin: 0, 
                    color: '#333', 
                    lineHeight: '1.6',
                    fontSize: '15px'
                  }}>
                    {application.reason || 'No se proporcionó motivo'}
                  </p>
                </div>

                {application.adminNotes && (
                  <div style={{
                    background: '#fff3cd',
                    border: '1px solid #ffeaa7',
                    borderRadius: '8px',
                    padding: '15px'
                  }}>
                    <h4 style={{ 
                      margin: '0 0 8px 0', 
                      color: '#856404',
                      fontSize: '16px'
                    }}>
                      Nota del administrador:
                    </h4>
                    <p style={{ 
                      margin: 0, 
                      color: '#856404',
                      lineHeight: '1.5'
                    }}>
                      {application.adminNotes}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ApplicationsList;
