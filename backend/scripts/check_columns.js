const fs = require('fs');

async function checkHex() {
    const buffer = Buffer.alloc(1000);
    const fd = fs.openSync('d:/Final Year Project/disease_prediction - 1.csv', 'r');
    fs.readSync(fd, buffer, 0, 1000, 0);
    const text = buffer.toString('utf8');
    const firstLine = text.split('\n')[0];
    console.log('--- RAW FIRST LINE ---');
    console.log(firstLine);
    console.log('--- COMMA COUNT ---');
    console.log(firstLine.split(',').length - 1);
    console.log('--- COLUMNS ---');
    console.log(firstLine.split(','));
    fs.closeSync(fd);
}

checkHex();
