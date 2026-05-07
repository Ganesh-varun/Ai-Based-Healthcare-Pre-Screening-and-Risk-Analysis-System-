
const fs = require('fs');
const readline = require('readline');

async function analyzeCSV() {
    const fileStream = fs.createReadStream('d:\\Final Year Project\\hospital_directory.csv');
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    let rowCount = 0;
    const states = new Map();
    const categories = new Set();
    const careTypes = new Set();

    for await (const line of rl) {
        rowCount++;
        if (rowCount === 1) continue; // Skip header

        // Split by comma but handle quoted fields
        const cols = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);

        if (cols.length < 11) continue;

        const state = cols[8]?.replace(/"/g, '').trim();
        const district = cols[9]?.replace(/"/g, '').trim();
        const category = cols[4]?.replace(/"/g, '').trim();
        const careType = cols[5]?.replace(/"/g, '').trim();

        if (state) {
            if (!states.has(state)) {
                states.set(state, new Set());
            }
            if (district) {
                states.get(state).add(district);
            }
        }
        if (category) categories.add(category);
        if (careType) careTypes.add(careType);
    }

    const output = {
        totalRows: rowCount - 1,
        states: {},
        categories: Array.from(categories),
        careTypes: Array.from(careTypes)
    };

    for (const [state, districts] of states.entries()) {
        output.states[state] = Array.from(districts).sort();
    }

    fs.writeFileSync('analysis.json', JSON.stringify(output, null, 2));
    console.log('Analysis complete. Results in analysis.json');
}

analyzeCSV();
