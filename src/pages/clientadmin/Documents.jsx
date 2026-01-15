import { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  FileText, Search, Upload, Download, Eye, Edit, Trash2, Filter,
  CheckCircle, Clock, X, FolderOpen, Tag, Calendar
} from 'lucide-react'
import { mockDocuments, mockFolders, DOCUMENT_TYPES, USER_ROLES, PERMISSIONS } from '../../data/mockData'

function DocumentsPage({ user }) {
  const [documents, setDocuments] = useState(mockDocuments)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterFolder, setFilterFolder] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showUploadModal, setShowUploadModal] = useState(false)

  const canUpload = user?.permissions?.includes(PERMISSIONS.UPLOAD) || user?.role === USER_ROLES.CLIENT_ADMIN
  const canEdit = user?.permissions?.includes(PERMISSIONS.EDIT_METADATA) || user?.role === USER_ROLES.CLIENT_ADMIN
  const canDelete = user?.permissions?.includes(PERMISSIONS.DELETE) || user?.role === USER_ROLES.CLIENT_ADMIN
  const canExport = user?.permissions?.includes(PERMISSIONS.EXPORT) || user?.role === USER_ROLES.CLIENT_ADMIN
  const isReadOnly = user?.role === USER_ROLES.READ_ONLY

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          doc.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesType = filterType === 'all' || doc.type === filterType
    const matchesFolder = filterFolder === 'all' || doc.folderId === filterFolder
    const matchesStatus = filterStatus === 'all' || doc.status === filterStatus
    
    // Check folder access for limited users
    if (user?.folderAccess && user.folderAccess.length > 0) {
      if (!user.folderAccess.includes(doc.folderId)) return false
    }
    
    return matchesSearch && matchesType && matchesFolder && matchesStatus
  })

  const getTypeBadge = (typeId) => {
    const type = DOCUMENT_TYPES.find(t => t.id === typeId)
    return (
      <span className="badge" style={{ backgroundColor: `${type?.color}15`, color: type?.color }}>
        {type?.label || typeId}
      </span>
    )
  }

  const getStatusBadge = (status) => {
    if (status === 'validated') {
      return <span className="badge badge-green"><CheckCircle size={12} /> Validé</span>
    }
    return <span className="badge badge-orange"><Clock size={12} /> En attente</span>
  }

  const getFolderName = (folderId) => {
    const folder = mockFolders.find(f => f.id === folderId)
    return folder?.name || folderId
  }

  const handleDelete = (docId) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) {
      setDocuments(documents.filter(d => d.id !== docId))
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Documents</h1>
          <p className="page-subtitle">
            {filteredDocuments.length} document(s) trouvé(s)
            {isReadOnly && <span className="badge badge-orange" style={{ marginLeft: '0.5rem' }}>Lecture seule</span>}
          </p>
        </div>
        {canUpload && (
          <button className="btn btn-primary" onClick={() => setShowUploadModal(true)}>
            <Upload size={18} />
            Nouveau document
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div className="search-box" style={{ flex: 1, minWidth: '250px' }}>
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Rechercher par nom, référence ou tag..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select 
            value={filterType} 
            onChange={(e) => setFilterType(e.target.value)}
            style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid var(--gray-200)' }}
          >
            <option value="all">Tous les types</option>
            {DOCUMENT_TYPES.map(type => (
              <option key={type.id} value={type.id}>{type.label}</option>
            ))}
          </select>

          <select 
            value={filterFolder} 
            onChange={(e) => setFilterFolder(e.target.value)}
            style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid var(--gray-200)' }}
          >
            <option value="all">Tous les dossiers</option>
            {mockFolders.filter(f => !user?.folderAccess || user.folderAccess.includes(f.id)).map(folder => (
              <option key={folder.id} value={folder.id}>{folder.name}</option>
            ))}
          </select>

          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid var(--gray-200)' }}
          >
            <option value="all">Tous les statuts</option>
            <option value="validated">Validé</option>
            <option value="pending">En attente</option>
          </select>
        </div>
      </div>

      {/* Documents Table */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Document</th>
              <th>Type</th>
              <th>Dossier</th>
              <th>Référence</th>
              <th>Date</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDocuments.map((doc) => (
              <tr key={doc.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '0.5rem',
                      backgroundColor: '#fee2e2',
                      color: '#dc2626',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <FileText size={20} />
                    </div>
                    <div>
                      <div style={{ fontWeight: '500' }}>{doc.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>
                        {doc.size} • v{doc.version}
                      </div>
                    </div>
                  </div>
                </td>
                <td>{getTypeBadge(doc.type)}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                    <FolderOpen size={14} color="var(--gray-400)" />
                    {getFolderName(doc.folderId)}
                  </div>
                </td>
                <td style={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>{doc.reference}</td>
                <td style={{ fontSize: '0.875rem' }}>{new Date(doc.date).toLocaleDateString('fr-FR')}</td>
                <td>{getStatusBadge(doc.status)}</td>
                <td>
                  <div className="actions-cell">
                    <Link to={`/documents/${doc.id}`} className="btn btn-secondary btn-sm">
                      <Eye size={16} />
                    </Link>
                    {canExport && (
                      <button className="btn btn-secondary btn-sm" onClick={() => alert(`Téléchargement de ${doc.name}`)}>
                        <Download size={16} />
                      </button>
                    )}
                    {canEdit && (
                      <button className="btn btn-secondary btn-sm">
                        <Edit size={16} />
                      </button>
                    )}
                    {canDelete && (
                      <button className="btn btn-secondary btn-sm" onClick={() => handleDelete(doc.id)}>
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredDocuments.length === 0 && (
          <div className="empty-state">
            <FileText size={48} />
            <h3>Aucun document trouvé</h3>
            <p>Modifiez vos critères de recherche ou uploadez un nouveau document</p>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="modal-overlay" onClick={() => setShowUploadModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Nouveau document</h2>
              <button className="modal-close" onClick={() => setShowUploadModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Fichier PDF</label>
                <div style={{
                  border: '2px dashed var(--gray-300)',
                  borderRadius: '0.75rem',
                  padding: '2rem',
                  textAlign: 'center',
                  cursor: 'pointer'
                }}>
                  <Upload size={32} color="var(--gray-400)" />
                  <p style={{ marginTop: '0.5rem', color: 'var(--gray-500)' }}>
                    Glissez un fichier ou cliquez pour sélectionner
                  </p>
                  <input type="file" accept=".pdf" style={{ display: 'none' }} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Type de document</label>
                  <select>
                    {DOCUMENT_TYPES.map(type => (
                      <option key={type.id} value={type.id}>{type.label}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Dossier</label>
                  <select>
                    {mockFolders.map(folder => (
                      <option key={folder.id} value={folder.id}>{folder.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Référence</label>
                <input type="text" placeholder="Ex: FAC-2024-001" />
              </div>
              <div className="form-group">
                <label>Date du document</label>
                <input type="date" />
              </div>
              <div className="form-group">
                <label>Tags (séparés par des virgules)</label>
                <input type="text" placeholder="facture, fournisseur, 2024" />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowUploadModal(false)}>Annuler</button>
              <button className="btn btn-primary" onClick={() => setShowUploadModal(false)}>
                <Upload size={18} />
                Uploader
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DocumentsPage
