const GhostAdminAPI = require('@tryghost/admin-api');

const adminAPI = new GhostAdminAPI({
  url: 'https://implicator-ai.ghost.io',
  key: '685c83699aff68000115868b:f9720fe4ff8f92f315331521eb993ca5ddb38f083ba3969a4b938a134ff0484e',
  version: "v5.0"
});

// Fix H1 tags in HTML content
function fixH1Tags(html) {
    let h1Count = 0;
    const fixedHtml = html.replace(/<h1(\s[^>]*)?>(.*?)<\/h1>/gi, (match, attributes, content) => {
        h1Count++;
        if (h1Count === 1) {
            // Keep the first H1 as is
            return match;
        } else {
            // Convert subsequent H1s to H2s
            return `<h2${attributes || ''}>${content}</h2>`;
        }
    });
    
    return {
        fixedHtml,
        changesCount: h1Count > 1 ? h1Count - 1 : 0
    };
}

// Test with one specific article first
async function updateSingleArticle() {
    const slug = 'ai-thinks-less-when-it-should-think-more';
    
    try {
        console.log(`Fetching article: ${slug}`);
        
        // Fetch the full post data
        const post = await adminAPI.posts.read({slug: slug}, {formats: ['html', 'mobiledoc']});
        
        console.log(`\nOriginal article:`);
        console.log(`Title: ${post.title}`);
        console.log(`Current H1 count: ${(post.html.match(/<h1(\s[^>]*)?>/gi) || []).length}`);
        console.log(`Current H2 count: ${(post.html.match(/<h2(\s[^>]*)?>/gi) || []).length}`);
        
        // Skip Morning Briefing articles
        if (post.title && post.title.toLowerCase().includes('morning briefing')) {
            console.log('Skipping Morning Briefing article');
            return;
        }
        
        // Fix H1 tags
        const { fixedHtml, changesCount } = fixH1Tags(post.html);
        
        if (changesCount === 0) {
            console.log('No multiple H1 tags found');
            return;
        }
        
        console.log(`\nWill convert ${changesCount} H1 tags to H2`);
        console.log(`After fix - H1 count: ${(fixedHtml.match(/<h1(\s[^>]*)?>/gi) || []).length}`);
        console.log(`After fix - H2 count: ${(fixedHtml.match(/<h2(\s[^>]*)?>/gi) || []).length}`);
        
        // Update the post - use the update method with proper structure
        console.log('\nUpdating article...');
        
        const updatedPost = await adminAPI.posts.edit({
            id: post.id,
            html: fixedHtml,
            updated_at: post.updated_at // Include the current updated_at timestamp
        });
        
        console.log('\nUpdate successful!');
        console.log(`Updated at: ${updatedPost.updated_at}`);
        
        // Verify the update
        const verifyPost = await adminAPI.posts.read({id: post.id}, {formats: ['html']});
        console.log(`\nVerification:`);
        console.log(`Final H1 count: ${(verifyPost.html.match(/<h1(\s[^>]*)?>/gi) || []).length}`);
        console.log(`Final H2 count: ${(verifyPost.html.match(/<h2(\s[^>]*)?>/gi) || []).length}`);
        
    } catch (error) {
        console.error('\nError:', error.message);
        if (error.response) {
            console.error('Response:', error.response.data);
        }
    }
}

// Run the test
console.log('Testing H1 tag fix on a single article...\n');
updateSingleArticle();