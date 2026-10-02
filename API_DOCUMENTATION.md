# ResumeCheck API Documentation

The **ResumeCheck API** provides enterprise-grade endpoints for user authentication, keyword extraction, multi-word pattern recognition, match scoring, history persistence, and aggregated dashboard analytics backed by Microsoft SQL Server.

Base URL: `http://localhost:5000/api`

---

## 1. Authentication Endpoints

### Register User
- **Endpoint**: `POST /api/auth/register`
- **Access**: Public
- **Request Body**:
```json
{
  "fullName": "Jane Doe",
  "email": "jane@example.com",
  "password": "Password123!"
}
```
- **Response (201 Created)**:
```json
{
  "success": true,
  "message": "Account created successfully.",
  "token": "eyJhbGciOiJIUzI1NiIsIn...",
  "user": {
    "userId": 1,
    "fullName": "Jane Doe",
    "email": "jane@example.com",
    "createdAt": "2026-10-01T14:30:00.000Z"
  }
}
```

### Login User
- **Endpoint**: `POST /api/auth/login`
- **Access**: Public
- **Request Body**:
```json
{
  "email": "jane@example.com",
  "password": "Password123!"
}
```
- **Response (200 OK)**:
```json
{
  "success": true,
  "message": "Logged in successfully.",
  "token": "eyJhbGciOiJIUzI1NiIsIn...",
  "user": {
    "userId": 1,
    "fullName": "Jane Doe",
    "email": "jane@example.com",
    "createdAt": "2026-10-01T14:30:00.000Z"
  }
}
```

### Get Authenticated User
- **Endpoint**: `GET /api/auth/me`
- **Access**: Protected (`Authorization: Bearer <token>`)
- **Response (200 OK)**:
```json
{
  "success": true,
  "user": {
    "userId": 1,
    "fullName": "Jane Doe",
    "email": "jane@example.com",
    "createdAt": "2026-10-01T14:30:00.000Z"
  }
}
```

---

## 2. Analysis Endpoints

### Upload and Extract Resume PDF
- **Endpoint**: `POST /api/analysis/upload-pdf`
- **Access**: Protected (`Authorization: Bearer <token>`)
- **Content-Type**: `multipart/form-data`
- **Body**: `resumeFile` (PDF file, max 10MB)
- **Response (200 OK)**:
```json
{
  "success": true,
  "message": "PDF text extracted successfully.",
  "fileName": "John_Doe_Resume.pdf",
  "fileSize": 128450,
  "numPages": 2,
  "charCount": 3412,
  "text": "Full Stack Software Engineer skilled in Python, React, Node.js, SQL, AWS, Docker..."
}
```

### Create Keyword Analysis
- **Endpoint**: `POST /api/analysis`
- **Access**: Protected (`Authorization: Bearer <token>`)
- **Request Body**:
```json
{
  "jobTitle": "Senior Full-Stack Engineer",
  "resumeText": "Experienced engineer skilled in Python, React, Node.js, SQL, Git, and Machine Learning...",
  "jobDescription": "We are seeking a Full-Stack Engineer with proficiency in React, Node.js, SQL, AWS, Docker, Git..."
}
```
- **Validation**:
  - `resumeText`: 50 - 100,000 characters
  - `jobDescription`: 50 - 100,000 characters
- **Response (201 Created)**:
```json
{
  "success": true,
  "analysisId": 1,
  "jobTitle": "Senior Full-Stack Engineer",
  "matchPercentage": 80.00,
  "matchTier": "Excellent Keyword Match",
  "totalKeywords": 6,
  "matchedKeywords": 5,
  "missingKeywords": 1,
  "matchedKeywordsList": [
    { "keyword": "React", "category": "Frontend", "importance": "High" },
    { "keyword": "Node.js", "category": "Backend", "importance": "High" },
    { "keyword": "SQL", "category": "Database", "importance": "High" },
    { "keyword": "Git", "category": "Tools", "importance": "High" }
  ],
  "missingKeywordsList": [
    { "keyword": "AWS", "category": "Cloud", "importance": "High" },
    { "keyword": "Docker", "category": "DevOps", "importance": "High" }
  ],
  "breakdownList": [
    {
      "keyword": "React",
      "category": "Frontend",
      "importance": "High",
      "found": true,
      "status": "Matched"
    }
  ],
  "recommendations": [
    "High-priority keywords identified in the job requirements: AWS, Docker. If you have practical experience with these technologies, be sure to incorporate them into your Skills summary or Project bullet points.",
    "The job post emphasizes DevOps & deployment tools (e.g., Docker, CI/CD). If applicable, highlight your containerization or release pipeline experience.",
    "Reminder: Keyword match percentage is a helpful indicator and does not guarantee interview selection. Always keep your resume honest, authentic, and tailored."
  ],
  "createdAt": "2026-10-01T14:35:00.000Z"
}
```

