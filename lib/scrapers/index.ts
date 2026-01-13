import axios from "axios";
import * as cheerio from "cheerio";
import type { GrantData, ScraperFunction } from "./types";

/**
 * Base scraper utility to fetch and parse HTML
 */
async function fetchHTML(url: string): Promise<string> {
  try {
    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      timeout: 30000,
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    throw error;
  }
}

/**
 * Scrape grants.gov (filtered for tech/AI categories)
 */
export async function scrapeGrantsGov(): Promise<GrantData[]> {
  const grants: GrantData[] = [];
  try {
    // Note: grants.gov requires API access for proper scraping
    // This is a placeholder implementation
    const html = await fetchHTML("https://www.grants.gov/web/grants/search-grants.html");
    const $ = cheerio.load(html);
    
    // Implementation would parse the grants.gov search results
    // For now, return empty array as placeholder
    console.log("Grants.gov scraper - placeholder implementation");
  } catch (error) {
    console.error("Error scraping grants.gov:", error);
  }
  return grants;
}

/**
 * Scrape AWS Cloud Credits for Research
 */
export async function scrapeAWSCredits(): Promise<GrantData[]> {
  const grants: GrantData[] = [];
  try {
    const html = await fetchHTML("https://aws.amazon.com/grants/");
    const $ = cheerio.load(html);
    
    // Parse AWS grants page
    // This is a simplified example - actual implementation would parse the specific structure
    $(".grant-item, .program-card").each((_, element) => {
      const title = $(element).find("h2, h3, .title").first().text().trim();
      const description = $(element).find("p, .description").first().text().trim();
      
      if (title && description) {
        grants.push({
          title,
          description,
          organization: "Amazon Web Services",
          category: ["Cloud Compute"],
          url: `https://aws.amazon.com/grants/`,
          source: "AWS Cloud Credits",
          tags: ["AWS", "Cloud Credits", "Research"],
        });
      }
    });
  } catch (error) {
    console.error("Error scraping AWS credits:", error);
  }
  return grants;
}

/**
 * Scrape Google Cloud Research Credits
 */
export async function scrapeGoogleCloud(): Promise<GrantData[]> {
  const grants: GrantData[] = [];
  try {
    const html = await fetchHTML("https://cloud.google.com/edu/researchers");
    const $ = cheerio.load(html);
    
    // Parse Google Cloud grants
    $(".program-card, .grant-card").each((_, element) => {
      const title = $(element).find("h2, h3").first().text().trim();
      const description = $(element).find("p").first().text().trim();
      
      if (title) {
        grants.push({
          title,
          description: description || "Google Cloud research credits program",
          organization: "Google",
          category: ["Cloud Compute"],
          url: "https://cloud.google.com/edu/researchers",
          source: "Google Cloud Research Credits",
          tags: ["Google Cloud", "Research Credits"],
        });
      }
    });
  } catch (error) {
    console.error("Error scraping Google Cloud:", error);
  }
  return grants;
}

/**
 * Scrape Microsoft AI for Good
 */
export async function scrapeMicrosoftAI(): Promise<GrantData[]> {
  const grants: GrantData[] = [];
  try {
    const html = await fetchHTML("https://www.microsoft.com/en-us/ai/ai-for-good");
    const $ = cheerio.load(html);
    
    // Parse Microsoft AI for Good programs
    $(".program-item, .grant-program").each((_, element) => {
      const title = $(element).find("h2, h3").first().text().trim();
      const description = $(element).find("p").first().text().trim();
      
      if (title) {
        grants.push({
          title,
          description: description || "Microsoft AI for Good program",
          organization: "Microsoft",
          category: ["Health AI", "Finance AI"],
          url: "https://www.microsoft.com/en-us/ai/ai-for-good",
          source: "Microsoft AI for Good",
          tags: ["Microsoft", "AI for Good"],
        });
      }
    });
  } catch (error) {
    console.error("Error scraping Microsoft AI:", error);
  }
  return grants;
}

/**
 * Scrape OpenAI Researcher Access Program
 */
export async function scrapeOpenAI(): Promise<GrantData[]> {
  const grants: GrantData[] = [];
  try {
    // OpenAI may require different approach - check their website structure
    const html = await fetchHTML("https://openai.com/research");
    const $ = cheerio.load(html);
    
    // Parse OpenAI research programs
    $(".program-card, article").each((_, element) => {
      const title = $(element).find("h2, h3").first().text().trim();
      const link = $(element).find("a").first().attr("href");
      
      if (title) {
        grants.push({
          title,
          description: "OpenAI researcher access and API token programs",
          organization: "OpenAI",
          category: ["LLM Tokens"],
          url: link ? `https://openai.com${link}` : "https://openai.com/research",
          source: "OpenAI",
          tags: ["OpenAI", "API Tokens", "LLM"],
        });
      }
    });
  } catch (error) {
    console.error("Error scraping OpenAI:", error);
  }
  return grants;
}

/**
 * Scrape Anthropic Research Programs
 */
export async function scrapeAnthropic(): Promise<GrantData[]> {
  const grants: GrantData[] = [];
  try {
    const html = await fetchHTML("https://www.anthropic.com/research");
    const $ = cheerio.load(html);
    
    // Parse Anthropic research programs
    $(".program-item, article").each((_, element) => {
      const title = $(element).find("h2, h3").first().text().trim();
      const link = $(element).find("a").first().attr("href");
      
      if (title) {
        grants.push({
          title,
          description: "Anthropic research access and API programs",
          organization: "Anthropic",
          category: ["LLM Tokens"],
          url: link ? `https://www.anthropic.com${link}` : "https://www.anthropic.com/research",
          source: "Anthropic",
          tags: ["Anthropic", "Claude", "API Tokens", "LLM"],
        });
      }
    });
  } catch (error) {
    console.error("Error scraping Anthropic:", error);
  }
  return grants;
}

/**
 * All available scrapers
 */
export const scrapers: Record<string, ScraperFunction> = {
  grantsGov: scrapeGrantsGov,
  awsCredits: scrapeAWSCredits,
  googleCloud: scrapeGoogleCloud,
  microsoftAI: scrapeMicrosoftAI,
  openAI: scrapeOpenAI,
  anthropic: scrapeAnthropic,
};

/**
 * Run all scrapers and return combined results
 */
export async function runAllScrapers(): Promise<GrantData[]> {
  const allGrants: GrantData[] = [];
  
  for (const [name, scraper] of Object.entries(scrapers)) {
    try {
      console.log(`Running scraper: ${name}`);
      const grants = await scraper();
      allGrants.push(...grants);
      console.log(`Found ${grants.length} grants from ${name}`);
    } catch (error) {
      console.error(`Error running scraper ${name}:`, error);
    }
  }
  
  return allGrants;
}
