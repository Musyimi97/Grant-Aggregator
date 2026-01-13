import axios from "axios";
import * as cheerio from "cheerio";
import type { GrantData, ScraperFunction } from "./types";
import { parseRSSFeed, findRSSFeed } from "./rss";
import { RSS_FEEDS, tryRSSThenHTML } from "./rss-feeds";
import { generateTestGrants } from "./test-data";
import { scrapeWithRSSFirst } from "./rss-wrapper";

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
 * Uses RSS feed if available, otherwise HTML scraping
 */
export async function scrapeGrantsGov(): Promise<GrantData[]> {
  return tryRSSThenHTML(RSS_FEEDS.grantsGov || null, async () => {
    const grants: GrantData[] = [];
    try {
      // Try to find RSS feed first
      const rssUrl = await findRSSFeed("https://www.grants.gov/connect/rss-feeds");
      if (rssUrl) {
        return await parseRSSFeed(rssUrl, {
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
        });
      }
      
      // Fallback to HTML scraping
      const html = await fetchHTML("https://www.grants.gov/web/grants/search-grants.html");
      const $ = cheerio.load(html);
      
      // Parse grants.gov search results
      $(".grant-item, .opportunity, article").each((_, element) => {
        const title = $(element).find("h2, h3, .title, a").first().text().trim();
        const description = $(element).find("p, .description").first().text().trim();
        const link = $(element).find("a").first().attr("href");
        const text = $(element).text().toLowerCase();
        
        if (title && (text.includes("technology") || text.includes("tech") || text.includes("ai"))) {
          grants.push({
            title,
            description: description || "U.S. Government grant opportunity",
            organization: "U.S. Government",
            category: ["Technology"],
            url: link ? (link.startsWith("http") ? link : `https://www.grants.gov${link}`) : "https://www.grants.gov/web/grants/search-grants.html",
            source: "Grants.gov",
            location: "Global",
            tags: ["Government", "Technology"],
          });
        }
      });
    } catch (error) {
      console.error("Error scraping grants.gov:", error);
    }
    return grants;
  });
}

/**
 * Scrape AWS Cloud Credits for Research
 * Uses RSS-first approach
 */
export async function scrapeAWSCredits(): Promise<GrantData[]> {
  return scrapeWithRSSFirst({
    source: "AWS Cloud Credits",
    organization: "Amazon Web Services",
    category: ["Cloud Compute"],
    location: "Global",
    baseUrl: "https://aws.amazon.com/grants/",
    htmlScraper: async () => {
      const grants: GrantData[] = [];
      const html = await fetchHTML("https://aws.amazon.com/grants/");
      const $ = cheerio.load(html);
      
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
            location: "Global",
            tags: ["AWS", "Cloud Credits", "Research"],
          });
        }
      });
      return grants;
    },
  });
}

/**
 * Scrape Google Cloud Research Credits
 * Uses RSS-first approach
 */
export async function scrapeGoogleCloud(): Promise<GrantData[]> {
  return scrapeWithRSSFirst({
    source: "Google Cloud Research Credits",
    organization: "Google",
    category: ["Cloud Compute"],
    location: "Global",
    baseUrl: "https://cloud.google.com/edu/researchers",
    htmlScraper: async () => {
      const grants: GrantData[] = [];
      const html = await fetchHTML("https://cloud.google.com/edu/researchers");
      const $ = cheerio.load(html);
      
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
            location: "Global",
            tags: ["Google Cloud", "Research Credits"],
          });
        }
      });
      return grants;
    },
  });
}

/**
 * Scrape Microsoft AI for Good
 * Uses RSS-first approach
 */
export async function scrapeMicrosoftAI(): Promise<GrantData[]> {
  return scrapeWithRSSFirst({
    source: "Microsoft AI for Good",
    organization: "Microsoft",
    category: ["Health AI", "Finance AI"],
    location: "Global",
    baseUrl: "https://www.microsoft.com/en-us/ai/ai-for-good",
    htmlScraper: async () => {
      const grants: GrantData[] = [];
      const html = await fetchHTML("https://www.microsoft.com/en-us/ai/ai-for-good");
      const $ = cheerio.load(html);
      
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
            location: "Global",
            tags: ["Microsoft", "AI for Good"],
          });
        }
      });
      return grants;
    },
  });
}

