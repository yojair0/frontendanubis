import React, { useState } from 'react';
import { petService } from '../services/petService';

const PetForm = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    species: '',
    breed: '',
    age: '',
    gender: '',
    size: '',
    description: '',
    imageUrls: []
  });

  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleImageUpload = async () => {
    if (!imageFile) return;

    try {
      const { imageUrl } = await petService.uploadPetImage(imageFile);
      setFormData(prev => ({
        ...prev,
        imageUrls: [...prev.imageUrls, imageUrl]
      }));
      setImageFile(null);
    } catch (err) {
      console.error(err);
      alert("Error al subir la imagen");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await petService.createPet(formData);
      alert('Mascota registrada exitosamente');
      onSuccess && onSuccess();
      onClose && onClose();
    } catch (err) {
      console.log(formData);
      setError(err.response?.data?.message || 'Error al registrar la mascota');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Registrar Nueva Mascota</h2>
          <button onClick={onClose} className="close-btn">×</button>
        </div>

        <form onSubmit={handleSubmit} className="adoption-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label>Nombre</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Especie</label>
            <input
              type="text"
              name="species"
              value={formData.species}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Raza</label>
            <input
              type="text"
              name="breed"
              value={formData.breed}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label>Edad</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              required
              min="0"
            />
          </div>

          <div className="form-group">
            <label>Género</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              required
            >
              <option value="">Selecciona</option>
              <option value="Macho">Macho</option>
              <option value="Hembra">Hembra</option>
            </select>
          </div>

          <div className="form-group">
            <label>Tamaño</label>
            <select
              name="size"
              value={formData.size}
              onChange={handleInputChange}
              required
            >
              <option value="">Selecciona</option>
              <option value="Pequeño">Pequeño</option>
              <option value="Mediano">Mediano</option>
              <option value="Grande">Grande</option>
            </select>
          </div>

          <div className="form-group">
            <label>Descripción</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows="3"
              placeholder="Descripción de la mascota, carácter, cuidados, etc."
            />
          </div>

          <div className="form-group">
            <label>Subir imagen</label>
            <input
              type="file"
              onChange={handleImageChange}
              accept="image/*"
            />
            <button
              type="button"
              onClick={handleImageUpload}
              disabled={!imageFile}
              className="btn-secondary"
              style={{ marginTop: '10px' }}
            >
              Subir Imagen
            </button>

            {formData.imageUrls.length > 0 && (
              <div style={{ marginTop: '15px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {formData.imageUrls.map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    alt="preview"
                    style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '5px' }}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || formData.imageUrls.length === 0}
              className="btn-primary"
            >
              {loading ? 'Registrando...' : 'Registrar Mascota'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PetForm;
