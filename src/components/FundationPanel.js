import React, { useState, useEffect } from 'react';
import { applicationService } from '../services/applicationService';
import { petService } from '../services/petService';

const FoundationPanel = () => {
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

      // Obtener postulaciones de esta fundación
      const applicationsData = await applicationService.getApplications();
      setApplications(applicationsData);

      // Obtener información de mascotas
      const petsData = await petService.getAllPets();
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

  const updateApplicationStatus = async (applicationId, newStatus, adminNotes = '') => {
    try {
      setUpdatingStatus(applicationId);
      await applicationService.updateApplicationStatus(applicationId, newStatus, adminNotes);
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

  if (loading) return <div className="loading">Cargando panel de fundación...</div>;
  if (error) return <div className="error">{error}</div>;

  const stats = getStats();

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <h2>Panel de Fundación - Mis Postulaciones</h2>

      {/* Estadísticas */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
          <h3>Total</h3>
          <p style={{ fontSize: '2em', margin: 0 }}>{stats.total}</p>
        </div>
        <div style={{ backgroundColor: '#fff3cd', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
          <h3>Pendientes</h3>
          <p style={{ fontSize: '2em', margin: 0 }}>{stats.pending}</p>
        </div>
        <div style={{ backgroundColor: '#d4edda', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
          <h3>Aprobadas</h3>
          <p style={{ fontSize: '2em', margin: 0 }}>{stats.approved}</p>
        </div>
        <div style={{ backgroundColor: '#f8d7da', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
          <h3>Rechazadas</h3>
          <p style={{ fontSize: '2em', margin: 0 }}>{stats.rejected}</p>
        </div>
      </div>

      {/* Lista de postulaciones */}
      <h3>Postulaciones a Mis Mascotas</h3>
      {applications.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#666' }}>No hay postulaciones.</p>
      ) : (
        <div>
          {applications.map((application) => (
            <div key={application.id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px', marginBottom: '20px', backgroundColor: '#fff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h4>Postulación #{application.id.slice(-6)}</h4>
                <span style={{ padding: '5px 15px', borderRadius: '20px', color: 'white', backgroundColor: getStatusColor(application.status), fontSize: '14px', fontWeight: 'bold' }}>{getStatusText(application.status)}</span>
              </div>
              <p><strong>Mascota:</strong> {pets[application.petId]?.name || `ID: ${application.petId}`}</p>
              <p><strong>Usuario:</strong> {application.userId}</p>
              <p><strong>Motivo:</strong> {application.reason}</p>
              <p><strong>Experiencia:</strong> {application.experience}</p>
              <p><strong>Espacio:</strong> {application.livingSpace}</p>
              <p><strong>Horario:</strong> {application.workSchedule}</p>

              {application.adminNotes && (
                <div style={{ backgroundColor: '#e9ecef', padding: '10px', borderRadius: '5px' }}>
                  <strong>Notas:</strong> {application.adminNotes}
                </div>
              )}

              {application.status === 'PENDING' && (
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button
                    onClick={() => updateApplicationStatus(application.id, 'ACCEPTED', 'Postulación aprobada')}
                    disabled={updatingStatus === application.id}
                    style={{ backgroundColor: '#28a745', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px' }}
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
                    style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px' }}
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

export default FoundationPanel;
