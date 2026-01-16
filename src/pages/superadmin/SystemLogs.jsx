import { useState } from 'react'
import { 
  Activity, Search, Filter, Download, Eye, Upload, Edit, Trash2,
  LogIn, LogOut, AlertTriangle, CheckCircle, Clock, Sparkles, Shield
} from 'lucide-react'
import { mockActivityLogs, mockUsers, mockCompanies } from '../../data/mockData'

function SystemLogs() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterAction, setFilterAction] = useState('all')

  const getActionIcon = (action) => {
    const icons = {
      upload: <Upload size={16} color="#16a34a" />,
      view: <Eye size={16} color="#2563eb" />,
      download: <Download size={16} color="#9333ea" />,
      edit: <Edit size={16} color="#d97706" />,
      delete: <Trash2 size={16} color="#dc2626" />,
      login: <LogIn size={16} color="#16a34a" />,
      logout: <LogOut size={16} color="#64748b" />
    }
    return icons[action] || <Activity size={16} />
  }

  const getActionLabel = (action) => {
    const labels = {
      upload: 'Upload',
      view: 'Consultation',
      download: 'Téléchargement',
      edit: 'Modification',
      delete: 'Suppression',
      login: 'Connexion',
      logout: 'Déconnexion'
    }
    return labels[action] || action
  }

  const getActionBadge = (action) => {
    const colors = {
      upload: 'badge-green',
      view: 'badge-blue',
      download: 'badge-purple',
      edit: 'badge-orange',
      delete: 'badge-red',
      login: 'badge-green',
      logout: 'badge-gray'
    }
    return (
      <span className={`badge ${colors[action] || 'badge-gray'}`} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
        {getActionIcon(action)}
        {getActionLabel(action)}
      </span>
    )
  }

  const getUserName = (userId) => {
    const user = mockUsers.find(u => u.id === userId)
    return user?.name || userId
  }

  const filteredLogs = mockActivityLogs.filter(log => {
    const matchesSearch = log.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          getUserName(log.userId).toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterAction === 'all' || log.action === filterAction
    return matchesSearch && matchesFilter
  })

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Activity size={32} style={{ color: 'var(--primary)' }} />
            Journaux système
          </h1>
          <p className="page-subtitle" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Shield size={16} style={{ color: 'var(--accent)' }} />
            Historique des activités sur la plateforme (métadonnées uniquement)
          </p>
        </div>
        <button className="btn btn-secondary">
          <Download size={18} />
          Exporter
        </button>
      </div>

      {/* Info Banner */}
      <div style={{
        padding: '1.25rem 1.5rem',
        background: 'linear-gradient(135deg, #eff6ff 0%, #e0f2fe 100%)',
        border: '1.5px solid #bfdbfe',
        borderRadius: 'var(--radius-xl)',
        marginBottom: '2rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        boxShadow: '0 4px 12px rgba(37, 99, 235, 0.1)'
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: 'var(--radius-lg)',
          background: 'rgba(37, 99, 235, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <Shield size={24} color="#2563eb" strokeWidth={2.5} />
        </div>
        <div style={{ fontSize: '0.875rem', color: '#1e40af', lineHeight: '1.6' }}>
          <strong style={{ fontWeight: '700', display: 'block', marginBottom: '0.25rem' }}>Note de sécurité</strong>
          En tant que Super Admin, vous n'avez accès qu'aux métadonnées. 
          Le contenu des documents reste confidentiel et accessible uniquement aux utilisateurs autorisés de chaque entreprise.
        </div>
      </div>

      {/* Filters */}
      <div className="table-container">
        <div className="table-header">
          <div className="search-box">
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Rechercher par utilisateur ou document..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
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
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Date & Heure</th>
              <th>Utilisateur</th>
              <th>Action</th>
              <th>Document / Cible</th>
              <th>Adresse IP</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((log) => (
              <tr key={log.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Clock size={14} color="var(--gray-400)" />
                    <span style={{ fontSize: '0.875rem' }}>{log.timestamp}</span>
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: '#e0e7ff',
                      color: '#4f46e5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: '600'
                    }}>
                      {getUserName(log.userId).split(' ').map(n => n[0]).join('')}
                    </div>
                    <span style={{ fontWeight: '500' }}>{getUserName(log.userId)}</span>
                  </div>
                </td>
                <td>{getActionBadge(log.action)}</td>
                <td style={{ maxWidth: '300px' }}>
                  <div style={{ 
                    whiteSpace: 'nowrap', 
                    overflow: 'hidden', 
                    textOverflow: 'ellipsis',
                    fontSize: '0.875rem'
                  }}>
                    {log.target}
                  </div>
                </td>
                <td style={{ fontSize: '0.875rem', color: 'var(--gray-500)', fontFamily: 'monospace' }}>
                  {log.ip}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredLogs.length === 0 && (
          <div className="empty-state">
            <Activity size={48} />
            <h3>Aucun log trouvé</h3>
            <p>Modifiez vos critères de recherche</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default SystemLogs