/**
 * Scrape OpenAI Researcher Access Program
 * Uses RSS-first approach
 */
export async function scrapeOpenAI(): Promise<GrantData[]> {
  return scrapeWithRSSFirst({
    source: "OpenAI",
    organization: "OpenAI",
    category: ["LLM Tokens"],
    location: "Global",
    baseUrl: "https://openai.com/research",
    htmlScraper: async () => {
      const grants: GrantData[] = [];
      const html = await fetchHTML("https://openai.com/research");
      const $ = cheerio.load(html);
      
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
            location: "Global",
            tags: ["OpenAI", "API Tokens", "LLM"],
          });
        }
      });
      return grants;
    },
  });
}

/**
 * Scrape Anthropic Research Programs
 * Uses RSS-first approach
 */
export async function scrapeAnthropic(): Promise<GrantData[]> {
  return scrapeWithRSSFirst({
    source: "Anthropic",
    organization: "Anthropic",
    category: ["LLM Tokens"],
    location: "Global",
    baseUrl: "https://www.anthropic.com/research",
    htmlScraper: async () => {
      const grants: GrantData[] = [];
      const html = await fetchHTML("https://www.anthropic.com/research");
      const $ = cheerio.load(html);
      
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
            location: "Global",
            tags: ["Anthropic", "Claude", "API Tokens", "LLM"],
          });
        }
      });
      return grants;
    },
  });
}

/**
 * Scrape DevelopmentAid grants (Africa/Kenya/Global focus)
 * Tries RSS feed first, then HTML scraping
 */
export async function scrapeDevelopmentAid(): Promise<GrantData[]> {
  return tryRSSThenHTML(null, async () => {
    const grants: GrantData[] = [];
    try {
      // Try to find RSS feed
      const rssUrl = await findRSSFeed("https://www.developmentaid.org/grants/search");
      if (rssUrl) {
        return await parseRSSFeed(rssUrl, {
          source: "DevelopmentAid",
          organization: "DevelopmentAid",
          category: ["Technology"],
          defaultLocation: "Global",
          filterFn: (item) => {
            const text = `${item.title} ${item.contentSnippet || ""}`.toLowerCase();
            return text.includes("africa") || text.includes("kenya") || 
                   text.includes("global") || text.includes("technology");
          },
        });
      }
      
      const html = await fetchHTML("https://www.developmentaid.org/grants/search");
      const $ = cheerio.load(html);
    
    // Parse DevelopmentAid grants
    $(".grant-item, .opportunity-card, article").each((_, element) => {
      const title = $(element).find("h2, h3, .title, a").first().text().trim();
      const description = $(element).find("p, .description, .summary").first().text().trim();
      const link = $(element).find("a").first().attr("href");
      const locationText = $(element).text().toLowerCase();
      
      // Filter for Africa/Kenya/Global
      const isRelevant = 
        locationText.includes("africa") ||
        locationText.includes("kenya") ||
        locationText.includes("global") ||
        locationText.includes("international");
      
      if (title && isRelevant) {
        const location = locationText.includes("kenya") ? "Kenya" :
                        locationText.includes("africa") ? "Africa" : "Global";
        
        grants.push({
          title,
          description: description || "Development grant opportunity",
          organization: "DevelopmentAid",
          category: ["Technology"],
          url: link ? (link.startsWith("http") ? link : `https://www.developmentaid.org${link}`) : "https://www.developmentaid.org/grants/search",
          source: "DevelopmentAid",
          location,
          tags: ["Development", "Grants"],
        });
      }
    });
    } catch (error) {
      console.error("Error scraping DevelopmentAid:", error);
    }
    return grants;
  });
}

/**
 * Scrape Gates Foundation grant opportunities
 * Tries RSS feed first, then HTML scraping
 */
