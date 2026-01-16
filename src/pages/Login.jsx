import { useState } from 'react'
import { Archive, Mail, Lock, Shield, Users, User, FileSearch, Sparkles } from 'lucide-react'
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
      <div className="login-container" style={{ maxWidth: '520px' }}>
        <div className="login-header">
          <div className="login-logo">
            <Archive size={48} strokeWidth={2.5} />
          </div>
          <h1>AmanDocs</h1>
          <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
            <Sparkles size={16} style={{ color: 'var(--primary)' }} />
            Gestion sécurisée de vos archives numériques
            <Sparkles size={16} style={{ color: 'var(--accent)' }} />
          </p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {/* Role Selection for Demo */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '1rem', 
              fontWeight: '600', 
              color: 'var(--gray-800)',
              fontSize: '0.9375rem',
              textAlign: 'center'
            }}>
              🎭 Mode Démo - Sélectionnez votre rôle
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
              {roles.map((role) => (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => setSelectedRole(role.id)}
                  className="role-card"
                  style={{
                    padding: '1.125rem',
                    borderRadius: 'var(--radius-xl)',
                    border: selectedRole === role.id ? `2px solid ${role.color}` : '2px solid var(--gray-200)',
                    backgroundColor: selectedRole === role.id ? `${role.color}15` : 'white',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'var(--transition)',
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: selectedRole === role.id ? `0 4px 12px ${role.color}30` : 'var(--shadow-sm)'
                  }}
                >
                  {selectedRole === role.id && (
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      width: '40px',
                      height: '40px',
                      background: `linear-gradient(135deg, ${role.color}, transparent)`,
                      opacity: 0.2
                    }} />
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.375rem', position: 'relative' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: 'var(--radius-lg)',
                      background: `${role.color}20`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <role.icon size={18} color={role.color} strokeWidth={2.5} />
                    </div>
                    <span style={{ fontWeight: '700', fontSize: '0.875rem', color: 'var(--gray-900)' }}>{role.label}</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--gray-600)', paddingLeft: '0.25rem' }}>{role.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label htmlFor="email" style={{ fontWeight: '600', color: 'var(--gray-800)' }}>Adresse email</label>
            <div className="input-with-icon">
              <Mail size={20} />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                style={{ fontSize: '0.9375rem' }}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="password" style={{ fontWeight: '600', color: 'var(--gray-800)' }}>Mot de passe</label>
            <div className="input-with-icon">
              <Lock size={20} />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: '40px', fontSize: '0.9375rem' }}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-lg" style={{ fontSize: '1rem', fontWeight: '700' }}>
            <span>Se connecter</span>
            <span style={{ marginLeft: '0.5rem' }}>→</span>
          </button>
        </form>

        <div style={{
          marginTop: '2rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid var(--gray-200)',
          textAlign: 'center'
        }}>
          <p style={{ 
            fontSize: '0.8125rem',
            color: 'var(--gray-500)',
            marginBottom: '0.5rem'
          }}>
            Mot de passe oublié ?{' '}
            <a href="#" style={{ color: 'var(--primary)', fontWeight: '600', textDecoration: 'none' }}>
              Réinitialiser
            </a>
          </p>
          <p style={{ 
            fontSize: '0.75rem',
            color: 'var(--gray-400)',
            marginTop: '0.75rem'
          }}>
            © 2024 AmanDocs. Tous droits réservés.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
