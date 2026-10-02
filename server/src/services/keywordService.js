/**
 * Keyword Service
 * Manages database interaction for standard keywords and categories.
 */

const { getPool, isMssqlConnected, sql, fallbackStore } = require('../config/db');

/**
 * Get all active keywords from the database
 */
async function getAllKeywords() {
  if (isMssqlConnected()) {
    const pool = getPool();
    const result = await pool.request().query(`
      SELECT KeywordId, Keyword, Category, Importance, IsActive
      FROM KEYWORDS
      WHERE IsActive = 1
      ORDER BY Keyword ASC
    `);
    return result.recordset;
  } else {
    return fallbackStore.keywords.filter(k => k.IsActive);
  }
}

/**
 * Ensure a keyword exists in the KEYWORDS table, returning its KeywordId
 */
async function ensureKeywordExists(keyword, category = 'Other', importance = 'Medium') {
  if (isMssqlConnected()) {
    const pool = getPool();
    // Check if exists
    const findReq = pool.request();
    findReq.input('Keyword', sql.NVarChar(100), keyword);
    const existing = await findReq.query('SELECT KeywordId FROM KEYWORDS WHERE Keyword = @Keyword');

    if (existing.recordset.length > 0) {
      return existing.recordset[0].KeywordId;
    }

    // Insert if not exists
    const insertReq = pool.request();
    insertReq.input('Keyword', sql.NVarChar(100), keyword);
    insertReq.input('Category', sql.NVarChar(100), category);
    insertReq.input('Importance', sql.NVarChar(20), importance);
    const insertResult = await insertReq.query(`
      INSERT INTO KEYWORDS (Keyword, Category, Importance, IsActive)
      OUTPUT INSERTED.KeywordId
      VALUES (@Keyword, @Category, @Importance, 1)
    `);

    return insertResult.recordset[0].KeywordId;
  } else {
    let kw = fallbackStore.keywords.find(k => k.Keyword.toLowerCase() === keyword.toLowerCase());
    if (!kw) {
      kw = {
        KeywordId: fallbackStore.keywordIdCounter++,
        Keyword: keyword,
        Category: category,
        Importance: importance,
        IsActive: true
      };
      fallbackStore.keywords.push(kw);
    }
    return kw.KeywordId;
  }
}

module.exports = {
  getAllKeywords,
  ensureKeywordExists
};
