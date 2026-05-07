async function runTests() {
    const tests = [
        { s: "cough", a: "adult" },
        { s: "chest pain unable to breathe", a: "adult" },
        { s: "fever headache", a: "adult" },
        { s: "cough", a: "pediatric" }
    ];

    for (const t of tests) {
        try {
            const res = await fetch('http://localhost:5000/api/risk/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ symptoms: t.s, ageGroup: t.a })
            });
            const data = await res.json();
            console.log(`${t.s} (${t.a}) -> ${data.riskLevel}`);
        } catch (e) {
            console.log(`error: ${e.message}`);
        }
    }
}
runTests();
