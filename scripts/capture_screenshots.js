const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME_PATH = fs.existsSync('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe')
  ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  : 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const BASE_URL = 'http://localhost:5173';
const OUTPUT_DIR = path.resolve(__dirname, '..', 'screenshots');

async function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function captureAll() {
  console.log(`Launching browser: ${CHROME_PATH}`);
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    defaultViewport: { width: 1280, height: 800, deviceScaleFactor: 1.5 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  try {
    // 1. Landing Page
    console.log('Capturing Figure 1: Landing Page...');
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0' });
    await wait(800);
    await page.screenshot({ path: path.join(OUTPUT_DIR, 'fig1_landing_page.png') });

    // 2. Register Page
    console.log('Capturing Figure 2: Register Page...');
    await page.goto(`${BASE_URL}/register`, { waitUntil: 'networkidle0' });
    await wait(400);
    await page.type('input[placeholder="Jane Doe"]', 'Jane Doe');
    await page.type('input[placeholder="developer@example.com"]', 'jane.doe@example.com');
    await page.type('input[placeholder="••••••••"]', 'SecurePass123!');
    await wait(300);
    await page.screenshot({ path: path.join(OUTPUT_DIR, 'fig2_register_page.png') });

    // Register active user
    const testEmail = `student_${Date.now()}@university.edu`;
    await page.evaluate(() => {
      document.querySelectorAll('input').forEach(i => i.value = '');
    });
    await page.type('input[placeholder="Jane Doe"]', 'Alex Candidate');
    await page.type('input[placeholder="developer@example.com"]', testEmail);
    await page.type('input[placeholder="••••••••"]', 'University2026!');
    await page.click('button[type="submit"]');
    await wait(1200);

    // 3. Login Page
    console.log('Capturing Figure 3: Login Page...');
    await page.evaluate(() => localStorage.clear());
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle0' });
    await wait(400);
    await page.type('input[placeholder="developer@example.com"]', testEmail);
    await page.type('input[placeholder="••••••••"]', 'University2026!');
    await wait(300);
    await page.screenshot({ path: path.join(OUTPUT_DIR, 'fig3_login_page.png') });

    // Submit login
    await page.click('button[type="submit"]');
    await wait(1200);

    // 4. Analyze Page
    console.log('Navigating to Analyze Page...');
    await page.goto(`${BASE_URL}/analyze`, { waitUntil: 'networkidle0' });
    await wait(600);

    // Populate using Example
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const exampleBtn = btns.find(b => b.textContent.includes('Use Example'));
      if (exampleBtn) exampleBtn.click();
    });
    await wait(500);

    console.log('Capturing Figure 5: Analyze Page...');
    await page.screenshot({ path: path.join(OUTPUT_DIR, 'fig5_analyze_page.png') });

    // 5. Submit Analysis & Capture Processing state
    console.log('Submitting analysis & capturing processing state...');
    await page.evaluate(() => {
      const sub = document.querySelector('button[type="submit"]');
      if (sub) sub.click();
    });
    await wait(220); // Capture progress spinner/steps animation
    await page.screenshot({ path: path.join(OUTPUT_DIR, 'fig6_processing_state.png') });

    // Wait for Results page
    await wait(2000);

    // 6. Figure 7: Analysis Result Page
    console.log('Capturing Figure 7: Analysis Result...');
    await page.screenshot({ path: path.join(OUTPUT_DIR, 'fig7_analysis_result.png') });

    // 7. Figure 8: Keyword Breakdown
    console.log('Capturing Figure 8: Keyword Breakdown...');
    await page.evaluate(() => {
      const tbl = document.querySelector('table');
      if (tbl) tbl.scrollIntoView({ behavior: 'instant', block: 'center' });
    });
    await wait(400);
    await page.screenshot({ path: path.join(OUTPUT_DIR, 'fig8_keyword_breakdown.png') });

    // 8. Figure 9: Recommendations
    console.log('Capturing Figure 9: Recommendations...');
    await page.evaluate(() => {
      const headings = Array.from(document.querySelectorAll('h3'));
      const rec = headings.find(h => h.textContent.includes('Recommendations'));
      if (rec) rec.scrollIntoView({ behavior: 'instant', block: 'center' });
    });
    await wait(400);
    await page.screenshot({ path: path.join(OUTPUT_DIR, 'fig9_recommendations.png') });

    // Second analysis for rich charts
    console.log('Adding second analysis for richer charts...');
    await page.goto(`${BASE_URL}/analyze`, { waitUntil: 'networkidle0' });
    await wait(500);
    await page.evaluate(() => {
      const inputs = document.querySelectorAll('input[type="text"]');
      if (inputs[0]) inputs[0].value = 'Senior Cloud Architect';
      const textareas = document.querySelectorAll('textarea');
      if (textareas[0]) textareas[0].value = 'Cloud architect with extensive AWS, Azure, Docker, Kubernetes, CI/CD, Terraform, Python, and Linux experience across production systems.';
      if (textareas[1]) textareas[1].value = 'Seeking Senior Cloud Architect with deep AWS, Azure, Docker, Kubernetes, Terraform, CI/CD, Go, and Microservices leadership.';
      textareas[0].dispatchEvent(new Event('input', { bubbles: true }));
      textareas[1].dispatchEvent(new Event('input', { bubbles: true }));
    });
    await wait(300);
    await page.evaluate(() => {
      const sub = document.querySelector('button[type="submit"]');
      if (sub) sub.click();
    });
    await wait(2500);

    // 9. Figure 4: Dashboard Page
    console.log('Capturing Figure 4: Dashboard Page...');
    await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle0' });
    await wait(1800);
    await page.screenshot({ path: path.join(OUTPUT_DIR, 'fig4_dashboard.png') });

    // 10. Figure 10: Analysis History
    console.log('Capturing Figure 10: Analysis History...');
    await page.goto(`${BASE_URL}/history`, { waitUntil: 'networkidle0' });
    await wait(1000);
    await page.screenshot({ path: path.join(OUTPUT_DIR, 'fig10_analysis_history.png') });

    // 11. Figure 11: Profile Page
    console.log('Capturing Figure 11: Profile Page...');
    await page.goto(`${BASE_URL}/profile`, { waitUntil: 'networkidle0' });
    await wait(1000);
    await page.screenshot({ path: path.join(OUTPUT_DIR, 'fig11_user_profile.png') });

    // 12. Figure 12: Dark Mode
    console.log('Capturing Figure 12: Dark Mode...');
    await page.click('button[aria-label="Toggle theme"]');
    await wait(400);
    await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle0' });
    await wait(1500);
    await page.screenshot({ path: path.join(OUTPUT_DIR, 'fig12_dark_mode.png') });

    console.log('ALL 12 REAL SCREENSHOTS CAPTURED SUCCESSFULLY!');
  } catch (err) {
    console.error('Error during capture:', err);
    throw err;
  } finally {
    await browser.close();
  }
}

captureAll().catch(e => {
  console.error('Failed:', e);
  process.exit(1);
});
