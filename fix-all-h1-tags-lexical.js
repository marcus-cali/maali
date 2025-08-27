const GhostAdminAPI = require('@tryghost/admin-api');

const adminAPI = new GhostAdminAPI({
  url: 'https://implicator-ai.ghost.io',
  key: '685c83699aff68000115868b:f9720fe4ff8f92f315331521eb993ca5ddb38f083ba3969a4b938a134ff0484e',
  version: "v5.0"
});

// List of articles with multiple H1 tags (from CSV)
const articlesWithMultipleH1s = [
    'terms-of-service',
    'what-if-ai-makes-us-smarterand-more-dependent',
    'stanford-study-finds-metas-ai-memorized-nearly-half-of-harry-potter',
    'metas-ai-chatbot-exposes-user-confessions-to-the-public',
    'meta-pays-15-billion-for-ai-talent-as-browser-company-bets-on-total-surveillance',
    'openai-drops-prices-apple-drops-the-act-two-ai-strategies-one-turning-point',
    'ai-decoded-google-deepmind',
    'ai-decoded-anthropic',
    'ai-decoded-openai-company-profile',
    'metas-10-billion-admission-our-ai-isnt-working',
    'ai-thinks-less-when-it-should-think-more',
    'billionaires-brawl-courts-intrudeand-everyone-else-pays',
    'hollywoods-secret-ai-experiments-studios-hide-widespread-use-despite-union-deals',
    'big-tech-stabs-its-ai-coding-children',
    'musk-dumps-politics-raises-billions',
    'ai-learns-social-medias-dirtiest-tricks',
    'silicon-valleys-great-reversal-from-firing-palmer-luckey-to-needing-him-back',
    'can-the-worlds-richest-man-survive-his-worst-year-yet',
    'he-warned-of-ai-chaos-now-hes-scanning-eyes-to-stop-it',
    'claude-4s-leaked-manual-reveals-ais-hidden-rulebook',
    'is-anthropics-new-ai-too-smart-for-its-own-good',
    'the-tech-titans-paradox-killing-screens-cloning-you-and-crumbling-control',
    'googles-ai-search-now-books-your-dinner-while-nvidia-loses-china',
    'microsoft-and-github-ai-takes-over-the-boring-work',
    'apple-stumbles-nvidia-shares-a-tale-of-two-ai-strategies',
    'grok-goes-rogue-metas-mega-model-hits-wall',
    'ai-vs-math-deepminds-new-brainiac-dunks-on-human-experts',
    'saudi-power-play-amd-and-nvidia-battle-as-gop-targets-ai-rules',
    'trump-ships-ai-power-to-gulf-googles-search-crown-shakes',
    'ai-power-plays-money-control-and-a-fired-watchdog',
    'coders-eye-ai-with-love-and-loathing-billionaire-says-deal-with-it',
    'ai-chiefs-flip-from-slow-down-to-floor-it',
    'apple-vp-predicts-googles-search-empire-will-crumble',
    'nvidia-bleeds-in-china-google-speeds-up-ai-race',
    'openais-power-play-nonprofit-keeps-the-keys-musk-fumes',
    'apple-bites-pride-uncle-sam-loses-grip-a-double-tech-reality-check',
    'silicon-valleys-great-chip-war-erupts',
    'silicon-valleys-split-personality-vcs-cant-be-replaced-but-your-therapist-can',
    'code-wars-and-chatgpts-personality-crisis',
    'microsoft-openai-from-power-couple-to-cold-war',
    'metas-flirty-ai-bots-cross-the-line',
    'price-wars-brain-drain-china-cuts-ai-costs-while-us-talent-flees-to-germany',
    'perplexitys-voice-assistant-outpaces-siri-now-available-on-iphones',
    'big-techs-800m-bad-hair-day-openais-browser-dreams',
    'teen-social-media-crisis-parents-panic-kids-shrug',
    'robo-marathon-turns-into-tech-comedy-show',
    'meta-to-apple-your-ai-cant-sit-with-us',
    'openais-new-trick-making-robots-think-in-pics',
    'ai-grows-up-from-flash-to-finesse',
    'openais-social-power-play-altman-takes-on-musk',
    'openai-goes-budget-friendly-nvidia-plays-trump-card',
    'openai-boss-trashes-own-ai-gpt-4-is-just-plain-dumb',
    'eu-to-trump-pay-up-or-your-tech-giants-will',
    'camerons-latest-blockbuster-saving-hollywood-with-ai',
    'eu-dreams-big-ai-megafactories-or-just-hot-air',
    'when-ai-becomes-your-nosiest-coworker',
    'trump-tariffs-metas-ai-power-play-asia-bleeds-zuck-teases',
    'ai-experts-love-the-future-the-rest-of-us-not-so-much',
    'today-in-tech-studio-ghibli-gets-ai-fied-while-taiwans-silicon-shield-cracks',
    'inside-claudes-brain-its-messier-than-we-thought',
    'scientists-to-ai-we-need-to-talk',
    'amazons-new-ai-actually-works',
    'wikipedia-to-ai-stop-eating-all-our-data',
    'tech-giants-face-double-trouble-trumps-trade-war-microsofts-cold-feet',
    'oops-even-the-smartest-ai-just-failed-a-kids-pattern-test',
    'holy-upgrade-ai-learns-to-google-and-wont-shut-up-about-it',
    'tech-tales-softbanks-expensive-dating-openais-premium-brain-freeze',
    'nvidias-power-play-googles-32b-security-splash-a-week-of-tech-giants-flexing',
    'anthropic-means-business-trumps-silicon-stumble',
    'nvidia-sweats-europe-flips-off-silicon-valley',
    'silicon-valleys-perfect-ai-law-rules-for-thee-not-for-me-2',
    'silicon-valleys-new-showdown-apple-stumbles-intel-gambles',
    'openais-agent-revolution-build-your-own-digital-workforce',
    'ais-latest-tricks-failing-searches-playing-games',
    'chinas-ai-revolution-hold-the-mayo',
    'the-education-of-ai-bad-teachers-big-bills-2',
    'tiny-ai-packs-a-punch-while-musk-shoots-for-the-moon-ey',
    'ais-fast-lane-ex-white-house-advisor-hits-panic-button-pioneers-pull-brakes',
    'ai-decoded-powerpoint',
    'todays-ai-wire-anthropics-billions-tsmcs-chip-revolution',
    'apples-siri-dream-slips-further-away-while-chinese-ai-claims-profit-bonanza',
    'ai-gets-emotional-zuck-gets-ambitious-silicon-valleys-new-love-triangle',
    'ai-giants-in-the-spotlight-drama-glory-and-growing-pains',
    'silicon-valleys-latest-bubble-9b-valuation-for-zero-product',
    'ai-morning-brew-deep-thinkers-browser-shakers',
    'tech-giants-reality-check-microsoft-retreats-while-grok-trips-over-truth',
    'meet-your-new-co-workers',
    'your-morning-ai-brew-when-fortune-telling-meets-quantum-physics-crystal',
    'ai-pioneer-mira-murati-launches-human-focused-startup-thinking-machines-lab-2',
    'sutskevers-30b-bet-on-not-destroying-the-world',
    'ai-models-hit-their-limits-sooner-than-expected',
    'and-again-elon-musk',
    'battle-of-the-giants-musk-stirs-the-pot-with-grok-3',
    'ai-summit-in-paris-europe-stands-in-its-own-way',
    'gpt-5-openais-radical-change-of-strategy-to-an-all-in-one-ai',
    'how-openai-ceo-sam-altman-outsmarted-elon-musk',
    'big-techs-billion-dollar-bet-why-ai-will-be-even-bigger-in-2025',
    'cheap-cheaper-ai-researchers-build-ai-reasoning-model-for-under-50',
    'musks-ai-empire-burns-cash-as-memphis-lawsuit-heats-up',
    'ais-legal-lesson-buy-books-dont-steal-them',
    'muratis-2-billion-seed-round-ignites-high-stakes-battle-for-ai-talent',
    'openais-65b-deal-hits-legal-speed-bump-teslas-robotaxis-roll-with-training-wheels'
];

