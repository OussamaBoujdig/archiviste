import { useState } from 'react'
import { Archive, Mail, Lock, Eye, EyeOff, Shield, Users, User, FileSearch } from 'lucide-react'
import { USER_ROLES } from '../data/mockData'

function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [selectedRole, setSelectedRole] = useState(USER_ROLES.CLIENT_ADMIN)

  const roles = [
    { id: USER_ROLES.SUPER_ADMIN, label: 'Super Admin', icon: Shield, desc: 'Gestion plateforme', color: '#dc2626' },
    { id: USER_ROLES.CLIENT_ADMIN, label: 'Admin Client', icon: Users, desc: 'Gestion entreprise', color: '#2563eb' },
    { id: USER_ROLES.CLIENT_USER, label: 'Utilisateur', icon: User, desc: 'Accès documents', color: '#16a34a' },
    { id: USER_ROLES.READ_ONLY, label: 'Lecture seule', icon: FileSearch, desc: 'Auditeur', color: '#d97706' }
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    onLogin(email, selectedRole)
  }

  return (
    <div className="login-page">
      <div className="login-container" style={{ maxWidth: '480px' }}>
        <div className="login-header">
          <div className="login-logo">
            <Archive size={48} />
          </div>
          <h1>AmanDocs</h1>
          <p>Gestion sécurisée de vos archives numériques</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {/* Role Selection for Demo */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: '500', color: 'var(--gray-700)' }}>
              Connexion démo - Sélectionnez un rôle
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              {roles.map((role) => (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => setSelectedRole(role.id)}
                  style={{
                    padding: '1rem',
                    borderRadius: '0.75rem',
                    border: selectedRole === role.id ? `2px solid ${role.color}` : '2px solid var(--gray-200)',
                    backgroundColor: selectedRole === role.id ? `${role.color}10` : 'white',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <role.icon size={18} color={role.color} />
                    <span style={{ fontWeight: '600', fontSize: '0.875rem', color: 'var(--gray-900)' }}>{role.label}</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>{role.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <div className="input-with-icon">
              <Mail size={20} />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <div className="input-with-icon">
              <Lock size={20} />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: '40px' }}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary">
            Se connecter
          </button>
        </form>

        <p style={{ 
          textAlign: 'center', 
          marginTop: '1.5rem', 
          fontSize: '0.875rem',
          color: 'var(--gray-500)'
        }}>
          Mot de passe oublié ?{' '}
          <a href="#" style={{ color: 'var(--primary)' }}>
            Réinitialiser
          </a>
        </p>
      </div>
    </div>
  )
}

export default Login
