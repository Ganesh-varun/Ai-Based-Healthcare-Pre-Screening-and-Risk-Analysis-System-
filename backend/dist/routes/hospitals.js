"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = __importDefault(require("../db"));
const csv_hospitals_1 = require("../utils/csv-hospitals");
const router = (0, express_1.Router)();
// Get all states and their districts
router.get('/locations', async (req, res) => {
    try {
        const query = `
            SELECT state, array_agg(DISTINCT district ORDER BY district) as districts
            FROM hospitals
            WHERE state IS NOT NULL AND state != ''
            GROUP BY state
            ORDER BY state;
        `;
        const result = await db_1.default.query(query);
        if (result.rows.length === 0) {
            console.log('📡 PG empty, using CSV fallback for locations');
            const hospitals = await (0, csv_hospitals_1.loadHospitalsFromCSV)();
            const locationMap = {};
            hospitals.forEach(h => {
                if (!locationMap[h.state])
                    locationMap[h.state] = new Set();
                locationMap[h.state].add(h.district);
            });
            const locations = {};
            Object.keys(locationMap).sort().forEach(state => {
                locations[state] = Array.from(locationMap[state]).sort();
            });
            return res.json(locations);
        }
        const locations = {};
        result.rows.forEach(row => {
            locations[row.state] = row.districts;
        });
        res.json(locations);
    }
    catch (error) {
        console.error('PG Location Error:', error.message);
        // Secondary fallback
        const hospitals = await (0, csv_hospitals_1.loadHospitalsFromCSV)();
        const locationMap = {};
        hospitals.forEach(h => {
            if (!locationMap[h.state])
                locationMap[h.state] = new Set();
            locationMap[h.state].add(h.district);
        });
        const locations = {};
        Object.keys(locationMap).sort().forEach(state => {
            locations[state] = Array.from(locationMap[state]).sort();
        });
        res.json(locations);
    }
});
// Search hospitals with filters
router.get('/search', async (req, res) => {
    try {
        const { state, district, q, category, limit = 50, page = 1 } = req.query;
        const offset = (Number(page) - 1) * Number(limit);
        const whereClauses = [];
        const params = [];
        let paramIdx = 1;
        if (state && state !== 'All India') {
            whereClauses.push(`state = $${paramIdx++}`);
            params.push(state);
        }
        if (district && district !== 'All Cities') {
            whereClauses.push(`district = $${paramIdx++}`);
            params.push(district);
        }
        if (q) {
            whereClauses.push(`(name ILIKE $${paramIdx} OR specialties ILIKE $${paramIdx})`);
            params.push(`%${q}%`);
            paramIdx++;
        }
        if (category && category !== 'all') {
            whereClauses.push(`(specialties ILIKE $${paramIdx} OR category ILIKE $${paramIdx})`);
            params.push(`%${category}%`);
            paramIdx++;
        }
        const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';
        const countQuery = `SELECT COUNT(*) FROM hospitals ${whereSql}`;
        const countRes = await db_1.default.query(countQuery, params);
        const total = parseInt(countRes.rows[0].count);
        if (total === 0 && !state && !district && !q) {
            // If PG is empty, fallback
            const csvResult = await (0, csv_hospitals_1.searchHospitalsCSV)({
                state: state,
                district: district,
                q: q,
                category: category,
                limit: Number(limit),
                page: Number(page)
            });
            return res.json(csvResult);
        }
        const searchQuery = `
            SELECT id as _id, name, category, address, state, district, specialties, facilities, emergency_num, mobile, telephone
            FROM hospitals
            ${whereSql}
            ORDER BY name
            LIMIT $${paramIdx++} OFFSET $${paramIdx++}
        `;
        const finalParams = [...params, Number(limit), offset];
        const searchRes = await db_1.default.query(searchQuery, finalParams);
        res.json({
            hospitals: searchRes.rows,
            pagination: {
                total,
                page: Number(page),
                limit: Number(limit),
                pages: Math.ceil(total / Number(limit))
            }
        });
    }
    catch (error) {
        console.error('PG Search Error:', error.message);
        const csvResult = await (0, csv_hospitals_1.searchHospitalsCSV)({
            state: req.query.state,
            district: req.query.district,
            q: req.query.q,
            category: req.query.category,
            limit: Number(req.query.limit || 50),
            page: Number(req.query.page || 1)
        });
        res.json(csvResult);
    }
});
// Get hospital by ID
router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        if (typeof id === 'string' && id.startsWith('csv-')) {
            const hospitals = await (0, csv_hospitals_1.loadHospitalsFromCSV)();
            const h = hospitals.find(item => item._id === id);
            return h ? res.json(h) : res.status(404).json({ error: 'Not found' });
        }
        const result = await db_1.default.query('SELECT id as _id, * FROM hospitals WHERE id = $1', [id]);
        if (result.rows.length > 0) {
            return res.json(result.rows[0]);
        }
        res.status(404).json({ error: 'Hospital not found' });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.default = router;
