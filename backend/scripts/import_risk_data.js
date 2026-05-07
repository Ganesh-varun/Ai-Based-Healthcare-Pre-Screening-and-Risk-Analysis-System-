
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
const csv = require('csv-parser');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT),
});

const SYMPTOMS_CSV_PATH = path.join(__dirname, '../../../final_symptoms_to_disease.csv');

async function importRiskData() {
    try {
        console.log('🔗 Connecting to PostgreSQL...');
        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            // 1. Drop old matrix table if it exists
            console.log('🗑️ Removing old disease_matrix table...');
            await client.query('DROP TABLE IF EXISTS disease_matrix');

            // 2. Create 'diseases' table (for text-based search)
            console.log('🛠️ Rebuilding "diseases" table...');
            await client.query(`
                DROP TABLE IF EXISTS diseases;
                CREATE TABLE diseases (
                    id SERIAL PRIMARY KEY,
                    name TEXT NOT NULL,
                    symptoms_text TEXT NOT NULL,
                    search_vector TSVECTOR GENERATED ALWAYS AS (
                        to_tsvector('english', name || ' ' || symptoms_text)
                    ) STORED
                );
                CREATE INDEX idx_diseases_search ON diseases USING GIN(search_vector);
            `);

            // 3. Import 'final_symptoms_to_disease.csv'
            console.log('📥 Importing text-based symptoms data...');
            const diseasesData = [];

            await new Promise((resolve, reject) => {
                fs.createReadStream(SYMPTOMS_CSV_PATH)
                    .pipe(csv())
                    .on('data', (row) => {
                        const keys = Object.keys(row);
                        const diseaseKey = keys.find(k => k.trim().toLowerCase().includes('disease'));
                        const symptomKey = keys.find(k => k.trim().toLowerCase().includes('symptom'));

                        if (row[diseaseKey] && row[symptomKey]) {
                            diseasesData.push([row[diseaseKey], row[symptomKey]]);
                        }
                    })
                    .on('end', resolve)
                    .on('error', reject);
            });

            if (diseasesData.length > 0) {
                const insertQuery = `
                    INSERT INTO diseases (name, symptoms_text) 
                    VALUES ($1, $2)
                `;
                for (const row of diseasesData) {
                    await client.query(insertQuery, row);
                }
                console.log(`✅ Imported ${diseasesData.length} diseases.`);
            } else {
                console.warn('⚠️ No data found in final_symptoms_to_disease.csv');
            }

            await client.query('COMMIT');
            console.log('🎉 Risk Data Import Completed Successfully! (Matrix dataset removed)');

        } catch (e) {
            await client.query('ROLLBACK');
            throw e;
        } finally {
            client.release();
        }

    } catch (err) {
        console.error('❌ Import Failed:', err);
    } finally {
        pool.end();
    }
}

importRiskData();
