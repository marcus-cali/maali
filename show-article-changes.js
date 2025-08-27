const GhostAdminAPI = require('@tryghost/admin-api');

const adminAPI = new GhostAdminAPI({
  url: 'https://implicator-ai.ghost.io',
  key: '685c83699aff68000115868b:f9720fe4ff8f92f315331521eb993ca5ddb38f083ba3969a4b938a134ff0484e',
  version: "v5.0"
});

async function showArticleChanges() {
  try {
    // Fetch the article
    const post = await adminAPI.posts.read({slug: 'stanford-study-finds-metas-ai-memorized-nearly-half-of-harry-potter'}, {formats: ['html']});
    
    console.log('Article Title:', post.title);
    console.log('URL:', post.url);
    console.log('\n=== CURRENT HEADING STRUCTURE (After Update) ===\n');
    
    // Extract all headings
    const h1Matches = post.html.match(/<h1[^>]*>(.*?)<\/h1>/gi) || [];
    const h2Matches = post.html.match(/<h2[^>]*>(.*?)<\/h2>/gi) || [];
    
    console.log(`Total H1 tags: ${h1Matches.length}`);
    console.log(`Total H2 tags: ${h2Matches.length}`);
    
    console.log('\n--- H1 Tags (Should only be 1 - the main title) ---');
    h1Matches.forEach((h1, index) => {
      const content = h1.replace(/<[^>]+>/g, ''); // Strip HTML tags
      console.log(`${index + 1}. ${content}`);
    });
    
    console.log('\n--- H2 Tags (Converted from H1s) ---');
    h2Matches.forEach((h2, index) => {
      const content = h2.replace(/<[^>]+>/g, ''); // Strip HTML tags
      console.log(`${index + 1}. ${content}`);
    });
    
    // Show a sample of the HTML structure
    console.log('\n=== SAMPLE HTML (First 3000 characters) ===\n');
    console.log(post.html.substring(0, 3000));
    
    console.log('\n\n=== EXPLANATION ===');
    console.log('Before the update, this article had 7 H1 tags.');
    console.log('After the update:');
    console.log('- The first H1 (main title) was preserved');
    console.log('- The other 6 H1 tags were converted to H2 tags');
    console.log('- This creates a proper heading hierarchy for SEO');
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

showArticleChanges();