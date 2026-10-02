const http = require('http');

const pdfContent = `%PDF-1.4
1 0 obj
<<
  /Type /Catalog
  /Pages 2 0 R
>>
endobj
2 0 obj
<<
  /Type /Pages
  /Kids [3 0 R]
  /Count 1
>>
endobj
3 0 obj
<<
  /Type /Page
  /Parent 2 0 R
  /MediaBox [0 0 612 792]
  /Contents 4 0 R
  /Resources <<
    /Font <<
      /F1 <<
        /Type /Font
        /Subtype /Type1
        /BaseFont /Helvetica
      >>
    >>
  >>
>>
endobj
4 0 obj
<<
  /Length 120
>>
stream
BT
/F1 12 Tf
72 712 Td
(Software Engineer with Python, React, Node.js, SQL, AWS, Docker, Git and Machine Learning experience) Tj
ET
endstream
endobj
xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000261 00000 n 
trailer
<<
  /Root 1 0 R
  /Size 5
>>
startxref
438
%%EOF`;

function loginAndGetToken() {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      fullName: 'PDF Tester',
      email: `pdftester_${Date.now()}@example.com`,
      password: 'Password123!'
    });

    const req = http.request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/register',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, res => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve(JSON.parse(body).token));
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

function uploadPdf(token) {
  return new Promise((resolve, reject) => {
    const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
    const pdfBuffer = Buffer.from(pdfContent, 'utf-8');

    let body = [];
    body.push(Buffer.from(`--${boundary}\r\n`));
    body.push(Buffer.from(`Content-Disposition: form-data; name="resumeFile"; filename="resume.pdf"\r\n`));
    body.push(Buffer.from(`Content-Type: application/pdf\r\n\r\n`));
    body.push(pdfBuffer);
    body.push(Buffer.from(`\r\n--${boundary}--\r\n`));

    const totalPayload = Buffer.concat(body);

    const req = http.request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/analysis/upload-pdf',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Content-Length': totalPayload.length
      }
    }, res => {
      let resBody = '';
      res.on('data', chunk => resBody += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data: JSON.parse(resBody) }));
    });

    req.on('error', reject);
    req.write(totalPayload);
    req.end();
  });
}

async function run() {
  console.log('Testing PDF Resume Upload & Keyword Extraction...');
  const token = await loginAndGetToken();
  console.log('User registered with token');

  const uploadResult = await uploadPdf(token);
  console.log('Upload Status:', uploadResult.status === 200 ? 'PASS' : 'FAIL', uploadResult.status);
  console.log('Extracted filename:', uploadResult.data?.fileName);
  console.log('Number of pages:', uploadResult.data?.numPages);
  console.log('Extracted text:', uploadResult.data?.text);

  // Now run analysis using the extracted PDF text
  const anaReq = http.request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/analysis',
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }, res => {
    let body = '';
    res.on('data', chunk => body += chunk);
    res.on('end', () => {
      const anaResult = JSON.parse(body);
      console.log('Analysis from PDF text Status:', res.statusCode === 201 ? 'PASS' : 'FAIL');
      console.log('Match Percentage:', anaResult.matchPercentage + '%');
      console.log('Matched Keywords from PDF:', anaResult.matchedKeywordsList?.map(k => k.keyword).join(', '));
      console.log('Missing Keywords:', anaResult.missingKeywordsList?.map(k => k.keyword).join(', '));
    });
  });

  anaReq.write(JSON.stringify({
    jobTitle: 'Senior Full Stack Engineer',
    resumeText: uploadResult.data.text,
    jobDescription: 'Seeking Senior Full Stack Engineer with experience in Python, React, Node.js, SQL, AWS, Docker, Git and Kubernetes.'
  }));
  anaReq.end();
}

run().catch(console.error);
