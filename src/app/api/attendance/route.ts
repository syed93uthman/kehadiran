import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const workerId = searchParams.get("workerId")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    const where: any = {}
    if (workerId) {
      where.workerId = parseInt(workerId)
    }
    if (startDate || endDate) {
      where.date = {}
      if (startDate) {
        where.date.gte = new Date(startDate)
      }
      if (endDate) {
        where.date.lte = new Date(endDate)
      }
    }

    const attendances = await prisma.attendance.findMany({
      where,
      include: { worker: true },
      orderBy: { date: "desc" },
    })

    return NextResponse.json(attendances)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch attendances" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { workerId, date, status } = data

    if (!workerId || !date || !status) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Check if attendance already exists for this date
    const existing = await prisma.attendance.findUnique({
      where: {
        workerId_date: {
          workerId: parseInt(workerId),
          date: new Date(date),
        },
      },
    })

    if (existing) {
      // Update existing
      const updated = await prisma.attendance.update({
        where: {
          workerId_date: {
            workerId: parseInt(workerId),
            date: new Date(date),
          },
        },
        data: { status },
      })
      return NextResponse.json(updated)
    } else {
      // Create new
      const attendance = await prisma.attendance.create({
        data: {
          workerId: parseInt(workerId),
          date: new Date(date),
          status,
        },
      })
      return NextResponse.json(attendance, { status: 201 })
    }
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Failed to record attendance" },
      { status: 500 }
    )
  }
}
