import NewsArticle from '../models/NewsArticle.js';
import User from '../models/User.js';
import NotificationLog from '../models/NotificationLog.js';
import { broadcastBreakingNews } from './socketService.js';
import { sendNewsAlertEmail, sendDigestEmail } from './emailService.js';
import { sendPushNotification } from './pushService.js';
import { fetchLiveRssNews } from './rssService.js';

const SAMPLE_ARTICLES = [
    // --- INDIA ---
    {
        title: 'High-Speed Railway Expansion Project Approved for Major Transit Corridors',
        description: 'The Cabinet Committee on Infrastructure has approved a multi-billion dollar high-speed rail corridor connecting key economic hubs, promising 50% reduced travel times.',
        content: `In a landmark decision for national transport infrastructure, the Cabinet Committee on Economic Affairs today approved the phased expansion of high-speed rail networks across key industrial corridors.\n\nThe initial phase will cover over 1,200 kilometers of high-speed track, incorporating European Train Control System (ETCS) Level 2 signaling and indigenous anti-collision technology. Officials confirmed construction will begin early next year, generating an estimated 250,000 direct and indirect jobs.\n\nIndustry leaders welcomed the announcement, citing immense benefits for logistics, regional commerce, and reduced carbon emissions across primary transit belts.`,
        category: 'India',
        source: 'Times News Desk',
        author: 'Rajesh Sharma',
        url: 'https://timesofindia.indiatimes.com/india/high-speed-railway-expansion-corridor/articleshow/10000001.cms',
        imageUrl: 'https://images.unsplash.com/photo-1541427468627-a89a96e5ca1d?auto=format&fit=crop&w=800&q=80',
        isBreaking: true,
        urgencyLevel: 'High',
    },
    {
        title: 'National Digital Identity Platform Crosses 1.4 Billion Verified Profiles',
        description: 'MeitY announced a major milestone as the national unified digital authentication framework processes over 90 million daily transaction verifications.',
        content: `The Ministry of Electronics & IT today announced that the nation's digital public infrastructure has reached an unprecedented scale, registering 1.4 billion active citizen records.\n\nThe platform now underpins digital banking, healthcare access, tax filings, and social security distribution. International observers have lauded the system as a global benchmark for scalable, low-cost digital governance.`,
        category: 'India',
        source: 'Times News Desk',
        author: 'Priya Sundaram',
        url: 'https://timesofindia.indiatimes.com/tech/digital-identity-milestone/articleshow/10000002.cms',
        imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
        isBreaking: false,
        urgencyLevel: 'Medium',
    },
    {
        title: 'Solar Mission Achieves 100 GW Target 18 Months Ahead of Deadline',
        description: 'Renewable energy total installed capacity reaches new peak following mega solar park commissioning in western arid regions.',
        content: `The National Renewable Mission achieved a historic milestone today as cumulative grid-tied solar capacity crossed 100 Gigawatts.\n\nThe milestone was unlocked following the synchronization of a 2,500 MW ultra-mega solar project. Officials confirmed renewable energy now accounts for over 42% of total national installed power generation capacity.`,
        category: 'India',
        source: 'Times News Desk',
        author: 'Anil Kumar',
        url: 'https://timesofindia.indiatimes.com/india/solar-target-achieved/articleshow/10000003.cms',
        imageUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80',
        isBreaking: false,
        urgencyLevel: 'Low',
    },

    // --- WORLD ---
    {
        title: 'Global Summit Unveils Historic AI Governance Protocol Signed by 65 Nations',
        description: 'World leaders assemble in Geneva to sign binding framework governing autonomous systems, safety benchmarks, and deepfake verification.',
        content: `Delegates from 65 sovereign states have formally ratified the International Artificial Intelligence Safety Agreement following three days of intense negotiations in Geneva.\n\nThe treaty mandates mandatory red-teaming for frontier AI models exceeding threshold compute limits, establishes sovereign watermark standards for generated media, and forbids autonomous military deployments without human oversight.\n\nUN representatives hailed the accord as the most comprehensive technology treaty since the dawn of the internet era.`,
        category: 'World',
        source: 'Global News Wire',
        author: 'Elena Rostova',
        url: 'https://www.bbc.com/news/world-ai-governance-summit',
        imageUrl: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=800&q=80',
        isBreaking: true,
        urgencyLevel: 'High',
    },
    {
        title: 'Pacific Rim Trade Pact Expanded to Include 4 New Emerging Market Economies',
        description: 'Multilateral trade agreements gain momentum as zero-tariff trade zones open up for agricultural and semiconductor supply chains.',
        content: `Ministers from 12 Pacific nations agreed today to admit four candidate economies into the comprehensive free trade area.\n\nThe historic expansion is expected to lower import tariffs on microelectronics, sustainable agriculture, and critical raw minerals across member territories by up to 85% over five years.`,
        category: 'World',
        source: 'Global News Wire',
        author: 'Marcus Vance',
        url: 'https://www.bbc.com/news/world-pacific-trade-pact',
        imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
        isBreaking: false,
        urgencyLevel: 'Medium',
    },

    // --- TECHNOLOGY ---
    {
        title: 'Quantum Computing Breakthrough: 10,000 Qubit Fault-Tolerant Processor Unveiled',
        description: 'Researchers achieve 99.9% gate fidelity with topological qubits, opening doors for real-world molecular simulation and drug design.',
        content: `Quantum hardware pioneer Q-Labs unveiled its flagship 10,000-qubit processor today, demonstrating room-temperature error suppression for over 15 minutes.\n\nIn benchmark tests, the chip completed complex molecular folding simulations in 4 seconds—a calculation that would require classical supercomputers over 10,000 years to compute.\n\nPharmaceutical partners are slated to begin early access trials next quarter for target oncology therapies.`,
        category: 'Technology',
        source: 'Tech Frontier',
        author: 'Dr. Evelyn Reed',
        url: 'https://techcrunch.com/quantum-processor-breakthrough',
        imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80',
        isBreaking: true,
        urgencyLevel: 'High',
    },
    {
        title: 'Next-Generation Solid-State Battery Promises 1,000 KM Range & 10-Min Charge',
        description: 'Energy storage startup validates silicon-anode solid electrolyte cells with zero capacity degradation after 2,000 fast charge cycles.',
        content: `Commercialization of solid-state EV batteries reached a tipping point today as independent testing laboratories validated a 450 Wh/kg energy density battery cell.\n\nThe chemistry utilizes non-flammable solid electrolytes and pure lithium metal anodes, allowing automotive manufacturers to double driving range while eliminating thermal runaway risks completely.`,
        category: 'Technology',
        source: 'Tech Frontier',
        author: 'David Vance',
        url: 'https://techcrunch.com/solid-state-battery-breakthrough',
        imageUrl: 'https://images.unsplash.com/photo-1558441719-6705546fe3b7?auto=format&fit=crop&w=800&q=80',
        isBreaking: false,
        urgencyLevel: 'Medium',
    },
    {
        title: 'Autonomous Drone Logistics Fleet Granted Full Commercial Flight Clearance',
        description: 'Aviation regulators approve Beyond Visual Line of Sight (BVLOS) medical delivery corridors across 15 urban metropolitan areas.',
        content: `Civil aviation authorities today issued full commercial operator certificates to autonomous cargo drones for express organ and blood sample transit.\n\nThe quad-rotor aircraft operate on encrypted 5G satellite links, featuring real-time collision avoidance radars and automated ballistic parachute recovery systems.`,
        category: 'Technology',
        source: 'Tech Frontier',
        author: 'Samantha Lee',
        url: 'https://techcrunch.com/autonomous-drone-clearance',
        imageUrl: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=80',
        isBreaking: false,
        urgencyLevel: 'Low',
    },

    // --- BUSINESS & MARKETS ---
    {
        title: 'Sensex & Nifty Hit All-Time Highs as Foreign Institutional Inflows Cross $5 Billion',
        description: 'Strong corporate earnings, infrastructure spending, and resilient GDP growth forecasts rally domestic equity benchmarks.',
        content: `Equity markets scaled unprecedented highs today as the benchmark index surged past 82,500 points, propelled by banking, technology, and auto stocks.\n\nForeign institutional investors (FIIs) turned net buyers for the seventh consecutive session, injecting over $1.2 billion in a single day.\n\nMarket analysts attribute the bullish momentum to solid Q2 earnings guidance and strong retail SIP participation.`,
        category: 'Business',
        source: 'Market Pulse Wire',
        author: 'Vikram Mehta',
        url: 'https://timesofindia.indiatimes.com/business/sensex-nifty-all-time-high/articleshow/10000004.cms',
        imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80',
        isBreaking: true,
        urgencyLevel: 'High',
    },
    {
        title: 'Global Semiconductor Consortium Announces $40 Billion Clean Energy Chip Plant',
        description: 'New manufacturing megasite will leverage 100% solar and hydrogen power to manufacture sub-2nm nodes for AI acceleration.',
        content: `Leading chipmakers have united to construct a zero-carbon wafer fabrication facility scheduled to open in 2028.\n\nThe plant will produce sub-2 nanometer EUV-patterned microprocessors powered exclusively by on-site green hydrogen generation and rooftop solar arrays.`,
        category: 'Business',
        source: 'Market Pulse Wire',
        author: 'Sophia Chen',
        url: 'https://www.bloomberg.com/news/articles/semiconductor-megafab-announcement',
        imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
        isBreaking: false,
        urgencyLevel: 'Medium',
    },

    // --- POLITICS ---
    {
        title: 'Parliament Passes Benchmark Cyber Defense & Consumer Privacy Protection Bill',
        description: 'Unanimous bipartisan vote introduces strict penalties for data breaches, AI voice cloning fraud, and unauthorized biometric harvesting.',
        content: `The Digital Security & Privacy Act passed its final parliamentary vote today with cross-party consensus.\n\nThe legislative package mandates mandatory data encryption standards for cloud providers, establishes a statutory Data Protection Authority, and penalizes unauthorized deepfake voice synthesis with up to 7 years imprisonment.`,
        category: 'Politics',
        source: 'Global News Wire',
        author: 'Karan Thapar',
        url: 'https://www.bbc.com/news/world-cyber-defense-bill-passed',
        imageUrl: 'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&w=800&q=80',
        isBreaking: false,
        urgencyLevel: 'High',
    },

    // --- SPORTS ---
    {
        title: 'World Cup Thriller: Spectacular Last-Ball Six Secures Historic Championship Win',
        description: 'In an unforgettable final overs drama, national squad defends 280 runs to lift the global trophy before 95,000 cheering fans.',
        content: `In what sports commentators are calling the greatest white-ball final of the decade, the national team triumphed in a heart-stopping last-over thriller.\n\nNeeding 12 runs off the final two deliveries, vice-captain Rahul Verma dispatched two consecutive soaring maximums over long-on, sparking wild celebrations across the stadium.`,
        category: 'Sports',
        source: 'Prime Sports Wire',
        author: 'Rohan Gavaskar',
        url: 'https://timesofindia.indiatimes.com/sports/world-cup-thriller-victory/articleshow/10000005.cms',
        imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80',
        isBreaking: true,
        urgencyLevel: 'High',
    },
    {
        title: 'Grand Slam Final: Young Prodigy Overcomes World No. 1 in Straight Sets',
        description: '19-year-old tennis star displays masterclass baseline play and 220 km/h serves to claim maiden major title.',
        content: `A new star was crowned on Centre Court today as 19-year-old sensation Maya Lin stunned the reigning champion in straight sets 6-4, 7-5, 6-3.\n\nLin recorded 45 winners and converted 5 out of 6 break points in a flawless display of tactical court movement.`,
        category: 'Sports',
        source: 'Prime Sports Wire',
        author: 'Claire Sterling',
        url: 'https://www.bbc.com/sport/tennis/grand-slam-prodigy-champion',
        imageUrl: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=800&q=80',
        isBreaking: false,
        urgencyLevel: 'Medium',
    },

    // --- SCIENCE & HEALTH ---
    {
        title: 'Universal Cancer Vaccine Shows 94% Tumor Suppression in Phase 3 Clinical Trial',
        description: 'mRNA therapy targeting shared neoantigens prompts durable immune response across melanoma and lung carcinoma patient groups.',
        content: `Medical researchers presented groundbreaking Phase 3 clinical trial results at the International Oncology Congress today.\n\nThe therapeutic mRNA vaccine, administered alongside standard checkpoint inhibitors, reduced 3-year recurrence rates by 94% among high-risk post-resection patients.\n\nRegulators have granted fast-track priority review for commercial manufacturing rollout by late 2026.`,
        category: 'Health',
        source: 'Health Digest',
        author: 'Dr. Aris Thorne',
        url: 'https://www.reuters.com/business/healthcare-pharmaceuticals/universal-cancer-vaccine-trial',
        imageUrl: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=800&q=80',
        isBreaking: true,
        urgencyLevel: 'High',
    },
    {
        title: 'Deep Space Telescope Discovers Water Vapor Atmosphere on Earth-Sized Exoplanet',
        description: 'Spectroscopic analysis of planet K2-18b confirms atmospheric methane, carbon dioxide, and liquid ocean surface signatures.',
        content: `Astronomers analyzing data from the Next-Gen Space Telescope confirmed today the detection of water vapor spectral lines around a rocky exoplanet orbiting within its star's habitable zone 120 light-years away.\n\nThe atmosphere exhibits rich carbon-based signatures without greenhouse runaway conditions, marking the most promising candidate for bio-signature exploration to date.`,
        category: 'Science',
        source: 'Science Frontier',
        author: 'Dr. Clara Vance',
        url: 'https://www.reuters.com/technology/space/exoplanet-atmosphere-discovery',
        imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
        isBreaking: false,
        urgencyLevel: 'Medium',
    },

    // --- ENTERTAINMENT ---
    {
        title: 'Sci-Fi Epic Breaks All-Time Global Box Office Records with $1.4 Billion Opening',
        description: 'Cinematic visual masterpiece directs record audience turnouts across IMAX 3D and premium large format theaters worldwide.',
        content: `Director Sarah Jenkins' epic space opera 'Starlight Horizon' shattered global box office benchmarks this weekend, accumulating $1.42 billion worldwide.\n\nLauded for groundbreaking practical effects, immersive Dolby Atmos sound design, and an original orchestral score, the film achieved 98% positive audience review scores.`,
        category: 'Entertainment',
        source: 'Pulse Entertainment',
        author: 'Leo Sterling',
        url: 'https://www.reuters.com/lifestyle/scifi-boxoffice-record',
        imageUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80',
        isBreaking: false,
        urgencyLevel: 'Low',
    },
];

