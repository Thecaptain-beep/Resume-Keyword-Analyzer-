-- ============================================================================
-- ResumeCheck - AI-Style Resume Keyword Analyzer
-- Database Script for Microsoft SQL Server
-- Database Name: ResumeKeywordCheckerDB
-- ============================================================================

-- Create Database if not exists
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = N'ResumeKeywordCheckerDB')
BEGIN
    CREATE DATABASE ResumeKeywordCheckerDB;
END
GO

USE ResumeKeywordCheckerDB;
GO

-- ============================================================================
-- 1. USERS TABLE
-- ============================================================================
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
END
GO

-- ============================================================================
-- 2. KEYWORDS TABLE (Standard dictionary)
-- ============================================================================
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
END
GO

-- ============================================================================
-- 3. ANALYSES TABLE
-- ============================================================================
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
        CONSTRAINT FK_Analyses_Users FOREIGN KEY (UserId) 
            REFERENCES USERS(UserId) ON DELETE CASCADE
    );
END
GO

-- ============================================================================
-- 4. ANALYSIS_KEYWORDS TABLE (Junction Table)
-- ============================================================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = N'ANALYSIS_KEYWORDS')
BEGIN
    CREATE TABLE ANALYSIS_KEYWORDS (
        AnalysisKeywordId INT IDENTITY(1,1) PRIMARY KEY,
        AnalysisId INT NOT NULL,
        KeywordId INT NOT NULL,
        FoundInResume BIT NOT NULL,
        FoundInJobDescription BIT NOT NULL,
        CONSTRAINT FK_AnalysisKeywords_Analyses FOREIGN KEY (AnalysisId) 
            REFERENCES ANALYSES(AnalysisId) ON DELETE CASCADE,
        CONSTRAINT FK_AnalysisKeywords_Keywords FOREIGN KEY (KeywordId) 
            REFERENCES KEYWORDS(KeywordId) ON DELETE CASCADE
    );
END
GO

-- ============================================================================
-- 5. PERFORMANCE INDEXES
-- ============================================================================
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = N'IX_Users_Email' AND object_id = OBJECT_ID(N'USERS'))
BEGIN
    CREATE NONCLUSTERED INDEX IX_Users_Email ON USERS(Email);
END
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = N'IX_Analyses_UserId' AND object_id = OBJECT_ID(N'ANALYSES'))
BEGIN
    CREATE NONCLUSTERED INDEX IX_Analyses_UserId ON ANALYSES(UserId);
END
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = N'IX_Analyses_CreatedAt' AND object_id = OBJECT_ID(N'ANALYSES'))
BEGIN
    CREATE NONCLUSTERED INDEX IX_Analyses_CreatedAt ON ANALYSES(CreatedAt DESC);
END
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = N'IX_Keywords_Keyword' AND object_id = OBJECT_ID(N'KEYWORDS'))
BEGIN
    CREATE NONCLUSTERED INDEX IX_Keywords_Keyword ON KEYWORDS(Keyword);
END
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = N'IX_AnalysisKeywords_AnalysisId' AND object_id = OBJECT_ID(N'ANALYSIS_KEYWORDS'))
BEGIN
    CREATE NONCLUSTERED INDEX IX_AnalysisKeywords_AnalysisId ON ANALYSIS_KEYWORDS(AnalysisId);
END
GO

