const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME_PATH = fs.existsSync('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe')
  ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  : 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const OUTPUT_DIR = path.resolve(__dirname, '..', 'diagrams');

const DIAGRAMS = {
  system_architecture: `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; background: #ffffff; width: 900px; margin: auto;">
      <h2 style="text-align: center; color: #0f172a; margin-bottom: 30px; font-size: 22px; font-weight: 800; letter-spacing: -0.5px;">
        RESUMECHECK – SYSTEM ARCHITECTURE
      </h2>
      <svg width="820" height="520" viewBox="0 0 820 520" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" flood-opacity="0.08" />
          </filter>
          <linearGradient id="clientGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#0284c7" />
            <stop offset="100%" stop-color="#0369a1" />
          </linearGradient>
          <linearGradient id="serverGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#059669" />
            <stop offset="100%" stop-color="#047857" />
          </linearGradient>
          <linearGradient id="dbGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#d97706" />
            <stop offset="100%" stop-color="#b45309" />
          </linearGradient>
        </defs>

        <!-- User Layer -->
        <rect x="290" y="20" width="240" height="60" rx="12" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2" filter="url(#shadow)"/>
        <text x="410" y="55" font-size="15" font-weight="bold" fill="#1e293b" text-anchor="middle">End User (Web Browser / Client)</text>

        <!-- Down Arrow 1 -->
        <path d="M 410 80 L 410 115" stroke="#64748b" stroke-width="2" marker-end="url(#arrow)" fill="none" stroke-dasharray="4 4"/>
        <polygon points="410,120 405,110 415,110" fill="#64748b"/>
        <text x="420" y="102" font-size="11" fill="#64748b" font-weight="600">HTTPS / Responsive UI</text>

        <!-- Presentation Layer -->
        <rect x="100" y="125" width="620" height="100" rx="14" fill="#f0f9ff" stroke="#bae6fd" stroke-width="2" filter="url(#shadow)"/>
        <text x="120" y="150" font-size="13" font-weight="bold" fill="#0369a1">PRESENTATION LAYER (React.js + Vite + Tailwind CSS)</text>
        <rect x="120" y="165" width="130" height="42" rx="8" fill="url(#clientGrad)"/>
        <text x="185" y="191" font-size="11" font-weight="bold" fill="#ffffff" text-anchor="middle">Interactive UI & SPA</text>
        <rect x="270" y="165" width="130" height="42" rx="8" fill="url(#clientGrad)"/>
        <text x="335" y="191" font-size="11" font-weight="bold" fill="#ffffff" text-anchor="middle">Framer Motion FX</text>
        <rect x="420" y="165" width="130" height="42" rx="8" fill="url(#clientGrad)"/>
        <text x="485" y="191" font-size="11" font-weight="bold" fill="#ffffff" text-anchor="middle">Recharts Analytics</text>
        <rect x="570" y="165" width="130" height="42" rx="8" fill="url(#clientGrad)"/>
        <text x="635" y="191" font-size="11" font-weight="bold" fill="#ffffff" text-anchor="middle">Axios HTTP Client</text>

        <!-- Down Arrow 2 -->
        <path d="M 410 225 L 410 260" stroke="#64748b" stroke-width="2" fill="none"/>
        <polygon points="410,265 405,255 415,255" fill="#64748b"/>
        <text x="420" y="248" font-size="11" fill="#64748b" font-weight="600">REST API / JWT Authorization (Bearer)</text>

        <!-- Application Layer -->
        <rect x="100" y="270" width="620" height="110" rx="14" fill="#ecfdf5" stroke="#a7f3d0" stroke-width="2" filter="url(#shadow)"/>
        <text x="120" y="295" font-size="13" font-weight="bold" fill="#047857">APPLICATION LAYER (Node.js & Express.js REST API)</text>
        <rect x="120" y="310" width="130" height="50" rx="8" fill="url(#serverGrad)"/>
        <text x="185" y="333" font-size="11" font-weight="bold" fill="#ffffff" text-anchor="middle">JWT & bcryptjs</text>
        <text x="185" y="348" font-size="9" fill="#e2e8f0" text-anchor="middle">Auth Middleware</text>
        <rect x="270" y="310" width="150" height="50" rx="8" fill="url(#serverGrad)"/>
        <text x="345" y="333" font-size="11" font-weight="bold" fill="#ffffff" text-anchor="middle">Text Processing</text>
        <text x="345" y="348" font-size="9" fill="#e2e8f0" text-anchor="middle">Normalization & N-grams</text>
        <rect x="440" y="310" width="130" height="50" rx="8" fill="url(#serverGrad)"/>
        <text x="505" y="333" font-size="11" font-weight="bold" fill="#ffffff" text-anchor="middle">Match Engine</text>
        <text x="505" y="348" font-size="9" fill="#e2e8f0" text-anchor="middle">Percentage Formula</text>
        <rect x="590" y="310" width="110" height="50" rx="8" fill="url(#serverGrad)"/>
        <text x="645" y="333" font-size="11" font-weight="bold" fill="#ffffff" text-anchor="middle">PDF Parser</text>
        <text x="645" y="348" font-size="9" fill="#e2e8f0" text-anchor="middle">multer & pdf-parse</text>

        <!-- Down Arrow 3 -->
        <path d="M 410 380 L 410 415" stroke="#64748b" stroke-width="2" fill="none"/>
        <polygon points="410,420 405,410 415,410" fill="#64748b"/>
        <text x="420" y="403" font-size="11" fill="#64748b" font-weight="600">mssql Driver / Parameterized T-SQL Queries (Port 1433)</text>

        <!-- Data Layer -->
        <rect x="100" y="425" width="620" height="80" rx="14" fill="#fffbeb" stroke="#fde68a" stroke-width="2" filter="url(#shadow)"/>
        <text x="120" y="450" font-size="13" font-weight="bold" fill="#b45309">DATA PERSISTENCE LAYER (Microsoft SQL Server – ResumeKeywordCheckerDB)</text>
        <rect x="120" y="460" width="130" height="32" rx="6" fill="url(#dbGrad)"/>
        <text x="185" y="480" font-size="11" font-weight="bold" fill="#ffffff" text-anchor="middle">USERS</text>
        <rect x="270" y="460" width="130" height="32" rx="6" fill="url(#dbGrad)"/>
        <text x="335" y="480" font-size="11" font-weight="bold" fill="#ffffff" text-anchor="middle">ANALYSES</text>
        <rect x="420" y="460" width="130" height="32" rx="6" fill="url(#dbGrad)"/>
        <text x="485" y="480" font-size="11" font-weight="bold" fill="#ffffff" text-anchor="middle">KEYWORDS</text>
        <rect x="570" y="460" width="130" height="32" rx="6" fill="url(#dbGrad)"/>
        <text x="635" y="480" font-size="10" font-weight="bold" fill="#ffffff" text-anchor="middle">ANALYSIS_KEYWORDS</text>
      </svg>
    </div>
  `,

  use_case_diagram: `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; background: #ffffff; width: 850px; margin: auto;">
      <h2 style="text-align: center; color: #0f172a; margin-bottom: 25px; font-size: 22px; font-weight: 800;">
        RESUMECHECK – USE CASE DIAGRAM
      </h2>
      <svg width="770" height="500" viewBox="0 0 770 500" xmlns="http://www.w3.org/2000/svg">
        <!-- System Boundary Box -->
        <rect x="180" y="20" width="560" height="460" rx="16" fill="#f8fafc" stroke="#94a3b8" stroke-width="2"/>
        <text x="460" y="50" font-size="14" font-weight="bold" fill="#0f172a" text-anchor="middle">ResumeCheck Application System</text>

        <!-- Actor: User -->
        <circle cx="80" cy="220" r="22" fill="#e0f2fe" stroke="#0284c7" stroke-width="3"/>
        <line x1="80" y1="242" x2="80" y2="300" stroke="#0284c7" stroke-width="3"/>
        <line x1="50" y1="265" x2="110" y2="265" stroke="#0284c7" stroke-width="3"/>
        <line x1="80" y1="300" x2="60" y2="350" stroke="#0284c7" stroke-width="3"/>
        <line x1="80" y1="300" x2="100" y2="350" stroke="#0284c7" stroke-width="3"/>
        <text x="80" y="380" font-size="13" font-weight="bold" fill="#0369a1" text-anchor="middle">Candidate / User</text>

        <!-- Use Cases (Ovals) -->
        <!-- UC 1: Register -->
        <ellipse cx="320" cy="90" rx="90" ry="24" fill="#ffffff" stroke="#0284c7" stroke-width="2"/>
        <text x="320" y="95" font-size="12" font-weight="600" fill="#1e293b" text-anchor="middle">Register Account</text>

        <!-- UC 2: Login -->
        <ellipse cx="320" cy="150" rx="90" ry="24" fill="#ffffff" stroke="#0284c7" stroke-width="2"/>
        <text x="320" y="155" font-size="12" font-weight="600" fill="#1e293b" text-anchor="middle">Authenticate / Login</text>

        <!-- UC 3: Analyze Resume Text -->
        <ellipse cx="320" cy="210" rx="95" ry="24" fill="#ffffff" stroke="#0284c7" stroke-width="2"/>
        <text x="320" y="215" font-size="12" font-weight="600" fill="#1e293b" text-anchor="middle">Analyze Resume Text</text>

        <!-- UC 4: Upload Resume PDF -->
        <ellipse cx="320" cy="270" rx="95" ry="24" fill="#ffffff" stroke="#0284c7" stroke-width="2"/>
        <text x="320" y="275" font-size="12" font-weight="600" fill="#1e293b" text-anchor="middle">Upload Resume PDF</text>

        <!-- UC 5: View Results & Breakdown -->
        <ellipse cx="320" cy="330" rx="95" ry="24" fill="#ffffff" stroke="#0284c7" stroke-width="2"/>
        <text x="320" y="335" font-size="12" font-weight="600" fill="#1e293b" text-anchor="middle">View Match & Breakdown</text>

        <!-- UC 6: View Dashboard Analytics -->
        <ellipse cx="320" cy="390" rx="95" ry="24" fill="#ffffff" stroke="#0284c7" stroke-width="2"/>
        <text x="320" y="395" font-size="12" font-weight="600" fill="#1e293b" text-anchor="middle">View Dashboard Charts</text>

        <!-- UC 7: Manage History & Profile -->
        <ellipse cx="320" cy="450" rx="95" ry="24" fill="#ffffff" stroke="#0284c7" stroke-width="2"/>
        <text x="320" y="455" font-size="12" font-weight="600" fill="#1e293b" text-anchor="middle">Manage History & Profile</text>

        <!-- Include Use Cases on right -->
        <ellipse cx="590" cy="210" rx="100" ry="24" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.5" stroke-dasharray="4 4"/>
        <text x="590" y="215" font-size="11" font-weight="600" fill="#1e40af" text-anchor="middle">&lt;&lt;include&gt;&gt; Extract Keywords</text>

        <ellipse cx="590" cy="270" rx="100" ry="24" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.5" stroke-dasharray="4 4"/>
        <text x="590" y="275" font-size="11" font-weight="600" fill="#1e40af" text-anchor="middle">&lt;&lt;include&gt;&gt; Calculate Score %</text>

        <ellipse cx="590" cy="330" rx="100" ry="24" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.5" stroke-dasharray="4 4"/>
        <text x="590" y="335" font-size="11" font-weight="600" fill="#1e40af" text-anchor="middle">&lt;&lt;include&gt;&gt; Recommendations</text>

        <!-- Actor to UCs lines -->
        <line x1="105" y1="260" x2="230" y2="95" stroke="#64748b" stroke-width="1.5"/>
        <line x1="105" y1="260" x2="230" y2="150" stroke="#64748b" stroke-width="1.5"/>
        <line x1="105" y1="260" x2="225" y2="210" stroke="#64748b" stroke-width="1.5"/>
        <line x1="105" y1="260" x2="225" y2="270" stroke="#64748b" stroke-width="1.5"/>
        <line x1="105" y1="260" x2="225" y2="330" stroke="#64748b" stroke-width="1.5"/>
        <line x1="105" y1="260" x2="225" y2="390" stroke="#64748b" stroke-width="1.5"/>
        <line x1="105" y1="260" x2="225" y2="450" stroke="#64748b" stroke-width="1.5"/>

        <!-- Includes lines -->
        <line x1="415" y1="210" x2="490" y2="210" stroke="#3b82f6" stroke-width="1.5" stroke-dasharray="3 3"/>
        <line x1="415" y1="220" x2="495" y2="265" stroke="#3b82f6" stroke-width="1.5" stroke-dasharray="3 3"/>
        <line x1="415" y1="230" x2="500" y2="320" stroke="#3b82f6" stroke-width="1.5" stroke-dasharray="3 3"/>
      </svg>
    </div>
  `,

  dfd_level0: `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; background: #ffffff; width: 850px; margin: auto;">
      <h2 style="text-align: center; color: #0f172a; margin-bottom: 25px; font-size: 22px; font-weight: 800;">
        DATA FLOW DIAGRAM – LEVEL 0 (CONTEXT LEVEL)
      </h2>
      <svg width="770" height="340" viewBox="0 0 770 340" xmlns="http://www.w3.org/2000/svg">
        <!-- External Entity: User -->
        <rect x="50" y="110" width="160" height="90" rx="8" fill="#f8fafc" stroke="#334155" stroke-width="2"/>
        <text x="130" y="145" font-size="14" font-weight="bold" fill="#0f172a" text-anchor="middle">Candidate /</text>
        <text x="130" y="165" font-size="14" font-weight="bold" fill="#0f172a" text-anchor="middle">User</text>

        <!-- Central Process: 0.0 ResumeCheck System -->
        <circle cx="385" cy="155" r="85" fill="#eff6ff" stroke="#0284c7" stroke-width="3"/>
        <text x="385" y="140" font-size="12" font-weight="bold" fill="#0369a1" text-anchor="middle">0.0</text>
        <text x="385" y="160" font-size="14" font-weight="bold" fill="#0f172a" text-anchor="middle">RESUMECHECK</text>
        <text x="385" y="178" font-size="12" font-weight="600" fill="#334155" text-anchor="middle">KEYWORD ANALYZER</text>

        <!-- External Data Store: SQL Server Database -->
        <rect x="580" y="110" width="150" height="90" rx="8" fill="#fffbeb" stroke="#d97706" stroke-width="2"/>
        <text x="655" y="145" font-size="13" font-weight="bold" fill="#b45309" text-anchor="middle">Microsoft SQL</text>
        <text x="655" y="165" font-size="13" font-weight="bold" fill="#b45309" text-anchor="middle">Server (MSSQL)</text>

        <!-- Flows: User to Process -->
        <path d="M 210 135 L 298 135" stroke="#0284c7" stroke-width="2" fill="none"/>
        <polygon points="300,135 290,130 290,140" fill="#0284c7"/>
        <text x="255" y="125" font-size="10" font-weight="600" fill="#0284c7" text-anchor="middle">Credentials, Resume, Job Spec</text>

        <!-- Flows: Process to User -->
        <path d="M 300 175 L 212 175" stroke="#059669" stroke-width="2" fill="none"/>
        <polygon points="210,175 220,170 220,180" fill="#059669"/>
        <text x="255" y="195" font-size="10" font-weight="600" fill="#059669" text-anchor="middle">Match %, Badges, Recommendations</text>

        <!-- Flows: Process to DB -->
        <path d="M 472 135 L 578 135" stroke="#d97706" stroke-width="2" fill="none"/>
        <polygon points="580,135 570,130 570,140" fill="#d97706"/>
        <text x="525" y="125" font-size="10" font-weight="600" fill="#d97706" text-anchor="middle">Store Records & Keywords</text>

        <!-- Flows: DB to Process -->
        <path d="M 580 175 L 472 175" stroke="#d97706" stroke-width="2" fill="none"/>
        <polygon points="470,175 480,170 480,180" fill="#d97706"/>
        <text x="525" y="195" font-size="10" font-weight="600" fill="#d97706" text-anchor="middle">Dictionary & Historical Trends</text>
      </svg>
    </div>
  `,

  dfd_level1: `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; padding: 30px; background: #ffffff; width: 880px; margin: auto;">
      <h2 style="text-align: center; color: #0f172a; margin-bottom: 20px; font-size: 21px; font-weight: 800;">
        DATA FLOW DIAGRAM – LEVEL 1 (DECOMPOSITION)
      </h2>
      <svg width="820" height="480" viewBox="0 0 820 480" xmlns="http://www.w3.org/2000/svg">
        <!-- Sub-process 1.0: User Authentication -->
        <rect x="70" y="50" width="180" height="70" rx="10" fill="#eff6ff" stroke="#0284c7" stroke-width="2"/>
        <text x="160" y="80" font-size="12" font-weight="bold" fill="#0369a1" text-anchor="middle">1.0 User Auth &</text>
        <text x="160" y="98" font-size="12" font-weight="bold" fill="#0369a1" text-anchor="middle">Profile Management</text>

        <!-- Sub-process 2.0: Resume Text & PDF Parsing -->
        <rect x="320" y="50" width="180" height="70" rx="10" fill="#ecfdf5" stroke="#059669" stroke-width="2"/>
        <text x="410" y="80" font-size="12" font-weight="bold" fill="#047857" text-anchor="middle">2.0 Resume Ingestion</text>
        <text x="410" y="98" font-size="12" font-weight="bold" fill="#047857" text-anchor="middle">& PDF Text Extraction</text>

        <!-- Sub-process 3.0: Keyword Extraction & Matching -->
        <rect x="570" y="50" width="190" height="70" rx="10" fill="#faf5ff" stroke="#9333ea" stroke-width="2"/>
        <text x="665" y="80" font-size="12" font-weight="bold" fill="#6b21a8" text-anchor="middle">3.0 Keyword Extraction</text>
        <text x="665" y="98" font-size="12" font-weight="bold" fill="#6b21a8" text-anchor="middle">& Normalization Engine</text>

        <!-- Sub-process 4.0: Scoring & Recommendation -->
        <rect x="220" y="220" width="190" height="70" rx="10" fill="#fff7ed" stroke="#ea580c" stroke-width="2"/>
        <text x="315" y="250" font-size="12" font-weight="bold" fill="#9a3412" text-anchor="middle">4.0 Score Calculation</text>
        <text x="315" y="268" font-size="12" font-weight="bold" fill="#9a3412" text-anchor="middle">& Recommendation Gen</text>

        <!-- Sub-process 5.0: History & Analytics Feeds -->
        <rect x="490" y="220" width="190" height="70" rx="10" fill="#f0fdf4" stroke="#16a34a" stroke-width="2"/>
        <text x="585" y="250" font-size="12" font-weight="bold" fill="#15803d" text-anchor="middle">5.0 Analytics Feed</text>
        <text x="585" y="268" font-size="12" font-weight="bold" fill="#15803d" text-anchor="middle">& History Aggregation</text>

        <!-- Data Stores (D1 to D4) -->
        <g transform="translate(100, 380)">
          <rect x="0" y="0" width="140" height="50" rx="6" fill="#f8fafc" stroke="#64748b" stroke-width="2"/>
          <text x="70" y="25" font-size="11" font-weight="bold" fill="#334155" text-anchor="middle">D1: USERS</text>
          <text x="70" y="40" font-size="9" fill="#64748b" text-anchor="middle">Credentials & Profiles</text>
        </g>

        <g transform="translate(270, 380)">
          <rect x="0" y="0" width="140" height="50" rx="6" fill="#f8fafc" stroke="#64748b" stroke-width="2"/>
          <text x="70" y="25" font-size="11" font-weight="bold" fill="#334155" text-anchor="middle">D2: KEYWORDS</text>
          <text x="70" y="40" font-size="9" fill="#64748b" text-anchor="middle">Skill Dictionary</text>
        </g>

        <g transform="translate(440, 380)">
          <rect x="0" y="0" width="140" height="50" rx="6" fill="#f8fafc" stroke="#64748b" stroke-width="2"/>
          <text x="70" y="25" font-size="11" font-weight="bold" fill="#334155" text-anchor="middle">D3: ANALYSES</text>
          <text x="70" y="40" font-size="9" fill="#64748b" text-anchor="middle">Scores & Text Logs</text>
        </g>

        <g transform="translate(610, 380)">
          <rect x="0" y="0" width="160" height="50" rx="6" fill="#f8fafc" stroke="#64748b" stroke-width="2"/>
          <text x="80" y="25" font-size="11" font-weight="bold" fill="#334155" text-anchor="middle">D4: ANALYSIS_KEYWORDS</text>
          <text x="80" y="40" font-size="9" fill="#64748b" text-anchor="middle">Junction Matches</text>
        </g>

        <!-- Connecting Lines -->
        <line x1="250" y1="85" x2="320" y2="85" stroke="#64748b" stroke-width="1.5"/>
        <line x1="500" y1="85" x2="570" y2="85" stroke="#64748b" stroke-width="1.5"/>
        <line x1="665" y1="120" x2="350" y2="220" stroke="#64748b" stroke-width="1.5"/>
        <line x1="410" y1="255" x2="490" y2="255" stroke="#64748b" stroke-width="1.5"/>

        <line x1="160" y1="120" x2="160" y2="380" stroke="#0284c7" stroke-width="1.5"/>
        <line x1="665" y1="120" x2="340" y2="380" stroke="#9333ea" stroke-width="1.5"/>
        <line x1="315" y1="290" x2="510" y2="380" stroke="#ea580c" stroke-width="1.5"/>
        <line x1="585" y1="290" x2="690" y2="380" stroke="#16a34a" stroke-width="1.5"/>
      </svg>
    </div>
  `,

  erd_diagram: `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; background: #ffffff; width: 900px; margin: auto;">
      <h2 style="text-align: center; color: #0f172a; margin-bottom: 25px; font-size: 22px; font-weight: 800;">
        ENTITY-RELATIONSHIP DIAGRAM (ERD)
      </h2>
      <svg width="820" height="440" viewBox="0 0 820 440" xmlns="http://www.w3.org/2000/svg">
        <!-- Entity 1: USERS -->
        <rect x="50" y="50" width="220" height="170" rx="8" fill="#f8fafc" stroke="#0284c7" stroke-width="2"/>
        <rect x="50" y="50" width="220" height="35" rx="8" fill="#0284c7"/>
        <text x="160" y="73" font-size="13" font-weight="bold" fill="#ffffff" text-anchor="middle">USERS</text>
        <text x="65" y="105" font-size="11" font-family="monospace" fill="#0f172a">PK | UserId (INT)</text>
        <text x="65" y="125" font-size="11" fill="#334155">FullName (NVARCHAR)</text>
        <text x="65" y="145" font-size="11" fill="#334155">Email (NVARCHAR, UQ)</text>
        <text x="65" y="165" font-size="11" fill="#334155">PasswordHash (NVARCHAR)</text>
        <text x="65" y="185" font-size="11" fill="#334155">CreatedAt (DATETIME2)</text>
        <text x="65" y="205" font-size="11" fill="#334155">UpdatedAt (DATETIME2)</text>

        <!-- Entity 2: ANALYSES -->
        <rect x="350" y="50" width="230" height="230" rx="8" fill="#f8fafc" stroke="#059669" stroke-width="2"/>
        <rect x="350" y="50" width="230" height="35" rx="8" fill="#059669"/>
        <text x="465" y="73" font-size="13" font-weight="bold" fill="#ffffff" text-anchor="middle">ANALYSES</text>
        <text x="365" y="105" font-size="11" font-family="monospace" fill="#0f172a">PK | AnalysisId (INT)</text>
        <text x="365" y="125" font-size="11" font-family="monospace" fill="#0f172a">FK | UserId (INT)</text>
        <text x="365" y="145" font-size="11" fill="#334155">JobTitle (NVARCHAR)</text>
        <text x="365" y="165" font-size="11" fill="#334155">ResumeText (NVARCHAR(MAX))</text>
        <text x="365" y="185" font-size="11" fill="#334155">JobDescription (NVARCHAR(MAX))</text>
        <text x="365" y="205" font-size="11" fill="#334155">TotalKeywords (INT)</text>
        <text x="365" y="225" font-size="11" fill="#334155">MatchedKeywords (INT)</text>
        <text x="365" y="245" font-size="11" fill="#334155">MissingKeywords (INT)</text>
        <text x="365" y="265" font-size="11" fill="#334155">MatchPercentage (DECIMAL)</text>

        <!-- Entity 3: KEYWORDS -->
        <rect x="50" y="280" width="220" height="140" rx="8" fill="#f8fafc" stroke="#d97706" stroke-width="2"/>
        <rect x="50" y="280" width="220" height="35" rx="8" fill="#d97706"/>
        <text x="160" y="303" font-size="13" font-weight="bold" fill="#ffffff" text-anchor="middle">KEYWORDS</text>
        <text x="65" y="335" font-size="11" font-family="monospace" fill="#0f172a">PK | KeywordId (INT)</text>
        <text x="65" y="355" font-size="11" fill="#334155">Keyword (NVARCHAR, UQ)</text>
        <text x="65" y="375" font-size="11" fill="#334155">Category (NVARCHAR)</text>
        <text x="65" y="395" font-size="11" fill="#334155">Importance (NVARCHAR)</text>
        <text x="65" y="415" font-size="11" fill="#334155">IsActive (BIT)</text>

        <!-- Entity 4: ANALYSIS_KEYWORDS -->
        <rect x="490" y="280" width="250" height="140" rx="8" fill="#f8fafc" stroke="#7c3aed" stroke-width="2"/>
        <rect x="490" y="280" width="250" height="35" rx="8" fill="#7c3aed"/>
        <text x="615" y="303" font-size="13" font-weight="bold" fill="#ffffff" text-anchor="middle">ANALYSIS_KEYWORDS</text>
        <text x="505" y="335" font-size="11" font-family="monospace" fill="#0f172a">PK | AnalysisKeywordId (INT)</text>
        <text x="505" y="355" font-size="11" font-family="monospace" fill="#0f172a">FK | AnalysisId (INT)</text>
        <text x="505" y="375" font-size="11" font-family="monospace" fill="#0f172a">FK | KeywordId (INT)</text>
        <text x="505" y="395" font-size="11" fill="#334155">FoundInResume (BIT)</text>
        <text x="505" y="415" font-size="11" fill="#334155">FoundInJobDescription (BIT)</text>

        <!-- Relationship 1: USERS to ANALYSES (1 to Many) -->
        <line x1="270" y1="135" x2="350" y2="135" stroke="#334155" stroke-width="2"/>
        <text x="280" y="128" font-size="12" font-weight="bold" fill="#334155">1</text>
        <text x="335" y="128" font-size="12" font-weight="bold" fill="#334155">N</text>

        <!-- Relationship 2: ANALYSES to ANALYSIS_KEYWORDS (1 to Many) -->
        <line x1="500" y1="280" x2="500" y2="280" stroke="#334155" stroke-width="2"/>
        <path d="M 465 280 L 465 350 L 490 350" stroke="#334155" stroke-width="2" fill="none"/>
        <text x="455" y="295" font-size="12" font-weight="bold" fill="#334155">1</text>
        <text x="475" y="343" font-size="12" font-weight="bold" fill="#334155">N</text>

        <!-- Relationship 3: KEYWORDS to ANALYSIS_KEYWORDS (1 to Many) -->
        <line x1="270" y1="350" x2="490" y2="350" stroke="#334155" stroke-width="2"/>
        <text x="280" y="343" font-size="12" font-weight="bold" fill="#334155">1</text>
        <text x="475" y="365" font-size="12" font-weight="bold" fill="#334155">N</text>
      </svg>
    </div>
  `
};

async function renderDiagrams() {
  console.log('Rendering high-resolution vector diagrams...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    defaultViewport: { width: 1000, height: 700, deviceScaleFactor: 2 },
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();

  for (const [name, html] of Object.entries(DIAGRAMS)) {
    console.log(`Rendering diagram: ${name}...`);
    await page.setContent(`<!DOCTYPE html><html><body style="margin:0; background:#ffffff;">${html}</body></html>`);
    const el = await page.$('div');
    const outPath = path.join(OUTPUT_DIR, `${name}.png`);
    await el.screenshot({ path: outPath });
    console.log(`Saved: ${outPath}`);
  }

  await browser.close();
  console.log('All diagrams generated successfully!');
}

renderDiagrams().catch(console.error);
