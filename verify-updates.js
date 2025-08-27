const GhostAdminAPI = require('@tryghost/admin-api');
const cheerio = require('cheerio');

const adminAPI = new GhostAdminAPI({
  url: 'https://implicator-ai.ghost.io',
  key: '685c83699aff68000115868b:f9720fe4ff8f92f315331521eb993ca5ddb38f083ba3969a4b938a134ff0484e',
  version: "v5.0"
});

async function verifyUpdates() {
  try {
    // Get a specific post using Admin API
    const post = await adminAPI.posts.read({slug: 'claude-code-challenges-github-copilot-with-a-developer-first-approach'});
    
    console.log('Post Title:', post.title);
    console.log('Last Updated:', post.updated_at);
    console.log('\nChecking images in HTML:');
    
    if (post.html) {
      const $ = cheerio.load(post.html);
      const images = $('img');
      
      console.log(`Found ${images.length} images:\n`);
      
      images.each((i, img) => {
        const $img = $(img);
        const src = $img.attr('src');
        const alt = $img.attr('alt');
        const filename = src ? src.split('/').pop() : 'unknown';
        
        console.log(`Image ${i + 1}: ${filename}`);
        console.log(`  Alt: "${alt || 'NO ALT TEXT'}"`);
      });
    } else {
      console.log('No HTML content found in post');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

verifyUpdates();