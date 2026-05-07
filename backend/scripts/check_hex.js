const fs = require('fs');

async function checkHex() {
    const buffer = Buffer.alloc(500);
    const fd = fs.openSync('d:/Final Year Project/disease_prediction - 1.csv', 'r');
    fs.readSync(fd, buffer, 0, 500, 0);
    console.log(buffer.toString('utf8'));
    console.log('--- HEX ---');
    console.log(buffer.slice(0, 100).toString('hex'));
    fs.closeSync(fd);
}

checkHex();
