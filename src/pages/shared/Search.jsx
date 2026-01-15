import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Search, FileText, FolderOpen, Calendar, Tag, Filter,
  Eye, Download, Clock, CheckCircle, X
} from 'lucide-react'
import { mockDocuments, mockFolders, DOCUMENT_TYPES, USER_ROLES, PERMISSIONS } from '../../data/mockData'

function SearchPage({ user }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [results, setResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [filters, setFilters] = useState({
    type: 'all',
    folder: 'all',
    dateFrom: '',
    dateTo: ''
  })
  const [showFilters, setShowFilters] = useState(false)

  const canExport = user?.permissions?.includes(PERMISSIONS.EXPORT) || user?.role === USER_ROLES.CLIENT_ADMIN

  // Filter documents based on user access
  const accessibleDocuments = mockDocuments.filter(doc => {
    if (user?.role === USER_ROLES.CLIENT_ADMIN) return true
    if (user?.folderAccess && user.folderAccess.length > 0) {
      return user.folderAccess.includes(doc.folderId)
    }
    return true
  })

  // Search function
  const performSearch = () => {
    if (!searchTerm.trim() && filters.type === 'all' && filters.folder === 'all' && !filters.dateFrom && !filters.dateTo) {
      setResults([])
      return
    }

    setIsSearching(true)

    // Simulate search delay for UX
    setTimeout(() => {
      const filtered = accessibleDocuments.filter(doc => {
        // Text search
        const matchesText = !searchTerm.trim() || 
          doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doc.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))

        // Type filter
        const matchesType = filters.type === 'all' || doc.type === filters.type

        // Folder filter
        const matchesFolder = filters.folder === 'all' || doc.folderId === filters.folder

        // Date filter
        const docDate = new Date(doc.date)
        const matchesDateFrom = !filters.dateFrom || docDate >= new Date(filters.dateFrom)
        const matchesDateTo = !filters.dateTo || docDate <= new Date(filters.dateTo)

        return matchesText && matchesType && matchesFolder && matchesDateFrom && matchesDateTo
      })

      setResults(filtered)
      setIsSearching(false)
    }, 300)
  }

  useEffect(() => {
    const debounce = setTimeout(() => {
      performSearch()
    }, 300)
    return () => clearTimeout(debounce)
  }, [searchTerm, filters])

  const getTypeBadge = (typeId) => {
    const type = DOCUMENT_TYPES.find(t => t.id === typeId)
    return (
      <span className="badge" style={{ backgroundColor: `${type?.color}15`, color: type?.color }}>
        {type?.label || typeId}
      </span>
    )
  }

  const getFolderName = (folderId) => {
    const folder = mockFolders.find(f => f.id === folderId)
    return folder?.name || folderId
  }

  const clearFilters = () => {
    setFilters({ type: 'all', folder: 'all', dateFrom: '', dateTo: '' })
    setSearchTerm('')
  }

  const hasActiveFilters = filters.type !== 'all' || filters.folder !== 'all' || filters.dateFrom || filters.dateTo

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Recherche</h1>
          <p className="page-subtitle">Trouvez un document en moins de 10 secondes</p>
        </div>
      </div>

      {/* Search Box */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div className="search-box" style={{ flex: 1 }}>
            <Search size={20} />
            <input 
              type="text" 
              placeholder="Rechercher par nom, référence, ou tag..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
              style={{ fontSize: '1rem' }}
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem' }}
              >
                <X size={18} color="var(--gray-400)" />
              </button>
            )}
          </div>
          <button 
            className={`btn ${showFilters ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={18} />
            Filtres
            {hasActiveFilters && (
              <span style={{
                width: '8px',
                height: '8px',
                backgroundColor: 'var(--danger)',
                borderRadius: '50%',
                marginLeft: '0.25rem'
              }} />
            )}
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div style={{ 
            marginTop: '1rem', 
            paddingTop: '1rem', 
            borderTop: '1px solid var(--gray-200)',
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1rem'
          }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>Type de document</label>
              <select 
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              >
                <option value="all">Tous les types</option>
                {DOCUMENT_TYPES.map(type => (
                  <option key={type.id} value={type.id}>{type.label}</option>
                ))}
              </select>
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>Dossier</label>
              <select 
                value={filters.folder}
                onChange={(e) => setFilters({ ...filters, folder: e.target.value })}
              >
                <option value="all">Tous les dossiers</option>
                {mockFolders.filter(f => !user?.folderAccess || user.folderAccess.includes(f.id)).map(folder => (
                  <option key={folder.id} value={folder.id}>{folder.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>Date début</label>
              <input 
                type="date"
                value={filters.dateFrom}
                onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>Date fin</label>
              <input 
                type="date"
                value={filters.dateTo}
                onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
              />
            </div>
            {hasActiveFilters && (
              <div style={{ gridColumn: '1 / -1' }}>
                <button className="btn btn-secondary btn-sm" onClick={clearFilters}>
                  <X size={14} />
                  Effacer les filtres
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Results */}
      {isSearching ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            border: '3px solid var(--gray-200)',
            borderTopColor: 'var(--primary)',
            borderRadius: '50%',
            margin: '0 auto 1rem',
            animation: 'spin 1s linear infinite'
          }} />
          <p style={{ color: 'var(--gray-500)' }}>Recherche en cours...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      ) : results.length > 0 ? (
        <>
          <div style={{ marginBottom: '1rem', color: 'var(--gray-500)', fontSize: '0.875rem' }}>
            {results.length} résultat(s) trouvé(s)
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {results.map(doc => (
              <div 
                key={doc.id}
                className="card"
                style={{ 
                  padding: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '0.75rem',
                  backgroundColor: '#fee2e2',
                  color: '#dc2626',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <FileText size={24} />
                </div>
                
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{doc.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <FolderOpen size={12} /> {getFolderName(doc.folderId)}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Calendar size={12} /> {new Date(doc.date).toLocaleDateString('fr-FR')}
                    </span>
                    <span style={{ fontFamily: 'monospace' }}>{doc.reference}</span>
                  </div>
                  {doc.tags.length > 0 && (
                    <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                      {doc.tags.map(tag => (
                        <span key={tag} className="badge badge-gray" style={{ fontSize: '0.6875rem' }}>
                          <Tag size={10} /> {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {getTypeBadge(doc.type)}
                  <span className={`badge ${doc.status === 'validated' ? 'badge-green' : 'badge-orange'}`}>
                    {doc.status === 'validated' ? <CheckCircle size={12} /> : <Clock size={12} />}
                    {doc.status === 'validated' ? 'Validé' : 'En attente'}
                  </span>
                </div>

                <div className="actions-cell">
                  <Link to={`/documents/${doc.id}`} className="btn btn-secondary btn-sm">
                    <Eye size={16} />
                  </Link>
                  {canExport && (
                    <button className="btn btn-primary btn-sm" onClick={() => alert(`Téléchargement de ${doc.name}`)}>
                      <Download size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (searchTerm || hasActiveFilters) ? (
        <div className="card empty-state">
          <Search size={48} />
          <h3>Aucun résultat</h3>
          <p>Essayez avec d'autres mots-clés ou modifiez vos filtres</p>
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <Search size={48} color="var(--gray-300)" />
          <h3 style={{ marginTop: '1rem', color: 'var(--gray-700)' }}>Commencez votre recherche</h3>
          <p style={{ color: 'var(--gray-500)' }}>
            Tapez un mot-clé, une référence ou un tag pour trouver vos documents
          </p>
          <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>Suggestions:</span>
            {['facture', 'contrat', '2024', 'TVA'].map(suggestion => (
              <button 
                key={suggestion}
                className="badge badge-blue"
                style={{ cursor: 'pointer', border: 'none' }}
                onClick={() => setSearchTerm(suggestion)}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default SearchPage
