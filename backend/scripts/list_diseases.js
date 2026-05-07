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

async function getDiseases() {
    try {
        const res = await pool.query("SELECT name FROM diseases LIMIT 100");
        console.log(res.rows.map(r => r.name).join(', '));
    } catch (e) {
        console.error(e);
    } finally {
        await pool.end();
    }
}

getDiseases();
