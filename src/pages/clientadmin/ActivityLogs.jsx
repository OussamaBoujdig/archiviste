import { useState } from 'react'
import { 
  Activity, Search, Download, Eye, Upload, Edit, Trash2,
  Clock, Filter, Calendar
} from 'lucide-react'
import { mockActivityLogs, mockUsers } from '../../data/mockData'

function ActivityLogs({ user }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterAction, setFilterAction] = useState('all')
  const [filterDate, setFilterDate] = useState('')

  const getActionIcon = (action) => {
    const icons = {
      upload: <Upload size={16} color="#16a34a" />,
      view: <Eye size={16} color="#2563eb" />,
      download: <Download size={16} color="#9333ea" />,
      edit: <Edit size={16} color="#d97706" />,
      delete: <Trash2 size={16} color="#dc2626" />
    }
    return icons[action] || <Activity size={16} />
  }

  const getActionLabel = (action) => {
    const labels = {
      upload: 'Upload',
      view: 'Consultation',
      download: 'Téléchargement',
      edit: 'Modification',
      delete: 'Suppression'
    }
    return labels[action] || action
  }

  const getActionBadge = (action) => {
    const colors = {
      upload: 'badge-green',
      view: 'badge-blue',
      download: 'badge-purple',
      edit: 'badge-orange',
      delete: 'badge-red'
    }
    return (
      <span className={`badge ${colors[action] || 'badge-gray'}`} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
        {getActionIcon(action)}
        {getActionLabel(action)}
      </span>
    )
  }

  const getUserInfo = (userId) => {
    const u = mockUsers.find(u => u.id === userId)
    return u || { name: userId, avatar: '?', email: '' }
  }

  const filteredLogs = mockActivityLogs.filter(log => {
    const matchesSearch = log.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          getUserInfo(log.userId).name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterAction === 'all' || log.action === filterAction
    return matchesSearch && matchesFilter
  })

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Journal d'activité</h1>
          <p className="page-subtitle">Historique des actions sur les documents</p>
        </div>
        <button className="btn btn-secondary">
          <Download size={18} />
          Exporter
        </button>
      </div>

      {/* Filters */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div className="search-box" style={{ flex: 1, minWidth: '250px' }}>
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Rechercher par utilisateur ou document..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select 
            value={filterAction} 
            onChange={(e) => setFilterAction(e.target.value)}
            style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid var(--gray-200)' }}
          >
            <option value="all">Toutes les actions</option>
            <option value="upload">Uploads</option>
            <option value="view">Consultations</option>
            <option value="download">Téléchargements</option>
            <option value="edit">Modifications</option>
            <option value="delete">Suppressions</option>
          </select>

          <input 
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid var(--gray-200)' }}
          />
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="card">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {filteredLogs.map((log, index) => {
            const userInfo = getUserInfo(log.userId)
            return (
              <div 
                key={log.id}
                style={{
                  display: 'flex',
                  gap: '1rem',
                  padding: '1rem 0',
                  borderBottom: index < filteredLogs.length - 1 ? '1px solid var(--gray-100)' : 'none'
                }}
              >
                {/* Timeline dot */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: '#e0e7ff',
                    color: '#4f46e5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '600',
                    fontSize: '0.75rem'
                  }}>
                    {userInfo.avatar}
                  </div>
                </div>

                {/* Content */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: '600' }}>{userInfo.name}</span>
                    {getActionBadge(log.action)}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--gray-700)', marginBottom: '0.25rem' }}>
                    {log.target}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Clock size={12} />
                      {log.timestamp}
                    </span>
                    <span style={{ fontFamily: 'monospace' }}>{log.ip}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {filteredLogs.length === 0 && (
          <div className="empty-state">
            <Activity size={48} />
            <h3>Aucune activité trouvée</h3>
            <p>Modifiez vos critères de recherche</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ActivityLogs
