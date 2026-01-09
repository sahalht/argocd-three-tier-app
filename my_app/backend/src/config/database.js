const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || '172.31.21.77',
  database: process.env.DB_NAME || 'company_dashboard',
  password: process.env.DB_PASSWORD || 'password123',
  port: process.env.DB_PORT || 5432,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000, // Increased to 10 seconds for remote connections
});

// Test connection
pool.on('connect', () => {
  console.log('✅ Database connected');
});

pool.on('error', (err) => {
  console.error('❌ Database error:', err.message);
  // Don't exit process - let app continue running
});

// Test initial connection (non-blocking)
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('⚠️  Database connection failed:', err.message);
    console.log('⚠️  Server will continue running, but database operations will fail');
  } else {
    console.log('✅ Database connection verified');
  }
});

module.exports = pool;

