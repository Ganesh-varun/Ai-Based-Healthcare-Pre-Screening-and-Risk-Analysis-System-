
async function testFetch() {
    try {
        const response = await fetch('http://127.0.0.1:5000/api/risk/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                symptoms: 'fever and cough',
                ageGroup: 'adult'
            })
        });
        const data = await response.json();
        console.log('Success:', data);
    } catch (error) {
        console.error('Fetch failed:', error);
    }
}

testFetch();
