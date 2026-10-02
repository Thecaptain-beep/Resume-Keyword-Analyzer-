const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  ImageRun,
  HeadingLevel,
  AlignmentType,
  WidthType,
  BorderStyle,
  PageBreak,
  Header,
  Footer,
  PageNumber,
  NumberFormat,
  ShadingType
} = require('docx');
const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const SCREENSHOTS_DIR = path.join(ROOT_DIR, 'screenshots');
const DIAGRAMS_DIR = path.join(ROOT_DIR, 'diagrams');
const OUTPUT_DOCX = path.join(ROOT_DIR, 'ResumeCheck_Project_Report.docx');

// Helper to load image buffer
function getImageBuffer(folder, filename) {
  const p = path.join(folder, filename);
  if (fs.existsSync(p)) {
    return fs.readFileSync(p);
  }
  console.warn('Image not found:', p);
  return null;
}

// Styling Constants
const PRIMARY_COLOR = '0284C7'; // Brand Blue
const TEXT_COLOR = '1E293B';    // Slate 800
const MUTED_COLOR = '64748B';   // Slate 500
const TABLE_HEADER_BG = 'F1F5F9';

function createHeading1(title) {
  return new Paragraph({
    text: title,
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 400, after: 200 },
    run: {
      color: PRIMARY_COLOR,
      bold: true,
      size: 32, // 16pt
      font: 'Calibri'
    }
  });
}

function createHeading2(title) {
  return new Paragraph({
    text: title,
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 300, after: 150 },
    run: {
      color: '0369A1',
      bold: true,
      size: 26, // 13pt
      font: 'Calibri'
    }
  });
}

function createHeading3(title) {
  return new Paragraph({
    text: title,
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 200, after: 100 },
    run: {
      color: '0F172A',
      bold: true,
      size: 22, // 11pt
      font: 'Calibri'
    }
  });
}

function createBodyParagraph(text, options = {}) {
  return new Paragraph({
    spacing: { before: 80, after: 120, line: 320 }, // 1.33 line spacing
    alignment: options.alignment || AlignmentType.LEFT,
    children: [
      new TextRun({
        text,
        color: options.color || TEXT_COLOR,
        size: options.size || 22, // 11pt
        font: 'Calibri',
        bold: options.bold || false,
        italics: options.italics || false
      })
    ]
  });
}

function createBulletPoint(text, boldPrefix = '') {
  return new Paragraph({
    bullet: { level: 0 },
    spacing: { before: 60, after: 60, line: 300 },
    children: [
      ...(boldPrefix
        ? [
            new TextRun({
              text: boldPrefix,
              bold: true,
              color: '0F172A',
              size: 22,
              font: 'Calibri'
            })
          ]
        : []),
      new TextRun({
        text: ' ' + text,
        color: TEXT_COLOR,
        size: 22,
        font: 'Calibri'
      })
    ]
  });
}

function createFigure(imageBuffer, captionText, width = 540, height = 310) {
  const children = [];
  if (imageBuffer) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 200, after: 100 },
        children: [
          new ImageRun({
            data: imageBuffer,
            transformation: { width, height },
            type: 'png'
          })
        ]
      })
    );
  }
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 80, after: 240 },
      children: [
        new TextRun({
          text: captionText,
          bold: true,
          color: '334155',
          size: 19, // 9.5pt
          font: 'Calibri',
          italics: true
        })
      ]
    })
  );
  return children;
}

function createSimpleTable(headers, rows, colWidths = []) {
  const tableRows = [];

  // Header row
  tableRows.push(
    new TableRow({
      tableHeader: true,
      children: headers.map((h, i) =>
        new TableCell({
          width: colWidths[i] ? { size: colWidths[i], type: WidthType.DXA } : undefined,
          shading: { type: ShadingType.CLEAR, fill: TABLE_HEADER_BG },
          margins: { top: 120, bottom: 120, left: 140, right: 140 },
          children: [
            new Paragraph({
              alignment: AlignmentType.LEFT,
              children: [
                new TextRun({
                  text: h,
                  bold: true,
                  color: '0F172A',
                  size: 20,
                  font: 'Calibri'
                })
              ]
            })
          ]
        })
      )
    })
  );

  // Data rows
  rows.forEach((row, rIdx) => {
    tableRows.push(
      new TableRow({
        children: row.map((cellText, i) =>
          new TableCell({
            width: colWidths[i] ? { size: colWidths[i], type: WidthType.DXA } : undefined,
            shading: {
              type: ShadingType.CLEAR,
              fill: rIdx % 2 === 1 ? 'F8FAFC' : 'FFFFFF'
            },
            margins: { top: 100, bottom: 100, left: 140, right: 140 },
            children: [
              new Paragraph({
                alignment: AlignmentType.LEFT,
                children: [
                  new TextRun({
                    text: cellText,
                    color: TEXT_COLOR,
                    size: 19,
                    font: 'Calibri'
                  })
                ]
              })
            ]
          })
        )
      })
    );
  });

  return new Table({
    width: { size: 9000, type: WidthType.DXA },
    rows: tableRows
  });
}

