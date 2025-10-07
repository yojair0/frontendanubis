import React, { useState, useEffect } from 'react';
import { applicationService } from '../services/applicationService';
import { petService } from '../services/petService';
import { userService } from '../services/userService';
import { useAuth } from '../contexts/AuthContext';
import PetForm from './PetForm';
import { useToast } from './Toast';

// Modal elegante para notas del admin
const AdminNotesModal = ({ isOpen, onClose, onSubmit, action, applicationId }) => {
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(notes || getDefaultNote());
      setNotes('');
      onClose();
    } catch (error) {
      console.error('Error:', error);  
    } finally {
      setLoading(false);
    }
  };

  const getDefaultNote = () => {
    switch (action) {
      case 'ACCEPTED': return 'Postulación aprobada por administrador';
      case 'REJECTED': return 'Postulación rechazada por administrador';
      case 'PENDING': return 'Postulación regresada a estado pendiente';
      default: return 'Actualizado por administrador';
    }
  };

  const getActionText = () => {
    switch (action) {
      case 'ACCEPTED': return { title: 'Aprobar Postulación', color: '#28a745', icon: '' };
      case 'REJECTED': return { title: '                      Rechazar', color: '#dc3545', icon: '' };
      case 'PENDING': return { title: 'Volver a Pendiente', color: '#ffc107', icon: '' };
      default: return { title: 'Actualizar Estado', color: '#6c757d', icon: '' };
    }
  };

  if (!isOpen) return null;

  const actionInfo = getActionText();

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
        <div className="modal-header" style={{ borderBottom: `3px solid ${actionInfo.color}` }}>
          <h3 style={{ margin: 0, color: actionInfo.color, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.2em' }}>{actionInfo.icon}</span>
            {actionInfo.title}
          </h3>
          <button onClick={onClose} className="close-btn">×</button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '20px' }}>
          <div style={{ marginBottom: '20px' }}>
            <p style={{ color: '#666', fontSize: '14px', marginBottom: '15px' }}>
              Postulación #{applicationId?.slice(-6)} - Agrega una nota opcional para el usuario:
            </p>
            
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={getDefaultNote()}
              style={{
                width: '100%',
                minHeight: '100px',
                padding: '12px',
                border: '2px solid #e1e8ed',
                borderRadius: '8px',
                fontSize: '14px',
                resize: 'vertical',
                fontFamily: 'inherit'
              }}
            />
            
            <div style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
              {notes.length}/500 caracteres
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              style={{
                padding: '10px 20px',
                border: '2px solid #6c757d',
                borderRadius: '6px',
                background: 'white',
                color: '#6c757d',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '600'
              }}
            >
              Cancelar
            </button>
            
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '10px 20px',
                border: 'none',
                borderRadius: '6px',
                background: actionInfo.color,
                color: 'white',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? 'Procesando...' : `${actionInfo.icon} Confirmar`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Mini carrusel para el grid de mascotas
const MiniImageCarousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div style={{ 
        height: '200px', 
        backgroundColor: '#f8f9fa',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#6c757d'
      }}>
        Sin imágenes
      </div>
    );
  }

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  return (
    <div style={{ 
      height: '200px', 
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        height: '100%',
        backgroundImage: `url(${images[currentIndex]})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }} />
      
      {images.length > 1 && (
        <>
          <button
            onClick={prevImage}
            style={{
              position: 'absolute',
              left: '5px',
              top: '50%',
              transform: 'translateY(-50%)',
              backgroundColor: 'rgba(0,0,0,0.5)',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '30px',
              height: '30px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            ‹
          </button>
          
          <button
            onClick={nextImage}
            style={{
              position: 'absolute',
              right: '5px',
              top: '50%',
              transform: 'translateY(-50%)',
              backgroundColor: 'rgba(0,0,0,0.5)',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '30px',
              height: '30px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            ›
          </button>
          
          <div style={{
            position: 'absolute',
            bottom: '10px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '4px'
          }}>
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  border: 'none',
                  backgroundColor: index === currentIndex ? 'white' : 'rgba(255,255,255,0.5)',
                  cursor: 'pointer'
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const AdminPanel = () => {
  const toast = useToast();
  const { user } = useAuth(); // Obtener información del usuario actual
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [pets, setPets] = useState({});
  const [users, setUsers] = useState({}); // Nuevo estado para usuarios
  const [allPets, setAllPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(null);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [currentTab, setCurrentTab] = useState('applications'); // 'applications', 'pets'
  const [showPetForm, setShowPetForm] = useState(false);
  const [petToEdit, setPetToEdit] = useState(null);
  // Estados para el modal de notas del admin
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [pendingAction, setPendingAction] = useState(null); // { applicationId, newStatus }

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterApplications();
  }, [applications, statusFilter]);

  // Debug: Información completa del usuario y token
  React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('ADMIN PANEL - Token decodificado:');
        console.log('  - Subject (userId):', payload.sub);
        console.log('  - Role:', payload.role);
        console.log('  - Expires:', new Date(payload.exp * 1000));
        console.log('  - Issued at:', new Date(payload.iat * 1000));
        console.log('  - Token válido:', payload.exp > Date.now() / 1000);
        console.log('🧑 Usuario del contexto:', user);
        console.log('  - User ID:', user?.id);
        console.log('  - User Role:', user?.role);
        console.log('  - User Email:', user?.email);
      } catch (e) {
        console.error('Error decodificando token en AdminPanel:', e);
      }
    }
  }, [user]);

  // Verificación de permisos después de los hooks
  if (!user) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <h3>Acceso denegado</h3>
        <p>Debes estar logueado para acceder al panel de administración.</p>
      </div>
    );
  }

  if (user.role !== 'ADMIN' && user.role !== 'FOUNDATION') {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <h3>Permisos insuficientes</h3>
        <p>Solo los administradores y fundaciones pueden acceder a este panel.</p>
        <p>Tu rol actual: {user.role || 'No definido'}</p>
      </div>
    );
  }

  const fetchData = async () => {
    try {
      setLoading(true);
      const applicationsData = await applicationService.getAllApplications();
      setApplications(applicationsData);

      // Obtener datos de mascotas
      const petsData = await petService.getAllPets();
      const petsMap = {};
      petsData.forEach(pet => {
        petsMap[pet.id] = pet;
      });
      setPets(petsMap);
      setAllPets(petsData);

      // Obtener datos de usuarios
      try {
        const usersData = await userService.getAllUsers();
        const usersMap = {};
        usersData.forEach(user => {
          usersMap[user.id] = user;
        });
        setUsers(usersMap);
      } catch (userErr) {
        console.error('Error al cargar usuarios:', userErr);
        // No es crítico, continuamos sin mostrar nombres
      }
      
    } catch (err) {
      setError('Error al cargar los datos');
      console.error('Error:', err);
    } finally {
      setLoading(false);
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

  const filterApplications = () => {
    if (statusFilter === 'ALL') {
      setFilteredApplications(applications);
    } else {
      setFilteredApplications(applications.filter(app => app.status === statusFilter));
    }
  };

  const handleUpdateApplicationStatus = async (applicationId, newStatus, foundationResponse = '') => {
    try {
      console.log('Actualizando aplicación:', { applicationId, newStatus, foundationResponse });
      
      // Debug: verificar token y usuario
      const token = localStorage.getItem('token');
      console.log('Token presente:', !!token);
      console.log('Token (primeros 20 chars):', token?.substring(0, 20));
      console.log('👤 Usuario actual:', user);
      console.log('🎭 Rol del usuario:', user?.role);
      
      setDeleting(applicationId); // Reutilizamos este estado para mostrar loading
      setError(''); // Limpiar errores previos
      
      let result;
      try {
        result = await applicationService.updateApplicationStatus(applicationId, newStatus, foundationResponse);

      } catch (primaryError) {
        console.warn('Endpoint principal falló, probando alternativo...');
        try {
          result = await applicationService.updateApplicationStatusAlternative(applicationId, newStatus, foundationResponse);

        } catch (alternativeError) {
          console.error('Ambos endpoints fallaron');
          throw primaryError; // Re-lanzar el error original
        }
      }
      
      // Actualizar la aplicación en el estado local
      setApplications(prev => 
        prev.map(app => 
          app.id === applicationId 
            ? { ...app, status: newStatus, foundationResponse } 
            : app
        )
      );
      
      // También actualizar las aplicaciones filtradas
      setFilteredApplications(prev => 
        prev.map(app => 
          app.id === applicationId 
            ? { ...app, status: newStatus, foundationResponse } 
            : app
        )
      );
      
      const statusText = newStatus === 'ACCEPTED' ? 'aprobada' : newStatus === 'REJECTED' ? 'rechazada' : 'actualizada';
      const icon = newStatus === 'ACCEPTED' ? '' : newStatus === 'REJECTED' ? '' : '';
      toast.success(`${icon} ¡Postulación ${statusText} exitosamente!`, 4000);
    } catch (err) {
      console.error('Error completo:', err);
      console.error('Response error:', err.response);
      console.error('Response data:', err.response?.data);
      console.error('Status code:', err.response?.status);
      
      const errorMessage = err.response?.data?.message || err.message || 'Error desconocido';
      setError(`Error al actualizar la postulación: ${errorMessage}`);
      toast.error(`Error: ${errorMessage}`, 5000);
    } finally {
      setDeleting(null);
    }
  };

  const handleDeleteApplication = async (applicationId) => {
    const confirmed = window.confirm(
      '¿Estás seguro de que deseas eliminar esta postulación? Esta acción no se puede deshacer.'
    );

    if (confirmed) {
      try {
        setDeleting(applicationId);
        await applicationService.deleteApplication(applicationId);
        setApplications(prev => prev.filter(app => app.id !== applicationId));
        toast.success('¡Postulación eliminada exitosamente!', 4000);
      } catch (err) {
        console.error('Error:', err);
        setError('Error al eliminar la postulación');
      } finally {
        setDeleting(null);
      }
    }
  };

  // Funciones para el modal de notas del admin
  const handleOpenNotesModal = (applicationId, newStatus) => {
    setPendingAction({ applicationId, newStatus });
    setShowNotesModal(true);
  };

  const handleCloseNotesModal = () => {
    setShowNotesModal(false);
    setPendingAction(null);
  };

  const handleSubmitNotes = async (notes) => {
    if (!pendingAction) return;
    
    const { applicationId, newStatus } = pendingAction;
    
    // Debug adicional antes de enviar
    const token = localStorage.getItem('token');
    let tokenRole = null;
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        tokenRole = payload.role;
      } catch (e) {
        console.error('Error decodificando token:', e);
      }
    }
    

    
    await handleUpdateApplicationStatus(applicationId, newStatus, notes);
  };

  const handleCreatePet = () => {
    setPetToEdit(null);
    setShowPetForm(true);
  };

  const handleEditPet = (pet) => {
    setPetToEdit(pet);
    setShowPetForm(true);
  };

  const handleDeletePet = async (petId) => {
    const confirmed = window.confirm(
      '¿Estás seguro de que deseas eliminar esta mascota? Esta acción no se puede deshacer.'
    );

    if (confirmed) {
      try {
        await petService.deletePet(petId);
        setAllPets(prev => prev.filter(pet => pet.id !== petId));
        toast.success('¡Mascota eliminada exitosamente!', 4000);
      } catch (err) {
        console.error('Error:', err);
        setError('Error al eliminar la mascota');
      }
    }
  };

  const handlePetFormClose = () => {
    setShowPetForm(false);
    setPetToEdit(null);
  };

  const handlePetFormSuccess = () => {
    setShowPetForm(false);
    setPetToEdit(null);
    fetchData(); // Recargar datos
  };

  const getStats = () => {
    const total = applications.length;
    const pending = applications.filter(app => app.status === 'PENDING').length;
    const ACCEPTED = applications.filter(app => app.status === 'ACCEPTED').length;
    const rejected = applications.filter(app => app.status === 'REJECTED').length;
    return { total, pending, ACCEPTED, rejected };
  };

  if (loading) return <div className="loading">Cargando panel de administración...</div>;
  if (error) return <div className="error">{error}</div>;

  const stats = getStats();

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 style={{ margin: 0 }}>Panel de Administración</h2>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setCurrentTab('applications')}
            style={{
              padding: '10px 20px',
              backgroundColor: currentTab === 'applications' ? '#007bff' : '#f8f9fa',
              color: currentTab === 'applications' ? 'white' : '#333',
              border: '1px solid #007bff',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Postulaciones
          </button>
          
          <button
            onClick={() => setCurrentTab('pets')}
            style={{
              padding: '10px 20px',
              backgroundColor: currentTab === 'pets' ? '#007bff' : '#f8f9fa',
              color: currentTab === 'pets' ? 'white' : '#333',
              border: '1px solid #007bff',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            🐕 Mascotas
          </button>
          
          {currentTab === 'pets' && (
            <button
              onClick={handleCreatePet}
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
          )}
        </div>
      </div>

      {/* Contenido condicional por pestaña */}
      {currentTab === 'applications' && (
        <>
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
              <p style={{ fontSize: '2em', margin: 0, fontWeight: 'bold', color: '#155724' }}>{stats.ACCEPTED}</p>
            </div>
            <div style={{ backgroundColor: '#f8d7da', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#721c24' }}>Rechazadas</h3>
              <p style={{ fontSize: '2em', margin: 0, fontWeight: 'bold', color: '#721c24' }}>{stats.rejected}</p>
            </div>
          </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ margin: 0 }}>Todas las Postulaciones</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: '8px 12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          >
            <option value="ALL">Todos los estados</option>
            <option value="PENDING">Pendientes</option>
            <option value="ACCEPTED">Aprobadas</option>
            <option value="REJECTED">Rechazadas</option>
          </select>
          <div style={{ fontSize: '14px', color: '#666' }}>
            Mostrando: {filteredApplications.length} de {applications.length}
          </div>
        </div>
      </div>
      
      {error && (
        <div className="error-message" style={{ marginBottom: '20px' }}>
          {error}
        </div>
      )}
      
      {filteredApplications.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          color: '#666',
          padding: '40px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          border: '1px solid #dee2e6'
        }}>
          <p style={{ margin: 0, fontSize: '16px' }}>
            {applications.length === 0 
              ? 'No hay postulaciones registradas en el sistema.' 
              : `No hay postulaciones con el estado "${getStatusText(statusFilter)}".`
            }
          </p>
        </div>
      ) : (
        <div>
          {filteredApplications.map((application) => (
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
                  <p><strong>Solicitante:</strong> {users[application.userId]?.name || users[application.userId]?.email || `ID: ${application.userId}`}</p>
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

              {application.foundationResponse && (
                <div style={{ 
                  backgroundColor: '#e9ecef', 
                  padding: '10px', 
                  borderRadius: '5px',
                  marginBottom: '15px'
                }}>
                  <strong>Respuesta de la fundación:</strong> {application.foundationResponse}
                </div>
              )}

              {/* Acciones de administrador */}
              <div style={{ 
                paddingTop: '15px',
                borderTop: '1px solid #e9ecef'
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '10px'
                }}>
                  <h5 style={{ margin: 0, color: '#333', fontSize: '14px' }}>Acciones de Administrador:</h5>
                  <span style={{ fontSize: '12px', color: '#666' }}>
                    Estado actual: <strong>{getStatusText(application.status)}</strong>
                  </span>
                </div>

                {/* Cambiar estado */}
                <div style={{ 
                  display: 'flex', 
                  gap: '8px',
                  marginBottom: '10px',
                  flexWrap: 'wrap'
                }}>
                  {application.status !== 'ACCEPTED' && (
                    <button
                      onClick={() => {

                        if (!application.id) {
                          toast.error('Error: ID de aplicación no válido', 4000);
                          return;
                        }
                        handleOpenNotesModal(application.id, 'ACCEPTED');
                      }}
                      disabled={deleting === application.id}
                      style={{
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        padding: '6px 12px',
                        borderRadius: '4px',
                        cursor: deleting === application.id ? 'not-allowed' : 'pointer',
                        opacity: deleting === application.id ? 0.6 : 1,
                        fontSize: '13px',
                        fontWeight: 'bold'
                      }}
                    >
                      Aprobar
                    </button>
                  )}

                  {application.status !== 'REJECTED' && (
                    <button
                      onClick={() => {
                        console.log('Botón RECHAZAR clickeado para:', application);
                        if (!application.id) {
                          toast.error('Error: ID de aplicación no válido', 4000);
                          return;
                        }
                        handleOpenNotesModal(application.id, 'REJECTED');
                      }}
                      disabled={deleting === application.id}
                      style={{
                        backgroundColor: '#ffc107',
                        color: '#212529',
                        border: 'none',
                        padding: '6px 12px',
                        borderRadius: '4px',
                        cursor: deleting === application.id ? 'not-allowed' : 'pointer',
                        opacity: deleting === application.id ? 0.6 : 1,
                        fontSize: '13px',
                        fontWeight: 'bold'
                      }}
                    >
                      Rechazar
                    </button>
                  )}

                  {application.status !== 'PENDING' && (
                    <button
                      onClick={() => {
                        handleOpenNotesModal(application.id, 'PENDING');
                      }}
                      disabled={deleting === application.id}
                      style={{
                        backgroundColor: '#17a2b8',
                        color: 'white',
                        border: 'none',
                        padding: '6px 12px',
                        borderRadius: '4px',
                        cursor: deleting === application.id ? 'not-allowed' : 'pointer',
                        opacity: deleting === application.id ? 0.6 : 1,
                        fontSize: '13px',
                        fontWeight: 'bold'
                      }}
                    >
                      Volver a Pendiente
                    </button>
                  )}
                </div>

                {/* Acción destructiva */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'flex-end'
                }}>
                  <button
                    onClick={() => handleDeleteApplication(application.id)}
                    disabled={deleting === application.id}
                    style={{
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '4px',
                      cursor: deleting === application.id ? 'not-allowed' : 'pointer',
                      opacity: deleting === application.id ? 0.6 : 1,
                      fontSize: '13px',
                      fontWeight: 'bold'
                    }}
                  >
                    {deleting === application.id ? 'Procesando...' : 'Eliminar Permanentemente'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
        </>
      )}

      {/* Vista de Mascotas */}
      {currentTab === 'pets' && (
        <>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '20px',
            marginBottom: '30px'
          }}>
            <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#2c3e50' }}>Total Mascotas</h3>
              <p style={{ fontSize: '2em', margin: 0, fontWeight: 'bold', color: '#2c3e50' }}>{allPets.length}</p>
            </div>
            <div style={{ backgroundColor: '#d4edda', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#155724' }}>Disponibles</h3>
              <p style={{ fontSize: '2em', margin: 0, fontWeight: 'bold', color: '#155724' }}>
                {allPets.filter(pet => pet.status === 'AVAILABLE').length}
              </p>
            </div>
            <div style={{ backgroundColor: '#f8d7da', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#721c24' }}>Adoptadas</h3>
              <p style={{ fontSize: '2em', margin: 0, fontWeight: 'bold', color: '#721c24' }}>
                {allPets.filter(pet => pet.status === 'ADOPTED').length}
              </p>
            </div>
            <div style={{ backgroundColor: '#fff3cd', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#856404' }}>En Proceso</h3>
              <p style={{ fontSize: '2em', margin: 0, fontWeight: 'bold', color: '#856404' }}>
                {allPets.filter(pet => pet.status === 'PENDING').length}
              </p>
            </div>
          </div>

          <h3>Gestión de Mascotas</h3>
          {allPets.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              color: '#666',
              padding: '40px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              border: '1px solid #dee2e6'
            }}>
              <p style={{ margin: 0, fontSize: '16px' }}>No hay mascotas registradas en el sistema.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
              {allPets.map((pet) => (
                <div 
                  key={pet.id}
                  style={{
                    border: '1px solid #ddd',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    backgroundColor: '#fff',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}
                >
                  <div style={{ position: 'relative' }}>
                    <MiniImageCarousel images={pet.imageUrls || []} />
                    <span 
                      style={{ 
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        color: 'white',
                        backgroundColor: pet.status === 'AVAILABLE' ? '#28a745' : pet.status === 'ADOPTED' ? '#6c757d' : '#ffc107',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        zIndex: 2
                      }}
                    >
                      {pet.status === 'AVAILABLE' ? 'Disponible' : pet.status === 'ADOPTED' ? 'Adoptada' : 'En Proceso'}
                    </span>
                  </div>
                  
                  <div style={{ padding: '15px' }}>
                    <h4 style={{ margin: '0 0 10px 0', color: '#333' }}>{pet.name}</h4>
                    <p style={{ margin: '5px 0', fontSize: '14px', color: '#666' }}>
                      <strong>Especie:</strong> {pet.species}
                    </p>
                    <p style={{ margin: '5px 0', fontSize: '14px', color: '#666' }}>
                      <strong>Raza:</strong> {pet.breed}
                    </p>
                    <p style={{ margin: '5px 0', fontSize: '14px', color: '#666' }}>
                      <strong>Edad:</strong> {pet.age} años
                    </p>
                    <p style={{ margin: '5px 0', fontSize: '14px', color: '#666' }}>
                      <strong>Género:</strong> {pet.gender}
                    </p>
                    <p style={{ margin: '10px 0', fontSize: '14px', color: '#555' }}>
                      {pet.description}
                    </p>

                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      gap: '10px',
                      marginTop: '15px',
                      paddingTop: '15px',
                      borderTop: '1px solid #e9ecef'
                    }}>
                      <button
                        onClick={() => handleEditPet(pet)}
                        style={{
                          flex: 1,
                          backgroundColor: '#007bff',
                          color: 'white',
                          border: 'none',
                          padding: '8px 12px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: 'bold'
                        }}
                      >
                        Editar
                      </button>
                      
                      <button
                        onClick={() => handleDeletePet(pet.id)}
                        style={{
                          flex: 1,
                          backgroundColor: '#dc3545',
                          color: 'white',
                          border: 'none',
                          padding: '8px 12px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: 'bold'
                        }}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Modal de formulario de mascota */}
      {showPetForm && (
        <PetForm
          pet={petToEdit}
          onClose={handlePetFormClose}
          onSuccess={handlePetFormSuccess}
        />
      )}

      {/* Modal de notas del admin */}
      {showNotesModal && pendingAction && (
        <AdminNotesModal
          isOpen={showNotesModal}
          onClose={handleCloseNotesModal}
          onSubmit={handleSubmitNotes}
          action={pendingAction.newStatus}
          applicationId={pendingAction.applicationId}
        />
      )}
    </div>
  );
};

export default AdminPanel;
