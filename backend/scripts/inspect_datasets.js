
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

async function inspectDatasets() {
    try {
        console.log('🔍 Inspecting Health Records (Datasets)...');

        // Get unique dataset names
        const res = await pool.query('SELECT DISTINCT dataset_name FROM health_records');
        console.log('Available Datasets:', res.rows.map(r => r.dataset_name));

        if (res.rows.length === 0) {
            console.log('⚠️ No datasets found in health_records table.');
            return;
        }

        // For each dataset, get a sample row to understand structure
        for (const row of res.rows) {
            const name = row.dataset_name;
            const sample = await pool.query('SELECT data FROM health_records WHERE dataset_name = $1 LIMIT 1', [name]);
            console.log(`\n📋 Schema for "${name}":`);
            const dataKeys = Object.keys(sample.rows[0].data);
            console.log('Keys:', dataKeys.join(', '));
            console.log('Sample:', JSON.stringify(sample.rows[0].data, null, 2).substring(0, 200) + '...');
        }

    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        pool.end();
    }
}

inspectDatasets();
