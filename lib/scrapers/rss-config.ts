/**
 * Comprehensive RSS feed configuration for all grant sources
 * This centralizes RSS feed URLs and makes it easy to update them
 */

import type { RSSFeedConfig } from "./rss-feeds";

/**
 * RSS Feed URLs for all grant sources
 * Update these as RSS feeds are discovered
 */
export const RSS_FEED_URLS: Record<string, string | null> = {
  // U.S. Government
  grantsGov: "https://www.grants.gov/connect/rss-feeds",
  
  // Cloud Providers
  awsCredits: null, // No RSS feed available
  googleCloud: null, // No RSS feed available
  
  // AI Companies
  microsoftAI: null, // Check for RSS feed
  openAI: null, // Check for RSS feed
  anthropic: null, // Check for RSS feed
  
  // Development Organizations
  developmentAid: null, // Check for RSS feed
  gatesFoundation: null, // Check for RSS feed
  fundsForNGOs: null, // Check for RSS feed
  fordFoundation: null, // Check for RSS feed
  
  // Africa/Kenya Specific
  nrfKenya: null, // Check for RSS feed
  ictWorks: null, // Check for RSS feed
  instrumentl: null, // Check for RSS feed
  i3Innovations: null, // Check for RSS feed
  
  // Other
  ieeeEmergingTech: null, // Check for RSS feed
  darpa: null, // Check for RSS feed
  ikiSmallGrants: null, // Check for RSS feed
  terraVivaGrants: null, // Check for RSS feed
};

/**
 * Get RSS feed config for a source
 */
export function getRSSFeedConfig(source: string): RSSFeedConfig | null {
  const rssUrl = RSS_FEED_URLS[source];
  if (!rssUrl) return null;
  
  // Return appropriate config based on source
  const configs: Record<string, Omit<RSSFeedConfig, "url">> = {
    grantsGov: {
      source: "Grants.gov",
      organization: "U.S. Government",
      category: ["Technology"],
      location: "Global",
      filterFn: (item) => {
        const text = `${item.title} ${item.contentSnippet || ""}`.toLowerCase();
        return text.includes("technology") || text.includes("tech") || 
               text.includes("ai") || text.includes("computing") ||
               text.includes("innovation") || text.includes("research");
      },
    },
  };
  
  const baseConfig = configs[source];
  if (!baseConfig) return null;
  
  return {
    url: rssUrl,
    ...baseConfig,
  };
}
