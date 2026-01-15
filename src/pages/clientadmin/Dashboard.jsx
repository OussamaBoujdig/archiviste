import { 
  FileText, HardDrive, Users, Clock, TrendingUp, Upload,
  FolderOpen, Search, Eye, Download, CheckCircle, AlertCircle
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { mockDocuments, mockFolders, mockStats, mockActivityLogs, mockUsers, DOCUMENT_TYPES, USER_ROLES } from '../../data/mockData'

function ClientAdminDashboard({ user }) {
  const isReadOnly = user?.role === USER_ROLES.READ_ONLY
  const isClientUser = user?.role === USER_ROLES.CLIENT_USER

  const stats = [
    { label: 'Documents', value: mockStats.totalDocuments, icon: FileText, color: '#2563eb' },
    { label: 'Stockage', value: `${mockStats.storageUsed} GB`, icon: HardDrive, color: '#16a34a', subtext: `sur ${mockStats.storageTotal} GB` },
    { label: 'Dossiers', value: mockFolders.length, icon: FolderOpen, color: '#9333ea' },
    { label: 'En attente', value: mockStats.pendingDocuments, icon: AlertCircle, color: '#d97706' }
  ]

  const recentDocs = mockDocuments.slice(0, 5)
  const recentActivity = mockActivityLogs.slice(0, 5)

  const getDocTypeBadge = (typeId) => {
    const type = DOCUMENT_TYPES.find(t => t.id === typeId)
    return (
      <span className="badge" style={{ backgroundColor: `${type?.color}15`, color: type?.color }}>
        {type?.label || typeId}
      </span>
    )
  }

  const getActionIcon = (action) => {
    const icons = {
      upload: <Upload size={14} color="#16a34a" />,
      view: <Eye size={14} color="#2563eb" />,
      download: <Download size={14} color="#9333ea" />,
      edit: <FileText size={14} color="#d97706" />,
      delete: <AlertCircle size={14} color="#dc2626" />
    }
    return icons[action] || <FileText size={14} />
  }

  const getUserName = (userId) => {
    const u = mockUsers.find(u => u.id === userId)
    return u?.name || userId
  }

  const storagePercentage = (mockStats.storageUsed / mockStats.storageTotal) * 100

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Tableau de bord</h1>
          <p className="page-subtitle">
            Bienvenue, {user?.name} 
            {isReadOnly && <span className="badge badge-orange" style={{ marginLeft: '0.5rem' }}>Lecture seule</span>}
            {user?.expiresAt && (
              <span style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginLeft: '0.5rem' }}>
                (Accès jusqu'au {new Date(user.expiresAt).toLocaleDateString('fr-FR')})
              </span>
            )}
          </p>
        </div>
        {!isReadOnly && (
          <Link to="/documents" className="btn btn-primary">
            <Upload size={18} />
            Nouveau document
          </Link>
        )}
      </div>

      {/* Stats */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
              <stat.icon size={24} />
            </div>
            <div className="stat-content">
              <h3>{stat.label}</h3>
              <div className="stat-value">{stat.value}</div>
              {stat.subtext && <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>{stat.subtext}</div>}
            </div>
          </div>
        ))}
      </div>

      {/* Storage Bar */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '600' }}>Espace de stockage</h3>
          <span style={{ fontSize: '0.875rem', color: 'var(--gray-500)' }}>
            {mockStats.storageUsed} GB utilisés sur {mockStats.storageTotal} GB
          </span>
        </div>
        <div style={{ 
          height: '12px', 
          backgroundColor: 'var(--gray-200)', 
          borderRadius: '6px',
          overflow: 'hidden'
        }}>
          <div style={{ 
            width: `${storagePercentage}%`, 
            height: '100%', 
            backgroundColor: storagePercentage > 80 ? 'var(--danger)' : storagePercentage > 60 ? 'var(--warning)' : 'var(--primary)',
            borderRadius: '6px',
            transition: 'width 0.3s ease'
          }} />
        </div>
      </div>

      {/* Two columns */}
      <div className="dashboard-grid">
        {/* Recent Documents */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '600' }}>Documents récents</h3>
            <Link to="/documents" className="btn btn-secondary btn-sm">Voir tout</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {recentDocs.map((doc) => (
              <Link 
                key={doc.id} 
                to={`/documents/${doc.id}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  border: '1px solid var(--gray-100)',
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--gray-50)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
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
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: '500', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {doc.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>
                    {new Date(doc.date).toLocaleDateString('fr-FR')} • {doc.size}
                  </div>
                </div>
                {getDocTypeBadge(doc.type)}
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '600' }}>Activité récente</h3>
            {!isClientUser && !isReadOnly && (
              <Link to="/activity" className="btn btn-secondary btn-sm">Voir tout</Link>
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {recentActivity.map((activity) => (
              <div 
                key={activity.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  backgroundColor: 'var(--gray-50)'
                }}
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid var(--gray-200)'
                }}>
                  {getActionIcon(activity.action)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.875rem' }}>
                    <strong>{getUserName(activity.userId)}</strong>
                    <span style={{ color: 'var(--gray-500)' }}> a {activity.action === 'upload' ? 'uploadé' : activity.action === 'view' ? 'consulté' : activity.action === 'download' ? 'téléchargé' : activity.action === 'edit' ? 'modifié' : 'supprimé'} </span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {activity.target}
                  </div>
                </div>
                <div style={{ fontSize: '0.6875rem', color: 'var(--gray-400)', whiteSpace: 'nowrap' }}>
                  {activity.timestamp.split(' ')[0]}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Search */}
      <div className="card" style={{ marginTop: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Search size={24} color="var(--primary)" />
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.25rem' }}>Recherche rapide</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--gray-500)', margin: 0 }}>
              Trouvez un document en moins de 10 secondes
            </p>
          </div>
          <Link to="/search" className="btn btn-primary">
            <Search size={18} />
            Rechercher
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ClientAdminDashboard

