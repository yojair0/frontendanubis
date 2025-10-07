import React, { useState, useEffect } from 'react';
import { petService } from '../services/petService';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from './Toast';

const ImageCarouselPreview = ({ images, onRemoveImage }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  return (
    <div style={{ marginTop: '20px' }}>
      <p style={{ fontSize: '14px', color: '#333', marginBottom: '10px' }}>
        Imágenes agregadas ({images.length}):
      </p>
      
      <div style={{ 
        position: 'relative', 
        width: '300px', 
        height: '200px', 
        margin: '0 auto',
        border: '2px solid #ddd',
        borderRadius: '12px',
        overflow: 'hidden',
        backgroundColor: '#f8f9fa'
      }}>
        <img
          src={images[currentIndex]}
          alt={`Imagen ${currentIndex + 1}`}
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover' 
          }}
          onError={(e) => {
            console.error('Error cargando imagen:', images[currentIndex]);
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
                background: 'rgba(0,0,0,0.7)',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '30px',
                height: '30px',
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
                background: 'rgba(0,0,0,0.7)',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '30px',
                height: '30px',
                cursor: 'pointer',
                fontSize: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ›
            </button>
          </>
        )}
        
        {/* Botón de eliminar */}
        <button
          type="button"
          onClick={() => onRemoveImage(currentIndex)}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '25px',
            height: '25px',
            cursor: 'pointer',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          ×
        </button>
        
        {/* Indicadores */}
        {images.length > 1 && (
          <div style={{
            position: 'absolute',
            bottom: '10px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '5px'
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
                  backgroundColor: index === currentIndex ? 'white' : 'rgba(255,255,255,0.5)',
                  cursor: 'pointer'
                }}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Thumbnails */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '8px', 
        marginTop: '10px',
        flexWrap: 'wrap'
      }}>
        {images.map((url, index) => (
          <img
            key={index}
            src={url}
            alt={`Thumbnail ${index + 1}`}
            onClick={() => setCurrentIndex(index)}
            style={{
              width: '50px',
              height: '50px',
              objectFit: 'cover',
              borderRadius: '6px',
              border: index === currentIndex ? '2px solid #007bff' : '1px solid #ddd',
              cursor: 'pointer'
            }}
            onError={(e) => {
              console.error('Error cargando thumbnail:', url);
              e.target.style.backgroundColor = '#f8f9fa';
            }}
          />
        ))}
      </div>
    </div>
  );
};

