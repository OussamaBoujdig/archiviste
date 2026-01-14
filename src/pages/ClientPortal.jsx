import { useState } from 'react'
import { 
  Archive, FileText, Search, Download, Eye, HardDrive, Filter, LogOut,
  Clock, ChevronRight, X, Bell, User, Building2, Phone, Mail, MapPin,
  Shield, TrendingUp, CheckCircle, Activity, HelpCircle, MessageSquare,
  Star, Bookmark, Printer, DownloadCloud, BarChart3, Home, FolderOpen
} from 'lucide-react'

const clientDocuments = [
  { id: 1, name: 'Contrat de prestation 2024', category: 'Contrats', date: '2024-01-15', size: '2.4 MB', status: 'validated', addedBy: 'Cabinet Martin' },
  { id: 2, name: 'Facture #2024-0142', category: 'Factures', date: '2024-01-14', size: '156 KB', status: 'new', addedBy: 'Cabinet Martin' },
  { id: 3, name: 'Bilan comptable Q4 2023', category: 'Comptabilité', date: '2024-01-10', size: '1.8 MB', status: 'validated', addedBy: 'Cabinet Martin' },
  { id: 4, name: 'Attestation fiscale 2023', category: 'Fiscal', date: '2024-01-05', size: '245 KB', status: 'validated', addedBy: 'Cabinet Martin' },
  { id: 5, name: 'Procès-verbal assemblée 2024', category: 'Juridique', date: '2024-01-03', size: '890 KB', status: 'pending', addedBy: 'Cabinet Martin' },
  { id: 6, name: 'Facture #2023-0891', category: 'Factures', date: '2023-12-22', size: '178 KB', status: 'validated', addedBy: 'Cabinet Martin' },
  { id: 7, name: 'Contrat fournisseur EnergiePlus', category: 'Contrats', date: '2023-12-15', size: '1.2 MB', status: 'validated', addedBy: 'Cabinet Martin' },
  { id: 8, name: 'Rapport audit annuel 2023', category: 'Audit', date: '2023-12-01', size: '3.5 MB', status: 'validated', addedBy: 'Cabinet Martin' },
  { id: 9, name: 'Déclaration TVA T4 2023', category: 'Fiscal', date: '2023-11-28', size: '320 KB', status: 'validated', addedBy: 'Cabinet Martin' },
  { id: 10, name: 'Contrat de travail - M. Dupont', category: 'RH', date: '2023-11-15', size: '1.1 MB', status: 'validated', addedBy: 'Cabinet Martin' }
]

const categoryData = [
  { name: 'Contrats', count: 12, color: '#2563eb', bgColor: '#dbeafe' },
  { name: 'Factures', count: 45, color: '#16a34a', bgColor: '#dcfce7' },
  { name: 'Comptabilité', count: 23, color: '#9333ea', bgColor: '#f3e8ff' },
  { name: 'Fiscal', count: 18, color: '#d97706', bgColor: '#fef3c7' },
  { name: 'Juridique', count: 8, color: '#dc2626', bgColor: '#fee2e2' },
  { name: 'RH', count: 15, color: '#0891b2', bgColor: '#cffafe' },
  { name: 'Audit', count: 6, color: '#4f46e5', bgColor: '#e0e7ff' }
]

const activityHistory = [
  { id: 1, action: 'Document ajouté', document: 'Facture #2024-0142', date: '14 jan. 14:32', type: 'add' },
  { id: 2, action: 'Document consulté', document: 'Contrat de prestation 2024', date: '14 jan. 11:15', type: 'view' },
  { id: 3, action: 'Document téléchargé', document: 'Bilan comptable Q4 2023', date: '13 jan. 16:45', type: 'download' },
  { id: 4, action: 'Document ajouté', document: 'Attestation fiscale 2023', date: '05 jan. 09:20', type: 'add' }
]

const notifications = [
  { id: 1, title: 'Nouveau document', message: 'Facture #2024-0142 ajoutée', date: '14 jan.', read: false, type: 'info' },
  { id: 2, title: 'Document en attente', message: 'PV assemblée en validation', date: '10 jan.', read: false, type: 'warning' },
  { id: 3, title: 'Rappel échéance', message: 'TVA T1 2024 avant le 15/04', date: '08 jan.', read: true, type: 'alert' }
]

const clientInfo = {
  name: 'Cabinet Dupont & Associés',
  siret: '123 456 789 00012',
  address: '25 avenue des Champs-Élysées, 75008 Paris',
  phone: '01 42 33 44 55',
  email: 'contact@dupont-avocats.fr',
  sector: 'Juridique',
  accountManager: 'Jean Martin',
  accountManagerEmail: 'jean.martin@archivist.fr',
  contractStart: '2023-06-15',
  plan: 'Professionnel',
  storageUsed: '4.2 GB',
  storageTotal: '10 GB'
}

