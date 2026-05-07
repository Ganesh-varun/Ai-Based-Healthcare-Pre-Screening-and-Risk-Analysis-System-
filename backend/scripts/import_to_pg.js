
const { Pool } = require('pg');
const fs = require('fs');
const readline = require('readline');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT),
});

async function initDb() {
    try {
        console.log('🚀 Initializing PostgreSQL Database...');

        // Create table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS hospitals (
                id SERIAL PRIMARY KEY,
                sr_no TEXT,
                location_coordinates TEXT,
                location TEXT,
                name TEXT NOT NULL,
                category TEXT,
                care_type TEXT,
                discipline TEXT,
                address TEXT,
                state TEXT,
                district TEXT,
                subdistrict TEXT,
                pincode TEXT,
                telephone TEXT,
                mobile TEXT,
                emergency_num TEXT,
                ambulance_phone TEXT,
                bloodbank_phone TEXT,
                website TEXT,
                specialties TEXT,
                facilities TEXT,
                state_id TEXT,
                district_id TEXT
            );
            
            CREATE INDEX IF NOT EXISTS idx_hospitals_state ON hospitals(state);
            CREATE INDEX IF NOT EXISTS idx_hospitals_district ON hospitals(district);
        `);

        console.log('✅ Table structure ready.');

        // Clear existing
        await pool.query('TRUNCATE hospitals RESTART IDENTITY');
        console.log('🧹 Cleared existing data.');

        const fileStream = fs.createReadStream('d:\\Final Year Project\\hospital_directory.csv');
        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });

        let rowCount = 0;
        let batch = [];
        const BATCH_SIZE = 1000;

        for await (const line of rl) {
            rowCount++;
            if (rowCount === 1) continue; // Skip header

            const cols = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(c => c.replace(/"/g, '').trim());
            if (cols.length < 10) continue;

            batch.push([
                cols[0], cols[1], cols[2], cols[3], cols[4], cols[5], cols[6], cols[7],
                cols[8], cols[9], cols[10], cols[11], cols[12], cols[13], cols[14],
                cols[15], cols[16], cols[23], cols[24], cols[25], cols[46], cols[47]
            ]);

            if (batch.length >= BATCH_SIZE) {
                await insertBatch(batch);
                console.log(`📡 Imported ${rowCount} rows...`);
                batch = [];
            }
        }

        if (batch.length > 0) {
            await insertBatch(batch);
        }

        console.log(`🎉 Import complete. Total: ${rowCount - 1} hospitals.`);
        process.exit(0);
    } catch (err) {
        console.error('❌ DB Initialization Failed:', err.message);
        process.exit(1);
    }
}

async function insertBatch(batch) {
    const query = `
        INSERT INTO hospitals (
            sr_no, location_coordinates, location, name, category, care_type, discipline, address,
            state, district, subdistrict, pincode, telephone, mobile, emergency_num,
            ambulance_phone, bloodbank_phone, website, specialties, facilities, state_id, district_id
        ) VALUES ${batch.map((_, i) => `($${i * 22 + 1}, $${i * 22 + 2}, $${i * 22 + 3}, $${i * 22 + 4}, $${i * 22 + 5}, $${i * 22 + 6}, $${i * 22 + 7}, $${i * 22 + 8}, $${i * 22 + 9}, $${i * 22 + 10}, $${i * 22 + 11}, $${i * 22 + 12}, $${i * 22 + 13}, $${i * 22 + 14}, $${i * 22 + 15}, $${i * 22 + 16}, $${i * 22 + 17}, $${i * 22 + 18}, $${i * 22 + 19}, $${i * 22 + 20}, $${i * 22 + 21}, $${i * 22 + 22})`).join(', ')}
    `;
    const values = batch.flat();
    await pool.query(query, values);
}

initDb();
