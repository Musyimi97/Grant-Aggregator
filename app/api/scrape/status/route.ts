import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/scrape/status - Check scraping job status
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "10");

    const jobs = await prisma.scrapingJob.findMany({
      take: limit,
      orderBy: {
        startedAt: "desc",
      },
    });

    return NextResponse.json({ jobs });
  } catch (error) {
    console.error("Error fetching scraping status:", error);
    return NextResponse.json(
      { error: "Failed to fetch scraping status" },
      { status: 500 }
    );
  }
}
