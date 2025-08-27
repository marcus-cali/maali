const jwt = require('jsonwebtoken');

// Parse the Admin API key
const adminApiKey = '685c83699aff68000115868b:f9720fe4ff8f92f315331521eb993ca5ddb38f083ba3969a4b938a134ff0484e';
const [id, secret] = adminApiKey.split(':');

console.log('Admin API Key ID:', id);
console.log('Secret length:', secret.length);

// Create a test token
const token = jwt.sign({}, Buffer.from(secret, 'hex'), {
    keyid: id,
    algorithm: 'HS256',
    expiresIn: '5m',
    audience: `/admin/`
});

console.log('\nGenerated JWT Token (first 50 chars):', token.substring(0, 50) + '...');

// Test the API
const fetch = require('node-fetch');

async function testAdminAPI() {
    try {
        const response = await fetch('https://implicator.ai/ghost/api/admin/posts/?limit=1', {
            headers: {
                'Authorization': `Ghost ${token}`,
                'Accept-Version': 'v5.0',
                'Content-Type': 'application/json'
            }
        });

        console.log('\nAPI Response Status:', response.status);
        
        if (response.ok) {
            const data = await response.json();
            console.log('API Connection Successful!');
            console.log('Posts found:', data.posts.length);
        } else {
            const error = await response.text();
            console.log('API Error:', error);
        }
    } catch (error) {
        console.error('Connection Error:', error.message);
    }
}

testAdminAPI();