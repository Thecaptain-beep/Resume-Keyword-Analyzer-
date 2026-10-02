/**
 * Auth Controller
 * Handles user registration, login, token generation, and current profile retrieval.
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const { getPool, isMssqlConnected, sql, fallbackStore } = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'super_secure_resumecheck_jwt_secret_key_2026_xyz123';

function generateToken(userId, email) {
  return jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: '7d' });
}

/**
 * Register a new user
 */
async function register(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg,
      errors: errors.array()
    });
  }

  const { fullName, email, password } = req.body;
  const normalizedEmail = email.toLowerCase().trim();

  try {
    if (isMssqlConnected()) {
      const pool = getPool();
      // Check if user email already exists
      const checkReq = pool.request();
      checkReq.input('Email', sql.NVarChar(150), normalizedEmail);
      const existing = await checkReq.query('SELECT UserId FROM USERS WHERE Email = @Email');

      if (existing.recordset.length > 0) {
        return res.status(409).json({
          success: false,
          message: 'An account with this email address already exists.'
        });
      }

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      const insertReq = pool.request();
      insertReq.input('FullName', sql.NVarChar(100), fullName.trim());
      insertReq.input('Email', sql.NVarChar(150), normalizedEmail);
      insertReq.input('PasswordHash', sql.NVarChar(255), passwordHash);

      const insertRes = await insertReq.query(`
        INSERT INTO USERS (FullName, Email, PasswordHash, CreatedAt, UpdatedAt)
        OUTPUT INSERTED.UserId, INSERTED.FullName, INSERTED.Email, INSERTED.CreatedAt
        VALUES (@FullName, @Email, @PasswordHash, GETDATE(), GETDATE())
      `);

      const newUser = insertRes.recordset[0];
      const token = generateToken(newUser.UserId, newUser.Email);

      return res.status(201).json({
        success: true,
        message: 'Account created successfully.',
        token,
        user: {
          userId: newUser.UserId,
          fullName: newUser.FullName,
          email: newUser.Email,
          createdAt: newUser.CreatedAt
        }
      });
    } else {
      const existing = fallbackStore.users.find(u => u.Email === normalizedEmail);
      if (existing) {
        return res.status(409).json({
          success: false,
          message: 'An account with this email address already exists.'
        });
      }

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      const newUser = {
        UserId: fallbackStore.userIdCounter++,
        FullName: fullName.trim(),
        Email: normalizedEmail,
        PasswordHash: passwordHash,
        CreatedAt: new Date().toISOString(),
        UpdatedAt: new Date().toISOString()
      };
      fallbackStore.users.push(newUser);

      const token = generateToken(newUser.UserId, newUser.Email);

      return res.status(201).json({
        success: true,
        message: 'Account created successfully.',
        token,
        user: {
          userId: newUser.UserId,
          fullName: newUser.FullName,
          email: newUser.Email,
          createdAt: newUser.CreatedAt
        }
      });
    }
  } catch (error) {
    console.error('[Register Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error occurred during account registration.'
    });
  }
}

/**
 * Login user
 */
async function login(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg
    });
  }

  const { email, password } = req.body;
  const normalizedEmail = email.toLowerCase().trim();

  try {
    let user = null;

    if (isMssqlConnected()) {
      const pool = getPool();
      const userReq = pool.request();
      userReq.input('Email', sql.NVarChar(150), normalizedEmail);
      const result = await userReq.query('SELECT UserId, FullName, Email, PasswordHash, CreatedAt FROM USERS WHERE Email = @Email');

      if (result.recordset.length > 0) {
        user = result.recordset[0];
      }
    } else {
      user = fallbackStore.users.find(u => u.Email === normalizedEmail);
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password credentials.'
      });
    }

    const isMatch = await bcrypt.compare(password, user.PasswordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password credentials.'
      });
    }

    const token = generateToken(user.UserId, user.Email);

    return res.json({
      success: true,
      message: 'Logged in successfully.',
      token,
      user: {
        userId: user.UserId,
        fullName: user.FullName,
        email: user.Email,
        createdAt: user.CreatedAt
      }
    });
  } catch (error) {
    console.error('[Login Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error occurred during login.'
    });
  }
}

/**
 * Get currently authenticated user
 */
async function getMe(req, res) {
  try {
    return res.json({
      success: true,
      user: {
        userId: req.user.UserId,
        fullName: req.user.FullName,
        email: req.user.Email,
        createdAt: req.user.CreatedAt
      }
    });
  } catch (error) {
    console.error('[GetMe Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching user session.'
    });
  }
}

module.exports = {
  register,
  login,
  getMe
};
