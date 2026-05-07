async function testLevels() {
    const scenarios = [
        { name: "LOW (Adult)", s: "i have a minor cough", a: "adult" },
        { name: "MODERATE (Adult)", s: "fever and abdominal pain", a: "adult" },
        { name: "HIGH (Adult)", s: "difficulty breathing and high fever", a: "adult" },
        { name: "EMERGENCY (Adult)", s: "crushing chest pain and heart attack symptoms", a: "adult" },
        { name: "MODERATE (Peds - Escalated)", s: "minor cough", a: "pediatric" }
    ];

    for (const sc of scenarios) {
        try {
            const res = await fetch('http://localhost:5000/api/risk/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ symptoms: sc.s, ageGroup: sc.a })
            });
            const data = await res.json();
            console.log(`[${sc.name}] Result: ${data.riskLevel.toUpperCase()}`);
        } catch (e) {
            console.log(`Error testing ${sc.name}: ${e.message}`);
        }
    }
}
testLevels();
