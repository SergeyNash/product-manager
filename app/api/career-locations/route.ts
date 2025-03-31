import { NextResponse } from "next/server"
import { getCareerLocations } from "@/lib/career-data"

export async function GET() {
  try {
    const locations = await getCareerLocations()
    return NextResponse.json(locations)
  } catch (error) {
    console.error("Error fetching career locations:", error)
    return NextResponse.json({ error: "Failed to fetch career locations" }, { status: 500 })
  }
}

