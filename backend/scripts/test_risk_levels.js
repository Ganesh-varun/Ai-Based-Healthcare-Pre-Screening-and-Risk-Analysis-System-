async function runTests() {
    const tests = [
        { symptoms: "I have a cough and a cold", ageGroup: "adult" }, // Should be Low
        { symptoms: "I have a sharp chest pain and cannot breathe", ageGroup: "adult" }, // Should be Emergency
        { symptoms: "I have pneumonia and high fever", ageGroup: "adult" }, // Should be High
        { symptoms: "I have a fever and headache", ageGroup: "adult" }, // Should be Moderate
        { symptoms: "I have a cough", ageGroup: "pediatric" }, // Should be Moderate (Low -> Moderate)
    ];

    for (const test of tests) {
        try {
            console.log(`\n🔍 Testing: "${test.symptoms}" [${test.ageGroup}]`);
            const res = await fetch('http://localhost:5000/api/risk/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(test)
            });
            const data = await res.json();
            console.log(`✅ Result: ${data.riskLevel}`);
        } catch (e) {
            console.error(`❌ Connection failed: ${e.message}`);
        }
    }
}

runTests();
