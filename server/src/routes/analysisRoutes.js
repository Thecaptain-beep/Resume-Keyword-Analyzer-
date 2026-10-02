/**
 * Analysis Routes
 */

const express = require('express');
const multer = require('multer');
const { body } = require('express-validator');
const analysisController = require('../controllers/analysisController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Memory upload for PDF file parsing
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || file.originalname.toLowerCase().endsWith('.pdf')) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF documents are accepted.'));
    }
  }
});

router.use(authMiddleware);

// PDF Resume Upload & Parsing Endpoint
router.post('/upload-pdf', upload.single('resumeFile'), analysisController.extractPdfText);

router.post(
  '/',
  [
    body('resumeText')
      .isString()
      .trim()
      .isLength({ min: 50, max: 100000 })
      .withMessage('Resume text must be between 50 and 100,000 characters.'),
    body('jobDescription')
      .isString()
      .trim()
      .isLength({ min: 50, max: 100000 })
      .withMessage('Job description must be between 50 and 100,000 characters.'),
    body('jobTitle')
      .optional()
      .trim()
      .isLength({ max: 200 })
      .withMessage('Job title cannot exceed 200 characters.')
  ],
  analysisController.createAnalysis
);

router.get('/', analysisController.getAllAnalyses);
router.get('/:id', analysisController.getAnalysisById);
router.delete('/:id', analysisController.deleteAnalysis);

module.exports = router;
