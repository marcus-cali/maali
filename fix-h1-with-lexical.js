const GhostAdminAPI = require('@tryghost/admin-api');

const adminAPI = new GhostAdminAPI({
  url: 'https://implicator-ai.ghost.io',
  key: '685c83699aff68000115868b:f9720fe4ff8f92f315331521eb993ca5ddb38f083ba3969a4b938a134ff0484e',
  version: "v5.0"
});

// Fix H1 tags in Lexical JSON structure
function fixH1TagsInLexical(lexicalStr) {
    const lexical = JSON.parse(lexicalStr);
    let h1Count = 0;
    let changesCount = 0;
    
    // Recursive function to process nodes
    function processNode(node) {
        if (node.type === 'heading' && node.tag === 'h1') {
            h1Count++;
            if (h1Count > 1) {
                // Change h1 to h2 after the first one
                node.tag = 'h2';
                changesCount++;
            }
        }
        
        // Process children if they exist
        if (node.children && Array.isArray(node.children)) {
            node.children.forEach(child => processNode(child));
        }
    }
    
    // Process the root node
    if (lexical.root && lexical.root.children) {
        lexical.root.children.forEach(node => processNode(node));
    }
    
    return {
        fixedLexical: JSON.stringify(lexical),
        changesCount
    };
}

async function fixSingleArticle() {
    const slug = 'ai-thinks-less-when-it-should-think-more';
    
    try {
        console.log(`Fetching article: ${slug}`);
        
        // Fetch the post with formats
        const post = await adminAPI.posts.read({slug: slug}, {formats: ['html']});
        
        console.log(`\nArticle: ${post.title}`);
        console.log(`Has lexical: ${!!post.lexical}`);
        console.log(`Current H1 count in HTML: ${(post.html.match(/<h1(\s[^>]*)?>/gi) || []).length}`);
        
        if (!post.lexical) {
            console.log('This post does not use Lexical editor');
            return;
        }
        
        // Parse and check the lexical content
        const lexicalObj = JSON.parse(post.lexical);
        console.log(`Lexical format version: ${lexicalObj.version}`);
        
        // Count H1s in lexical
        let h1CountBefore = 0;
        function countH1s(node) {
            if (node.type === 'heading' && node.tag === 'h1') {
                h1CountBefore++;
            }
            if (node.children && Array.isArray(node.children)) {
                node.children.forEach(child => countH1s(child));
            }
        }
        if (lexicalObj.root && lexicalObj.root.children) {
            lexicalObj.root.children.forEach(node => countH1s(node));
        }
        console.log(`H1 count in Lexical before: ${h1CountBefore}`);
        
        // Fix H1 tags in lexical
        const { fixedLexical, changesCount } = fixH1TagsInLexical(post.lexical);
        
        if (changesCount === 0) {
            console.log('No H1 tags to convert');
            return;
        }
        
        console.log(`\nWill convert ${changesCount} H1 tags to H2`);
        
        // Update the post with fixed lexical content
        console.log('\nUpdating article...');
        
        const updatedPost = await adminAPI.posts.edit({
            id: post.id,
            lexical: fixedLexical,
            updated_at: post.updated_at
        });
        
        console.log('Update successful!');
        console.log(`Updated at: ${updatedPost.updated_at}`);
        
        // Verify the update
        const verifyPost = await adminAPI.posts.read({id: post.id}, {formats: ['html']});
        console.log(`\nVerification:`);
        console.log(`Final H1 count in HTML: ${(verifyPost.html.match(/<h1(\s[^>]*)?>/gi) || []).length}`);
        console.log(`Final H2 count in HTML: ${(verifyPost.html.match(/<h2(\s[^>]*)?>/gi) || []).length}`);
        
    } catch (error) {
        console.error('\nError:', error.message);
        if (error.response) {
            console.error('Response:', JSON.stringify(error.response.data, null, 2));
        }
    }
}

// Run the fix
console.log('Fixing H1 tags using Lexical format...\n');
fixSingleArticle();