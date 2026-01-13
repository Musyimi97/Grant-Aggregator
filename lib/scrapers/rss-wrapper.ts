/**
 * Universal RSS-first wrapper for all scrapers
 * Automatically tries RSS feed detection, then falls back to HTML scraping
 */

import { findRSSFeed, parseRSSFeed } from "./rss";
import type { GrantData } from "./types";

interface ScraperOptions {
  source: string;
  organization: string;
  category: string[];
  location?: string;
  defaultLocation?: string;
  filterFn?: (item: any) => boolean;
  htmlScraper: () => Promise<GrantData[]>;
  baseUrl: string;
}

/**
 * Universal scraper that tries RSS first, then HTML
 * This ensures all scrapers automatically use RSS when available
 */
export async function scrapeWithRSSFirst(options: ScraperOptions): Promise<GrantData[]> {
  const {
    source,
    organization,
    category,
    location,
    defaultLocation,
    filterFn,
    htmlScraper,
    baseUrl,
  } = options;

  try {
    // Step 1: Try to find RSS feed automatically
    const rssUrl = await findRSSFeed(baseUrl);
    
    if (rssUrl) {
      console.log(`Found RSS feed for ${source}: ${rssUrl}`);
      try {
        const grants = await parseRSSFeed(rssUrl, {
          source,
          organization,
          category,
          location,
          defaultLocation,
          filterFn,
        });
        
        if (grants.length > 0) {
          console.log(`Successfully parsed ${grants.length} grants from RSS feed for ${source}`);
          return grants;
        }
      } catch (error) {
        console.warn(`RSS feed parsing failed for ${source}, falling back to HTML:`, error);
      }
    }
    
    // Step 2: Fallback to HTML scraping
    console.log(`Using HTML scraping for ${source}`);
    return await htmlScraper();
  } catch (error) {
    console.error(`Error in RSS-first scraper for ${source}:`, error);
    // Final fallback: try HTML scraping directly
    try {
      return await htmlScraper();
    } catch (htmlError) {
      console.error(`HTML scraping also failed for ${source}:`, htmlError);
      return [];
    }
  }
}
