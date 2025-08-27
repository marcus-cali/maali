const GhostContentAPI = require('@tryghost/content-api');

// Initialize the Content API
const contentAPI = new GhostContentAPI({
  url: 'https://implicator-ai.ghost.io',
  key: '04b61b757bb94d432756f4eb49',
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

// Main function to preview meta descriptions
async function previewMetaDescriptions() {
  try {
    console.log('Fetching posts...');
    
    // Fetch all posts
    const posts = await contentAPI.posts.browse({
      limit: 'all',
      fields: 'id,title,slug,meta_description,custom_excerpt,excerpt,html'
    });
    
    console.log(`Found ${posts.length} posts\n`);
    
    // Filter posts without meta descriptions
    const postsToUpdate = posts.filter(post => !post.meta_description);
    
    console.log(`${postsToUpdate.length} posts need meta descriptions\n`);
    
    if (postsToUpdate.length === 0) {
      console.log('All posts already have meta descriptions!');
      return;
    }
    
    // Show preview of what would be generated
    console.log('=== PREVIEW OF META DESCRIPTIONS ===\n');
    
    postsToUpdate.forEach((post, index) => {
      const metaDescription = generateMetaDescription(post);
      
      console.log(`${index + 1}. ${post.title}`);
      console.log(`   URL: https://implicator.ai/${post.slug}/`);
      console.log(`   Generated meta description (${metaDescription.length} chars):`);
      console.log(`   "${metaDescription}"`);
      console.log('');
    });
    
    console.log('=== END OF PREVIEW ===\n');
    console.log(`This would update ${postsToUpdate.length} posts.`);
    console.log('To actually update these posts, run: node update-meta-descriptions.js');
    
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the preview
previewMetaDescriptions();