
import { Router, Request, Response } from 'express';
import { upload } from '../middleware/upload';
import csv from 'csv-parser';
import { Readable } from 'stream';
import pool from '../db';

const router = Router();

// Ensure health_records table exists
async function ensureTable() {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS health_records (
            id SERIAL PRIMARY KEY,
            data JSONB NOT NULL,
            dataset_name TEXT NOT NULL,
            uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `);
}
ensureTable().catch(console.error);

router.post('/upload', upload.single('dataset'), async (req: any, res: any) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Please upload a CSV file' });
        }

        const datasetName = req.body.name || req.file.originalname;
        const results: any[] = [];
        const stream = Readable.from(req.file.buffer);

        stream
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', async () => {
                try {
                    for (const row of results) {
                        await pool.query(
                            'INSERT INTO health_records (data, dataset_name) VALUES ($1, $2)',
                            [JSON.stringify(row), datasetName]
                        );
                    }
                    res.json({
                        message: 'Dataset uploaded successfully to PostgreSQL',
                        count: results.length,
                        datasetName: datasetName
                    });
                } catch (dbError) {
                    console.error('PG Insert Error:', dbError);
                    res.status(500).json({ error: 'Failed to save data to PostgreSQL' });
                }
            });

    } catch (error) {
        console.error('Server Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/summary', async (req: Request, res: Response) => {
    try {
        const result = await pool.query(`
            SELECT dataset_name as "_id", COUNT(*) as count, MAX(uploaded_at) as "lastUploaded"
            FROM health_records
            GROUP BY dataset_name
        `);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch summary' });
    }
});

router.get('/search', async (req: Request, res: Response) => {
    try {
        const query = req.query.q as string;
        if (!query) return res.status(400).json({ error: 'Search query required' });

        // Simple ILIKE search on JSONB stringified content for now
        const result = await pool.query(
            'SELECT * FROM health_records WHERE data::text ILIKE $1 LIMIT 10',
            [`%${query}%`]
        );
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Failed to search records' });
    }
});

router.get('/records', async (req: Request, res: Response) => {
    try {
        const limit = parseInt(req.query.limit as string) || 50;
        const page = parseInt(req.query.page as string) || 1;
        const offset = (page - 1) * limit;

        const result = await pool.query(
            'SELECT * FROM health_records ORDER BY uploaded_at DESC LIMIT $1 OFFSET $2',
            [limit, offset]
        );
        const countRes = await pool.query('SELECT COUNT(*) FROM health_records');
        const total = parseInt(countRes.rows[0].count);

        res.json({
            records: result.rows,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch records' });
    }
});

export default router;
