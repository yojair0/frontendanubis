import React, { useState } from 'react';
import { applicationService } from '../services/applicationService';

const AdoptionForm = ({ pet, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    petId: pet.id,
    reason: '',
    experience: '',
    livingSpace: '',
    hasOtherPets: false,
    workSchedule: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await applicationService.createApplication(formData);
      alert('¡Postulación enviada exitosamente!');
      onSuccess && onSuccess();
      onClose && onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al enviar la postulación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Postular para adoptar a {pet.name}</h2>
          <button onClick={onClose} className="close-btn">×</button>
        </div>

        <div className="pet-info-summary">
          <img src={pet.imageUrl} alt={pet.name} className="pet-modal-image" />
          <div>
            <p><strong>{pet.name}</strong> - {pet.species} {pet.breed}</p>
            <p>{pet.age} años</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="adoption-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="reason">¿Por qué quieres adoptar a {pet.name}?</label>
            <textarea
              id="reason"
              name="reason"
              value={formData.reason}
              onChange={handleInputChange}
              required
              rows="4"
              placeholder="Cuéntanos por qué esta mascota sería perfecta para ti..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="experience">Experiencia con mascotas</label>
            <textarea
              id="experience"
              name="experience"
              value={formData.experience}
              onChange={handleInputChange}
              required
              rows="3"
              placeholder="Describe tu experiencia previa con mascotas..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="livingSpace">Espacio de vivienda</label>
            <textarea
              id="livingSpace"
              name="livingSpace"
              value={formData.livingSpace}
              onChange={handleInputChange}
              required
              rows="3"
              placeholder="Describe tu hogar: ¿casa o apartamento? ¿tiene jardín? ¿es seguro?"
            />
          </div>

          <div className="form-group">
            <label htmlFor="workSchedule">Horario de trabajo</label>
            <textarea
              id="workSchedule"
              name="workSchedule"
              value={formData.workSchedule}
              onChange={handleInputChange}
              required
              rows="2"
              placeholder="¿Cuántas horas trabajas fuera de casa? ¿Quién cuidará la mascota?"
            />
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="hasOtherPets"
                checked={formData.hasOtherPets}
                onChange={handleInputChange}
              />
              Tengo otras mascotas en casa
            </label>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancelar
            </button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Enviando...' : 'Enviar Postulación'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdoptionForm;
