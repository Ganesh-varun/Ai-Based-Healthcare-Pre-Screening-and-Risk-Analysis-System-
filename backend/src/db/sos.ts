import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
});

export const initDB = async () => {
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
    } catch (err) {
        console.error('❌ Error creating/verifying table:', err);
    }
};

export default pool;
