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
        // Handle extended-heading nodes
        if (node.type === 'extended-heading' && node.tag === 'h1') {
            h1Count++;
            if (h1Count > 1) {
                // Change h1 to h2 after the first one
                node.tag = 'h2';
                changesCount++;
            }
        }
        
        // Handle HTML nodes that might contain H1 tags
        if (node.type === 'html' && node.html) {
            let htmlH1Count = 0;
            node.html = node.html.replace(/<h1(\s[^>]*)?>(.*?)<\/h1>/gi, (match, attributes, content) => {
                h1Count++;
                htmlH1Count++;
                if (h1Count > 1) {
                    changesCount++;
                    return `<h2${attributes || ''}>${content}</h2>`;
                }
                return match;
            });
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
        changesCount,
        h1Count
    };
}

// Process a single article
async function processArticle(slug) {
    try {
        // Fetch the post
        const post = await adminAPI.posts.read({slug: slug});
        
        // Skip if no lexical content
        if (!post.lexical) {
            return {
                slug,
                title: post.title,
                skipped: true,
                reason: 'No lexical content'
            };
        }
        
        // Skip Morning Briefing articles - only check if title starts with "Morning Briefing"
        if (post.title && post.title.startsWith('Morning Briefing')) {
            return {
                slug,
                title: post.title,
                skipped: true,
                reason: 'Morning Briefing article'
            };
        }
        
        // Fix H1 tags in lexical
        const { fixedLexical, changesCount, h1Count } = fixH1TagsInLexical(post.lexical);
        
        if (changesCount === 0) {
            return {
                slug,
                title: post.title,
                skipped: true,
                reason: 'No multiple H1 tags found',
                h1Count
            };
        }
        
        // Update the post with fixed lexical content
        await adminAPI.posts.edit({
            id: post.id,
            lexical: fixedLexical,
            updated_at: post.updated_at
        });
        
        return {
            slug,
            title: post.title,
            updated: true,
            changesCount,
            originalH1Count: h1Count
        };
        
    } catch (error) {
        return {
            slug,
            error: error.message
        };
    }
}

// Test with a single article first
async function testSingleArticle() {
    console.log('Testing Lexical H1 fix with proper structure...\n');
    
    const testSlug = 'ai-thinks-less-when-it-should-think-more';
    
    console.log(`Processing: ${testSlug}`);
    const result = await processArticle(testSlug);
    
    if (result.error) {
        console.log(`❌ Error: ${result.error}`);
    } else if (result.skipped) {
        console.log(`⏭️  Skipped: ${result.reason}`);
        if (result.h1Count !== undefined) {
            console.log(`   H1 count found: ${result.h1Count}`);
        }
    } else if (result.updated) {
        console.log(`✅ Updated successfully!`);
        console.log(`   Title: ${result.title}`);
        console.log(`   Original H1 count: ${result.originalH1Count}`);
        console.log(`   Converted to H2: ${result.changesCount}`);
        
        // Verify the update
        console.log('\nVerifying update...');
        const verifyPost = await adminAPI.posts.read({slug: testSlug}, {formats: ['html']});
        const newH1Count = (verifyPost.html.match(/<h1(\s[^>]*)?>/gi) || []).length;
        const newH2Count = (verifyPost.html.match(/<h2(\s[^>]*)?>/gi) || []).length;
        
        console.log(`Final H1 count in HTML: ${newH1Count}`);
        console.log(`Final H2 count in HTML: ${newH2Count}`);
        
        if (newH1Count === 1) {
            console.log('\n🎉 SUCCESS! The article now has only 1 H1 tag!');
            
            // Show the heading structure
            const headingRegex = /<(h[12])(\s[^>]*)?>(.*?)<\/\1>/gi;
            let match;
            let headings = [];
            
            while ((match = headingRegex.exec(verifyPost.html)) !== null && headings.length < 10) {
                headings.push({
                    tag: match[1].toUpperCase(),
                    content: match[3].replace(/<[^>]+>/g, '').trim()
                });
            }
            
            console.log('\nNew heading structure:');
            headings.forEach((h, i) => {
                const indent = h.tag === 'H1' ? '' : '  ';
                console.log(`${indent}[${h.tag}] ${h.content.substring(0, 60)}${h.content.length > 60 ? '...' : ''}`);
            });
        }
    }
}

// Run the test
testSingleArticle().catch(console.error);