import NewsArticle from '../models/NewsArticle.js';
import User from '../models/User.js';
import NotificationLog from '../models/NotificationLog.js';
import { broadcastBreakingNews } from './socketService.js';
import { sendNewsAlertEmail } from './emailService.js';

const SAMPLE_ARTICLES = [
    {
        title: 'Quantum Computing Breakthrough: 10,000 Qubit Processor Unveiled',
        description: 'Researchers have announced a major breakthrough in fault-tolerant quantum computing, achieving unprecedented coherence times.',
        category: 'Technology',
        source: 'TechCrunch',
        author: 'Elena Rostova',
        url: 'https://techcrunch.com/quantum-breakthrough',
        imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80',
        isBreaking: true,
        urgencyLevel: 'High',
    },
    {
        title: 'Global Energy Summit Reaches Landmark Accord on Renewable Grid Expansion',
        description: 'Representatives from over 80 nations signed an agreement to accelerate cross-border clean energy infrastructure development.',
        category: 'Politics',
        source: 'BBC News',
        author: 'James Sterling',
        url: 'https://bbc.com/news/energy-summit-accord',
        imageUrl: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=800&q=80',
        isBreaking: false,
        urgencyLevel: 'Medium',
    },
    {
        title: 'Championship Finals: Underdog Team Secures Historic Overtime Victory',
        description: 'In an unforgettable thriller, a last-second field goal crowned new champions after a dramatic 4-quarter comeback.',
        category: 'Sports',
        source: 'Reuters',
        author: 'Marcus Vance',
        url: 'https://reuters.com/sports/championship-finals',
        imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80',
        isBreaking: false,
        urgencyLevel: 'Low',
    },
    {
        title: 'Central Banks Announce Coordinated Interest Rate Adjustment',
        description: 'Financial markets rallied as global monetary authorities aligned strategies to address inflationary trends.',
        category: 'Business',
        source: 'Bloomberg',
        author: 'Sophia Chen',
        url: 'https://bloomberg.com/markets/central-banks-rate',
        imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80',
        isBreaking: true,
        urgencyLevel: 'High',
    },
    {
        title: 'Next-Gen Gene Therapy Approved for Rare Hereditary Conditions',
        description: 'Health regulatory authorities have granted landmark approval for a single-dose precision molecular therapy.',
        category: 'Health',
        source: 'CNN',
        author: 'Dr. Aris Thorne',
        url: 'https://cnn.com/health/gene-therapy-approval',
        imageUrl: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=800&q=80',
        isBreaking: false,
        urgencyLevel: 'Medium',
    },
    {
        title: 'James Webb Telescope Captures Deepest Image of Early Spiral Galaxies',
        description: 'Astronomers revealed stunning high-resolution spectral data confirming galaxy formation merely 300 million years post Big Bang.',
        category: 'Science',
        source: 'Associated Press',
        author: 'Dr. Clara Vance',
        url: 'https://apnews.com/science/webb-deep-space',
        imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
        isBreaking: false,
        urgencyLevel: 'Low',
    },
    {
        title: 'Blockbuster Film Festival Sets All-Time Attendance & Box Office Records',
        description: 'Independent films gained massive traction alongside international cinema showcases in a record-breaking week.',
        category: 'Entertainment',
        source: 'The Wall Street Journal',
        author: 'Leo Sterling',
        url: 'https://wsj.com/entertainment/film-festival-records',
        imageUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80',
        isBreaking: false,
        urgencyLevel: 'Low',
    },
];

export const seedInitialNews = async () => {
    const count = await NewsArticle.countDocuments();
    if (count === 0) {
        await NewsArticle.insertMany(SAMPLE_ARTICLES);
        console.log(`[NewsAggregator] Seeded ${SAMPLE_ARTICLES.length} initial news articles.`);
    }
};

export const triggerBreakingNewsAlert = async ({ category, customTitle, source, customDescription }) => {
    const selectedCategory = category || 'Technology';
    const selectedSource = source || 'PulseNews Wire';

    const defaultTitles = {
        Technology: 'Major AI Architecture Milestone Achieves Zero-Shot Automated Code Synthesis',
        Politics: 'Emergency Global Climate Accord Signed by 120 Heads of State',
        Sports: 'World Record Shattered in 100m Sprint at International Athletics Grand Prix',
        Business: 'Tech Giant Announces $50B Strategic Merger to Build Autonomous Infrastructure',
        Entertainment: 'Surprise Album Release Breaks Global Streaming Records Within 1 Hour',
        Health: 'Universal Vaccine Candidate Shows 98% Efficacy in Phase 3 Clinical Trials',
        Science: 'Fusion Energy Prototype Reaches Net Energy Gain Benchmark in Milestone Test',
    };

    const title = customTitle || defaultTitles[selectedCategory] || `Breaking Alert in ${selectedCategory}`;
    const description = customDescription || `Developing story: Major updates regarding ${title}. Authorities and reporters are currently on scene monitoring developments.`;

    const article = new NewsArticle({
        title,
        description,
        category: selectedCategory,
        source: selectedSource,
        author: 'Breaking News Desk',
        url: `https://pulsenews.live/breaking/${Date.now()}`,
        imageUrl: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=800&q=80',
        isBreaking: true,
        urgencyLevel: 'High',
        publishedAt: new Date(),
    });

    await article.save();

    // 1. Broadcast via Socket.io
    broadcastBreakingNews(article);

    // 2. Find all users subscribed to this category with Immediate email alert
    const matchingUsers = await User.find({
        subscribedCategories: selectedCategory,
        'channels.email': true,
    });

    const notificationPromises = matchingUsers.map(async (user) => {
        let emailResult = { success: false, previewUrl: null };

        if (user.channels.email && user.email) {
            emailResult = await sendNewsAlertEmail({
                toEmail: user.email,
                userTitle: user.name,
                article,
            });
        }

        const log = new NotificationLog({
            userId: user._id,
            userEmail: user.email,
            articleId: article._id,
            articleTitle: article.title,
            category: article.category,
            source: article.source,
            channel: 'Email',
            frequency: user.alertFrequency || 'Immediate',
            status: emailResult.success ? 'Sent' : 'Delivered',
            previewUrl: emailResult.previewUrl,
        });

        return log.save();
    });

    await Promise.all(notificationPromises);

    return {
        article,
        notificationsCount: matchingUsers.length,
    };
};
