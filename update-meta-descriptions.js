const GhostAdminAPI = require('@tryghost/admin-api');
const GhostContentAPI = require('@tryghost/content-api');

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

// Function to generate meta description from content
function generateMetaDescription(post) {
  // Priority 1: Use custom excerpt if available
  if (post.custom_excerpt) {
    return truncateDescription(post.custom_excerpt, 160);
  }
  
  // Priority 2: Use excerpt
  if (post.excerpt) {
    return truncateDescription(post.excerpt, 160);
  }
  
  // Priority 3: Generate from content
  if (post.html) {
    // Strip HTML tags and get plain text
    const plainText = post.html
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .trim();
    
    return truncateDescription(plainText, 160);
  }
  
  // Fallback
  return truncateDescription(post.title || 'Read more on implicator.ai', 160);
}

// Function to truncate text to specified length
function truncateDescription(text, maxLength) {
  if (text.length <= maxLength) {
    return text;
  }
  
  // Truncate at the last complete word before maxLength
  const truncated = text.substr(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  if (lastSpace > 0) {
    return truncated.substr(0, lastSpace) + '...';
  }
  
  return truncated + '...';
}

// Main function to update meta descriptions
async function updateMetaDescriptions() {
  try {
    console.log('Fetching posts...');
    
    // Fetch all posts
    const posts = await contentAPI.posts.browse({
      limit: 'all',
      fields: 'id,title,slug,meta_description,custom_excerpt,excerpt,html,updated_at'
    });
    
    console.log(`Found ${posts.length} posts`);
    
    // Filter posts without meta descriptions
    const postsToUpdate = posts.filter(post => !post.meta_description);
    
    console.log(`${postsToUpdate.length} posts need meta descriptions`);
    
    if (postsToUpdate.length === 0) {
      console.log('All posts already have meta descriptions!');
      return;
    }
    
    // Ask for confirmation
    console.log('\nPosts without meta descriptions:');
    postsToUpdate.slice(0, 5).forEach(post => {
      console.log(`- ${post.title} (${post.slug})`);
    });
    
    if (postsToUpdate.length > 5) {
      console.log(`... and ${postsToUpdate.length - 5} more`);
    }
    
    console.log('\nThis will update meta descriptions for all these posts.');
    console.log('Press Ctrl+C to cancel, or wait 5 seconds to continue...');
    
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Update posts
    let successCount = 0;
    let errorCount = 0;
    
    for (const post of postsToUpdate) {
      try {
        const metaDescription = generateMetaDescription(post);
        
        console.log(`\nUpdating: ${post.title}`);
        console.log(`Meta description: ${metaDescription}`);
        
        await adminAPI.posts.edit({
          id: post.id,
          meta_description: metaDescription,
          updated_at: post.updated_at
        });
        
        successCount++;
        console.log('✓ Updated successfully');
      } catch (error) {
        errorCount++;
        console.error(`✗ Error updating post ${post.title}:`, error.message);
      }
    }
    
    console.log('\n=== Summary ===');
    console.log(`Successfully updated: ${successCount} posts`);
    console.log(`Errors: ${errorCount} posts`);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the update
updateMetaDescriptions();