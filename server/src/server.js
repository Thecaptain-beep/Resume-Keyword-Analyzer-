/**
 * Server Entry Point
 */

require('dotenv').config();
const http = require('http');
const app = require('./app');
const { connectDB } = require('./config/db');

const PORT = process.env.PORT || 5000;

async function startServer() {
  // Connect to database (MSSQL with fallback)
  await connectDB();

  const server = http.createServer(app);

  server.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(` ResumeCheck Backend Server running on port ${PORT} `);
    console.log(` API URL: http://localhost:${PORT}/api               `);
    console.log(`=======================================================`);
  });

  process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    server.close(() => {
      console.log('Server closed.');
      process.exit(0);
    });
  });
}

startServer().catch(err => {
  console.error('Fatal Server Boot Error:', err);
  process.exit(1);
});
