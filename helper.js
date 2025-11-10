import { DateTime } from 'luxon';
import random from 'random';
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

function cleanAIResponse(responseText) {
    if (responseText.startsWith('```json')) {
        responseText = responseText.substring(7);
    }
    if (responseText.startsWith('```')) {
        responseText = responseText.substring(3);
    }
    if (responseText.endsWith('```')) {
        responseText = responseText.slice(0, -3);
    }

    responseText = responseText.trim();

    const jsonStart = responseText.indexOf('{');
    const jsonEnd = responseText.lastIndexOf('}') + 1;
    if (jsonStart !== -1 && jsonEnd !== 0) {
        responseText = responseText.substring(jsonStart, jsonEnd);
    }

    return responseText.trim();
}

function optimizeTitle(title) {
    if (!title) {
        return title;
    }

    if (title.length < 90 && !['!', '?', '🔥', '💯', '😱', '⚡'].some(char => title.includes(char))) {
        if (['SHOCKING', 'INSANE', 'UNBELIEVABLE'].some(word => title.toUpperCase().includes(word))) {
            title += ' 😱';
        } else if (['TOP', 'BEST', 'ULTIMATE'].some(word => title.toUpperCase().includes(word))) {
            title += ' 💯';
        } else if (['SECRET', 'HIDDEN', 'EXPOSED'].some(word => title.toUpperCase().includes(word))) {
            title += ' 🔥';
        } else {
            title += ' ⚡';
        }
    }

    return title.trim();
}

function optimizeDescription(description) {
    if (!description) {
        return description;
    }

    if (!['SUBSCRIBE', 'LIKE', 'COMMENT'].some(cta => description.toUpperCase().includes(cta))) {
        description += "\n\n👍 Don't forget to LIKE and SUBSCRIBE for more amazing content!";
    }

    if (!['👍', '🔔', '💬', '🔥', '✨'].some(emoji => description.includes(emoji))) {
        description = "🔥 " + description;
    }

    return description.trim();
}

function optimizeTags(tags) {
    if (!tags) {
        return tags;
    }

    const tagList = tags.split(',').map(tag => tag.trim()).filter(tag => tag);

    const seen = new Set();
    const uniqueTags = [];
    for (const tag of tagList) {
        if (!seen.has(tag.toLowerCase())) {
            seen.add(tag.toLowerCase());
            uniqueTags.push(tag);
        }
    }

    return uniqueTags.join(', ');
}

function detectCategory(prompt) {
    const promptLower = prompt.toLowerCase();

    const categories = {
        'gaming': ['game', 'gaming', 'esports', 'minecraft', 'fortnite', 'xbox', 'playstation', 'nintendo'],
        'technology': ['tech', 'ai', 'robot', 'gadget', 'phone', 'computer', 'software', 'programming'],
        'beauty': ['makeup', 'beauty', 'skincare', 'cosmetics', 'fashion', 'style', 'hair'],
        'cooking': ['recipe', 'cooking', 'food', 'kitchen', 'chef', 'restaurant', 'meal'],
        'travel': ['travel', 'trip', 'vacation', 'country', 'city', 'adventure', 'explore'],
        'education': ['learn', 'tutorial', 'guide', 'how to', 'education', 'study', 'course'],
        'entertainment': ['funny', 'comedy', 'movie', 'celebrity', 'reaction', 'meme'],
        'music': ['music', 'song', 'artist', 'album', 'concert', 'instrument', 'cover'],
        'fitness': ['workout', 'fitness', 'gym', 'exercise', 'health', 'training', 'muscle'],
        'business': ['business', 'entrepreneur', 'money', 'finance', 'investing', 'career'],
        'diy': ['diy', 'craft', 'build', 'make', 'project', 'home improvement'],
        'automotive': ['car', 'auto', 'vehicle', 'driving', 'mechanic', 'racing']
    };

    for (const category in categories) {
        if (categories[category].some(keyword => promptLower.includes(keyword))) {
            return category.charAt(0).toUpperCase() + category.slice(1);
        }
    }

    return 'General';
}

