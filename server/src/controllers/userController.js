/**
 * User Controller
 * Manages profile inspection, name updates, and password changes.
 */

const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const { getPool, isMssqlConnected, sql, fallbackStore } = require('../config/db');

/**
 * Get profile details
 */
async function getProfile(req, res) {
  try {
    const userId = req.user.UserId;
    let user = null;

    if (isMssqlConnected()) {
      const pool = getPool();
      const r = await pool.request()
        .input('UserId', sql.Int, userId)
        .query('SELECT UserId, FullName, Email, CreatedAt, UpdatedAt FROM USERS WHERE UserId = @UserId');
      user = r.recordset[0];
    } else {
      user = fallbackStore.users.find(u => u.UserId === userId);
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    return res.json({
      success: true,
      user: {
        userId: user.UserId,
        fullName: user.FullName,
        email: user.Email,
        createdAt: user.CreatedAt,
        updatedAt: user.UpdatedAt
      }
    });
  } catch (error) {
    console.error('[Get Profile Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve user profile.'
    });
  }
}

/**
 * Update user full name
 */
async function updateProfile(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg
    });
  }

  const { fullName } = req.body;
  const userId = req.user.UserId;

  try {
    if (isMssqlConnected()) {
      const pool = getPool();
      await pool.request()
        .input('UserId', sql.Int, userId)
        .input('FullName', sql.NVarChar(100), fullName.trim())
        .query('UPDATE USERS SET FullName = @FullName, UpdatedAt = GETDATE() WHERE UserId = @UserId');
    } else {
      const u = fallbackStore.users.find(usr => usr.UserId === userId);
      if (u) {
        u.FullName = fullName.trim();
        u.UpdatedAt = new Date().toISOString();
      }
    }

    return res.json({
      success: true,
      message: 'Profile updated successfully.',
      fullName: fullName.trim()
    });
  } catch (error) {
    console.error('[Update Profile Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update profile.'
    });
  }
}

/**
 * Change user password
 */
async function changePassword(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg
    });
  }

  const { currentPassword, newPassword } = req.body;
  const userId = req.user.UserId;

  try {
    let user = null;

    if (isMssqlConnected()) {
      const pool = getPool();
      const r = await pool.request()
        .input('UserId', sql.Int, userId)
        .query('SELECT PasswordHash FROM USERS WHERE UserId = @UserId');
      user = r.recordset[0];
    } else {
      user = fallbackStore.users.find(u => u.UserId === userId);
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User account not found.'
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.PasswordHash);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password provided is incorrect.'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const newHash = await bcrypt.hash(newPassword, salt);

    if (isMssqlConnected()) {
      const pool = getPool();
      await pool.request()
        .input('UserId', sql.Int, userId)
        .input('PasswordHash', sql.NVarChar(255), newHash)
        .query('UPDATE USERS SET PasswordHash = @PasswordHash, UpdatedAt = GETDATE() WHERE UserId = @UserId');
    } else {
      user.PasswordHash = newHash;
      user.UpdatedAt = new Date().toISOString();
    }

    return res.json({
      success: true,
      message: 'Password changed successfully.'
    });
  } catch (error) {
    console.error('[Change Password Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to change password.'
    });
  }
}

module.exports = {
  getProfile,
  updateProfile,
  changePassword
};
