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

async function runTest() {
    try {
        console.log('🧪 Diagnosing Risk Analysis Error...');
        const symptoms = 'fever';

        // Test 1: Connection
        await pool.query('SELECT NOW()');
        console.log('✅ DB Connection OK');

        // Test 2: Check diseases table schema
        const schema = await pool.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'diseases'");
        console.log('📋 Table Schema:', schema.rows.map(c => `${c.column_name}(${c.data_type})`).join(', '));

        // Test 3: Run the actual query used in the route
        console.log('🔍 Running FTS Query with [fever]...');
        const ftsQuery = `
            SELECT 
                name, 
                symptoms_text,
                ts_rank(search_vector, websearch_to_tsquery('english', $1)) as rank
            FROM diseases
            WHERE search_vector @@ websearch_to_tsquery('english', $1)
               OR name ILIKE '%' || $1 || '%'
            ORDER BY rank DESC
            LIMIT 1;
        `;
        const result = await pool.query(ftsQuery, [symptoms]);
        console.log('✅ Query Result Count:', result.rows.length);
        if (result.rows.length > 0) {
            console.log('📌 Top Match:', result.rows[0].name);
        }

    } catch (e) {
        console.error('❌ DIAGNOSTIC FAILED:');
        console.error(e.message);
        if (e.stack) console.error(e.stack);
    } finally {
        await pool.end();
    }
}

runTest();