export const seedInitialNews = async () => {
    // Delete any old placeholder articles containing pulsenews.live
    await NewsArticle.deleteMany({ url: /pulsenews\.live/i });

    const count = await NewsArticle.countDocuments();
    if (count < 10) {
        await NewsArticle.insertMany(SAMPLE_ARTICLES);
        console.log(`[NewsAggregator] Seeded ${SAMPLE_ARTICLES.length} rich initial news articles with working wire links.`);
    }

    // Trigger live RSS and Webz.io fetch in background
    try {
        await fetchLiveRssNews();
    } catch (e) {
        console.warn('[NewsAggregator] Live RSS fetch background attempt skipped:', e.message);
    }
};

export const triggerBreakingNewsAlert = async ({ category, customTitle, source, customDescription, existingArticle }) => {
    const selectedCategory = category || 'Technology';
    const selectedSource = source || 'Pulse Live Desk';

    const defaultTitles = {
        India: 'Major Infrastructure & Connectivity Milestone Unveiled in Capital Corridor',
        World: 'Emergency Global Climate & Clean Energy Accord Signed in Geneva Summit',
        Technology: 'Major AI Architecture Milestone Achieves Zero-Shot Automated Code Synthesis',
        Politics: 'Emergency Parliamentary Session Convened for Landmark Economic Reform Bill',
        Sports: 'World Record Shattered in 100m Sprint at International Athletics Grand Prix',
        Business: 'Markets Rally as Central Banks Coordinate Monetary Stabilizing Policy',
        Entertainment: 'Surprise World Premiere Announcement Breaks Global Online Streaming Records',
        Health: 'Universal Vaccine Candidate Shows 98% Efficacy in Phase 3 Clinical Trials',
        Science: 'Fusion Energy Prototype Reaches Net Energy Gain Benchmark in Milestone Test',
    };

    let article = existingArticle;

    if (!article) {
        const title = customTitle || defaultTitles[selectedCategory] || `Breaking Alert in ${selectedCategory}`;
        const description = customDescription || `Developing story: Major updates regarding ${title}. Reporters and broadcast teams are currently on scene monitoring developments.`;
        const googleNewsUrl = `https://news.google.com/search?q=${encodeURIComponent(title)}`;

        article = new NewsArticle({
            title,
            description,
            content: `${description}\n\nLive coverage is active across our broadcast networks. Updates will follow as official statements are released by key authorities.`,
            category: selectedCategory,
            source: selectedSource,
            author: 'Breaking News Desk',
            url: googleNewsUrl,
            imageUrl: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=800&q=80',
            isBreaking: true,
            urgencyLevel: 'High',
            publishedAt: new Date(),
        });

        await article.save();
    }

    // 1. Broadcast via Socket.io
    broadcastBreakingNews(article);

    // 2. Find all matching users subscribed to this category
    const matchingUsers = await User.find({
        subscribedCategories: selectedCategory,
    });

    const notificationPromises = matchingUsers.map(async (user) => {
        let emailResult = { success: false, previewUrl: null };

        if (user.channels?.email && user.email) {
            emailResult = await sendNewsAlertEmail({
                toEmail: user.email,
                userTitle: user.name,
                article,
                unsubscribeToken: user.unsubscribeToken,
            });
        }

        if (user.channels?.push && user.pushSubscription) {
            try {
                await sendPushNotification(user.pushSubscription, {
                    title: `🚨 Breaking [${article.category}]`,
                    body: article.title,
                    url: article.url,
                });
            } catch (err) {
                console.warn(`[PushService] Failed for ${user.email}:`, err.message);
            }
        }

        await NotificationLog.create({
            userId: user._id,
            userEmail: user.email,
            articleId: article._id,
            articleTitle: article.title,
            category: article.category,
            channel: 'email',
            status: emailResult.success ? 'sent' : 'failed',
            emailMessageId: emailResult.messageId || null,
        });
    });

    await Promise.allSettled(notificationPromises);

    return {
        success: true,
        article,
        notificationsSent: matchingUsers.length,
    };
};

