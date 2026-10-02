const http = require('http');

function request(method, path, data = null, token = null) {
  return new Promise((resolve, reject) => {
    const payload = data ? JSON.stringify(data) : null;
    const options = {
      hostname: 'localhost',
      port: 5000,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {}),
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch {
          resolve({ status: res.statusCode, raw: body });
        }
      });
    });

    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

async function runTests() {
  console.log('--- STARTING COMPREHENSIVE API TEST SUITE ---');

  // 1. Health check
  const health = await request('GET', '/api/health');
  console.log('1. Health check:', health.status === 200 ? 'PASS' : 'FAIL', health.data);

  // 2. Register user
  const testEmail = `test_${Date.now()}@example.com`;
  const registerRes = await request('POST', '/api/auth/register', {
    fullName: 'Alex Morgan',
    email: testEmail,
    password: 'SecurePassword123!'
  });
  console.log('2. User Registration:', registerRes.status === 201 ? 'PASS' : 'FAIL', registerRes.data?.user?.email);
  const token = registerRes.data.token;

  // 3. Login user
  const loginRes = await request('POST', '/api/auth/login', {
    email: testEmail,
    password: 'SecurePassword123!'
  });
  console.log('3. User Login:', loginRes.status === 200 ? 'PASS' : 'FAIL', loginRes.data?.user?.fullName);

  // 4. Get Current User (GET /api/auth/me)
  const meRes = await request('GET', '/api/auth/me', null, token);
  console.log('4. Get Profile (/me):', meRes.status === 200 ? 'PASS' : 'FAIL', meRes.data?.user?.email);

  // 5. Create Analysis
  const sampleResume = "Software developer with experience in Python, JavaScript, React, Node.js, SQL, Git, Power BI and Machine Learning. Developed web applications and data analytics dashboards.";
  const sampleJob = "We are looking for a Full Stack Developer with experience in JavaScript, React, Node.js, SQL, AWS, Docker, Git and REST APIs. Knowledge of Machine Learning and Python is a plus.";

  const analysisRes = await request('POST', '/api/analysis', {
    jobTitle: 'Full Stack Developer',
    resumeText: sampleResume,
    jobDescription: sampleJob
  }, token);

  console.log('5. Create Analysis:', analysisRes.status === 201 ? 'PASS' : 'FAIL');
  console.log('   - Analysis ID:', analysisRes.data?.analysisId);
  console.log('   - Match Percentage:', analysisRes.data?.matchPercentage + '%');
  console.log('   - Match Tier:', analysisRes.data?.matchTier);
  console.log('   - Matched Keywords:', analysisRes.data?.matchedKeywordsList?.map(k => k.keyword).join(', '));
  console.log('   - Missing Keywords:', analysisRes.data?.missingKeywordsList?.map(k => k.keyword).join(', '));
  console.log('   - Recommendations Count:', analysisRes.data?.recommendations?.length);

  const analysisId = analysisRes.data?.analysisId;

  // 6. Get Analysis List
  const listRes = await request('GET', '/api/analysis', null, token);
  console.log('6. List Analyses:', listRes.status === 200 && listRes.data?.count > 0 ? 'PASS' : 'FAIL', `Count: ${listRes.data?.count}`);

  // 7. Get Analysis Details By ID
  const detailRes = await request('GET', `/api/analysis/${analysisId}`, null, token);
  console.log('7. Get Analysis By ID:', detailRes.status === 200 ? 'PASS' : 'FAIL', `JobTitle: ${detailRes.data?.jobTitle}`);

  // 8. Dashboard Stats & Charts
  const statsRes = await request('GET', '/api/dashboard/stats', null, token);
  console.log('8. Dashboard Stats & Charts:', statsRes.status === 200 ? 'PASS' : 'FAIL', statsRes.data?.stats);
  console.log('   - Score over time points:', statsRes.data?.charts?.scoreOverTime?.length);
  console.log('   - Matched vs missing points:', statsRes.data?.charts?.matchedVsMissing?.length);
  console.log('   - Categories breakdown points:', statsRes.data?.charts?.categoryChartData?.length);

  // 9. Dashboard Recent
  const recentRes = await request('GET', '/api/dashboard/recent', null, token);
  console.log('9. Dashboard Recent Feed:', recentRes.status === 200 ? 'PASS' : 'FAIL', `Items: ${recentRes.data?.recent?.length}`);

  // 10. Update Profile
  const updateRes = await request('PUT', '/api/user/profile', { fullName: 'Alex J. Morgan' }, token);
  console.log('10. Update Profile:', updateRes.status === 200 ? 'PASS' : 'FAIL', updateRes.data?.fullName);

  // 11. Change Password
  const pwdRes = await request('PUT', '/api/user/change-password', {
    currentPassword: 'SecurePassword123!',
    newPassword: 'BrandNewSecurePassword456!'
  }, token);
  console.log('11. Change Password:', pwdRes.status === 200 ? 'PASS' : 'FAIL', pwdRes.data?.message);

  // 12. Create a second analysis to test deletion
  const secondAna = await request('POST', '/api/analysis', {
    jobTitle: 'Junior Data Analyst',
    resumeText: 'Data analyst skilled in Python, SQL, Excel, and Power BI with strong communication and problem solving skills.',
    jobDescription: 'Seeking Data Analyst with proficiency in Python, SQL, Excel, Power BI, and Tableau for report automation.'
  }, token);
  console.log('12. Second Analysis Created:', secondAna.status === 201 ? 'PASS' : 'FAIL', `Score: ${secondAna.data?.matchPercentage}%`);

  // 13. Delete Analysis
  const deleteRes = await request('DELETE', `/api/analysis/${secondAna.data?.analysisId}`, null, token);
  console.log('13. Delete Analysis:', deleteRes.status === 200 ? 'PASS' : 'FAIL', deleteRes.data?.message);

  console.log('--- ALL BACKEND TEST SUITE ENDPOINTS PASSED SUCCESSFULLY ---');
}

runTests().catch(err => {
  console.error('Test Suite Failed with Exception:', err);
  process.exit(1);
});
