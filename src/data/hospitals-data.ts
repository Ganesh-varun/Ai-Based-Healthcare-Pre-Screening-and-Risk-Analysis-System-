export interface Doctor {
    id: string;
    name: string;
    specialty: string;
    experience: string;
    education: string;
    rating: number;
}

export interface Hospital {
    id: string;
    name: string;
    specialty: string;
    address: string;
    city: string;
    state: string;
    rating: number;
    availability: string;
    distance: string;
    isEmergency?: boolean;
    phone?: string;
    specialists?: Doctor[];
}

export const HOSPITALS_DATA: Hospital[] = [
    // Maharashtra
    { id: 'mh1', name: 'Leelavati Hospital', specialty: 'Multi-specialty', address: 'Bandra West', city: 'Mumbai City', state: 'Maharashtra', rating: 4.8, availability: '24/7', distance: '1.2 km', isEmergency: true, phone: '+91 22 2675 1000' },
    { id: 'mh2', name: 'Nanavati Max Super Speciality', specialty: 'Oncology & Cardiology', address: 'Vile Parle West', city: 'Mumbai City', state: 'Maharashtra', rating: 4.7, availability: '24/7', distance: '2.5 km', isEmergency: true, phone: '+91 22 2626 7500' },
    { id: 'mh3', name: 'Kokilaben Dhirubhai Ambani Hospital', specialty: 'Quaternary Care', address: 'Andheri West', city: 'Mumbai City', state: 'Maharashtra', rating: 4.9, availability: '24/7', distance: '3.1 km', isEmergency: true },
    { id: 'mh4', name: 'Ruby Hall Clinic', specialty: 'Neurology & Cardiac', address: 'Sassoon Road', city: 'Pune', state: 'Maharashtra', rating: 4.7, availability: '24/7', distance: '1.5 km', isEmergency: true },
    { id: 'mh5', name: 'Jehangir Hospital', specialty: 'Multi-specialty', address: 'Bund Garden', city: 'Pune', state: 'Maharashtra', rating: 4.6, availability: '24/7', distance: '2.0 km' },
    { id: 'mh6', name: 'Sahyadri Super Speciality', specialty: 'Transplant & Cardiac', address: 'Deccan Gymkhana', city: 'Pune', state: 'Maharashtra', rating: 4.8, availability: '24/7', distance: '4.2 km', isEmergency: true },
    { id: 'mh7', name: 'Kingsway Hospitals', specialty: 'Multi-specialty', address: 'Near Kasturchand Park', city: 'Nagpur', state: 'Maharashtra', rating: 4.5, availability: '24/7', distance: '0.8 km' },
    { id: 'mh8', name: 'Orange City Hospital', specialty: 'Critical Care', address: 'Khamla Road', city: 'Nagpur', state: 'Maharashtra', rating: 4.6, availability: '24/7', distance: '3.5 km' },

    // Karnataka
    { id: 'ka1', name: 'Manipal Hospital', specialty: 'General & Emergency', address: 'Old Airport Road', city: 'Bengaluru Urban', state: 'Karnataka', rating: 4.8, availability: '24/7', distance: '0.5 km', isEmergency: true },
    { id: 'ka2', name: 'Aster CMI Hospital', specialty: 'Multi-specialty', address: 'Hebbal', city: 'Bengaluru Urban', state: 'Karnataka', rating: 4.7, availability: '24/7', distance: '1.8 km' },
    { id: 'ka3', name: 'Fortis Hospital', specialty: 'Cardiac & Ortho', address: 'Bannerghatta Road', city: 'Bengaluru Urban', state: 'Karnataka', rating: 4.6, availability: '24/7', distance: '5.2 km', isEmergency: true },
    { id: 'ka4', name: 'Narayana Health City', specialty: 'Cardiac & Oncology', address: 'Bommasandra', city: 'Bengaluru Urban', state: 'Karnataka', rating: 4.9, availability: '24/7', distance: '12.0 km', isEmergency: true },
    { id: 'ka5', name: 'St. John’s Medical College', specialty: 'General Medicine', address: 'Koramangala', city: 'Bengaluru Urban', state: 'Karnataka', rating: 4.5, availability: '24/7', distance: '2.2 km' },
    { id: 'ka6', name: 'KMC Hospital', specialty: 'Multi-specialty', address: 'Jyothi Circle', city: 'Dakshina Kannada', state: 'Karnataka', rating: 4.7, availability: '24/7', distance: '1.0 km' },
    { id: 'ka7', name: 'Father Muller Medical College', specialty: 'General', address: 'Kankanady', city: 'Dakshina Kannada', state: 'Karnataka', rating: 4.6, availability: '24/7', distance: '2.5 km' },

    // Delhi
    { id: 'dl1', name: 'AIIMS', specialty: 'Apex Medical Institute', address: 'Ansari Nagar', city: 'New Delhi', state: 'Delhi', rating: 4.9, availability: '24/7', distance: '0.2 km', isEmergency: true },
    { id: 'dl2', name: 'Safdarjung Hospital', specialty: 'General & Trauma', address: 'Safdarjung Enclave', city: 'New Delhi', state: 'Delhi', rating: 4.3, availability: '24/7', distance: '0.5 km', isEmergency: true },
    { id: 'dl3', name: 'Max Super Speciality', specialty: 'Nephrology & Cardiac', address: 'Saket', city: 'South Delhi', state: 'Delhi', rating: 4.8, availability: '24/7', distance: '2.1 km', isEmergency: true },
    { id: 'dl4', name: 'Medanta - The Medicity', specialty: 'Quaternary Care', address: 'Gurugram Sector 38', city: 'Gurugram', state: 'Haryana', rating: 4.9, availability: '24/7', distance: '15.0 km', isEmergency: true },
    { id: 'dl5', name: 'Fortis Memorial Research Institute', specialty: 'Multi-specialty', address: 'Gurugram Sector 44', city: 'Gurugram', state: 'Haryana', rating: 4.8, availability: '24/7', distance: '14.5 km', isEmergency: true },

    // Tamil Nadu
    { id: 'tn1', name: 'Apollo Hospitals', specialty: 'Multi-specialty & Emergency', address: 'Greams Road', city: 'Chennai', state: 'Tamil Nadu', rating: 4.9, availability: '24/7', distance: '0.9 km', isEmergency: true },
    { id: 'tn2', name: 'Madras Medical Mission', specialty: 'Cardiology', address: 'Mogappair', city: 'Chennai', state: 'Tamil Nadu', rating: 4.8, availability: '24/7', distance: '5.5 km' },
    { id: 'tn3', name: 'MIOT International', specialty: 'Orthopedics & Trauma', address: 'Manapakkam', city: 'Chennai', state: 'Tamil Nadu', rating: 4.7, availability: '24/7', distance: '8.2 km', isEmergency: true },
    { id: 'tn4', name: 'Ganga Hospital', specialty: 'Orthopedics', address: 'Mettupalayam Road', city: 'Coimbatore', state: 'Tamil Nadu', rating: 4.9, availability: '24/7', distance: '1.5 km' },
    { id: 'tn5', name: 'Christian Medical College (CMC)', specialty: 'Multi-specialty', address: 'Ida Scudder Road', city: 'Vellore', state: 'Tamil Nadu', rating: 4.9, availability: '24/7', distance: '0.5 km', isEmergency: true },

    // Telangana
    { id: 'tg1', name: 'Yashoda Hospitals', specialty: 'Multi-specialty', address: 'Secunderabad', city: 'Hyderabad', state: 'Telangana', rating: 4.8, availability: '24/7', distance: '1.2 km', isEmergency: true },
    { id: 'tg2', name: 'Apollo Health City', specialty: 'Multi-specialty', address: 'Jubilee Hills', city: 'Hyderabad', state: 'Telangana', rating: 4.8, availability: '24/7', distance: '4.5 km', isEmergency: true },
    { id: 'tg3', name: 'CARE Hospitals', specialty: 'Cardiology', address: 'Banjara Hills', city: 'Hyderabad', state: 'Telangana', rating: 4.7, availability: '24/7', distance: '3.2 km' },
    { id: 'tg4', name: 'KIMS Hospitals', specialty: 'Neurology', address: 'Begumpet', city: 'Hyderabad', state: 'Telangana', rating: 4.7, availability: '24/7', distance: '2.1 km' },

    // West Bengal
    { id: 'wb1', name: 'Apollo Multispecialty Hospitals', specialty: 'Multi-specialty', address: 'Canal Circular Road', city: 'Kolkata', state: 'West Bengal', rating: 4.7, availability: '24/7', distance: '3.5 km' },
    { id: 'wb2', name: 'AMRI Hospitals', specialty: 'General & Emergency', address: 'Dhakuria', city: 'Kolkata', state: 'West Bengal', rating: 4.6, availability: '24/7', distance: '2.2 km', isEmergency: true },
    { id: 'wb3', name: 'Tata Medical Center', specialty: 'Oncology', address: 'New Town', city: 'Kolkata', state: 'West Bengal', rating: 4.9, availability: 'By Appointment', distance: '10.5 km' },

    // Uttar Pradesh
    { id: 'up1', name: 'Sanjay Gandhi Post Graduate Institute', specialty: 'Multi-specialty', address: 'Raebareli Road', city: 'Lucknow', state: 'Uttar Pradesh', rating: 4.8, availability: '24/7', distance: '1.5 km', isEmergency: true },
    { id: 'up2', name: 'Fortis Hospital', specialty: 'Multi-specialty', address: 'Sector 62', city: 'Noida', state: 'Uttar Pradesh', rating: 4.6, availability: '24/7', distance: '5.0 km' },
    { id: 'up3', name: 'Medanta - Lucknow', specialty: 'Multi-specialty', address: 'Amar Shaheed Path', city: 'Lucknow', state: 'Uttar Pradesh', rating: 4.8, availability: '24/7', distance: '8.2 km' },

    // Rajasthan
    { id: 'rj1', name: 'SMS Hospital', specialty: 'General Medicine', address: 'Jawahar Lal Nehru Marg', city: 'Jaipur', state: 'Rajasthan', rating: 4.2, availability: '24/7', distance: '0.8 km', isEmergency: true },
    { id: 'rj2', name: 'Fortis Escorts', specialty: 'Cardiac', address: 'Malviya Nagar', city: 'Jaipur', state: 'Rajasthan', rating: 4.7, availability: '24/7', distance: '4.5 km', isEmergency: true },

    // Gujarat
    { id: 'gj1', name: 'Zydus Hospital', specialty: 'Multi-specialty', address: 'Sola', city: 'Ahmedabad', state: 'Gujarat', rating: 4.8, availability: '24/7', distance: '2.5 km', isEmergency: true },
    { id: 'gj2', name: 'Apollo Hospitals', specialty: 'Multi-specialty', address: 'Ghandhinagar Highway', city: 'Ahmedabad', state: 'Gujarat', rating: 4.7, availability: '24/7', distance: '10.2 km' }
];
