# RSS Feed Implementation Guide

## Overview

All scrapers now use an **RSS-first approach** - they automatically try to find and use RSS feeds before falling back to HTML scraping. This makes the system more reliable and less prone to breaking when websites change.

## How It Works

### Automatic RSS Detection

Every scraper automatically:
1. **Tries to find RSS feed** from the base URL
2. **Parses RSS feed** if found (more reliable)
3. **Falls back to HTML scraping** if no RSS feed is available

### Implementation Pattern

All scrapers use the `scrapeWithRSSFirst()` wrapper:

```typescript
export async function scrapeExample(): Promise<GrantData[]> {
  return scrapeWithRSSFirst({
    source: "Source Name",
    organization: "Organization Name",
    category: ["Technology"],
    location: "Global", // or "Africa", "Kenya"
    baseUrl: "https://example.com/grants",
    htmlScraper: async () => {
      // HTML scraping code here
      const grants: GrantData[] = [];
      // ... parsing logic
      return grants;
    },
  });
}
```

## Current Status

### ✅ Implemented with RSS-First
- Grants.gov
- AWS Cloud Credits
- Google Cloud Research Credits
- DevelopmentAid
- Gates Foundation
- FundsForNGOs
- DARPA (with RSS detection)

### 🔄 To Be Updated
All remaining scrapers will automatically use RSS when available thanks to the wrapper pattern.

## Adding RSS Feed URLs

When you discover RSS feed URLs, add them to `lib/scrapers/rss-feeds.ts`:

```typescript
export const RSS_FEEDS: Record<string, RSSFeedConfig> = {
  sourceName: {
    url: "https://example.com/feed.xml",
    source: "Source Name",
    organization: "Organization",
    category: ["Technology"],
    location: "Global",
  },
};
```

## Benefits

1. **More Reliable**: RSS feeds are structured and less likely to break
2. **Better Performance**: Faster parsing than HTML scraping
3. **Automatic Dates**: RSS includes publication dates automatically
4. **Future-Proof**: When websites add RSS feeds, scrapers automatically use them

## Testing

To test RSS feed detection:

```typescript
import { findRSSFeed } from "@/lib/scrapers/rss";

const rssUrl = await findRSSFeed("https://example.com/grants");
console.log("RSS Feed:", rssUrl);
```

## Known RSS Feeds

- **Grants.gov**: https://www.grants.gov/connect/rss-feeds
- **African Development Bank**: https://www.afdb.org/en/rss-feeds
- **AllAfrica**: https://allafrica.com/tools/rss/headlines/rdf/business/headlines.rss

## Next Steps

1. Discover more RSS feeds from grant sources
2. Add them to `rss-feeds.ts`
3. Scrapers will automatically use them on next run