function generateAdvancedFallbackContent(prompt, errorDetails) {


    const category = detectCategory(prompt);

    const currentHour = DateTime.now().hour;
    const optimalTimes = {
        'Gaming': [15, 16, 17, 20, 21, 22],
        'Technology': [9, 10, 14, 15, 16],
        'Beauty': [6, 7, 8, 19, 20, 21],
        'Cooking': [11, 12, 17, 18, 19],
        'Travel': [12, 13, 14, 19, 20],
        'Education': [8, 9, 15, 16, 17],
        'Entertainment': [19, 20, 21],
        'Music': [16, 17, 20, 21, 22],
        'Fitness': [6, 7, 8, 17, 18, 19],
        'Business': [8, 9, 13, 14, 15]
    };

    const bestTimes = optimalTimes[category] || [12, 13, 19, 20];
    const recommendedTime = bestTimes[Math.floor(Math.random() * bestTimes.length)];

    const viralScores = {
        'Gaming': random.int(70, 90),
        'Technology': random.int(65, 85),
        'Beauty': random.int(75, 95),
        'Cooking': random.int(60, 80),
        'Travel': random.int(70, 90),
        'Education': random.int(55, 75),
        'Entertainment': random.int(80, 95),
        'Music': random.int(65, 85),
        'Fitness': random.int(60, 80),
        'Business': random.int(50, 70)
    };

    const viralScore = viralScores[category] || random.int(60, 80);

    const advancedTemplates = {
        'Gaming': {
            'title': `INSANE ${prompt} Strategy - Pro Gamers Don't Want You to Know! 🔥`,
            'description': `🎮 Discover the ultimate ${prompt} techniques that will transform your gameplay! This comprehensive guide reveals secrets used by top players worldwide.\n\n🔥 What you'll learn:\n• Advanced strategies and tactics\n• Pro tips and hidden mechanics\n• Common mistakes to avoid\n• Performance optimization tricks\n\n💥 Don't forget to SMASH that LIKE button and SUBSCRIBE for more gaming content!\n\n#gaming #${prompt.toLowerCase().replace(/ /g, '')} #protips #strategy #viral`,
            'tags': `${prompt.toLowerCase()}, gaming, strategy, pro tips, guide, tutorial, gameplay, esports, viral`
        },
        'Technology': {
            'title': `${prompt} in 2024 - This Changes EVERYTHING! (Mind Blown) 💯`,
            'description': `🚀 The complete breakdown of ${prompt} with cutting-edge insights and future predictions!\n\n✨ Key highlights:\n• Latest developments and trends\n• Expert analysis and reviews\n• Practical applications\n• Future predictions\n\n🔔 SUBSCRIBE and hit the notification bell for more tech content!\n\n#technology #${prompt.toLowerCase().replace(/ /g, '')} #tech2024 #innovation #trending`,
            'tags': `${prompt.toLowerCase()}, technology, tech, 2024, innovation, review, analysis, trending, future`
        },
        'Beauty': {
            'title': `Viral ${prompt} Transformation - Results Will SHOCK You! ✨`,
            'description': `💄 Amazing ${prompt} transformation that's breaking the internet!\n\n🌟 What's included:\n• Step-by-step tutorial\n• Product recommendations\n• Professional tips and tricks\n• Before and after results\n\n👍 LIKE if this helped you and SUBSCRIBE for more beauty content!\n\n#beauty #${prompt.toLowerCase().replace(/ /g, '')} #makeup #transformation #viral #glowup`,
            'tags': `${prompt.toLowerCase()}, beauty, makeup, transformation, tutorial, skincare, glowup, viral, trending`
        }
    };

    const template = advancedTemplates[category] || {
        'title': `Amazing ${prompt} - You Need to See This! ⚡`,
        'description': `🔥 Everything you need to know about ${prompt}! Complete guide with expert insights and practical tips.\n\n💡 Key points covered:\n• Comprehensive overview\n• Expert recommendations\n• Practical applications\n• Latest trends and updates\n\n👆 LIKE and SUBSCRIBE for more amazing content!\n\n#${prompt.toLowerCase().replace(/ /g, '')}`,
        'tags': `${prompt.toLowerCase()}, guide, tips, trending, viral, amazing, complete, tutorial`
    };

    return {
        'title': template['title'].substring(0, 100),
        'description': template['description'].substring(0, 5000),
        'tags': template['tags'].substring(0, 500),
        'ai_analysis': {
            'primary_category': category,
            'secondary_categories': [`${category} Tutorial`, `${category} Guide`],
            'category_confidence': '85%',
            'cross_category_appeal': '7'
        },
        'optimal_timing': {
            'best_posting_day': 'Wednesday',
            'optimal_time': `${recommendedTime}:00`,
            'timezone': 'EST',
            'posting_frequency': '2-3 times per week',
            'seasonal_factor': '8/10'
        },
        'performance_prediction': {
            'viral_probability': String(viralScore),
            'expected_engagement': 'High',
            'algorithm_score': String(random.int(75, 90)),
            'monetization_potential': 'Good'
        },
        'content_strategy': {
            'target_demographics': `${category} enthusiasts, 18-35 years old`,
            'trending_integration': 'Current trends incorporated',
            'thumbnail_suggestion': `Bold text overlay with ${category} imagery`,
            'series_potential': `Perfect for ${category} series`,
            'collaboration_opportunities': `${category} influencer partnerships`
        },
        'optimization_insights': {
            'keyword_strategy': `Focus on ${category.toLowerCase()} + trending keywords`,
            'engagement_tactics': 'Question hooks, call-to-actions, community posts',
            'algorithm_optimization': 'Optimized for YouTube algorithm preferences',
            'growth_recommendations': `Consistent ${category} content with viral elements`
        },
        'error': 'AI generation failed, using advanced intelligent fallback',
        'details': errorDetails
    };
}

