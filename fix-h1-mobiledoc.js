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

// Convert HTML to mobiledoc format
function htmlToMobiledoc(html) {
    // Ghost uses mobiledoc format with HTML cards
    const mobiledoc = {
        version: "0.3.1",
        atoms: [],
        cards: [
            ["html", {
                "html": html
            }]
        ],
        markups: [],
        sections: [[10, 0]]
    };
    
    return JSON.stringify(mobiledoc);
}

async function fixArticleWithMobiledoc() {
    const slug = 'ai-thinks-less-when-it-should-think-more';
    
    try {
        console.log(`Fetching article: ${slug}`);
        
        // Fetch the post
        const post = await adminAPI.posts.read({slug: slug}, {formats: ['html', 'mobiledoc']});
        
        console.log(`\nArticle: ${post.title}`);
        console.log(`Has mobiledoc: ${!!post.mobiledoc}`);
        console.log(`Has lexical: ${!!post.lexical}`);
        console.log(`Current H1 count: ${(post.html.match(/<h1(\s[^>]*)?>/gi) || []).length}`);
        console.log(`Current H2 count: ${(post.html.match(/<h2(\s[^>]*)?>/gi) || []).length}`);
        
        // Skip Morning Briefing
        if (post.title && post.title.toLowerCase().includes('morning briefing')) {
            console.log('Skipping Morning Briefing article');
            return;
        }
        
        // Fix H1 tags in HTML
        const { fixedHtml, changesCount } = fixH1Tags(post.html);
        
        if (changesCount === 0) {
            console.log('No H1 tags to convert');
            return;
        }
        
        console.log(`\nWill convert ${changesCount} H1 tags to H2`);
        
        // Convert fixed HTML to mobiledoc
        const mobiledoc = htmlToMobiledoc(fixedHtml);
        
        // Update the post
        console.log('\nUpdating article with mobiledoc...');
        
        const updatedPost = await adminAPI.posts.edit({
            id: post.id,
            mobiledoc: mobiledoc,
            updated_at: post.updated_at
        });
        
        console.log('Update successful!');
        console.log(`Updated at: ${updatedPost.updated_at}`);
        
        // Verify the update
        console.log('\nVerifying update...');
        const verifyPost = await adminAPI.posts.read({id: post.id}, {formats: ['html']});
        console.log(`Final H1 count: ${(verifyPost.html.match(/<h1(\s[^>]*)?>/gi) || []).length}`);
        console.log(`Final H2 count: ${(verifyPost.html.match(/<h2(\s[^>]*)?>/gi) || []).length}`);
        
        // Show first few headings
        const headings = verifyPost.html.match(/<h[12][^>]*>.*?<\/h[12]>/gi);
        if (headings) {
            console.log('\nFirst 5 headings:');
            headings.slice(0, 5).forEach((h, i) => {
                const tag = h.match(/<(h[12])/i)[1].toUpperCase();
                const content = h.replace(/<[^>]+>/g, '').trim();
                console.log(`${i + 1}. [${tag}] ${content}`);
            });
        }
        
    } catch (error) {
        console.error('\nError:', error.message);
        if (error.response) {
            console.error('Response:', JSON.stringify(error.response.data, null, 2));
        }
    }
}

// Run the fix
console.log('Fixing H1 tags using mobiledoc format...\n');
fixArticleWithMobiledoc();