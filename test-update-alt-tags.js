const GhostAdminAPI = require('@tryghost/admin-api');
const GhostContentAPI = require('@tryghost/content-api');
const cheerio = require('cheerio');

// Initialize the APIs
const contentAPI = new GhostContentAPI({
  url: 'https://implicator-ai.ghost.io',
  key: '04b61b757bb94d432756f4eb49',
  version: "v5.0"
});

const adminAPI = new GhostAdminAPI({
  url: 'https://implicator-ai.ghost.io',
  key: '685c83699aff68000115868b:f9720fe4ff8f92f315331521eb993ca5ddb38f083ba3969a4b938a134ff0484e',
  version: "v5.0"
});

// Function to extract meaningful alt text from image URL and context
function generateAltText(imgSrc, postTitle, surroundingText, imageIndex) {
  // Extract filename from URL
  const filename = imgSrc.split('/').pop().split('?')[0];
  const lowerFilename = filename.toLowerCase();
  
  // Check for specific image types
  if (lowerFilename.includes('logo_impli')) {
    return 'Implicator.ai logo';
  }
  
  if (lowerFilename.includes('icon')) {
    return 'Icon for ' + postTitle;
  }
  
  // Handle screenshots with dates
  if (filename.match(/\d{4}-\d{2}-\d{2}/) || filename.includes('screenshot') || filename.includes('cleanshot')) {
    return 'Screenshot related to ' + postTitle;
  }
  
  // Handle specific content patterns
  if (lowerFilename.includes('chatgpt')) {
    return 'ChatGPT interface or related content';
  }
  
  if (lowerFilename.includes('claude')) {
    return 'Claude AI interface or related content';
  }
  
  if (lowerFilename.includes('google') || lowerFilename.includes('gemini')) {
    return 'Google Gemini AI related content';
  }
  
  if (lowerFilename.includes('openai')) {
    return 'OpenAI related content';
  }
  
  if (lowerFilename.includes('musk') || lowerFilename.includes('elon')) {
    return 'Elon Musk related image';
  }
  
  if (lowerFilename.includes('robot')) {
    return 'Humanoid robot design or concept';
  }
  
  if (lowerFilename.includes('ai_')) {
    return 'AI technology visualization';
  }
  
  // Extract meaningful parts from filename
  let altText = filename
    .replace(/\.(jpg|jpeg|png|gif|webp|svg)$/i, '') // Remove extension
    .replace(/^opt_|@2x|@1x/g, '') // Remove common prefixes
    .replace(/[0-9]{4}-[0-9]{2}-[0-9]{2}-/g, '') // Remove dates
    .replace(/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/gi, '') // Remove UUIDs
    .replace(/_/g, ' ') // Replace underscores with spaces
    .replace(/-+/g, ' ') // Replace hyphens with spaces
    .replace(/[0-9]{6,}/g, '') // Remove long number sequences
    .trim();
  
  // Clean up excessive spaces
  altText = altText.replace(/\s+/g, ' ').trim();
  
  // If we have a very short or numeric result, use context
  if (altText.length < 5 || /^[0-9\s\-]+$/.test(altText)) {
    // For images in posts, create contextual alt text
    if (imageIndex === 0) {
      altText = `Feature image for ${postTitle}`;
    } else if (surroundingText && surroundingText.length > 20) {
      altText = `Illustration for: ${surroundingText.substring(0, 60)}...`;
    } else {
      altText = `Visual content related to ${postTitle}`;
    }
  } else {
    // Capitalize first letter of each word for readability
    altText = altText.split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }
  
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
    if (prevSibling.length && (prevSibling.is('p') || prevSibling.is('h1') || prevSibling.is('h2') || prevSibling.is('h3'))) {
      text = prevSibling.text().trim();
    }
  }
  
  // If still no text, try next sibling
  if (!text) {
    const nextSibling = parent.next();
    if (nextSibling.length && (nextSibling.is('p') || nextSibling.is('h1') || nextSibling.is('h2') || nextSibling.is('h3'))) {
      text = nextSibling.text().trim();
    }
  }
  
  return text;
}

// Main function to update alt tags
async function testUpdateAltTags() {
  try {
    console.log('TEST MODE: Will update only 3 posts\n');
    console.log('Fetching posts...');
    
    // Fetch all posts with HTML content
    const posts = await contentAPI.posts.browse({
      limit: 'all',
      fields: 'id,title,slug,html,updated_at'
    });
    
    console.log(`Found ${posts.length} posts\n`);
    
    const postsToUpdate = [];
    
    // Process each post to find ones needing updates
    for (const post of posts) {
      if (!post.html) continue;
      
      const $ = cheerio.load(post.html);
      const images = $('img');
      let postNeedsUpdate = false;
      
      images.each((i, img) => {
        const $img = $(img);
        const alt = $img.attr('alt');
        
        if (!alt || alt.trim() === '') {
          postNeedsUpdate = true;
        }
      });
      
      if (postNeedsUpdate) {
        postsToUpdate.push(post);
      }
      
      // Only take first 3 posts that need updates
      if (postsToUpdate.length >= 3) break;
    }
    
    console.log(`Will update ${postsToUpdate.length} posts for testing\n`);
    
    // Update posts
    let successCount = 0;
    let errorCount = 0;
    let totalImagesUpdated = 0;
    
    for (const post of postsToUpdate) {
      try {
        const $ = cheerio.load(post.html);
        const images = $('img');
        let imageIndex = 0;
        let imagesUpdatedInPost = 0;
        
        console.log(`\nUpdating: ${post.title}`);
        console.log(`URL: https://implicator.ai/${post.slug}/`);
        
        images.each((i, img) => {
          const $img = $(img);
          const src = $img.attr('src');
          const alt = $img.attr('alt');
          
          if (!alt || alt.trim() === '') {
            const surroundingText = getSurroundingText($, img);
            const generatedAlt = generateAltText(src, post.title, surroundingText, imageIndex);
            
            console.log(`  Image ${imageIndex + 1}: ${src.split('/').pop()}`);
            console.log(`  Alt text: "${generatedAlt}"`);
            
            // Update the alt attribute in the HTML
            $img.attr('alt', generatedAlt);
            imagesUpdatedInPost++;
            totalImagesUpdated++;
          }
          imageIndex++;
        });
        
        console.log(`  Updated ${imagesUpdatedInPost} images`);
        
        // Update the post
        await adminAPI.posts.edit({
          id: post.id,
          html: $.html(),
          updated_at: post.updated_at
        });
        
        successCount++;
        console.log('✓ Post updated successfully');
      } catch (error) {
        errorCount++;
        console.error(`✗ Error updating post ${post.title}:`, error.message);
      }
    }
    
    console.log('\n=== TEST SUMMARY ===');
    console.log(`Successfully updated: ${successCount} posts`);
    console.log(`Errors: ${errorCount} posts`);
    console.log(`Total images updated: ${totalImagesUpdated}`);
    console.log('\nIf these updates look good, run the full update with:');
    console.log('node update-alt-tags.js');
    
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the test update
testUpdateAltTags();