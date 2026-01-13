import { NextRequest, NextResponse } from "next/server";
import { runScrapingJob, runAllScrapingJobs } from "@/lib/scheduler";

// GET /api/scrape - Triggered by Vercel Cron
export async function GET(request: NextRequest) {
  try {
    // Verify authorization header from Vercel Cron
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Run all scrapers
    const results = await runAllScrapingJobs();
    return NextResponse.json({ success: true, results });
  } catch (error) {
    console.error("Error running scraping job:", error);
    return NextResponse.json(
      {
        error: "Failed to run scraping job",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// POST /api/scrape - Trigger scraping job manually
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const source = body.source;

    // Verify cron secret if provided
    const cronSecret = request.headers.get("x-cron-secret");
    if (process.env.CRON_SECRET && cronSecret !== process.env.CRON_SECRET) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (source) {
      // Run specific scraper
      const result = await runScrapingJob(source);
      return NextResponse.json(result);
    } else {
      // Run all scrapers
      const results = await runAllScrapingJobs();
      return NextResponse.json({ results });
    }
  } catch (error) {
    console.error("Error running scraping job:", error);
    return NextResponse.json(
      {
        error: "Failed to run scraping job",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
