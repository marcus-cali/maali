const GhostAdminAPI = require('@tryghost/admin-api');

// Initialize the Admin API
const adminAPI = new GhostAdminAPI({
  url: 'https://implicator-ai.ghost.io',
  key: '685c83699aff68000115868b:f9720fe4ff8f92f315331521eb993ca5ddb38f083ba3969a4b938a134ff0484e',
  version: "v5.0"
});

// List of articles with multiple H1 tags (from CSV)
const articlesWithMultipleH1s = [
    'https://www.implicator.ai/terms-of-service/',
    'https://www.implicator.ai/what-if-ai-makes-us-smarterand-more-dependent/',
    'https://www.implicator.ai/stanford-study-finds-metas-ai-memorized-nearly-half-of-harry-potter/',
    'https://www.implicator.ai/metas-ai-chatbot-exposes-user-confessions-to-the-public/',
    'https://www.implicator.ai/meta-pays-15-billion-for-ai-talent-as-browser-company-bets-on-total-surveillance/',
    'https://www.implicator.ai/openai-drops-prices-apple-drops-the-act-two-ai-strategies-one-turning-point/',
    'https://www.implicator.ai/ai-decoded-google-deepmind/',
    'https://www.implicator.ai/ai-decoded-anthropic/',
    'https://www.implicator.ai/ai-decoded-openai-company-profile/',
    'https://www.implicator.ai/metas-10-billion-admission-our-ai-isnt-working/',
    'https://www.implicator.ai/ai-thinks-less-when-it-should-think-more/',
    'https://www.implicator.ai/billionaires-brawl-courts-intrudeand-everyone-else-pays/',
    'https://www.implicator.ai/hollywoods-secret-ai-experiments-studios-hide-widespread-use-despite-union-deals/',
    'https://www.implicator.ai/big-tech-stabs-its-ai-coding-children/',
    'https://www.implicator.ai/musk-dumps-politics-raises-billions/',
    'https://www.implicator.ai/ai-learns-social-medias-dirtiest-tricks/',
    'https://www.implicator.ai/silicon-valleys-great-reversal-from-firing-palmer-luckey-to-needing-him-back/',
    'https://www.implicator.ai/can-the-worlds-richest-man-survive-his-worst-year-yet/',
    'https://www.implicator.ai/he-warned-of-ai-chaos-now-hes-scanning-eyes-to-stop-it/',
    'https://www.implicator.ai/claude-4s-leaked-manual-reveals-ais-hidden-rulebook/',
    'https://www.implicator.ai/is-anthropics-new-ai-too-smart-for-its-own-good/',
    'https://www.implicator.ai/the-tech-titans-paradox-killing-screens-cloning-you-and-crumbling-control/',
    'https://www.implicator.ai/googles-ai-search-now-books-your-dinner-while-nvidia-loses-china/',
    'https://www.implicator.ai/microsoft-and-github-ai-takes-over-the-boring-work/',
    'https://www.implicator.ai/apple-stumbles-nvidia-shares-a-tale-of-two-ai-strategies/',
    'https://www.implicator.ai/grok-goes-rogue-metas-mega-model-hits-wall/',
    'https://www.implicator.ai/ai-vs-math-deepminds-new-brainiac-dunks-on-human-experts/',
    'https://www.implicator.ai/saudi-power-play-amd-and-nvidia-battle-as-gop-targets-ai-rules/',
    'https://www.implicator.ai/trump-ships-ai-power-to-gulf-googles-search-crown-shakes/',
    'https://www.implicator.ai/ai-power-plays-money-control-and-a-fired-watchdog/',
    'https://www.implicator.ai/coders-eye-ai-with-love-and-loathing-billionaire-says-deal-with-it/',
    'https://www.implicator.ai/ai-chiefs-flip-from-slow-down-to-floor-it/',
    'https://www.implicator.ai/apple-vp-predicts-googles-search-empire-will-crumble/',
    'https://www.implicator.ai/nvidia-bleeds-in-china-google-speeds-up-ai-race/',
    'https://www.implicator.ai/openais-power-play-nonprofit-keeps-the-keys-musk-fumes/',
    'https://www.implicator.ai/apple-bites-pride-uncle-sam-loses-grip-a-double-tech-reality-check/',
    'https://www.implicator.ai/silicon-valleys-great-chip-war-erupts/',
    'https://www.implicator.ai/silicon-valleys-split-personality-vcs-cant-be-replaced-but-your-therapist-can/',
    'https://www.implicator.ai/code-wars-and-chatgpts-personality-crisis/',
    'https://www.implicator.ai/microsoft-openai-from-power-couple-to-cold-war/',
    'https://www.implicator.ai/metas-flirty-ai-bots-cross-the-line/',
    'https://www.implicator.ai/price-wars-brain-drain-china-cuts-ai-costs-while-us-talent-flees-to-germany/',
    'https://www.implicator.ai/perplexitys-voice-assistant-outpaces-siri-now-available-on-iphones/',
    'https://www.implicator.ai/big-techs-800m-bad-hair-day-openais-browser-dreams/',
    'https://www.implicator.ai/teen-social-media-crisis-parents-panic-kids-shrug/',
    'https://www.implicator.ai/robo-marathon-turns-into-tech-comedy-show/',
    'https://www.implicator.ai/meta-to-apple-your-ai-cant-sit-with-us/',
    'https://www.implicator.ai/openais-new-trick-making-robots-think-in-pics/',
    'https://www.implicator.ai/ai-grows-up-from-flash-to-finesse/',
    'https://www.implicator.ai/openais-social-power-play-altman-takes-on-musk/',
    'https://www.implicator.ai/openai-goes-budget-friendly-nvidia-plays-trump-card/',
    'https://www.implicator.ai/openai-boss-trashes-own-ai-gpt-4-is-just-plain-dumb/',
    'https://www.implicator.ai/eu-to-trump-pay-up-or-your-tech-giants-will/',
    'https://www.implicator.ai/camerons-latest-blockbuster-saving-hollywood-with-ai/',
    'https://www.implicator.ai/eu-dreams-big-ai-megafactories-or-just-hot-air/',
    'https://www.implicator.ai/when-ai-becomes-your-nosiest-coworker/',
    'https://www.implicator.ai/trump-tariffs-metas-ai-power-play-asia-bleeds-zuck-teases/',
    'https://www.implicator.ai/ai-experts-love-the-future-the-rest-of-us-not-so-much/',
    'https://www.implicator.ai/today-in-tech-studio-ghibli-gets-ai-fied-while-taiwans-silicon-shield-cracks/',
    'https://www.implicator.ai/inside-claudes-brain-its-messier-than-we-thought/',
    'https://www.implicator.ai/scientists-to-ai-we-need-to-talk/',
    'https://www.implicator.ai/amazons-new-ai-actually-works/',
    'https://www.implicator.ai/wikipedia-to-ai-stop-eating-all-our-data/',
    'https://www.implicator.ai/tech-giants-face-double-trouble-trumps-trade-war-microsofts-cold-feet/',
    'https://www.implicator.ai/oops-even-the-smartest-ai-just-failed-a-kids-pattern-test/',
    'https://www.implicator.ai/holy-upgrade-ai-learns-to-google-and-wont-shut-up-about-it/',
    'https://www.implicator.ai/tech-tales-softbanks-expensive-dating-openais-premium-brain-freeze/',
    'https://www.implicator.ai/nvidias-power-play-googles-32b-security-splash-a-week-of-tech-giants-flexing/',
    'https://www.implicator.ai/anthropic-means-business-trumps-silicon-stumble/',
    'https://www.implicator.ai/nvidia-sweats-europe-flips-off-silicon-valley/',
    'https://www.implicator.ai/silicon-valleys-perfect-ai-law-rules-for-thee-not-for-me-2/',
    'https://www.implicator.ai/silicon-valleys-new-showdown-apple-stumbles-intel-gambles/',
    'https://www.implicator.ai/openais-agent-revolution-build-your-own-digital-workforce/',
    'https://www.implicator.ai/ais-latest-tricks-failing-searches-playing-games/',
    'https://www.implicator.ai/chinas-ai-revolution-hold-the-mayo/',
    'https://www.implicator.ai/the-education-of-ai-bad-teachers-big-bills-2/',
    'https://www.implicator.ai/tiny-ai-packs-a-punch-while-musk-shoots-for-the-moon-ey/',
    'https://www.implicator.ai/ais-fast-lane-ex-white-house-advisor-hits-panic-button-pioneers-pull-brakes/',
    'https://www.implicator.ai/ai-decoded-powerpoint/',
    'https://www.implicator.ai/todays-ai-wire-anthropics-billions-tsmcs-chip-revolution/',
    'https://www.implicator.ai/apples-siri-dream-slips-further-away-while-chinese-ai-claims-profit-bonanza/',
    'https://www.implicator.ai/ai-gets-emotional-zuck-gets-ambitious-silicon-valleys-new-love-triangle/',
    'https://www.implicator.ai/ai-giants-in-the-spotlight-drama-glory-and-growing-pains/',
    'https://www.implicator.ai/silicon-valleys-latest-bubble-9b-valuation-for-zero-product/',
    'https://www.implicator.ai/ai-morning-brew-deep-thinkers-browser-shakers/',
    'https://www.implicator.ai/tech-giants-reality-check-microsoft-retreats-while-grok-trips-over-truth/',
    'https://www.implicator.ai/meet-your-new-co-workers/',
    'https://www.implicator.ai/your-morning-ai-brew-when-fortune-telling-meets-quantum-physics-crystal/',
    'https://www.implicator.ai/ai-pioneer-mira-murati-launches-human-focused-startup-thinking-machines-lab-2/',
    'https://www.implicator.ai/sutskevers-30b-bet-on-not-destroying-the-world/',
    'https://www.implicator.ai/ai-models-hit-their-limits-sooner-than-expected/',
    'https://www.implicator.ai/and-again-elon-musk/',
    'https://www.implicator.ai/battle-of-the-giants-musk-stirs-the-pot-with-grok-3/',
    'https://www.implicator.ai/ai-summit-in-paris-europe-stands-in-its-own-way/',
    'https://www.implicator.ai/gpt-5-openais-radical-change-of-strategy-to-an-all-in-one-ai/',
    'https://www.implicator.ai/how-openai-ceo-sam-altman-outsmarted-elon-musk/',
    'https://www.implicator.ai/big-techs-billion-dollar-bet-why-ai-will-be-even-bigger-in-2025/',
    'https://www.implicator.ai/cheap-cheaper-ai-researchers-build-ai-reasoning-model-for-under-50/',
    'https://www.implicator.ai/musks-ai-empire-burns-cash-as-memphis-lawsuit-heats-up/',
    'https://www.implicator.ai/ais-legal-lesson-buy-books-dont-steal-them/',
    'https://www.implicator.ai/muratis-2-billion-seed-round-ignites-high-stakes-battle-for-ai-talent/',
    'https://www.implicator.ai/openais-65b-deal-hits-legal-speed-bump-teslas-robotaxis-roll-with-training-wheels/'
];


