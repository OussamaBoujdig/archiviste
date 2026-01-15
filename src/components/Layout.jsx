import { NavLink } from 'react-router-dom'
import { 
  Archive, 
  LayoutDashboard, 
  FileText, 
  FolderOpen, 
  Users, 
  Settings,
  LogOut,
  Building2,
  Search,
  Activity,
  Shield,
  AlertTriangle
} from 'lucide-react'
import { USER_ROLES } from '../data/mockData'

function Layout({ children, user, onLogout, isDemo }) {
  // Navigation items based on user role
  const getNavItems = () => {
    const role = user?.role

    // Super Admin Navigation
    if (role === USER_ROLES.SUPER_ADMIN) {
      return [
        { to: '/', icon: LayoutDashboard, label: 'Tableau de bord' },
        { to: '/companies', icon: Building2, label: 'Entreprises' },
        { to: '/system-logs', icon: Activity, label: 'Journaux système' },
        { to: '/settings', icon: Settings, label: 'Paramètres' }
      ]
    }

    // Client Admin Navigation
    if (role === USER_ROLES.CLIENT_ADMIN) {
      return [
        { to: '/', icon: LayoutDashboard, label: 'Tableau de bord' },
        { to: '/documents', icon: FileText, label: 'Documents' },
        { to: '/folders', icon: FolderOpen, label: 'Dossiers' },
        { to: '/search', icon: Search, label: 'Recherche' },
        { to: '/users', icon: Users, label: 'Utilisateurs' },
        { to: '/activity', icon: Activity, label: 'Activité' },
        { to: '/settings', icon: Settings, label: 'Paramètres' }
      ]
    }

    // Client User Navigation
    if (role === USER_ROLES.CLIENT_USER) {
      return [
        { to: '/', icon: LayoutDashboard, label: 'Tableau de bord' },
        { to: '/documents', icon: FileText, label: 'Documents' },
        { to: '/folders', icon: FolderOpen, label: 'Dossiers' },
        { to: '/search', icon: Search, label: 'Recherche' }
      ]
    }

    // Read-Only User Navigation
    if (role === USER_ROLES.READ_ONLY) {
      return [
        { to: '/', icon: LayoutDashboard, label: 'Tableau de bord' },
        { to: '/documents', icon: FileText, label: 'Documents' },
        { to: '/search', icon: Search, label: 'Recherche' }
      ]
    }

    return []
  }

  const navItems = getNavItems()

  const getRoleLabel = (role) => {
    const labels = {
      [USER_ROLES.SUPER_ADMIN]: 'Super Admin',
      [USER_ROLES.CLIENT_ADMIN]: 'Admin',
      [USER_ROLES.CLIENT_USER]: 'Utilisateur',
      [USER_ROLES.READ_ONLY]: 'Lecture seule'
    }
    return labels[role] || role
  }

  const getRoleBadgeColor = (role) => {
    const colors = {
      [USER_ROLES.SUPER_ADMIN]: '#dc2626',
      [USER_ROLES.CLIENT_ADMIN]: '#2563eb',
      [USER_ROLES.CLIENT_USER]: '#16a34a',
      [USER_ROLES.READ_ONLY]: '#d97706'
    }
    return colors[role] || '#64748b'
  }

  return (
    <div className="app-layout">
      {/* Demo Watermark */}
      {isDemo && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%) rotate(-45deg)',
          fontSize: '8rem',
          fontWeight: '900',
          color: 'rgba(0,0,0,0.03)',
          pointerEvents: 'none',
          zIndex: 9999,
          userSelect: 'none'
        }}>
          DEMO
        </div>
      )}

      <aside className="sidebar">
        <div className="sidebar-logo">
          <h1>
            <Archive size={28} />
            <span>AmanDocs</span>
          </h1>
          {user?.role === USER_ROLES.SUPER_ADMIN && (
            <div style={{
              marginTop: '0.5rem',
              padding: '0.25rem 0.75rem',
              backgroundColor: '#dc2626',
              color: 'white',
              borderRadius: '0.375rem',
              fontSize: '0.6875rem',
              fontWeight: '600',
              textAlign: 'center'
            }}>
              SUPER ADMIN
            </div>
          )}
        </div>
        
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink 
              key={item.to} 
              to={item.to}
              className={({ isActive }) => isActive ? 'active' : ''}
              end={item.to === '/'}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Expiration Warning for Read-Only Users */}
        {user?.role === USER_ROLES.READ_ONLY && user?.expiresAt && (
          <div style={{
            margin: '0 1rem 1rem',
            padding: '0.75rem',
            backgroundColor: '#fef3c7',
            borderRadius: '0.5rem',
            fontSize: '0.75rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#92400e', fontWeight: '500' }}>
              <AlertTriangle size={14} />
              Accès temporaire
            </div>
            <div style={{ color: '#a16207', marginTop: '0.25rem' }}>
              Expire le {new Date(user.expiresAt).toLocaleDateString('fr-FR')}
            </div>
          </div>
        )}

        <div className="sidebar-user">
          <div className="sidebar-user-avatar" style={{ backgroundColor: getRoleBadgeColor(user?.role) }}>
            {user?.avatar || user?.name?.charAt(0) || 'U'}
          </div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{user?.name}</div>
            <div className="sidebar-user-role" style={{ 
              color: getRoleBadgeColor(user?.role),
              fontWeight: '500'
            }}>
              {getRoleLabel(user?.role)}
            </div>
          </div>
          <button 
            className="btn-icon" 
            onClick={onLogout}
            title="Se déconnecter"
            style={{ color: 'var(--gray-400)' }}
          >
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      <main className="main-content">
        {children}
      </main>
    </div>
  )
}

export default Layout
