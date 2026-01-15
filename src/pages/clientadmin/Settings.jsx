import { useState } from 'react'
import { 
  Settings, Building2, Bell, Shield, HardDrive, Save, User
} from 'lucide-react'

function SettingsPage({ user }) {
  const [activeTab, setActiveTab] = useState('company')

  const tabs = [
    { id: 'company', label: 'Entreprise', icon: Building2 },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Sécurité', icon: Shield },
    { id: 'storage', label: 'Stockage', icon: HardDrive }
  ]

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Paramètres</h1>
          <p className="page-subtitle">Configurez votre espace de travail</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '1.5rem' }}>
        {/* Sidebar */}
        <div className="card" style={{ padding: '0.5rem' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: '0.5rem',
                border: 'none',
                backgroundColor: activeTab === tab.id ? 'var(--primary)' : 'transparent',
                color: activeTab === tab.id ? 'white' : 'var(--gray-700)',
                cursor: 'pointer',
                textAlign: 'left',
                fontSize: '0.875rem',
                fontWeight: '500',
                marginBottom: '0.25rem'
              }}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="card">
          {activeTab === 'company' && (
            <>
              <h2 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Building2 size={20} />
                Informations entreprise
              </h2>
              <div className="form-group">
                <label>Nom de l'entreprise</label>
                <input type="text" defaultValue="Afriquia Station Casablanca" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Secteur d'activité</label>
                  <select defaultValue="station">
                    <option value="station">Station-service</option>
                    <option value="law">Cabinet d'avocats</option>
                    <option value="accounting">Cabinet comptable</option>
                    <option value="admin">Administration</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Numéro ICE</label>
                  <input type="text" defaultValue="001234567890123" />
                </div>
              </div>
              <div className="form-group">
                <label>Adresse</label>
                <input type="text" defaultValue="123 Boulevard Mohammed V, Casablanca" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Téléphone</label>
                  <input type="tel" defaultValue="+212 522 123 456" />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" defaultValue="contact@afriquia-casa.ma" />
                </div>
              </div>
            </>
          )}

          {activeTab === 'notifications' && (
            <>
              <h2 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Bell size={20} />
                Notifications
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  { label: 'Nouveau document uploadé', desc: 'Recevoir une notification quand un document est ajouté' },
                  { label: 'Document en attente de validation', desc: 'Être alerté des documents nécessitant une validation' },
                  { label: 'Connexion depuis un nouvel appareil', desc: 'Alerte de sécurité pour les nouvelles connexions' },
                  { label: 'Rapport hebdomadaire', desc: 'Recevoir un résumé hebdomadaire par email' }
                ].map((item, index) => (
                  <div key={index} style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    padding: '1rem',
                    backgroundColor: 'var(--gray-50)',
                    borderRadius: '0.75rem'
                  }}>
                    <div>
                      <div style={{ fontWeight: '500' }}>{item.label}</div>
                      <div style={{ fontSize: '0.875rem', color: 'var(--gray-500)' }}>{item.desc}</div>
                    </div>
                    <label style={{ position: 'relative', display: 'inline-block', width: '48px', height: '24px' }}>
                      <input type="checkbox" defaultChecked={index < 3} style={{ opacity: 0, width: 0, height: 0 }} />
                      <span style={{
                        position: 'absolute',
                        cursor: 'pointer',
                        top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: index < 3 ? 'var(--primary)' : 'var(--gray-300)',
                        borderRadius: '24px',
                        transition: '0.3s'
                      }}>
                        <span style={{
                          position: 'absolute',
                          height: '18px',
                          width: '18px',
                          left: index < 3 ? '26px' : '3px',
                          bottom: '3px',
                          backgroundColor: 'white',
                          borderRadius: '50%',
                          transition: '0.3s'
                        }} />
                      </span>
                    </label>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeTab === 'security' && (
            <>
              <h2 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Shield size={20} />
                Sécurité
              </h2>
              <div className="form-group">
                <label>Mot de passe actuel</label>
                <input type="password" placeholder="••••••••" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Nouveau mot de passe</label>
                  <input type="password" placeholder="••••••••" />
                </div>
                <div className="form-group">
                  <label>Confirmer le mot de passe</label>
                  <input type="password" placeholder="••••••••" />
                </div>
              </div>
              <div style={{ 
                marginTop: '1.5rem',
                padding: '1rem',
                backgroundColor: '#eff6ff',
                borderRadius: '0.75rem',
                borderLeft: '3px solid var(--primary)'
              }}>
                <div style={{ fontWeight: '500', marginBottom: '0.25rem' }}>Authentification à deux facteurs</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--gray-600)', marginBottom: '0.75rem' }}>
                  Ajoutez une couche de sécurité supplémentaire à votre compte
                </div>
                <button className="btn btn-secondary btn-sm">Activer 2FA</button>
              </div>
            </>
          )}

          {activeTab === 'storage' && (
            <>
              <h2 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <HardDrive size={20} />
                Stockage
              </h2>
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: '500' }}>Espace utilisé</span>
                  <span>4.2 GB / 10 GB</span>
                </div>
                <div style={{ height: '12px', backgroundColor: 'var(--gray-200)', borderRadius: '6px', overflow: 'hidden' }}>
                  <div style={{ width: '42%', height: '100%', backgroundColor: 'var(--primary)', borderRadius: '6px' }} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                {[
                  { label: 'Documents PDF', size: '2.8 GB', percent: 67 },
                  { label: 'Images', size: '0.9 GB', percent: 21 },
                  { label: 'Autres', size: '0.5 GB', percent: 12 }
                ].map((item, index) => (
                  <div key={index} style={{ 
                    padding: '1rem',
                    backgroundColor: 'var(--gray-50)',
                    borderRadius: '0.75rem',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--primary)' }}>{item.size}</div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--gray-500)' }}>{item.label}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>{item.percent}%</div>
                  </div>
                ))}
              </div>
              <div style={{ 
                marginTop: '1.5rem',
                padding: '1rem',
                backgroundColor: '#fef3c7',
                borderRadius: '0.75rem',
                borderLeft: '3px solid var(--warning)'
              }}>
                <div style={{ fontWeight: '500', marginBottom: '0.25rem' }}>Besoin de plus d'espace ?</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>
                  Passez au plan Entreprise pour bénéficier de 100 GB de stockage.
                </div>
              </div>
            </>
          )}

          <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--gray-200)' }}>
            <button className="btn btn-primary">
              <Save size={18} />
              Enregistrer les modifications
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage
