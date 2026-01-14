import { FileText, Upload, HardDrive, Users } from 'lucide-react'
import { mockStats, mockDocuments } from '../data/mockData'

function Dashboard() {
  const stats = [
    {
      icon: FileText,
      label: 'Total documents',
      value: mockStats.totalDocuments.toLocaleString('fr-FR'),
      color: 'blue'
    },
    {
      icon: Upload,
      label: 'Téléversements récents',
      value: mockStats.recentUploads,
      color: 'green'
    },
    {
      icon: HardDrive,
      label: 'Stockage utilisé',
      value: `${mockStats.storageUsed} / ${mockStats.storageTotal}`,
      color: 'orange'
    },
    {
      icon: Users,
      label: 'Utilisateurs actifs',
      value: mockStats.activeUsers,
      color: 'purple'
    }
  ]

  const recentDocuments = mockDocuments.slice(0, 5)

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Tableau de bord</h1>
        <p className="page-subtitle">Bienvenue sur votre espace de gestion d'archives</p>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className={`stat-icon ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div className="stat-content">
              <h3>{stat.label}</h3>
              <div className="stat-value">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <h2 style={{ 
          fontSize: '1.125rem', 
          fontWeight: '600', 
          marginBottom: '1rem',
          color: 'var(--gray-900)'
        }}>
          Documents récents
        </h2>
        <table>
          <thead>
            <tr>
              <th>Nom du document</th>
              <th>Catégorie</th>
              <th>Date</th>
              <th>Taille</th>
            </tr>
          </thead>
          <tbody>
            {recentDocuments.map((doc) => (
              <tr key={doc.id}>
                <td style={{ fontWeight: '500' }}>{doc.name}</td>
                <td>
                  <span className="badge badge-blue">{doc.category}</span>
                </td>
                <td>{new Date(doc.date).toLocaleDateString('fr-FR')}</td>
                <td>{doc.size}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Dashboard
