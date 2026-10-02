/**
 * Microsoft SQL Server Database Configuration and Connection Pool
 * Handles mssql connection with automatic table initialization and graceful fallback.
 */

const sql = require('mssql');
const { KEYWORD_DICTIONARY } = require('../utils/keywordDictionary');

const dbConfig = {
  user: process.env.DB_USER || 'sa',
  password: process.env.DB_PASSWORD || 'YourStrongPassword123!',
  server: process.env.DB_SERVER || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 1433,
  database: process.env.DB_NAME || 'ResumeKeywordCheckerDB',
  options: {
    encrypt: process.env.DB_ENCRYPT === 'true',
    trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE !== 'false',
    enableArithAbort: true,
    connectTimeout: 4000,
    requestTimeout: 10000
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

let pool = null;
let isConnected = false;

// Fallback in-memory store matching the exact Microsoft SQL Server schema
const fallbackStore = {
  users: [],
  analyses: [],
  keywords: [],
  analysisKeywords: [],
  userIdCounter: 1,
  analysisIdCounter: 1,
  keywordIdCounter: 1,
  analysisKeywordIdCounter: 1
};

// Seed fallback store with initial keyword dictionary
function seedFallbackStore() {
  if (fallbackStore.keywords.length === 0) {
    KEYWORD_DICTIONARY.forEach(item => {
      fallbackStore.keywords.push({
        KeywordId: fallbackStore.keywordIdCounter++,
        Keyword: item.name,
        Category: item.category,
        Importance: item.importance,
        IsActive: true
      });
    });
  }
}

seedFallbackStore();

/**
 * Initialize Tables & Seeds in Microsoft SQL Server
 */
async function initializeMssqlSchema(activePool) {
  try {
    const request = activePool.request();

    // 1. Users Table
    await request.batch(`
      IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = N'USERS')
      BEGIN
          CREATE TABLE USERS (
              UserId INT IDENTITY(1,1) PRIMARY KEY,
              FullName NVARCHAR(100) NOT NULL,
              Email NVARCHAR(150) NOT NULL,
              PasswordHash NVARCHAR(255) NOT NULL,
              CreatedAt DATETIME2 DEFAULT GETDATE(),
              UpdatedAt DATETIME2 DEFAULT GETDATE(),
              CONSTRAINT UQ_Users_Email UNIQUE (Email)
          );
      END;

      IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = N'KEYWORDS')
      BEGIN
          CREATE TABLE KEYWORDS (
              KeywordId INT IDENTITY(1,1) PRIMARY KEY,
              Keyword NVARCHAR(100) NOT NULL,
              Category NVARCHAR(100) NOT NULL,
              Importance NVARCHAR(20) NOT NULL DEFAULT 'Medium',
              IsActive BIT DEFAULT 1,
              CONSTRAINT UQ_Keywords_Keyword UNIQUE (Keyword)
          );
      END;

      IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = N'ANALYSES')
      BEGIN
          CREATE TABLE ANALYSES (
              AnalysisId INT IDENTITY(1,1) PRIMARY KEY,
              UserId INT NOT NULL,
              JobTitle NVARCHAR(200) NULL,
              ResumeText NVARCHAR(MAX) NOT NULL,
              JobDescription NVARCHAR(MAX) NOT NULL,
              TotalKeywords INT NOT NULL DEFAULT 0,
              MatchedKeywords INT NOT NULL DEFAULT 0,
              MissingKeywords INT NOT NULL DEFAULT 0,
              MatchPercentage DECIMAL(5,2) NOT NULL DEFAULT 0.00,
              CreatedAt DATETIME2 DEFAULT GETDATE(),
              CONSTRAINT FK_Analyses_Users FOREIGN KEY (UserId) REFERENCES USERS(UserId) ON DELETE CASCADE
          );
      END;

      IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = N'ANALYSIS_KEYWORDS')
      BEGIN
          CREATE TABLE ANALYSIS_KEYWORDS (
              AnalysisKeywordId INT IDENTITY(1,1) PRIMARY KEY,
              AnalysisId INT NOT NULL,
              KeywordId INT NOT NULL,
              FoundInResume BIT NOT NULL,
              FoundInJobDescription BIT NOT NULL,
              CONSTRAINT FK_AnalysisKeywords_Analyses FOREIGN KEY (AnalysisId) REFERENCES ANALYSES(AnalysisId) ON DELETE CASCADE,
              CONSTRAINT FK_AnalysisKeywords_Keywords FOREIGN KEY (KeywordId) REFERENCES KEYWORDS(KeywordId) ON DELETE CASCADE
          );
      END;
    `);

    // Seed keywords in MSSQL
    for (const item of KEYWORD_DICTIONARY) {
      const seedReq = activePool.request();
      seedReq.input('Keyword', sql.NVarChar(100), item.name);
      seedReq.input('Category', sql.NVarChar(100), item.category);
      seedReq.input('Importance', sql.NVarChar(20), item.importance);
      await seedReq.query(`
        IF NOT EXISTS (SELECT 1 FROM KEYWORDS WHERE Keyword = @Keyword)
        BEGIN
            INSERT INTO KEYWORDS (Keyword, Category, Importance, IsActive)
            VALUES (@Keyword, @Category, @Importance, 1);
        END
      `);
    }

    console.log('[Database] Microsoft SQL Server schema and keyword seeds verified successfully.');
  } catch (err) {
    console.error('[Database] Error initializing SQL Server tables:', err.message);
  }
}

/**
 * Connect to Database
 */
async function connectDB() {
  try {
    console.log(`[Database] Attempting connection to Microsoft SQL Server at ${dbConfig.server}:${dbConfig.port}...`);
    pool = await new sql.ConnectionPool(dbConfig).connect();
    isConnected = true;
    console.log('[Database] Successfully connected to Microsoft SQL Server!');
    await initializeMssqlSchema(pool);
    return pool;
  } catch (error) {
    isConnected = false;
    console.warn(`[Database] Microsoft SQL Server connection unavailable (${error.message}).`);
    console.log('[Database] Initialized active schema fallback store. Full API is active and ready.');
    return null;
  }
}

/**
 * Get Connection Pool
 */
function getPool() {
  return pool;
}

/**
 * Check if connected to real MSSQL Server
 */
function isMssqlConnected() {
  return isConnected && pool !== null;
}

module.exports = {
  sql,
  dbConfig,
  connectDB,
  getPool,
  isMssqlConnected,
  fallbackStore
};
