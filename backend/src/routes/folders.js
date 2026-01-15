const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticate, authorize, hasPermission } = require('../middleware/auth');

// Get folders for current user's company
router.get('/', authenticate, async (req, res, next) => {
  try {
    let query = `
      SELECT f.*, 
             (SELECT COUNT(*) FROM documents WHERE folder_id = f.id) as documents_count,
             u.name as created_by_name
      FROM folders f
      LEFT JOIN users u ON f.created_by = u.id
    `;
    const params = [];

    if (req.user.role === 'super_admin') {
      query += ' ORDER BY f.company_id, f.name';
    } else {
      query += ' WHERE f.company_id = $1 ORDER BY f.name';
      params.push(req.user.company_id);
    }

    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

// Get single folder
router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await db.query(`
      SELECT f.*, 
             (SELECT COUNT(*) FROM documents WHERE folder_id = f.id) as documents_count,
             u.name as created_by_name
      FROM folders f
      LEFT JOIN users u ON f.created_by = u.id
      WHERE f.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Dossier non trouvé' });
    }

    const folder = result.rows[0];

    // Check access
    if (req.user.role !== 'super_admin' && req.user.company_id !== folder.company_id) {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    res.json(folder);
  } catch (error) {
    next(error);
  }
});

// Create folder
router.post('/', authenticate, authorize('super_admin', 'client_admin'), async (req, res, next) => {
  try {
    const { name, parentId, color } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Nom du dossier requis' });
    }

    const companyId = req.user.role === 'super_admin' ? req.body.companyId : req.user.company_id;

    if (!companyId) {
      return res.status(400).json({ error: 'ID de l\'entreprise requis' });
    }

    const result = await db.query(`
      INSERT INTO folders (name, company_id, parent_id, color, created_by)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [name, companyId, parentId, color || '#2563eb', req.user.id]);

    // Log activity
    await db.query(`
      INSERT INTO activity_logs (user_id, company_id, action, target_type, target_id, target_name, ip_address)
      VALUES ($1, $2, 'create', 'folder', $3, $4, $5)
    `, [req.user.id, companyId, result.rows[0].id, name, req.ip]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// Update folder
router.put('/:id', authenticate, authorize('super_admin', 'client_admin'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, parentId, color } = req.body;

    // Get folder to check access
    const folderResult = await db.query('SELECT * FROM folders WHERE id = $1', [id]);
    if (folderResult.rows.length === 0) {
      return res.status(404).json({ error: 'Dossier non trouvé' });
    }

    const folder = folderResult.rows[0];

    // Check access
    if (req.user.role !== 'super_admin' && req.user.company_id !== folder.company_id) {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    const result = await db.query(`
      UPDATE folders SET
        name = COALESCE($1, name),
        parent_id = $2,
        color = COALESCE($3, color)
      WHERE id = $4
      RETURNING *
    `, [name, parentId, color, id]);

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// Delete folder
router.delete('/:id', authenticate, authorize('super_admin', 'client_admin'), async (req, res, next) => {
  try {
    const { id } = req.params;

    // Get folder to check access
    const folderResult = await db.query('SELECT * FROM folders WHERE id = $1', [id]);
    if (folderResult.rows.length === 0) {
      return res.status(404).json({ error: 'Dossier non trouvé' });
    }

    const folder = folderResult.rows[0];

    // Check access
    if (req.user.role !== 'super_admin' && req.user.company_id !== folder.company_id) {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    await db.query('DELETE FROM folders WHERE id = $1', [id]);

    // Log activity
    await db.query(`
      INSERT INTO activity_logs (user_id, company_id, action, target_type, target_name, ip_address)
      VALUES ($1, $2, 'delete', 'folder', $3, $4)
    `, [req.user.id, folder.company_id, folder.name, req.ip]);

    res.json({ message: 'Dossier supprimé' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
