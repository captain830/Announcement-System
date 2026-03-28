const { Pool } = require('pg');
require('dotenv').config();

console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_NAME:', process.env.DB_NAME);

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
    // Add SSL for production (Neon requires it)
    ...(process.env.NODE_ENV === 'production' && {
        ssl: {
            rejectUnauthorized: false
        }
    })
});

// Test connection
pool.connect((err, client, release) => {
    if (err) {
        console.error('❌ Database connection error:', err.message);
    } else {
        console.log('✅ Connected to PostgreSQL database');
        release();
    }
});

const connectDB = async () => {
    try {
        const client = await pool.connect();
        console.log('✅ Database connection established');
        client.release();
        return true;
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        return false;
    }
};

module.exports = {
    connectDB,
    query: (text, params) => pool.query(text, params),
    pool
};