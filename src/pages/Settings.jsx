import { Save, Building, Bell, Shield, Database } from 'lucide-react'

function Settings() {
  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Paramètres</h1>
        <p className="page-subtitle">Configurez votre espace Archivist</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '800px' }}>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <Building size={20} color="var(--primary)" />
            <h2 style={{ fontSize: '1.125rem', fontWeight: '600' }}>Informations de l'entreprise</h2>
          </div>
          <div className="form-group">
            <label className="form-label">Nom de l'entreprise</label>
            <input 
              type="text" 
              className="form-input" 
              defaultValue="Cabinet Martin & Associés"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Secteur d'activité</label>
            <select className="form-select" defaultValue="juridique">
              <option value="juridique">Juridique / Avocats</option>
              <option value="comptable">Comptabilité / Expert-comptable</option>
              <option value="energie">Énergie / Stations-service</option>
              <option value="pme">PME / TPE</option>
              <option value="autre">Autre</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Adresse</label>
            <input 
              type="text" 
              className="form-input" 
              defaultValue="15 rue de la République, 75001 Paris"
            />
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <Bell size={20} color="var(--primary)" />
            <h2 style={{ fontSize: '1.125rem', fontWeight: '600' }}>Notifications</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked style={{ width: '18px', height: '18px' }} />
              <span>Recevoir un e-mail lors d'un nouveau téléversement</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked style={{ width: '18px', height: '18px' }} />
              <span>Alertes de stockage (80% et 90%)</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
              <input type="checkbox" style={{ width: '18px', height: '18px' }} />
              <span>Rapport hebdomadaire d'activité</span>
            </label>
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <Shield size={20} color="var(--primary)" />
            <h2 style={{ fontSize: '1.125rem', fontWeight: '600' }}>Sécurité</h2>
          </div>
          <div className="form-group">
            <label className="form-label">Authentification à deux facteurs</label>
            <select className="form-select" defaultValue="optional">
              <option value="disabled">Désactivée</option>
              <option value="optional">Optionnelle</option>
              <option value="required">Obligatoire pour tous</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Durée de session</label>
            <select className="form-select" defaultValue="8">
              <option value="1">1 heure</option>
              <option value="4">4 heures</option>
              <option value="8">8 heures</option>
              <option value="24">24 heures</option>
            </select>
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <Database size={20} color="var(--primary)" />
            <h2 style={{ fontSize: '1.125rem', fontWeight: '600' }}>Stockage</h2>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>Espace utilisé</span>
              <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>4.2 GB / 10 GB</span>
            </div>
            <div style={{ 
              height: '8px', 
              backgroundColor: 'var(--gray-200)', 
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <div style={{ 
                width: '42%', 
                height: '100%', 
                backgroundColor: 'var(--primary)',
                borderRadius: '4px'
              }} />
            </div>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--gray-500)' }}>
            Besoin de plus d'espace ? Contactez-nous pour augmenter votre quota.
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          <button className="btn btn-secondary">Annuler</button>
          <button 
            className="btn btn-primary"
            onClick={() => alert('Paramètres enregistrés avec succès !')}
          >
            <Save size={18} />
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  )
}

export default Settings
