
const fs = require('fs');
const readline = require('readline');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const HospitalSchema = new mongoose.Schema({
    srNo: String,
    locationCoordinates: String,
    location: String,
    name: String,
    category: String,
    careType: String,
    discipline: String,
    address: String,
    state: String,
    district: String,
    subdistrict: String,
    pincode: String,
    telephone: String,
    mobile: String,
    emergencyNum: String,
    ambulancePhone: String,
    bloodbankPhone: String,
    website: String,
    specialties: String,
    facilities: String,
    stateId: String,
    districtId: String
});

const Hospital = mongoose.model('Hospital', HospitalSchema);

async function importHospitals() {
    try {
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/healthcare';
        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB');

        // Clear existing data
        await Hospital.deleteMany({});
        console.log('Cleared existing hospitals');

        const fileStream = fs.createReadStream('d:\\Final Year Project\\hospital_directory.csv');
        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });

        let rowCount = 0;
        let batch = [];
        const BATCH_SIZE = 500;

        for await (const line of rl) {
            rowCount++;
            if (rowCount === 1) continue; // Skip header

            const cols = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(c => c.replace(/"/g, '').trim());

            if (cols.length < 10) continue;

            const hospital = {
                srNo: cols[0],
                locationCoordinates: cols[1],
                location: cols[2],
                name: cols[3],
                category: cols[4],
                careType: cols[5],
                discipline: cols[6],
                address: cols[7],
                state: cols[8],
                district: cols[9],
                subdistrict: cols[10],
                pincode: cols[11],
                telephone: cols[12],
                mobile: cols[13],
                emergencyNum: cols[14],
                ambulancePhone: cols[15],
                bloodbankPhone: cols[16],
                website: cols[23],
                specialties: cols[24],
                facilities: cols[25],
                stateId: cols[46],
                districtId: cols[47]
            };

            batch.push(hospital);

            if (batch.length >= BATCH_SIZE) {
                await Hospital.insertMany(batch);
                console.log(`Imported ${rowCount} rows...`);
                batch = [];
            }
        }

        if (batch.length > 0) {
            await Hospital.insertMany(batch);
        }

        console.log(`Import complete. Total: ${rowCount - 1} hospitals.`);
        process.exit(0);
    } catch (error) {
        console.error('Import failed:', error);
        process.exit(1);
    }
}

importHospitals();
