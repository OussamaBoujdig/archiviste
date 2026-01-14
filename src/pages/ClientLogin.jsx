import { useState } from 'react'
import { Archive, Mail, Lock, Building2 } from 'lucide-react'

function ClientLogin({ onClientLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (email && password) {
      onClientLogin(email)
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <h1>
            <Archive size={36} color="#2563eb" />
            Archivist
          </h1>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            marginTop: '0.75rem',
            padding: '0.5rem 1rem',
            backgroundColor: 'var(--gray-100)',
            borderRadius: '0.5rem'
          }}>
            <Building2 size={18} color="var(--gray-600)" />
            <span style={{ color: 'var(--gray-600)', fontSize: '0.875rem', fontWeight: '500' }}>
              Espace Client
            </span>
          </div>
          <p style={{ marginTop: '0.75rem' }}>Accédez à vos archives numériques</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Adresse e-mail
            </label>
            <div style={{ position: 'relative' }}>
              <Mail 
                size={18} 
                style={{ 
                  position: 'absolute', 
                  left: '12px', 
                  top: '50%', 
                  transform: 'translateY(-50%)',
                  color: 'var(--gray-400)'
                }} 
              />
              <input
                id="email"
                type="email"
                className="form-input"
                placeholder="contact@votre-entreprise.fr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ paddingLeft: '40px' }}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Mot de passe
            </label>
            <div style={{ position: 'relative' }}>
              <Lock 
                size={18} 
                style={{ 
                  position: 'absolute', 
                  left: '12px', 
                  top: '50%', 
                  transform: 'translateY(-50%)',
                  color: 'var(--gray-400)'
                }} 
              />
              <input
                id="password"
                type="password"
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
            Accéder à mes archives
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

        <div style={{
          marginTop: '2rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid var(--gray-200)',
          textAlign: 'center'
        }}>
          <p style={{ fontSize: '0.8125rem', color: 'var(--gray-500)' }}>
            Vous êtes administrateur ?{' '}
            <a href="/" style={{ color: 'var(--primary)', fontWeight: '500' }}>
              Connexion admin
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default ClientLogin
