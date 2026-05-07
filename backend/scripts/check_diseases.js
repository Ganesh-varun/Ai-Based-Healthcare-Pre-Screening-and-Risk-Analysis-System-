
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

async function checkDiseases() {
    try {
        console.log('🔍 Checking disease classifications...\n');

        // Check for common cold
        const coldResult = await pool.query("SELECT name, symptoms_text FROM diseases WHERE name ILIKE '%common cold%' LIMIT 3");
        console.log('Common Cold entries:', coldResult.rows.length);
        coldResult.rows.forEach(r => {
            console.log(`  - ${r.name}: ${r.symptoms_text.substring(0, 80)}...`);
        });

        // Check what gets matched for "fever and coryza"
        console.log('\n📊 Testing search for "fever and coryza":');
        const searchResult = await pool.query(`
            SELECT 
                name, 
                symptoms_text,
                ts_rank(search_vector, plainto_tsquery('english', $1)) as rank
            FROM diseases
            WHERE search_vector @@ plainto_tsquery('english', $1)
            ORDER BY rank DESC
            LIMIT 5
        `, ['fever and coryza']);

        searchResult.rows.forEach(r => {
            console.log(`\n  ${r.name} (rank: ${r.rank.toFixed(4)})`);
            console.log(`    ${r.symptoms_text.substring(0, 100)}...`);
        });

        pool.end();
    } catch (err) {
        console.error('Error:', err);
        pool.end();
    }
}

checkDiseases();
