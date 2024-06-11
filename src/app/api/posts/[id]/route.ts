import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const post = await prisma.post.findUnique({
      where: { id: Number(params.id) },
    });
    if (post) {
      return NextResponse.json(post);
    } else {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }
  } catch (error: any) {
    console.error("Error fetching post:", error);
    return NextResponse.json(
      { message: "Error fetching post" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { title, content } = await req.json();
    const updatedPost = await prisma.post.update({
      where: { id: Number(params.id) },
      data: { title, content },
    });
    return NextResponse.json(updatedPost);
  } catch (error: any) {
    console.error("Error updating post:", error);
    return NextResponse.json(
      { message: "Error updating post" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const id = req.url.split("/").pop(); // Extract the ID from the URL
  try {
    if (!id || isNaN(Number(id))) {
      throw new Error("Invalid post ID");
    }
    await prisma.post.delete({
      where: { id: Number(id) },
    });
    return new NextResponse(null, { status: 204 }); // Return a 204 No Content response
  } catch (error: any) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      { message: "Error deleting post" },
      { status: 500 }
    );
  }
}
