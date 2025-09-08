import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Navigation = ({ currentView, setCurrentView }) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    setCurrentView('login');
  };

  if (!user) {
    return null;
  }

  return (
    <nav style={{
      backgroundColor: '#343a40',
      padding: '15px 0',
      marginBottom: '20px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 20px'
      }}>
        <div style={{ color: 'white', fontSize: '24px', fontWeight: 'bold' }}>
          Anubis - Adopciones
        </div>
        
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <button
            onClick={() => setCurrentView('pets')}
            style={{
              padding: '8px 16px',
              backgroundColor: currentView === 'pets' ? '#007bff' : 'transparent',
              color: 'white',
              border: '1px solid #007bff',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Ver Mascotas
          </button>
          
          <button
            onClick={() => setCurrentView('myApplications')}
            style={{
              padding: '8px 16px',
              backgroundColor: currentView === 'myApplications' ? '#007bff' : 'transparent',
              color: 'white',
              border: '1px solid #007bff',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Mis Postulaciones
          </button>

          {/* Mostrar panel admin si el usuario tiene rol de admin */}
          {user.roles && user.roles.includes('ROLE_ADMIN') && (
            <button
              onClick={() => setCurrentView('admin')}
              style={{
                padding: '8px 16px',
                backgroundColor: currentView === 'admin' ? '#007bff' : 'transparent',
                color: 'white',
                border: '1px solid #007bff',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Panel Admin
            </button>
          )}
          
          <div style={{ color: 'white', fontSize: '14px' }}>
            Hola, {user.firstName || user.name || user.email}
          </div>
          
          <button
            onClick={handleLogout}
            style={{
              padding: '8px 16px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
