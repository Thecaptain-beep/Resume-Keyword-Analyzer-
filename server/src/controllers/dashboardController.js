/**
 * Dashboard Controller
 * Provides aggregated analytics, statistics, charts, and recent analysis feeds.
 */

const { getPool, isMssqlConnected, sql, fallbackStore } = require('../config/db');

async function getDashboardStats(req, res) {
  try {
    const userId = req.user.UserId;
    let analyses = [];
    let categoryDistribution = {};

    if (isMssqlConnected()) {
      const pool = getPool();
      const anaReq = pool.request();
      anaReq.input('UserId', sql.Int, userId);
      const anaRes = await anaReq.query(`
        SELECT AnalysisId, JobTitle, TotalKeywords, MatchedKeywords, MissingKeywords, MatchPercentage, CreatedAt
        FROM ANALYSES
        WHERE UserId = @UserId
        ORDER BY CreatedAt ASC
      `);
      analyses = anaRes.recordset;

      // Category breakdown from junction table
      const catReq = pool.request();
      catReq.input('UserId', sql.Int, userId);
      const catRes = await catReq.query(`
        SELECT k.Category, COUNT(ak.AnalysisKeywordId) as TotalCount
        FROM ANALYSIS_KEYWORDS ak
        JOIN ANALYSES a ON ak.AnalysisId = a.AnalysisId
        JOIN KEYWORDS k ON ak.KeywordId = k.KeywordId
        WHERE a.UserId = @UserId AND ak.FoundInJobDescription = 1
        GROUP BY k.Category
        ORDER BY TotalCount DESC
      `);

      catRes.recordset.forEach(row => {
        categoryDistribution[row.Category] = row.TotalCount;
      });
    } else {
      analyses = fallbackStore.analyses
        .filter(a => a.UserId === userId)
        .sort((a, b) => new Date(a.CreatedAt) - new Date(b.CreatedAt));

      const userAnalysisIds = new Set(analyses.map(a => a.AnalysisId));
      fallbackStore.analysisKeywords
        .filter(ak => userAnalysisIds.has(ak.AnalysisId) && ak.FoundInJobDescription)
        .forEach(ak => {
          const kw = fallbackStore.keywords.find(k => k.KeywordId === ak.KeywordId);
          const cat = kw ? kw.Category : 'Other';
          categoryDistribution[cat] = (categoryDistribution[cat] || 0) + 1;
        });
    }

    const totalAnalyses = analyses.length;
    let averageScore = 0;
    let highestScore = 0;
    let lowestScore = 0;

    if (totalAnalyses > 0) {
      const scores = analyses.map(a => parseFloat(Number(a.MatchPercentage).toFixed(2)));
      const sum = scores.reduce((acc, curr) => acc + curr, 0);
      averageScore = parseFloat((sum / totalAnalyses).toFixed(2));
      highestScore = Math.max(...scores);
      lowestScore = Math.min(...scores);
    }

    // Chart 1: Score over time
    const scoreOverTime = analyses.map(a => ({
      analysisId: a.AnalysisId,
      jobTitle: a.JobTitle || 'Untitled',
      score: parseFloat(Number(a.MatchPercentage).toFixed(2)),
      date: new Date(a.CreatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }));

    // Chart 2: Matched vs Missing
    const matchedVsMissing = analyses.slice(-8).map(a => ({
      jobTitle: (a.JobTitle && a.JobTitle.length > 15) ? a.JobTitle.slice(0, 15) + '...' : (a.JobTitle || 'Job'),
      matched: a.MatchedKeywords || 0,
      missing: a.MissingKeywords || 0,
      total: a.TotalKeywords || 0
    }));

    // Chart 3: Category breakdown formatted for Pie / Donut
    const categoryChartData = Object.keys(categoryDistribution).map(cat => ({
      name: cat,
      value: categoryDistribution[cat]
    }));

    return res.json({
      success: true,
      stats: {
        totalAnalyses,
        averageScore,
        highestScore,
        lowestScore
      },
      charts: {
        scoreOverTime,
        matchedVsMissing,
        categoryChartData
      }
    });
  } catch (error) {
    console.error('[Get Dashboard Stats Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to load dashboard statistics.'
    });
  }
}

async function getRecentAnalyses(req, res) {
  try {
    const userId = req.user.UserId;
    let recent = [];

    if (isMssqlConnected()) {
      const pool = getPool();
      const reqM = pool.request();
      reqM.input('UserId', sql.Int, userId);
      const result = await reqM.query(`
        SELECT TOP 5 AnalysisId, JobTitle, TotalKeywords, MatchedKeywords, MissingKeywords, MatchPercentage, CreatedAt
        FROM ANALYSES
        WHERE UserId = @UserId
        ORDER BY CreatedAt DESC
      `);
      recent = result.recordset.map(row => ({
        ...row,
        MatchPercentage: parseFloat(Number(row.MatchPercentage).toFixed(2))
      }));
    } else {
      recent = fallbackStore.analyses
        .filter(a => a.UserId === userId)
        .sort((a, b) => new Date(b.CreatedAt) - new Date(a.CreatedAt))
        .slice(0, 5)
        .map(row => ({
          ...row,
          MatchPercentage: parseFloat(Number(row.MatchPercentage).toFixed(2))
        }));
    }

    return res.json({
      success: true,
      recent
    });
  } catch (error) {
    console.error('[Get Recent Analyses Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to load recent analyses.'
    });
  }
}

module.exports = {
  getDashboardStats,
  getRecentAnalyses
};
