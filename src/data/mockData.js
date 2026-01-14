export const mockDocuments = [
  {
    id: 1,
    name: 'Contrat de location - Dupont SA',
    category: 'Contrats',
    date: '2024-01-15',
    size: '2.4 MB',
    type: 'pdf'
  },
  {
    id: 2,
    name: 'Facture #2024-0142',
    category: 'Factures',
    date: '2024-01-14',
    size: '156 KB',
    type: 'pdf'
  },
  {
    id: 3,
    name: 'Bilan comptable Q4 2023',
    category: 'Comptabilité',
    date: '2024-01-10',
    size: '1.8 MB',
    type: 'pdf'
  },
  {
    id: 4,
    name: 'Procès-verbal AG 2024',
    category: 'Juridique',
    date: '2024-01-08',
    size: '890 KB',
    type: 'pdf'
  },
  {
    id: 5,
    name: 'Attestation fiscale 2023',
    category: 'Fiscal',
    date: '2024-01-05',
    size: '245 KB',
    type: 'pdf'
  },
  {
    id: 6,
    name: 'Contrat fournisseur - EnergiePlus',
    category: 'Contrats',
    date: '2024-01-03',
    size: '1.2 MB',
    type: 'pdf'
  },
  {
    id: 7,
    name: 'Rapport audit interne',
    category: 'Audit',
    date: '2023-12-28',
    size: '3.5 MB',
    type: 'pdf'
  },
  {
    id: 8,
    name: 'Facture #2023-0891',
    category: 'Factures',
    date: '2023-12-22',
    size: '178 KB',
    type: 'pdf'
  }
];

export const mockUsers = [
  {
    id: 1,
    name: 'Jean Martin',
    email: 'jean.martin@entreprise.fr',
    role: 'Admin',
    lastLogin: '2024-01-15 09:30'
  },
  {
    id: 2,
    name: 'Marie Dubois',
    email: 'marie.dubois@entreprise.fr',
    role: 'Utilisateur',
    lastLogin: '2024-01-15 08:45'
  },
  {
    id: 3,
    name: 'Pierre Leroy',
    email: 'pierre.leroy@entreprise.fr',
    role: 'Utilisateur',
    lastLogin: '2024-01-14 16:20'
  },
  {
    id: 4,
    name: 'Sophie Bernard',
    email: 'sophie.bernard@entreprise.fr',
    role: 'Admin',
    lastLogin: '2024-01-14 14:10'
  },
  {
    id: 5,
    name: 'Lucas Moreau',
    email: 'lucas.moreau@entreprise.fr',
    role: 'Utilisateur',
    lastLogin: '2024-01-13 11:55'
  }
];

export const mockCategories = [
  'Contrats',
  'Factures',
  'Comptabilité',
  'Juridique',
  'Fiscal',
  'Audit',
  'RH',
  'Administratif'
];

export const mockStats = {
  totalDocuments: 1247,
  recentUploads: 23,
  storageUsed: '4.2 GB',
  storageTotal: '10 GB',
  activeUsers: 5
};
