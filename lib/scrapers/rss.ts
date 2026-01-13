import RSSParser from "rss-parser";
import type { GrantData } from "./types";

const parser = new RSSParser({
  timeout: 30000,
  headers: {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
  },
});

/**
 * Parse RSS feed and convert to GrantData format
 */
export async function parseRSSFeed(
  feedUrl: string,
  options: {
    source: string;
    organization: string;
    category: string[];
    location?: string;
    defaultLocation?: string;
    filterFn?: (item: any) => boolean;
  }
): Promise<GrantData[]> {
  const grants: GrantData[] = [];

  try {
    const feed = await parser.parseURL(feedUrl);

    if (!feed.items || feed.items.length === 0) {
      console.log(`No items found in RSS feed: ${feedUrl}`);
      return grants;
    }

    for (const item of feed.items) {
      // Apply filter if provided
      if (options.filterFn && !options.filterFn(item)) {
        continue;
      }

      const title = item.title?.trim() || "";
      const description = item.contentSnippet || item.content || item.description || "";
      const link = item.link || item.guid || "";

      if (!title || !link) {
        continue;
      }

      // Extract date
      let deadline: Date | undefined;
      if (item.pubDate) {
        deadline = new Date(item.pubDate);
      } else if (item.isoDate) {
        deadline = new Date(item.isoDate);
      }

      // Determine location
      const location = options.location || options.defaultLocation || "Global";
      const text = `${title} ${description}`.toLowerCase();
      const finalLocation = 
        text.includes("kenya") ? "Kenya" :
        text.includes("africa") ? "Africa" :
        location;

      grants.push({
        title,
        description: description.substring(0, 1000), // Limit description length
        organization: options.organization,
        category: options.category,
        url: link,
        deadline,
        source: options.source,
        location: finalLocation,
        tags: ["RSS Feed"],
      });
    }

    console.log(`Parsed ${grants.length} grants from RSS feed: ${feedUrl}`);
  } catch (error) {
    console.error(`Error parsing RSS feed ${feedUrl}:`, error);
  }

  return grants;
}

/**
 * Check if a URL has an RSS feed
 */
export async function findRSSFeed(baseUrl: string): Promise<string | null> {
  try {
    const html = await fetch(baseUrl).then((res) => res.text());
    const rssMatch = html.match(/<link[^>]*type=["']application\/rss\+xml["'][^>]*href=["']([^"']+)["']/i);
    if (rssMatch && rssMatch[1]) {
      const rssUrl = rssMatch[1];
      return rssUrl.startsWith("http") ? rssUrl : new URL(rssUrl, baseUrl).toString();
    }
  } catch (error) {
    console.error(`Error finding RSS feed for ${baseUrl}:`, error);
  }
  return null;
}
