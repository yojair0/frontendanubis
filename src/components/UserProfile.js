import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/userService';

const UserProfile = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPasswordSection, setShowPasswordSection] = useState(false);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      const profile = await userService.getUserProfile();
      setProfileData({
        fullName: profile.fullName || '',
        email: profile.email || '',
        phone: profile.phone || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err) {
      setError('Error al cargar el perfil');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar mensajes al cambiar datos
    setError('');
    setSuccess('');
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setError('');
    setSuccess('');

    try {
      const updateData = {
        fullName: profileData.fullName,
        phone: profileData.phone
      };

      await userService.updateProfile(updateData);
      setSuccess('Perfil actualizado exitosamente');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al actualizar el perfil');
    } finally {
      setUpdating(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (profileData.newPassword !== profileData.confirmPassword) {
      setError('Las nuevas contraseñas no coinciden');
      return;
    }

    if (profileData.newPassword.length < 6) {
      setError('La nueva contraseña debe tener al menos 6 caracteres');
      return;
    }

    setUpdating(true);
    setError('');
    setSuccess('');

    try {
      await userService.changePassword({
        currentPassword: profileData.currentPassword,
        newPassword: profileData.newPassword
      });
      
      setSuccess('Contraseña actualizada exitosamente');
      setProfileData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
      setShowPasswordSection(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cambiar la contraseña');
    } finally {
      setUpdating(false);
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'USER': return 'Usuario';
      case 'FOUNDATION': return 'Fundación';
      case 'ADMIN': return 'Administrador';
      default: return role;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'USER': return '#007bff';
      case 'FOUNDATION': return '#28a745';
      case 'ADMIN': return '#dc3545';
      default: return '#6c757d';
    }
  };

  if (loading) {
    return <div className="loading">Cargando perfil...</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>Mi Perfil</h2>
        <div className="user-info-card">
          <div className="user-avatar">
            <span>{profileData.fullName.charAt(0).toUpperCase()}</span>
          </div>
          <div className="user-details">
            <h3>{profileData.fullName}</h3>
            <p>{profileData.email}</p>
            <span 
              className="role-badge"
              style={{ 
                backgroundColor: getRoleColor(user?.role),
                color: 'white',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 'bold'
              }}
            >
              {getRoleLabel(user?.role)}
            </span>
          </div>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="profile-sections">
        {/* Información Personal */}
        <div className="profile-section">
          <h3>Información Personal</h3>
          <form onSubmit={handleUpdateProfile}>
            <div className="form-row">
              <div className="form-group">
                <label>Nombre Completo</label>
                <input
                  type="text"
                  name="fullName"
                  value={profileData.fullName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={profileData.email}
                  disabled
                  style={{ backgroundColor: '#f8f9fa', color: '#6c757d' }}
                />
                <small style={{ color: '#6c757d' }}>
                  El email no se puede modificar
                </small>
              </div>
            </div>

            <div className="form-group">
              <label>Teléfono</label>
              <input
                type="tel"
                name="phone"
                value={profileData.phone}
                onChange={handleInputChange}
                placeholder="Ej: +56 9 1234 5678"
              />
            </div>

            <button 
              type="submit" 
              disabled={updating}
              className="btn-primary"
            >
              {updating ? 'Actualizando...' : 'Guardar Cambios'}
            </button>
          </form>
        </div>

        {/* Cambiar Contraseña */}
        <div className="profile-section">
          <h3>Seguridad</h3>
          
          {!showPasswordSection ? (
            <div>
              <p style={{ color: '#6c757d', marginBottom: '15px' }}>
                Mantén tu cuenta segura con una contraseña fuerte.
              </p>
              <button 
                onClick={() => setShowPasswordSection(true)}
                className="btn-secondary"
              >
                Cambiar Contraseña
              </button>
            </div>
          ) : (
            <form onSubmit={handleChangePassword}>
              <div className="form-group">
                <label>Contraseña Actual</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={profileData.currentPassword}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Nueva Contraseña</label>
                <input
                  type="password"
                  name="newPassword"
                  value={profileData.newPassword}
                  onChange={handleInputChange}
                  required
                  minLength="6"
                />
              </div>

              <div className="form-group">
                <label>Confirmar Nueva Contraseña</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={profileData.confirmPassword}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  onClick={() => {
                    setShowPasswordSection(false);
                    setProfileData(prev => ({
                      ...prev,
                      currentPassword: '',
                      newPassword: '',
                      confirmPassword: ''
                    }));
                  }}
                  className="btn-secondary"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  disabled={updating}
                  className="btn-primary"
                >
                  {updating ? 'Cambiando...' : 'Cambiar Contraseña'}
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};

export default UserProfile;