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

async function verifyAndShowChanges() {
  try {
    // Fetch the article
    const post = await adminAPI.posts.read({slug: 'ai-thinks-less-when-it-should-think-more'}, {formats: ['html']});
    
    console.log('Article Title:', post.title);
    console.log('URL:', post.url);
    console.log('Last Updated:', post.updated_at);
    
    // Show current state
    const currentH1s = (post.html.match(/<h1(\s[^>]*)?>/gi) || []).length;
    const currentH2s = (post.html.match(/<h2(\s[^>]*)?>/gi) || []).length;
    
    console.log('\n=== CURRENT STATE ===');
    console.log(`H1 tags: ${currentH1s}`);
    console.log(`H2 tags: ${currentH2s}`);
    
    // Apply the fix to show what it would look like
    const { fixedHtml, changesCount } = fixH1Tags(post.html);
    const fixedH1s = (fixedHtml.match(/<h1(\s[^>]*)?>/gi) || []).length;
    const fixedH2s = (fixedHtml.match(/<h2(\s[^>]*)?>/gi) || []).length;
    
    console.log('\n=== AFTER FIX (PREVIEW) ===');
    console.log(`H1 tags: ${fixedH1s} (would be after fix)`);
    console.log(`H2 tags: ${fixedH2s} (would be after fix)`);
    console.log(`Changes that would be made: ${changesCount} H1s to H2s`);
    
    // Show the first few headings from both versions
    console.log('\n=== HEADING COMPARISON ===');
    
    // Extract headings from current HTML
    const headingRegex = /<(h[12])(\s[^>]*)?>(.*?)<\/\1>/gi;
    let match;
    let headings = [];
    
    while ((match = headingRegex.exec(post.html)) !== null && headings.length < 10) {
      headings.push({
        tag: match[1].toUpperCase(),
        content: match[3].replace(/<[^>]+>/g, '').trim()
      });
    }
    
    console.log('\nFirst 10 headings in the article:');
    headings.forEach((h, i) => {
      console.log(`${i + 1}. [${h.tag}] ${h.content}`);
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

verifyAndShowChanges();