// Fix H1 tags in Lexical JSON structure
function fixH1TagsInLexical(lexicalStr) {
    const lexical = JSON.parse(lexicalStr);
    let h1Count = 0;
    let changesCount = 0;
    
    // Recursive function to process nodes
    function processNode(node) {
        // Handle extended-heading nodes
        if (node.type === 'extended-heading' && node.tag === 'h1') {
            h1Count++;
            if (h1Count > 1) {
                // Change h1 to h2 after the first one
                node.tag = 'h2';
                changesCount++;
            }
        }
        
        // Handle HTML nodes that might contain H1 tags
        if (node.type === 'html' && node.html) {
            let htmlH1Count = 0;
            node.html = node.html.replace(/<h1(\s[^>]*)?>(.*?)<\/h1>/gi, (match, attributes, content) => {
                h1Count++;
                htmlH1Count++;
                if (h1Count > 1) {
                    changesCount++;
                    return `<h2${attributes || ''}>${content}</h2>`;
                }
                return match;
            });
        }
        
        // Process children if they exist
        if (node.children && Array.isArray(node.children)) {
            node.children.forEach(child => processNode(child));
        }
    }
    
    // Process the root node
    if (lexical.root && lexical.root.children) {
        lexical.root.children.forEach(node => processNode(node));
    }
    
    return {
        fixedLexical: JSON.stringify(lexical),
        changesCount,
        h1Count
    };
}

// Process a single article
async function processArticle(slug) {
    try {
        // Fetch the post
        const post = await adminAPI.posts.read({slug: slug});
        
        // Skip if no lexical content
        if (!post.lexical) {
            return {
                slug,
                title: post.title,
                skipped: true,
                reason: 'No lexical content'
            };
        }
        
        // Skip Morning Briefing articles - only check if title starts with "Morning Briefing"
        if (post.title && post.title.startsWith('Morning Briefing')) {
            return {
                slug,
                title: post.title,
                skipped: true,
                reason: 'Morning Briefing article'
            };
        }
        
        // Fix H1 tags in lexical
        const { fixedLexical, changesCount, h1Count } = fixH1TagsInLexical(post.lexical);
        
        if (changesCount === 0) {
            return {
                slug,
                title: post.title,
                skipped: true,
                reason: 'No multiple H1 tags found',
                h1Count
            };
        }
        
        // Update the post with fixed lexical content
        await adminAPI.posts.edit({
            id: post.id,
            lexical: fixedLexical,
            updated_at: post.updated_at
        });
        
        return {
            slug,
            title: post.title,
            updated: true,
            changesCount,
            originalH1Count: h1Count
        };
        
    } catch (error) {
        return {
            slug,
            error: error.message
        };
    }
}

// Main function to process all articles
async function fixAllArticles() {
    console.log('Fixing H1 tags for all implicator.ai articles using Lexical format...\n');
    console.log('Total articles to process:', articlesWithMultipleH1s.length);
    console.log('Excluding: Morning Briefing articles\n');
    
    const results = {
        updated: [],
        skipped: [],
        errors: []
    };
    
    let totalH1sConverted = 0;
    
    // Process articles in batches
    const batchSize = 3;
    for (let i = 0; i < articlesWithMultipleH1s.length; i += batchSize) {
        const batch = articlesWithMultipleH1s.slice(i, i + batchSize);
        const batchPromises = batch.map(slug => processArticle(slug));
        
        const batchResults = await Promise.all(batchPromises);
        
        batchResults.forEach(result => {
            if (result.error) {
                results.errors.push(result);
            } else if (result.skipped) {
                results.skipped.push(result);
            } else if (result.updated) {
                results.updated.push(result);
                totalH1sConverted += result.changesCount;
            }
        });
        
        // Progress update
        console.log(`Processed ${Math.min(i + batchSize, articlesWithMultipleH1s.length)} of ${articlesWithMultipleH1s.length} articles...`);
        
        // Delay between batches
        if (i + batchSize < articlesWithMultipleH1s.length) {
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }
    
    // Display results
    console.log('\n=== FINAL RESULTS ===\n');
    
    console.log(`✅ Successfully updated: ${results.updated.length} articles`);
    console.log(`⏭️  Articles skipped: ${results.skipped.length}`);
    console.log(`❌ Errors: ${results.errors.length}`);
    console.log(`\n📊 Total H1 tags converted to H2: ${totalH1sConverted}`);
    
    if (results.updated.length > 0) {
        console.log('\n--- Successfully updated articles ---');
        results.updated.slice(0, 10).forEach(article => {
            console.log(`✅ ${article.title}`);
            console.log(`   Converted ${article.changesCount} H1(s) to H2`);
        });
        if (results.updated.length > 10) {
            console.log(`   ... and ${results.updated.length - 10} more articles`);
        }
    }
    
    if (results.skipped.length > 0) {
        console.log('\n--- Skipped articles (summary) ---');
        const skipReasons = {};
        results.skipped.forEach(article => {
            skipReasons[article.reason] = (skipReasons[article.reason] || 0) + 1;
        });
        Object.entries(skipReasons).forEach(([reason, count]) => {
            console.log(`⏭️  ${reason}: ${count} articles`);
        });
    }
    
    if (results.errors.length > 0) {
        console.log('\n--- Errors ---');
        results.errors.forEach(article => {
            console.log(`❌ ${article.slug}: ${article.error}`);
        });
    }
    
    console.log('\n=== H1 TAG FIX COMPLETE ===');
}

// Confirm before running
console.log('⚠️  WARNING: This script will update H1 tags in all articles.');
console.log('Press Ctrl+C to cancel, or wait 5 seconds to continue...\n');

setTimeout(() => {
    fixAllArticles().catch(console.error);
}, 5000);