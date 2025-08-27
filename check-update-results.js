const GhostAdminAPI = require('@tryghost/admin-api');

const adminAPI = new GhostAdminAPI({
  url: 'https://implicator-ai.ghost.io',
  key: '685c83699aff68000115868b:f9720fe4ff8f92f315331521eb993ca5ddb38f083ba3969a4b938a134ff0484e',
  version: "v5.0"
});

// List of articles that were reported as updated
const checkArticles = [
  'what-if-ai-makes-us-smarterand-more-dependent',
  'stanford-study-finds-metas-ai-memorized-nearly-half-of-harry-potter',
  'ai-thinks-less-when-it-should-think-more'
];

async function checkUpdateResults() {
  console.log('Checking articles that were reported as updated...\n');
  
  for (const slug of checkArticles) {
    try {
      const post = await adminAPI.posts.read({slug: slug}, {formats: ['html']});
      
      const h1Count = (post.html.match(/<h1(\s[^>]*)?>/gi) || []).length;
      const h2Count = (post.html.match(/<h2(\s[^>]*)?>/gi) || []).length;
      
      console.log(`Article: ${post.title}`);
      console.log(`Slug: ${slug}`);
      console.log(`Current H1 count: ${h1Count}`);
      console.log(`Current H2 count: ${h2Count}`);
      console.log(`Last updated: ${post.updated_at}`);
      console.log('---\n');
      
    } catch (error) {
      console.log(`Error checking ${slug}: ${error.message}\n`);
    }
  }
  
  console.log('\nConclusion: It appears the updates may not have been applied successfully.');
  console.log('The articles still have multiple H1 tags.');
}

checkUpdateResults();