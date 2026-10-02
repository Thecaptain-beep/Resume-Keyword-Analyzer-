/**
 * Analysis Service
 * Core keyword comparison engine, scoring formula, recommendation generator,
 * and database persistence for Microsoft SQL Server.
 */

const { getPool, isMssqlConnected, sql, fallbackStore } = require('../config/db');
const { extractKeywords } = require('../utils/textProcessor');
const { ensureKeywordExists } = require('./keywordService');

/**
 * Determine match tier descriptor
 */
function getMatchTier(percentage) {
  if (percentage >= 80) return 'Excellent Keyword Match';
  if (percentage >= 60) return 'Good Keyword Match';
  if (percentage >= 40) return 'Moderate Keyword Match';
  return 'Low Keyword Match';
}

/**
 * Generate context-aware recommendations without fabricating skills
 */
function generateRecommendations(matchedKeywords, missingKeywords, matchPercentage) {
  const recommendations = [];

  if (missingKeywords.length === 0) {
    recommendations.push(
      'Outstanding alignment! Your resume covers all core keywords detected in the job description. Ensure your accomplishments highlight quantifiable metrics (e.g., % improvement, scale, revenue impact).'
    );
  } else {
    // High-importance missing keywords
    const highMissing = missingKeywords.filter(k => k.importance === 'High').slice(0, 4);
    if (highMissing.length > 0) {
      const names = highMissing.map(k => k.keyword).join(', ');
      recommendations.push(
        `High-priority keywords identified in the job requirements: ${names}. If you have practical experience with these technologies, be sure to incorporate them into your Skills summary or Project bullet points.`
      );
    }

    // Secondary missing keywords
    const otherMissing = missingKeywords.filter(k => k.importance !== 'High').slice(0, 3);
    if (otherMissing.length > 0) {
      const names = otherMissing.map(k => k.keyword).join(', ');
      recommendations.push(
        `Secondary tools or methodologies noted: ${names}. Mentioning these where relevant demonstrates well-rounded proficiency.`
      );
    }

    // Specific category guidance
    const missingCategories = [...new Set(missingKeywords.map(k => k.category))];
    if (missingCategories.includes('DevOps')) {
      recommendations.push(
        'The job post emphasizes DevOps & deployment tools (e.g., Docker, CI/CD). If applicable, highlight your containerization or release pipeline experience.'
      );
    }
    if (missingCategories.includes('Database')) {
      recommendations.push(
        'Database skills appear crucial for this role. Consider highlighting query optimization, schema design, or data modeling.'
      );
    }
    if (missingCategories.includes('Professional')) {
      recommendations.push(
        'Recruiters value interpersonal and delivery skills. Express leadership, problem-solving, or agile collaboration through real project achievements.'
      );
    }
  }

  if (matchPercentage < 50) {
    recommendations.push(
      'Your match score is below 50%. Review the role description thoroughly to ensure your resume reflects the specific domain terminology and toolset required for this opportunity.'
    );
  }

  recommendations.push(
    'Reminder: Keyword match percentage is a helpful indicator and does not guarantee interview selection. Always keep your resume honest, authentic, and tailored.'
  );

  return recommendations;
}

/**
 * Execute keyword analysis and store in database
 */
