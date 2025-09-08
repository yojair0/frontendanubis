import React, { useState } from 'react';
import { applicationService } from '../services/applicationService';

const ApplicationForm = ({ onApplicationCreated }) => {
  const [formData, setFormData] = useState({
    animalName: '',
    animalType: 'DOG',
    motivacion: '',
    experiencia: '',
    vivienda: '',
    disponibilidad: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await applicationService.createApplication(formData);
      alert('Postulación creada exitosamente.');
      setFormData({
        animalName: '',
        animalType: 'DOG',
        motivacion: '',
        experiencia: '',
        vivienda: '',
        disponibilidad: ''
      });
      if (onApplicationCreated) {
        onApplicationCreated(response.data);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Error al crear la postulación');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h2>Nueva Postulación de Adopción</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>Nombre del animal:</label>
          <input
            type="text"
            name="animalName"
            value={formData.animalName}
            onChange={handleChange}
            required
            placeholder="Ej: Buddy, Luna, Max"
            style={{ 
              width: '100%', 
              padding: '8px', 
              marginTop: '5px',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Tipo de animal:</label>
          <select
            name="animalType"
            value={formData.animalType}
            onChange={handleChange}
            required
            style={{ 
              width: '100%', 
              padding: '8px', 
              marginTop: '5px',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          >
            <option value="DOG">Perro</option>
            <option value="CAT">Gato</option>
            <option value="OTHER">Otro</option>
          </select>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Motivación para adoptar:</label>
          <textarea
            name="motivacion"
            value={formData.motivacion}
            onChange={handleChange}
            required
            rows="4"
            placeholder="Explica por qué quieres adoptar este animal..."
            style={{ 
              width: '100%', 
              padding: '8px', 
              marginTop: '5px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              resize: 'vertical'
            }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Experiencia con mascotas:</label>
          <textarea
            name="experiencia"
            value={formData.experiencia}
            onChange={handleChange}
            required
            rows="3"
            placeholder="Describe tu experiencia previa con mascotas..."
            style={{ 
              width: '100%', 
              padding: '8px', 
              marginTop: '5px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              resize: 'vertical'
            }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Tipo de vivienda:</label>
          <textarea
            name="vivienda"
            value={formData.vivienda}
            onChange={handleChange}
            required
            rows="3"
            placeholder="Describe tu hogar (casa, departamento, patio, etc.)..."
            style={{ 
              width: '100%', 
              padding: '8px', 
              marginTop: '5px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              resize: 'vertical'
            }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Disponibilidad de tiempo:</label>
          <textarea
            name="disponibilidad"
            value={formData.disponibilidad}
            onChange={handleChange}
            required
            rows="3"
            placeholder="Describe cuánto tiempo puedes dedicar al cuidado del animal..."
            style={{ 
              width: '100%', 
              padding: '8px', 
              marginTop: '5px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              resize: 'vertical'
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
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '16px'
          }}
        >
          {loading ? 'Enviando postulación...' : 'Enviar Postulación'}
        </button>
      </form>
    </div>
  );
};

export default ApplicationForm;
