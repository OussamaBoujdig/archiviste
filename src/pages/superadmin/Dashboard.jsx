import { 
  Building2, Users, HardDrive, TrendingUp, Activity, 
  AlertTriangle, CheckCircle, Clock, ArrowUpRight, ArrowDownRight
} from 'lucide-react'
import { mockCompanies, superAdminStats, PLANS } from '../../data/mockData'

function SuperAdminDashboard() {
  const stats = [
    { 
      label: 'Entreprises', 
      value: superAdminStats.totalCompanies, 
      icon: Building2, 
      color: '#2563eb',
      change: '+1 ce mois',
      trend: 'up'
    },
    { 
      label: 'Entreprises actives', 
      value: superAdminStats.activeCompanies, 
      icon: CheckCircle, 
      color: '#16a34a',
      change: '80%',
      trend: 'neutral'
    },
    { 
      label: 'Utilisateurs totaux', 
      value: superAdminStats.totalUsers, 
      icon: Users, 
      color: '#9333ea',
      change: '+12 ce mois',
      trend: 'up'
    },
    { 
      label: 'Stockage utilisé', 
      value: `${superAdminStats.totalStorage} GB`, 
      icon: HardDrive, 
      color: '#d97706',
      change: '+2.3 GB',
      trend: 'up'
    }
  ]

  const getStatusBadge = (status) => {
    if (status === 'active') {
      return <span className="badge badge-green">Actif</span>
    }
    return <span className="badge badge-orange">Suspendu</span>
  }

  const getPlanBadge = (planId) => {
    const plan = PLANS.find(p => p.id === planId)
    const colors = {
      starter: 'badge-gray',
      professional: 'badge-blue',
      enterprise: 'badge-purple'
    }
    return <span className={`badge ${colors[planId] || 'badge-gray'}`}>{plan?.name || planId}</span>
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Tableau de bord Super Admin</h1>
          <p className="page-subtitle">Vue d'ensemble de la plateforme AmanDocs</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className={`stat-icon`} style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
              <stat.icon size={24} />
            </div>
            <div className="stat-content">
              <h3>{stat.label}</h3>
              <div className="stat-value">{stat.value}</div>
              <div style={{ 
                fontSize: '0.75rem', 
                color: stat.trend === 'up' ? 'var(--success)' : stat.trend === 'down' ? 'var(--danger)' : 'var(--gray-500)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}>
                {stat.trend === 'up' && <ArrowUpRight size={14} />}
                {stat.trend === 'down' && <ArrowDownRight size={14} />}
                {stat.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue Card */}
      <div className="card" style={{ marginBottom: '1.5rem', background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)', color: 'white' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '0.875rem', opacity: 0.8, marginBottom: '0.5rem' }}>Revenus mensuels estimés</div>
            <div style={{ fontSize: '2.5rem', fontWeight: '700' }}>{superAdminStats.monthlyRevenue.toLocaleString()} DH</div>
            <div style={{ fontSize: '0.875rem', opacity: 0.8, marginTop: '0.5rem' }}>
              Basé sur les abonnements actifs
            </div>
          </div>
          <div style={{ 
            width: '80px', 
            height: '80px', 
            backgroundColor: 'rgba(255,255,255,0.1)', 
            borderRadius: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <TrendingUp size={40} />
          </div>
        </div>
      </div>

      {/* Companies Table */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: '600' }}>Entreprises clientes</h2>
          <button className="btn btn-primary btn-sm">
            + Nouvelle entreprise
          </button>
        </div>

        <div className="table-container" style={{ boxShadow: 'none', border: 'none' }}>
          <table>
            <thead>
              <tr>
                <th>Entreprise</th>
                <th>Secteur</th>
                <th>Plan</th>
                <th>Stockage</th>
                <th>Documents</th>
                <th>Utilisateurs</th>
                <th>Statut</th>
                <th>Dernière activité</th>
              </tr>
            </thead>
            <tbody>
              {mockCompanies.map((company) => (
                <tr key={company.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '0.5rem',
                        backgroundColor: '#dbeafe',
                        color: '#2563eb',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: '600'
                      }}>
                        {company.name.charAt(0)}
                      </div>
                      <div>
                        <div style={{ fontWeight: '500' }}>{company.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>{company.adminEmail}</div>
                      </div>
                    </div>
                  </td>
                  <td>{company.sector}</td>
                  <td>{getPlanBadge(company.plan)}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ 
                        width: '60px', 
                        height: '6px', 
                        backgroundColor: 'var(--gray-200)', 
                        borderRadius: '3px',
                        overflow: 'hidden'
                      }}>
                        <div style={{ 
                          width: `${(company.storageUsed / company.storageLimit) * 100}%`, 
                          height: '100%', 
                          backgroundColor: company.storageUsed / company.storageLimit > 0.8 ? 'var(--danger)' : 'var(--primary)',
                          borderRadius: '3px'
                        }} />
                      </div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>
                        {company.storageUsed}/{company.storageLimit} GB
                      </span>
                    </div>
                  </td>
                  <td>{company.documentsCount.toLocaleString()}</td>
                  <td>{company.usersCount}</td>
                  <td>{getStatusBadge(company.status)}</td>
                  <td style={{ fontSize: '0.875rem', color: 'var(--gray-500)' }}>{company.lastActivity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Alert for suspended companies */}
      {mockCompanies.some(c => c.status === 'suspended') && (
        <div style={{
          marginTop: '1.5rem',
          padding: '1rem 1.5rem',
          backgroundColor: '#fef3c7',
          border: '1px solid #fcd34d',
          borderRadius: '0.75rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <AlertTriangle size={20} color="#d97706" />
          <div>
            <div style={{ fontWeight: '500', color: '#92400e' }}>Attention</div>
            <div style={{ fontSize: '0.875rem', color: '#a16207' }}>
              {mockCompanies.filter(c => c.status === 'suspended').length} entreprise(s) suspendue(s) nécessite(nt) votre attention.
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SuperAdminDashboard