const PetForm = ({ pet, onClose, onSuccess }) => {
  const { user } = useAuth(); // Obtener usuario del contexto
  const toast = useToast();
  

  
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
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');


  // Prellenar datos si es edición
  useEffect(() => {
    if (pet) {
      // Las imágenes ya vienen como Base64 o URLs completas
      const fullImageUrls = pet.imageUrls || [];
      
      setFormData({
        name: pet.name || '',
        species: pet.species || '',
        breed: pet.breed || '',
        age: pet.age || '',
        gender: pet.gender || '',
        size: pet.size || '',
        description: pet.description || '',
        imageUrls: fullImageUrls
      });
    } else {
      // Reset si es nuevo
      setFormData({
        name: '',
        species: '',
        breed: '',
        age: '',
        gender: '',
        size: '',
        description: '',
        imageUrls: []
      });
    }
  }, [pet]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      // Validaciones
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!validTypes.includes(file.type)) {
        setError('Solo se permiten archivos JPG, PNG o GIF');
        return;
      }

      if (file.size > maxSize) {
        setError('El archivo no debe superar los 5MB');
        return;
      }

      setImageFile(file);
      setError('');

      // Crear preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async () => {
    if (!imageFile) return;

    setUploadingImage(true);
    setError('');

    try {
      // Convertir imagen a Base64 optimizado
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        console.log("Imagen convertida a Base64");
        
        setFormData(prev => ({
          ...prev,
          imageUrls: [...prev.imageUrls, base64String]
        }));
        
        // Limpiar estado después de convertir
        setImageFile(null);
        setImagePreview(null);
        
        // Limpiar el input file
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) fileInput.value = '';
        
        setUploadingImage(false);
      };
      
      reader.onerror = () => {
        setError("Error al procesar la imagen");
        setUploadingImage(false);
      };
      
      reader.readAsDataURL(imageFile);
      
    } catch (err) {
      console.error(err);
      setError("Error al procesar la imagen");
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, index) => index !== indexToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Debug: verificar token y usuario
      const token = localStorage.getItem('token');
      console.log('Token disponible:', !!token);
      console.log('👤 Usuario actual:', user);
      console.log('🎭 Rol del usuario:', user?.role);
      console.log('Datos del formulario:', formData);

      if (pet) {
        // Editar
        await petService.updatePet(pet.id, formData);
        toast.success('¡Mascota actualizada exitosamente!', 4000);
      } else {
        // Crear nueva
        console.log('🆕 Creando nueva mascota...');
        await petService.createPet(formData);
        toast.success('¡Mascota registrada exitosamente! Ya aparece en el listado.', 5000);
      }

      onSuccess && onSuccess();
      onClose && onClose();
    } catch (err) {
      console.error('Error completo:', err);
      console.error('Response:', err.response);
      console.error('Response data:', err.response?.data);
      console.error('Status:', err.response?.status);
      setError(err.response?.data?.message || 'Error al guardar la mascota');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{pet ? 'Editar Mascota' : 'Registrar Nueva Mascota'}</h2>
          <button onClick={onClose} className="close-btn">×</button>
        </div>

        <form onSubmit={handleSubmit} className="adoption-form">
          {error && <div className="error-message">{error}</div>}

          {/* Grid responsivo mejorado */}
          <div className="form-grid">
            <div className="form-group">
              <label>Nombre *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Nombre de la mascota"
              />
            </div>

            <div className="form-group">
              <label>Especie *</label>
              <input
                type="text"
                name="species"
                value={formData.species}
                onChange={handleInputChange}
                placeholder="Ejemplo: Perro, Gato, Conejo, etc."
                required
              />
            </div>

            <div className="form-group">
              <label>Raza (Opcional)</label>
              <input
                type="text"
                name="breed"
                value={formData.breed}
                onChange={handleInputChange}
                placeholder="Ejemplo: Labrador, Mestizo, Persa, etc."
              />
            </div>

            <div className="form-group">
              <label>Edad *</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                required
                min="0"
                max="30"
                placeholder="Años"
              />
            </div>

            <div className="form-group">
              <label>Género *</label>
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
              <label>Tamaño *</label>
              <select
                name="size"
                value={formData.size}
                onChange={handleInputChange}
                required
              >
                <option value="">Selecciona</option>
                <option value="Pequeño">Pequeño (menos de 10kg)</option>
                <option value="Mediano">Mediano (10-25kg)</option>
                <option value="Grande">Grande (más de 25kg)</option>
              </select>
            </div>
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
            <label>Subir imagen de la mascota</label>
            
            <div className="image-upload-container" style={{ border: '2px dashed #ddd', borderRadius: '8px', padding: '20px', textAlign: 'center' }}>
              <input
                type="file"
                onChange={handleImageChange}
                accept="image/jpeg,image/jpg,image/png,image/gif"
                style={{ marginBottom: '10px' }}
              />
              
              {imagePreview && (
                <div style={{ margin: '15px 0' }}>
                  <p style={{ fontSize: '14px', color: '#666', margin: '5px 0' }}>Vista previa:</p>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{ 
                      width: '150px', 
                      height: '150px', 
                      objectFit: 'cover', 
                      borderRadius: '8px',
                      border: '1px solid #ddd'
                    }}
                  />
                </div>
              )}
              
              <button
                type="button"
                onClick={handleImageUpload}
                disabled={!imageFile || uploadingImage}
                className="btn-secondary"
                style={{ 
                  marginTop: '10px',
                  opacity: (!imageFile || uploadingImage) ? 0.6 : 1
                }}
              >
                {uploadingImage ? 'Subiendo...' : 'Agregar Imagen'}
              </button>
            </div>

            {formData.imageUrls.length > 0 && (
              <ImageCarouselPreview 
                images={formData.imageUrls} 
                onRemoveImage={handleRemoveImage} 
              />
            )}
            
            <p style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
              Formatos permitidos: JPG, PNG, GIF. Tamaño máximo: 5MB
            </p>
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
              {loading ? 'Guardando...' : pet ? 'Guardar Cambios' : 'Registrar Mascota'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PetForm;
