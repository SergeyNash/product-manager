import { NextResponse } from "next/server"
import { getBlogPosts } from "@/lib/blog-data"

// Добавляем эту строку для поддержки статического экспорта
export const dynamic = "force-static"

export async function GET() {
  try {
    const posts = await getBlogPosts()
    return NextResponse.json(posts)
  } catch (error) {
    console.error("Error fetching blog posts:", error)
    return NextResponse.json({ error: "Failed to fetch blog posts" }, { status: 500 })
  }
}

