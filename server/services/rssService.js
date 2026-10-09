import Parser from 'rss-parser';
import axios from 'axios';
import NewsArticle from '../models/NewsArticle.js';
import { triggerBreakingNewsAlert } from './newsAggregator.js';

const parser = new Parser({
    customFields: {
        item: [
            ['media:content', 'mediaContent'],
            ['enclosure', 'enclosure'],
            ['content:encoded', 'contentEncoded'],
        ],
    },
});

const RSS_FEEDS = [
    {
        url: 'https://timesofindia.indiatimes.com/rssfeedstopstories.cms',
        category: 'India',
        sourceName: 'Times News Desk',
        defaultImage: 'https://images.unsplash.com/photo-1541427468627-a89a96e5ca1d?auto=format&fit=crop&w=800&q=80',
    },
    {
        url: 'https://feeds.bbci.co.uk/news/world/rss.xml',
        category: 'World',
        sourceName: 'Global News Wire',
        defaultImage: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=800&q=80',
    },
    {
        url: 'https://timesofindia.indiatimes.com/rssfeeds/66949542.cms',
        category: 'Technology',
        sourceName: 'Tech Frontier',
        defaultImage: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80',
    },
    {
        url: 'https://timesofindia.indiatimes.com/rssfeeds/4719148.cms',
        category: 'Business',
        sourceName: 'Market Pulse Wire',
        defaultImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80',
    },
    {
        url: 'https://timesofindia.indiatimes.com/rssfeeds/4719161.cms',
        category: 'Sports',
        sourceName: 'Prime Sports Wire',
        defaultImage: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80',
    },
];

export const fetchWebzNews = async () => {
    const webzKey = process.env.WEBZ_API_KEY || '';
    if (!webzKey) return 0;

    let savedCount = 0;
    try {
        console.log('[Webz.io] Querying Webz.io Live News API...');
        const response = await axios.get(`https://api.webz.io/api/news`, {
            params: {
                token: webzKey,
                q: '*',
                sort: 'crawled',
                format: 'json',
                size: 10,
                webz_reporter: 'true',
                includeSyndicated: 'false',
                allowNewsHistory: 'false',
            },
            timeout: 10000,
        });

        const posts = response.data?.posts || [];
        for (const post of posts) {
            const title = post.title ? post.title.trim() : null;
            if (!title || !post.url) continue;

            const existing = await NewsArticle.findOne({ url: post.url });
            if (!existing) {
                let description = post.text || post.highlightText || title;
                description = description.replace(/<[^>]*>?/gm, '').slice(0, 320);

                const thread = post.thread || {};
                const sourceName = thread.site || 'Webz News Wire';
                const imgUrl = thread.main_image || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=800&q=80';

                // Determine category based on content keywords
                let category = 'World';
                const textLower = (title + ' ' + description).toLowerCase();
                if (textLower.includes('india') || thread.country === 'IN') category = 'India';
                else if (textLower.includes('tech') || textLower.includes('ai') || textLower.includes('software')) category = 'Technology';
                else if (textLower.includes('sport') || textLower.includes('football') || textLower.includes('cricket')) category = 'Sports';
                else if (textLower.includes('market') || textLower.includes('stock') || textLower.includes('economy')) category = 'Business';

                const isBreaking = /breaking|urgent|emergency|alert|just in|landmark/i.test(title + ' ' + description);

                const article = new NewsArticle({
                    title,
                    description,
                    content: post.text || description,
                    category,
                    source: sourceName,
                    author: post.author || 'Webz Journalist Desk',
                    url: post.url,
                    imageUrl: imgUrl,
                    publishedAt: post.published ? new Date(post.published) : new Date(),
                    isBreaking,
                    urgencyLevel: isBreaking ? 'High' : 'Medium',
                });

                await article.save();
                savedCount++;

                if (isBreaking) {
                    try {
                        await triggerBreakingNewsAlert({
                            category: article.category,
                            customTitle: article.title,
                            source: article.source,
                            customDescription: article.description,
                            existingArticle: article,
                        });
                    } catch (err) {
                        console.warn('[Webz.io] Auto breaking alert trigger skipped:', err.message);
                    }
                }
            }
        }
        console.log(`[Webz.io] Successfully processed Webz.io news feed, saved ${savedCount} new posts.`);
    } catch (err) {
        console.warn('[Webz.io] Webz.io API fetch error:', err.message);
    }
    return savedCount;
};

export const fetchLiveRssNews = async () => {
    let totalFetched = 0;
    let newInserted = 0;

    // Fetch Webz.io news first
    newInserted += await fetchWebzNews();

    for (const feedConfig of RSS_FEEDS) {
        try {
            const feed = await parser.parseURL(feedConfig.url);
            if (!feed.items || feed.items.length === 0) continue;

            for (const item of feed.items.slice(0, 10)) {
                totalFetched++;

                const title = item.title ? item.title.trim() : 'Live News Update';
                let description = item.contentSnippet || item.content || item.title || 'Developing story details...';
                description = description.replace(/<[^>]*>?/gm, '').slice(0, 320);

                if (!item.link || !title) continue;

                const existing = await NewsArticle.findOne({ url: item.link });
                if (!existing) {
                    let imgUrl = feedConfig.defaultImage;
                    if (item.enclosure && item.enclosure.url) {
                        imgUrl = item.enclosure.url;
                    } else if (item.mediaContent && item.mediaContent.$ && item.mediaContent.$.url) {
                        imgUrl = item.mediaContent.$.url;
                    }

                    const isKeywordBreaking = /breaking|urgent|emergency|alert|just in|landmark/i.test(title + ' ' + description);
                    const isBreaking = isKeywordBreaking || (totalFetched % 5 === 0);

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
                        isBreaking,
                        urgencyLevel: isBreaking ? 'High' : 'Medium',
                    });

                    await article.save();
                    newInserted++;

                    if (isBreaking) {
                        try {
                            await triggerBreakingNewsAlert({
                                category: article.category,
                                customTitle: article.title,
                                source: article.source,
                                customDescription: article.description,
                                existingArticle: article,
                            });
                        } catch (err) {
                            console.warn('[RSS Service] Auto breaking alert dispatch failed:', err.message);
                        }
                    }
                }
            }
        } catch (err) {
            console.warn(`[RSS Service] Could not fetch feed ${feedConfig.url}:`, err.message);
        }
    }

    console.log(`[RSS Service] Ingestion complete: ${totalFetched} items processed, ${newInserted} new articles saved.`);
    return { totalFetched, newInserted };
};
