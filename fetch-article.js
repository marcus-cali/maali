const GhostAdminAPI = require('@tryghost/admin-api');

const adminAPI = new GhostAdminAPI({
  url: 'https://implicator-ai.ghost.io',
  key: '685c83699aff68000115868b:f9720fe4ff8f92f315331521eb993ca5ddb38f083ba3969a4b938a134ff0484e',
  version: "v5.0"
});

async function fetchArticle() {
  try {
    const post = await adminAPI.posts.read({
      slug: 'stanford-study-finds-metas-ai-memorized-nearly-half-of-harry-potter'
    }, {
      formats: ['html']
    });
    
    console.log('Article Title:', post.title);
    console.log('\n=== HTML Content (First 2000 characters) ===\n');
    console.log(post.html.substring(0, 2000));
    console.log('\n... [truncated]');
    
    // Count H1 and H2 tags
    const h1Count = (post.html.match(/<h1[^>]*>/gi) || []).length;
    const h2Count = (post.html.match(/<h2[^>]*>/gi) || []).length;
    
    console.log('\n=== Heading Statistics ===');
    console.log(`Total H1 tags: ${h1Count}`);
    console.log(`Total H2 tags: ${h2Count}`);
    
    // Extract and display all H1 and H2 tags with their content
    console.log('\n=== All H1 and H2 Tags in Order ===\n');
    const headingRegex = /<(h[12])[^>]*>(.*?)<\/\1>/gi;
    let match;
    let headingIndex = 0;
    
    while ((match = headingRegex.exec(post.html)) !== null) {
      headingIndex++;
      const tagName = match[1].toUpperCase();
      const content = match[2].replace(/<[^>]*>/g, ''); // Strip inner HTML tags
      console.log(`${headingIndex}. ${tagName}: ${content}`);
    }
    
  } catch (error) {
    console.error('Error fetching article:', error);
  }
}

fetchArticle();