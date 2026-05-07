"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadHospitalsFromCSV = loadHospitalsFromCSV;
exports.searchHospitalsCSV = searchHospitalsCSV;
const fs_1 = __importDefault(require("fs"));
const readline_1 = __importDefault(require("readline"));
let cachedHospitals = [];
const CSV_PATH = 'd:\\Final Year Project\\hospital_directory.csv';
async function loadHospitalsFromCSV() {
    if (cachedHospitals.length > 0)
        return cachedHospitals;
    try {
        const fileStream = fs_1.default.createReadStream(CSV_PATH);
        const rl = readline_1.default.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });
        const hospitals = [];
        let rowCount = 0;
        for await (const line of rl) {
            rowCount++;
            if (rowCount === 1)
                continue; // Skip header
            const cols = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(c => c.replace(/"/g, '').trim());
            if (cols.length < 10)
                continue;
            hospitals.push({
                _id: `csv-${rowCount}`, // Deterministic ID for fallback
                name: cols[3],
                category: cols[4],
                address: cols[7],
                state: cols[8],
                district: cols[9],
                specialties: cols[24] || '',
                facilities: cols[25] || '',
                emergencyNum: cols[14] || '0',
                mobile: cols[13] || '0',
                telephone: cols[12] || '0'
            });
            // Limit memory usage for now if needed, but 30k objects should stay under 50MB
            if (rowCount > 35000)
                break;
        }
        cachedHospitals = hospitals;
        console.log(`✅ Loaded ${cachedHospitals.length} hospitals from CSV fallback`);
        return cachedHospitals;
    }
    catch (error) {
        console.error('Failed to load CSV hospitals:', error);
        return [];
    }
}
async function searchHospitalsCSV(filters) {
    const data = await loadHospitalsFromCSV();
    let filtered = data;
    if (filters.state && filters.state !== 'All India') {
        filtered = filtered.filter(h => h.state === filters.state);
    }
    if (filters.district && filters.district !== 'All Cities') {
        filtered = filtered.filter(h => h.district === filters.district);
    }
    if (filters.category && filters.category !== 'all') {
        filtered = filtered.filter(h => h.specialties.toLowerCase().includes(filters.category.toLowerCase()) ||
            h.category.toLowerCase().includes(filters.category.toLowerCase()));
    }
    if (filters.q) {
        const search = filters.q.toLowerCase();
        filtered = filtered.filter(h => h.name.toLowerCase().includes(search) ||
            h.specialties.toLowerCase().includes(search));
    }
    const total = filtered.length;
    const limit = filters.limit || 50;
    const page = filters.page || 1;
    const skip = (page - 1) * limit;
    return {
        hospitals: filtered.slice(skip, skip + limit),
        pagination: {
            total,
            page,
            limit,
            pages: Math.ceil(total / limit)
        }
    };
}
