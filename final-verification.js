const GhostContentAPI = require('@tryghost/content-api');
const cheerio = require('cheerio');

// Initialize the Content API
const contentAPI = new GhostContentAPI({
  url: 'https://implicator-ai.ghost.io',
  key: '04b61b757bb94d432756f4eb49',
  version: "v5.0"
});

async function finalVerification() {
  try {
    console.log('Final verification of alt tag updates...\n');
    
    // Get all posts
    const posts = await contentAPI.posts.browse({
      limit: 'all',
      fields: 'id,title,slug,html'
    });
    
    let totalImages = 0;
    let imagesWithAlt = 0;
    let imagesWithoutAlt = 0;
    let postsWithMissingAlt = 0;
    
    // Process each post
    for (const post of posts) {
      if (!post.html) continue;
      
      const $ = cheerio.load(post.html);
      const images = $('img');
      let postHasMissingAlt = false;
      
      images.each((i, img) => {
        totalImages++;
        const $img = $(img);
        const alt = $img.attr('alt');
        
        if (!alt || alt.trim() === '') {
          imagesWithoutAlt++;
          postHasMissingAlt = true;
        } else {
          imagesWithAlt++;
        }
      });
      
      if (postHasMissingAlt) {
        postsWithMissingAlt++;
      }
    }
    
    console.log('='.repeat(60));
    console.log('FINAL ALT TAG STATUS');
    console.log('='.repeat(60));
    console.log(`Total posts: ${posts.length}`);
    console.log(`Total images: ${totalImages}`);
    console.log(`Images with alt tags: ${imagesWithAlt}`);
    console.log(`Images without alt tags: ${imagesWithoutAlt}`);
    console.log(`Posts with missing alt tags: ${postsWithMissingAlt}`);
    
    // Calculate improvement
    console.log('\n📊 IMPROVEMENT METRICS:');
    console.log(`Alt tag coverage: ${((imagesWithAlt / totalImages) * 100).toFixed(1)}%`);
    
    // Based on our previous data:
    // Before: 612 images without alt tags
    // After: current imagesWithoutAlt
    const imagesFixed = 612 - imagesWithoutAlt;
    console.log(`Images fixed: ${imagesFixed} out of 612`);
    console.log(`Success rate: ${((imagesFixed / 612) * 100).toFixed(1)}%`);
    
    if (imagesWithoutAlt === 0) {
      console.log('\n✅ SUCCESS: All images now have alt tags!');
    } else if (imagesWithoutAlt < 612) {
      console.log(`\n✅ PARTIAL SUCCESS: Fixed ${imagesFixed} images. ${imagesWithoutAlt} images may need manual review.`);
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the final verification
finalVerification();