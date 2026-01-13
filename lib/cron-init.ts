/**
 * Initialize cron jobs for scraping
 * Note: In serverless environments (Vercel), use Vercel Cron or external services
 * This file is for local development or traditional server deployments
 */

import { initializeCronJobs } from "./scheduler";

// Only initialize cron jobs in non-serverless environments
if (process.env.NODE_ENV !== "production" || process.env.ENABLE_CRON === "true") {
  try {
    initializeCronJobs();
  } catch (error) {
    console.error("Failed to initialize cron jobs:", error);
  }
}
