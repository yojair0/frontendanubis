import React, { useState, useEffect } from 'react';
import { applicationService } from '../services/applicationService';
import { petService } from '../services/petService';
import PetForm from './PetForm';

const FoundationPanel = () => {
  const [applications, setApplications] = useState([]);
  const [pets, setPets] = useState({});
  const [petNames, setPetNames] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const [showPetForm, setShowPetForm] = useState(false);
  const [currentView, setCurrentView] = useState('applications');
  const [myPets, setMyPets] = useState([]);

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
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const applicationsData = await applicationService.getApplications();
      setApplications(applicationsData);

      // Obtener nombres de mascotas usando los IDs de las postulaciones
      if (applicationsData.length > 0) {
        const uniquePetIds = [...new Set(applicationsData.map(app => app.petId))];
        const names = await fetchPetNames(uniquePetIds);
        setPetNames(names);
      }

      // Mantener la lógica original para el mapa de pets (por si se usa en otras partes)
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

  const fetchMyPets = async () => {
    try {
      const data = await petService.getMyPets();
      setMyPets(data);
    } catch (err) {
      console.error('Error al cargar mis mascotas:', err);
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
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Panel de Fundación</h2>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setCurrentView('applications')}
            style={{
              padding: '10px 20px',
              backgroundColor: currentView === 'applications' ? '#007bff' : '#f8f9fa',
              color: currentView === 'applications' ? 'white' : '#333',
              border: '1px solid #007bff',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Postulaciones
          </button>

          <button
            onClick={() => {
              setCurrentView('myPets');
              fetchMyPets();
            }}
            style={{
              padding: '10px 20px',
              backgroundColor: currentView === 'myPets' ? '#007bff' : '#f8f9fa',
              color: currentView === 'myPets' ? 'white' : '#333',
              border: '1px solid #007bff',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Mis Mascotas
          </button>

          <button
            onClick={() => setShowPetForm(true)}
            style={{
              padding: '10px 20px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            + Registrar Mascota
          </button>
        </div>
      </div>

      {/* ESTADÍSTICAS */}
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

      {/* POSTULACIONES */}
      {currentView === 'applications' && (
        <>
          <h3>Postulaciones a Mis Mascotas</h3>
          {applications.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#666' }}>No hay postulaciones.</p>
          ) : (
            <div>
              {applications.map((application) => (
                <div key={application.id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px', marginBottom: '20px', backgroundColor: '#fff' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                    <h4>Postulación #{application.id.slice(-6)}</h4>
                    <span style={{
                      padding: '5px 15px',
                      borderRadius: '20px',
                      color: 'white',
                      backgroundColor: getStatusColor(application.status),
                      fontSize: '14px',
                      fontWeight: 'bold'
                    }}>{getStatusText(application.status)}</span>
                  </div>
                  <p><strong>Mascota:</strong> {petNames[application.petId] || 'Cargando...'}</p>
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
        </>
      )}

      {/* MIS MASCOTAS */}
      {currentView === 'myPets' && (
        <div>
          <h3>Mis Mascotas Registradas</h3>
          {myPets.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#666' }}>
              No has registrado mascotas aún.
            </p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
              {myPets.map(pet => (
                <div key={pet.id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px', backgroundColor: '#fff' }}>
                  <h4>{pet.name}</h4>
                  <p><strong>Especie:</strong> {pet.species}</p>
                  <p><strong>Raza:</strong> {pet.breed}</p>
                  <p><strong>Edad:</strong> {pet.age}</p>
                  <p><strong>Tamaño:</strong> {pet.size}</p>
                  <p><strong>Descripción:</strong> {pet.description}</p>
                  {pet.imageUrls?.[0] && (
                    <img src={pet.imageUrls[0]} alt={pet.name} style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '8px', marginTop: '10px' }} />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MODAL REGISTRAR MASCOTA */}
      {showPetForm && (
        <PetForm
          onClose={() => setShowPetForm(false)}
          onSuccess={() => {
            setShowPetForm(false);
            fetchData();
          }}
        />
      )}
    </div>
  );
};

export default FoundationPanel;
