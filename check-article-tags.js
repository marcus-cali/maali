const GhostAdminAPI = require('@tryghost/admin-api');

const adminAPI = new GhostAdminAPI({
  url: 'https://implicator-ai.ghost.io',
  key: '685c83699aff68000115868b:f9720fe4ff8f92f315331521eb993ca5ddb38f083ba3969a4b938a134ff0484e',
  version: "v5.0"
});

async function checkArticleTags() {
    const slug = 'ai-thinks-less-when-it-should-think-more';
    
    try {
        const post = await adminAPI.posts.read({slug: slug});
        
        console.log('Article:', post.title);
        console.log('\nTags:');
        if (post.tags && post.tags.length > 0) {
            post.tags.forEach(tag => {
                console.log(`- ${tag.name} (slug: ${tag.slug})`);
            });
        } else {
            console.log('No tags found');
        }
        
        // Check another article
        console.log('\n\nChecking another article...');
        const post2 = await adminAPI.posts.read({slug: 'stanford-study-finds-metas-ai-memorized-nearly-half-of-harry-potter'});
        console.log('Article:', post2.title);
        console.log('\nTags:');
        if (post2.tags && post2.tags.length > 0) {
            post2.tags.forEach(tag => {
                console.log(`- ${tag.name} (slug: ${tag.slug})`);
            });
        } else {
            console.log('No tags found');
        }
        
    } catch (error) {
        console.error('Error:', error.message);
    }
}

checkArticleTags();