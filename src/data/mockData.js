// ============================================
// USER ROLES
// ============================================
export const USER_ROLES = {
  SUPER_ADMIN: 'super_admin',
  CLIENT_ADMIN: 'client_admin',
  CLIENT_USER: 'client_user',
  READ_ONLY: 'read_only'
};

// ============================================
// PERMISSIONS
// ============================================
export const PERMISSIONS = {
  READ: 'read',
  UPLOAD: 'upload',
  EDIT_METADATA: 'edit_metadata',
  DELETE: 'delete',
  EXPORT: 'export'
};

// ============================================
// DOCUMENT TYPES
// ============================================
export const DOCUMENT_TYPES = [
  { id: 'invoice', label: 'Facture', color: '#16a34a' },
  { id: 'contract', label: 'Contrat', color: '#2563eb' },
  { id: 'hr', label: 'RH', color: '#9333ea' },
  { id: 'legal', label: 'Juridique', color: '#dc2626' },
  { id: 'fiscal', label: 'Fiscal', color: '#d97706' },
  { id: 'accounting', label: 'Comptabilité', color: '#0891b2' },
  { id: 'audit', label: 'Audit', color: '#4f46e5' },
  { id: 'admin', label: 'Administratif', color: '#64748b' }
];

// ============================================
// COMPANIES (for Super Admin)
// ============================================
export const mockCompanies = [
  {
    id: 'comp_001',
    name: 'Afriquia Station Casablanca',
    sector: 'Station-service',
    plan: 'professional',
    status: 'active',
    storageUsed: 4.2,
    storageLimit: 10,
    documentsCount: 1247,
    usersCount: 8,
    adminEmail: 'admin@afriquia-casa.ma',
    createdAt: '2023-06-15',
    lastActivity: '2024-01-15 14:32'
  },
  {
    id: 'comp_002',
    name: 'Cabinet Bennani & Associés',
    sector: 'Cabinet d\'avocats',
    plan: 'enterprise',
    status: 'active',
    storageUsed: 12.8,
    storageLimit: 50,
    documentsCount: 3456,
    usersCount: 15,
    adminEmail: 'contact@bennani-law.ma',
    createdAt: '2023-03-20',
    lastActivity: '2024-01-15 16:45'
  },
  {
    id: 'comp_003',
    name: 'Fiduciaire El Amrani',
    sector: 'Cabinet comptable',
    plan: 'professional',
    status: 'active',
    storageUsed: 8.5,
    storageLimit: 20,
    documentsCount: 2890,
    usersCount: 12,
    adminEmail: 'direction@elamrani-compta.ma',
    createdAt: '2023-08-10',
    lastActivity: '2024-01-15 11:20'
  },
  {
    id: 'comp_004',
    name: 'Commune Urbaine Rabat',
    sector: 'Administration',
    plan: 'enterprise',
    status: 'active',
    storageUsed: 25.3,
    storageLimit: 100,
    documentsCount: 8920,
    usersCount: 45,
    adminEmail: 'archives@rabat.gov.ma',
    createdAt: '2022-11-05',
    lastActivity: '2024-01-15 17:10'
  },
  {
    id: 'comp_005',
    name: 'Shell Station Marrakech',
    sector: 'Station-service',
    plan: 'starter',
    status: 'suspended',
    storageUsed: 1.2,
    storageLimit: 5,
    documentsCount: 234,
    usersCount: 3,
    adminEmail: 'manager@shell-marrakech.ma',
    createdAt: '2024-01-02',
    lastActivity: '2024-01-10 09:15'
  }
];

// ============================================
// FOLDERS
// ============================================
export const mockFolders = [
  { id: 'fold_001', name: 'Contrats Fournisseurs', companyId: 'comp_001', parentId: null, documentsCount: 45, color: '#2563eb' },
  { id: 'fold_002', name: 'Factures 2024', companyId: 'comp_001', parentId: null, documentsCount: 128, color: '#16a34a' },
  { id: 'fold_003', name: 'Factures 2023', companyId: 'comp_001', parentId: null, documentsCount: 456, color: '#16a34a' },
  { id: 'fold_004', name: 'Documents RH', companyId: 'comp_001', parentId: null, documentsCount: 89, color: '#9333ea' },
  { id: 'fold_005', name: 'Contrats Employés', companyId: 'comp_001', parentId: 'fold_004', documentsCount: 32, color: '#9333ea' },
  { id: 'fold_006', name: 'Fiches de Paie', companyId: 'comp_001', parentId: 'fold_004', documentsCount: 57, color: '#9333ea' },
  { id: 'fold_007', name: 'Déclarations Fiscales', companyId: 'comp_001', parentId: null, documentsCount: 67, color: '#d97706' },
  { id: 'fold_008', name: 'Audits', companyId: 'comp_001', parentId: null, documentsCount: 12, color: '#4f46e5' },
  { id: 'fold_009', name: 'Documents Légaux', companyId: 'comp_001', parentId: null, documentsCount: 34, color: '#dc2626' }
];

