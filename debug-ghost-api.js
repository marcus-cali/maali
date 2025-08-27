const GhostAdminAPI = require('@tryghost/admin-api');

const adminAPI = new GhostAdminAPI({
  url: 'https://implicator-ai.ghost.io',
  key: '685c83699aff68000115868b:f9720fe4ff8f92f315331521eb993ca5ddb38f083ba3969a4b938a134ff0484e',
  version: "v5.0"
});

async function debugGhostAPI() {
    const slug = 'ai-thinks-less-when-it-should-think-more';
    
    try {
        // Fetch with all formats to see what's available
        const post = await adminAPI.posts.read({slug: slug});
        
        console.log('Post fields available:');
        console.log(Object.keys(post));
        
        console.log('\nChecking mobiledoc:');
        if (post.mobiledoc) {
            console.log('Has mobiledoc:', !!post.mobiledoc);
            console.log('Mobiledoc type:', typeof post.mobiledoc);
            if (typeof post.mobiledoc === 'string') {
                const mobiledocObj = JSON.parse(post.mobiledoc);
                console.log('Mobiledoc version:', mobiledocObj.version);
            }
        }
        
        console.log('\nChecking lexical:');
        console.log('Has lexical:', !!post.lexical);
        
        console.log('\nPost status:', post.status);
        console.log('Post visibility:', post.visibility);
        
        // Try a minimal update with just the ID
        console.log('\n\nAttempting minimal update...');
        const testUpdate = await adminAPI.posts.edit({
            id: post.id,
            updated_at: post.updated_at
        });
        
        console.log('Minimal update successful');
        console.log('New updated_at:', testUpdate.updated_at);
        
    } catch (error) {
        console.error('Error:', error.message);
        if (error.response && error.response.data) {
            console.error('Response data:', JSON.stringify(error.response.data, null, 2));
        }
    }
}

debugGhostAPI();