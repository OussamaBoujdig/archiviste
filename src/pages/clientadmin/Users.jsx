import { useState } from 'react'
import { 
  Users, Plus, Edit, Trash2, Shield, User, FileSearch, X,
  CheckCircle, XCircle, Clock, Mail, Calendar
} from 'lucide-react'
import { mockUsers, USER_ROLES, PERMISSIONS, mockFolders } from '../../data/mockData'

function UsersManagement({ user }) {
  const companyUsers = mockUsers.filter(u => u.companyId === user?.companyId)
  const [users, setUsers] = useState(companyUsers)
  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)

  const getRoleBadge = (role) => {
    const config = {
      [USER_ROLES.CLIENT_ADMIN]: { label: 'Admin', color: '#2563eb', icon: Shield },
      [USER_ROLES.CLIENT_USER]: { label: 'Utilisateur', color: '#16a34a', icon: User },
      [USER_ROLES.READ_ONLY]: { label: 'Lecture seule', color: '#d97706', icon: FileSearch }
    }
    const c = config[role] || { label: role, color: '#64748b', icon: User }
    return (
      <span className="badge" style={{ backgroundColor: `${c.color}15`, color: c.color, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
        <c.icon size={12} />
        {c.label}
      </span>
    )
  }

  const getStatusBadge = (status) => {
    if (status === 'active') {
      return <span className="badge badge-green"><CheckCircle size={12} /> Actif</span>
    }
    return <span className="badge badge-gray"><XCircle size={12} /> Inactif</span>
  }

  const handleEdit = (u) => {
    setEditingUser(u)
    setShowModal(true)
  }

  const handleDelete = (userId) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      setUsers(users.filter(u => u.id !== userId))
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Utilisateurs</h1>
          <p className="page-subtitle">Gérez les utilisateurs et leurs permissions</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setEditingUser(null); setShowModal(true); }}>
          <Plus size={18} />
          Nouvel utilisateur
        </button>
      </div>

      {/* Stats */}
      <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
        <div className="stat-card">
          <div className="stat-icon blue"><Users size={24} /></div>
          <div className="stat-content">
            <h3>Total utilisateurs</h3>
            <div className="stat-value">{users.length}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple"><Shield size={24} /></div>
          <div className="stat-content">
            <h3>Admins</h3>
            <div className="stat-value">{users.filter(u => u.role === USER_ROLES.CLIENT_ADMIN).length}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green"><User size={24} /></div>
          <div className="stat-content">
            <h3>Utilisateurs</h3>
            <div className="stat-value">{users.filter(u => u.role === USER_ROLES.CLIENT_USER).length}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon orange"><FileSearch size={24} /></div>
          <div className="stat-content">
            <h3>Lecture seule</h3>
            <div className="stat-value">{users.filter(u => u.role === USER_ROLES.READ_ONLY).length}</div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Utilisateur</th>
              <th>Rôle</th>
              <th>Permissions</th>
              <th>Accès dossiers</th>
              <th>Dernière connexion</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: '#e0e7ff',
                      color: '#4f46e5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '600'
                    }}>
                      {u.avatar}
                    </div>
                    <div>
                      <div style={{ fontWeight: '500' }}>{u.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Mail size={12} /> {u.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td>{getRoleBadge(u.role)}</td>
                <td>
                  <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                    {u.permissions?.slice(0, 3).map(p => (
                      <span key={p} className="badge badge-gray" style={{ fontSize: '0.6875rem' }}>
                        {p === 'read' ? 'Lire' : p === 'upload' ? 'Upload' : p === 'edit_metadata' ? 'Éditer' : p === 'delete' ? 'Suppr.' : 'Export'}
                      </span>
                    ))}
                    {u.permissions?.length > 3 && (
                      <span className="badge badge-gray" style={{ fontSize: '0.6875rem' }}>+{u.permissions.length - 3}</span>
                    )}
                  </div>
                </td>
                <td>
                  {u.folderAccess ? (
                    <span style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>
                      {u.folderAccess.length} dossier(s)
                    </span>
                  ) : (
                    <span className="badge badge-blue">Tous</span>
                  )}
                </td>
                <td style={{ fontSize: '0.875rem', color: 'var(--gray-500)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Clock size={12} />
                    {u.lastLogin}
                  </div>
                </td>
                <td>{getStatusBadge(u.status)}</td>
                <td>
                  <div className="actions-cell">
                    <button className="btn btn-secondary btn-sm" onClick={() => handleEdit(u)}>
                      <Edit size={16} />
                    </button>
                    {u.role !== USER_ROLES.CLIENT_ADMIN && (
                      <button className="btn btn-secondary btn-sm" onClick={() => handleDelete(u.id)}>
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <h2 className="modal-title">
                {editingUser ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur'}
              </h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label>Nom complet</label>
                  <input type="text" defaultValue={editingUser?.name} placeholder="Nom complet" />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" defaultValue={editingUser?.email} placeholder="email@entreprise.ma" />
                </div>
              </div>
              
              <div className="form-group">
                <label>Rôle</label>
                <select defaultValue={editingUser?.role || USER_ROLES.CLIENT_USER}>
                  <option value={USER_ROLES.CLIENT_ADMIN}>Admin</option>
                  <option value={USER_ROLES.CLIENT_USER}>Utilisateur</option>
                  <option value={USER_ROLES.READ_ONLY}>Lecture seule (Auditeur)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Permissions</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                  {Object.values(PERMISSIONS).map(p => (
                    <label key={p} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                      <input 
                        type="checkbox" 
                        defaultChecked={editingUser?.permissions?.includes(p)}
                      />
                      <span style={{ fontSize: '0.875rem' }}>
                        {p === 'read' ? 'Lire' : p === 'upload' ? 'Uploader' : p === 'edit_metadata' ? 'Éditer métadonnées' : p === 'delete' ? 'Supprimer' : 'Exporter'}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Accès aux dossiers</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {mockFolders.filter(f => !f.parentId).map(folder => (
                    <label key={folder.id} style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.5rem', 
                      padding: '0.5rem 0.75rem',
                      backgroundColor: 'var(--gray-50)',
                      borderRadius: '0.5rem',
                      cursor: 'pointer'
                    }}>
                      <input 
                        type="checkbox" 
                        defaultChecked={!editingUser?.folderAccess || editingUser.folderAccess.includes(folder.id)}
                      />
                      <span style={{ fontSize: '0.875rem' }}>{folder.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {editingUser?.role === USER_ROLES.READ_ONLY && (
                <div className="form-group">
                  <label>Date d'expiration de l'accès</label>
                  <input type="date" defaultValue={editingUser?.expiresAt} />
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Annuler</button>
              <button className="btn btn-primary" onClick={() => setShowModal(false)}>
                {editingUser ? 'Enregistrer' : 'Créer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UsersManagement
