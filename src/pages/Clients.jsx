import { useState } from 'react'
import { Building2, Plus, Edit, Trash2, FileText, Mail, Phone, MapPin } from 'lucide-react'

const mockClients = [
  {
    id: 1,
    name: 'Cabinet Dupont & Associés',
    sector: 'Juridique',
    email: 'contact@dupont-avocats.fr',
    phone: '01 42 33 44 55',
    address: '25 avenue des Champs-Élysées, 75008 Paris',
    documentsCount: 342,
    createdAt: '2023-06-15'
  },
  {
    id: 2,
    name: 'Comptabilité Martin SARL',
    sector: 'Comptabilité',
    email: 'info@compta-martin.fr',
    phone: '01 55 66 77 88',
    address: '12 rue de la Paix, 69002 Lyon',
    documentsCount: 567,
    createdAt: '2023-04-20'
  },
  {
    id: 3,
    name: 'Station Total Énergie - Marseille',
    sector: 'Énergie',
    email: 'marseille@total-energie.fr',
    phone: '04 91 22 33 44',
    address: '45 boulevard Michelet, 13008 Marseille',
    documentsCount: 128,
    createdAt: '2023-09-10'
  },
  {
    id: 4,
    name: 'PME Solutions Tech',
    sector: 'PME',
    email: 'direction@solutions-tech.fr',
    phone: '02 40 11 22 33',
    address: '8 rue du Commerce, 44000 Nantes',
    documentsCount: 89,
    createdAt: '2024-01-05'
  },
  {
    id: 5,
    name: 'Garage Bernard Auto',
    sector: 'PME',
    email: 'contact@bernard-auto.fr',
    phone: '03 88 44 55 66',
    address: '120 route de Strasbourg, 67000 Strasbourg',
    documentsCount: 121,
    createdAt: '2023-11-28'
  }
]

const sectors = ['Juridique', 'Comptabilité', 'Énergie', 'PME', 'Autre']

function Clients() {
  const [clients, setClients] = useState(mockClients)
  const [showModal, setShowModal] = useState(false)
  const [editingClient, setEditingClient] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    sector: 'PME',
    email: '',
    phone: '',
    address: ''
  })

  const openAddModal = () => {
    setEditingClient(null)
    setFormData({ name: '', sector: 'PME', email: '', phone: '', address: '' })
    setShowModal(true)
  }

  const openEditModal = (client) => {
    setEditingClient(client)
    setFormData({
      name: client.name,
      sector: client.sector,
      email: client.email,
      phone: client.phone,
      address: client.address
    })
    setShowModal(true)
  }

  const handleSubmit = () => {
    if (!formData.name || !formData.email) {
      alert('Veuillez remplir les champs obligatoires (nom et e-mail)')
      return
    }

    if (editingClient) {
      setClients(clients.map((c) =>
        c.id === editingClient.id
          ? { ...c, ...formData }
          : c
      ))
      alert('Client modifié avec succès')
    } else {
      const newClient = {
        id: Date.now(),
        ...formData,
        documentsCount: 0,
        createdAt: new Date().toISOString().split('T')[0]
      }
      setClients([...clients, newClient])
      alert('Client ajouté avec succès')
    }
    setShowModal(false)
  }

  const handleDelete = (client) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer "${client.name}" ?`)) {
      setClients(clients.filter((c) => c.id !== client.id))
      alert('Client supprimé')
    }
  }

  const getSectorBadgeClass = (sector) => {
    switch (sector) {
      case 'Juridique': return 'badge-blue'
      case 'Comptabilité': return 'badge-green'
      case 'Énergie': return 'badge-orange'
      default: return 'badge-gray'
    }
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Clients</h1>
        <p className="page-subtitle">Gérez vos entreprises clientes</p>
      </div>

      <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
        <div className="stat-card">
          <div className="stat-icon blue">
            <Building2 size={24} />
          </div>
          <div className="stat-content">
            <h3>Total clients</h3>
            <div className="stat-value">{clients.length}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">
            <FileText size={24} />
          </div>
          <div className="stat-content">
            <h3>Documents archivés</h3>
            <div className="stat-value">
              {clients.reduce((sum, c) => sum + c.documentsCount, 0).toLocaleString('fr-FR')}
            </div>
          </div>
        </div>
      </div>

      <div className="table-container">
        <div className="table-header">
          <div>
            <span style={{ color: 'var(--gray-600)' }}>
              {clients.length} client{clients.length > 1 ? 's' : ''}
            </span>
          </div>
          <button className="btn btn-primary" onClick={openAddModal}>
            <Plus size={18} />
            Ajouter un client
          </button>
        </div>

        <table>
          <thead>
            <tr>
              <th>Entreprise</th>
              <th>Secteur</th>
              <th>Contact</th>
              <th>Documents</th>
              <th>Depuis</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '0.5rem',
                      backgroundColor: 'var(--gray-100)',
                      color: 'var(--gray-600)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Building2 size={20} />
                    </div>
                    <div>
                      <div style={{ fontWeight: '500' }}>{client.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>
                        {client.address}
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`badge ${getSectorBadgeClass(client.sector)}`}>
                    {client.sector}
                  </span>
                </td>
                <td>
                  <div style={{ fontSize: '0.875rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Mail size={14} color="var(--gray-400)" />
                      {client.email}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                      <Phone size={14} color="var(--gray-400)" />
                      {client.phone}
                    </div>
                  </div>
                </td>
                <td>
                  <span style={{ fontWeight: '500' }}>{client.documentsCount}</span>
                </td>
                <td>{new Date(client.createdAt).toLocaleDateString('fr-FR')}</td>
                <td>
                  <div className="actions-cell">
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => openEditModal(client)}
                      title="Modifier"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleDelete(client)}
                      title="Supprimer"
                      style={{ color: 'var(--danger)' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {editingClient ? 'Modifier le client' : 'Ajouter un client'}
              </h2>
              <button
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Nom de l'entreprise *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Cabinet Exemple SARL"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Secteur d'activité</label>
                <select
                  className="form-select"
                  value={formData.sector}
                  onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                >
                  {sectors.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Adresse e-mail *</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="contact@entreprise.fr"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Téléphone</label>
                <input
                  type="tel"
                  className="form-input"
                  placeholder="01 23 45 67 89"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Adresse</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="123 rue Exemple, 75001 Paris"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => setShowModal(false)}
              >
                Annuler
              </button>
              <button
                className="btn btn-primary"
                onClick={handleSubmit}
              >
                {editingClient ? 'Enregistrer' : 'Ajouter'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Clients
