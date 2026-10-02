/**
 * JWT Authentication Middleware
 * Validates bearer token and attaches authenticated user payload to req.user
 */

const jwt = require('jsonwebtoken');
const { getPool, isMssqlConnected, sql, fallbackStore } = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'super_secure_resumecheck_jwt_secret_key_2026_xyz123';

async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authentication token missing or invalid.'
      });
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token.'
      });
    }

    const userId = decoded.userId;

    if (isMssqlConnected()) {
      const pool = getPool();
      const result = await pool.request()
        .input('UserId', sql.Int, userId)
        .query('SELECT UserId, FullName, Email, CreatedAt FROM USERS WHERE UserId = @UserId');

      if (!result.recordset || result.recordset.length === 0) {
        return res.status(401).json({
          success: false,
          message: 'User no longer exists.'
        });
      }

      req.user = result.recordset[0];
    } else {
      const user = fallbackStore.users.find(u => u.UserId === userId);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User no longer exists.'
        });
      }

      req.user = {
        UserId: user.UserId,
        FullName: user.FullName,
        Email: user.Email,
        CreatedAt: user.CreatedAt
      };
    }

    next();
  } catch (error) {
    console.error('[Auth Middleware Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during authentication.'
    });
  }
}

module.exports = authMiddleware;
