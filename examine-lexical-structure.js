const GhostAdminAPI = require('@tryghost/admin-api');

const adminAPI = new GhostAdminAPI({
  url: 'https://implicator-ai.ghost.io',
  key: '685c83699aff68000115868b:f9720fe4ff8f92f315331521eb993ca5ddb38f083ba3969a4b938a134ff0484e',
  version: "v5.0"
});

async function examineLexicalStructure() {
    const slug = 'ai-thinks-less-when-it-should-think-more';
    
    try {
        const post = await adminAPI.posts.read({slug: slug});
        
        console.log('Post Title:', post.title);
        console.log('Has lexical:', !!post.lexical);
        
        if (post.lexical) {
            const lexical = JSON.parse(post.lexical);
            console.log('\nLexical structure:');
            console.log('Version:', lexical.version);
            
            // Function to examine nodes
            function examineNode(node, depth = 0) {
                const indent = '  '.repeat(depth);
                console.log(`${indent}Type: ${node.type}`);
                
                if (node.tag) {
                    console.log(`${indent}Tag: ${node.tag}`);
                }
                
                if (node.type === 'heading') {
                    console.log(`${indent}Heading content:`, node.children?.[0]?.text || 'No text');
                }
                
                if (node.type === 'html') {
                    console.log(`${indent}HTML content preview:`, node.html?.substring(0, 100) + '...');
                    // Check for H1s in HTML content
                    const h1Matches = node.html?.match(/<h1[^>]*>/gi) || [];
                    const h2Matches = node.html?.match(/<h2[^>]*>/gi) || [];
                    if (h1Matches.length > 0) {
                        console.log(`${indent}>>> Contains ${h1Matches.length} H1 tags!`);
                    }
                    if (h2Matches.length > 0) {
                        console.log(`${indent}>>> Contains ${h2Matches.length} H2 tags`);
                    }
                }
                
                if (node.children && Array.isArray(node.children)) {
                    node.children.forEach(child => examineNode(child, depth + 1));
                }
            }
            
            console.log('\nExamining root children:');
            if (lexical.root && lexical.root.children) {
                lexical.root.children.slice(0, 10).forEach((node, i) => {
                    console.log(`\n--- Node ${i + 1} ---`);
                    examineNode(node);
                });
            }
        }
        
    } catch (error) {
        console.error('Error:', error.message);
    }
}

examineLexicalStructure();