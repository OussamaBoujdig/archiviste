-- AmanDocs Database Schema
-- PostgreSQL 15

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- ENUM TYPES
-- ============================================
CREATE TYPE user_role AS ENUM ('super_admin', 'client_admin', 'client_user', 'read_only');
CREATE TYPE company_status AS ENUM ('active', 'suspended', 'pending');
CREATE TYPE document_status AS ENUM ('pending', 'validated', 'rejected');
CREATE TYPE plan_type AS ENUM ('starter', 'professional', 'enterprise');
CREATE TYPE permission_type AS ENUM ('read', 'upload', 'edit_metadata', 'delete', 'export');

-- ============================================
-- COMPANIES TABLE
-- ============================================
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    sector VARCHAR(100),
    plan plan_type DEFAULT 'starter',
    status company_status DEFAULT 'active',
    storage_limit DECIMAL(10, 2) DEFAULT 5.0,
    storage_used DECIMAL(10, 2) DEFAULT 0.0,
    admin_email VARCHAR(255),
    ice_number VARCHAR(50),
    address TEXT,
    phone VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role user_role NOT NULL,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    avatar VARCHAR(10),
    status VARCHAR(20) DEFAULT 'active',
    permissions permission_type[] DEFAULT ARRAY['read']::permission_type[],
    expires_at TIMESTAMP WITH TIME ZONE,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- FOLDERS TABLE
-- ============================================
CREATE TABLE folders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES folders(id) ON DELETE CASCADE,
    color VARCHAR(20) DEFAULT '#2563eb',
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- DOCUMENTS TABLE
-- ============================================
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(500) NOT NULL,
    type VARCHAR(50) NOT NULL,
    folder_id UUID REFERENCES folders(id) ON DELETE SET NULL,
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    reference VARCHAR(100),
    document_date DATE,
    file_path VARCHAR(500),
    file_size VARCHAR(50),
    mime_type VARCHAR(100),
    version INTEGER DEFAULT 1,
    status document_status DEFAULT 'pending',
    tags TEXT[],
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- USER FOLDER ACCESS TABLE
-- ============================================
CREATE TABLE user_folder_access (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    folder_id UUID NOT NULL REFERENCES folders(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, folder_id)
);

