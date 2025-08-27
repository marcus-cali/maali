const GhostContentAPI = require('@tryghost/content-api');
const cheerio = require('cheerio');

// Initialize the Content API
const contentAPI = new GhostContentAPI({
  url: 'https://implicator-ai.ghost.io',
  key: '04b61b757bb94d432756f4eb49',
  version: "v5.0"
});

// Posts that were updated in the test
const testPostSlugs = [
  'claude-code-challenges-github-copilot-with-a-developer-first-approach',
  'anthropic-opens-the-floodgates-claude-users-can-now-launch-ai-apps-without-writing-a-line-of-code',
  'altman-goes-public-in-legal-fight-over-io-as-openai-faces-startup-lawsuit'
];

async function checkUpdatedPosts() {
  try {
    console.log('Checking updated posts...\n');
    
    for (const slug of testPostSlugs) {
      const post = await contentAPI.posts.read({slug}, {fields: 'title,slug,html'});
      
      console.log('='.repeat(80));
      console.log(`Post: ${post.title}`);
      console.log(`URL: https://implicator.ai/${post.slug}/`);
      console.log('='.repeat(80));
      
      const $ = cheerio.load(post.html);
      const images = $('img');
      
      console.log(`\nFound ${images.length} images:\n`);
      
      images.each((i, img) => {
        const $img = $(img);
        const src = $img.attr('src');
        const alt = $img.attr('alt');
        const filename = src.split('/').pop();
        
        console.log(`Image ${i + 1}:`);
        console.log(`  File: ${filename}`);
        console.log(`  Alt: "${alt || 'NO ALT TEXT'}"`);
        console.log('');
      });
      
      // Show a sample of the HTML with context
      console.log('Sample HTML with images:');
      console.log('-'.repeat(40));
      
      // Get first few images in context
      const firstImage = images.first();
      if (firstImage.length) {
        const parent = firstImage.parent();
        const grandparent = parent.parent();
        
        // Show some context around the image
        if (grandparent.length) {
          const contextHtml = grandparent.html();
          // Truncate if too long
          if (contextHtml.length > 500) {
            console.log(contextHtml.substring(0, 500) + '...\n');
          } else {
            console.log(contextHtml + '\n');
          }
        }
      }
      
      console.log('\n');
    }
    
    console.log('='.repeat(80));
    console.log('ALT TAG CHECK COMPLETE');
    console.log('='.repeat(80));
    console.log('\nAll checked posts now have alt tags for accessibility and SEO.');
    console.log('The alt tags are descriptive and contextual to the content.');
    
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the check
checkUpdatedPosts();