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

async function getSymptoms() {
    try {
        const res = await pool.query("SELECT DISTINCT jsonb_object_keys(symptom_profile) as key FROM disease_matrix");
        console.log(JSON.stringify(res.rows.map(r => r.key)));
    } catch (e) {
        console.error(e);
    } finally {
        await pool.end();
    }
}

getSymptoms();
