import express from 'express';
import pool from '../db/sos';

const router = express.Router();

router.post('/send', async (req, res) => {
    const { device_id, status } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO sos_signals (device_id, status) 
             VALUES ($1, $2) RETURNING *`,
            [device_id || 'unknown', status || 'sent']
        );
        res.status(201).json({ success: true, signal: result.rows[0] });
    } catch (err) {
        console.error('❌ Error saving SOS signal:', err);
        res.status(500).json({ success: false, error: 'Database error' });
    }
});

export default router;
