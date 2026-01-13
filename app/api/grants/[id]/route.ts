import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateGrantSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  organization: z.string().min(1).optional(),
  category: z.array(z.string()).optional(),
  amount: z.string().optional(),
  deadline: z.string().datetime().optional(),
  requirements: z.string().optional(),
  eligibility: z.string().optional(),
  isActive: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
});

// GET /api/grants/[id] - Get single grant
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const grant = await prisma.grant.findUnique({
      where: { id: params.id },
    });

    if (!grant) {
      return NextResponse.json(
        { error: "Grant not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(grant);
  } catch (error) {
    console.error("Error fetching grant:", error);
    return NextResponse.json(
      { error: "Failed to fetch grant" },
      { status: 500 }
    );
  }
}

// PATCH /api/grants/[id] - Update grant
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const data = updateGrantSchema.parse(body);

    const updateData: any = { ...data };
    if (data.deadline) {
      updateData.deadline = new Date(data.deadline);
    }

    const grant = await prisma.grant.update({
      where: { id: params.id },
      data: updateData,
    });

    return NextResponse.json(grant);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error updating grant:", error);
    return NextResponse.json(
      { error: "Failed to update grant" },
      { status: 500 }
    );
  }
}

// DELETE /api/grants/[id] - Remove grant
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.grant.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting grant:", error);
    return NextResponse.json(
      { error: "Failed to delete grant" },
      { status: 500 }
    );
  }
}
