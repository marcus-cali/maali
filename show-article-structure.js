const GhostAdminAPI = require('@tryghost/admin-api');

const adminAPI = new GhostAdminAPI({
  url: 'https://implicator-ai.ghost.io',
  key: '685c83699aff68000115868b:f9720fe4ff8f92f315331521eb993ca5ddb38f083ba3969a4b938a134ff0484e',
  version: "v5.0"
});

async function showArticleStructure() {
    const slug = 'ai-thinks-less-when-it-should-think-more';
    
    try {
        // Fetch the article
        const post = await adminAPI.posts.read({slug: slug}, {formats: ['html']});
        
        console.log('=== ARTICLE STRUCTURE ===\n');
        console.log('Title:', post.title);
        console.log('URL:', post.url);
        console.log('\n--- CURRENT STRUCTURE (Multiple H1s) ---\n');
        
        // Extract all headings with their content
        const headingRegex = /<(h[123])(\s[^>]*)?>(.*?)<\/\1>/gi;
        let match;
        let headings = [];
        
        while ((match = headingRegex.exec(post.html)) !== null) {
            headings.push({
                level: match[1].toUpperCase(),
                content: match[3].replace(/<[^>]+>/g, '').trim()
            });
        }
        
        // Show heading structure
        headings.forEach((h, i) => {
            const indent = h.level === 'H1' ? '' : (h.level === 'H2' ? '  ' : '    ');
            console.log(`${indent}${h.level}: ${h.content}`);
        });
        
        console.log('\n--- ISSUE ---');
        console.log('This article has 5 H1 tags, but should only have 1 (the main title).');
        console.log('The other H1s should be H2s to create proper content hierarchy.');
        
        console.log('\n--- WHAT IT SHOULD LOOK LIKE ---\n');
        console.log('H1: Apple study: Smart AI models get dumber when they need to think harder');
        console.log('  H2: The algorithm paradox');
        console.log('  H2: Reasoning effort drops when needed most');
        console.log('  H2: Why this matters:');
        console.log('  H2: AI Image of the Day');
        console.log('  H2: 💰Meta\'s $10B Reality Check: AI Needs Better Data');
        console.log('    H3: The money chase heats up');
        console.log('    H3: Why this matters:');
        console.log('  H2: AI & Tech News');
        console.log('  H2: 🚀 AI Profiles: The Companies Defining Tomorrow');
        
        console.log('\n--- NOTE ---');
        console.log('The articles use Ghost\'s Lexical editor, which requires special handling');
        console.log('to update content structure. Direct HTML updates won\'t work.');
        
    } catch (error) {
        console.error('Error:', error.message);
    }
}

showArticleStructure();