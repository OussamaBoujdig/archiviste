import { NavLink } from 'react-router-dom'
import { 
  Archive, 
  LayoutDashboard, 
  FileText, 
  FolderOpen, 
  Users, 
  Settings,
  LogOut,
  Building2
} from 'lucide-react'

function Layout({ children, user, onLogout }) {
  const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Tableau de bord' },
    { to: '/documents', icon: FileText, label: 'Documents' },
    { to: '/clients', icon: Building2, label: 'Clients' },
    { to: '/categories', icon: FolderOpen, label: 'Catégories' },
    { to: '/users', icon: Users, label: 'Utilisateurs' },
    { to: '/settings', icon: Settings, label: 'Paramètres' }
  ]

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <h1>
            <Archive size={28} />
            <span>Archivist</span>
          </h1>
        </div>
        
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink 
              key={item.to} 
              to={item.to}
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-user">
          <div className="sidebar-user-avatar">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{user?.name}</div>
            <div className="sidebar-user-role">{user?.role}</div>
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