export const processHourlyDigests = async () => {
    try {
        console.log('[Cron Job] Executing processHourlyDigests...');
        const users = await User.find({ alertFrequency: 'Hourly', 'channels.email': true });
        if (users.length === 0) return;

        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

        for (const user of users) {
            const categories = user.subscribedCategories && user.subscribedCategories.length > 0
                ? user.subscribedCategories
                : ['Technology', 'World', 'India'];

            const articles = await NewsArticle.find({
                category: { $in: categories },
                createdAt: { $gte: oneHourAgo },
            }).limit(5);

            if (articles.length > 0) {
                await sendDigestEmail({
                    toEmail: user.email,
                    userTitle: user.name,
                    articles,
                    digestType: 'Hourly',
                    unsubscribeToken: user.unsubscribeToken,
                });

                await NotificationLog.create({
                    userId: user._id,
                    userEmail: user.email,
                    articleId: articles[0]._id,
                    articleTitle: `Hourly Digest (${articles.length} stories)`,
                    category: 'Digest',
                    channel: 'email',
                    status: 'sent',
                });
            }
        }
    } catch (err) {
        console.error('[Cron Job] processHourlyDigests error:', err.message);
    }
};

export const processDailyDigests = async () => {
    try {
        console.log('[Cron Job] Executing processDailyDigests...');
        const users = await User.find({ alertFrequency: 'Daily', 'channels.email': true });
        if (users.length === 0) return;

        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

        for (const user of users) {
            const categories = user.subscribedCategories && user.subscribedCategories.length > 0
                ? user.subscribedCategories
                : ['Technology', 'World', 'India', 'Business'];

            const articles = await NewsArticle.find({
                category: { $in: categories },
                createdAt: { $gte: twentyFourHoursAgo },
            }).limit(10);

            if (articles.length > 0) {
                await sendDigestEmail({
                    toEmail: user.email,
                    userTitle: user.name,
                    articles,
                    digestType: 'Daily',
                    unsubscribeToken: user.unsubscribeToken,
                });

                await NotificationLog.create({
                    userId: user._id,
                    userEmail: user.email,
                    articleId: articles[0]._id,
                    articleTitle: `Daily Briefing (${articles.length} stories)`,
                    category: 'Digest',
                    channel: 'email',
                    status: 'sent',
                });
            }
        }
    } catch (err) {
        console.error('[Cron Job] processDailyDigests error:', err.message);
    }
};
