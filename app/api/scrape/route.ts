import { NextRequest, NextResponse } from "next/server";
import { runScrapingJob, runAllScrapingJobs } from "@/lib/scheduler";

// GET /api/scrape - Triggered by Vercel Cron
export async function GET(request: NextRequest) {
  try {
    // Vercel Cron jobs are already protected, but we can add an extra layer of security
    // Check for secret in query param or authorization header for manual testing
    const searchParams = request.nextUrl.searchParams;
    const cronSecret = searchParams.get("secret");
    const authHeader = request.headers.get("authorization");
    
    // If CRON_SECRET is set, require it (for manual calls or extra security)
    // Vercel Cron calls are already protected, but this adds an extra layer
    if (process.env.CRON_SECRET) {
      const isValidSecret = 
        cronSecret === process.env.CRON_SECRET ||
        authHeader === `Bearer ${process.env.CRON_SECRET}` ||
        // Allow if called from Vercel (check for Vercel-specific headers)
        request.headers.get("x-vercel-signature") !== null;
      
      if (!isValidSecret) {
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        );
      }
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

    // In development, allow without secret. In production, require it.
    const cronSecret = request.headers.get("x-cron-secret");
    const isDevelopment = process.env.NODE_ENV === "development";
    
    if (!isDevelopment && process.env.CRON_SECRET && cronSecret !== process.env.CRON_SECRET) {
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
