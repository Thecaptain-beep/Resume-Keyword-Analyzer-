/**
 * Analysis Controller
 * Handles analysis creation, retrieval, listing, and deletion.
 */

const { validationResult } = require('express-validator');
const analysisService = require('../services/analysisService');
const { extractTextFromPdf } = require('../utils/pdfExtractor');

/**
 * Extract text from uploaded Resume PDF
 */
async function extractPdfText(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No PDF file uploaded. Please select a resume PDF file.'
      });
    }

    if (req.file.mimetype !== 'application/pdf' && !req.file.originalname.toLowerCase().endsWith('.pdf')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid file type. Only PDF documents (.pdf) are supported.'
      });
    }

    const { text, numPages } = await extractTextFromPdf(req.file.buffer);

    if (!text || text.trim().length < 20) {
      return res.status(400).json({
        success: false,
        message: 'Unable to extract text from this PDF. It may contain scanned images without selectable text. Please upload a standard text PDF or paste the text directly.'
      });
    }

    return res.json({
      success: true,
      message: 'PDF text extracted successfully.',
      fileName: req.file.originalname,
      fileSize: req.file.size,
      numPages,
      charCount: text.length,
      text
    });
  } catch (error) {
    console.error('[PDF Extraction Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to process resume PDF: ' + error.message
    });
  }
}

/**
 * Run analysis
 */
async function createAnalysis(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg,
      errors: errors.array()
    });
  }

  const { jobTitle, resumeText, jobDescription } = req.body;
  const userId = req.user.UserId;

  try {
    const result = await analysisService.performAnalysis({
      userId,
      jobTitle,
      resumeText,
      jobDescription
    });

    return res.status(201).json(result);
  } catch (error) {
    console.error('[Create Analysis Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to process resume analysis.'
    });
  }
}

/**
 * Get all analyses for the current user
 */
async function getAllAnalyses(req, res) {
  try {
    const userId = req.user.UserId;
    const analyses = await analysisService.getUserAnalyses(userId);
    return res.json({
      success: true,
      count: analyses.length,
      analyses
    });
  } catch (error) {
    console.error('[Get All Analyses Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve analysis history.'
    });
  }
}

/**
 * Get single analysis by ID
 */
async function getAnalysisById(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.UserId;

    const analysis = await analysisService.getAnalysisById(id, userId);
    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: 'Analysis record not found or access denied.'
      });
    }

    return res.json(analysis);
  } catch (error) {
    console.error('[Get Analysis Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve analysis record.'
    });
  }
}

/**
 * Delete analysis by ID
 */
async function deleteAnalysis(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.UserId;

    const deleted = await analysisService.deleteAnalysisById(id, userId);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Analysis record not found or access denied.'
      });
    }

    return res.json({
      success: true,
      message: 'Analysis deleted successfully.'
    });
  } catch (error) {
    console.error('[Delete Analysis Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete analysis record.'
    });
  }
}

module.exports = {
  createAnalysis,
  extractPdfText,
  getAllAnalyses,
  getAnalysisById,
  deleteAnalysis
};
