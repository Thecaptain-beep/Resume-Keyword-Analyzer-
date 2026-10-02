const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');
const http = require('http');

const CHROME_PATH = fs.existsSync('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe')
  ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  : 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const BASE_URL = 'http://localhost:5173';
const OUTPUT_DIR = path.resolve(__dirname, '..', 'screenshots');

async function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function apiRequest(method, pathUrl, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const postData = body ? JSON.stringify(body) : null;
    const req = http.request({
      hostname: 'localhost',
      port: 5000,
      path: pathUrl,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(postData ? { 'Content-Length': Buffer.byteLength(postData) } : {}),
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    });
    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

async function captureRemaining() {
  console.log('Seeding demo user and analyses via API for rich charts...');
  const testEmail = `student_${Date.now()}@university.edu`;
  const regRes = await apiRequest('POST', '/api/auth/register', {
    fullName: 'Alex Candidate',
    email: testEmail,
    password: 'University2026!'
  });
  const token = regRes.token;
  const userObj = regRes.user;

  // Add 3 sample analyses
  await apiRequest('POST', '/api/analysis', {
    jobTitle: 'Full Stack Engineer',
    resumeText: 'Experienced developer with Python, JavaScript, React, Node.js, SQL, Git, and Machine Learning. Built scalable web applications and data pipelines.',
    jobDescription: 'Seeking Full Stack Engineer with JavaScript, React, Node.js, SQL, AWS, Docker, Git, REST APIs, and Python experience.'
  }, token);

  await apiRequest('POST', '/api/analysis', {
    jobTitle: 'Cloud DevOps Specialist',
    resumeText: 'DevOps engineer experienced with Docker, Kubernetes, CI/CD, AWS, Linux, Terraform, GitHub Actions, and Python.',
    jobDescription: 'Seeking DevOps Specialist with Docker, Kubernetes, AWS, Terraform, CI/CD, and Linux automation skills.'
  }, token);

  await apiRequest('POST', '/api/analysis', {
    jobTitle: 'Data Analyst',
    resumeText: 'Data analyst skilled in Python, SQL, Excel, Power BI, and Tableau with strong communication and problem solving.',
    jobDescription: 'Seeking Data Analyst with SQL, Excel, Power BI, Tableau, and Data Analytics competencies.'
  }, token);

  console.log('Launching browser to capture remaining 4 screenshots...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    defaultViewport: { width: 1280, height: 800, deviceScaleFactor: 1.5 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  try {
    // Inject auth token directly into localStorage
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0' });
    await page.evaluate((t, u) => {
      localStorage.setItem('resumecheck_token', t);
      localStorage.setItem('resumecheck_user', JSON.stringify(u));
    }, token, userObj);

    // 1. Figure 4: Dashboard Page
    console.log('Capturing Figure 4: Dashboard Page...');
    await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle0' });
    await wait(1800); // Wait for count-up animations & recharts render
    await page.screenshot({ path: path.join(OUTPUT_DIR, 'fig4_dashboard.png') });

    // 2. Figure 10: History Page
    console.log('Capturing Figure 10: History Page...');
    await page.goto(`${BASE_URL}/history`, { waitUntil: 'networkidle0' });
    await wait(1000);
    await page.screenshot({ path: path.join(OUTPUT_DIR, 'fig10_analysis_history.png') });

    // 3. Figure 11: Profile Page
    console.log('Capturing Figure 11: Profile Page...');
    await page.goto(`${BASE_URL}/profile`, { waitUntil: 'networkidle0' });
    await wait(1000);
    await page.screenshot({ path: path.join(OUTPUT_DIR, 'fig11_user_profile.png') });

    // 4. Figure 12: Dark Mode
    console.log('Capturing Figure 12: Dark Mode Dashboard...');
    // Enable dark mode in localStorage
    await page.evaluate(() => {
      localStorage.setItem('resumecheck_theme', 'dark');
      document.documentElement.classList.add('dark');
    });
    await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle0' });
    await wait(1500);
    await page.screenshot({ path: path.join(OUTPUT_DIR, 'fig12_dark_mode.png') });

    console.log('SUCCESS! All 12 screenshots are present in /screenshots!');
  } finally {
    await browser.close();
  }
}

captureRemaining().catch(e => {
  console.error(e);
  process.exit(1);
});
