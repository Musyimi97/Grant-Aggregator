import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/user/saved - Get user's saved grants
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const grants = await prisma.grant.findMany({
      where: {
        id: {
          in: user.savedGrants,
        },
      },
      orderBy: {
        deadline: "asc",
      },
    });

    return NextResponse.json({ grants });
  } catch (error) {
    console.error("Error fetching saved grants:", error);
    return NextResponse.json(
      { error: "Failed to fetch saved grants" },
      { status: 500 }
    );
  }
}

// POST /api/user/saved - Save a grant
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, grantId } = body;

    if (!userId || !grantId) {
      return NextResponse.json(
        { error: "User ID and Grant ID required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    if (user.savedGrants.includes(grantId)) {
      return NextResponse.json({ message: "Grant already saved" });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        savedGrants: {
          push: grantId,
        },
      },
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Error saving grant:", error);
    return NextResponse.json(
      { error: "Failed to save grant" },
      { status: 500 }
    );
  }
}

// DELETE /api/user/saved - Unsave a grant
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId");
    const grantId = searchParams.get("grantId");

    if (!userId || !grantId) {
      return NextResponse.json(
        { error: "User ID and Grant ID required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        savedGrants: {
          set: user.savedGrants.filter((id) => id !== grantId),
        },
      },
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Error unsaving grant:", error);
    return NextResponse.json(
      { error: "Failed to unsave grant" },
      { status: 500 }
    );
  }
}
