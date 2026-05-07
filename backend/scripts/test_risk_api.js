const fetch = require('node-fetch');

async function testRiskAPI() {
    try {
        console.log('🧪 Testing Risk Analysis API...\n');

        const testCases = [
            { symptoms: 'fever and headache', ageGroup: 'adult', expected: 'moderate' },
            { symptoms: 'chest pain and difficulty breathing', ageGroup: 'geriatric', expected: 'emergency' },
            { symptoms: 'mild cough', ageGroup: 'pediatric', expected: 'low' },
        ];

        for (const testCase of testCases) {
            console.log(`Test: "${testCase.symptoms}" (${testCase.ageGroup})`);

            const response = await fetch('http://localhost:5000/api/risk/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(testCase)
            });

            const result = await response.json();

            console.log(`  Risk Level: ${result.riskLevel}`);
            console.log(`  Pathway: ${result.pathway}`);
            console.log(`  Matched Diseases: ${result.suspectedConditions.length}`);
            if (result.suspectedConditions.length > 0) {
                console.log(`    → ${result.suspectedConditions[0].name}`);
            }
            console.log('');
        }

        console.log('✅ All tests completed!');
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

testRiskAPI();