-- ============================================================================
-- 6. SEED KEYWORD DICTIONARY DATA
-- ============================================================================
MERGE INTO KEYWORDS AS target
USING (VALUES
    -- Programming Languages
    (N'Python', N'Programming', N'High', 1),
    (N'Java', N'Programming', N'High', 1),
    (N'C', N'Programming', N'Medium', 1),
    (N'C++', N'Programming', N'High', 1),
    (N'C#', N'Programming', N'High', 1),
    (N'JavaScript', N'Programming', N'High', 1),
    (N'TypeScript', N'Programming', N'High', 1),
    (N'Go', N'Programming', N'High', 1),
    (N'Rust', N'Programming', N'Medium', 1),
    (N'PHP', N'Programming', N'Medium', 1),
    (N'Ruby', N'Programming', N'Medium', 1),
    (N'Swift', N'Programming', N'Medium', 1),
    (N'Kotlin', N'Programming', N'Medium', 1),

    -- Frontend Technologies
    (N'HTML', N'Frontend', N'High', 1),
    (N'CSS', N'Frontend', N'High', 1),
    (N'React', N'Frontend', N'High', 1),
    (N'Angular', N'Frontend', N'High', 1),
    (N'Vue', N'Frontend', N'High', 1),
    (N'Next.js', N'Frontend', N'High', 1),
    (N'Tailwind CSS', N'Frontend', N'Medium', 1),
    (N'Bootstrap', N'Frontend', N'Medium', 1),
    (N'React Native', N'Frontend', N'High', 1),
    (N'Redux', N'Frontend', N'Medium', 1),
    (N'Sass', N'Frontend', N'Low', 1),

    -- Backend Technologies
    (N'Node.js', N'Backend', N'High', 1),
    (N'Express.js', N'Backend', N'High', 1),
    (N'Django', N'Backend', N'High', 1),
    (N'Flask', N'Backend', N'Medium', 1),
    (N'Spring Boot', N'Backend', N'High', 1),
    (N'.NET', N'Backend', N'High', 1),
    (N'FastAPI', N'Backend', N'Medium', 1),
    (N'Ruby on Rails', N'Backend', N'Medium', 1),
    (N'NestJS', N'Backend', N'Medium', 1),

    -- Databases
    (N'SQL', N'Database', N'High', 1),
    (N'MySQL', N'Database', N'High', 1),
    (N'Microsoft SQL Server', N'Database', N'High', 1),
    (N'PostgreSQL', N'Database', N'High', 1),
    (N'MongoDB', N'Database', N'High', 1),
    (N'Oracle', N'Database', N'Medium', 1),
    (N'Redis', N'Database', N'High', 1),
    (N'Elasticsearch', N'Database', N'Medium', 1),

    -- Data Analytics & Business Intelligence
    (N'Excel', N'Data', N'Medium', 1),
    (N'Power BI', N'Data', N'High', 1),
    (N'Tableau', N'Data', N'High', 1),
    (N'Data Analytics', N'Data', N'High', 1),
    (N'Data Science', N'Data', N'High', 1),
    (N'Data Visualization', N'Data', N'Medium', 1),
    (N'Pandas', N'Data', N'Medium', 1),
    (N'NumPy', N'Data', N'Medium', 1),

    -- Artificial Intelligence & Machine Learning
    (N'Artificial Intelligence', N'AI', N'High', 1),
    (N'Machine Learning', N'AI', N'High', 1),
    (N'Deep Learning', N'AI', N'High', 1),
    (N'Natural Language Processing', N'AI', N'High', 1),
    (N'Computer Vision', N'AI', N'High', 1),
    (N'Generative AI', N'AI', N'High', 1),
    (N'Large Language Models', N'AI', N'High', 1),
    (N'TensorFlow', N'AI', N'High', 1),
    (N'PyTorch', N'AI', N'High', 1),
    (N'Scikit-learn', N'AI', N'Medium', 1),

    -- Cloud Platforms
    (N'AWS', N'Cloud', N'High', 1),
    (N'Azure', N'Cloud', N'High', 1),
    (N'Google Cloud', N'Cloud', N'High', 1),
    (N'Cloud Computing', N'Cloud', N'High', 1),

    -- DevOps & Infrastructure
    (N'Docker', N'DevOps', N'High', 1),
    (N'Kubernetes', N'DevOps', N'High', 1),
    (N'CI/CD', N'DevOps', N'High', 1),
    (N'Jenkins', N'DevOps', N'Medium', 1),
    (N'GitHub Actions', N'DevOps', N'High', 1),
    (N'Terraform', N'DevOps', N'Medium', 1),
    (N'Linux', N'DevOps', N'High', 1),

    -- Developer Tools
    (N'Git', N'Tools', N'High', 1),
    (N'GitHub', N'Tools', N'High', 1),
    (N'VS Code', N'Tools', N'Medium', 1),
    (N'Figma', N'Tools', N'Medium', 1),
    (N'Postman', N'Tools', N'High', 1),
    (N'Jira', N'Tools', N'Medium', 1),

    -- APIs & Protocols
    (N'REST API', N'APIs', N'High', 1),
    (N'GraphQL', N'APIs', N'High', 1),
    (N'gRPC', N'APIs', N'Medium', 1),
    (N'WebSockets', N'APIs', N'Medium', 1),

    -- Security & Auth
    (N'Cyber Security', N'Security', N'High', 1),
    (N'Network Security', N'Security', N'High', 1),
    (N'Authentication', N'Security', N'High', 1),
    (N'OAuth', N'Security', N'High', 1),
    (N'JWT', N'Security', N'High', 1),

    -- Professional & Soft Skills
    (N'Leadership', N'Professional', N'High', 1),
    (N'Communication', N'Professional', N'High', 1),
    (N'Problem Solving', N'Professional', N'High', 1),
    (N'Teamwork', N'Professional', N'High', 1),
    (N'Project Management', N'Professional', N'High', 1),
    (N'Agile', N'Professional', N'High', 1),
    (N'Scrum', N'Professional', N'Medium', 1),
    (N'Critical Thinking', N'Professional', N'Medium', 1)
) AS source (Keyword, Category, Importance, IsActive)
ON target.Keyword = source.Keyword
WHEN MATCHED THEN
    UPDATE SET 
        target.Category = source.Category, 
        target.Importance = source.Importance, 
        target.IsActive = source.IsActive
WHEN NOT MATCHED THEN
    INSERT (Keyword, Category, Importance, IsActive)
    VALUES (source.Keyword, source.Category, source.Importance, source.IsActive);
GO

PRINT 'ResumeKeywordCheckerDB schema and seed data created successfully.';