export async function scrapeGatesFoundation(): Promise<GrantData[]> {
  return tryRSSThenHTML(null, async () => {
    const grants: GrantData[] = [];
    try {
      // Try to find RSS feed
      const rssUrl = await findRSSFeed("https://www.gatesfoundation.org/about/how-we-work/grant-opportunities");
      if (rssUrl) {
        return await parseRSSFeed(rssUrl, {
          source: "Gates Foundation",
          organization: "Bill & Melinda Gates Foundation",
          category: ["Technology", "Health AI"],
          location: "Global",
        });
      }
      
      const html = await fetchHTML("https://www.gatesfoundation.org/about/how-we-work/grant-opportunities");
      const $ = cheerio.load(html);
      
      // Parse Gates Foundation grants
      $(".grant-opportunity, .rfp-item, article, .opportunity-card").each((_, element) => {
        const title = $(element).find("h2, h3, h4, .title").first().text().trim();
        const description = $(element).find("p, .description").first().text().trim();
        const link = $(element).find("a").first().attr("href");
        
        if (title) {
          grants.push({
            title,
            description: description || "Gates Foundation grant opportunity",
            organization: "Bill & Melinda Gates Foundation",
            category: ["Technology", "Health AI"],
            url: link ? (link.startsWith("http") ? link : `https://www.gatesfoundation.org${link}`) : "https://www.gatesfoundation.org/about/how-we-work/grant-opportunities",
            source: "Gates Foundation",
            location: "Global",
            tags: ["Gates Foundation", "Global"],
          });
        }
      });
    } catch (error) {
      console.error("Error scraping Gates Foundation:", error);
    }
    return grants;
  });
}

/**
 * Scrape FundsForNGOs (Africa/Kenya focus)
 * Tries RSS feed first, then HTML scraping
 */
export async function scrapeFundsForNGOs(): Promise<GrantData[]> {
  return tryRSSThenHTML(null, async () => {
    const grants: GrantData[] = [];
    try {
      // Try to find RSS feed
      const rssUrl = await findRSSFeed("https://www.fundsforngos.org/");
      if (rssUrl) {
        return await parseRSSFeed(rssUrl, {
          source: "FundsForNGOs",
          organization: "FundsForNGOs",
          category: ["Technology"],
          defaultLocation: "Global",
          filterFn: (item) => {
            const text = `${item.title} ${item.contentSnippet || ""}`.toLowerCase();
            return text.includes("technology") || text.includes("tech") || 
                   text.includes("ict") || text.includes("innovation") ||
                   text.includes("africa") || text.includes("kenya");
          },
        });
      }
      
      // Focus on technology and Africa/Kenya categories
      const html = await fetchHTML("https://www.fundsforngos.org/");
      const $ = cheerio.load(html);
    
    // Parse grant listings
    $(".grant-item, .post-item, article, .funding-opportunity").each((_, element) => {
      const title = $(element).find("h2, h3, h4, .title, a").first().text().trim();
      const description = $(element).find("p, .excerpt, .summary").first().text().trim();
      const link = $(element).find("a").first().attr("href");
      const text = $(element).text().toLowerCase();
      
      // Filter for tech-related or Africa/Kenya grants
      const isTechRelated = 
        text.includes("technology") ||
        text.includes("tech") ||
        text.includes("ict") ||
        text.includes("innovation") ||
        text.includes("digital");
      
      const isLocationRelevant = 
        text.includes("africa") ||
        text.includes("kenya") ||
        text.includes("global") ||
        text.includes("international");
      
      if (title && (isTechRelated || isLocationRelevant)) {
        const location = text.includes("kenya") ? "Kenya" :
                        text.includes("africa") ? "Africa" : "Global";
        
        grants.push({
          title,
          description: description || "NGO funding opportunity",
          organization: "FundsForNGOs",
          category: ["Technology"],
          url: link ? (link.startsWith("http") ? link : `https://www.fundsforngos.org${link}`) : "https://www.fundsforngos.org/",
          source: "FundsForNGOs",
          location,
          tags: ["NGO", "Funding"],
        });
      }
    });
    } catch (error) {
      console.error("Error scraping FundsForNGOs:", error);
    }
    return grants;
  });
}

/**
 * Scrape NRF Kenya grants (Kenya-specific)
 * Uses RSS-first approach
 */
