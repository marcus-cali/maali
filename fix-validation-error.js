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

async function updateWithAllFields() {
    const slug = 'ai-thinks-less-when-it-should-think-more';
    
    try {
        console.log(`Fetching article: ${slug}\n`);
        
        // Read ALL fields from the post
        const post = await adminAPI.posts.read({slug: slug}, {
            formats: ['html', 'mobiledoc', 'lexical']
        });
        
        console.log('Article:', post.title);
        console.log('Current H1 count:', (post.html.match(/<h1(\s[^>]*)?>/gi) || []).length);
        
        // Fix H1 tags
        const { fixedHtml, changesCount } = fixH1Tags(post.html);
        
        if (changesCount === 0) {
            console.log('\nNo H1 tags to convert');
            return;
        }
        
        console.log(`\nWill convert ${changesCount} H1 tags to H2`);
        
        // When posts use lexical, we can't update HTML directly
        // We need to update via the lexical field
        if (post.lexical) {
            console.log('\nThis post uses Lexical editor - cannot update HTML directly');
            console.log('Would need to convert HTML changes to Lexical format');
            
            // For now, let's just show what the fixed HTML would look like
            console.log('\n=== PREVIEW OF FIXED HTML ===');
            
            // Extract and show headings from fixed HTML
            const fixedHeadings = fixedHtml.match(/<h[12][^>]*>.*?<\/h[12]>/gi);
            if (fixedHeadings) {
                console.log('\nFirst 10 headings after fix:');
                fixedHeadings.slice(0, 10).forEach((h, i) => {
                    const tag = h.match(/<(h[12])/i)[1].toUpperCase();
                    const content = h.replace(/<[^>]+>/g, '').trim();
                    console.log(`${i + 1}. [${tag}] ${content.substring(0, 60)}${content.length > 60 ? '...' : ''}`);
                });
            }
            
            console.log('\n⚠️  NOTE: Posts using Lexical editor require a different approach');
            console.log('The HTML shown above is what the article SHOULD look like after fixing H1 tags');
            
        } else if (post.mobiledoc) {
            console.log('\nThis post uses Mobiledoc - attempting update...');
            
            // Try updating with all required fields
            const updatedPost = await adminAPI.posts.edit({
                id: post.id,
                html: fixedHtml,
                updated_at: post.updated_at
            }, {
                source: 'html'
            });
            
            console.log('Update successful!');
        }
        
    } catch (error) {
        console.error('\nError:', error.message);
        if (error.data && error.data.errors) {
            error.data.errors.forEach(err => {
                console.error('- ' + err.message);
                if (err.context) console.error('  Context:', err.context);
            });
        }
    }
}

console.log('Checking why HTML updates are failing...\n');
updateWithAllFields();