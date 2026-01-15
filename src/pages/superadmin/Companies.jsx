import { useState } from 'react'
import { 
  Building2, Search, Plus, Edit, Trash2, MoreVertical,
  CheckCircle, XCircle, HardDrive, Users, FileText, X
} from 'lucide-react'
import { mockCompanies, PLANS } from '../../data/mockData'

function CompaniesManagement() {
  const [companies, setCompanies] = useState(mockCompanies)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingCompany, setEditingCompany] = useState(null)

  const filteredCompanies = companies.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.sector.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusBadge = (status) => {
    if (status === 'active') {
      return <span className="badge badge-green"><CheckCircle size={12} /> Actif</span>
    }
    return <span className="badge badge-orange"><XCircle size={12} /> Suspendu</span>
  }

  const handleEdit = (company) => {
    setEditingCompany(company)
    setShowModal(true)
  }

  const handleToggleStatus = (companyId) => {
    setCompanies(companies.map(c => 
      c.id === companyId 
        ? { ...c, status: c.status === 'active' ? 'suspended' : 'active' }
        : c
    ))
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Gestion des entreprises</h1>
          <p className="page-subtitle">Gérez les entreprises clientes de la plateforme</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setEditingCompany(null); setShowModal(true); }}>
          <Plus size={18} />
          Nouvelle entreprise
        </button>
      </div>

      {/* Stats */}
      <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
        <div className="stat-card">
          <div className="stat-icon blue"><Building2 size={24} /></div>
          <div className="stat-content">
            <h3>Total entreprises</h3>
            <div className="stat-value">{companies.length}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green"><CheckCircle size={24} /></div>
          <div className="stat-content">
            <h3>Actives</h3>
            <div className="stat-value">{companies.filter(c => c.status === 'active').length}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon orange"><XCircle size={24} /></div>
          <div className="stat-content">
            <h3>Suspendues</h3>
            <div className="stat-value">{companies.filter(c => c.status === 'suspended').length}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple"><HardDrive size={24} /></div>
          <div className="stat-content">
            <h3>Stockage total</h3>
            <div className="stat-value">{companies.reduce((acc, c) => acc + c.storageUsed, 0).toFixed(1)} GB</div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="table-container">
        <div className="table-header">
          <div className="search-box">
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Rechercher une entreprise..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCompanies.map((company) => (
              <tr key={company.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '0.5rem',
                      backgroundColor: '#dbeafe',
                      color: '#2563eb',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '600'
                    }}>
                      {company.name.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight: '500' }}>{company.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>{company.adminEmail}</div>
                    </div>
                  </div>
                </td>
                <td>{company.sector}</td>
                <td>
                  <span className={`badge ${company.plan === 'enterprise' ? 'badge-purple' : company.plan === 'professional' ? 'badge-blue' : 'badge-gray'}`}>
                    {PLANS.find(p => p.id === company.plan)?.name}
                  </span>
                </td>
                <td>
                  <div>
                    <div style={{ fontSize: '0.875rem' }}>{company.storageUsed} / {company.storageLimit} GB</div>
                    <div style={{ 
                      width: '80px', 
                      height: '4px', 
                      backgroundColor: 'var(--gray-200)', 
                      borderRadius: '2px',
                      marginTop: '0.25rem'
                    }}>
                      <div style={{ 
                        width: `${(company.storageUsed / company.storageLimit) * 100}%`, 
                        height: '100%', 
                        backgroundColor: company.storageUsed / company.storageLimit > 0.8 ? 'var(--danger)' : 'var(--primary)',
                        borderRadius: '2px'
                      }} />
                    </div>
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FileText size={16} color="var(--gray-400)" />
                    {company.documentsCount.toLocaleString()}
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Users size={16} color="var(--gray-400)" />
                    {company.usersCount}
                  </div>
                </td>
                <td>{getStatusBadge(company.status)}</td>
                <td>
                  <div className="actions-cell">
                    <button className="btn btn-secondary btn-sm" onClick={() => handleEdit(company)}>
                      <Edit size={16} />
                    </button>
                    <button 
                      className={`btn btn-sm ${company.status === 'active' ? 'btn-secondary' : 'btn-primary'}`}
                      onClick={() => handleToggleStatus(company.id)}
                    >
                      {company.status === 'active' ? <XCircle size={16} /> : <CheckCircle size={16} />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredCompanies.length === 0 && (
          <div className="empty-state">
            <Building2 size={48} />
            <h3>Aucune entreprise trouvée</h3>
            <p>Modifiez vos critères de recherche</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {editingCompany ? 'Modifier l\'entreprise' : 'Nouvelle entreprise'}
              </h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Nom de l'entreprise</label>
                <input type="text" defaultValue={editingCompany?.name} placeholder="Nom de l'entreprise" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Secteur</label>
                  <select defaultValue={editingCompany?.sector}>
                    <option>Station-service</option>
                    <option>Cabinet d'avocats</option>
                    <option>Cabinet comptable</option>
                    <option>Administration</option>
                    <option>Autre</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Plan</label>
                  <select defaultValue={editingCompany?.plan}>
                    {PLANS.map(plan => (
                      <option key={plan.id} value={plan.id}>{plan.name} - {plan.price} DH/mois</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Email administrateur</label>
                <input type="email" defaultValue={editingCompany?.adminEmail} placeholder="admin@entreprise.ma" />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Annuler</button>
              <button className="btn btn-primary" onClick={() => setShowModal(false)}>
                {editingCompany ? 'Enregistrer' : 'Créer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CompaniesManagement