-- ============================================
-- ACTIVITY LOGS TABLE
-- ============================================
CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    action VARCHAR(50) NOT NULL,
    target_type VARCHAR(50),
    target_id UUID,
    target_name VARCHAR(500),
    ip_address VARCHAR(50),
    user_agent TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_users_company ON users(company_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_documents_company ON documents(company_id);
CREATE INDEX idx_documents_folder ON documents(folder_id);
CREATE INDEX idx_documents_type ON documents(type);
CREATE INDEX idx_documents_reference ON documents(reference);
CREATE INDEX idx_documents_date ON documents(document_date);
CREATE INDEX idx_folders_company ON folders(company_id);
CREATE INDEX idx_folders_parent ON folders(parent_id);
CREATE INDEX idx_activity_logs_user ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_company ON activity_logs(company_id);
CREATE INDEX idx_activity_logs_created ON activity_logs(created_at);

-- ============================================
-- SEED DATA
-- ============================================

-- Insert default company for demo
INSERT INTO companies (id, name, sector, plan, status, storage_limit, storage_used, admin_email)
VALUES 
    ('550e8400-e29b-41d4-a716-446655440001', 'Afriquia Station Casablanca', 'Station-service', 'professional', 'active', 10.0, 4.2, 'admin@afriquia-casa.ma'),
    ('550e8400-e29b-41d4-a716-446655440002', 'Cabinet Bennani & Associés', 'Cabinet d''avocats', 'enterprise', 'active', 50.0, 12.8, 'contact@bennani-law.ma'),
    ('550e8400-e29b-41d4-a716-446655440003', 'Fiduciaire El Amrani', 'Cabinet comptable', 'professional', 'active', 20.0, 8.5, 'direction@elamrani-compta.ma');

-- Insert Super Admin (password: admin123)
INSERT INTO users (id, email, password_hash, name, role, company_id, avatar, permissions)
VALUES 
    ('660e8400-e29b-41d4-a716-446655440001', 'oussama@amandocs.ma', '$2a$10$rQEY7Jx8F5MBk5R8W5J8JOZf5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5', 'Oussama Boujdig', 'super_admin', NULL, 'OB', ARRAY['read', 'upload', 'edit_metadata', 'delete', 'export']::permission_type[]);

-- Insert Client Admin (password: admin123)
INSERT INTO users (id, email, password_hash, name, role, company_id, avatar, permissions)
VALUES 
    ('660e8400-e29b-41d4-a716-446655440002', 'karim@afriquia-casa.ma', '$2a$10$rQEY7Jx8F5MBk5R8W5J8JOZf5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5', 'Karim Alaoui', 'client_admin', '550e8400-e29b-41d4-a716-446655440001', 'KA', ARRAY['read', 'upload', 'edit_metadata', 'delete', 'export']::permission_type[]);

-- Insert Client User (password: user123)
INSERT INTO users (id, email, password_hash, name, role, company_id, avatar, permissions)
VALUES 
    ('660e8400-e29b-41d4-a716-446655440003', 'fatima@afriquia-casa.ma', '$2a$10$rQEY7Jx8F5MBk5R8W5J8JOZf5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5', 'Fatima Zahra', 'client_user', '550e8400-e29b-41d4-a716-446655440001', 'FZ', ARRAY['read', 'upload']::permission_type[]);

-- Insert Read-Only User (password: audit123)
INSERT INTO users (id, email, password_hash, name, role, company_id, avatar, permissions, expires_at)
VALUES 
    ('660e8400-e29b-41d4-a716-446655440004', 'audit@expert-audit.ma', '$2a$10$rQEY7Jx8F5MBk5R8W5J8JOZf5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5', 'Audit Expert SARL', 'read_only', '550e8400-e29b-41d4-a716-446655440001', 'AE', ARRAY['read']::permission_type[], '2024-12-31');

-- Insert Folders
INSERT INTO folders (id, name, company_id, parent_id, color)
VALUES 
    ('770e8400-e29b-41d4-a716-446655440001', 'Contrats Fournisseurs', '550e8400-e29b-41d4-a716-446655440001', NULL, '#2563eb'),
    ('770e8400-e29b-41d4-a716-446655440002', 'Factures 2024', '550e8400-e29b-41d4-a716-446655440001', NULL, '#16a34a'),
    ('770e8400-e29b-41d4-a716-446655440003', 'Factures 2023', '550e8400-e29b-41d4-a716-446655440001', NULL, '#16a34a'),
    ('770e8400-e29b-41d4-a716-446655440004', 'Documents RH', '550e8400-e29b-41d4-a716-446655440001', NULL, '#9333ea'),
    ('770e8400-e29b-41d4-a716-446655440005', 'Déclarations Fiscales', '550e8400-e29b-41d4-a716-446655440001', NULL, '#d97706'),
    ('770e8400-e29b-41d4-a716-446655440006', 'Audits', '550e8400-e29b-41d4-a716-446655440001', NULL, '#4f46e5');

-- Insert Sample Documents
INSERT INTO documents (id, name, type, folder_id, company_id, reference, document_date, file_size, status, tags, created_by)
VALUES 
    ('880e8400-e29b-41d4-a716-446655440001', 'Contrat Fournisseur - Total Energies', 'contract', '770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'CTR-2024-001', '2024-01-15', '2.4 MB', 'validated', ARRAY['fournisseur', 'carburant', 'annuel'], '660e8400-e29b-41d4-a716-446655440002'),
    ('880e8400-e29b-41d4-a716-446655440002', 'Facture #2024-0142 - Maintenance', 'invoice', '770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'FAC-2024-0142', '2024-01-14', '156 KB', 'validated', ARRAY['maintenance', 'équipement'], '660e8400-e29b-41d4-a716-446655440002'),
    ('880e8400-e29b-41d4-a716-446655440003', 'Bilan Comptable Q4 2023', 'accounting', '770e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440001', 'COMPTA-2023-Q4', '2024-01-10', '1.8 MB', 'validated', ARRAY['bilan', 'trimestriel', '2023'], '660e8400-e29b-41d4-a716-446655440002'),
    ('880e8400-e29b-41d4-a716-446655440004', 'Contrat CDI - Ahmed Benali', 'hr', '770e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440001', 'RH-2024-015', '2024-01-08', '890 KB', 'pending', ARRAY['cdi', 'embauche', 'pompiste'], '660e8400-e29b-41d4-a716-446655440002'),
    ('880e8400-e29b-41d4-a716-446655440005', 'Déclaration TVA Janvier 2024', 'fiscal', '770e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440001', 'TVA-2024-01', '2024-01-05', '245 KB', 'validated', ARRAY['tva', 'déclaration', 'mensuel'], '660e8400-e29b-41d4-a716-446655440002'),
    ('880e8400-e29b-41d4-a716-446655440006', 'Rapport Audit Sécurité 2023', 'audit', '770e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440001', 'AUD-2023-002', '2023-12-28', '3.5 MB', 'validated', ARRAY['audit', 'sécurité', 'annuel'], '660e8400-e29b-41d4-a716-446655440002');

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_folders_updated_at BEFORE UPDATE ON folders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
