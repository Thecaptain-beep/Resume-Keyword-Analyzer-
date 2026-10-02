# ResumeCheck – AI-Style Resume Keyword Analyzer

**ResumeCheck** is a full-stack web application that compares resumes against job descriptions, computes keyword alignment percentage, identifies matched and missing technical and professional competencies, generates actionable advice, and archives historical evaluations in **Microsoft SQL Server**.

---

## 1. Project Overview

Modern applicant tracking systems (ATS) and recruiters screen resumes based on technical and soft skill keywords. **ResumeCheck** empowers job applicants to:
- Instantly evaluate resume alignment against job descriptions.
- **Upload Resume PDFs directly**: Drag & drop or browse `.pdf` documents with automated text and skill extraction.
- Extract single-word and multi-word keywords across 12 tech and business domains.
- Calculate transparent match scores: `(Matched Job Keywords / Total Job Keywords) * 100`.
- Categorize competencies into Programming, Frontend, Backend, Database, Data Analytics, AI/ML, Cloud, DevOps, Tools, APIs, Security, and Professional skills.
- Inspect missing keywords with importance ratings.
- Receive tailored, realistic recommendations for enhancing their CV.
- Track resume progress through interactive charts and historical records.

---

## 2. Technology Stack

### Frontend:
- **Framework**: React.js (v18) with Vite
- **Styling**: Tailwind CSS with custom glassmorphism design tokens
- **Animations & Micro-interactions**: Framer Motion
- **Data Visualizations**: Recharts (LineChart, BarChart, PieChart)
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Routing**: React Router DOM (v6)
- **HTTP Client**: Axios with automated bearer token injection

### Backend:
- **Runtime**: Node.js & Express.js
- **Database Driver**: `mssql` (Microsoft SQL Server connection pool)
- **Authentication**: JSON Web Tokens (JWT) & bcryptjs password hashing
- **Validation**: express-validator
- **Cross-Origin**: CORS & dotenv

### Database:
- **Primary Database**: Microsoft SQL Server (`ResumeKeywordCheckerDB`)
- Standardized T-SQL schema with tables, foreign keys, identity columns, cascading rules, nonclustered indexes, and seed dictionary.

---

## 3. Architecture

```text
React Frontend (Vite)
        │
        │  Axios HTTP / JSON Web Token
        ▼
Node.js + Express Backend
        │
        ├── Auth Middleware (JWT Verification)
        ├── Text Processor & Keyword Extraction Engine
        │       ├── Normalization & Tokenization
        │       ├── Multi-word N-gram Matching
        │       └── Match Percentage Calculation
        ├── Analysis & Dashboard Services
        │
        ▼
Microsoft SQL Server (ResumeKeywordCheckerDB)
        ├── USERS
        ├── ANALYSES
        ├── KEYWORDS
        └── ANALYSIS_KEYWORDS
```

---

## 4. Folder Structure

```text
Orvionor project/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AnimatedSection.jsx
│   │   │   ├── ConfirmModal.jsx
│   │   │   ├── KeywordBadge.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── ScoreCard.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── SkeletonCard.jsx
│   │   │   ├── StatCard.jsx
│   │   │   └── ThemeToggle.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   ├── pages/
│   │   │   ├── Analyze.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── History.jsx
│   │   │   ├── Landing.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Register.jsx
│   │   │   └── Results.jsx
│   │   ├── services/
│   │   │   ├── analysisService.js
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   ├── dashboardService.js
│   │   │   └── userService.js
│   │   ├── utils/
│   │   │   ├── animations.js
│   │   │   └── formatters.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.js
│   ├── .env.example
│   └── .env
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── controllers/
│   │   │   ├── analysisController.js
│   │   │   ├── authController.js
│   │   │   ├── dashboardController.js
│   │   │   └── userController.js
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js
│   │   │   └── errorMiddleware.js
│   │   ├── routes/
│   │   │   ├── analysisRoutes.js
│   │   │   ├── authRoutes.js
│   │   │   ├── dashboardRoutes.js
│   │   │   └── userRoutes.js
│   │   ├── services/
│   │   │   ├── analysisService.js
│   │   │   └── keywordService.js
│   │   ├── utils/
│   │   │   ├── keywordDictionary.js
│   │   │   └── textProcessor.js
│   │   ├── app.js
│   │   └── server.js
│   ├── package.json
│   ├── .env.example
│   └── .env
│
├── database.sql
├── API_DOCUMENTATION.md
├── README.md
├── .gitignore
└── package.json
```

