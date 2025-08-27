const GhostAdminAPI = require('@tryghost/admin-api');
const cheerio = require('cheerio');

const adminAPI = new GhostAdminAPI({
  url: 'https://implicator-ai.ghost.io',
  key: '685c83699aff68000115868b:f9720fe4ff8f92f315331521eb993ca5ddb38f083ba3969a4b938a134ff0484e',
  version: 'v5.0'
});

async function checkRecentlyUpdated() {
  try {
    // Get recently updated posts
    const posts = await adminAPI.posts.browse({
      limit: 10,
      order: 'updated_at DESC',
      fields: 'id,title,slug,html,updated_at'
    });
    
    console.log('Recently updated posts with images:\n');
    
    let totalPosts = 0;
    let totalImages = 0;
    let imagesWithAlt = 0;
    let imagesWithoutAlt = 0;
    
    for (const post of posts) {
      if (post.html) {
        const $ = cheerio.load(post.html);
        const images = $('img');
        
        if (images.length > 0) {
          totalPosts++;
          console.log(`${totalPosts}. ${post.title}`);
          console.log(`   Updated: ${new Date(post.updated_at).toLocaleString()}`);
          console.log(`   URL: https://implicator.ai/${post.slug}/`);
          console.log(`   Images: ${images.length}`);
          
          images.each((i, img) => {
            totalImages++;
            const $img = $(img);
            const src = $img.attr('src');
            const alt = $img.attr('alt');
            const filename = src ? src.split('/').pop().split('?')[0] : 'unknown';
            
            if (alt && alt.trim() !== '') {
              imagesWithAlt++;
              console.log(`   ✓ ${filename}: "${alt}"`);
            } else {
              imagesWithoutAlt++;
              console.log(`   ✗ ${filename}: NO ALT TEXT`);
            }
          });
          
          console.log('');
        }
      }
    }
    
    console.log('='.repeat(60));
    console.log('SUMMARY OF RECENT UPDATES');
    console.log('='.repeat(60));
    console.log(`Posts checked: ${totalPosts}`);
    console.log(`Total images: ${totalImages}`);
    console.log(`Images with alt tags: ${imagesWithAlt}`);
    console.log(`Images without alt tags: ${imagesWithoutAlt}`);
    
    if (imagesWithoutAlt === 0 && totalImages > 0) {
      console.log('\n✓ All images in recently updated posts have alt tags!');
    } else if (imagesWithoutAlt > 0) {
      console.log(`\n⚠ ${imagesWithoutAlt} images still missing alt tags.`);
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkRecentlyUpdated();