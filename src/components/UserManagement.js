import React, { useState, useEffect } from 'react';
import { userService } from '../services/userService';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('ALL');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'create', 'edit', 'delete'
  const [selectedUser, setSelectedUser] = useState(null);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    role: 'USER'
  });

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, filterRole]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (err) {
      setError('Error al cargar usuarios');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterRole !== 'ALL') {
      filtered = filtered.filter(user => user.role === filterRole);
    }

    setFilteredUsers(filtered);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const openCreateModal = () => {
    setFormData({
      fullName: '',
      email: '',
      password: '',
      phone: '',
      role: 'USER'
    });
    setModalType('create');
    setShowModal(true);
  };

  const openEditModal = (user) => {
    setFormData({
      fullName: user.fullName || '',
      email: user.email || '',
      password: '', // No mostrar contraseña existente
      phone: user.phone || '',
      role: user.role || 'USER'
    });
    setSelectedUser(user);
    setModalType('edit');
    setShowModal(true);
  };

  const openDeleteModal = (user) => {
    setSelectedUser(user);
    setModalType('delete');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (modalType === 'create') {
        await userService.createUser(formData);
        alert('Usuario creado exitosamente');
      } else if (modalType === 'edit') {
        const updateData = { ...formData };
        if (!updateData.password) {
          delete updateData.password; // No enviar contraseña vacía
        }
        await userService.updateUser(selectedUser.id, updateData);
        alert('Usuario actualizado exitosamente');
      }
      
      setShowModal(false);
      loadUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al procesar la solicitud');
    }
  };

  const handleDelete = async () => {
    try {
      await userService.deleteUser(selectedUser.id);
      alert('Usuario eliminado exitosamente');
      setShowModal(false);
      loadUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al eliminar usuario');
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'USER': return 'Usuario';
      case 'FOUNDATION': return 'Fundación';
      case 'ADMIN': return 'Administrador';
      default: return role;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'USER': return '#007bff';
      case 'FOUNDATION': return '#28a745';
      case 'ADMIN': return '#dc3545';
      default: return '#6c757d';
    }
  };

  if (loading) return <div className="loading">Cargando usuarios...</div>;

  return (
    <div className="user-management-container">
      <div className="header-section">
        <h2>Gestión de Usuarios y Fundaciones</h2>
        
        <div className="controls-section">
          <div className="search-filters">
            <input
              type="text"
              placeholder="Buscar por nombre o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="filter-select"
            >
              <option value="ALL">Todos los roles</option>
              <option value="USER">Usuarios</option>
              <option value="FOUNDATION">Fundaciones</option>
              <option value="ADMIN">Administradores</option>
            </select>
          </div>
          
          <button onClick={openCreateModal} className="btn-primary">
            + Crear Usuario
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="users-stats">
        <div className="stat-card">
          <h3>{users.filter(u => u.role === 'USER').length}</h3>
          <p>Usuarios</p>
        </div>
        <div className="stat-card">
          <h3>{users.filter(u => u.role === 'FOUNDATION').length}</h3>
          <p>Fundaciones</p>
        </div>
        <div className="stat-card">
          <h3>{users.filter(u => u.role === 'ADMIN').length}</h3>
          <p>Administradores</p>
        </div>
      </div>

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id}>
                <td>{user.fullName}</td>
                <td>{user.email}</td>
                <td>{user.phone || 'N/A'}</td>
                <td>
                  <span 
                    className="role-badge"
                    style={{ 
                      backgroundColor: getRoleColor(user.role),
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}
                  >
                    {getRoleLabel(user.role)}
                  </span>
                </td>
                <td>
                  <span 
                    className={`status-badge ${user.emailVerified ? 'verified' : 'pending'}`}
                  >
                    {user.emailVerified ? 'Verificado' : 'Pendiente'}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button 
                      onClick={() => openEditModal(user)}
                      className="btn-edit"
                    >
                      Editar
                    </button>
                    <button 
                      onClick={() => openDeleteModal(user)}
                      className="btn-delete"
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredUsers.length === 0 && (
          <div className="no-results">
            <p>No se encontraron usuarios con los filtros aplicados.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                {modalType === 'create' && 'Crear Nuevo Usuario'}
                {modalType === 'edit' && 'Editar Usuario'}
                {modalType === 'delete' && 'Confirmar Eliminación'}
              </h3>
              <button onClick={() => setShowModal(false)} className="close-btn">×</button>
            </div>

            <div className="modal-body">
              {modalType === 'delete' ? (
                <div>
                  <p>¿Estás seguro de que deseas eliminar al usuario <strong>{selectedUser?.fullName}</strong>?</p>
                  <p style={{ color: '#dc3545', fontSize: '14px' }}>
                    Esta acción no se puede deshacer.
                  </p>
                  
                  <div className="form-actions">
                    <button onClick={() => setShowModal(false)} className="btn-secondary">
                      Cancelar
                    </button>
                    <button onClick={handleDelete} className="btn-danger">
                      Eliminar Usuario
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>Nombre Completo</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      Contraseña {modalType === 'edit' && '(dejar vacío para mantener actual)'}
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required={modalType === 'create'}
                      placeholder={modalType === 'edit' ? 'Nueva contraseña (opcional)' : ''}
                    />
                  </div>

                  <div className="form-group">
                    <label>Teléfono</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Rol</label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="USER">Usuario</option>
                      <option value="FOUNDATION">Fundación</option>
                      <option value="ADMIN">Administrador</option>
                    </select>
                  </div>

                  <div className="form-actions">
                    <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">
                      Cancelar
                    </button>
                    <button type="submit" className="btn-primary">
                      {modalType === 'create' ? 'Crear Usuario' : 'Guardar Cambios'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;