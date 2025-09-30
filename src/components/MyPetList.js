import React, { useEffect, useState } from 'react';
import { petService } from '../services/petService';
import PetForm from './PetForm';

const MyPetsList = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showPetForm, setShowPetForm] = useState(false);
  const [petToEdit, setPetToEdit] = useState(null);

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    setLoading(true);
    try {
      const data = await petService.getMyPets();
      setPets(data);
    } catch (err) {
      setError('Error al cargar tus mascotas');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta mascota?')) {
      try {
        await petService.deletePet(id);
        setPets(prev => prev.filter(p => p.id !== id));
        alert('Mascota eliminada exitosamente');
      } catch (err) {
        console.error('Error al eliminar mascota:', err);
        alert('Error al eliminar la mascota');
      }
    }
  };

  if (loading) return <div style={{ textAlign: 'center' }}>Cargando mascotas...</div>;
  if (error) return <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
      <h2>Mis Mascotas Publicadas</h2>

      {/* Botón para agregar nueva mascota */}
      <button
        style={{ marginBottom: '20px' }}
        onClick={() => {
          setPetToEdit(null); // null = nueva mascota
          setShowPetForm(true);
        }}
      >
        Agregar Nueva Mascota
      </button>

      {pets.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#555' }}>Aún no has registrado mascotas.</p>
      ) : (
        <div>
          {pets.map(pet => (
            <div
              key={pet.id}
              style={{
                border: '1px solid #ccc',
                borderRadius: '8px',
                padding: '20px',
                marginBottom: '20px',
                backgroundColor: '#f8f9fa'
              }}
            >
              <h3 style={{ marginBottom: '10px' }}>{pet.name}</h3>
              <p><strong>Especie:</strong> {pet.species}</p>
              <p><strong>Raza:</strong> {pet.breed}</p>
              <p><strong>Edad:</strong> {pet.age} años</p>
              <p><strong>Género:</strong> {pet.gender}</p>
              <p><strong>Tamaño:</strong> {pet.size}</p>
              <p><strong>Descripción:</strong> {pet.description}</p>

              <div style={{ marginTop: '10px' }}>
                <button
                  onClick={() => {
                    setPetToEdit(pet);
                    setShowPetForm(true);
                  }}
                  style={{ marginRight: '10px' }}
                >
                  Editar
                </button>
                <button onClick={() => handleDelete(pet.id)} style={{ color: 'red' }}>
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal PetForm solo cuando showPetForm = true */}
      {showPetForm && (
        <PetForm
          pet={petToEdit}
          onClose={() => setShowPetForm(false)}
          onSuccess={() => {
            setShowPetForm(false);
            fetchPets();
          }}
        />
      )}
    </div>
  );
};

export default MyPetsList;