---

## 5. Database Schema

The database script `database.sql` executes in Microsoft SQL Server:

```sql
-- Database: ResumeKeywordCheckerDB

CREATE TABLE USERS (
    UserId INT IDENTITY(1,1) PRIMARY KEY,
    FullName NVARCHAR(100) NOT NULL,
    Email NVARCHAR(150) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(255) NOT NULL,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE()
);

CREATE TABLE KEYWORDS (
    KeywordId INT IDENTITY(1,1) PRIMARY KEY,
    Keyword NVARCHAR(100) NOT NULL UNIQUE,
    Category NVARCHAR(100) NOT NULL,
    Importance NVARCHAR(20) NOT NULL DEFAULT 'Medium',
    IsActive BIT DEFAULT 1
);

CREATE TABLE ANALYSES (
    AnalysisId INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL FOREIGN KEY REFERENCES USERS(UserId) ON DELETE CASCADE,
    JobTitle NVARCHAR(200) NULL,
    ResumeText NVARCHAR(MAX) NOT NULL,
    JobDescription NVARCHAR(MAX) NOT NULL,
    TotalKeywords INT NOT NULL DEFAULT 0,
    MatchedKeywords INT NOT NULL DEFAULT 0,
    MissingKeywords INT NOT NULL DEFAULT 0,
    MatchPercentage DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    CreatedAt DATETIME2 DEFAULT GETDATE()
);

CREATE TABLE ANALYSIS_KEYWORDS (
    AnalysisKeywordId INT IDENTITY(1,1) PRIMARY KEY,
    AnalysisId INT NOT NULL FOREIGN KEY REFERENCES ANALYSES(AnalysisId) ON DELETE CASCADE,
    KeywordId INT NOT NULL FOREIGN KEY REFERENCES KEYWORDS(KeywordId) ON DELETE CASCADE,
    FoundInResume BIT NOT NULL,
    FoundInJobDescription BIT NOT NULL
);
```

---

## 6. Environment Variables

### Backend (`server/.env`):
```env
PORT=5000
DB_SERVER=localhost
DB_PORT=1433
DB_NAME=ResumeKeywordCheckerDB
DB_USER=sa
DB_PASSWORD=YourStrongPassword123!
DB_ENCRYPT=false
DB_TRUST_SERVER_CERTIFICATE=true
JWT_SECRET=super_secure_resumecheck_jwt_secret_key_2026_xyz123
CLIENT_URL=http://localhost:5173
```

### Frontend (`client/.env`):
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 7. Installation & Quick Start

### Step 1: Install Backend Dependencies
```bash
cd server
npm install
```

### Step 2: Install Frontend Dependencies
```bash
cd ../client
npm install
```

### Step 3: Run Backend Server
```bash
cd ../server
npm start
# Or for live reload during development:
npm run dev
```

### Step 4: Run Frontend Client
```bash
cd ../client
npm run dev
```

The application is accessible in your browser at:
`http://localhost:5173`

---

## 8. Microsoft SQL Server Setup

1. Open **SQL Server Management Studio (SSMS)** or `sqlcmd`.
2. Connect to your SQL Server instance (e.g. `localhost`).
3. Open and run the `database.sql` script located in the project root.
4. Verify that `ResumeKeywordCheckerDB` is created with tables `USERS`, `ANALYSES`, `KEYWORDS`, and `ANALYSIS_KEYWORDS`.
5. Update `server/.env` with your SQL Server user credentials (`DB_USER`, `DB_PASSWORD`).
6. When the backend starts, it connects directly via `mssql`. If SQL Server is paused or offline, the backend activates its automated in-memory schema fallback so development and testing continue without disruption.

---

## 9. Sample Test Inputs

### Sample 1: Full-Stack Developer
- **Resume Text**:
  ```text
  Software developer with experience in Python, JavaScript, React, Node.js, SQL, Git, Power BI and Machine Learning. Developed web applications and data analytics dashboards.
  ```
- **Job Description**:
  ```text
  We are looking for a Full Stack Developer with experience in JavaScript, React, Node.js, SQL, AWS, Docker, Git and REST APIs. Knowledge of Machine Learning and Python is a plus.
  ```

---

## 10. Future Enhancements (V2 Roadmap)
- Native PDF & DOCX file drag-and-drop parsing.
- Section-by-section CV breakdown (Education, Experience, Certifications).
- Automated export of analysis reports to downloadable PDF format.
- Multi-resume comparison matrix for candidate evaluation.
