import { Hospital, Doctor, HOSPITALS_DATA } from '@/data/hospitals-data';

const SPECIALTIES = [
    'General Medicine', 'Cardiology', 'Neurology', 'Orthopedics',
    'Pediatrics', 'Gastroenterology', 'Oncology', 'Nephrology',
    'Pulmonology', 'ENT', 'Ophthalmology', 'Dermatology',
    'Gynecology', 'Dental', 'Psychiatry'
];

const DOCTOR_NAMES = [
    'Dr. Rajesh Kumar', 'Dr. Priya Sharma', 'Dr. Amit Patel', 'Dr. Sneha Reddy',
    'Dr. Vikram Singh', 'Dr. Ananya Das', 'Dr. Manoj Tiwari', 'Dr. Kavita Iyer',
    'Dr. Suresh Prabhu', 'Dr. Meera Nair', 'Dr. Arvind Kejriwal', 'Dr. Deepa Malik',
    'Dr. Rohan Joshi', 'Dr. Shweta Gupta', 'Dr. Rahul Dravid', 'Dr. Sunita Williams'
];

const HOSPITAL_SUFFIXES = [
    'General Hospital', 'Speciality Clinic', 'Medical Center',
    'Care Institute', 'Multi-specialty Hospital', 'Nursing Home',
    'Apex Hospital', 'City Health Center'
];

// Seeded random function to ensure same results for same string
const seededRandom = (seed: string) => {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        hash = ((hash << 5) - hash) + seed.charCodeAt(i);
        hash |= 0;
    }

    // Standard LCG parameters
    let state = Math.abs(hash) || 123456789;
    return () => {
        state = (state * 16807) % 2147483647;
        return state / 2147483647;
    };
};

export const generateSpecialists = (hospitalId: string, city: string, specialty: string, randomSeed?: string): Doctor[] => {
    const random = seededRandom(randomSeed || `${hospitalId}---${city}`);
    const doctorsCount = Math.floor(random() * 3) + 3; // 3 to 5 doctors
    const specialists: Doctor[] = [];

    for (let j = 0; j < doctorsCount; j++) {
        const docName = DOCTOR_NAMES[Math.floor(random() * DOCTOR_NAMES.length)];
        specialists.push({
            id: `${hospitalId}-doc-${j}`,
            name: docName,
            specialty: j === 0 ? specialty : SPECIALTIES[Math.floor(random() * SPECIALTIES.length)],
            experience: `${Math.floor(random() * 20) + 5} Years`,
            education: random() > 0.5 ? 'MBBS, MD' : 'MBBS, MS',
            rating: Number((random() * 1.5 + 3.5).toFixed(1))
        });
    }
    return specialists;
};

export const getHospitalById = (id: string): Hospital | undefined => {
    // 1. Check static data
    const staticHospital = HOSPITALS_DATA.find(h => h.id === id);
    if (staticHospital) {
        // Ensure static hospitals also have specialists
        if (!staticHospital.specialists || staticHospital.specialists.length === 0) {
            staticHospital.specialists = generateSpecialists(staticHospital.id, staticHospital.city, staticHospital.specialty);
        }
        return staticHospital;
    }

    // 2. Parse procedural ID
    // Format: proc---state---city---category---index
    if (id.startsWith('proc---')) {
        const parts = id.split('---');
        if (parts.length === 5) {
            const [_, state, city, category, index] = parts;
            const hospitals = generateProceduralData(state, city, category);
            return hospitals[parseInt(index)];
        }
    }

    return undefined;
};

export const generateProceduralData = (state: string, city: string, category: string): Hospital[] => {
    if (state === 'All India' || city === 'All Cities') return [];

    const seed = `${state}---${city}---${category}`;
    const random = seededRandom(seed);

    const hospitalsCount = Math.floor(random() * 3) + 2;
    const hospitals: Hospital[] = [];

    for (let i = 0; i < hospitalsCount; i++) {
        const hospitalName = `${city} ${HOSPITAL_SUFFIXES[Math.floor(random() * HOSPITAL_SUFFIXES.length)]}`;
        const hospitalId = `proc---${state}---${city}---${category}---${i}`;

        let targetSpecialty = 'General Medicine';
        if (category !== 'all') {
            const found = SPECIALTIES.find(s => s.toLowerCase().includes(category.toLowerCase()));
            if (found) targetSpecialty = found;
        }

        const specialists = generateSpecialists(hospitalId, city, targetSpecialty, `${seed}---h-${i}`);

        hospitals.push({
            id: hospitalId,
            name: hospitalName,
            specialty: targetSpecialty,
            address: `Zone ${i + 1}, ${city}`,
            city: city,
            state: state,
            rating: Number((random() * 1 + 4).toFixed(1)),
            availability: random() > 0.3 ? 'Available Today' : 'Tomorrow 10 AM',
            distance: `${(random() * 5 + 1).toFixed(1)} km`,
            isEmergency: random() > 0.7,
            phone: `+91 ${Math.floor(random() * 9000000000) + 1000000000}`,
            specialists: specialists
        });
    }

    return hospitals;
};
