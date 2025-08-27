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
            return match; // Keep the first H1
        } else {
            return `<h2${attributes || ''}>${content}</h2>`; // Convert to H2
        }
    });
    
    return {
        fixedHtml,
        changesCount: h1Count > 1 ? h1Count - 1 : 0
    };
}

async function updateArticleHTML() {
    const slug = 'ai-thinks-less-when-it-should-think-more';
    
    try {
        console.log(`Fetching article: ${slug}\n`);
        
        // Read the post - need to specify we want it with formats
        const post = await adminAPI.posts.read({slug: slug}, {
            formats: ['html', 'mobiledoc', 'lexical']
        });
        
        console.log('Article:', post.title);
        console.log('Current H1 count:', (post.html.match(/<h1(\s[^>]*)?>/gi) || []).length);
        console.log('Current H2 count:', (post.html.match(/<h2(\s[^>]*)?>/gi) || []).length);
        console.log('Has mobiledoc:', !!post.mobiledoc);
        console.log('Has lexical:', !!post.lexical);
        
        // Fix H1 tags
        const { fixedHtml, changesCount } = fixH1Tags(post.html);
        
        if (changesCount === 0) {
            console.log('\nNo H1 tags to convert');
            return;
        }
        
        console.log(`\nWill convert ${changesCount} H1 tags to H2`);
        
        // For Ghost Admin API, when updating HTML, we need to use the source parameter
        console.log('\nUpdating article...');
        
        // Important: Must include source: 'html' when updating HTML content
        const updatedPost = await adminAPI.posts.edit({
            id: post.id,
            html: fixedHtml
        }, {
            source: 'html'  // This tells Ghost to regenerate mobiledoc/lexical from HTML
        });
        
        console.log('Update completed');
        console.log('New updated_at:', updatedPost.updated_at);
        
        // Verify the update
        console.log('\nVerifying changes...');
        const verifyPost = await adminAPI.posts.read({id: post.id}, {formats: ['html']});
        
        const newH1Count = (verifyPost.html.match(/<h1(\s[^>]*)?>/gi) || []).length;
        const newH2Count = (verifyPost.html.match(/<h2(\s[^>]*)?>/gi) || []).length;
        
        console.log('Final H1 count:', newH1Count);
        console.log('Final H2 count:', newH2Count);
        
        if (newH1Count === 1 && newH2Count > post.html.match(/<h2(\s[^>]*)?>/gi).length) {
            console.log('\n✅ SUCCESS! H1 tags have been converted to H2 tags');
            
            // Show the first few headings
            const headings = verifyPost.html.match(/<h[12][^>]*>.*?<\/h[12]>/gi);
            if (headings) {
                console.log('\nFirst 5 headings in the article:');
                headings.slice(0, 5).forEach((h, i) => {
                    const tag = h.match(/<(h[12])/i)[1].toUpperCase();
                    const content = h.replace(/<[^>]+>/g, '').trim();
                    console.log(`${i + 1}. [${tag}] ${content.substring(0, 60)}${content.length > 60 ? '...' : ''}`);
                });
            }
        } else {
            console.log('\n❌ Update may not have worked as expected');
        }
        
    } catch (error) {
        console.error('\nError:', error.message);
        if (error.response && error.response.data) {
            console.error('Response:', JSON.stringify(error.response.data, null, 2));
        }
        if (error.context) {
            console.error('Context:', error.context);
        }
    }
}

console.log('Attempting to fix H1 tags with proper source parameter...\n');
updateArticleHTML();