async function performAnalysis({ userId, jobTitle, resumeText, jobDescription }) {
  // 1. Extract keywords
  const resumeKeywordsMap = new Map();
  extractKeywords(resumeText).forEach(k => resumeKeywordsMap.set(k.keyword, k));

  const jobKeywordsMap = new Map();
  extractKeywords(jobDescription).forEach(k => jobKeywordsMap.set(k.keyword, k));

  const totalJobKeywords = jobKeywordsMap.size;
  const matchedKeywordsList = [];
  const missingKeywordsList = [];

  jobKeywordsMap.forEach((jobKw, name) => {
    if (resumeKeywordsMap.has(name)) {
      matchedKeywordsList.push(jobKw);
    } else {
      missingKeywordsList.push(jobKw);
    }
  });

  // Calculate percentage
  let matchPercentage = 0;
  if (totalJobKeywords > 0) {
    matchPercentage = parseFloat(((matchedKeywordsList.length / totalJobKeywords) * 100).toFixed(2));
  } else if (resumeKeywordsMap.size > 0) {
    matchPercentage = 100.00;
  }

  const recommendations = generateRecommendations(matchedKeywordsList, missingKeywordsList, matchPercentage);
  const title = (jobTitle && jobTitle.trim()) ? jobTitle.trim() : 'Software Role Keyword Analysis';

  let analysisId;

  // Persist to Microsoft SQL Server or fallback store
  if (isMssqlConnected()) {
    const pool = getPool();
    const transaction = new sql.Transaction(pool);
    await transaction.begin();

    try {
      const insertReq = new sql.Request(transaction);
      insertReq.input('UserId', sql.Int, userId);
      insertReq.input('JobTitle', sql.NVarChar(200), title);
      insertReq.input('ResumeText', sql.NVarChar(sql.MAX), resumeText);
      insertReq.input('JobDescription', sql.NVarChar(sql.MAX), jobDescription);
      insertReq.input('TotalKeywords', sql.Int, totalJobKeywords);
      insertReq.input('MatchedKeywords', sql.Int, matchedKeywordsList.length);
      insertReq.input('MissingKeywords', sql.Int, missingKeywordsList.length);
      insertReq.input('MatchPercentage', sql.Decimal(5, 2), matchPercentage);

      const res = await insertReq.query(`
        INSERT INTO ANALYSES (UserId, JobTitle, ResumeText, JobDescription, TotalKeywords, MatchedKeywords, MissingKeywords, MatchPercentage, CreatedAt)
        OUTPUT INSERTED.AnalysisId
        VALUES (@UserId, @JobTitle, @ResumeText, @JobDescription, @TotalKeywords, @MatchedKeywords, @MissingKeywords, @MatchPercentage, GETDATE())
      `);

      analysisId = res.recordset[0].AnalysisId;

      // Union of all detected keywords to record in ANALYSIS_KEYWORDS
      const allUniqueKeywords = new Map([...jobKeywordsMap, ...resumeKeywordsMap]);

      for (const [kwName, kwObj] of allUniqueKeywords.entries()) {
        const keywordId = await ensureKeywordExists(kwName, kwObj.category, kwObj.importance);
        const inResume = resumeKeywordsMap.has(kwName);
        const inJob = jobKeywordsMap.has(kwName);

        const juncReq = new sql.Request(transaction);
        juncReq.input('AnalysisId', sql.Int, analysisId);
        juncReq.input('KeywordId', sql.Int, keywordId);
        juncReq.input('FoundInResume', sql.Bit, inResume ? 1 : 0);
        juncReq.input('FoundInJobDescription', sql.Bit, inJob ? 1 : 0);

        await juncReq.query(`
          INSERT INTO ANALYSIS_KEYWORDS (AnalysisId, KeywordId, FoundInResume, FoundInJobDescription)
          VALUES (@AnalysisId, @KeywordId, @FoundInResume, @FoundInJobDescription)
        `);
      }

      await transaction.commit();
    } catch (txErr) {
      await transaction.rollback();
      throw txErr;
    }
  } else {
    // Fallback in-memory storage adhering to the exact same schema
    analysisId = fallbackStore.analysisIdCounter++;
    const newAnalysis = {
      AnalysisId: analysisId,
      UserId: userId,
      JobTitle: title,
      ResumeText: resumeText,
      JobDescription: jobDescription,
      TotalKeywords: totalJobKeywords,
      MatchedKeywords: matchedKeywordsList.length,
      MissingKeywords: missingKeywordsList.length,
      MatchPercentage: matchPercentage,
      CreatedAt: new Date().toISOString()
    };
    fallbackStore.analyses.push(newAnalysis);

    const allUniqueKeywords = new Map([...jobKeywordsMap, ...resumeKeywordsMap]);
    for (const [kwName, kwObj] of allUniqueKeywords.entries()) {
      const keywordId = await ensureKeywordExists(kwName, kwObj.category, kwObj.importance);
      fallbackStore.analysisKeywords.push({
        AnalysisKeywordId: fallbackStore.analysisKeywordIdCounter++,
        AnalysisId: analysisId,
        KeywordId: keywordId,
        FoundInResume: resumeKeywordsMap.has(kwName),
        FoundInJobDescription: jobKeywordsMap.has(kwName)
      });
    }
  }

  // Combined breakdown table of keywords found in job description
  const breakdownList = [];
  jobKeywordsMap.forEach((jobKw, name) => {
    const isMatched = resumeKeywordsMap.has(name);
    breakdownList.push({
      keyword: name,
      category: jobKw.category,
      importance: jobKw.importance,
      found: isMatched,
      status: isMatched ? 'Matched' : 'Missing'
    });
  });

  return {
    success: true,
    analysisId,
    jobTitle: title,
    matchPercentage,
    matchTier: getMatchTier(matchPercentage),
    totalKeywords: totalJobKeywords,
    matchedKeywords: matchedKeywordsList.length,
    missingKeywords: missingKeywordsList.length,
    matchedKeywordsList,
    missingKeywordsList,
    breakdownList,
    recommendations,
    createdAt: new Date().toISOString()
  };
}

