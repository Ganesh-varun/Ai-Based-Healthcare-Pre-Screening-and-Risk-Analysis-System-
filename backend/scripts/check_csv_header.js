const fs = require('fs');
const readline = require('readline');

async function checkFirstLine() {
    const fileStream = fs.createReadStream('d:/Final Year Project/disease_prediction - 1.csv');
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    for await (const line of rl) {
        console.log('--- START OF LINE ---');
        console.log(line);
        console.log('--- END OF LINE ---');
        break;
    }
}

checkFirstLine();
