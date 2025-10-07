import React, { useState } from 'react';
import { applicationService } from '../services/applicationService';
import { useToast } from './Toast';

// Carrusel para mostrar imágenes de la mascota en el formulario
const PetImageCarousel = ({ images, petName }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div style={{ 
        width: '100%', 
        height: '200px', 
        backgroundColor: '#f8f9fa',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '8px',
        color: '#6c757d'
      }}>
        Sin imágenes disponibles
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
      position: 'relative',
      width: '100%',
      height: '200px',
      borderRadius: '8px',
      overflow: 'hidden',
      backgroundColor: '#f8f9fa'
    }}>
      <img
        src={images[currentIndex]}
        alt={`${petName} - Imagen ${currentIndex + 1}`}
        style={{ 
          width: '100%', 
          height: '100%', 
          objectFit: 'cover' 
        }}
        onError={(e) => {
          e.target.style.backgroundColor = '#f8f9fa';
          e.target.alt = 'Error al cargar imagen';
        }}
      />
      
      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={prevImage}
            style={{
              position: 'absolute',
              left: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              backgroundColor: 'rgba(0,0,0,0.6)',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '35px',
              height: '35px',
              cursor: 'pointer',
              fontSize: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ‹
          </button>
          
          <button
            type="button"
            onClick={nextImage}
            style={{
              position: 'absolute',
              right: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              backgroundColor: 'rgba(0,0,0,0.6)',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '35px',
              height: '35px',
              cursor: 'pointer',
              fontSize: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ›
          </button>
          
          <div style={{
            position: 'absolute',
            bottom: '15px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '6px'
          }}>
            {images.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setCurrentIndex(index)}
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  border: 'none',
                  backgroundColor: index === currentIndex ? 'white' : 'rgba(255,255,255,0.6)',
                  cursor: 'pointer'
                }}
              />
            ))}
          </div>
          
          <div style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            backgroundColor: 'rgba(0,0,0,0.6)',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '12px',
            fontSize: '12px'
          }}>
            {currentIndex + 1}/{images.length}
          </div>
        </>
      )}
    </div>
  );
};

const AdoptionForm = ({ pet, onClose, onSuccess }) => {
  const toast = useToast();
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
      toast.success('¡Postulación enviada exitosamente! Te contactaremos pronto.', 5000);
      onSuccess && onSuccess();
      onClose && onClose();
    } catch (err) {
      console.log(formData);
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
          <div className="pet-image-container">
            <PetImageCarousel images={pet.imageUrls || []} petName={pet.name} />
          </div>
          <div className="pet-details">
            <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>{pet.name}</h3>
            <p style={{ margin: '5px 0', color: '#666' }}><strong>Especie:</strong> {pet.species}</p>
            <p style={{ margin: '5px 0', color: '#666' }}><strong>Raza:</strong> {pet.breed || 'No especificada'}</p>
            <p style={{ margin: '5px 0', color: '#666' }}><strong>Edad:</strong> {pet.age} años</p>
            <p style={{ margin: '5px 0', color: '#666' }}><strong>Género:</strong> {pet.gender}</p>
            <p style={{ margin: '5px 0', color: '#666' }}><strong>Tamaño:</strong> {pet.size}</p>
            {pet.description && (
              <p style={{ margin: '10px 0', color: '#555', fontStyle: 'italic' }}>
                "{pet.description}"
              </p>
            )}
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
