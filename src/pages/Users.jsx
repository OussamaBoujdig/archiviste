import { useState } from 'react'
import { UserPlus, Edit, Trash2, Shield, User } from 'lucide-react'
import { mockUsers } from '../data/mockData'

function Users() {
  const [users, setUsers] = useState(mockUsers)
  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Utilisateur'
  })

  const openAddModal = () => {
    setEditingUser(null)
    setFormData({ name: '', email: '', role: 'Utilisateur' })
    setShowModal(true)
  }

  const openEditModal = (user) => {
    setEditingUser(user)
    setFormData({ name: user.name, email: user.email, role: user.role })
    setShowModal(true)
  }

  const handleSubmit = () => {
    if (!formData.name || !formData.email) {
      alert('Veuillez remplir tous les champs obligatoires')
      return
    }

    if (editingUser) {
      setUsers(users.map((u) => 
        u.id === editingUser.id 
          ? { ...u, ...formData }
          : u
      ))
      alert('Utilisateur modifié avec succès')
    } else {
      const newUser = {
        id: Date.now(),
        ...formData,
        lastLogin: 'Jamais'
      }
      setUsers([...users, newUser])
      alert('Utilisateur ajouté avec succès')
    }
    setShowModal(false)
  }

  const handleDelete = (user) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer ${user.name} ?`)) {
      setUsers(users.filter((u) => u.id !== user.id))
      alert('Utilisateur supprimé')
    }
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Utilisateurs</h1>
        <p className="page-subtitle">Gérez les accès et les permissions</p>
      </div>

      <div className="table-container">
        <div className="table-header">
          <div>
            <span style={{ color: 'var(--gray-600)' }}>
              {users.length} utilisateur{users.length > 1 ? 's' : ''}
            </span>
          </div>
          <button className="btn btn-primary" onClick={openAddModal}>
            <UserPlus size={18} />
            Ajouter un utilisateur
          </button>
        </div>

        <table>
          <thead>
            <tr>
              <th>Utilisateur</th>
              <th>E-mail</th>
              <th>Rôle</th>
              <th>Dernière connexion</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: user.role === 'Admin' ? 'var(--primary)' : 'var(--gray-400)',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '600',
                      fontSize: '0.875rem'
                    }}>
                      {user.name.charAt(0)}
                    </div>
                    <span style={{ fontWeight: '500' }}>{user.name}</span>
                  </div>
                </td>
                <td>{user.email}</td>
                <td>
                  <span className={`badge ${user.role === 'Admin' ? 'badge-blue' : 'badge-gray'}`}>
                    {user.role === 'Admin' && <Shield size={12} style={{ marginRight: '4px' }} />}
                    {user.role === 'Utilisateur' && <User size={12} style={{ marginRight: '4px' }} />}
                    {user.role}
                  </span>
                </td>
                <td>{user.lastLogin}</td>
                <td>
                  <div className="actions-cell">
                    <button 
                      className="btn btn-secondary btn-sm"
                      onClick={() => openEditModal(user)}
                      title="Modifier"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleDelete(user)}
                      title="Supprimer"
                      style={{ color: 'var(--danger)' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {editingUser ? 'Modifier l\'utilisateur' : 'Ajouter un utilisateur'}
              </h2>
              <button 
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Nom complet *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Jean Dupont"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Adresse e-mail *</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="jean.dupont@entreprise.fr"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Rôle</label>
                <select
                  className="form-select"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  <option value="Utilisateur">Utilisateur</option>
                  <option value="Admin">Administrateur</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-secondary"
                onClick={() => setShowModal(false)}
              >
                Annuler
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleSubmit}
              >
                {editingUser ? 'Enregistrer' : 'Ajouter'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Users
