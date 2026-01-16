import { 
  Building2, Users, HardDrive, TrendingUp, Activity, 
  AlertTriangle, CheckCircle, Clock, ArrowUpRight, ArrowDownRight, Sparkles, Crown
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
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Crown size={32} style={{ color: 'var(--primary)' }} />
            Tableau de bord Super Admin
          </h1>
          <p className="page-subtitle" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={16} style={{ color: 'var(--accent)' }} />
            Vue d'ensemble de la plateforme AmanDocs
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className={`stat-icon`} style={{ 
              background: `linear-gradient(135deg, ${stat.color}20 0%, ${stat.color}10 100%)`, 
              color: stat.color,
              boxShadow: `0 4px 12px ${stat.color}20`
            }}>
              <stat.icon size={24} strokeWidth={2.5} />
            </div>
            <div className="stat-content">
              <h3>{stat.label}</h3>
              <div className="stat-value" style={{ 
                background: `linear-gradient(135deg, var(--gray-900) 0%, var(--gray-700) 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>{stat.value}</div>
              <div style={{ 
                fontSize: '0.75rem', 
                fontWeight: '600',
                color: stat.trend === 'up' ? 'var(--success)' : stat.trend === 'down' ? 'var(--danger)' : 'var(--gray-500)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                marginTop: '0.25rem'
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
      <div className="card" style={{ 
        marginBottom: '2rem', 
        background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #7c3aed 100%)', 
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{
          position: 'absolute',
          top: '-50%',
          right: '-20%',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
          borderRadius: '50%'
        }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
          <div>
            <div style={{ fontSize: '0.875rem', opacity: 0.9, marginBottom: '0.75rem', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingUp size={18} />
              Revenus mensuels estimés
            </div>
            <div style={{ fontSize: '2.75rem', fontWeight: '800', letterSpacing: '-0.02em' }}>{superAdminStats.monthlyRevenue.toLocaleString()} DH</div>
            <div style={{ fontSize: '0.875rem', opacity: 0.85, marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle size={16} />
              Basé sur les abonnements actifs
            </div>
          </div>
          <div style={{ 
            width: '96px', 
            height: '96px', 
            background: 'rgba(255,255,255,0.15)', 
            backdropFilter: 'blur(10px)',
            borderRadius: 'var(--radius-2xl)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid rgba(255,255,255,0.2)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
          }}>
            <TrendingUp size={48} strokeWidth={2.5} />
          </div>
        </div>
      </div>

      {/* Companies Table */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--gray-900)', marginBottom: '0.25rem' }}>Entreprises clientes</h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--gray-500)' }}>{mockCompanies.length} entreprises au total</p>
          </div>
          <button className="btn btn-primary btn-sm">
            <Building2 size={16} />
            Nouvelle entreprise
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
                        width: '44px',
                        height: '44px',
                        borderRadius: 'var(--radius-lg)',
                        background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                        color: '#1e40af',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: '700',
                        fontSize: '1.125rem',
                        boxShadow: '0 2px 8px rgba(37, 99, 235, 0.2)'
                      }}>
                        {company.name.charAt(0)}
                      </div>
                      <div>
                        <div style={{ fontWeight: '600', color: 'var(--gray-900)' }}>{company.name}</div>
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
          marginTop: '2rem',
          padding: '1.25rem 1.5rem',
          background: 'linear-gradient(135deg, #fef3c7 0%, #fef9e7 100%)',
          border: '1.5px solid #fcd34d',
          borderRadius: 'var(--radius-xl)',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          boxShadow: '0 4px 12px rgba(217, 119, 6, 0.15)'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: 'var(--radius-lg)',
            background: 'rgba(217, 119, 6, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <AlertTriangle size={24} color="#d97706" strokeWidth={2.5} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: '700', color: '#92400e', fontSize: '1rem', marginBottom: '0.25rem' }}>Attention requise</div>
            <div style={{ fontSize: '0.875rem', color: '#a16207', lineHeight: '1.5' }}>
              {mockCompanies.filter(c => c.status === 'suspended').length} entreprise(s) suspendue(s) nécessite(nt) votre attention.
            </div>
          </div>
          <button className="btn btn-secondary btn-sm" style={{ flexShrink: 0 }}>
            Voir détails
          </button>
        </div>
      )}
    </div>
  )
}

export default SuperAdminDashboard
