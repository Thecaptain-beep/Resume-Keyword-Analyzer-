/**
 * User Profile Routes
 */

const express = require('express');
const { body } = require('express-validator');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/profile', userController.getProfile);

router.put(
  '/profile',
  [
    body('fullName').trim().isLength({ min: 2 }).withMessage('Full name must be at least 2 characters.')
  ],
  userController.updateProfile
);

router.put(
  '/change-password',
  [
    body('currentPassword').notEmpty().withMessage('Current password is required.'),
    body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters.')
  ],
  userController.changePassword
);

module.exports = router;
