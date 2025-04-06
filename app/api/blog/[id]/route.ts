import { NextResponse } from "next/server"
import { getBlogPostById } from "@/lib/blog-data"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const post = await getBlogPostById(params.id)

    if (!post) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 })
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error(`Error fetching blog post ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to fetch blog post" }, { status: 500 })
  }
}

