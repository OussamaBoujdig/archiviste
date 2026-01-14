import { useState } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Documents from './pages/Documents'
import DocumentViewer from './pages/DocumentViewer'
import Users from './pages/Users'
import Settings from './pages/Settings'
import Clients from './pages/Clients'
import ClientLogin from './pages/ClientLogin'
import ClientPortal from './pages/ClientPortal'
import Layout from './components/Layout'

function App() {
  const location = useLocation()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [isClientAuthenticated, setIsClientAuthenticated] = useState(false)
  const [currentClient, setCurrentClient] = useState(null)

  const handleLogin = (email) => {
    setIsAuthenticated(true)
    setCurrentUser({
      name: 'Jean Martin',
      email: email,
      role: 'Admin'
    })
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

  // Admin Routes
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />
  }

  return (
    <Layout user={currentUser} onLogout={handleLogout}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/documents" element={<Documents />} />
        <Route path="/documents/:id" element={<DocumentViewer />} />
        <Route path="/users" element={<Users />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/clients" element={<Clients />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )
}

export default App
