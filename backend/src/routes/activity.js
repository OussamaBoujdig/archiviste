const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticate, authorize } = require('../middleware/auth');

// Get activity logs
router.get('/', authenticate, async (req, res, next) => {
  try {
    const { action, userId, page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT a.*, u.name as user_name, u.avatar as user_avatar, c.name as company_name
      FROM activity_logs a
      LEFT JOIN users u ON a.user_id = u.id
      LEFT JOIN companies c ON a.company_id = c.id
      WHERE 1=1
    `;
    const params = [];
    let paramIndex = 1;

    // Filter by company (except for super admin)
    if (req.user.role !== 'super_admin') {
      query += ` AND a.company_id = $${paramIndex}`;
      params.push(req.user.company_id);
      paramIndex++;
    }

    // Filter by action
    if (action) {
      query += ` AND a.action = $${paramIndex}`;
      params.push(action);
      paramIndex++;
    }

    // Filter by user
    if (userId) {
      query += ` AND a.user_id = $${paramIndex}`;
      params.push(userId);
      paramIndex++;
    }

    query += ` ORDER BY a.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    const result = await db.query(query, params);

    // Get total count
    let countQuery = `SELECT COUNT(*) FROM activity_logs a WHERE 1=1`;
    const countParams = [];
    let countParamIndex = 1;

    if (req.user.role !== 'super_admin') {
      countQuery += ` AND a.company_id = $${countParamIndex}`;
      countParams.push(req.user.company_id);
    }

    const countResult = await db.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].count);

    res.json({
      logs: result.rows,
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

// Get activity stats
router.get('/stats', authenticate, authorize('super_admin', 'client_admin'), async (req, res, next) => {
  try {
    let companyFilter = '';
    const params = [];

    if (req.user.role !== 'super_admin') {
      companyFilter = 'WHERE company_id = $1';
      params.push(req.user.company_id);
    }

    // Get action counts
    const actionStats = await db.query(`
      SELECT action, COUNT(*) as count
      FROM activity_logs
      ${companyFilter}
      GROUP BY action
      ORDER BY count DESC
    `, params);

    // Get activity by day (last 30 days)
    const dailyActivity = await db.query(`
      SELECT DATE(created_at) as date, COUNT(*) as count
      FROM activity_logs
      ${companyFilter}
      ${companyFilter ? 'AND' : 'WHERE'} created_at >= CURRENT_DATE - INTERVAL '30 days'
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `, params);

    // Get most active users
    const activeUsers = await db.query(`
      SELECT u.id, u.name, u.avatar, COUNT(a.id) as activity_count
      FROM activity_logs a
      JOIN users u ON a.user_id = u.id
      ${companyFilter ? `WHERE a.company_id = $1` : ''}
      GROUP BY u.id, u.name, u.avatar
      ORDER BY activity_count DESC
      LIMIT 10
    `, params);

    res.json({
      actionStats: actionStats.rows,
      dailyActivity: dailyActivity.rows,
      activeUsers: activeUsers.rows
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