export async function scrapeNRFKenya(): Promise<GrantData[]> {
  return scrapeWithRSSFirst({
    source: "NRF Kenya",
    organization: "National Research Fund Kenya",
    category: ["Technology"],
    location: "Kenya",
    baseUrl: "https://www.nrf.go.ke/category/grants-and-calls/",
    htmlScraper: async () => {
      const grants: GrantData[] = [];
      const html = await fetchHTML("https://www.nrf.go.ke/category/grants-and-calls/");
      const $ = cheerio.load(html);
      
      $(".grant-item, .post-item, article, .call-item").each((_, element) => {
        const title = $(element).find("h2, h3, h4, .title, a").first().text().trim();
        const description = $(element).find("p, .excerpt, .summary").first().text().trim();
        const link = $(element).find("a").first().attr("href");
        
        if (title) {
          grants.push({
            title,
            description: description || "National Research Fund Kenya grant opportunity",
            organization: "National Research Fund Kenya",
            category: ["Technology"],
            url: link ? (link.startsWith("http") ? link : `https://www.nrf.go.ke${link}`) : "https://www.nrf.go.ke/category/grants-and-calls/",
            source: "NRF Kenya",
            location: "Kenya",
            tags: ["Kenya", "Research", "NRF"],
          });
        }
      });
      return grants;
    },
  });
}

/**
 * Scrape Ford Foundation grant opportunities
 * Uses RSS-first approach
 */
export async function scrapeFordFoundation(): Promise<GrantData[]> {
  return scrapeWithRSSFirst({
    source: "Ford Foundation",
    organization: "Ford Foundation",
    category: ["Technology"],
    location: "Global",
    baseUrl: "https://www.fordfoundation.org/work/our-grants/grant-opportunities/",
    htmlScraper: async () => {
      const grants: GrantData[] = [];
      const html = await fetchHTML("https://www.fordfoundation.org/work/our-grants/grant-opportunities/");
      const $ = cheerio.load(html);
      
      $(".grant-opportunity, .opportunity-item, article").each((_, element) => {
        const title = $(element).find("h2, h3, h4, .title").first().text().trim();
        const description = $(element).find("p, .description").first().text().trim();
        const link = $(element).find("a").first().attr("href");
        
        if (title) {
          grants.push({
            title,
            description: description || "Ford Foundation grant opportunity",
            organization: "Ford Foundation",
            category: ["Technology"],
            url: link ? (link.startsWith("http") ? link : `https://www.fordfoundation.org${link}`) : "https://www.fordfoundation.org/work/our-grants/grant-opportunities/",
            source: "Ford Foundation",
            location: "Global",
            tags: ["Ford Foundation", "Global"],
          });
        }
      });
      return grants;
    },
  });
}

/**
 * Scrape IKI Small Grants (Global, focus on climate/tech)
 * Uses RSS-first approach
 */
export async function scrapeIKISmallGrants(): Promise<GrantData[]> {
  return scrapeWithRSSFirst({
    source: "IKI Small Grants",
    organization: "IKI Small Grants",
    category: ["Technology"],
    location: "Global",
    baseUrl: "https://iki-small-grants.de/",
    htmlScraper: async () => {
      const grants: GrantData[] = [];
      const html = await fetchHTML("https://iki-small-grants.de/");
      const $ = cheerio.load(html);
      
      $(".grant-item, .opportunity, article").each((_, element) => {
        const title = $(element).find("h2, h3, h4, .title").first().text().trim();
        const description = $(element).find("p, .description").first().text().trim();
        const link = $(element).find("a").first().attr("href");
        
        if (title) {
          grants.push({
            title,
            description: description || "IKI Small Grants opportunity",
            organization: "IKI Small Grants",
            category: ["Technology"],
            url: link ? (link.startsWith("http") ? link : `https://iki-small-grants.de${link}`) : "https://iki-small-grants.de/",
            source: "IKI Small Grants",
            location: "Global",
            tags: ["IKI", "Climate", "Small Grants"],
          });
        }
      });
      return grants;
    },
  });
}

/**
 * Scrape TerraViva Grants (Global)
 * Uses RSS-first approach
 */
