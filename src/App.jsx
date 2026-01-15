import { useState } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { USER_ROLES, mockUsers, DEMO_CONFIG } from './data/mockData'
import Login from './pages/Login'
import Layout from './components/Layout'

// Super Admin Pages
import SuperAdminDashboard from './pages/superadmin/Dashboard'
import CompaniesManagement from './pages/superadmin/Companies'
import SystemLogs from './pages/superadmin/SystemLogs'

// Client Admin Pages
import ClientAdminDashboard from './pages/clientadmin/Dashboard'
import DocumentsPage from './pages/clientadmin/Documents'
import FoldersPage from './pages/clientadmin/Folders'
import UsersManagement from './pages/clientadmin/Users'
import ActivityLogs from './pages/clientadmin/ActivityLogs'
import Settings from './pages/clientadmin/Settings'

// Shared Pages
import DocumentViewer from './pages/shared/DocumentViewer'
import SearchPage from './pages/shared/Search'

// Client Portal
import ClientLogin from './pages/ClientLogin'
import ClientPortal from './pages/ClientPortal'

function App() {
  const location = useLocation()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [isClientAuthenticated, setIsClientAuthenticated] = useState(false)
  const [currentClient, setCurrentClient] = useState(null)
  const [isDemo, setIsDemo] = useState(DEMO_CONFIG.isDemo)

  const handleLogin = (email, role) => {
    // Find user by email or use demo user based on role
    let user = mockUsers.find(u => u.email === email)
    
    if (!user) {
      // Demo login based on selected role
      if (role === USER_ROLES.SUPER_ADMIN) {
        user = mockUsers.find(u => u.role === USER_ROLES.SUPER_ADMIN)
      } else if (role === USER_ROLES.CLIENT_ADMIN) {
        user = mockUsers.find(u => u.role === USER_ROLES.CLIENT_ADMIN)
      } else if (role === USER_ROLES.CLIENT_USER) {
        user = mockUsers.find(u => u.role === USER_ROLES.CLIENT_USER)
      } else {
        user = mockUsers.find(u => u.role === USER_ROLES.READ_ONLY)
      }
    }
    
    setIsAuthenticated(true)
    setCurrentUser(user)
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setCurrentUser(null)
  }

  const handleClientLogin = (email) => {
    setIsClientAuthenticated(true)
    setCurrentClient({
      name: 'Cabinet Dupont & Associés',
      email: email,
      sector: 'Juridique'
    })
  }

  const handleClientLogout = () => {
    setIsClientAuthenticated(false)
    setCurrentClient(null)
  }

  // Client Portal Routes (only /client, not /clients)
  if (location.pathname === '/client' || location.pathname.startsWith('/client/')) {
    if (!isClientAuthenticated) {
      return <ClientLogin onClientLogin={handleClientLogin} />
    }
    return <ClientPortal client={currentClient} onLogout={handleClientLogout} />
  }

  // Main App Routes
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />
  }

  // Render based on user role
  const renderRoutes = () => {
    const role = currentUser?.role

    // Super Admin Routes
    if (role === USER_ROLES.SUPER_ADMIN) {
      return (
        <Routes>
          <Route path="/" element={<SuperAdminDashboard />} />
          <Route path="/companies" element={<CompaniesManagement />} />
          <Route path="/system-logs" element={<SystemLogs />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      )
    }

    // Client Admin Routes
    if (role === USER_ROLES.CLIENT_ADMIN) {
      return (
        <Routes>
          <Route path="/" element={<ClientAdminDashboard user={currentUser} />} />
          <Route path="/documents" element={<DocumentsPage user={currentUser} />} />
          <Route path="/documents/:id" element={<DocumentViewer user={currentUser} />} />
          <Route path="/folders" element={<FoldersPage user={currentUser} />} />
          <Route path="/users" element={<UsersManagement user={currentUser} />} />
          <Route path="/activity" element={<ActivityLogs user={currentUser} />} />
          <Route path="/search" element={<SearchPage user={currentUser} />} />
          <Route path="/settings" element={<Settings user={currentUser} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      )
    }

    // Client User Routes (limited)
    if (role === USER_ROLES.CLIENT_USER) {
      return (
        <Routes>
          <Route path="/" element={<ClientAdminDashboard user={currentUser} />} />
          <Route path="/documents" element={<DocumentsPage user={currentUser} />} />
          <Route path="/documents/:id" element={<DocumentViewer user={currentUser} />} />
          <Route path="/folders" element={<FoldersPage user={currentUser} />} />
          <Route path="/search" element={<SearchPage user={currentUser} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      )
    }

    // Read-Only User Routes
    if (role === USER_ROLES.READ_ONLY) {
      return (
        <Routes>
          <Route path="/" element={<ClientAdminDashboard user={currentUser} />} />
          <Route path="/documents" element={<DocumentsPage user={currentUser} />} />
          <Route path="/documents/:id" element={<DocumentViewer user={currentUser} />} />
          <Route path="/search" element={<SearchPage user={currentUser} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      )
    }

    return <Navigate to="/" replace />
  }

  return (
    <Layout user={currentUser} onLogout={handleLogout} isDemo={isDemo}>
      {renderRoutes()}
    </Layout>
  )
}

export default App
