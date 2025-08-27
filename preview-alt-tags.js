const GhostContentAPI = require('@tryghost/content-api');
const cheerio = require('cheerio');

// Initialize the Content API
const contentAPI = new GhostContentAPI({
  url: 'https://implicator-ai.ghost.io',
  key: '04b61b757bb94d432756f4eb49',
  version: "v5.0"
});

// Function to extract meaningful alt text from image URL and context
function generateAltText(imgSrc, postTitle, surroundingText) {
  // Extract filename from URL
  const filename = imgSrc.split('/').pop().split('?')[0];
  
  // Clean up filename to make it more readable
  let altText = filename
    .replace(/\.(jpg|jpeg|png|gif|webp|svg)$/i, '') // Remove extension
    .replace(/opt_|@2x|_/g, ' ') // Remove common prefixes and replace underscores
    .replace(/[0-9]{4,}/g, '') // Remove long number sequences
    .replace(/-+/g, ' ') // Replace hyphens with spaces
    .trim();
    
  // Clean up excessive spaces
  altText = altText.replace(/\s+/g, ' ').trim();
  
  // If alt text is too generic or short, use context
  if (altText.length < 10 || /^[0-9\s\-]+$/.test(altText)) {
    // Try to use surrounding text or post title
    if (surroundingText && surroundingText.length > 20) {
      altText = surroundingText.substring(0, 100).trim();
    } else {
      altText = `Image from "${postTitle}"`;
    }
  }
  
  // Capitalize first letter
  altText = altText.charAt(0).toUpperCase() + altText.slice(1);
  
  // Ensure alt text isn't too long
  if (altText.length > 125) {
    altText = altText.substring(0, 122) + '...';
  }
  
  return altText;
}

// Function to extract surrounding text for context
function getSurroundingText($, img) {
  const parent = $(img).parent();
  let text = '';
  
  // Try to get text from parent paragraph
  if (parent.is('p')) {
    text = parent.text().trim();
  }
  
  // If no text in parent, try previous sibling
  if (!text) {
    const prevSibling = parent.prev();
    if (prevSibling.length) {
      text = prevSibling.text().trim();
    }
  }
  
  // If still no text, try next sibling
  if (!text) {
    const nextSibling = parent.next();
    if (nextSibling.length) {
      text = nextSibling.text().trim();
    }
  }
  
  return text;
}

// Main function to preview alt tags
async function previewAltTags() {
  try {
    console.log('Fetching posts...');
    
    // Fetch all posts with HTML content
    const posts = await contentAPI.posts.browse({
      limit: 'all',
      fields: 'id,title,slug,html,feature_image,feature_image_alt'
    });
    
    console.log(`Found ${posts.length} posts\n`);
    
    let totalImages = 0;
    let imagesWithoutAlt = 0;
    const postsToUpdate = [];
    
    // Process each post
    for (const post of posts) {
      if (!post.html) continue;
      
      const $ = cheerio.load(post.html);
      const images = $('img');
      let postNeedsUpdate = false;
      const imageUpdates = [];
      
      images.each((i, img) => {
        totalImages++;
        const $img = $(img);
        const src = $img.attr('src');
        const alt = $img.attr('alt');
        
        if (!alt || alt.trim() === '') {
          imagesWithoutAlt++;
          postNeedsUpdate = true;
          
          const surroundingText = getSurroundingText($, img);
          const generatedAlt = generateAltText(src, post.title, surroundingText);
          
          imageUpdates.push({
            src: src,
            generatedAlt: generatedAlt
          });
        }
      });
      
      if (postNeedsUpdate) {
        postsToUpdate.push({
          id: post.id,
          title: post.title,
          slug: post.slug,
          images: imageUpdates
        });
      }
    }
    
    console.log(`Total images found: ${totalImages}`);
    console.log(`Images without alt tags: ${imagesWithoutAlt}`);
    console.log(`Posts that need updates: ${postsToUpdate.length}\n`);
    
    if (postsToUpdate.length === 0) {
      console.log('All images already have alt tags!');
      return;
    }
    
    // Show preview of what would be updated
    console.log('=== PREVIEW OF ALT TAGS TO BE ADDED ===\n');
    
    // Show first 10 posts
    const previewPosts = postsToUpdate.slice(0, 10);
    
    previewPosts.forEach((post, index) => {
      console.log(`${index + 1}. ${post.title}`);
      console.log(`   URL: https://implicator.ai/${post.slug}/`);
      console.log(`   Images to update:`);
      
      post.images.forEach((img, imgIndex) => {
        console.log(`   ${imgIndex + 1}. ${img.src.split('/').pop()}`);
        console.log(`      Alt text: "${img.generatedAlt}"`);
      });
      
      console.log('');
    });
    
    if (postsToUpdate.length > 10) {
      console.log(`... and ${postsToUpdate.length - 10} more posts\n`);
    }
    
    console.log('=== END OF PREVIEW ===\n');
    console.log(`This would update ${imagesWithoutAlt} images across ${postsToUpdate.length} posts.`);
    console.log('To actually update these posts, run: node update-alt-tags.js');
    
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the preview
previewAltTags();