const GhostAdminAPI = require('@tryghost/admin-api');

const adminAPI = new GhostAdminAPI({
  url: 'https://implicator-ai.ghost.io',
  key: '685c83699aff68000115868b:f9720fe4ff8f92f315331521eb993ca5ddb38f083ba3969a4b938a134ff0484e',
  version: "v5.0"
});

async function testUpdate() {
    const slug = 'ai-thinks-less-when-it-should-think-more';
    
    try {
        // Fetch the post
        const post = await adminAPI.posts.read({slug: slug});
        
        console.log('Current post data:');
        console.log('ID:', post.id);
        console.log('Title:', post.title);
        console.log('Updated at:', post.updated_at);
        console.log('Status:', post.status);
        
        // Try updating just the title to test if updates work at all
        console.log('\nTesting title update...');
        
        const testTitle = post.title + ' (TEST)';
        
        const updated = await adminAPI.posts.edit({
            id: post.id,
            title: testTitle,
            updated_at: post.updated_at
        });
        
        console.log('\nUpdate response:');
        console.log('New title:', updated.title);
        console.log('New updated_at:', updated.updated_at);
        
        // Verify the change
        const verify = await adminAPI.posts.read({id: post.id});
        console.log('\nVerification:');
        console.log('Title after update:', verify.title);
        
        // Revert the title
        if (verify.title === testTitle) {
            console.log('\nReverting title...');
            await adminAPI.posts.edit({
                id: post.id,
                title: post.title,
                updated_at: verify.updated_at
            });
            console.log('Title reverted');
        }
        
    } catch (error) {
        console.error('Error:', error.message);
        if (error.response) {
            console.error('Response:', JSON.stringify(error.response.data, null, 2));
        }
        if (error.context) {
            console.error('Context:', error.context);
        }
    }
}

testUpdate();