/**
 * Retrieve analysis by ID for the authorized user
 */
async function getAnalysisById(analysisId, userId) {
  let record = null;
  let keywordsRows = [];

  if (isMssqlConnected()) {
    const pool = getPool();
    const req = pool.request();
    req.input('AnalysisId', sql.Int, analysisId);
    req.input('UserId', sql.Int, userId);

    const res = await req.query(`
      SELECT AnalysisId, UserId, JobTitle, ResumeText, JobDescription,
             TotalKeywords, MatchedKeywords, MissingKeywords, MatchPercentage, CreatedAt
      FROM ANALYSES
      WHERE AnalysisId = @AnalysisId AND UserId = @UserId
    `);

    if (res.recordset.length === 0) return null;
    record = res.recordset[0];

    const kwReq = pool.request();
    kwReq.input('AnalysisId', sql.Int, analysisId);
    const kwRes = await kwReq.query(`
      SELECT ak.AnalysisKeywordId, ak.FoundInResume, ak.FoundInJobDescription,
             k.Keyword, k.Category, k.Importance
      FROM ANALYSIS_KEYWORDS ak
      JOIN KEYWORDS k ON ak.KeywordId = k.KeywordId
      WHERE ak.AnalysisId = @AnalysisId
      ORDER BY k.Category ASC, k.Keyword ASC
    `);
    keywordsRows = kwRes.recordset;
  } else {
    record = fallbackStore.analyses.find(a => a.AnalysisId === parseInt(analysisId, 10) && a.UserId === userId);
    if (!record) return null;

    const junc = fallbackStore.analysisKeywords.filter(ak => ak.AnalysisId === record.AnalysisId);
    keywordsRows = junc.map(item => {
      const kw = fallbackStore.keywords.find(k => k.KeywordId === item.KeywordId);
      return {
        AnalysisKeywordId: item.AnalysisKeywordId,
        FoundInResume: item.FoundInResume,
        FoundInJobDescription: item.FoundInJobDescription,
        Keyword: kw ? kw.Keyword : 'Unknown',
        Category: kw ? kw.Category : 'Other',
        Importance: kw ? kw.Importance : 'Medium'
      };
    });
  }

  const matchedKeywordsList = [];
  const missingKeywordsList = [];
  const breakdownList = [];

  keywordsRows.forEach(row => {
    // Only items in job description count toward the match
    if (row.FoundInJobDescription) {
      const kwItem = {
        keyword: row.Keyword,
        category: row.Category,
        importance: row.Importance
      };
      if (row.FoundInResume) {
        matchedKeywordsList.push(kwItem);
        breakdownList.push({ ...kwItem, found: true, status: 'Matched' });
      } else {
        missingKeywordsList.push(kwItem);
        breakdownList.push({ ...kwItem, found: false, status: 'Missing' });
      }
    }
  });

  const matchPercentage = parseFloat(Number(record.MatchPercentage).toFixed(2));
  const recommendations = generateRecommendations(matchedKeywordsList, missingKeywordsList, matchPercentage);

  return {
    success: true,
    analysisId: record.AnalysisId,
    jobTitle: record.JobTitle,
    resumeText: record.ResumeText,
    jobDescription: record.JobDescription,
    matchPercentage,
    matchTier: getMatchTier(matchPercentage),
    totalKeywords: record.TotalKeywords,
    matchedKeywords: record.MatchedKeywords,
    missingKeywords: record.MissingKeywords,
    matchedKeywordsList,
    missingKeywordsList,
    breakdownList,
    recommendations,
    createdAt: record.CreatedAt
  };
}