// Extract slug from URL
function getSlugFromUrl(url) {
    const urlParts = url.split('/');
    return urlParts[urlParts.length - 2]; // Get the second to last part (before the trailing slash)
}

// Fix H1 tags in HTML content
function fixH1Tags(html) {
    let h1Count = 0;
    const fixedHtml = html.replace(/<h1(\s[^>]*)?>(.*?)<\/h1>/gi, (match, attributes, content) => {
        h1Count++;
        if (h1Count === 1) {
            // Keep the first H1 as is
            return match;
        } else {
            // Convert subsequent H1s to H2s
            return `<h2${attributes || ''}>${content}</h2>`;
        }
    });
    
    return {
        fixedHtml,
        changesCount: h1Count > 1 ? h1Count - 1 : 0
    };
}

// Fetch and preview changes for a single post
async function previewPostChanges(slug) {
    try {
        const post = await adminAPI.posts.read({slug: slug}, {formats: ['html']});
        
        // Skip Morning Briefing articles
        if (post.title && post.title.toLowerCase().includes('morning briefing')) {
            return {
                slug,
                title: post.title,
                skipped: true,
                reason: 'Morning Briefing article'
            };
        }
        
        // Fix H1 tags
        const { fixedHtml, changesCount } = fixH1Tags(post.html);
        
        // Count original H1s
        const originalH1Count = (post.html.match(/<h1(\s[^>]*)?>/gi) || []).length;
        
        return {
            id: post.id,
            slug,
            title: post.title,
            originalH1Count,
            changesCount,
            preview: changesCount > 0 ? fixedHtml.substring(0, 500) + '...' : null
        };
        
    } catch (error) {
        return {
            slug,
            error: error.message
        };
    }
}

