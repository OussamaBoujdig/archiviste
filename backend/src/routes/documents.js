const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const db = require('../config/database');
const { authenticate, hasPermission } = require('../middleware/auth');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Type de fichier non autorisé'));
    }
  }
});

// Get documents
router.get('/', authenticate, async (req, res, next) => {
  try {
    const { type, folderId, status, search, page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT d.*, f.name as folder_name, u.name as created_by_name
      FROM documents d
      LEFT JOIN folders f ON d.folder_id = f.id
      LEFT JOIN users u ON d.created_by = u.id
      WHERE 1=1
    `;
    const params = [];
    let paramIndex = 1;

    // Filter by company
    if (req.user.role !== 'super_admin') {
      query += ` AND d.company_id = $${paramIndex}`;
      params.push(req.user.company_id);
      paramIndex++;
    }

    // Filter by type
    if (type) {
      query += ` AND d.type = $${paramIndex}`;
      params.push(type);
      paramIndex++;
    }

    // Filter by folder
    if (folderId) {
      query += ` AND d.folder_id = $${paramIndex}`;
      params.push(folderId);
      paramIndex++;
    }

    // Filter by status
    if (status) {
      query += ` AND d.status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    // Search
    if (search) {
      query += ` AND (d.name ILIKE $${paramIndex} OR d.reference ILIKE $${paramIndex} OR $${paramIndex + 1} = ANY(d.tags))`;
      params.push(`%${search}%`);
      params.push(search.toLowerCase());
      paramIndex += 2;
    }

    query += ` ORDER BY d.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    const result = await db.query(query, params);

    // Get total count
    let countQuery = `SELECT COUNT(*) FROM documents d WHERE 1=1`;
    const countParams = [];
    let countParamIndex = 1;

    if (req.user.role !== 'super_admin') {
      countQuery += ` AND d.company_id = $${countParamIndex}`;
      countParams.push(req.user.company_id);
    }

    const countResult = await db.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].count);

    res.json({
      documents: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get single document
router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await db.query(`
      SELECT d.*, f.name as folder_name, u.name as created_by_name
      FROM documents d
      LEFT JOIN folders f ON d.folder_id = f.id
      LEFT JOIN users u ON d.created_by = u.id
      WHERE d.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Document non trouvé' });
    }

    const document = result.rows[0];

    // Check access
    if (req.user.role !== 'super_admin' && req.user.company_id !== document.company_id) {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    // Log view activity
    await db.query(`
      INSERT INTO activity_logs (user_id, company_id, action, target_type, target_id, target_name, ip_address)
      VALUES ($1, $2, 'view', 'document', $3, $4, $5)
    `, [req.user.id, document.company_id, document.id, document.name, req.ip]);

    res.json(document);
  } catch (error) {
    next(error);
  }
});

// Upload document
router.post('/', authenticate, hasPermission('upload'), upload.single('file'), async (req, res, next) => {
  try {
    const { name, type, folderId, reference, documentDate, tags } = req.body;

    if (!name || !type) {
      return res.status(400).json({ error: 'Nom et type requis' });
    }

    const companyId = req.user.company_id;
    const filePath = req.file ? `/uploads/${req.file.filename}` : null;
    const fileSize = req.file ? `${(req.file.size / 1024).toFixed(0)} KB` : null;
    const mimeType = req.file ? req.file.mimetype : null;

    const parsedTags = tags ? (typeof tags === 'string' ? JSON.parse(tags) : tags) : [];

    const result = await db.query(`
      INSERT INTO documents (name, type, folder_id, company_id, reference, document_date, file_path, file_size, mime_type, tags, created_by)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `, [name, type, folderId, companyId, reference, documentDate, filePath, fileSize, mimeType, parsedTags, req.user.id]);

    // Log activity
    await db.query(`
      INSERT INTO activity_logs (user_id, company_id, action, target_type, target_id, target_name, ip_address)
      VALUES ($1, $2, 'upload', 'document', $3, $4, $5)
    `, [req.user.id, companyId, result.rows[0].id, name, req.ip]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// Update document metadata
router.put('/:id', authenticate, hasPermission('edit_metadata'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, type, folderId, reference, documentDate, status, tags } = req.body;

    // Get document to check access
    const docResult = await db.query('SELECT * FROM documents WHERE id = $1', [id]);
    if (docResult.rows.length === 0) {
      return res.status(404).json({ error: 'Document non trouvé' });
    }

    const document = docResult.rows[0];

    // Check access
    if (req.user.role !== 'super_admin' && req.user.company_id !== document.company_id) {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    const result = await db.query(`
      UPDATE documents SET
        name = COALESCE($1, name),
        type = COALESCE($2, type),
        folder_id = $3,
        reference = COALESCE($4, reference),
        document_date = COALESCE($5, document_date),
        status = COALESCE($6, status),
        tags = COALESCE($7, tags),
        version = version + 1
      WHERE id = $8
      RETURNING *
    `, [name, type, folderId, reference, documentDate, status, tags, id]);

    // Log activity
    await db.query(`
      INSERT INTO activity_logs (user_id, company_id, action, target_type, target_id, target_name, ip_address)
      VALUES ($1, $2, 'edit', 'document', $3, $4, $5)
    `, [req.user.id, document.company_id, id, result.rows[0].name, req.ip]);

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// Delete document
router.delete('/:id', authenticate, hasPermission('delete'), async (req, res, next) => {
  try {
    const { id } = req.params;

    // Get document to check access
    const docResult = await db.query('SELECT * FROM documents WHERE id = $1', [id]);
    if (docResult.rows.length === 0) {
      return res.status(404).json({ error: 'Document non trouvé' });
    }

    const document = docResult.rows[0];

    // Check access
    if (req.user.role !== 'super_admin' && req.user.company_id !== document.company_id) {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    await db.query('DELETE FROM documents WHERE id = $1', [id]);

    // Log activity
    await db.query(`
      INSERT INTO activity_logs (user_id, company_id, action, target_type, target_name, ip_address)
      VALUES ($1, $2, 'delete', 'document', $3, $4)
    `, [req.user.id, document.company_id, document.name, req.ip]);

    res.json({ message: 'Document supprimé' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
