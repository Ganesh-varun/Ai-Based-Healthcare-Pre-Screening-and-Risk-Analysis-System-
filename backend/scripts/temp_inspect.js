const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const CHECKLIST_CSV_PATH = 'd:/Final Year Project/disease_prediction - 1.csv';

async function inspect() {
    const counts = {};
    const symptomStats = {};

    fs.createReadStream(CHECKLIST_CSV_PATH)
        .pipe(csv())
        .on('data', (row) => {
            const keys = Object.keys(row);
            const labelKey = keys[keys.length - 1];
            const disease = row[labelKey];

            if (!counts[disease]) counts[disease] = 0;
            counts[disease]++;

            Object.entries(row).forEach(([symptom, val]) => {
                if (symptom !== labelKey && val === '1') {
                    if (!symptomStats[symptom]) symptomStats[symptom] = 0;
                    symptomStats[symptom]++;
                }
            });
        })
        .on('end', () => {
            console.log('Disease Counts (first 10):', Object.entries(counts).slice(0, 10));
            console.log('Symptom stats (first 10):', Object.entries(symptomStats).slice(0, 10));
        });
}

inspect();
