const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT),
});

const CHECKLIST_CSV_PATH = 'd:/Final Year Project/disease_prediction - 1.csv';
const SYMPTOMS_CSV_PATH = 'd:/Final Year Project/final_symptoms_to_disease.csv';

async function sync() {
    console.log('🔄 Starting Full Dataset Sync...');
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // 1. Rebuild Matrix Table
        console.log('🛠️ Rebuilding disease_matrix...');
        await client.query('DROP TABLE IF EXISTS disease_matrix');
        await client.query(`
            CREATE TABLE disease_matrix (
                id SERIAL PRIMARY KEY,
                disease_name TEXT NOT NULL,
                symptom_profile JSONB NOT NULL,
                total_symptoms INTEGER DEFAULT 0
            )
        `);

        const matrixData = [];
        await new Promise((resolve, reject) => {
            fs.createReadStream(CHECKLIST_CSV_PATH)
                .pipe(csv())
                .on('data', (row) => {
                    const keys = Object.keys(row).map(k => k.trim());
                    const lastKey = keys[keys.length - 1];
                    const diseaseName = row[Object.keys(row)[keys.length - 1]];

                    const profile = {};
                    let count = 0;
                    Object.entries(row).forEach(([k, v], idx) => {
                        if (idx < keys.length - 1) { // Symptoms
                            const cleanedKey = k.trim().toLowerCase().replace(/ /g, '_');
                            profile[cleanedKey] = v;
                            if (v === '1') count++;
                        }
                    });

                    matrixData.push([diseaseName, JSON.stringify(profile), count]);
                })
                .on('end', resolve)
                .on('error', reject);
        });

        for (const row of matrixData) {
            await client.query('INSERT INTO disease_matrix (disease_name, symptom_profile, total_symptoms) VALUES ($1, $2, $3)', row);
        }
        console.log(`✅ Imported ${matrixData.length} matrix records.`);

        // 2. Rebuild Diseases Table (Text Search)
        console.log('🛠️ Rebuilding diseases table...');
        await client.query('DROP TABLE IF EXISTS diseases');
        await client.query(`
            CREATE TABLE diseases (
                id SERIAL PRIMARY KEY,
                name TEXT NOT NULL,
                symptoms_text TEXT NOT NULL,
                search_vector TSVECTOR GENERATED ALWAYS AS (
                    to_tsvector('english', name || ' ' || symptoms_text)
                ) STORED
            )
        `);

        const diseasesData = [];
        await new Promise((resolve, reject) => {
            fs.createReadStream(SYMPTOMS_CSV_PATH)
                .pipe(csv())
                .on('data', (row) => {
                    const keys = Object.keys(row);
                    const dKey = keys.find(k => k.toLowerCase().includes('disease'));
                    const sKey = keys.find(k => k.toLowerCase().includes('symptom'));
                    if (row[dKey] && row[sKey]) {
                        diseasesData.push([row[dKey], row[sKey]]);
                    }
                })
                .on('end', resolve)
                .on('error', reject);
        });

        for (const row of diseasesData) {
            await client.query('INSERT INTO diseases (name, symptoms_text) VALUES ($1, $2)', row);
        }
        console.log(`✅ Imported ${diseasesData.length} text-based records.`);

        await client.query('COMMIT');
        console.log('🎉 Dataset Sync Complete!');
    } catch (e) {
        await client.query('ROLLBACK');
        console.error('❌ Sync Failed:', e);
    } finally {
        client.release();
        pool.end();
    }
}

sync();
