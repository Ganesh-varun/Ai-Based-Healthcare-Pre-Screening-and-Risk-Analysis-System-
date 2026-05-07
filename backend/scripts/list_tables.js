
const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT),
});

async function listTablesAndCounts() {
    try {
        console.log('🔍 Listing All Tables & Row Counts...');

        const res = await pool.query(`
            SELECT 
                schemaname, 
                relname as table_name, 
                n_live_tup as row_count 
            FROM pg_stat_user_tables 
            ORDER BY n_live_tup DESC;
        `);

        if (res.rows.length === 0) {
            console.log('⚠️ No user tables found.');
        } else {
            console.table(res.rows);
        }

    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        pool.end();
    }
}

listTablesAndCounts();
