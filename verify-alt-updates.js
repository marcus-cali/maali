const GhostAdminAPI = require('@tryghost/admin-api');
const cheerio = require('cheerio');

const adminAPI = new GhostAdminAPI({
  url: 'https://implicator-ai.ghost.io',
  key: '685c83699aff68000115868b:f9720fe4ff8f92f315331521eb993ca5ddb38f083ba3969a4b938a134ff0484e',
  version: "v5.0"
});

// Sample of posts that were updated
const samplePosts = [
  'claude-code-challenges-github-copilot-with-a-developer-first-approach',
  'anthropic-opens-the-floodgates-claude-users-can-now-launch-ai-apps-without-writing-a-line-of-code',
  'altman-goes-public-in-legal-fight-over-io-as-openai-faces-startup-lawsuit',
  'deepseek-v3-blows-away-benchmarks-as-chinese-ai-takes-on-openai',
  'zuckerberg-unveils-llama-3-3-metas-cheaper-faster-answer-to-gpt-4'
];

async function verifyAltUpdates() {
  try {
    console.log('Verifying alt tag updates using Admin API...\n');
    
    let totalImagesChecked = 0;
    let imagesWithAlt = 0;
    let imagesWithoutAlt = 0;
    
    for (const slug of samplePosts) {
      try {
        // Fetch post using Admin API (which should show the latest content)
        const post = await adminAPI.posts.read({slug}, {fields: 'title,slug,html,updated_at'});
        
        console.log('='.repeat(80));
        console.log(`Post: ${post.title}`);
        console.log(`URL: https://implicator.ai/${post.slug}/`);
        console.log(`Last updated: ${post.updated_at}`);
        console.log('='.repeat(80));
        
        if (post.html) {
          const $ = cheerio.load(post.html);
          const images = $('img');
          
          console.log(`\nFound ${images.length} images:\n`);
          
          images.each((i, img) => {
            const $img = $(img);
            const src = $img.attr('src');
            const alt = $img.attr('alt');
            const filename = src ? src.split('/').pop().split('?')[0] : 'unknown';
            
            totalImagesChecked++;
            
            console.log(`Image ${i + 1}: ${filename}`);
            if (alt && alt.trim() !== '') {
              console.log(`  ✓ Alt: "${alt}"`);
              imagesWithAlt++;
            } else {
              console.log(`  ✗ Alt: NO ALT TEXT`);
              imagesWithoutAlt++;
            }
          });
        }
        
        console.log('\n');
      } catch (error) {
        console.error(`Error checking post ${slug}:`, error.message);
      }
    }
    
    console.log('='.repeat(80));
    console.log('VERIFICATION SUMMARY');
    console.log('='.repeat(80));
    console.log(`Total images checked: ${totalImagesChecked}`);
    console.log(`Images with alt tags: ${imagesWithAlt}`);
    console.log(`Images without alt tags: ${imagesWithoutAlt}`);
    console.log(`Success rate: ${((imagesWithAlt / totalImagesChecked) * 100).toFixed(1)}%`);
    
    if (imagesWithoutAlt === 0) {
      console.log('\n✓ All checked images have alt tags!');
    } else {
      console.log('\n⚠ Some images still missing alt tags.');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

verifyAltUpdates();