// Generate the complete document
async function buildReport() {
  console.log('Building complete university project report...');

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: { font: 'Calibri', size: 22, color: TEXT_COLOR }
        }
      }
    },
    sections: [
      // ==========================================
      // SECTION 1: COVER PAGE
      // ==========================================
      {
        properties: {
          page: {
            margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 }
          }
        },
        children: [
          new Paragraph({ spacing: { before: 600 } }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'A PROJECT REPORT',
                bold: true,
                size: 28,
                color: MUTED_COLOR,
                font: 'Calibri'
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 80, after: 300 },
            children: [
              new TextRun({
                text: 'ON',
                bold: true,
                size: 22,
                color: MUTED_COLOR,
                font: 'Calibri'
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 100, after: 150 },
            children: [
              new TextRun({
                text: 'RESUMECHECK – RESUME KEYWORD ANALYZER',
                bold: true,
                size: 40, // 20pt
                color: PRIMARY_COLOR,
                font: 'Calibri'
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 50, after: 400 },
            children: [
              new TextRun({
                text: 'An Intelligent Full-Stack Web Application for Automated Resume & Job Description Keyword Matching, Gap Analysis, and Analytics',
                italics: true,
                size: 24,
                color: '334155',
                font: 'Calibri'
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 200, after: 200 },
            children: [
              new TextRun({
                text: 'Submitted in partial fulfillment of the requirements for the degree of\nBACHELOR OF TECHNOLOGY / BACHELOR OF ENGINEERING\nIN\nCOMPUTER SCIENCE AND ENGINEERING',
                size: 22,
                color: '1E293B',
                font: 'Calibri'
              })
            ]
          }),
          new Paragraph({ spacing: { before: 600 } }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'Prepared By:\n',
                bold: true,
                size: 22,
                color: '0F172A'
              }),
              new TextRun({
                text: '[STUDENT NAME]\n',
                bold: true,
                size: 24,
                color: PRIMARY_COLOR
              }),
              new TextRun({
                text: 'Register Number: [REGISTER NUMBER]\nDepartment: [DEPARTMENT]',
                size: 22,
                color: '334155'
              })
            ]
          }),
          new Paragraph({ spacing: { before: 600 } }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'DEPARTMENT OF COMPUTER SCIENCE AND ENGINEERING\n',
                bold: true,
                size: 24,
                color: '0F172A'
              }),
              new TextRun({
                text: '[INSTITUTION NAME] / [COLLEGE NAME]\n',
                bold: true,
                size: 22,
                color: '334155'
              }),
              new TextRun({
                text: 'Academic Year: 2026–2027',
                bold: true,
                size: 22,
                color: MUTED_COLOR
              })
            ]
          }),
          new Paragraph({ children: [new PageBreak()] })
        ]
      },

      // ==========================================
      // SECTION 2: CERTIFICATE, DECLARATION, ACKNOWLEDGEMENT, ABSTRACT
      // ==========================================
      {
        properties: {
          page: {
            margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 }
          }
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: 'ResumeCheck – Resume Keyword Analyzer | Project Report',
                    color: MUTED_COLOR,
                    size: 18,
                    font: 'Calibri'
                  })
                ]
              })
            ]
          })
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: 'Page ',
                    color: MUTED_COLOR,
                    size: 18
                  }),
                  new TextRun({
                    children: [PageNumber.CURRENT],
                    color: MUTED_COLOR,
                    size: 18
                  })
                ]
              })
            ]
          })
        },
        children: [
          // CERTIFICATE
          createHeading1('BONAFIDE CERTIFICATE'),
          createBodyParagraph(
            'This is to certify that the project report entitled "RESUMECHECK – RESUME KEYWORD ANALYZER" is the bonafide work carried out by [STUDENT NAME] (Register No: [REGISTER NUMBER]) in partial fulfillment of the requirements for the award of the Degree of Bachelor of Technology / Bachelor of Engineering in Computer Science and Engineering at [INSTITUTION NAME], during the academic year 2026–2027.'
          ),
          createBodyParagraph(
            'The project report has been examined and approved as satisfying the academic requirements in respect of project work prescribed for the degree.'
          ),
          new Paragraph({ spacing: { before: 800 } }),
          new Table({
            width: { size: 9000, type: WidthType.DXA },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: '___________________________\n', bold: true }),
                          new TextRun({ text: 'PROJECT GUIDE\n', bold: true }),
                          new TextRun({ text: '[GUIDE NAME]\nAssistant Professor / Associate Professor\nDepartment of Computer Science & Engineering\n[INSTITUTION NAME]' })
                        ]
                      })
                    ]
                  }),
                  new TableCell({
                    borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: [
                          new TextRun({ text: '___________________________\n', bold: true }),
                          new TextRun({ text: 'HEAD OF THE DEPARTMENT\n', bold: true }),
                          new TextRun({ text: '[HOD NAME]\nProfessor & Head\nDepartment of Computer Science & Engineering\n[INSTITUTION NAME]' })
                        ]
                      })
                    ]
                  })
                ]
              })
            ]
          }),
          new Paragraph({ spacing: { before: 400 } }),
          createBodyParagraph('Date: [DATE]                           Place: [PLACE]'),
          new Paragraph({ children: [new PageBreak()] }),

          // DECLARATION
          createHeading1('DECLARATION'),
          createBodyParagraph(
            'I, [STUDENT NAME], hereby declare that the project entitled "RESUMECHECK – RESUME KEYWORD ANALYZER" submitted to [INSTITUTION NAME], in partial fulfillment of the requirements for the award of the Degree of Bachelor of Technology in Computer Science and Engineering, is a record of original work done by me under the supervision and guidance of [GUIDE NAME], Department of Computer Science and Engineering.'
          ),
          createBodyParagraph(
            'I further declare that this project work has not formed the basis for the award of any other Degree, Diploma, Fellowship, or other similar titles in this or any other University or Institution.'
          ),
          new Paragraph({ spacing: { before: 800 } }),
          createBodyParagraph('Date: [DATE]                                                       [SIGNATURE OF THE CANDIDATE]'),
          createBodyParagraph('Place: [PLACE]                                                     [STUDENT NAME] (Reg: [REGISTER NUMBER])'),
          new Paragraph({ children: [new PageBreak()] }),

          // ACKNOWLEDGEMENT
          createHeading1('ACKNOWLEDGEMENT'),
          createBodyParagraph(
            'I express my deep gratitude to the Almighty for granting me the wisdom and strength to complete this project successfully.'
          ),
          createBodyParagraph(
            'I wish to express my profound sense of gratitude to our respected Principal / Director of [INSTITUTION NAME], for providing all necessary academic infrastructure and facilities.'
          ),
          createBodyParagraph(
            'I would like to convey my heartfelt thanks to [HOD NAME], Head of the Department of Computer Science and Engineering, for their continuous motivation and encouragement.'
          ),
          createBodyParagraph(
            'I am immensely indebted to my project supervisor, [GUIDE NAME], for their invaluable guidance, constructive critique, and patient supervision throughout the conceptualization and development of the ResumeCheck web application.'
          ),
          createBodyParagraph(
            'Finally, I extend my heartfelt thanks to my parents, family members, and friends for their enduring patience and moral support.'
          ),
          new Paragraph({ children: [new PageBreak()] }),

          // ABSTRACT
          createHeading1('ABSTRACT'),
          createBodyParagraph(
            'In the modern recruitment ecosystem, recruiters and Applicant Tracking Systems (ATS) screen thousands of applications by assessing keyword alignment against target job specifications. Job applicants often struggle to understand why their applications fail to progress, as manual cross-referencing between resumes and lengthy job descriptions is tedious, error-prone, and ineffective. This project presents ResumeCheck, an enterprise-grade full-stack web application designed to automate resume keyword analysis, gap identification, and match scoring.'
          ),
          createBodyParagraph(
            'ResumeCheck is implemented using a decoupled client-server architecture. The frontend is built using React.js, Vite, and Tailwind CSS, augmented with Framer Motion for purposeful micro-interactions and Recharts for responsive analytics visualizations. The backend is powered by Node.js and Express.js, featuring an algorithmic text processing engine that performs case normalization, sentence-boundary punctuation handling, multi-word n-gram phrase extraction, and synonym mapping across twelve technical and professional skill domains. Furthermore, the application provides PDF resume upload capabilities via server-side text extraction.'
          ),
          createBodyParagraph(
            'All analysis records, keyword dictionary mappings, user accounts, and relational junction data are persistently managed using Microsoft SQL Server (MSSQL), protected via parameterized queries, bcrypt password hashing, and JWT authorization. The system produces transparent match percentage scores, categorized skill breakdown tables, and constructive recommendations. Experimental evaluation demonstrates accurate keyword extraction, robust multi-word phrase matching, and high performance across desktop and mobile devices.'
          ),
          new Paragraph({ children: [new PageBreak()] }),

          // ==========================================
          // LIST OF FIGURES & TABLES
          // ==========================================
          createHeading1('LIST OF FIGURES'),
          createBulletPoint('Figure 1: ResumeCheck Landing Page (Hero, Value Proposition, & Animated Simulator)', 'Fig. 1:'),
          createBulletPoint('Figure 2: User Registration Interface with Form Validation', 'Fig. 2:'),
          createBulletPoint('Figure 3: User Login & JWT Authentication Interface', 'Fig. 3:'),
          createBulletPoint('Figure 4: Resume Analysis Dashboard (KPI Metric Cards & Recharts Trends)', 'Fig. 4:'),
          createBulletPoint('Figure 5: Resume and Job Description Analysis Interface (with PDF Ingestion)', 'Fig. 5:'),
          createBulletPoint('Figure 6: Resume Analysis Processing State (Multi-stage Pipeline)', 'Fig. 6:'),
          createBulletPoint('Figure 7: Resume Keyword Analysis Result (Animated Circular Gauge & Metrics)', 'Fig. 7:'),
          createBulletPoint('Figure 8: Keyword Breakdown (Searchable, Filterable Status Table)', 'Fig. 8:'),
          createBulletPoint('Figure 9: Resume Improvement Recommendations (Context-Aware Advice)', 'Fig. 9:'),
          createBulletPoint('Figure 10: Analysis History (Search, Filter, Pagination, & Animated Modal)', 'Fig. 10:'),
          createBulletPoint('Figure 11: User Profile & Security Settings Interface', 'Fig. 11:'),
          createBulletPoint('Figure 12: ResumeCheck Dark Mode Interface (Persistent Theme Support)', 'Fig. 12:'),
          createBulletPoint('Figure 13: ResumeCheck Three-Tier System Architecture Diagram', 'Fig. 13:'),
          createBulletPoint('Figure 14: Use Case Diagram for User and System Interactions', 'Fig. 14:'),
          createBulletPoint('Figure 15: Data Flow Diagram – Level 0 (Context Level Diagram)', 'Fig. 15:'),
          createBulletPoint('Figure 16: Data Flow Diagram – Level 1 (Functional Decomposition)', 'Fig. 16:'),
          createBulletPoint('Figure 17: Entity-Relationship Diagram (ERD) with Table Cardinalities', 'Fig. 17:'),
          new Paragraph({ spacing: { before: 200 } }),

          createHeading1('LIST OF TABLES'),
          createBulletPoint('Table 1: Primary Technology Stack & Architectural Roles', 'Table 1:'),
          createBulletPoint('Table 2: Functional Requirements Specification', 'Table 2:'),
          createBulletPoint('Table 3: Hardware and Software Environment Requirements', 'Table 3:'),
          createBulletPoint('Table 4: Microsoft SQL Server Database Schema Specifications', 'Table 4:'),
          createBulletPoint('Table 5: RESTful API Endpoint Specifications', 'Table 5:'),
          createBulletPoint('Table 6: Comprehensive Test Cases and Experimental Validation Results', 'Table 6:'),
          new Paragraph({ children: [new PageBreak()] }),

          // ==========================================
          // CHAPTER 1: INTRODUCTION
          // ==========================================
          createHeading1('CHAPTER 1 – INTRODUCTION'),
          createHeading2('1.1 Introduction'),
          createBodyParagraph(
            'In contemporary hiring workflows, corporate organizations and talent acquisition departments receive hundreds to thousands of candidate profiles for every advertised vacancy. To cope with this immense volume, automated Applicant Tracking Systems (ATS) and talent screening filters are universally deployed. These screening tools scan resumes looking for required competencies, technologies, certifications, and domain keywords specified by the hiring manager.'
          ),
          createBodyParagraph(
            'Consequently, qualified candidates who possess genuine technical competence frequently face rejection merely because their resumes lack the specific vocabulary or phrasing expected by the job posting. ResumeCheck is developed to bridge this gap, providing candidates with a transparent, private, and automated platform to evaluate resume alignment against job descriptions prior to submission.'
          ),

          createHeading2('1.2 Background'),
          createBodyParagraph(
            'Traditional resume evaluation requires job seekers to manually compare their document against lengthy bullet points of job requirements. This manual comparison is time-consuming, prone to human oversight, and lacks objective scoring criteria. Moreover, candidates often fail to recognize multi-word technical concepts (e.g., "Machine Learning", "Cloud Computing", "REST API") or normalize tool variations (e.g., "Node.js" versus "NodeJS"). An automated system that reliably tokenizes, normalizes, compares, and categorizes competencies provides immense utility.'
          ),

          createHeading2('1.3 Problem Statement'),
          createBodyParagraph(
            'Job applicants lack accessible, objective, and privacy-preserving tools to verify whether their resumes reflect the required technical competencies of target job roles. Furthermore, commercial tools often operate as opaque "black boxes" that produce questionable scores without explaining the exact matched or missing criteria. There is a distinct need for a full-stack, transparent web application that extracts keywords, identifies missing skills, computes an objective match percentage, and preserves evaluation history within a secure relational database.'
          ),

          createHeading2('1.4 Motivation'),
          createBodyParagraph(
            'The primary motivation behind ResumeCheck is to empower students, recent graduates, and software professionals to present their authentic qualifications effectively. By highlighting specific vocabulary gaps (e.g., recognizing that a job mandates "Docker" and "Kubernetes" which were omitted from the resume), candidates can strategically emphasize relevant projects and coursework without fabricating credentials.'
          ),

          createHeading2('1.5 Objectives'),
          createBulletPoint('To design and implement a responsive single-page web application using React.js, Tailwind CSS, and Framer Motion.'),
          createBulletPoint('To build an algorithmic text processing engine that performs tokenization, stopword removal, multi-word n-gram extraction, and normalization.'),
          createBulletPoint('To calculate an objective keyword match percentage using the formula: (Matched Keywords / Total Job Keywords) * 100.'),
          createBulletPoint('To visually differentiate matched competencies from missing skills across distinct technical categories.'),
          createBulletPoint('To implement direct PDF resume upload and server-side text extraction capabilities.'),
          createBulletPoint('To architect a relational database schema in Microsoft SQL Server for persistent user accounts, analysis histories, and skill taxonomies.'),
          createBulletPoint('To generate actionable, honest improvement recommendations and dynamic analytics charts using Recharts.'),

          createHeading2('1.6 Scope of the Project'),
          createBodyParagraph(
            'The scope encompasses user registration and JWT authentication, direct resume text pasting and PDF resume uploading, job description input, algorithmic keyword extraction across twelve domains, real-time match scoring, relational persistence in Microsoft SQL Server, interactive analytics dashboard, historical record filtering, user profile management, and light/dark theme adaptation.'
          ),

          createHeading2('1.7 Significance of the Project'),
          createBodyParagraph(
            'ResumeCheck establishes an open, reproducible, and mathematically rigorous standard for resume screening. Unlike heuristic or commercial black-box evaluators, ResumeCheck provides exact transparency into which words matched and which requirements were missed, providing actionable value for academic evaluation and real-world employment preparation.'
          ),
          new Paragraph({ children: [new PageBreak()] }),

          // ==========================================
          // CHAPTER 2 & 3: EXISTING & PROPOSED SYSTEM
          // ==========================================
          createHeading1('CHAPTER 2 – EXISTING SYSTEM'),
          createHeading2('2.1 Current Approaches & Practices'),
          createBodyParagraph(
            'In conventional job application preparation, candidates rely almost exclusively on manual reading and subjective self-assessment. A candidate prints or opens the job description in one window, skims through the qualifications, and attempts to mentally recall whether each requirement is listed in their CV.'
          ),

          createHeading2('2.2 Disadvantages of the Existing System'),
          createBulletPoint('High Cognitive Load & Time Consumption: Skimming 50-line job descriptions against a multi-page resume takes extensive time for every job application.'),
          createBulletPoint('Cognitive Blind Spots: Applicants overlook important secondary requirements such as CI/CD, Git, or unit testing while focusing solely on core programming languages.'),
          createBulletPoint('Inability to Handle Variations: Manual reviewers frequently fail to recognize that synonyms or acronyms (e.g., AWS vs Amazon Web Services) need consistent alignment for automated ATS screening.'),
          createBulletPoint('Lack of Quantitative Tracking: Job seekers have no quantitative mechanism to measure resume optimization progress across revisions.'),
          createBulletPoint('No Centralized Analytics: Historical submissions are scattered across disparate documents without aggregated analytics on recurring skill gaps.'),
          new Paragraph({ spacing: { before: 200 } }),

          createHeading1('CHAPTER 3 – PROPOSED SYSTEM'),
          createHeading2('3.1 Overview of ResumeCheck'),
          createBodyParagraph(
            'ResumeCheck resolves the shortcomings of manual evaluation by introducing an automated, deterministic keyword analysis web platform. By pairing client-side reactive components with a Node.js text processing pipeline and Microsoft SQL Server, ResumeCheck provides instantaneous, quantitative evaluation.'
          ),

          createHeading2('3.2 Key Features of the Proposed System'),
          createBulletPoint('Dual Input Mechanism: Supports direct text pasting and single-click drag-and-drop PDF resume uploading with automated text extraction.'),
          createBulletPoint('Algorithmic Extraction: Analyzes text using boundary-safe regex pattern matching and multi-word phrase detection across 12 skill categories.'),
          createBulletPoint('Deterministic Scoring: Employs a mathematically rigorous match percentage formula that rewards exact requirement coverage.'),
          createBulletPoint('Categorized Badges & Visual Status: Color-coded green (matched) and amber (missing) badges tagged by category and importance level.'),
          createBulletPoint('Interactive Visualizations: Animated circular SVG match score indicator and Recharts analytics depicting score trends and category distributions.'),
          createBulletPoint('Enterprise Data Security: SQL Server relational storage, bcrypt password hashing, and user-isolated authorization.'),
          new Paragraph({ children: [new PageBreak()] }),

          // ==========================================
          // CHAPTER 4: REQUIREMENT ANALYSIS
          // ==========================================
          createHeading1('CHAPTER 4 – REQUIREMENT ANALYSIS'),
          createHeading2('4.1 Functional Requirements'),
          createBodyParagraph(
            'The functional requirements define the specific actions, behaviors, and services that ResumeCheck must provide to users.'
          ),
          createSimpleTable(
            ['Req ID', 'Requirement Description', 'Module', 'Validation Rule'],
            [
              ['FR-01', 'User Registration with Name, Email, & Password', 'Auth', 'Email uniqueness, password >= 6 chars'],
              ['FR-02', 'User Login with JWT Token Issuance', 'Auth', 'bcrypt hash comparison, 7-day token'],
              ['FR-03', 'Resume Text Ingestion (Manual)', 'Analysis', 'Min 50 chars, Max 100,000 chars'],
              ['FR-04', 'Resume PDF Upload & Extraction', 'Analysis', 'Max 10MB, PDF format verification'],
              ['FR-05', 'Job Description Text Ingestion', 'Analysis', 'Min 50 chars, Max 100,000 chars'],
              ['FR-06', 'Automated Keyword & Multi-word Extraction', 'Engine', 'Dictionary boundary matching'],
              ['FR-07', 'Match Percentage & Classification Calculation', 'Engine', 'Mathematical ratio, 4 match tiers'],
              ['FR-08', 'Interactive Result Breakdown & Filtering', 'Results', 'Searchable table by status/category'],
              ['FR-09', 'Contextual Recommendation Generation', 'Results', 'Dynamic tips on high-priority gaps'],
              ['FR-10', 'Historical Evaluation Persistence & Deletion', 'History', 'User-isolated relational records'],
              ['FR-11', 'Aggregated Analytics Dashboard Feeds', 'Dashboard', 'Line, Bar, and Donut charts'],
              ['FR-12', 'Profile Display & Password Modification', 'User', 'Current password verification']
            ],
            [1200, 3800, 1500, 2500]
          ),
          new Paragraph({ spacing: { before: 200 } }),

          createHeading2('4.2 Non-Functional Requirements'),
          createBulletPoint('Performance: Text analysis and keyword matching complete in under 500 milliseconds for standard resumes.'),
          createBulletPoint('Security: All API endpoints carrying candidate data require valid Bearer JWT tokens. Passwords stored via salted bcrypt hashes.'),
          createBulletPoint('Reliability: Relational transactions in SQL Server ensure atomicity when writing analyses and junction records.'),
          createBulletPoint('Usability: Fully responsive layout supporting viewports from 320px mobile screens to 4K displays with accessible contrast.'),
          createBulletPoint('Accessibility: Full dark mode support and respect for OS reduced-motion preferences.'),

          createHeading2('4.3 Hardware & Software Requirements'),
          createSimpleTable(
            ['Category', 'Development Environment', 'Minimum Deployment Specification'],
            [
              ['Processor', 'Intel Core i5 / AMD Ryzen 5 or higher', 'Dual-core 2.0 GHz virtual CPU'],
              ['Memory', '8 GB RAM minimum (16 GB recommended)', '2 GB RAM minimum'],
              ['Storage', '512 GB SSD (At least 1 GB free space)', '20 GB free disk space'],
              ['Operating System', 'Windows 10 / 11 / Linux / macOS', 'Windows Server / Ubuntu Linux 22.04 LTS'],
              ['Runtime Platform', 'Node.js v18+ (tested on v24.19)', 'Node.js LTS (v18.x or v20.x)'],
              ['Database Server', 'Microsoft SQL Server 2019 / 2022 / Express', 'Microsoft SQL Server / Azure SQL DB'],
              ['Web Browser', 'Google Chrome 110+, Microsoft Edge, Firefox', 'Any modern evergreen HTML5 browser']
            ],
            [2200, 3800, 3000]
          ),
          new Paragraph({ children: [new PageBreak()] }),

          // ==========================================
          // CHAPTER 5: TECHNOLOGY STACK
          // ==========================================
          createHeading1('CHAPTER 5 – TECHNOLOGY STACK'),
          createBodyParagraph(
            'The ResumeCheck system utilizes an industry-standard technology stack selected for high performance, developer productivity, and robust relational integrity.'
          ),
          createSimpleTable(
            ['Technology', 'Category', 'Role in ResumeCheck', 'Justification'],
            [
              ['React.js (v18)', 'Frontend Framework', 'Component-based Single Page App (SPA)', 'Declarative state management & virtual DOM performance'],
              ['Vite (v5)', 'Frontend Build Tool', 'Bundler & Fast HMR Dev Server', 'Sub-second compilation and optimized tree-shaken builds'],
              ['Tailwind CSS', 'Styling Engine', 'Utility-first CSS & Glassmorphism design', 'Atomic styling, zero runtime overhead, built-in dark mode'],
              ['Framer Motion', 'Animation Library', 'Micro-interactions & page transitions', 'Hardware-accelerated physics-based transitions'],
              ['Recharts', 'Data Visualization', 'Dashboard trends, bar charts, donut charts', 'Declarative SVG charting responsive to viewport resizes'],
              ['Axios', 'HTTP Client', 'Asynchronous REST communication', 'Automatic JWT injection via interceptors & timeout control'],
              ['Node.js', 'Server Runtime', 'Asynchronous non-blocking runtime', 'Event-driven I/O ideal for concurrent web requests'],
              ['Express.js', 'Backend Framework', 'REST API server and routing engine', 'Minimalist, robust middleware ecosystem and JSON handling'],
              ['JWT & bcryptjs', 'Security & Cryptography', 'Token-based auth & salted password hashing', 'Stateless scalable authentication without session stores'],
              ['multer & pdf-parse', 'Document Ingestion', 'Memory file upload & PDF text extraction', 'Fast binary parsing without saving sensitive files to disk'],
              ['mssql', 'Database Driver', 'SQL Server connection pooling & queries', 'Official Tedious-based driver supporting parameterized T-SQL'],
              ['Microsoft SQL Server', 'Relational Database', 'ACID-compliant primary database', 'Enterprise reliability, indexing, foreign keys, identity specs']
            ],
            [1800, 1800, 2700, 2700]
          ),
          new Paragraph({ children: [new PageBreak()] }),

          // ==========================================
          // CHAPTER 6 & 7: ARCHITECTURE & MODULES
          // ==========================================
          createHeading1('CHAPTER 6 – SYSTEM ARCHITECTURE'),
          createBodyParagraph(
            'ResumeCheck follows a decoupled three-tier architectural pattern consisting of the Presentation Layer, the Application / Business Logic Layer, and the Data Persistence Layer.'
          ),
          ...createFigure(
            getImageBuffer(DIAGRAMS_DIR, 'system_architecture.png'),
            'Figure 13: ResumeCheck Three-Tier System Architecture Diagram',
            540,
            330
          ),
          createBodyParagraph(
            '1. Presentation Layer: Implemented in React.js and Vite. It contains interactive UI pages, forms, and SVG visualizations. HTTP requests are dispatched through Axios.'
          ),
          createBodyParagraph(
            '2. Application Layer: Built on Node.js and Express.js. It authenticates requests via JWT middleware, processes text strings, performs regex-based keyword extraction, executes the scoring formula, and coordinates database operations.'
          ),
          createBodyParagraph(
            '3. Data Layer: Microsoft SQL Server (ResumeKeywordCheckerDB). It maintains user identities, analysis records, standard keyword dictionaries, and junction mappings.'
          ),
          new Paragraph({ spacing: { before: 200 } }),

          createHeading1('CHAPTER 7 – MODULE DESCRIPTION'),
          createHeading2('7.1 Authentication Module'),
          createBodyParagraph(
            'Manages candidate identity. Upon registration, passwords are encrypted using bcrypt with 10 salt rounds. Login issues a signed JSON Web Token (JWT) containing the UserId payload with a 7-day expiration.'
          ),

          createHeading2('7.2 Resume Ingestion & PDF Parsing Module'),
          createBodyParagraph(
            'Accepts raw text or binary PDF uploads. Utilizes multer with memory storage and pdf-parse to extract clean selectable text while stripping pagination artifacts.'
          ),

          createHeading2('7.3 Keyword Extraction & Matching Module'),
          createBodyParagraph(
            'The core business engine. Normalizes strings, handles sentence boundaries, and tests candidates against single and multi-word dictionary patterns across 12 tech domains.'
          ),

          createHeading2('7.4 Scoring and Recommendation Module'),
          createBodyParagraph(
            'Applies the formula: Match % = (Matched Job Keywords / Total Job Keywords) * 100. Categorizes results into four descriptive tiers (Excellent, Good, Moderate, Low) and generates advice.'
          ),

          createHeading2('7.5 Dashboard and Analytics Module'),
          createBodyParagraph(
            'Aggregates user metrics to calculate average, peak, and baseline scores. Formats time-series arrays and category counts for rendering in Recharts components.'
          ),
          new Paragraph({ children: [new PageBreak()] }),

          // ==========================================
          // CHAPTER 8: SYSTEM DESIGN (UML & DFDs)
          // ==========================================
          createHeading1('CHAPTER 8 – SYSTEM DESIGN'),
          createHeading2('8.1 Use Case Diagram'),
          createBodyParagraph(
            'The Use Case Diagram models the functional interactions between the candidate and the ResumeCheck system boundary.'
          ),
          ...createFigure(
            getImageBuffer(DIAGRAMS_DIR, 'use_case_diagram.png'),
            'Figure 14: Use Case Diagram for User and System Interactions',
            530,
            340
          ),

          createHeading2('8.2 Data Flow Diagrams (DFDs)'),
          createBodyParagraph(
            'Data Flow Diagrams depict how information traverses the system, from raw user input to processed database records.'
          ),
          ...createFigure(
            getImageBuffer(DIAGRAMS_DIR, 'dfd_level0.png'),
            'Figure 15: Data Flow Diagram – Level 0 (Context Level Diagram)',
            530,
            240
          ),
          new Paragraph({ spacing: { before: 150 } }),
          ...createFigure(
            getImageBuffer(DIAGRAMS_DIR, 'dfd_level1.png'),
            'Figure 16: Data Flow Diagram – Level 1 (Functional Decomposition)',
            540,
            310
          ),

          createHeading2('8.3 Entity Relationship Diagram (ERD)'),
          createBodyParagraph(
            'The ERD models the entities, attributes, primary keys, and foreign key relationships in the database.'
          ),
          ...createFigure(
            getImageBuffer(DIAGRAMS_DIR, 'erd_diagram.png'),
            'Figure 17: Entity-Relationship Diagram (ERD) with Table Cardinalities',
            540,
            290
          ),
          new Paragraph({ children: [new PageBreak()] }),

          // ==========================================
          // CHAPTER 9: DATABASE DESIGN
          // ==========================================
          createHeading1('CHAPTER 9 – DATABASE DESIGN'),
          createBodyParagraph(
            'The Microsoft SQL Server database "ResumeKeywordCheckerDB" consists of four relational tables optimized for relational integrity and high-speed query indexing.'
          ),
          createHeading2('9.1 Table Specifications'),
          createSimpleTable(
            ['Table Name', 'Primary Key', 'Foreign Key(s)', 'Purpose & Relationships'],
            [
              ['USERS', 'UserId (INT IDENTITY)', 'None', 'Stores registered candidate credentials, names, and creation timestamps.'],
              ['KEYWORDS', 'KeywordId (INT IDENTITY)', 'None', 'Maintains normalized skill names, categories, and importance ratings.'],
              ['ANALYSES', 'AnalysisId (INT IDENTITY)', 'UserId -> USERS(UserId) ON DELETE CASCADE', 'Stores evaluation instances, input texts, match counts, and percentages.'],
              ['ANALYSIS_KEYWORDS', 'AnalysisKeywordId (INT IDENTITY)', 'AnalysisId -> ANALYSES, KeywordId -> KEYWORDS', 'Junction table recording whether a keyword was in resume, job spec, or both.']
            ],
            [2200, 2200, 2400, 2200]
          ),
          new Paragraph({ spacing: { before: 200 } }),
          createHeading2('9.2 Performance Indexes'),
          createBulletPoint('IX_Users_Email on USERS(Email): Ensures instant login credential lookups (O(log n)).'),
          createBulletPoint('IX_Analyses_UserId on ANALYSES(UserId): Optimizes dashboard queries scoped to the authenticated user.'),
          createBulletPoint('IX_Analyses_CreatedAt on ANALYSES(CreatedAt DESC): Accelerates chronological sorting of historical reports.'),
          createBulletPoint('IX_Keywords_Keyword on KEYWORDS(Keyword): Enables high-speed dictionary lookups during keyword extraction.'),
          createBulletPoint('IX_AnalysisKeywords_AnalysisId on ANALYSIS_KEYWORDS(AnalysisId): Optimizes breakdown table queries.'),
          new Paragraph({ children: [new PageBreak()] }),

          // ==========================================
          // CHAPTER 10: ALGORITHM
          // ==========================================
          createHeading1('CHAPTER 10 – KEYWORD ANALYSIS ALGORITHM'),
          createHeading2('10.1 Processing Pipeline'),
          createBodyParagraph(
            'The ResumeCheck keyword extraction engine is deterministic, rule-based, and mathematically transparent. It operates through the following stages:'
          ),
          createBulletPoint('1. Text Sanitization: Normalizes line feeds, tabs, and carriage returns to single whitespace characters.'),
          createBulletPoint('2. Punctuation Filtering: Replaces punctuation (commas, semicolons, brackets, quotes) while strictly preserving technical characters (+, #, ., -).'),
          createBulletPoint('3. Sentence Boundary Handling: Strips trailing periods at sentence ends while protecting intra-word periods (Node.js, Vue.js, .NET).'),
          createBulletPoint('4. Dictionary Evaluation: Tests text against canonical keywords and predefined alias arrays using boundary-safe regex.'),
          createBulletPoint('5. Deduplication & Classification: Maps detected items into unique sets, categorizing them as Matched or Missing.'),
          createBulletPoint('6. Percentage Formula Execution: Computes the exact ratio of satisfied requirements.'),

          createHeading2('10.2 Mathematical Formula'),
          createBodyParagraph(
            'Match Percentage = (Matched Job Keywords / Total Job Keywords) * 100',
            { bold: true, color: '0284C7', size: 24 }
          ),
          createBodyParagraph(
            'Where:\n• Total Job Keywords = Count of unique dictionary keywords found in Job Description.\n• Matched Job Keywords = Count of unique keywords found in BOTH Job Description and Resume.\n• Missing Keywords = Total Job Keywords - Matched Job Keywords.'
          ),

          createHeading2('10.3 Numerical Walkthrough Example'),
          createBodyParagraph(
            'Consider the following sample input evaluated by the system:\n• Job Description mentions: Python, React, Node.js, SQL, AWS, Docker, Git, REST API, Kubernetes (Total Job Keywords = 9).\n• Candidate Resume contains: Python, React, Node.js, SQL, Git, Machine Learning (Total Resume Keywords = 6).\n• Intersection (Matched): Python, React, Node.js, SQL, Git (Matched Keywords = 5).\n• Missing from Resume: AWS, Docker, REST API, Kubernetes (Missing Keywords = 4).\n\nCalculation:\nMatch Percentage = (5 / 9) * 100 = 55.56%\nTier: Moderate Keyword Match (40% - 59%)'
          ),
          new Paragraph({ children: [new PageBreak()] }),

          // ==========================================
          // CHAPTER 11 & 14 & 15: RESULTS & SCREENSHOTS
          // ==========================================
          createHeading1('CHAPTER 11 & 15 – IMPLEMENTATION RESULTS & USER INTERFACE'),
          createBodyParagraph(
            'This chapter documents the visual and functional implementation of the ResumeCheck web application through actual captured screenshots of the running system.'
          ),

          // Screenshot 1: Landing Page
          createHeading2('11.1 Landing / Home Page'),
          createBodyParagraph(
            'The landing page features a modern SaaS layout with an animated gradient hero section, real-time match simulator mockup, floating keyword tags, comprehensive feature cards, and a four-step responsive process timeline.'
          ),
          ...createFigure(
            getImageBuffer(SCREENSHOTS_DIR, 'fig1_landing_page.png'),
            'Figure 1: ResumeCheck Landing Page (Hero, Value Proposition, & Animated Simulator)',
            540,
            335
          ),

          // Screenshot 2: Registration Page
          createHeading2('11.2 User Registration Interface'),
          createBodyParagraph(
            'The registration view features a centered glassmorphism card, inputs for Full Name, Email, and Password, real-time validation error messaging, and automated redirect to the dashboard upon successful account creation.'
          ),
          ...createFigure(
            getImageBuffer(SCREENSHOTS_DIR, 'fig2_register_page.png'),
            'Figure 2: User Registration Interface with Form Validation',
            540,
            335
          ),
          new Paragraph({ children: [new PageBreak()] }),

          // Screenshot 3: Login Page
          createHeading2('11.3 User Login Interface'),
          createBodyParagraph(
            'The authentication view verifies candidate credentials against Microsoft SQL Server, hashes the input password with bcrypt, and stores the issued JWT token securely in client storage.'
          ),
          ...createFigure(
            getImageBuffer(SCREENSHOTS_DIR, 'fig3_login_page.png'),
            'Figure 3: User Login & JWT Authentication Interface',
            540,
            335
          ),

          // Screenshot 4: Dashboard Page
          createHeading2('11.4 Analytics Dashboard'),
          createBodyParagraph(
            'The dashboard displays four animated count-up statistic cards (Total Analyses, Average Score, Highest Score, Lowest Score) alongside Recharts data visualizations showing score evolution over time, matched versus missing counts, and category distributions.'
          ),
          ...createFigure(
            getImageBuffer(SCREENSHOTS_DIR, 'fig4_dashboard.png'),
            'Figure 4: Resume Analysis Dashboard (KPI Metric Cards & Recharts Trends)',
            540,
            335
          ),
          new Paragraph({ children: [new PageBreak()] }),

          // Screenshot 5: Analyze Page
          createHeading2('11.5 Resume and Job Analysis Canvas'),
          createBodyParagraph(
            'The analysis view provides a split workspace with large textareas, real-time character counters (minimum 50, maximum 100,000 characters), a one-click sample loader, and a drag-and-drop PDF resume upload zone.'
          ),
          ...createFigure(
            getImageBuffer(SCREENSHOTS_DIR, 'fig5_analyze_page.png'),
            'Figure 5: Resume and Job Description Analysis Interface (with PDF Ingestion)',
            540,
            335
          ),

          // Screenshot 6: Processing State
          createHeading2('11.6 Multi-Stage Processing Animation'),
          createBodyParagraph(
            'During analysis execution, the UI displays a multi-stage logical progress animator indicating tokenization, dictionary extraction, n-gram matching, score calculation, and database persistence.'
          ),
          ...createFigure(
            getImageBuffer(SCREENSHOTS_DIR, 'fig6_processing_state.png'),
            'Figure 6: Resume Analysis Processing State (Multi-stage Pipeline)',
            540,
            335
          ),
          new Paragraph({ children: [new PageBreak()] }),

          // Screenshot 7: Results Page
          createHeading2('11.7 Keyword Analysis Results View'),
          createBodyParagraph(
            'The results page presents the match score via an animated circular SVG gauge color-coded by tier (green for excellent/good, amber for moderate, rose for low), matched badges, and missing skill warnings.'
          ),
          ...createFigure(
            getImageBuffer(SCREENSHOTS_DIR, 'fig7_analysis_result.png'),
            'Figure 7: Resume Keyword Analysis Result (Animated Circular Gauge & Metrics)',
            540,
            335
          ),

          // Screenshot 8: Keyword Breakdown
          createHeading2('11.8 Detailed Keyword Breakdown Table'),
          createBodyParagraph(
            'An interactive breakdown table categorizes every detected keyword, displaying its domain category, importance rating (High, Medium, Core), and matched/missing status, with instant search and filter controls.'
          ),
          ...createFigure(
            getImageBuffer(SCREENSHOTS_DIR, 'fig8_keyword_breakdown.png'),
            'Figure 8: Keyword Breakdown (Searchable, Filterable Status Table)',
            540,
            335
          ),
          new Paragraph({ children: [new PageBreak()] }),

          // Screenshot 9: Recommendations
          createHeading2('11.9 Context-Aware Improvement Recommendations'),
          createBodyParagraph(
            'A strategic recommendations panel provides constructive advice on high-priority missing skills without encouraging false claims or skill fabrication.'
          ),
          ...createFigure(
            getImageBuffer(SCREENSHOTS_DIR, 'fig9_recommendations.png'),
            'Figure 9: Resume Improvement Recommendations (Context-Aware Advice)',
            540,
            335
          ),

          // Screenshot 10: History Page
          createHeading2('11.10 Analysis History Management'),
          createBodyParagraph(
            'The history view lists past evaluations with sorting, score filtering, job title search, pagination, and an animated confirmation modal for deleting unwanted reports.'
          ),
          ...createFigure(
            getImageBuffer(SCREENSHOTS_DIR, 'fig10_analysis_history.png'),
            'Figure 10: Analysis History (Search, Filter, Pagination, & Animated Modal)',
            540,
            335
          ),
          new Paragraph({ children: [new PageBreak()] }),

          // Screenshot 11: Profile Page
          createHeading2('11.11 User Profile and Password Settings'),
          createBodyParagraph(
            'The profile interface enables candidates to view account metadata, update their full display name, and securely modify their password via salted bcrypt hashing.'
          ),
          ...createFigure(
            getImageBuffer(SCREENSHOTS_DIR, 'fig11_user_profile.png'),
            'Figure 11: User Profile & Security Settings Interface',
            540,
            335
          ),

          // Screenshot 12: Dark Mode
          createHeading2('11.12 Persistent Dark Theme Interface'),
          createBodyParagraph(
            'ResumeCheck features full dark mode support using Tailwind CSS design tokens, offering high contrast and reduced eye strain during extended work sessions.'
          ),
          ...createFigure(
            getImageBuffer(SCREENSHOTS_DIR, 'fig12_dark_mode.png'),
            'Figure 12: ResumeCheck Dark Mode Interface (Persistent Theme Support)',
            540,
            335
          ),
          new Paragraph({ children: [new PageBreak()] }),

          // ==========================================
          // CHAPTER 13: API SPECIFICATION
          // ==========================================
          createHeading1('CHAPTER 13 – RESTFUL API DESIGN'),
          createBodyParagraph(
            'The backend exposes modular RESTful endpoints adhering to standard HTTP status codes and JSON response schemas.'
          ),
          createSimpleTable(
            ['Method', 'Endpoint', 'Purpose', 'Auth Required', 'Response Code'],
            [
              ['POST', '/api/auth/register', 'Register new user account', 'No', '201 Created'],
              ['POST', '/api/auth/login', 'Authenticate user and issue JWT', 'No', '200 OK'],
              ['GET', '/api/auth/me', 'Retrieve current authenticated profile', 'Yes (Bearer)', '200 OK'],
              ['POST', '/api/analysis', 'Perform keyword analysis & save', 'Yes (Bearer)', '201 Created'],
              ['POST', '/api/analysis/upload-pdf', 'Extract text from uploaded PDF', 'Yes (Bearer)', '200 OK'],
              ['GET', '/api/analysis', 'Retrieve list of user analyses', 'Yes (Bearer)', '200 OK'],
              ['GET', '/api/analysis/:id', 'Retrieve single analysis details', 'Yes (Bearer)', '200 OK'],
              ['DELETE', '/api/analysis/:id', 'Delete specific analysis record', 'Yes (Bearer)', '200 OK'],
              ['GET', '/api/dashboard/stats', 'Fetch KPI metrics & chart data', 'Yes (Bearer)', '200 OK'],
              ['GET', '/api/dashboard/recent', 'Fetch 5 most recent records', 'Yes (Bearer)', '200 OK'],
              ['GET', '/api/user/profile', 'Get candidate profile details', 'Yes (Bearer)', '200 OK'],
              ['PUT', '/api/user/profile', 'Update candidate display name', 'Yes (Bearer)', '200 OK'],
              ['PUT', '/api/user/change-password', 'Change account password', 'Yes (Bearer)', '200 OK']
            ],
            [1200, 3200, 2400, 1600, 1600]
          ),
          new Paragraph({ children: [new PageBreak()] }),

          // ==========================================
          // CHAPTER 16: TESTING
          // ==========================================
          createHeading1('CHAPTER 16 – SYSTEM TESTING & TEST CASES'),
          createBodyParagraph(
            'System validation was conducted across all modules, including unit testing of the text processor, integration testing of the REST API, and end-to-end browser testing.'
          ),
          createSimpleTable(
            ['TC ID', 'Test Scenario', 'Input Condition', 'Expected Outcome', 'Status'],
            [
              ['TC01', 'User Registration (Valid)', 'Unique email, name, valid pass', 'Account created, JWT issued', 'PASS'],
              ['TC02', 'User Registration (Duplicate Email)', 'Existing registered email', 'HTTP 409 Conflict error returned', 'PASS'],
              ['TC03', 'User Login (Valid)', 'Correct email & password', 'HTTP 200 OK, JWT token issued', 'PASS'],
              ['TC04', 'User Login (Invalid Password)', 'Valid email, wrong password', 'HTTP 401 Unauthorized returned', 'PASS'],
              ['TC05', 'Resume Text Minimum Length', 'Resume text < 50 characters', 'Validation error rejected by API', 'PASS'],
              ['TC06', 'Job Spec Minimum Length', 'Job spec < 50 characters', 'Validation error rejected by API', 'PASS'],
              ['TC07', 'PDF Resume File Upload', 'Standard 1-page PDF file', 'Text parsed & extracted cleanly', 'PASS'],
              ['TC08', 'PDF File Size Limit', 'File exceeding 10MB', 'HTTP 400 error rejected by multer', 'PASS'],
              ['TC09', 'Keyword Extraction (Single-word)', 'Text containing Python, SQL, Git', 'All 3 single-word skills found', 'PASS'],
              ['TC10', 'Keyword Extraction (Multi-word)', 'Text: Machine Learning, REST API', 'Multi-word phrases detected', 'PASS'],
              ['TC11', 'Synonym Normalization', 'Input: Node.js, AWS, Power BI', 'Normalized to canonical names', 'PASS'],
              ['TC12', 'Punctuation Isolation', 'Input: .NET, C++, C#, Node.js.', 'Tech symbols kept, dot trimmed', 'PASS'],
              ['TC13', 'Score Calculation Formula', '5 matched out of 9 job skills', 'Score computed exactly as 55.56%', 'PASS'],
              ['TC14', 'Relational Persistence', 'Complete analysis execution', 'Inserted into ANALYSES & junction', 'PASS'],
              ['TC15', 'History Isolation', 'User A queries /api/analysis', 'Only User A records returned', 'PASS'],
              ['TC16', 'Delete Analysis Record', 'User deletes own analysis ID', 'Record deleted, junction cleared', 'PASS'],
              ['TC17', 'Prevent Unauthorized Delete', 'User B deletes User A analysis', 'HTTP 404/403 access denied', 'PASS'],
              ['TC18', 'Dashboard Chart Feeds', 'User with 3 analyses', 'Time series & category feeds valid', 'PASS'],
              ['TC19', 'Profile Name Modification', 'Updated name string submitted', 'Name updated in database', 'PASS'],
              ['TC20', 'Password Change (Valid)', 'Correct current pass, valid new pass', 'Password hash updated in DB', 'PASS'],
              ['TC21', 'Theme Toggle Persistence', 'User switches to dark mode', 'Preference stored in localStorage', 'PASS'],
              ['TC22', 'Responsive Viewport Render', 'Viewport resized to 375px mobile', 'Sidebar collapses to drawer', 'PASS']
            ],
            [900, 2400, 2500, 2400, 800]
          ),
          new Paragraph({ children: [new PageBreak()] }),

          // ==========================================
          // CHAPTER 17 & 18 & 19: SECURITY, PERFORMANCE, LIMITATIONS
          // ==========================================
          createHeading1('CHAPTER 17 – SECURITY & DATA PRIVACY'),
          createBodyParagraph(
            'Security and candidate confidentiality are paramount in ResumeCheck. Implemented measures include:'
          ),
          createBulletPoint('Salted Hash Passwords: User passwords are encrypted with bcryptjs utilizing 10 salt rounds.'),
          createBulletPoint('Stateless JWT Verification: Protected routes enforce Bearer JWT token verification.'),
          createBulletPoint('SQL Injection Immunity: All queries to Microsoft SQL Server use parameterized inputs via mssql Request bindings.'),
          createBulletPoint('Input Sanitization: All request payloads are validated using express-validator before reaching business logic.'),
          createBulletPoint('Ephemeral PDF Ingestion: Uploaded resume PDFs are processed in volatile memory buffers without writing files to disk.'),

          createHeading1('CHAPTER 18 – PERFORMANCE & ACCESSIBILITY'),
          createBulletPoint('Hardware-Accelerated Styling: Tailwind CSS utility classes and Framer Motion CSS transforms utilize GPU acceleration.'),
          createBulletPoint('Relational Indexing: Clustered and nonclustered indexes in SQL Server ensure sub-10ms query execution.'),
          createBulletPoint('Reduced Motion Support: Respects OS prefers-reduced-motion media query settings to disable animations.'),
          createBulletPoint('Shimmer Skeleton Loading: Prevents layout shifts during network data retrieval.'),

          createHeading1('CHAPTER 19 – LIMITATIONS'),
          createBulletPoint('Keyword Heuristics: Keyword analysis measures vocabulary coverage but cannot evaluate deep narrative context.'),
          createBulletPoint('Dictionary Boundaries: Highly novel, proprietary, or misspelled technical terms may not be recognized.'),
          createBulletPoint('No Hiring Guarantee: Match percentage is an alignment indicator and cannot guarantee an employment interview.'),
          new Paragraph({ children: [new PageBreak()] }),

          // ==========================================
          // CHAPTER 20 & 21: FUTURE WORK & CONCLUSION
          // ==========================================
          createHeading1('CHAPTER 20 – FUTURE ENHANCEMENTS'),
          createBulletPoint('Semantic Vector Embeddings: Integrate dense vector representations to recognize semantic skill equivalents.'),
          createBulletPoint('DOCX and Rich Text Parsing: Extend file ingestion to Microsoft Word (.docx) documents.'),
          createBulletPoint('Sectional Resume Breakdown: Automatically parse Experience, Education, and Project sections individually.'),
          createBulletPoint('Downloadable PDF Reports: Enable candidates to export styled PDF analysis summary reports.'),
          createBulletPoint('Multi-Resume Comparison Matrix: Allow comparing multiple resumes against a single job specification.'),

          createHeading1('CHAPTER 21 – CONCLUSION'),
          createBodyParagraph(
            'The ResumeCheck project successfully demonstrates the design, engineering, and deployment of a full-stack resume keyword analysis web application. By combining React.js, Tailwind CSS, Framer Motion, Recharts, Node.js, Express.js, and Microsoft SQL Server, the application provides an objective, transparent, and aesthetically premium solution for job seekers.'
          ),
          createBodyParagraph(
            'Through rigorous testing across 22 test cases and real-world execution with PDF documents, ResumeCheck exhibits high accuracy in keyword matching, responsive performance, and secure data handling, fulfilling all project objectives.'
          ),
          new Paragraph({ spacing: { before: 200 } }),

          createHeading1('REFERENCES'),
          createBulletPoint('React.js Official Documentation. Meta Platforms Inc. https://react.dev/'),
          createBulletPoint('Vite Next Generation Frontend Tooling. Evan You et al. https://vitejs.dev/'),
          createBulletPoint('Tailwind CSS Documentation. Tailwind Labs Inc. https://tailwindcss.com/'),
          createBulletPoint('Node.js Technical Documentation. OpenJS Foundation. https://nodejs.org/'),
          createBulletPoint('Express.js Application Framework. OpenJS Foundation. https://expressjs.com/'),
          createBulletPoint('Microsoft SQL Server Documentation. Microsoft Corporation. https://learn.microsoft.com/sql/'),
          createBulletPoint('Framer Motion API Reference. Motion Software Ltd. https://www.framer.com/motion/'),
          createBulletPoint('Recharts Composable Charting Library. https://recharts.org/'),
          new Paragraph({ children: [new PageBreak()] }),

          // ==========================================
          // APPENDIX
          // ==========================================
          createHeading1('APPENDIX – IMPORTANT CODE SNIPPETS'),
          createHeading2('Appendix A – Mathematical Scoring Formula (analysisService.js)'),
          createBodyParagraph(
            '// Match calculation formula\nlet matchPercentage = 0;\nif (totalJobKeywords > 0) {\n  matchPercentage = parseFloat(((matchedKeywordsList.length / totalJobKeywords) * 100).toFixed(2));\n}\n\nfunction getMatchTier(percentage) {\n  if (percentage >= 80) return "Excellent Keyword Match";\n  if (percentage >= 60) return "Good Keyword Match";\n  if (percentage >= 40) return "Moderate Keyword Match";\n  return "Low Keyword Match";\n}',
            { font: 'Courier New', size: 18 }
          ),
          new Paragraph({ spacing: { before: 150 } }),

          createHeading2('Appendix B – Boundary-Safe Keyword Regex (textProcessor.js)'),
          createBodyParagraph(
            '// Safe boundary matching for technical phrases\nconst escaped = escapeRegExp(trimmedCandidate);\nconst pattern = new RegExp(`(^|[^a-zA-Z0-9_#\\\\+])${escaped}([^a-zA-Z0-9_#\\\\+]|$)`, "i");\nif (pattern.test(normalized)) {\n  matchedKeywordsMap.set(canonicalName, {\n    keyword: canonicalName,\n    category: item.category,\n    importance: item.importance\n  });\n}',
            { font: 'Courier New', size: 18 }
          ),
          new Paragraph({ spacing: { before: 150 } }),

          createHeading2('Appendix C – PDF Text Extraction (pdfExtractor.js)'),
          createBodyParagraph(
            '// PDF parsing supporting modern Uint8Array buffer interface\nconst uint8 = new Uint8Array(dataBuffer);\nconst parser = new pdfModule.PDFParse(uint8);\nconst result = await parser.getText();\nconst cleanText = result.text.replace(/-- \\\\d+ of \\\\d+ --/g, "").trim();',
            { font: 'Courier New', size: 18 }
          )
        ]
      }
    ]
  });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(OUTPUT_DOCX, buffer);
  console.log('ResumeCheck_Project_Report.docx generated successfully at:', OUTPUT_DOCX);
}

buildReport().catch(err => {
  console.error('Error building report:', err);
  process.exit(1);
});
