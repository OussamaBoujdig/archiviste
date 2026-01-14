import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Upload, Eye, Download, Filter } from 'lucide-react'
import { mockDocuments, mockCategories } from '../data/mockData'

function Documents() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [showUploadModal, setShowUploadModal] = useState(false)

  const filteredDocuments = mockDocuments.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !categoryFilter || doc.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const handleView = (docId) => {
    navigate(`/documents/${docId}`)
  }

  const handleDownload = (doc) => {
    alert(`Téléchargement de "${doc.name}" en cours...`)
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Documents</h1>
        <p className="page-subtitle">Gérez et consultez vos archives numériques</p>
      </div>

      <div className="table-container">
        <div className="table-header">
          <div style={{ display: 'flex', gap: '1rem', flex: 1 }}>
            <div className="search-box">
              <Search size={18} />
              <input
                type="text"
                placeholder="Rechercher un document..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Filter size={18} color="var(--gray-400)" />
              <select
                className="form-select"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                style={{ width: 'auto', minWidth: '150px' }}
              >
                <option value="">Toutes catégories</option>
                {mockCategories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
          <button 
            className="btn btn-primary"
            onClick={() => setShowUploadModal(true)}
          >
            <Upload size={18} />
            Téléverser
          </button>
        </div>

        <table>
          <thead>
            <tr>
              <th>Nom du document</th>
              <th>Catégorie</th>
              <th>Date</th>
              <th>Taille</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDocuments.map((doc) => (
              <tr key={doc.id}>
                <td style={{ fontWeight: '500' }}>{doc.name}</td>
                <td>
                  <span className="badge badge-blue">{doc.category}</span>
                </td>
                <td>{new Date(doc.date).toLocaleDateString('fr-FR')}</td>
                <td>{doc.size}</td>
                <td>
                  <div className="actions-cell">
                    <button 
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleView(doc.id)}
                      title="Voir"
                    >
                      <Eye size={16} />
                      Voir
                    </button>
                    <button 
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleDownload(doc)}
                      title="Télécharger"
                    >
                      <Download size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredDocuments.length === 0 && (
          <div className="empty-state">
            <Search size={48} />
            <h3>Aucun document trouvé</h3>
            <p>Essayez de modifier vos critères de recherche</p>
          </div>
        )}
      </div>

      {showUploadModal && (
        <div className="modal-overlay" onClick={() => setShowUploadModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Téléverser un document</h2>
              <button 
                className="modal-close"
                onClick={() => setShowUploadModal(false)}
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Fichier</label>
                <div style={{
                  border: '2px dashed var(--gray-300)',
                  borderRadius: '0.5rem',
                  padding: '2rem',
                  textAlign: 'center',
                  cursor: 'pointer',
                  backgroundColor: 'var(--gray-50)'
                }}>
                  <Upload size={32} color="var(--gray-400)" />
                  <p style={{ marginTop: '0.5rem', color: 'var(--gray-600)' }}>
                    Cliquez ou glissez un fichier ici
                  </p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>
                    PDF, DOC, XLS jusqu'à 50 MB
                  </p>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Catégorie</label>
                <select className="form-select">
                  <option value="">Sélectionner une catégorie</option>
                  {mockCategories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Description (optionnel)</label>
                <textarea 
                  className="form-input" 
                  rows={3}
                  placeholder="Ajoutez une description..."
                />
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-secondary"
                onClick={() => setShowUploadModal(false)}
              >
                Annuler
              </button>
              <button 
                className="btn btn-primary"
                onClick={() => {
                  alert('Document téléversé avec succès !')
                  setShowUploadModal(false)
                }}
              >
                Téléverser
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Documents
