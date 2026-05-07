"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const sos_1 = __importDefault(require("../db/sos"));
const router = express_1.default.Router();
router.post('/send', async (req, res) => {
    const { device_id, status } = req.body;
    try {
        const result = await sos_1.default.query(`INSERT INTO sos_signals (device_id, status) 
             VALUES ($1, $2) RETURNING *`, [device_id || 'unknown', status || 'sent']);
        res.status(201).json({ success: true, signal: result.rows[0] });
    }
    catch (err) {
        console.error('❌ Error saving SOS signal:', err);
        res.status(500).json({ success: false, error: 'Database error' });
    }
});
exports.default = router;
