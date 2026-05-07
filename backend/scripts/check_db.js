const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function checkConnection() {
    console.log('🔍 Checking PostgreSQL Connection...');
    console.log('Using parameters:');
    console.log(`  User: ${process.env.DB_USER}`);
    console.log(`  Host: ${process.env.DB_HOST}`);
    console.log(`  Port: ${process.env.DB_PORT}`);
    console.log(`  DB: ${process.env.DB_NAME}`);
    const pass = process.env.DB_PASSWORD || '';
    console.log(`  Password: ${pass.length} chars (Starts: ${pass.substring(0, 1)}, Ends: ${pass.substring(pass.length - 1)})`);

    const pool = new Pool({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: parseInt(process.env.DB_PORT),
    });

    try {
        const start = Date.now();
        const res = await pool.query('SELECT NOW() as "currentTime", VERSION() as "version"');
        const duration = Date.now() - start;

        console.log('\n✅ CONNECTION SUCCESSFUL');
        console.log('-----------------------------------');
        console.log('Ping Time:', duration, 'ms');
        console.log('Server Time:', res.rows[0].currentTime);
        console.log('PostgreSQL Version:', res.rows[0].version.split(',')[0]);

        // Check tables
        const tables = await pool.query(`
            SELECT table_name, 
            (SELECT count(*) FROM hospitals) as hospital_count,
            (SELECT count(*) FROM health_records) as record_count
            FROM information_schema.tables 
            WHERE table_schema = 'public' AND table_name IN ('hospitals', 'health_records')
        `);

        console.log('\n📊 DATABASE STATS');
        console.log('-----------------------------------');
        if (tables.rows.length === 0) {
            console.log('⚠️  No data tables found. Run "node scripts/import_to_pg.js" to initialize.');
        } else {
            const hospitalCount = tables.rows.find(r => r.table_name === 'hospitals')?.hospital_count || 0;
            const recordCount = tables.rows.find(r => r.table_name === 'health_records')?.record_count || 0;
            console.log('Hospital Records:', hospitalCount);
            console.log('Health Records (Uploaded):', recordCount);
        }

        await pool.end();
    } catch (err) {
        console.error('\n❌ CONNECTION FAILED');
        console.log('-----------------------------------');
        console.log('Error Code:', err.code);
        console.log('Error Message:', err.message);
        console.log('\n💡 Troubleshooting Tips:');
        console.log('1. Is PostgreSQL running? Check Windows Services.');
        console.log('2. Is the password correct in .env?');
        console.log('3. Does the database exist? Create it with "CREATE DATABASE healthcare;" in pgAdmin.');
        process.exit(1);
    }
}

checkConnection();
