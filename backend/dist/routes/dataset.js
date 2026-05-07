"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const upload_1 = require("../middleware/upload");
const csv_parser_1 = __importDefault(require("csv-parser"));
const stream_1 = require("stream");
const db_1 = __importDefault(require("../db"));
const router = (0, express_1.Router)();
// Ensure health_records table exists
async function ensureTable() {
    await db_1.default.query(`
        CREATE TABLE IF NOT EXISTS health_records (
            id SERIAL PRIMARY KEY,
            data JSONB NOT NULL,
            dataset_name TEXT NOT NULL,
            uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `);
}
ensureTable().catch(console.error);
router.post('/upload', upload_1.upload.single('dataset'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Please upload a CSV file' });
        }
        const datasetName = req.body.name || req.file.originalname;
        const results = [];
        const stream = stream_1.Readable.from(req.file.buffer);
        stream
            .pipe((0, csv_parser_1.default)())
            .on('data', (data) => results.push(data))
            .on('end', async () => {
            try {
                for (const row of results) {
                    await db_1.default.query('INSERT INTO health_records (data, dataset_name) VALUES ($1, $2)', [JSON.stringify(row), datasetName]);
                }
                res.json({
                    message: 'Dataset uploaded successfully to PostgreSQL',
                    count: results.length,
                    datasetName: datasetName
                });
            }
            catch (dbError) {
                console.error('PG Insert Error:', dbError);
                res.status(500).json({ error: 'Failed to save data to PostgreSQL' });
            }
        });
    }
    catch (error) {
        console.error('Server Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
router.get('/summary', async (req, res) => {
    try {
        const result = await db_1.default.query(`
            SELECT dataset_name as "_id", COUNT(*) as count, MAX(uploaded_at) as "lastUploaded"
            FROM health_records
            GROUP BY dataset_name
        `);
        res.json(result.rows);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch summary' });
    }
});
router.get('/search', async (req, res) => {
    try {
        const query = req.query.q;
        if (!query)
            return res.status(400).json({ error: 'Search query required' });
        // Simple ILIKE search on JSONB stringified content for now
        const result = await db_1.default.query('SELECT * FROM health_records WHERE data::text ILIKE $1 LIMIT 10', [`%${query}%`]);
        res.json(result.rows);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to search records' });
    }
});
router.get('/records', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 50;
        const page = parseInt(req.query.page) || 1;
        const offset = (page - 1) * limit;
        const result = await db_1.default.query('SELECT * FROM health_records ORDER BY uploaded_at DESC LIMIT $1 OFFSET $2', [limit, offset]);
        const countRes = await db_1.default.query('SELECT COUNT(*) FROM health_records');
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
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch records' });
    }
});
exports.default = router;
