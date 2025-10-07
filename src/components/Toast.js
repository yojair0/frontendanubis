import React, { useState, useEffect, createContext, useContext } from 'react';

// Context para manejar las notificaciones toast globalmente
const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast debe usarse dentro de ToastProvider');
  }
  return context;
};

// Componente individual de Toast
const Toast = ({ id, message, type = 'info', duration = 4000, onRemove }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onRemove]);

  const getToastStyles = () => {
    const baseStyles = {
      padding: '16px 20px',
      margin: '8px 0',
      borderRadius: '8px',
      color: 'white',
      fontWeight: '500',
      fontSize: '14px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      minWidth: '300px',
      maxWidth: '500px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      transform: 'translateX(0)',
      transition: 'all 0.3s ease',
      position: 'relative',
      overflow: 'hidden'
    };

    const typeStyles = {
      success: { 
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        border: '1px solid #059669'
      },
      error: { 
        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
        border: '1px solid #dc2626'
      },
      warning: { 
        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        border: '1px solid #d97706'
      },
      info: { 
        background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
        border: '1px solid #2563eb'
      }
    };

    return { ...baseStyles, ...typeStyles[type] };
  };

  const getIcon = () => {
    const icons = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ'
    };
    return icons[type];
  };

  return (
    <div style={getToastStyles()}>
      <span style={{ fontSize: '18px', fontWeight: 'bold' }}>
        {getIcon()}
      </span>
      <span style={{ flex: 1 }}>{message}</span>
      <button
        onClick={() => onRemove(id)}
        style={{
          background: 'rgba(255,255,255,0.2)',
          border: 'none',
          color: 'white',
          borderRadius: '4px',
          width: '24px',
          height: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          fontSize: '16px',
          transition: 'background 0.2s'
        }}
        onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.3)'}
        onMouseOut={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
      >
        ×
      </button>
    </div>
  );
};

// Contenedor de toasts
const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 9999,
      pointerEvents: 'none'
    }}>
      <div style={{ pointerEvents: 'auto' }}>
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            {...toast}
            onRemove={removeToast}
          />
        ))}
      </div>
    </div>
  );
};

// Provider del contexto
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random();
    const newToast = { id, message, type, duration };
    
    setToasts(prev => [...prev, newToast]);
    
    return id;
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const toast = {
    success: (message, duration) => addToast(message, 'success', duration),
    error: (message, duration) => addToast(message, 'error', duration),
    warning: (message, duration) => addToast(message, 'warning', duration),
    info: (message, duration) => addToast(message, 'info', duration)
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};