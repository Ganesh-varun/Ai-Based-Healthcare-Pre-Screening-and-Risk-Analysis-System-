"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initDB = void 0;
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const pool = new pg_1.Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT),
});
const initDB = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS sos_signals (
                id SERIAL PRIMARY KEY,
                device_id TEXT,
                status TEXT DEFAULT 'sent',
                created_at TIMESTAMP DEFAULT NOW()
            );
        `);
        console.log('✅ PostgreSQL Table Created or Verified: sos_signals');
    }
    catch (err) {
        console.error('❌ Error creating/verifying table:', err);
    }
};
exports.initDB = initDB;
exports.default = pool;