async function generateHelper(prompt) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

        const systemPrompt = `
You are an ADVANCED AI Content Strategist with FULL AUTOMATION capabilities. You make ALL decisions about content optimization, category classification, timing, and strategy.

YOUR AI CAPABILITIES:
🤖 AUTOMATIC CATEGORY DETECTION: Analyze content and assign optimal category
⏰ INTELLIGENT TIMING: Determine best posting schedule based on category + trends
📊 TREND ANALYSIS: Real-time trending topic integration
🎯 AUDIENCE OPTIMIZATION: Auto-target demographics and psychographics
📈 PERFORMANCE PREDICTION: Estimate viral potential and engagement
🔄 CROSS-PLATFORM OPTIMIZATION: Adapt for YouTube, TikTok, Instagram

TOPIC TO ANALYZE: "${prompt}"

AI DECISION FRAMEWORK:

1. CATEGORY INTELLIGENCE:
   - Primary Category: Gaming, Tech, Beauty, Cooking, Travel, Education, Entertainment, Music, Sports, News, DIY, Business, Art, Automotive, Home, Family, Pets, Comedy, Social Media, Science, Fashion, Health, Finance, Politics
   - Sub-categories: Identify 2-3 relevant sub-niches
   - Cross-category appeal: Rate 1-10 for broader reach
   - Trending factor: Current trend strength in this category

2. TIMING INTELLIGENCE:
   - Optimal posting day: Monday-Sunday based on category analytics
   - Best posting time: Specific hour in target timezone
   - Seasonal relevance: How current trends affect timing
   - Competition analysis: Less saturated time slots
   - Global reach timing: Multi-timezone optimization

3. CONTENT INTELLIGENCE:
   - Viral probability: 1-100 score based on trending patterns
   - Target demographics: Age, gender, interests, behavior
   - Engagement prediction: Expected likes, comments, shares
   - Algorithm compatibility: YouTube algorithm optimization score
   - Monetization potential: Revenue generation capability

4. TREND INTELLIGENCE:
   - Current viral trends relevant to topic
   - Seasonal/holiday alignment opportunities  
   - News/event tie-in possibilities
   - Meme/culture integration potential
   - Influencer collaboration opportunities

CATEGORY-SPECIFIC OPTIMIZATION MATRIX:

🎮 GAMING: Peak times 3-6PM, 8-11PM | Target: 13-35, Male 65% | Trends: New releases, esports
💻 TECH: Peak times 9-11AM, 2-4PM | Target: 18-45, Male 70% | Trends: AI, gadgets, reviews
💄 BEAUTY: Peak times 6-9AM, 7-9PM | Target: 16-35, Female 80% | Trends: Skincare, makeup hacks
🍳 COOKING: Peak times 11AM-1PM, 5-7PM | Target: 25-55, Female 60% | Trends: Quick recipes, healthy
✈️ TRAVEL: Peak times 12-2PM, 7-9PM | Target: 20-40, Balanced | Trends: Budget travel, hidden gems
📚 EDUCATION: Peak times 8-10AM, 3-5PM | Target: 16-50, Balanced | Trends: Online learning, skills
🎬 ENTERTAINMENT: Peak times 7-9PM | Target: 13-30, Balanced | Trends: Celebrity, viral content
🎵 MUSIC: Peak times 4-6PM, 8-10PM | Target: 13-40, Balanced | Trends: New artists, covers
💪 FITNESS: Peak times 6-8AM, 5-7PM | Target: 18-45, Balanced | Trends: Home workouts, nutrition
💼 BUSINESS: Peak times 8-10AM, 1-3PM | Target: 25-50, Male 60% | Trends: Entrepreneurship, AI

INTELLIGENT CONTENT FORMULAS (AI-Selected):

🔥 VIRAL HOOKS: "This Changes Everything", "Nobody Talks About This", "I Tried X for 30 Days"
📊 PERFORMANCE BOOSTERS: Numbers, Questions, Controversy, Tutorials, Reviews
🎯 ENGAGEMENT TRIGGERS: Challenges, Reactions, Transformations, Secrets, Comparisons
💡 ALGORITHM HACKS: Trending keywords, Optimal length, CTR optimization, Watch time

AI AUTOMATION REQUIREMENTS:
✅ Auto-detect primary and secondary categories
✅ Auto-generate optimal posting schedule (day + time + timezone)
✅ Auto-integrate trending topics and keywords
✅ Auto-optimize for target demographics
✅ Auto-predict performance metrics
✅ Auto-suggest content strategy
✅ Auto-recommend posting frequency
✅ Auto-generate thumbnail suggestions
✅ Auto-create series/playlist recommendations
✅ Auto-optimize for monetization

RESPONSE FORMAT (Comprehensive AI Analysis):

{{
  "title": "AI-optimized viral title with trending elements",
  "description": "AI-crafted description with strategic keywords, hashtags, CTAs, and engagement hooks",
  "tags": "ai_selected_primary, trending_secondary, long_tail_specific, viral_hashtag, category_main, audience_targeted, seasonal_relevant, competitor_analysis",
  "ai_analysis": {{
    "primary_category": "AI-detected main category",
    "secondary_categories": ["sub-category-1", "sub-category-2"],
    "category_confidence": "percentage confidence in category selection",
    "cross_category_appeal": "1-10 score for broader reach potential"
  }},
  "optimal_timing": {{
    "best_posting_day": "AI-recommended day of week",
    "optimal_time": "AI-calculated best hour (24h format)",
    "timezone": "Target audience timezone",
    "posting_frequency": "AI-suggested posting schedule",
    "seasonal_factor": "Current seasonal relevance score"
  }},
  "performance_prediction": {{
    "viral_probability": "1-100 AI-calculated viral potential",
    "expected_engagement": "AI-predicted engagement level",
    "algorithm_score": "1-100 YouTube algorithm compatibility",
    "monetization_potential": "Revenue generation capability rating"
  }},
  "content_strategy": {{
    "target_demographics": "AI-identified primary audience",
    "trending_integration": "Current trends incorporated",
    "thumbnail_suggestion": "AI-recommended thumbnail concept",
    "series_potential": "Recommendation for content series",
    "collaboration_opportunities": "Suggested collaboration types"
  }},
  "optimization_insights": {{
    "keyword_strategy": "AI-selected keyword approach",
    "engagement_tactics": "Specific tactics to boost engagement",
    "algorithm_optimization": "YouTube algorithm optimization strategy",
    "growth_recommendations": "Channel growth recommendations"
  }}
}}

Generate the most intelligent, automated, and optimized YouTube content with complete AI decision-making!
`;
        const result = await model.generateContent(systemPrompt);
        const responseText = cleanAIResponse(result.response.text());
        const parsedResult = JSON.parse(responseText);

        const title = optimizeTitle(parsedResult.title || '');
        const description = optimizeDescription(parsedResult.description || '');
        const tags = optimizeTags(parsedResult.tags || '');

        return {
            title: title.substring(0, 100),
            description: description.substring(0, 5000),
            tags: tags.substring(0, 500),
            ai_analysis: parsedResult.ai_analysis || {},
            optimal_timing: parsedResult.optimal_timing || {},
            performance_prediction: parsedResult.performance_prediction || {},
            content_strategy: parsedResult.content_strategy || {},
            optimization_insights: parsedResult.optimization_insights || {}
        };

    } catch (e) {
        return generateAdvancedFallbackContent(prompt, `Generation error: ${e.message}`);
    }
}

