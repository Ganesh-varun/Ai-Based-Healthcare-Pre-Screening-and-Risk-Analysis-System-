
const { Pool } = require('pg');
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT),
});

pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Connection Error', err);
    } else {
        console.log('Connected successfully at:', res.rows[0].now);
    }
    pool.end();
});
