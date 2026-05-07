import { DISEASE_DATASET, DiseasePattern } from '@/data/diseases';

export type AgeGroup = 'pediatric' | 'adult' | 'geriatric';
export type RiskLevel = 'low' | 'moderate' | 'high' | 'emergency';

export interface TriageResult {
    ageGroup: AgeGroup;
    riskLevel: RiskLevel;
    pathway: string;
    score: number;
    suspectedConditions: DiseasePattern[];
    analysisNotes?: string;
}

export interface Symptom {
    id: string;
    name: string;
    weight: number;
}

export function getAgeGroup(age: number): AgeGroup {
    if (age < 14) return 'pediatric';
    if (age <= 50) return 'adult';
    return 'geriatric';
}

export const SYMPTOM_KEYWORDS: Record<string, number> = {
    // Emergency / High Risk
    'chest pain': 12,
    'difficulty breathing': 12,
    'breathless': 12,
    'rapid breathing': 10,
    'rapid_breathing': 10,
    'unconscious': 15,
    'severe bleeding': 12,
    'seizure': 12,
    'stroke': 15,
    'poison': 10,
    'suicidal': 15,
    'emergency': 15,
    'critical': 15,

    // Moderate / High
    'fever': 6,
    'high fever': 9,
    'chills': 7,
    'severe pain': 7,
    'body pain': 6,
    'body_pain': 6,
    'loss of appetite': 5,
    'loss_of_appetite': 5,
    'abdominal pain': 6,
    'abdominal_pain': 6,
    'vomiting': 5,
    'dehydration': 6,
    'sweating': 6,
    'dizziness': 5,
    'fainting': 10,
    'joint pain': 5,
    'joint_pain': 5,
    'stomach pain': 5,
    'stomach_pain': 5,

    // Low / Moderate
    'cough': 3,
    'cold': 2,
    'headache': 3,
    'sore throat': 4,
    'sore_throat': 4,
    'rash': 4,
    'skin rash': 4,
    'skin_rash': 4,
    'skin eruptions': 5,
    'skin_eruptions': 5,
    'itching': 3,
    'fatigue': 4,
    'diarrhea': 4,
    'nausea': 4,
    'acidity': 3,
    'burning sensation': 4,
    'burning_sensation': 4,
    'ulcers': 5,
};

export function analyzeSymptoms(input: string): Symptom[] {
    const text = input.toLowerCase();
    const found: Symptom[] = [];

    Object.entries(SYMPTOM_KEYWORDS).forEach(([keyword, weight]) => {
        if (text.includes(keyword)) {
            found.push({
                id: `manual-${keyword}`,
                name: keyword,
                weight: weight
            });
        }
    });

    // Fallback if no keywords found but text is provided
    if (found.length === 0 && input.trim().length > 5) {
        found.push({ id: 'manual-generic', name: 'Other symptoms', weight: 3 });
    }

    return found;
}

export function calculateRisk(symptoms: Symptom[], ageGroup: AgeGroup): TriageResult {
    const rawScore = symptoms.reduce((acc, curr) => acc + curr.weight, 0);
    const textSymptoms = symptoms.map(s => s.name.toLowerCase());

    const suspectedConditions: DiseasePattern[] = [];
    let patternBonus = 0;

    // Pattern Matching Logic
    DISEASE_DATASET.forEach(disease => {
        const primaryMatchCount = disease.primarySymptoms.filter(s => textSymptoms.includes(s.toLowerCase())).length;
        const secondaryMatchCount = disease.secondarySymptoms.filter(s => textSymptoms.includes(s.toLowerCase())).length;

        const primaryScore = (primaryMatchCount / disease.primarySymptoms.length) * 100;
        const totalMatches = primaryMatchCount + secondaryMatchCount;

        // If strong primary match or good overall match
        if (primaryScore > 60 || (primaryMatchCount >= 1 && totalMatches >= 3)) {
            suspectedConditions.push(disease);

            // Add hazard bonus for matching emergency patterns
            if (disease.riskLevel === 'emergency') patternBonus += 12;
            if (disease.riskLevel === 'high') patternBonus += 6;
        }
    });

    let score = rawScore + patternBonus;

    // Age-based modifiers
    if (ageGroup === 'pediatric' || ageGroup === 'geriatric') {
        score *= 1.35; // Increased sensitivity for vulnerable groups
    }

    let riskLevel: RiskLevel = 'low';
    let pathway = 'OPD / Home Care';

    if (score >= 20 || suspectedConditions.some(d => d.riskLevel === 'emergency')) {
        riskLevel = 'emergency';
        pathway = 'EMERGENCY - Call for Help Immediately';
    } else if (score >= 12 || suspectedConditions.some(d => d.riskLevel === 'high')) {
        riskLevel = 'high';
        pathway = 'Urgent Care / Specialist Referral';
    } else if (score >= 6) {
        riskLevel = 'moderate';
        pathway = 'General Practitioner Visit';
    }

    return {
        ageGroup,
        riskLevel,
        pathway,
        score: Math.min(score, 100),
        suspectedConditions,
        analysisNotes: suspectedConditions.length > 0
            ? `Identified patterns consistent with ${suspectedConditions[0].name}.`
            : undefined
    };
}