// ... existing code ...

import axios from 'axios';
import * as cheerio from 'cheerio';

async function extractYoutubeTags(videoUrl) {
    let videoId = null;
    const patterns = [
        /(?:youtube\.com\/\S*[?&]v=|youtu\.be\/)([^&\n?#]*)/,
        /youtube\.com\/shorts\/([^?&#]*)/,
        /youtube\.com\/embed\/([^?&#]*)/
    ];

    for (const pattern of patterns) {
        const match = videoUrl.match(pattern);
        if (match) {
            videoId = match[1];
            break;
        }
    }

    if (!videoId) {
        return { success: false, message: 'Invalid YouTube URL' };
    }

    const headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    };

    try {
        const response = await axios.get(`https://www.youtube.com/watch?v=${videoId}`, { headers });
        if (response.status !== 200) {
            return { success: false, message: `Failed to fetch video page: ${response.status}` };
        }

        const $ = cheerio.load(response.data);

        // Try to find tags in the JSON-LD data
        const scriptTags = $('script');
        for (const script of scriptTags) {
            const scriptContent = $(script).html();
            if (scriptContent && scriptContent.includes('"keywords":[')) {
                try {
                    const jsonLdStart = scriptContent.indexOf('{"videoRenderer":');
                    if (jsonLdStart !== -1) {
                        const jsonLdEnd = scriptContent.indexOf('}</script>', jsonLdStart);
                        if (jsonLdEnd !== -1) {
                            const jsonLdString = scriptContent.substring(jsonLdStart, jsonLdEnd + 1);
                            const jsonData = JSON.parse(jsonLdString);
                            if (jsonData && jsonData.videoRenderer && jsonData.videoRenderer.keywords) {
                                const tags = jsonData.videoRenderer.keywords;
                                if (tags && tags.length > 0) {
                                    return { success: true, tags: tags };
                                }
                            }
                        }
                    }
                } catch (e) {
                    console.error(`Error parsing JSON-LD: ${e.message}`);
                }
            }
        }

        // Fallback to meta tags
        const metaKeywords = $('meta[name="keywords"]');
        if (metaKeywords.length > 0 && metaKeywords.attr('content')) {
            const tags = metaKeywords.attr('content').split(',').map(tag => tag.trim());
            return { success: true, tags: tags };
        }

        return { success: false, message: 'No tags found in video metadata' };

    } catch (e) {
        return { success: false, message: `Error extracting tags: ${e.message}` };
    }
}

// ... existing code ...

async function generateKGR(prompt) {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    const systemPrompt = (
        "Generate a list of trending YouTube tags that are KGR (Keyword Golden Ratio) type keywords. " +
        "The tags should be highly professional and focus on high-value (expensive) topics, suitable for monetization and attracting premium advertisers. " +
        "Return only the tags as a JSON array. Do not include any other text."
    );
    const fullPrompt = `${systemPrompt}\nTopic: ${prompt}`;
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    let keywords = [];
    try {
        keywords = JSON.parse(response.text());
    } catch (e) {
        const match = response.text().match(/(\[.*?\])/s);
        if (match) {
            try {
                keywords = JSON.parse(match[1]);
            } catch (parseError) {
                console.error("Error parsing KGR JSON from regex match:", parseError);
            }
        } else {
            console.error("No JSON array found in KGR response:", response.text());
        }
    }
    return keywords;
}

export { generateHelper, extractYoutubeTags, generateKGR };