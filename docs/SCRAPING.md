# Scraping Documentation

## Overview

The scraping system automatically fetches grant information from various online sources and stores them in the database.

## Adding a New Grant Source

### Step 1: Create Scraper Function

Add a new scraper function in `lib/scrapers/index.ts`:

```typescript
export async function scrapeNewSource(): Promise<GrantData[]> {
  const grants: GrantData[] = [];
  try {
    const html = await fetchHTML("https://example.com/grants");
    const $ = cheerio.load(html);
    
    // Parse the HTML structure
    $(".grant-item").each((_, element) => {
      const title = $(element).find("h2").text().trim();
      const description = $(element).find("p").text().trim();
      
      if (title) {
        grants.push({
          title,
          description,
          organization: "Organization Name",
          category: ["Cloud Compute"], // Choose appropriate categories
          url: $(element).find("a").attr("href") || "https://example.com",
          source: "Source Name",
          tags: ["tag1", "tag2"],
        });
      }
    });
  } catch (error) {
    console.error("Error scraping new source:", error);
  }
  return grants;
}
```

### Step 2: Register Scraper

Add the scraper to the `scrapers` object:

```typescript
export const scrapers: Record<string, ScraperFunction> = {
  // ... existing scrapers
  newSource: scrapeNewSource,
};
```

### Step 3: Test Scraper

Test the scraper manually:

```typescript
import { scrapers } from "@/lib/scrapers";

const grants = await scrapers.newSource();
console.log(grants);
```

## Grant Data Structure

Each grant must include:

- **title** (string): Grant title
- **description** (string): Grant description
- **organization** (string): Organization offering the grant
- **category** (string[]): Array of categories (Cloud Compute, Health AI, Finance AI, LLM Tokens)
- **url** (string): Unique URL to the grant
- **source** (string): Source website name

Optional fields:

- **amount** (string): Grant amount
- **deadline** (Date): Application deadline
- **requirements** (string): Application requirements
- **eligibility** (string): Eligibility criteria
- **tags** (string[]): Additional tags

## Scraping Best Practices

1. **Respect robots.txt**: Check if scraping is allowed
2. **Rate Limiting**: Add delays between requests
3. **Error Handling**: Always wrap scrapers in try-catch
4. **User-Agent**: Set appropriate User-Agent headers
5. **Timeout**: Set reasonable timeouts for requests
6. **Data Validation**: Validate scraped data before saving

## Handling Dynamic Content

For sites with JavaScript-rendered content, use Puppeteer:

```typescript
import puppeteer from "puppeteer";

export async function scrapeDynamicSite(): Promise<GrantData[]> {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("https://example.com");
  
  // Wait for content to load
  await page.waitForSelector(".grant-item");
  
  const grants = await page.evaluate(() => {
    // Extract data from the page
    return Array.from(document.querySelectorAll(".grant-item")).map((item) => ({
      title: item.querySelector("h2")?.textContent || "",
      // ... more fields
    }));
  });
  
  await browser.close();
  return grants;
}
```

## Testing Scrapers

1. Run scraper manually in development
2. Check data quality and structure
3. Verify duplicate detection works
4. Test error handling
5. Monitor scraping jobs in admin dashboard

## Monitoring

- Check `/admin` page for scraping job status
- Review error logs in scraping jobs
- Monitor database for new grants
- Track scraping success rates

## Common Issues

### Website Structure Changed
- Update CSS selectors in scraper
- Test scraper after changes
- Monitor for repeated failures

### Rate Limiting
- Add delays between requests
- Use proxies if necessary
- Respect website's rate limits

### Missing Data
- Handle optional fields gracefully
- Use fallback values when needed
- Log missing data for review
