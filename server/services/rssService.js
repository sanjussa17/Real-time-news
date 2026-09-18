import Parser from 'rss-parser';
import NewsArticle from '../models/NewsArticle.js';

const parser = new Parser({
    customFields: {
        item: [
            ['media:content', 'mediaContent'],
            ['enclosure', 'enclosure'],
            ['content:encoded', 'contentEncoded'],
        ],
    },
});

// RSS Feeds from reputable news sources (Mapped with clean generic source labels to respect branding guidelines)
const RSS_FEEDS = [
    {
        url: 'https://timesofindia.indiatimes.com/rssfeedstopstories.cms',
        category: 'India',
        sourceName: 'Times News Desk',
        defaultImage: 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?auto=format&fit=crop&w=800&q=80',
    },
    {
        url: 'https://timesofindia.indiatimes.com/rssfeeds/4719148.cms',
        category: 'Business',
        sourceName: 'Market Pulse Wire',
        defaultImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80',
    },
    {
        url: 'https://timesofindia.indiatimes.com/rssfeeds/66949542.cms',
        category: 'Technology',
        sourceName: 'Tech Frontier',
        defaultImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    },
    {
        url: 'https://timesofindia.indiatimes.com/rssfeeds/4719161.cms',
        category: 'Sports',
        sourceName: 'Prime Sports Wire',
        defaultImage: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80',
    },
    {
        url: 'https://feeds.bbci.co.uk/news/world/rss.xml',
        category: 'World',
        sourceName: 'Global News Wire',
        defaultImage: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=800&q=80',
    },
];

export const fetchLiveRssNews = async () => {
    let totalFetched = 0;
    let newInserted = 0;

    for (const feedConfig of RSS_FEEDS) {
        try {
            const feed = await parser.parseURL(feedConfig.url);
            if (!feed.items || feed.items.length === 0) continue;

            for (const item of feed.items.slice(0, 10)) {
                totalFetched++;

                // Clean title and description
                const title = item.title ? item.title.trim() : 'Live News Update';
                let description = item.contentSnippet || item.content || item.title || 'Developing story details...';
                description = description.replace(/<[^>]*>?/gm, '').slice(0, 280);

                if (!item.link || !title) continue;

                // Check if article already exists
                const existing = await NewsArticle.findOne({ url: item.link });
                if (!existing) {
                    // Extract image url if present in enclosure or mediaContent
                    let imgUrl = feedConfig.defaultImage;
                    if (item.enclosure && item.enclosure.url) {
                        imgUrl = item.enclosure.url;
                    } else if (item.mediaContent && item.mediaContent.$ && item.mediaContent.$.url) {
                        imgUrl = item.mediaContent.$.url;
                    }

                    const article = new NewsArticle({
                        title,
                        description,
                        content: item.contentEncoded || item.content || description,
                        category: feedConfig.category,
                        source: feedConfig.sourceName,
                        author: item.creator || item.author || 'Senior News Bureau',
                        url: item.link,
                        imageUrl: imgUrl,
                        publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
                        isBreaking: totalFetched % 4 === 0, // Mark every 4th as breaking news highlight
                        urgencyLevel: totalFetched % 4 === 0 ? 'High' : 'Medium',
                    });

                    await article.save();
                    newInserted++;
                }
            }
        } catch (err) {
            console.warn(`[RSS Service] Could not fetch feed ${feedConfig.url}:`, err.message);
        }
    }

    console.log(`[RSS Service] Ingestion complete: ${totalFetched} items processed, ${newInserted} new articles saved.`);
    return { totalFetched, newInserted };
};
