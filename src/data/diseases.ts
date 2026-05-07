export interface DiseasePattern {
    id: string;
    name: string;
    description: string;
    primarySymptoms: string[]; // High weight matches
    secondarySymptoms: string[]; // Medium weight matches
    riskLevel: 'low' | 'moderate' | 'high' | 'emergency';
}

export const DISEASE_DATASET: DiseasePattern[] = [
    {
        id: 'cardiac-event',
        name: 'Potential Cardiac Event',
        description: 'Symptoms suggesting significant heart distress or possible myocardial infarction.',
        primarySymptoms: ['chest pain', 'chest pressure', 'crushing sensation'],
        secondarySymptoms: ['breathless', 'left arm pain', 'sweating', 'nausea', 'jaw pain'],
        riskLevel: 'emergency'
    },
    {
        id: 'stroke',
        name: 'Potential Neurological Event (Stroke)',
        description: 'Sudden onset neurological deficits indicating a possible stroke.',
        primarySymptoms: ['slurred speech', 'facial droop', 'one sided weakness', 'arm weakness'],
        secondarySymptoms: ['vision loss', 'sudden headache', 'confusion', 'balance loss'],
        riskLevel: 'emergency'
    },
    {
        id: 'anaphylaxis',
        name: 'Severe Allergic Reaction (Anaphylaxis)',
        description: 'Systemic allergic response affecting breathing and circulation.',
        primarySymptoms: ['throat swelling', 'difficulty breathing', 'tongue swelling'],
        secondarySymptoms: ['severe hives', 'itching', 'rapid pulse', 'dizziness'],
        riskLevel: 'emergency'
    },
    {
        id: 'respiratory-distress',
        name: 'Severe Respiratory Distress',
        description: 'Acute failure of the respiratory system or severe airway obstruction.',
        primarySymptoms: ['cannot breathe', 'gasping', 'blue lips', 'stridor'],
        secondarySymptoms: ['wheezing', 'chest tightness', 'cough', 'panic'],
        riskLevel: 'emergency'
    },
    {
        id: 'sepsis',
        name: 'Potential Systemic Infection (Sepsis)',
        description: 'Body-wide inflammatory response to a severe infection.',
        primarySymptoms: ['extreme shivering', 'mottled skin', 'extreme pain'],
        secondarySymptoms: ['high fever', 'confusion', 'no urine', 'lethargy'],
        riskLevel: 'high'
    },
    {
        id: 'gastroenteritis',
        name: 'Gastrointestinal Distress',
        description: 'Inflammation of the stomach and intestines.',
        primarySymptoms: ['severe vomiting', 'prolonged diarrhea'],
        secondarySymptoms: ['stomach pain', 'cramps', 'low fever', 'dehydration'],
        riskLevel: 'moderate'
    },
    {
        id: 'typhoid',
        name: 'Typhoid Fever',
        description: 'Bacterial infection characterized by prolonged high fever and abdominal distress.',
        primarySymptoms: ['fever', 'abdominal pain', 'headache'],
        secondarySymptoms: ['fatigue', 'loss of appetite', 'body pain', 'nausea'],
        riskLevel: 'high'
    },
    {
        id: 'malaria',
        name: 'Malaria',
        description: 'Parasitic infection marked by cyclical fevers, chills, and sweating.',
        primarySymptoms: ['fever', 'chills', 'sweating'],
        secondarySymptoms: ['body pain', 'vomiting', 'nausea', 'headache'],
        riskLevel: 'high'
    },
    {
        id: 'pneumonia',
        name: 'Pneumonia',
        description: 'Infection that inflames air sacs in one or both lungs, leading to difficulty breathing.',
        primarySymptoms: ['cough', 'rapid breathing', 'difficulty breathing'],
        secondarySymptoms: ['fever', 'fatigue', 'chills', 'sweating'],
        riskLevel: 'high'
    },
    {
        id: 'flu-like-illness',
        name: 'Influenza-like Illness',
        description: 'General viral symptoms affecting the whole body.',
        primarySymptoms: ['fever', 'body ache'],
        secondarySymptoms: ['cough', 'fatigue', 'headache', 'chills'],
        riskLevel: 'moderate'
    },
    {
        id: 'common-cold',
        name: 'Common Cold / Mild Viral',
        description: 'Mild upper respiratory infection.',
        primarySymptoms: ['sneezing', 'runny nose'],
        secondarySymptoms: ['mild cough', 'sore throat', 'low fever', 'congestion'],
        riskLevel: 'low'
    }
];
