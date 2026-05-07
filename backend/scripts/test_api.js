
async function testAPI() {
    try {
        const res = await fetch('http://localhost:5000/api/hospitals/search?limit=5');
        const data = await res.json();
        console.log('Success:', JSON.stringify(data, null, 2));
    } catch (err) {
        console.error('Error:', err.message);
    }
}
testAPI();