// ============================================
// DOCUMENTS
// ============================================
export const mockDocuments = [
  {
    id: 'doc_001',
    name: 'Contrat Fournisseur - Total Energies',
    type: 'contract',
    folderId: 'fold_001',
    companyId: 'comp_001',
    reference: 'CTR-2024-001',
    date: '2024-01-15',
    size: '2.4 MB',
    version: 1,
    createdBy: 'user_002',
    createdAt: '2024-01-15 09:30',
    tags: ['fournisseur', 'carburant', 'annuel'],
    status: 'validated'
  },
  {
    id: 'doc_002',
    name: 'Facture #2024-0142 - Maintenance',
    type: 'invoice',
    folderId: 'fold_002',
    companyId: 'comp_001',
    reference: 'FAC-2024-0142',
    date: '2024-01-14',
    size: '156 KB',
    version: 1,
    createdBy: 'user_002',
    createdAt: '2024-01-14 14:20',
    tags: ['maintenance', 'équipement'],
    status: 'validated'
  },
  {
    id: 'doc_003',
    name: 'Bilan Comptable Q4 2023',
    type: 'accounting',
    folderId: 'fold_007',
    companyId: 'comp_001',
    reference: 'COMPTA-2023-Q4',
    date: '2024-01-10',
    size: '1.8 MB',
    version: 2,
    createdBy: 'user_002',
    createdAt: '2024-01-10 11:45',
    tags: ['bilan', 'trimestriel', '2023'],
    status: 'validated'
  },
  {
    id: 'doc_004',
    name: 'Contrat CDI - Ahmed Benali',
    type: 'hr',
    folderId: 'fold_005',
    companyId: 'comp_001',
    reference: 'RH-2024-015',
    date: '2024-01-08',
    size: '890 KB',
    version: 1,
    createdBy: 'user_002',
    createdAt: '2024-01-08 10:00',
    tags: ['cdi', 'embauche', 'pompiste'],
    status: 'pending'
  },
  {
    id: 'doc_005',
    name: 'Déclaration TVA Janvier 2024',
    type: 'fiscal',
    folderId: 'fold_007',
    companyId: 'comp_001',
    reference: 'TVA-2024-01',
    date: '2024-01-05',
    size: '245 KB',
    version: 1,
    createdBy: 'user_002',
    createdAt: '2024-01-05 16:30',
    tags: ['tva', 'déclaration', 'mensuel'],
    status: 'validated'
  },
  {
    id: 'doc_006',
    name: 'Rapport Audit Sécurité 2023',
    type: 'audit',
    folderId: 'fold_008',
    companyId: 'comp_001',
    reference: 'AUD-2023-002',
    date: '2023-12-28',
    size: '3.5 MB',
    version: 1,
    createdBy: 'user_002',
    createdAt: '2023-12-28 15:00',
    tags: ['audit', 'sécurité', 'annuel'],
    status: 'validated'
  },
  {
    id: 'doc_007',
    name: 'Facture #2023-0891 - Électricité',
    type: 'invoice',
    folderId: 'fold_003',
    companyId: 'comp_001',
    reference: 'FAC-2023-0891',
    date: '2023-12-22',
    size: '178 KB',
    version: 1,
    createdBy: 'user_003',
    createdAt: '2023-12-22 09:15',
    tags: ['électricité', 'one', 'mensuel'],
    status: 'validated'
  },
  {
    id: 'doc_008',
    name: 'Licence Exploitation Station',
    type: 'legal',
    folderId: 'fold_009',
    companyId: 'comp_001',
    reference: 'LIC-2020-001',
    date: '2020-03-15',
    size: '1.1 MB',
    version: 1,
    createdBy: 'user_002',
    createdAt: '2023-06-15 10:00',
    tags: ['licence', 'exploitation', 'légal'],
    status: 'validated'
  },
  {
    id: 'doc_009',
    name: 'Fiche de Paie - Décembre 2023',
    type: 'hr',
    folderId: 'fold_006',
    companyId: 'comp_001',
    reference: 'PAY-2023-12-ALL',
    date: '2023-12-31',
    size: '2.1 MB',
    version: 1,
    createdBy: 'user_002',
    createdAt: '2023-12-31 18:00',
    tags: ['paie', 'décembre', 'salaires'],
    status: 'validated'
  },
  {
    id: 'doc_010',
    name: 'Contrat Assurance Multirisque',
    type: 'contract',
    folderId: 'fold_001',
    companyId: 'comp_001',
    reference: 'CTR-2023-045',
    date: '2023-11-01',
    size: '4.2 MB',
    version: 2,
    createdBy: 'user_002',
    createdAt: '2023-11-01 14:30',
    tags: ['assurance', 'multirisque', 'annuel'],
    status: 'validated'
  }
];

