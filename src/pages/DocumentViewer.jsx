import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Download, FileText, Calendar, HardDrive, FolderOpen, User } from 'lucide-react'
import { mockDocuments } from '../data/mockData'

function DocumentViewer() {
  const { id } = useParams()
  const navigate = useNavigate()
  
  const document = mockDocuments.find((doc) => doc.id === parseInt(id))

  if (!document) {
    return (
      <div>
        <button 
          className="btn btn-secondary"
          onClick={() => navigate('/documents')}
          style={{ marginBottom: '1rem' }}
        >
          <ArrowLeft size={18} />
          Retour aux documents
        </button>
        <div className="empty-state">
          <FileText size={48} />
          <h3>Document non trouvé</h3>
          <p>Le document demandé n'existe pas ou a été supprimé</p>
        </div>
      </div>
    )
  }

  const metadata = [
    { icon: FileText, label: 'Nom', value: document.name },
    { icon: FolderOpen, label: 'Catégorie', value: document.category },
    { icon: Calendar, label: 'Date', value: new Date(document.date).toLocaleDateString('fr-FR') },
    { icon: HardDrive, label: 'Taille', value: document.size },
    { icon: User, label: 'Ajouté par', value: 'Jean Martin' }
  ]

  return (
    <div>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        marginBottom: '1.5rem'
      }}>
        <button 
          className="btn btn-secondary"
          onClick={() => navigate('/documents')}
        >
          <ArrowLeft size={18} />
          Retour
        </button>
        <button 
          className="btn btn-primary"
          onClick={() => alert(`Téléchargement de "${document.name}"...`)}
        >
          <Download size={18} />
          Télécharger
        </button>
      </div>

      <div className="viewer-layout">
        <div className="viewer-main">
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--gray-500)',
            padding: '2rem'
          }}>
            <FileText size={64} color="var(--gray-400)" />
            <h3 style={{ marginTop: '1rem', color: 'var(--gray-700)' }}>
              Aperçu du document
            </h3>
            <p style={{ marginTop: '0.5rem', textAlign: 'center' }}>
              {document.name}
            </p>
            <p style={{ 
              fontSize: '0.875rem', 
              color: 'var(--gray-400)',
              marginTop: '1rem'
            }}>
              (Démo - Le visualiseur PDF serait intégré ici)
            </p>
          </div>
        </div>

        <div className="viewer-sidebar">
          <div className="metadata-card">
            <h3>Informations du document</h3>
            {metadata.map((item, index) => (
              <div key={index} className="metadata-item">
                <span className="metadata-label" style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem' 
                }}>
                  <item.icon size={16} />
                  {item.label}
                </span>
                <span className="metadata-value">{item.value}</span>
              </div>
            ))}
          </div>

          <div className="metadata-card">
            <h3>Actions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <button className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
                <Download size={18} />
                Télécharger
              </button>
              <button className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
                <FolderOpen size={18} />
                Déplacer
              </button>
              <button 
                className="btn btn-danger" 
                style={{ justifyContent: 'flex-start' }}
                onClick={() => {
                  if (confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) {
                    alert('Document supprimé')
                    navigate('/documents')
                  }
                }}
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DocumentViewer
