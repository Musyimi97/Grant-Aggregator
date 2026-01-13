import cron from "node-cron";
import { runAllScrapers } from "./scrapers";
import { prisma } from "./prisma";
import type { GrantData } from "./scrapers/types";

/**
 * Process and save grants to database
 */
async function processGrants(grants: GrantData[]) {
  let saved = 0;
  let skipped = 0;

  for (const grantData of grants) {
    try {
      // Check if grant already exists by URL
      const existing = await prisma.grant.findUnique({
        where: { url: grantData.url },
      });

      if (existing) {
        // Update existing grant
        await prisma.grant.update({
          where: { url: grantData.url },
          data: {
            title: grantData.title,
            description: grantData.description,
            organization: grantData.organization,
            category: grantData.category,
            amount: grantData.amount,
            deadline: grantData.deadline,
            requirements: grantData.requirements,
            eligibility: grantData.eligibility,
            updatedAt: new Date(),
            isActive: true,
          },
        });
        skipped++;
      } else {
        // Create new grant
        await prisma.grant.create({
          data: {
            title: grantData.title,
            description: grantData.description,
            organization: grantData.organization,
            category: grantData.category,
            amount: grantData.amount,
            deadline: grantData.deadline,
            url: grantData.url,
            requirements: grantData.requirements,
            eligibility: grantData.eligibility,
            source: grantData.source,
            tags: grantData.tags || [],
            isActive: true,
          },
        });
        saved++;
      }
    } catch (error) {
      console.error(`Error processing grant ${grantData.url}:`, error);
    }
  }

  return { saved, skipped };
}

/**
 * Run a scraping job for a specific source
 */
export async function runScrapingJob(source: string) {
  const job = await prisma.scrapingJob.create({
    data: {
      source,
      status: "running",
      startedAt: new Date(),
    },
  });

  try {
    const { scrapers } = await import("./scrapers");
    const scraper = scrapers[source];
    
    if (!scraper) {
      throw new Error(`Scraper not found for source: ${source}`);
    }

    const grants = await scraper();
    const { saved, skipped } = await processGrants(grants);

    // Mark expired grants as inactive
    await prisma.grant.updateMany({
      where: {
        source,
        deadline: {
          lt: new Date(),
        },
        isActive: true,
      },
      data: {
        isActive: false,
      },
    });

    await prisma.scrapingJob.update({
      where: { id: job.id },
      data: {
        status: "success",
        grantsFound: saved,
        completedAt: new Date(),
      },
    });

    return { success: true, saved, skipped, total: grants.length };
  } catch (error) {
    await prisma.scrapingJob.update({
      where: { id: job.id },
      data: {
        status: "failed",
        error: error instanceof Error ? error.message : "Unknown error",
        completedAt: new Date(),
      },
    });

    throw error;
  }
}

/**
 * Run all scrapers
 */
export async function runAllScrapingJobs() {
  const { scrapers } = await import("./scrapers");
  const results = [];

  for (const source of Object.keys(scrapers)) {
    try {
      const result = await runScrapingJob(source);
      results.push({ source, ...result });
    } catch (error) {
      results.push({
        source,
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  return results;
}

/**
 * Initialize cron jobs for automatic scraping
 * Runs every 6 hours
 */
export function initializeCronJobs() {
  // Run every 6 hours
  cron.schedule("0 */6 * * *", async () => {
    console.log("Running scheduled scraping job...");
    try {
      await runAllScrapingJobs();
      console.log("Scheduled scraping job completed");
    } catch (error) {
      console.error("Error in scheduled scraping job:", error);
    }
  });

  console.log("Cron jobs initialized - scraping will run every 6 hours");
}
