const jwt = require('jsonwebtoken');
const db = require('../config/database');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token non fourni' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const result = await db.query(
      'SELECT id, email, name, role, company_id, avatar, permissions, status, expires_at FROM users WHERE id = $1',
      [decoded.userId]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Utilisateur non trouvé' });
    }

    const user = result.rows[0];

    if (user.status !== 'active') {
      return res.status(403).json({ error: 'Compte désactivé' });
    }

    if (user.expires_at && new Date(user.expires_at) < new Date()) {
      return res.status(403).json({ error: 'Accès expiré' });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Token invalide' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expiré' });
    }
    next(error);
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Non authentifié' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    next();
  };
};

const hasPermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Non authentifié' });
    }

    if (req.user.role === 'super_admin') {
      return next();
    }

    if (!req.user.permissions || !req.user.permissions.includes(permission)) {
      return res.status(403).json({ error: `Permission '${permission}' requise` });
    }

    next();
  };
};

module.exports = { authenticate, authorize, hasPermission };