function ClientPortal({ client, onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Tous')
  const [viewingDocument, setViewingDocument] = useState(null)
  const [bookmarkedDocs, setBookmarkedDocs] = useState([1, 3])

  const categories = ['Tous', ...categoryData.map(c => c.name)]
  const filteredDocuments = clientDocuments.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'Tous' || doc.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const unreadNotifications = notifications.filter(n => !n.read).length
  const storagePercentage = (parseFloat(clientInfo.storageUsed) / parseFloat(clientInfo.storageTotal)) * 100

  const handleDownload = (doc) => alert(`Téléchargement de "${doc.name}" en cours...`)
  const handleView = (doc) => setViewingDocument(doc)
  const toggleBookmark = (docId) => {
    setBookmarkedDocs(prev => prev.includes(docId) ? prev.filter(id => id !== docId) : [...prev, docId])
  }

  const getStatusBadge = (status) => {
    const badges = {
      validated: <span className="badge badge-green"><CheckCircle size={12} style={{marginRight: '4px'}} />Validé</span>,
      pending: <span className="badge badge-orange"><Clock size={12} style={{marginRight: '4px'}} />En attente</span>,
      new: <span className="badge badge-blue"><Star size={12} style={{marginRight: '4px'}} />Nouveau</span>
    }
    return badges[status] || <span className="badge badge-gray">{status}</span>
  }

  const navItems = [
    { id: 'dashboard', icon: Home, label: 'Tableau de bord' },
    { id: 'documents', icon: FileText, label: 'Mes documents' },
    { id: 'categories', icon: FolderOpen, label: 'Catégories' },
    { id: 'profile', icon: Building2, label: 'Mon profil' }
  ]

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--gray-50)' }}>
      {/* Sidebar */}
      <aside style={{
        width: '260px',
        backgroundColor: 'var(--gray-800)',
        color: 'white',
        padding: '1.5rem 0',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        height: '100vh',
        left: 0,
        top: 0
      }}>
        <div style={{ padding: '0 1.5rem 1.5rem', borderBottom: '1px solid var(--gray-700)', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <Archive size={28} color="#3b82f6" />
            <span style={{ fontSize: '1.25rem', fontWeight: '700' }}>Archivist</span>
          </div>
          <div style={{
            padding: '0.375rem 0.75rem',
            backgroundColor: 'var(--primary)',
            borderRadius: '0.375rem',
            fontSize: '0.75rem',
            fontWeight: '500',
            textAlign: 'center'
          }}>
            Espace Client
          </div>
        </div>

        <nav style={{ flex: 1, padding: '0 0.75rem' }}>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: '0.5rem',
                border: 'none',
                backgroundColor: activeTab === item.id ? 'var(--primary)' : 'transparent',
                color: activeTab === item.id ? 'white' : 'var(--gray-300)',
                cursor: 'pointer',
                marginBottom: '0.25rem',
                textAlign: 'left',
                fontSize: '0.875rem'
              }}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
        </nav>

        <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--gray-700)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '600'
            }}>
              {client.name?.charAt(0) || 'C'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: '500', fontSize: '0.875rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {client.name}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>Client</div>
            </div>
          </div>
          <button
            onClick={onLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              width: '100%',
              padding: '0.5rem',
              borderRadius: '0.5rem',
              border: '1px solid var(--gray-600)',
              backgroundColor: 'transparent',
              color: 'var(--gray-300)',
              cursor: 'pointer',
              fontSize: '0.875rem'
            }}
          >
            <LogOut size={16} />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, marginLeft: '260px', padding: '2rem' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: '600', color: 'var(--gray-900)' }}>
              {navItems.find(n => n.id === activeTab)?.label}
            </h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ position: 'relative' }}>
              <button style={{
                padding: '0.5rem',
                borderRadius: '0.5rem',
                border: '1px solid var(--gray-200)',
                backgroundColor: 'white',
                cursor: 'pointer'
              }}>
                <Bell size={20} color="var(--gray-600)" />
                {unreadNotifications > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    backgroundColor: 'var(--danger)',
                    color: 'white',
                    fontSize: '0.6875rem',
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {unreadNotifications}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <>
            {/* Welcome Banner */}
            <div style={{
              background: 'linear-gradient(135deg, var(--primary) 0%, #1e40af 100%)',
              borderRadius: '1rem',
              padding: '2rem',
              color: 'white',
              marginBottom: '2rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                    Bienvenue, {client.name}
                  </h2>
                  <p style={{ opacity: 0.9 }}>Votre espace d'archives numériques sécurisé</p>
                </div>
                <div style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '1rem', borderRadius: '0.75rem' }}>
                  <div style={{ fontSize: '0.8125rem', opacity: 0.9 }}>Dernière connexion</div>
                  <div style={{ fontWeight: '600' }}>14 janvier 2024 à 09:30</div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="stats-grid" style={{ marginBottom: '2rem' }}>
              <div className="stat-card">
                <div className="stat-icon blue"><FileText size={24} /></div>
                <div className="stat-content">
                  <h3>Total documents</h3>
                  <div className="stat-value">127</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--success)' }}>+3 ce mois</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon green"><HardDrive size={24} /></div>
                <div className="stat-content">
                  <h3>Stockage</h3>
                  <div className="stat-value">{clientInfo.storageUsed}</div>
                  <div style={{ height: '4px', backgroundColor: 'var(--gray-200)', borderRadius: '2px', marginTop: '0.5rem' }}>
                    <div style={{ width: `${storagePercentage}%`, height: '100%', backgroundColor: 'var(--success)', borderRadius: '2px' }} />
                  </div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon orange"><Clock size={24} /></div>
                <div className="stat-content">
                  <h3>Dernier ajout</h3>
                  <div className="stat-value">14 jan.</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon purple"><TrendingUp size={24} /></div>
                <div className="stat-content">
                  <h3>Consultations</h3>
                  <div className="stat-value">47</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>ce mois</div>
                </div>
              </div>
            </div>

            {/* Two columns */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '1.5rem', marginBottom: '2rem' }}>
              {/* Categories */}
              <div className="card">
                <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>Parcourir par catégorie</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1rem' }}>
                  {categoryData.map((cat) => (
                    <div
                      key={cat.name}
                      onClick={() => { setSelectedCategory(cat.name); setActiveTab('documents'); }}
                      style={{
                        padding: '1rem',
                        borderRadius: '0.75rem',
                        backgroundColor: cat.bgColor,
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'transform 0.15s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                      <div style={{ fontWeight: '700', color: cat.color, fontSize: '1.25rem' }}>{cat.count}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--gray-600)' }}>{cat.name}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Activity & Notifications */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="card">
                  <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Bell size={18} /> Notifications
                    {unreadNotifications > 0 && (
                      <span style={{ backgroundColor: 'var(--danger)', color: 'white', fontSize: '0.6875rem', padding: '0.125rem 0.5rem', borderRadius: '9999px' }}>
                        {unreadNotifications}
                      </span>
                    )}
                  </h3>
                  {notifications.map((n) => (
                    <div key={n.id} style={{
                      padding: '0.75rem',
                      backgroundColor: n.read ? 'var(--gray-50)' : '#eff6ff',
                      borderRadius: '0.5rem',
                      marginBottom: '0.5rem',
                      borderLeft: `3px solid ${n.type === 'alert' ? 'var(--danger)' : n.type === 'warning' ? 'var(--warning)' : 'var(--primary)'}`
                    }}>
                      <div style={{ fontWeight: '500', fontSize: '0.8125rem' }}>{n.title}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>{n.message}</div>
                    </div>
                  ))}
                </div>

                <div className="card">
                  <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Activity size={18} /> Activité récente
                  </h3>
                  {activityHistory.map((a) => (
                    <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                      <div style={{
                        width: '32px', height: '32px', borderRadius: '50%',
                        backgroundColor: a.type === 'add' ? '#dcfce7' : a.type === 'download' ? '#dbeafe' : '#f3e8ff',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}>
                        {a.type === 'add' && <FileText size={14} color="#16a34a" />}
                        {a.type === 'view' && <Eye size={14} color="#9333ea" />}
                        {a.type === 'download' && <Download size={14} color="#2563eb" />}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.8125rem', fontWeight: '500' }}>{a.action}</div>
                        <div style={{ fontSize: '0.6875rem', color: 'var(--gray-500)' }}>{a.document}</div>
                      </div>
                      <div style={{ fontSize: '0.6875rem', color: 'var(--gray-400)' }}>{a.date}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Documents */}
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '600' }}>Documents récents</h3>
                <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('documents')}>
                  Voir tout <ChevronRight size={16} />
                </button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                {clientDocuments.slice(0, 4).map((doc) => (
                  <div
                    key={doc.id}
                    onClick={() => handleView(doc)}
                    style={{
                      padding: '1rem',
                      border: '1px solid var(--gray-200)',
                      borderRadius: '0.75rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem'
                    }}
                  >
                    <div style={{ width: '44px', height: '44px', borderRadius: '0.5rem', backgroundColor: '#fee2e2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <FileText size={22} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: '500', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{doc.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>{new Date(doc.date).toLocaleDateString('fr-FR')} • {doc.size}</div>
                    </div>
                    {getStatusBadge(doc.status)}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Documents Tab */}
        {activeTab === 'documents' && (
          <>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`btn ${selectedCategory === cat ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="table-container">
              <div className="table-header">
                <div className="search-box">
                  <Search size={18} />
                  <input type="text" placeholder="Rechercher..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <button className="btn btn-secondary btn-sm"><DownloadCloud size={16} /> Tout télécharger</button>
              </div>

              <table>
                <thead>
                  <tr>
                    <th style={{ width: '40px' }}></th>
                    <th>Document</th>
                    <th>Catégorie</th>
                    <th>Statut</th>
                    <th>Date</th>
                    <th>Taille</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDocuments.map((doc) => (
                    <tr key={doc.id}>
                      <td>
                        <button onClick={() => toggleBookmark(doc.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: bookmarkedDocs.includes(doc.id) ? 'var(--warning)' : 'var(--gray-300)' }}>
                          <Bookmark size={18} fill={bookmarkedDocs.includes(doc.id) ? 'var(--warning)' : 'none'} />
                        </button>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{ width: '36px', height: '36px', borderRadius: '0.375rem', backgroundColor: '#fee2e2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <FileText size={18} />
                          </div>
                          <div>
                            <div style={{ fontWeight: '500' }}>{doc.name}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>Par {doc.addedBy}</div>
                          </div>
                        </div>
                      </td>
                      <td><span className="badge badge-blue">{doc.category}</span></td>
                      <td>{getStatusBadge(doc.status)}</td>
                      <td>{new Date(doc.date).toLocaleDateString('fr-FR')}</td>
                      <td>{doc.size}</td>
                      <td>
                        <div className="actions-cell">
                          <button className="btn btn-secondary btn-sm" onClick={() => handleView(doc)}><Eye size={16} /></button>
                          <button className="btn btn-primary btn-sm" onClick={() => handleDownload(doc)}><Download size={16} /></button>
                          <button className="btn btn-secondary btn-sm"><Printer size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredDocuments.length === 0 && (
                <div className="empty-state"><Search size={48} /><h3>Aucun document trouvé</h3></div>
              )}
            </div>
          </>
        )}

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <>
            <p style={{ color: 'var(--gray-500)', marginBottom: '2rem' }}>Parcourez vos documents par catégorie</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
              {categoryData.map((cat) => (
                <div key={cat.name} className="card" style={{ cursor: 'pointer' }} onClick={() => { setSelectedCategory(cat.name); setActiveTab('documents'); }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <div style={{ width: '56px', height: '56px', borderRadius: '0.75rem', backgroundColor: cat.bgColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <FolderOpen size={28} color={cat.color} />
                    </div>
                    <div>
                      <div style={{ fontSize: '1.5rem', fontWeight: '700', color: cat.color }}>{cat.count}</div>
                      <div style={{ color: 'var(--gray-600)' }}>{cat.name}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--gray-100)' }}>
                    <span style={{ fontSize: '0.875rem', color: 'var(--gray-500)' }}>Voir les documents</span>
                    <ChevronRight size={18} color="var(--gray-400)" />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <Building2 size={20} color="var(--primary)" />
                <h2 style={{ fontSize: '1.125rem', fontWeight: '600' }}>Informations entreprise</h2>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div><div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>Raison sociale</div><div style={{ fontWeight: '500' }}>{clientInfo.name}</div></div>
                <div><div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>SIRET</div><div style={{ fontWeight: '500' }}>{clientInfo.siret}</div></div>
                <div><div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>Secteur</div><span className="badge badge-blue">{clientInfo.sector}</span></div>
                <div><div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MapPin size={14} />Adresse</div><div style={{ fontWeight: '500' }}>{clientInfo.address}</div></div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div><div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Phone size={14} />Téléphone</div><div style={{ fontWeight: '500' }}>{clientInfo.phone}</div></div>
                  <div><div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Mail size={14} />E-mail</div><div style={{ fontWeight: '500' }}>{clientInfo.email}</div></div>
                </div>
              </div>
            </div>

            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <Shield size={20} color="var(--primary)" />
                <h2 style={{ fontSize: '1.125rem', fontWeight: '600' }}>Compte Archivist</h2>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div><div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>Formule</div><span style={{ backgroundColor: 'var(--primary)', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '0.375rem', fontWeight: '600', fontSize: '0.875rem' }}>{clientInfo.plan}</span></div>
                <div><div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>Client depuis</div><div style={{ fontWeight: '500' }}>{new Date(clientInfo.contractStart).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' })}</div></div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginBottom: '0.5rem' }}>Stockage</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}><span style={{ fontWeight: '500' }}>{clientInfo.storageUsed}</span><span style={{ color: 'var(--gray-500)' }}>sur {clientInfo.storageTotal}</span></div>
                  <div style={{ height: '8px', backgroundColor: 'var(--gray-200)', borderRadius: '4px' }}><div style={{ width: `${storagePercentage}%`, height: '100%', backgroundColor: 'var(--primary)', borderRadius: '4px' }} /></div>
                </div>
                <div style={{ borderTop: '1px solid var(--gray-200)', paddingTop: '1rem' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginBottom: '0.5rem' }}>Gestionnaire de compte</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600' }}>JM</div>
                    <div><div style={{ fontWeight: '500' }}>{clientInfo.accountManager}</div><div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>{clientInfo.accountManagerEmail}</div></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <BarChart3 size={20} color="var(--primary)" />
                <h2 style={{ fontSize: '1.125rem', fontWeight: '600' }}>Statistiques</h2>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ padding: '1rem', backgroundColor: 'var(--gray-50)', borderRadius: '0.5rem', textAlign: 'center' }}><div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--primary)' }}>127</div><div style={{ fontSize: '0.8125rem', color: 'var(--gray-600)' }}>Documents</div></div>
                <div style={{ padding: '1rem', backgroundColor: 'var(--gray-50)', borderRadius: '0.5rem', textAlign: 'center' }}><div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--success)' }}>89</div><div style={{ fontSize: '0.8125rem', color: 'var(--gray-600)' }}>Téléchargements</div></div>
                <div style={{ padding: '1rem', backgroundColor: 'var(--gray-50)', borderRadius: '0.5rem', textAlign: 'center' }}><div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--warning)' }}>234</div><div style={{ fontSize: '0.8125rem', color: 'var(--gray-600)' }}>Consultations</div></div>
                <div style={{ padding: '1rem', backgroundColor: 'var(--gray-50)', borderRadius: '0.5rem', textAlign: 'center' }}><div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#9333ea' }}>18</div><div style={{ fontSize: '0.8125rem', color: 'var(--gray-600)' }}>Mois client</div></div>
              </div>
            </div>

            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <HelpCircle size={20} color="var(--primary)" />
                <h2 style={{ fontSize: '1.125rem', fontWeight: '600' }}>Aide & Support</h2>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <button className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}><MessageSquare size={18} />Contacter le support</button>
                <button className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}><HelpCircle size={18} />Centre d'aide</button>
                <button className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}><FileText size={18} />Documentation</button>
              </div>
              <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: '#eff6ff', borderRadius: '0.5rem', borderLeft: '3px solid var(--primary)' }}>
                <div style={{ fontWeight: '500', marginBottom: '0.25rem' }}>Besoin d'aide ?</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>Notre équipe est disponible du lundi au vendredi de 9h à 18h.</div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Document Viewer Modal */}
      {viewingDocument && (
        <div className="modal-overlay" onClick={() => setViewingDocument(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '900px' }}>
            <div className="modal-header">
              <h2 className="modal-title">{viewingDocument.name}</h2>
              <button className="modal-close" onClick={() => setViewingDocument(null)}><X size={20} /></button>
            </div>
            <div className="modal-body" style={{ padding: 0 }}>
              <div style={{ backgroundColor: 'var(--gray-100)', height: '350px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <FileText size={64} color="var(--gray-400)" />
                <h3 style={{ marginTop: '1rem', color: 'var(--gray-700)' }}>Aperçu du document</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--gray-400)', marginTop: '0.5rem' }}>(Visualiseur PDF intégré ici)</p>
              </div>
              <div style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>Informations</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div><div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>Catégorie</div><div style={{ fontWeight: '500' }}>{viewingDocument.category}</div></div>
                  <div><div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>Date</div><div style={{ fontWeight: '500' }}>{new Date(viewingDocument.date).toLocaleDateString('fr-FR')}</div></div>
                  <div><div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>Taille</div><div style={{ fontWeight: '500' }}>{viewingDocument.size}</div></div>
                  <div><div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>Statut</div>{getStatusBadge(viewingDocument.status)}</div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setViewingDocument(null)}>Fermer</button>
              <button className="btn btn-primary" onClick={() => handleDownload(viewingDocument)}><Download size={18} />Télécharger</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ClientPortal
