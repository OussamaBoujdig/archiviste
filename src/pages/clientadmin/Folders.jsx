import { useState } from 'react'
import { 
  FolderOpen, Plus, Edit, Trash2, FileText, ChevronRight, X, Search
} from 'lucide-react'
import { mockFolders, mockDocuments, USER_ROLES } from '../../data/mockData'

function FoldersPage({ user }) {
  const [folders, setFolders] = useState(mockFolders)
  const [showModal, setShowModal] = useState(false)
  const [editingFolder, setEditingFolder] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  const isAdmin = user?.role === USER_ROLES.CLIENT_ADMIN
  const isReadOnly = user?.role === USER_ROLES.READ_ONLY

  // Filter folders based on user access
  const accessibleFolders = folders.filter(f => {
    if (isAdmin) return true
    if (user?.folderAccess && user.folderAccess.length > 0) {
      return user.folderAccess.includes(f.id)
    }
    return true
  })

  const filteredFolders = accessibleFolders.filter(f => 
    f.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Get root folders (no parent)
  const rootFolders = filteredFolders.filter(f => !f.parentId)

  // Get subfolders for a parent
  const getSubfolders = (parentId) => filteredFolders.filter(f => f.parentId === parentId)

  // Get document count for folder
  const getDocCount = (folderId) => mockDocuments.filter(d => d.folderId === folderId).length

  const handleEdit = (folder) => {
    setEditingFolder(folder)
    setShowModal(true)
  }

  const handleDelete = (folderId) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce dossier ?')) {
      setFolders(folders.filter(f => f.id !== folderId))
    }
  }

  const FolderCard = ({ folder, isSubfolder = false }) => {
    const subfolders = getSubfolders(folder.id)
    const docCount = getDocCount(folder.id)

    return (
      <div style={{ marginLeft: isSubfolder ? '1.5rem' : 0 }}>
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            padding: '1rem',
            backgroundColor: 'white',
            border: '1px solid var(--gray-200)',
            borderRadius: '0.75rem',
            marginBottom: '0.75rem',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.borderColor = folder.color}
          onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--gray-200)'}
        >
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '0.75rem',
            backgroundColor: `${folder.color}15`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <FolderOpen size={24} color={folder.color} />
          </div>
          
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{folder.name}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <FileText size={12} /> {docCount} documents
              </span>
              {subfolders.length > 0 && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <FolderOpen size={12} /> {subfolders.length} sous-dossiers
                </span>
              )}
            </div>
          </div>

          {isAdmin && !isReadOnly && (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn btn-secondary btn-sm" onClick={() => handleEdit(folder)}>
                <Edit size={16} />
              </button>
              <button className="btn btn-secondary btn-sm" onClick={() => handleDelete(folder.id)}>
                <Trash2 size={16} />
              </button>
            </div>
          )}

          <ChevronRight size={20} color="var(--gray-400)" />
        </div>

        {/* Subfolders */}
        {subfolders.map(sub => (
          <FolderCard key={sub.id} folder={sub} isSubfolder />
        ))}
      </div>
    )
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dossiers</h1>
          <p className="page-subtitle">
            {accessibleFolders.length} dossier(s) accessible(s)
            {isReadOnly && <span className="badge badge-orange" style={{ marginLeft: '0.5rem' }}>Lecture seule</span>}
          </p>
        </div>
        {isAdmin && (
          <button className="btn btn-primary" onClick={() => { setEditingFolder(null); setShowModal(true); }}>
            <Plus size={18} />
            Nouveau dossier
          </button>
        )}
      </div>

      {/* Search */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="search-box">
          <Search size={18} />
          <input 
            type="text" 
            placeholder="Rechercher un dossier..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Folders Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '1rem' }}>
        {rootFolders.map(folder => (
          <FolderCard key={folder.id} folder={folder} />
        ))}
      </div>

      {filteredFolders.length === 0 && (
        <div className="empty-state">
          <FolderOpen size={48} />
          <h3>Aucun dossier trouvé</h3>
          <p>Créez un nouveau dossier pour organiser vos documents</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {editingFolder ? 'Modifier le dossier' : 'Nouveau dossier'}
              </h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Nom du dossier</label>
                <input type="text" defaultValue={editingFolder?.name} placeholder="Nom du dossier" />
              </div>
              <div className="form-group">
                <label>Dossier parent (optionnel)</label>
                <select defaultValue={editingFolder?.parentId || ''}>
                  <option value="">Aucun (dossier racine)</option>
                  {folders.filter(f => !f.parentId).map(folder => (
                    <option key={folder.id} value={folder.id}>{folder.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Couleur</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {['#2563eb', '#16a34a', '#9333ea', '#d97706', '#dc2626', '#0891b2'].map(color => (
                    <button
                      key={color}
                      type="button"
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: color,
                        border: editingFolder?.color === color ? '3px solid var(--gray-900)' : 'none',
                        cursor: 'pointer'
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Annuler</button>
              <button className="btn btn-primary" onClick={() => setShowModal(false)}>
                {editingFolder ? 'Enregistrer' : 'Créer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FoldersPage
