const tests = [
    { symptoms: "I have a slight fever", ageGroup: "adult" },
    { symptoms: "I have chest pain and I cannot breathe", ageGroup: "adult" },
    { symptoms: "Fever, cough, vomiting and abdominal pain", ageGroup: "pediatric" },
    { symptoms: "cough and sore throat", ageGroup: "adult" }
];

async function runTests() {
    for (const test of tests) {
        try {
            console.log(`\n🔍 Testing: "${test.symptoms}" [${test.ageGroup}]`);
            const res = await fetch('http://localhost:5000/api/risk/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(test)
            });
            const data = await res.json();
            if (res.ok) {
                console.log(`✅ Result: ${data.riskLevel} -> ${data.pathway}`);
                console.log(`📝 Suspected: ${data.suspectedConditions.map(c => c.name).join(', ')}`);
            } else {
                console.log(`❌ Error: ${data.error}`);
            }
        } catch (e) {
            console.error(`❌ Connection failed: ${e.message}`);
        }
    }
}

runTests();
