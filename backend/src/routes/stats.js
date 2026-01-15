const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticate, authorize } = require('../middleware/auth');

// Get dashboard stats
router.get('/dashboard', authenticate, async (req, res, next) => {
  try {
    if (req.user.role === 'super_admin') {
      // Super Admin stats
      const companies = await db.query('SELECT COUNT(*) as total, SUM(CASE WHEN status = \'active\' THEN 1 ELSE 0 END) as active FROM companies');
      const users = await db.query('SELECT COUNT(*) as total FROM users');
      const storage = await db.query('SELECT COALESCE(SUM(storage_used), 0) as total FROM companies');
      const documents = await db.query('SELECT COUNT(*) as total FROM documents');

      res.json({
        totalCompanies: parseInt(companies.rows[0].total),
        activeCompanies: parseInt(companies.rows[0].active),
        totalUsers: parseInt(users.rows[0].total),
        totalStorage: parseFloat(storage.rows[0].total),
        totalDocuments: parseInt(documents.rows[0].total)
      });
    } else {
      // Client stats
      const companyId = req.user.company_id;

      const documents = await db.query(`
        SELECT COUNT(*) as total,
               SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
               SUM(CASE WHEN created_at >= CURRENT_DATE - INTERVAL '7 days' THEN 1 ELSE 0 END) as recent
        FROM documents WHERE company_id = $1
      `, [companyId]);

      const folders = await db.query('SELECT COUNT(*) as total FROM folders WHERE company_id = $1', [companyId]);
      const users = await db.query('SELECT COUNT(*) as total FROM users WHERE company_id = $1', [companyId]);
      const storage = await db.query('SELECT storage_used, storage_limit FROM companies WHERE id = $1', [companyId]);

      res.json({
        totalDocuments: parseInt(documents.rows[0].total),
        pendingDocuments: parseInt(documents.rows[0].pending),
        recentUploads: parseInt(documents.rows[0].recent),
        totalFolders: parseInt(folders.rows[0].total),
        totalUsers: parseInt(users.rows[0].total),
        storageUsed: parseFloat(storage.rows[0]?.storage_used || 0),
        storageLimit: parseFloat(storage.rows[0]?.storage_limit || 5)
      });
    }
  } catch (error) {
    next(error);
  }
});

// Get document stats by type
router.get('/documents/by-type', authenticate, async (req, res, next) => {
  try {
    let query = `
      SELECT type, COUNT(*) as count
      FROM documents
    `;
    const params = [];

    if (req.user.role !== 'super_admin') {
      query += ' WHERE company_id = $1';
      params.push(req.user.company_id);
    }

    query += ' GROUP BY type ORDER BY count DESC';

    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

// Get document stats by folder
router.get('/documents/by-folder', authenticate, async (req, res, next) => {
  try {
    let query = `
      SELECT f.id, f.name, f.color, COUNT(d.id) as count
      FROM folders f
      LEFT JOIN documents d ON d.folder_id = f.id
    `;
    const params = [];

    if (req.user.role !== 'super_admin') {
      query += ' WHERE f.company_id = $1';
      params.push(req.user.company_id);
    }

    query += ' GROUP BY f.id, f.name, f.color ORDER BY count DESC';

    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

// Get recent documents
router.get('/documents/recent', authenticate, async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    let query = `
      SELECT d.id, d.name, d.type, d.reference, d.document_date, d.status, d.created_at,
             f.name as folder_name, u.name as created_by_name
      FROM documents d
      LEFT JOIN folders f ON d.folder_id = f.id
      LEFT JOIN users u ON d.created_by = u.id
    `;
    const params = [];

    if (req.user.role !== 'super_admin') {
      query += ' WHERE d.company_id = $1';
      params.push(req.user.company_id);
    }

    query += ` ORDER BY d.created_at DESC LIMIT $${params.length + 1}`;
    params.push(limit);

    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

// Super Admin: Get company stats
router.get('/companies', authenticate, authorize('super_admin'), async (req, res, next) => {
  try {
    const result = await db.query(`
      SELECT c.id, c.name, c.sector, c.plan, c.status, c.storage_used, c.storage_limit,
             (SELECT COUNT(*) FROM users WHERE company_id = c.id) as users_count,
             (SELECT COUNT(*) FROM documents WHERE company_id = c.id) as documents_count,
             (SELECT MAX(created_at) FROM activity_logs WHERE company_id = c.id) as last_activity
      FROM companies c
      ORDER BY documents_count DESC
    `);

    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
