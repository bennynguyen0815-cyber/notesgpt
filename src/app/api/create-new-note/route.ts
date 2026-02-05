import { prisma } from "@/src/db/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId") || "";

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  // Ensure the user exists in the database so the FK constraint won't fail
  try {
    await prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: {
        id: userId,
        email: "",
      },
    });
  } catch (error) {
    console.error('User upsert failed:', error);
  }

  const { id } = await prisma.note.create({
    data: {
      authorId: userId,
      text: "",
    },
  });

  return NextResponse.json({
    noteId: id,
  });
}