export async function scrapeTerraVivaGrants(): Promise<GrantData[]> {
  return scrapeWithRSSFirst({
    source: "TerraViva Grants",
    organization: "TerraViva Grants",
    category: ["Technology"],
    location: "Global",
    baseUrl: "https://www.terravivagrants.org/",
    htmlScraper: async () => {
      const grants: GrantData[] = [];
      const html = await fetchHTML("https://www.terravivagrants.org/");
      const $ = cheerio.load(html);
      
      $(".grant-item, .opportunity-card, article").each((_, element) => {
        const title = $(element).find("h2, h3, h4, .title").first().text().trim();
        const description = $(element).find("p, .description").first().text().trim();
        const link = $(element).find("a").first().attr("href");
        
        if (title) {
          grants.push({
            title,
            description: description || "TerraViva grant opportunity",
            organization: "TerraViva Grants",
            category: ["Technology"],
            url: link ? (link.startsWith("http") ? link : `https://www.terravivagrants.org${link}`) : "https://www.terravivagrants.org/",
            source: "TerraViva Grants",
            location: "Global",
            tags: ["TerraViva", "Global"],
          });
        }
      });
      return grants;
    },
  });
}

/**
 * Scrape ICTWorks funding opportunities (Africa/Kenya focus)
 * Uses RSS-first approach
 */
export async function scrapeICTWorks(): Promise<GrantData[]> {
  return scrapeWithRSSFirst({
    source: "ICTWorks",
    organization: "ICTWorks",
    category: ["Technology"],
    defaultLocation: "Global",
    baseUrl: "https://www.ictworks.org/category/funding/",
    filterFn: (item) => {
      const text = `${item.title} ${item.contentSnippet || ""}`.toLowerCase();
      return text.includes("africa") || text.includes("kenya") || 
             text.includes("global") || text.includes("international");
    },
    htmlScraper: async () => {
      const grants: GrantData[] = [];
      const html = await fetchHTML("https://www.ictworks.org/category/funding/");
      const $ = cheerio.load(html);
      
      $(".post-item, article, .funding-opportunity").each((_, element) => {
        const title = $(element).find("h2, h3, h4, .title, a").first().text().trim();
        const description = $(element).find("p, .excerpt, .summary").first().text().trim();
        const link = $(element).find("a").first().attr("href");
        const text = $(element).text().toLowerCase();
        
        const isRelevant = 
          text.includes("africa") ||
          text.includes("kenya") ||
          text.includes("global") ||
          text.includes("international");
        
        if (title && isRelevant) {
          const location = text.includes("kenya") ? "Kenya" :
                          text.includes("africa") ? "Africa" : "Global";
          
          grants.push({
            title,
            description: description || "ICT funding opportunity",
            organization: "ICTWorks",
            category: ["Technology"],
            url: link ? (link.startsWith("http") ? link : `https://www.ictworks.org${link}`) : "https://www.ictworks.org/category/funding/",
            source: "ICTWorks",
            location,
            tags: ["ICT", "Technology", "Funding"],
          });
        }
      });
      return grants;
    },
  });
}

/**
 * Scrape Instrumentl Africa technology grants
 * Uses RSS-first approach
 */
export async function scrapeInstrumentl(): Promise<GrantData[]> {
  return scrapeWithRSSFirst({
    source: "Instrumentl",
    organization: "Instrumentl",
    category: ["Technology"],
    location: "Africa",
    baseUrl: "https://www.instrumentl.com/browse-grants/africa/technology-grants",
    htmlScraper: async () => {
      const grants: GrantData[] = [];
      const html = await fetchHTML("https://www.instrumentl.com/browse-grants/africa/technology-grants");
      const $ = cheerio.load(html);
      
      $(".grant-card, .grant-item, article, .opportunity").each((_, element) => {
        const title = $(element).find("h2, h3, h4, .title, a").first().text().trim();
        const description = $(element).find("p, .description, .summary").first().text().trim();
        const link = $(element).find("a").first().attr("href");
        const amount = $(element).find(".amount, .funding-amount").text().trim();
        
        if (title) {
          grants.push({
            title,
            description: description || "Technology grant for Africa",
            organization: "Instrumentl",
            category: ["Technology"],
            amount: amount || undefined,
            url: link ? (link.startsWith("http") ? link : `https://www.instrumentl.com${link}`) : "https://www.instrumentl.com/browse-grants/africa/technology-grants",
            source: "Instrumentl",
            location: "Africa",
            tags: ["Technology", "Africa", "Instrumentl"],
          });
        }
      });
      return grants;
    },
  });
}

