import React, { useState, useEffect } from 'react';
import { applicationService } from '../services/applicationService';
import { petService } from '../services/petService';

const AdminPanel = () => {
  const [applications, setApplications] = useState([]);
  const [pets, setPets] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Obtener todas las postulaciones FUNCIONA
      const applicationsData = await applicationService.getAllApplications();
      console.log(applicationsData);
      setApplications(applicationsData);

      // Obtener todas las postulaciones NO FUNCIONA
      const applicationsFData = await applicationService.getApplications();
      console.log(applicationsFData);
      setApplications(applicationsFData);
      

      // Obtener información de mascotas para mostrar nombres FUNCIONA (MUESTRA NOMBRE ID)
      const petsData = await petService.getAllPets();
      console.log(petsData)
      const petsMap = {};
      petsData.forEach(pet => {
        petsMap[pet.id] = pet;
      });
      setPets(petsMap);
    } catch (err) {
      setError('Error al cargar los datos');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  //FUNCIONA (SOLO FUNDACIONES) ELIMINAR DE ADMIN
  const updateApplicationStatus = async (applicationId, newStatus, adminNotes = '') => {
    try {
      setUpdatingStatus(applicationId);
      await applicationService.updateApplicationStatus(applicationId, newStatus, adminNotes);
      console.log(applicationService)
      
      // Actualizar la lista local
      setApplications(prev => 
        prev.map(app => 
          app.id === applicationId 
            ? { ...app, status: newStatus, adminNotes } 
            : app
        )
      );
      
      alert('Estado actualizado exitosamente');
    } catch (err) {
      alert('Error al actualizar el estado');
      console.error('Error:', err);
    } finally {
      setUpdatingStatus(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return '#ffc107';
      case 'ACCEPTED': return '#28a745';
      case 'REJECTED': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'PENDING': return 'Pendiente';
      case 'ACCEPTED': return 'Aprobada';
      case 'REJECTED': return 'Rechazada';
      default: return status;
    }
  };

  const getStats = () => {
    const total = applications.length;
    const pending = applications.filter(app => app.status === 'PENDING').length;
    const approved = applications.filter(app => app.status === 'ACCEPTED').length;
    const rejected = applications.filter(app => app.status === 'REJECTED').length;
    
    return { total, pending, approved, rejected };
  };

  if (loading) return <div className="loading">Cargando panel de administración...</div>;
  if (error) return <div className="error">{error}</div>;

  const stats = getStats();

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <h2>Panel de Administración - Fundación</h2>
      
      {/* Estadísticas */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#2c3e50' }}>Total</h3>
          <p style={{ fontSize: '2em', margin: 0, fontWeight: 'bold', color: '#2c3e50' }}>{stats.total}</p>
        </div>
        <div style={{ backgroundColor: '#fff3cd', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#856404' }}>Pendientes</h3>
          <p style={{ fontSize: '2em', margin: 0, fontWeight: 'bold', color: '#856404' }}>{stats.pending}</p>
        </div>
        <div style={{ backgroundColor: '#d4edda', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#155724' }}>Aprobadas</h3>
          <p style={{ fontSize: '2em', margin: 0, fontWeight: 'bold', color: '#155724' }}>{stats.approved}</p>
        </div>
        <div style={{ backgroundColor: '#f8d7da', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#721c24' }}>Rechazadas</h3>
          <p style={{ fontSize: '2em', margin: 0, fontWeight: 'bold', color: '#721c24' }}>{stats.rejected}</p>
        </div>
      </div>

      {/* Lista de postulaciones */}
      <h3>Todas las Postulaciones</h3>
      {applications.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#666' }}>No hay postulaciones aún.</p>
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
                backgroundColor: '#fff'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h4 style={{ margin: 0, color: '#333' }}>
                  Postulación #{application.id.slice(-6)}
                </h4>
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '15px' }}>
                <div>
                  <p><strong>Mascota:</strong> {pets[application.petId]?.name || `ID: ${application.petId}`}</p>
                  <p><strong>Usuario ID:</strong> {application.userId}</p>
                  <p><strong>Fecha:</strong> {new Date(application.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p><strong>Tiene otras mascotas:</strong> {application.hasOtherPets ? 'Sí' : 'No'}</p>
                </div>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <p><strong>Motivo:</strong> {application.reason}</p>
                <p><strong>Experiencia:</strong> {application.experience}</p>
                <p><strong>Espacio de vivienda:</strong> {application.livingSpace}</p>
                <p><strong>Horario de trabajo:</strong> {application.workSchedule}</p>
              </div>

              {application.adminNotes && (
                <div style={{ 
                  backgroundColor: '#e9ecef', 
                  padding: '10px', 
                  borderRadius: '5px',
                  marginBottom: '15px'
                }}>
                  <strong>Notas del administrador:</strong> {application.adminNotes}
                </div>
              )}

              {application.status === 'PENDING' && (
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <button
                    onClick={() => updateApplicationStatus(application.id, 'ACCEPTED', 'Postulación aprobada')}
                    disabled={updatingStatus === application.id}
                    style={{
                      backgroundColor: '#28a745',
                      color: 'white',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '4px',
                      cursor: updatingStatus === application.id ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {updatingStatus === application.id ? 'Actualizando...' : 'Aprobar'}
                  </button>
                  
                  <button
                    onClick={() => {
                      const notes = prompt('Motivo del rechazo (opcional):');
                      if (notes !== null) {
                        updateApplicationStatus(application.id, 'REJECTED', notes || 'Postulación rechazada');
                      }
                    }}
                    disabled={updatingStatus === application.id}
                    style={{
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '4px',
                      cursor: updatingStatus === application.id ? 'not-allowed' : 'pointer'
                    }}
                  >
                    Rechazar
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
