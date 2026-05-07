async function test() {
    const scenarios = [
        { s: 'I have a minor cough', a: 'adult' },
        { s: 'I have fever, cough, and a bad headache', a: 'adult' },
        { s: 'chest pain cannot breathe', a: 'adult' },
        { s: 'I have a very sore throat and earache', a: 'adult' }
    ];
    for (const sc of scenarios) {
        const r = await fetch('http://localhost:5000/api/risk/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ symptoms: sc.s, ageGroup: sc.a })
        });
        const d = await r.json();
        console.log(`Input: ${sc.s} | Risk: ${d.riskLevel} | Score: ${d.debug?.score} | Matches: ${d.debug?.matches}`);
    }
}
test();