/**
 * Scrape i3 Innovations Africa (health tech grants for Africa)
 */
export async function scrapeI3Innovations(): Promise<GrantData[]> {
  return scrapeWithRSSFirst({
    source: "i3 Innovations Africa",
    organization: "i3 Innovations Africa",
    category: ["Technology", "Health AI"],
    location: "Africa",
    baseUrl: "https://innovationsinafrica.com/application/",
    htmlScraper: async () => {
      const grants: GrantData[] = [];
      const html = await fetchHTML("https://innovationsinafrica.com/application/");
      const $ = cheerio.load(html);
      
      const title = "i3 Innovations Africa - Health Tech Grants";
      const description = $("main, .content, article").first().text().trim().substring(0, 500);
      
      const deadlineText = $("text").filter((_, el) => {
        const text = $(el).text().toLowerCase();
        return text.includes("deadline") || text.includes("close") || text.includes("february");
      }).first().text();
      
      let deadline: Date | undefined;
      if (deadlineText.includes("February")) {
        const match = deadlineText.match(/(\d{1,2})\s+February/);
        if (match) {
          const year = new Date().getFullYear();
          deadline = new Date(`${year}-02-${match[1]}`);
        }
      }
      
      grants.push({
        title,
        description: description || "i3 Innovations Africa supports early- and growth-stage ventures building data-driven access to healthcare in Africa. Companies must be African-led, tech-enabled, and focused on improving patient access to quality, affordable healthcare.",
        organization: "i3 Innovations Africa",
        category: ["Technology", "Health AI"],
        url: "https://innovationsinafrica.com/application/",
        source: "i3 Innovations Africa",
        location: "Africa",
        eligibility: "African-led and African-owned businesses focused on serving African markets. Must be tech-enabled, data-driven, and growth-stage with demonstrated traction.",
        tags: ["Health Tech", "Africa", "Innovation", "Healthcare"],
        deadline,
      });
      return grants;
    },
  });
}

/**
 * Scrape IEEE Computer Society Emerging Technology Fund
 * Uses RSS-first approach
 */
export async function scrapeIEEEEmergingTech(): Promise<GrantData[]> {
  return scrapeWithRSSFirst({
    source: "IEEE Computer Society",
    organization: "IEEE Computer Society",
    category: ["Technology"],
    location: "Global",
    baseUrl: "https://www.computer.org/communities/emerging-technology-fund",
    htmlScraper: async () => {
      const grants: GrantData[] = [];
      const html = await fetchHTML("https://www.computer.org/communities/emerging-technology-fund");
      const $ = cheerio.load(html);
      
      $(".grant-item, .opportunity, article, .project-item").each((_, element) => {
        const title = $(element).find("h2, h3, h4, .title, a").first().text().trim();
        const description = $(element).find("p, .description, .summary").first().text().trim();
        const link = $(element).find("a").first().attr("href");
        const amount = $(element).find(".amount, .funding").text().trim();
        
        if (title) {
          grants.push({
            title,
            description: description || "IEEE Computer Society Emerging Technology grant opportunity",
            organization: "IEEE Computer Society",
            category: ["Technology"],
            amount: amount || "Up to $50,000",
            url: link ? (link.startsWith("http") ? link : `https://www.computer.org${link}`) : "https://www.computer.org/communities/emerging-technology-fund",
            source: "IEEE Computer Society",
            location: "Global",
            eligibility: "Open to all countries where funds can be legally sent from the United States. At least one team member must be an IEEE or IEEE CS member.",
            tags: ["IEEE", "Emerging Technology", "Research", "Global"],
          });
        }
      });
      
      // If no items found, add the main grant opportunity
      if (grants.length === 0) {
        grants.push({
          title: "IEEE Computer Society Emerging Technology Fund",
          description: "Grants ranging from $5,000 to $50,000 for innovative projects, activities, and events focused on emerging technologies. Supports student competitions, lecture programs, discussion forums, and advanced technology initiatives.",
          organization: "IEEE Computer Society",
          category: ["Technology"],
          amount: "$5,000 - $50,000",
          url: "https://www.computer.org/communities/emerging-technology-fund",
          source: "IEEE Computer Society",
          location: "Global",
          eligibility: "Open to all countries. At least one team member must be an IEEE or IEEE CS member.",
          tags: ["IEEE", "Emerging Technology", "Global"],
        });
      }
      return grants;
    },
  });
}

