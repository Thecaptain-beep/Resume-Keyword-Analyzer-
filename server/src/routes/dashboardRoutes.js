/**
 * Dashboard Routes
 */

const express = require('express');
const dashboardController = require('../controllers/dashboardController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/stats', dashboardController.getDashboardStats);
router.get('/recent', dashboardController.getRecentAnalyses);

module.exports = router;
