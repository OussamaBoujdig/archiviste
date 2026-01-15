import { useParams, Link } from 'react-router-dom'
import { 
  FileText, Download, Printer, ArrowLeft, Calendar, FolderOpen,
  Tag, User, Clock, CheckCircle, Edit, Trash2, Share2
} from 'lucide-react'
import { mockDocuments, mockFolders, mockUsers, DOCUMENT_TYPES, USER_ROLES, PERMISSIONS } from '../../data/mockData'

function DocumentViewer({ user }) {
  const { id } = useParams()
  const document = mockDocuments.find(d => d.id === id || d.id === `doc_${id?.padStart(3, '0')}`)

  const canEdit = user?.permissions?.includes(PERMISSIONS.EDIT_METADATA) || user?.role === USER_ROLES.CLIENT_ADMIN
  const canDelete = user?.permissions?.includes(PERMISSIONS.DELETE) || user?.role === USER_ROLES.CLIENT_ADMIN
  const canExport = user?.permissions?.includes(PERMISSIONS.EXPORT) || user?.role === USER_ROLES.CLIENT_ADMIN
  const isReadOnly = user?.role === USER_ROLES.READ_ONLY

  if (!document) {
    return (
      <div className="page">
        <div className="empty-state">
          <FileText size={48} />
          <h3>Document non trouvé</h3>
          <p>Le document demandé n'existe pas ou vous n'y avez pas accès</p>
          <Link to="/documents" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            <ArrowLeft size={18} />
            Retour aux documents
          </Link>
        </div>
      </div>
    )
  }

  const folder = mockFolders.find(f => f.id === document.folderId)
  const creator = mockUsers.find(u => u.id === document.createdBy)
  const docType = DOCUMENT_TYPES.find(t => t.id === document.type)

  return (
    <div className="page">
      {/* Header */}
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link to="/documents" className="btn btn-secondary btn-sm">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="page-title" style={{ marginBottom: '0.25rem' }}>{document.name}</h1>
            <p className="page-subtitle" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="badge" style={{ backgroundColor: `${docType?.color}15`, color: docType?.color }}>
                {docType?.label}
              </span>
              <span style={{ color: 'var(--gray-400)' }}>•</span>
              <span>{document.reference}</span>
              {isReadOnly && (
                <>
                  <span style={{ color: 'var(--gray-400)' }}>•</span>
                  <span className="badge badge-orange">Lecture seule</span>
                </>
              )}
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {canExport && (
            <>
              <button className="btn btn-secondary" onClick={() => alert('Impression...')}>
                <Printer size={18} />
              </button>
              <button className="btn btn-primary" onClick={() => alert(`Téléchargement de ${document.name}`)}>
                <Download size={18} />
                Télécharger
              </button>
            </>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '1.5rem' }}>
        {/* PDF Viewer */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{
            backgroundColor: 'var(--gray-100)',
            height: '600px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <FileText size={80} color="var(--gray-400)" />
            <h3 style={{ marginTop: '1.5rem', color: 'var(--gray-700)' }}>Aperçu du document</h3>
            <p style={{ color: 'var(--gray-500)', marginTop: '0.5rem' }}>
              {document.name}
            </p>
            <p style={{ color: 'var(--gray-400)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              (Visualiseur PDF intégré ici)
            </p>
          </div>
        </div>

        {/* Metadata Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Status */}
          <div className="card">
            <h3 style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '1rem', color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Statut
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {document.status === 'validated' ? (
                <>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: '#dcfce7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <CheckCircle size={20} color="#16a34a" />
                  </div>
                  <div>
                    <div style={{ fontWeight: '600', color: '#16a34a' }}>Validé</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>Document approuvé</div>
                  </div>
                </>
              ) : (
                <>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: '#fef3c7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Clock size={20} color="#d97706" />
                  </div>
                  <div>
                    <div style={{ fontWeight: '600', color: '#d97706' }}>En attente</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>Validation requise</div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Metadata */}
          <div className="card">
            <h3 style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '1rem', color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Informations
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <FolderOpen size={12} /> Dossier
                </div>
                <div style={{ fontWeight: '500' }}>{folder?.name || 'Non classé'}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Calendar size={12} /> Date du document
                </div>
                <div style={{ fontWeight: '500' }}>{new Date(document.date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginBottom: '0.25rem' }}>
                  Référence
                </div>
                <div style={{ fontWeight: '500', fontFamily: 'monospace' }}>{document.reference}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginBottom: '0.25rem' }}>
                  Taille / Version
                </div>
                <div style={{ fontWeight: '500' }}>{document.size} • Version {document.version}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <User size={12} /> Ajouté par
                </div>
                <div style={{ fontWeight: '500' }}>{creator?.name || 'Inconnu'}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>{document.createdAt}</div>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="card">
            <h3 style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '1rem', color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Tag size={14} /> Tags
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {document.tags.map(tag => (
                <span key={tag} className="badge badge-blue">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Actions */}
          {(canEdit || canDelete) && (
            <div className="card">
              <h3 style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '1rem', color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Actions
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {canEdit && (
                  <button className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
                    <Edit size={18} />
                    Modifier les métadonnées
                  </button>
                )}
                <button className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
                  <Share2 size={18} />
                  Partager
                </button>
                {canDelete && (
                  <button className="btn btn-secondary" style={{ justifyContent: 'flex-start', color: 'var(--danger)' }}>
                    <Trash2 size={18} />
                    Supprimer
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DocumentViewer