### Get All Analyses for Current User
- **Endpoint**: `GET /api/analysis`
- **Access**: Protected (`Authorization: Bearer <token>`)
- **Response (200 OK)**:
```json
{
  "success": true,
  "count": 1,
  "analyses": [
    {
      "AnalysisId": 1,
      "JobTitle": "Senior Full-Stack Engineer",
      "TotalKeywords": 6,
      "MatchedKeywords": 5,
      "MissingKeywords": 1,
      "MatchPercentage": 80.00,
      "matchTier": "Excellent Keyword Match",
      "CreatedAt": "2026-10-01T14:35:00.000Z"
    }
  ]
}
```

### Get Single Analysis By ID
- **Endpoint**: `GET /api/analysis/:id`
- **Access**: Protected (`Authorization: Bearer <token>`)
- **Response (200 OK)**: Same schema as analysis creation output including full texts, lists, and breakdown table.

### Delete Analysis By ID
- **Endpoint**: `DELETE /api/analysis/:id`
- **Access**: Protected (`Authorization: Bearer <token>`)
- **Response (200 OK)**:
```json
{
  "success": true,
  "message": "Analysis deleted successfully."
}
```

---

## 3. Dashboard Endpoints

### Get Aggregated Statistics & Chart Feeds
- **Endpoint**: `GET /api/dashboard/stats`
- **Access**: Protected (`Authorization: Bearer <token>`)
- **Response (200 OK)**:
```json
{
  "success": true,
  "stats": {
    "totalAnalyses": 4,
    "averageScore": 76.25,
    "highestScore": 88.50,
    "lowestScore": 60.00
  },
  "charts": {
    "scoreOverTime": [
      { "analysisId": 1, "jobTitle": "Full Stack Dev", "score": 75.0, "date": "Oct 1" }
    ],
    "matchedVsMissing": [
      { "jobTitle": "Full Stack Dev", "matched": 8, "missing": 2, "total": 10 }
    ],
    "categoryChartData": [
      { "name": "Frontend", "value": 5 },
      { "name": "Backend", "value": 4 },
      { "name": "Database", "value": 3 }
    ]
  }
}
```

### Get Recent Analyses
- **Endpoint**: `GET /api/dashboard/recent`
- **Access**: Protected (`Authorization: Bearer <token>`)
- **Response (200 OK)**:
```json
{
  "success": true,
  "recent": [
    {
      "AnalysisId": 1,
      "JobTitle": "Senior Full-Stack Engineer",
      "TotalKeywords": 6,
      "MatchedKeywords": 5,
      "MissingKeywords": 1,
      "MatchPercentage": 80.00,
      "CreatedAt": "2026-10-01T14:35:00.000Z"
    }
  ]
}
```

---

## 4. User Profile Endpoints

### Get User Profile
- **Endpoint**: `GET /api/user/profile`
- **Access**: Protected (`Authorization: Bearer <token>`)

### Update Profile
- **Endpoint**: `PUT /api/user/profile`
- **Access**: Protected (`Authorization: Bearer <token>`)
- **Request Body**:
```json
{
  "fullName": "Jane Smith"
}
```

### Change Password
- **Endpoint**: `PUT /api/user/change-password`
- **Access**: Protected (`Authorization: Bearer <token>`)
- **Request Body**:
```json
{
  "currentPassword": "OldPassword123!",
  "newPassword": "NewSecurePassword456!"
}
```