// Main function to preview all changes
async function previewAllChanges() {
    console.log('Previewing H1 tag fixes for implicator.ai articles...\n');
    console.log('Total articles to check:', articlesWithMultipleH1s.length);
    console.log('Excluding: Morning Briefing articles\n');
    
    const results = {
        toUpdate: [],
        skipped: [],
        errors: []
    };
    
    // Process articles in batches to avoid rate limiting
    const batchSize = 5;
    for (let i = 0; i < articlesWithMultipleH1s.length; i += batchSize) {
        const batch = articlesWithMultipleH1s.slice(i, i + batchSize);
        const batchPromises = batch.map(url => {
            const slug = getSlugFromUrl(url);
            return previewPostChanges(slug);
        });
        
        const batchResults = await Promise.all(batchPromises);
        
        batchResults.forEach(result => {
            if (result.error) {
                results.errors.push(result);
            } else if (result.skipped) {
                results.skipped.push(result);
            } else if (result.changesCount > 0) {
                results.toUpdate.push(result);
            }
        });
        
        // Progress update
        console.log(`Processed ${Math.min(i + batchSize, articlesWithMultipleH1s.length)} of ${articlesWithMultipleH1s.length} articles...`);
        
        // Small delay between batches
        if (i + batchSize < articlesWithMultipleH1s.length) {
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
    
    // Display results
    console.log('\n=== PREVIEW RESULTS ===\n');
    
    console.log(`Articles to update: ${results.toUpdate.length}`);
    console.log(`Articles skipped: ${results.skipped.length}`);
    console.log(`Errors: ${results.errors.length}`);
    
    if (results.toUpdate.length > 0) {
        console.log('\n--- Articles that will be updated ---');
        results.toUpdate.forEach(article => {
            console.log(`\n${article.title}`);
            console.log(`  Slug: ${article.slug}`);
            console.log(`  Original H1 count: ${article.originalH1Count}`);
            console.log(`  H1s to convert to H2: ${article.changesCount}`);
        });
    }
    
    if (results.skipped.length > 0) {
        console.log('\n--- Skipped articles ---');
        results.skipped.forEach(article => {
            console.log(`${article.title} - Reason: ${article.reason}`);
        });
    }
    
    if (results.errors.length > 0) {
        console.log('\n--- Errors ---');
        results.errors.forEach(article => {
            console.log(`${article.slug}: ${article.error}`);
        });
    }
    
    console.log('\n=== END OF PREVIEW ===');
    console.log('\nTo apply these changes, run: node update-h1-tags.js');
}

// Run the preview
previewAllChanges().catch(console.error);