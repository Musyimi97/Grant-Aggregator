import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const grantSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  organization: z.string().min(1),
  category: z.array(z.string()),
  amount: z.string().optional(),
  deadline: z.string().datetime().optional(),
  url: z.string().url(),
  requirements: z.string().optional(),
  eligibility: z.string().optional(),
  source: z.string().min(1),
  tags: z.array(z.string()).optional(),
});

// GET /api/grants - List all grants with filters
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const location = searchParams.get("location");
    const isActive = searchParams.get("isActive");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const skip = (page - 1) * limit;

    const where: any = {};

    if (category) {
      where.category = {
        has: category,
      };
    }

    if (location) {
      where.location = location;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { organization: { contains: search, mode: "insensitive" } },
      ];
    }

    if (isActive !== null) {
      where.isActive = isActive === "true";
    }

    const [grants, total] = await Promise.all([
      prisma.grant.findMany({
        where,
        skip,
        take: limit,
        orderBy: [
          { deadline: "asc" },
          { scrapedAt: "desc" },
        ],
      }),
      prisma.grant.count({ where }),
    ]);

    return NextResponse.json({
      grants,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching grants:", error);
    return NextResponse.json(
      { error: "Failed to fetch grants" },
      { status: 500 }
    );
  }
}

// POST /api/grants - Add manual grant entry
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = grantSchema.parse(body);

    const grant = await prisma.grant.create({
      data: {
        ...data,
        deadline: data.deadline ? new Date(data.deadline) : undefined,
        tags: data.tags || [],
      },
    });

    return NextResponse.json(grant, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error creating grant:", error);
    return NextResponse.json(
      { error: "Failed to create grant" },
      { status: 500 }
    );
  }
}
