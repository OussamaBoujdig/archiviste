const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticate, authorize } = require('../middleware/auth');

// Get all companies (Super Admin only)
router.get('/', authenticate, authorize('super_admin'), async (req, res, next) => {
  try {
    const result = await db.query(`
      SELECT c.*,
             (SELECT COUNT(*) FROM users WHERE company_id = c.id) as users_count,
             (SELECT COUNT(*) FROM documents WHERE company_id = c.id) as documents_count
      FROM companies c
      ORDER BY c.created_at DESC
    `);

    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

// Get single company
router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check access
    if (req.user.role !== 'super_admin' && req.user.company_id !== id) {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    const result = await db.query(`
      SELECT c.*,
             (SELECT COUNT(*) FROM users WHERE company_id = c.id) as users_count,
             (SELECT COUNT(*) FROM documents WHERE company_id = c.id) as documents_count
      FROM companies c
      WHERE c.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Entreprise non trouvée' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// Create company (Super Admin only)
router.post('/', authenticate, authorize('super_admin'), async (req, res, next) => {
  try {
    const { name, sector, plan, adminEmail, iceNumber, address, phone } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Nom de l\'entreprise requis' });
    }

    const storageLimits = { starter: 5, professional: 20, enterprise: 100 };
    const storageLimit = storageLimits[plan] || 5;

    const result = await db.query(`
      INSERT INTO companies (name, sector, plan, admin_email, ice_number, address, phone, storage_limit)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `, [name, sector, plan || 'starter', adminEmail, iceNumber, address, phone, storageLimit]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// Update company
router.put('/:id', authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, sector, plan, status, adminEmail, iceNumber, address, phone } = req.body;

    // Check access
    if (req.user.role !== 'super_admin' && req.user.company_id !== id) {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    // Only super admin can change plan and status
    if (req.user.role !== 'super_admin' && (plan || status)) {
      return res.status(403).json({ error: 'Seul un Super Admin peut modifier le plan ou le statut' });
    }

    const storageLimits = { starter: 5, professional: 20, enterprise: 100 };
    const storageLimit = plan ? storageLimits[plan] : undefined;

    const result = await db.query(`
      UPDATE companies SET
        name = COALESCE($1, name),
        sector = COALESCE($2, sector),
        plan = COALESCE($3, plan),
        status = COALESCE($4, status),
        admin_email = COALESCE($5, admin_email),
        ice_number = COALESCE($6, ice_number),
        address = COALESCE($7, address),
        phone = COALESCE($8, phone),
        storage_limit = COALESCE($9, storage_limit)
      WHERE id = $10
      RETURNING *
    `, [name, sector, plan, status, adminEmail, iceNumber, address, phone, storageLimit, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Entreprise non trouvée' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// Delete company (Super Admin only)
router.delete('/:id', authenticate, authorize('super_admin'), async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await db.query('DELETE FROM companies WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Entreprise non trouvée' });
    }

    res.json({ message: 'Entreprise supprimée' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