/**
 * Scrape DARPA opportunities
 * Uses RSS-first approach
 */
export async function scrapeDARPA(): Promise<GrantData[]> {
  return scrapeWithRSSFirst({
    source: "DARPA",
    organization: "Defense Advanced Research Projects Agency",
    category: ["Technology"],
    location: "Global",
    baseUrl: "https://www.darpa.mil/work-with-us/opportunities",
    filterFn: (item) => {
      const text = `${item.title} ${item.contentSnippet || ""}`.toLowerCase();
      return text.includes("technology") || 
             text.includes("research") || 
             text.includes("innovation") ||
             text.includes("ai") ||
             text.includes("computing");
    },
    htmlScraper: async () => {
      const grants: GrantData[] = [];
      const html = await fetchHTML("https://www.darpa.mil/work-with-us/opportunities");
      const $ = cheerio.load(html);
      
      $(".opportunity-item, .solicitation, article, .grant-item").each((_, element) => {
        const title = $(element).find("h2, h3, h4, .title, a").first().text().trim();
        const description = $(element).find("p, .description, .summary").first().text().trim();
        const link = $(element).find("a").first().attr("href");
        const text = $(element).text().toLowerCase();
        
        const isTechRelated = 
          text.includes("technology") ||
          text.includes("research") ||
          text.includes("innovation") ||
          text.includes("ai") ||
          text.includes("computing");
        
        if (title && isTechRelated) {
          grants.push({
            title,
            description: description || "DARPA research opportunity",
            organization: "Defense Advanced Research Projects Agency",
            category: ["Technology"],
            url: link ? (link.startsWith("http") ? link : `https://www.darpa.mil${link}`) : "https://www.darpa.mil/work-with-us/opportunities",
            source: "DARPA",
            location: "Global",
            tags: ["DARPA", "Research", "Technology", "Defense"],
          });
        }
      });
      return grants;
    },
  });
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
  developmentAid: scrapeDevelopmentAid,
  gatesFoundation: scrapeGatesFoundation,
  fundsForNGOs: scrapeFundsForNGOs,
  nrfKenya: scrapeNRFKenya,
  fordFoundation: scrapeFordFoundation,
  ikiSmallGrants: scrapeIKISmallGrants,
  terraVivaGrants: scrapeTerraVivaGrants,
  ictWorks: scrapeICTWorks,
  instrumentl: scrapeInstrumentl,
  i3Innovations: scrapeI3Innovations,
  ieeeEmergingTech: scrapeIEEEEmergingTech,
  darpa: scrapeDARPA,
};

/**
 * Run all scrapers and return combined results
 * Includes test data if no grants are found (for development/testing)
 */
export async function runAllScrapers(): Promise<GrantData[]> {
  const allGrants: GrantData[] = [];
  let totalFound = 0;
  
  for (const [name, scraper] of Object.entries(scrapers)) {
    try {
      console.log(`Running scraper: ${name}`);
      const grants = await scraper();
      allGrants.push(...grants);
      totalFound += grants.length;
      console.log(`Found ${grants.length} grants from ${name}`);
    } catch (error) {
      console.error(`Error running scraper ${name}:`, error);
    }
  }
  
  // If no grants found in development, add test data
  if (allGrants.length === 0 && process.env.NODE_ENV === "development") {
    console.log("No grants found from scrapers, adding test data for verification");
    const testGrants = generateTestGrants();
    allGrants.push(...testGrants);
    console.log(`Added ${testGrants.length} test grants`);
  }
  
  console.log(`Total grants found: ${allGrants.length}`);
  return allGrants;
}
