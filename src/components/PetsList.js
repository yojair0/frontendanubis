import React, { useState, useEffect } from 'react';
import { petService } from '../services/petService';
import AdoptionForm from './AdoptionForm';
import { useAuth } from '../contexts/AuthContext';

//HOME SCREEN ANIMALES

const ImageCarousel = ({ images, petName }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="pet-image-placeholder">
        <span>Sin imagen</span>
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
    <div className="image-carousel">
      <img 
        src={images[currentIndex]} 
        alt={`${petName} - ${currentIndex + 1}`}
        className="pet-image"
        onError={(e) => {
          e.target.src = '/placeholder-pet.jpg';
        }}
      />
      
      {images.length > 1 && (
        <>
          <button className="carousel-btn prev-btn" onClick={prevImage}>
            ‹
          </button>
          <button className="carousel-btn next-btn" onClick={nextImage}>
            ›
          </button>
          
          <div className="carousel-indicators">
            {images.map((_, index) => (
              <span
                key={index}
                className={`indicator ${index === currentIndex ? 'active' : ''}`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const PetsList = () => {
  const { user } = useAuth();
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPet, setSelectedPet] = useState(null);
  const [showAdoptionForm, setShowAdoptionForm] = useState(false);

  useEffect(() => {
    loadPets();
  }, []);

  const loadPets = async () => {
    try {
      setLoading(true);
      const petsData = await petService.getAllPets();
      setPets(petsData);
    } catch (err) {
      setError('Error al cargar las mascotas');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdoptClick = (pet) => {
    setSelectedPet(pet);
    setShowAdoptionForm(true);
  };

  const handleCloseForm = () => {
    setShowAdoptionForm(false);
    setSelectedPet(null);
  };

  const handleAdoptionSuccess = () => {
    // Recargar la lista de mascotas después de una postulación exitosa
    loadPets();
  };

  if (loading) return <div className="loading">Cargando mascotas...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="pets-container">
      <h2>Mascotas Disponibles para Adopción</h2>
      
      {pets.length === 0 ? (
        <p>No hay mascotas disponibles en este momento.</p>
      ) : (
        <div className="pets-grid">
          {pets.map(pet => (
            <div key={pet.id} className="pet-card">
              <ImageCarousel 
                images={pet.imageUrls || (pet.imageUrl ? [pet.imageUrl] : [])} 
                petName={pet.name} 
              />
              
              <div className="pet-info">
                <h3>{pet.name}</h3>
                <p><strong>Especie:</strong> {pet.species}</p>
                <p><strong>Raza:</strong> {pet.breed}</p>
                <p><strong>Edad:</strong> {pet.age} años</p>
                <p><strong>Género:</strong> {pet.gender}</p>
                <p><strong>Tamaño:</strong> {pet.size}</p>
                <p><strong>Descripción:</strong> {pet.description}</p>
                
                <div className="pet-status">
                  <span className={`status ${pet.status?.toLowerCase()}`}>
                    {pet.status === 'AVAILABLE' ? 'Disponible' : pet.status}
                  </span>
                </div>
                
                {pet.status === 'AVAILABLE' && user?.role === 'USER' && (
                  <button 
                    className="adopt-btn"
                    onClick={() => handleAdoptClick(pet)}
                  >
                    Postular para Adopción
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {showAdoptionForm && selectedPet && (
        <AdoptionForm
          pet={selectedPet}
          onClose={handleCloseForm}
          onSuccess={handleAdoptionSuccess}
        />
      )}
    </div>
  );
};

export default PetsList;
