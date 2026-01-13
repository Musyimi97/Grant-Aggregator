/**
 * RSS Feed configurations for grant sources
 * This allows scrapers to use RSS feeds when available, which is more reliable than HTML scraping
 */

export interface RSSFeedConfig {
  url: string;
  source: string;
  organization: string;
  category: string[];
  location?: string;
  filterFn?: (item: any) => boolean;
}

/**
 * Known RSS feed URLs for grant sources
 * RSS feeds are preferred over HTML scraping for reliability
 */
export const RSS_FEEDS: Record<string, RSSFeedConfig> = {
  grantsGov: {
    url: "https://www.grants.gov/connect/rss-feeds",
    source: "Grants.gov",
    organization: "U.S. Government",
    category: ["Technology"],
    location: "Global",
    filterFn: (item) => {
      const text = `${item.title} ${item.contentSnippet || ""}`.toLowerCase();
      return text.includes("technology") || 
             text.includes("tech") || 
             text.includes("ai") ||
             text.includes("computing") ||
             text.includes("innovation") ||
             text.includes("research");
    },
  },
  afdb: {
    url: "https://www.afdb.org/en/rss-feeds",
    source: "African Development Bank",
    organization: "African Development Bank",
    category: ["Technology"],
    location: "Africa",
    filterFn: (item) => {
      const text = `${item.title} ${item.contentSnippet || ""}`.toLowerCase();
      return text.includes("technology") || 
             text.includes("tech") || 
             text.includes("ict") ||
             text.includes("innovation") ||
             text.includes("kenya");
    },
  },
  allAfrica: {
    url: "https://allafrica.com/tools/rss/headlines/rdf/business/headlines.rss",
    source: "AllAfrica",
    organization: "AllAfrica",
    category: ["Technology"],
    location: "Africa",
    filterFn: (item) => {
      const text = `${item.title} ${item.contentSnippet || ""}`.toLowerCase();
      return text.includes("grant") || 
             text.includes("funding") || 
             text.includes("technology") ||
             text.includes("tech");
    },
  },
};

/**
 * Helper function to try RSS feed first, then fallback to HTML scraping
 */
export async function tryRSSThenHTML(
  rssConfig: RSSFeedConfig | null,
  htmlScraper: () => Promise<any[]>
): Promise<any[]> {
  if (rssConfig) {
    try {
      const { parseRSSFeed } = await import("./rss");
      const grants = await parseRSSFeed(rssConfig.url, {
        source: rssConfig.source,
        organization: rssConfig.organization,
        category: rssConfig.category,
        location: rssConfig.location,
        filterFn: rssConfig.filterFn,
      });
      
      if (grants.length > 0) {
        console.log(`Using RSS feed for ${rssConfig.source}: ${grants.length} grants found`);
        return grants;
      }
    } catch (error) {
      console.warn(`RSS feed failed for ${rssConfig.source}, falling back to HTML scraping:`, error);
    }
  }
  
  // Fallback to HTML scraping
  return htmlScraper();
}
