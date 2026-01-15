const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const { authenticate } = require('../middleware/auth');

// Login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email et mot de passe requis' });
    }

    const result = await db.query(
      `SELECT u.*, c.name as company_name, c.status as company_status 
       FROM users u 
       LEFT JOIN companies c ON u.company_id = c.id 
       WHERE u.email = $1`,
      [email.toLowerCase()]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    const user = result.rows[0];

    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    if (user.status !== 'active') {
      return res.status(403).json({ error: 'Compte désactivé' });
    }

    if (user.company_id && user.company_status === 'suspended') {
      return res.status(403).json({ error: 'Entreprise suspendue' });
    }

    // Update last login
    await db.query('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1', [user.id]);

    // Log activity
    await db.query(
      `INSERT INTO activity_logs (user_id, company_id, action, target_type, target_name, ip_address)
       VALUES ($1, $2, 'login', 'user', $3, $4)`,
      [user.id, user.company_id, user.name, req.ip]
    );

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        companyId: user.company_id,
        companyName: user.company_name,
        avatar: user.avatar,
        permissions: user.permissions,
        expiresAt: user.expires_at
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get current user
router.get('/me', authenticate, async (req, res, next) => {
  try {
    const result = await db.query(
      `SELECT u.id, u.email, u.name, u.role, u.company_id, u.avatar, u.permissions, u.expires_at,
              c.name as company_name, c.sector as company_sector, c.plan as company_plan,
              c.storage_used, c.storage_limit
       FROM users u
       LEFT JOIN companies c ON u.company_id = c.id
       WHERE u.id = $1`,
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    const user = result.rows[0];
    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      companyId: user.company_id,
      companyName: user.company_name,
      companySector: user.company_sector,
      companyPlan: user.company_plan,
      storageUsed: user.storage_used,
      storageLimit: user.storage_limit,
      avatar: user.avatar,
      permissions: user.permissions,
      expiresAt: user.expires_at
    });
  } catch (error) {
    next(error);
  }
});

// Change password
router.put('/password', authenticate, async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Mots de passe requis' });
    }

    const result = await db.query('SELECT password_hash FROM users WHERE id = $1', [req.user.id]);
    const user = result.rows[0];

    const isValidPassword = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Mot de passe actuel incorrect' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.query('UPDATE users SET password_hash = $1 WHERE id = $2', [hashedPassword, req.user.id]);

    res.json({ message: 'Mot de passe modifié avec succès' });
  } catch (error) {
    next(error);
  }
});

// Logout (client-side, just log the activity)
router.post('/logout', authenticate, async (req, res, next) => {
  try {
    await db.query(
      `INSERT INTO activity_logs (user_id, company_id, action, target_type, target_name, ip_address)
       VALUES ($1, $2, 'logout', 'user', $3, $4)`,
      [req.user.id, req.user.company_id, req.user.name, req.ip]
    );

    res.json({ message: 'Déconnexion réussie' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