/**
 * List analyses for user
 */
async function getUserAnalyses(userId) {
  if (isMssqlConnected()) {
    const pool = getPool();
    const req = pool.request();
    req.input('UserId', sql.Int, userId);
    const res = await req.query(`
      SELECT AnalysisId, JobTitle, TotalKeywords, MatchedKeywords, MissingKeywords, MatchPercentage, CreatedAt
      FROM ANALYSES
      WHERE UserId = @UserId
      ORDER BY CreatedAt DESC
    `);
    return res.recordset.map(row => ({
      ...row,
      MatchPercentage: parseFloat(Number(row.MatchPercentage).toFixed(2)),
      matchTier: getMatchTier(row.MatchPercentage)
    }));
  } else {
    return fallbackStore.analyses
      .filter(a => a.UserId === userId)
      .sort((a, b) => new Date(b.CreatedAt) - new Date(a.CreatedAt))
      .map(row => ({
        AnalysisId: row.AnalysisId,
        JobTitle: row.JobTitle,
        TotalKeywords: row.TotalKeywords,
        MatchedKeywords: row.MatchedKeywords,
        MissingKeywords: row.MissingKeywords,
        MatchPercentage: parseFloat(Number(row.MatchPercentage).toFixed(2)),
        CreatedAt: row.CreatedAt,
        matchTier: getMatchTier(row.MatchPercentage)
      }));
  }
}

/**
 * Delete analysis by ID
 */
async function deleteAnalysisById(analysisId, userId) {
  if (isMssqlConnected()) {
    const pool = getPool();
    const req = pool.request();
    req.input('AnalysisId', sql.Int, analysisId);
    req.input('UserId', sql.Int, userId);

    const check = await req.query('SELECT AnalysisId FROM ANALYSES WHERE AnalysisId = @AnalysisId AND UserId = @UserId');
    if (check.recordset.length === 0) return false;

    // Delete cascading handled by FK or manual delete
    await pool.request()
      .input('AnalysisId', sql.Int, analysisId)
      .query('DELETE FROM ANALYSES WHERE AnalysisId = @AnalysisId');

    return true;
  } else {
    const index = fallbackStore.analyses.findIndex(a => a.AnalysisId === parseInt(analysisId, 10) && a.UserId === userId);
    if (index === -1) return false;

    const targetId = fallbackStore.analyses[index].AnalysisId;
    fallbackStore.analyses.splice(index, 1);
    fallbackStore.analysisKeywords = fallbackStore.analysisKeywords.filter(ak => ak.AnalysisId !== targetId);
    return true;
  }
}

module.exports = {
  getMatchTier,
  generateRecommendations,
  performAnalysis,
  getAnalysisById,
  getUserAnalyses,
  deleteAnalysisById
};
