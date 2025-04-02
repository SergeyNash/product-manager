import { NextResponse } from "next/server"
import { getBiography } from "@/lib/biography-data"

export async function GET() {
  try {
    const biography = await getBiography()
    return NextResponse.json(biography)
  } catch (error) {
    console.error("Error fetching biography:", error)
    return NextResponse.json({ error: "Failed to fetch biography" }, { status: 500 })
  }
}

