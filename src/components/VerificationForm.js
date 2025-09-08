import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const VerificationForm = ({ email, onBackToRegister }) => {
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { verifyCode } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await verifyCode(email, verificationCode);
      alert('Email verificado exitosamente.');
    } catch (error) {
      setError(error.response?.data?.message || 'Código de verificación inválido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      <h2>Verificar Email</h2>
      <p style={{ marginBottom: '20px', color: '#666' }}>
        Hemos enviado un código de 6 dígitos a <strong>{email}</strong>
      </p>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>Código de verificación (6 dígitos):</label>
          <input
            type="text"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            required
            maxLength="6"
            placeholder="123456"
            style={{ 
              width: '100%', 
              padding: '12px', 
              marginTop: '5px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '18px',
              textAlign: 'center',
              letterSpacing: '2px'
            }}
          />
        </div>

        {error && (
          <div style={{ color: 'red', marginBottom: '15px' }}>
            {error}
          </div>
        )}

        <button 
          type="submit" 
          disabled={loading || verificationCode.length !== 6}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: (loading || verificationCode.length !== 6) ? 'not-allowed' : 'pointer',
            fontSize: '16px'
          }}
        >
          {loading ? 'Verificando...' : 'Verificar Código'}
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button 
          onClick={onBackToRegister}
          style={{ 
            background: 'none', 
            border: 'none', 
            color: '#007bff', 
            cursor: 'pointer',
            textDecoration: 'underline'
          }}
        >
          Volver al registro
        </button>
      </div>

      <div style={{ 
        marginTop: '20px', 
        padding: '15px', 
        backgroundColor: '#f8f9fa', 
        borderRadius: '4px',
        fontSize: '14px',
        color: '#666'
      }}>
        <strong>Nota:</strong> El código expira en 1 hora. Si no lo recibes, revisa tu carpeta de spam.
      </div>
    </div>
  );
};

export default VerificationForm;
