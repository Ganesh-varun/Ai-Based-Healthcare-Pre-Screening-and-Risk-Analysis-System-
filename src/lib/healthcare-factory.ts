import { Hospital, Doctor } from '@/data/hospitals-data';

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
    return () => {
        hash = (hash * 16807) % 2147483647;
        return (hash - 1) / 2147483646;
    };
};

export const generateProceduralData = (state: string, city: string, category: string): Hospital[] => {
    // If "All India" or "All Cities", we don't generate procedural data as it would be too much
    if (state === 'All India' || city === 'All Cities') return [];

    const seed = `${state}-${city}-${category}`;
    const random = seededRandom(seed);

    const hospitalsCount = Math.floor(random() * 3) + 2; // 2 to 4 hospitals per city
    const hospitals: Hospital[] = [];

    for (let i = 0; i < hospitalsCount; i++) {
        const hospitalName = `${city} ${HOSPITAL_SUFFIXES[Math.floor(random() * HOSPITAL_SUFFIXES.length)]}`;
        const hospitalId = `proc-${seed}-${i}`;

        const doctorsCount = Math.floor(random() * 3) + 2; // 2 to 4 doctors per hospital
        const specialists: Doctor[] = [];

        // Determine which specialty to focus on based on category
        let targetSpecialty = 'General Medicine';
        if (category !== 'all') {
            const found = SPECIALTIES.find(s => s.toLowerCase().includes(category.toLowerCase()));
            if (found) targetSpecialty = found;
        }

        for (let j = 0; j < doctorsCount; j++) {
            const docName = DOCTOR_NAMES[Math.floor(random() * DOCTOR_NAMES.length)];
            specialists.push({
                id: `${hospitalId}-doc-${j}`,
                name: docName,
                specialty: j === 0 ? targetSpecialty : SPECIALTIES[Math.floor(random() * SPECIALTIES.length)],
                experience: `${Math.floor(random() * 20) + 5} Years`,
                education: random() > 0.5 ? 'MBBS, MD' : 'MBBS, MS',
                rating: Number((random() * 1.5 + 3.5).toFixed(1)) // 3.5 to 5.0
            });
        }

        hospitals.push({
            id: hospitalId,
            name: hospitalName,
            specialty: targetSpecialty,
            address: `Zone ${i + 1}, ${city}`,
            city: city,
            state: state,
            rating: Number((random() * 1 + 4).toFixed(1)), // 4.0 to 5.0
            availability: random() > 0.3 ? 'Available Today' : 'Tomorrow 10 AM',
            distance: `${(random() * 5 + 1).toFixed(1)} km`,
            isEmergency: random() > 0.7,
            phone: `+91 ${Math.floor(random() * 9000000000) + 1000000000}`,
            specialists: specialists
        });
    }

    return hospitals;
};
