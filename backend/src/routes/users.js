const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../config/database');
const { authenticate, authorize } = require('../middleware/auth');

// Get users (filtered by company for client admins)
router.get('/', authenticate, async (req, res, next) => {
  try {
    let query = `
      SELECT u.id, u.email, u.name, u.role, u.company_id, u.avatar, u.permissions, 
             u.status, u.expires_at, u.last_login, u.created_at,
             c.name as company_name
      FROM users u
      LEFT JOIN companies c ON u.company_id = c.id
    `;
    const params = [];

    if (req.user.role === 'super_admin') {
      query += ' ORDER BY u.created_at DESC';
    } else if (req.user.role === 'client_admin') {
      query += ' WHERE u.company_id = $1 ORDER BY u.created_at DESC';
      params.push(req.user.company_id);
    } else {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

// Get single user
router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await db.query(`
      SELECT u.id, u.email, u.name, u.role, u.company_id, u.avatar, u.permissions,
             u.status, u.expires_at, u.last_login, u.created_at,
             c.name as company_name
      FROM users u
      LEFT JOIN companies c ON u.company_id = c.id
      WHERE u.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    const user = result.rows[0];

    // Check access
    if (req.user.role !== 'super_admin' && req.user.company_id !== user.company_id) {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
});

// Create user
router.post('/', authenticate, authorize('super_admin', 'client_admin'), async (req, res, next) => {
  try {
    const { email, password, name, role, companyId, permissions, expiresAt } = req.body;

    if (!email || !password || !name || !role) {
      return res.status(400).json({ error: 'Champs requis manquants' });
    }

    // Client admin can only create users in their company
    let targetCompanyId = companyId;
    if (req.user.role === 'client_admin') {
      targetCompanyId = req.user.company_id;
      if (role === 'super_admin' || role === 'client_admin') {
        return res.status(403).json({ error: 'Vous ne pouvez pas créer d\'administrateur' });
      }
    }

    // Check if email already exists
    const existingUser = await db.query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Email déjà utilisé' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const avatar = name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);

    const result = await db.query(`
      INSERT INTO users (email, password_hash, name, role, company_id, avatar, permissions, expires_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, email, name, role, company_id, avatar, permissions, status, expires_at, created_at
    `, [email.toLowerCase(), hashedPassword, name, role, targetCompanyId, avatar, permissions || ['read'], expiresAt]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// Update user
router.put('/:id', authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, role, permissions, status, expiresAt } = req.body;

    // Get user to check access
    const userResult = await db.query('SELECT * FROM users WHERE id = $1', [id]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    const targetUser = userResult.rows[0];

    // Check access
    if (req.user.role !== 'super_admin' && req.user.company_id !== targetUser.company_id) {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    // Client admin cannot modify other admins
    if (req.user.role === 'client_admin' && targetUser.role === 'client_admin' && targetUser.id !== req.user.id) {
      return res.status(403).json({ error: 'Vous ne pouvez pas modifier un autre administrateur' });
    }

    const result = await db.query(`
      UPDATE users SET
        name = COALESCE($1, name),
        role = COALESCE($2, role),
        permissions = COALESCE($3, permissions),
        status = COALESCE($4, status),
        expires_at = COALESCE($5, expires_at)
      WHERE id = $6
      RETURNING id, email, name, role, company_id, avatar, permissions, status, expires_at
    `, [name, role, permissions, status, expiresAt, id]);

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// Delete user
router.delete('/:id', authenticate, authorize('super_admin', 'client_admin'), async (req, res, next) => {
  try {
    const { id } = req.params;

    // Get user to check access
    const userResult = await db.query('SELECT * FROM users WHERE id = $1', [id]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    const targetUser = userResult.rows[0];

    // Check access
    if (req.user.role !== 'super_admin' && req.user.company_id !== targetUser.company_id) {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    // Cannot delete yourself
    if (targetUser.id === req.user.id) {
      return res.status(400).json({ error: 'Vous ne pouvez pas supprimer votre propre compte' });
    }

    await db.query('DELETE FROM users WHERE id = $1', [id]);
    res.json({ message: 'Utilisateur supprimé' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
