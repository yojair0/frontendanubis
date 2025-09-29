import React, { useState, useEffect } from 'react';
import { petService } from '../services/petService';
import AdoptionForm from './AdoptionForm';

//HOME SCREEN ANIMALES

const PetsList = () => {
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
              <img 
                src={pet.imageUrl} 
                alt={pet.name}
                className="pet-image"
                onError={(e) => {
                  e.target.src = '/placeholder-pet.jpg'; // imagen por defecto
                }}
              />
              <div className="pet-info">
                <h3>{pet.name}</h3>
                <p><strong>Especie:</strong> {pet.species}</p>
                <p><strong>Raza:</strong> {pet.breed}</p>
                <p><strong>Edad:</strong> {pet.age} años</p>
                <p><strong>Descripción:</strong> {pet.description}</p>
                <span className={`status ${pet.status.toLowerCase()}`}>
                  {pet.status === 'AVAILABLE' ? 'Disponible' : pet.status}
                </span>
                
                {pet.status === 'AVAILABLE' && (
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
