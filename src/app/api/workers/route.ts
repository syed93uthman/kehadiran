import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET() {
  try {
    const workers = await prisma.worker.findMany()
    return NextResponse.json(workers)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch workers" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { fullName, hourlyRate } = data

    if (!fullName || !hourlyRate) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const worker = await prisma.worker.create({
      data: {
        fullName,
        hourlyRate: parseFloat(hourlyRate),
      },
    })

    return NextResponse.json(worker, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create worker" },
      { status: 500 }
    )
  }
}