// ============================================
// USERS
// ============================================
export const mockUsers = [
  {
    id: 'user_001',
    name: 'Oussama Boujdig',
    email: 'oussama@amandocs.ma',
    role: USER_ROLES.SUPER_ADMIN,
    companyId: null,
    avatar: 'OB',
    status: 'active',
    lastLogin: '2024-01-15 17:30',
    createdAt: '2022-01-01'
  },
  {
    id: 'user_002',
    name: 'Karim Alaoui',
    email: 'karim@afriquia-casa.ma',
    role: USER_ROLES.CLIENT_ADMIN,
    companyId: 'comp_001',
    avatar: 'KA',
    status: 'active',
    permissions: [PERMISSIONS.READ, PERMISSIONS.UPLOAD, PERMISSIONS.EDIT_METADATA, PERMISSIONS.DELETE, PERMISSIONS.EXPORT],
    lastLogin: '2024-01-15 14:32',
    createdAt: '2023-06-15'
  },
  {
    id: 'user_003',
    name: 'Fatima Zahra',
    email: 'fatima@afriquia-casa.ma',
    role: USER_ROLES.CLIENT_USER,
    companyId: 'comp_001',
    avatar: 'FZ',
    status: 'active',
    permissions: [PERMISSIONS.READ, PERMISSIONS.UPLOAD],
    folderAccess: ['fold_002', 'fold_003'],
    lastLogin: '2024-01-15 11:20',
    createdAt: '2023-07-20'
  },
  {
    id: 'user_004',
    name: 'Mohamed Tazi',
    email: 'mohamed@afriquia-casa.ma',
    role: USER_ROLES.CLIENT_USER,
    companyId: 'comp_001',
    avatar: 'MT',
    status: 'active',
    permissions: [PERMISSIONS.READ, PERMISSIONS.UPLOAD, PERMISSIONS.EDIT_METADATA],
    folderAccess: ['fold_001', 'fold_002', 'fold_003'],
    lastLogin: '2024-01-14 16:45',
    createdAt: '2023-08-10'
  },
  {
    id: 'user_005',
    name: 'Audit Expert SARL',
    email: 'audit@expert-audit.ma',
    role: USER_ROLES.READ_ONLY,
    companyId: 'comp_001',
    avatar: 'AE',
    status: 'active',
    permissions: [PERMISSIONS.READ],
    folderAccess: ['fold_007', 'fold_008'],
    expiresAt: '2024-02-15',
    lastLogin: '2024-01-12 10:00',
    createdAt: '2024-01-01'
  }
];

// ============================================
// ACTIVITY LOGS
// ============================================
export const mockActivityLogs = [
  { id: 1, userId: 'user_002', action: 'upload', target: 'Contrat Fournisseur - Total Energies', timestamp: '2024-01-15 09:30', ip: '196.200.xxx.xxx' },
  { id: 2, userId: 'user_003', action: 'view', target: 'Facture #2024-0142', timestamp: '2024-01-15 11:20', ip: '196.200.xxx.xxx' },
  { id: 3, userId: 'user_002', action: 'download', target: 'Bilan Comptable Q4 2023', timestamp: '2024-01-15 14:32', ip: '196.200.xxx.xxx' },
  { id: 4, userId: 'user_004', action: 'upload', target: 'Facture #2024-0143', timestamp: '2024-01-14 16:45', ip: '196.200.xxx.xxx' },
  { id: 5, userId: 'user_002', action: 'edit', target: 'Contrat CDI - Ahmed Benali', timestamp: '2024-01-14 15:00', ip: '196.200.xxx.xxx' },
  { id: 6, userId: 'user_005', action: 'view', target: 'Rapport Audit Sécurité 2023', timestamp: '2024-01-12 10:00', ip: '41.140.xxx.xxx' },
  { id: 7, userId: 'user_002', action: 'delete', target: 'Document temporaire', timestamp: '2024-01-11 17:30', ip: '196.200.xxx.xxx' },
  { id: 8, userId: 'user_003', action: 'upload', target: 'Facture #2023-0891', timestamp: '2023-12-22 09:15', ip: '196.200.xxx.xxx' }
];

// ============================================
// PLANS
// ============================================
export const PLANS = [
  { id: 'starter', name: 'Starter', storage: 5, users: 3, price: 300 },
  { id: 'professional', name: 'Professionnel', storage: 20, users: 15, price: 800 },
  { id: 'enterprise', name: 'Entreprise', storage: 100, users: 50, price: 2000 }
];

// ============================================
// DEMO MODE CONFIG
// ============================================
export const DEMO_CONFIG = {
  isDemo: false,
  watermark: 'DEMO',
  expiresIn: 30,
  restrictions: {
    canExport: false,
    canDelete: false,
    canUpload: false
  }
};

// ============================================
// STATS
// ============================================
export const mockStats = {
  totalDocuments: 1247,
  recentUploads: 23,
  storageUsed: 4.2,
  storageTotal: 10,
  activeUsers: 5,
  pendingDocuments: 3
};

// ============================================
// SUPER ADMIN STATS
// ============================================
export const superAdminStats = {
  totalCompanies: 5,
  activeCompanies: 4,
  totalUsers: 83,
  totalStorage: 51.8,
  monthlyRevenue: 12400,
  newCompaniesThisMonth: 1
};
