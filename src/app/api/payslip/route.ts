import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const workerId = searchParams.get("workerId")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    if (!workerId || !startDate || !endDate) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      )
    }

    const worker = await prisma.worker.findUnique({
      where: { id: parseInt(workerId) },
    })

    if (!worker) {
      return NextResponse.json(
        { error: "Worker not found" },
        { status: 404 }
      )
    }

    const start = new Date(startDate)
    const end = new Date(endDate)

    const attendances = await prisma.attendance.findMany({
      where: {
        workerId: parseInt(workerId),
        date: {
          gte: start,
          lte: end,
        },
      },
    })

    // Calculate total days and hours
    let totalDays = 0
    let totalHours = 0
    for (const attendance of attendances) {
      if (attendance.status === "FULL_DAY") {
        totalDays += 1 // 1 full day
        totalHours += 8 // 1 day = 8 hours
      } else if (attendance.status === "HALF_DAY") {
        totalDays += 0.5 // 0.5 days
        totalHours += 4 // 0.5 days = 4 hours
      }
    }

    const totalAmount = totalHours * worker.hourlyRate

    const payslip = {
      workerId: worker.id,
      workerName: worker.fullName,
      hourlyRate: worker.hourlyRate,
      startDate: start,
      endDate: end,
      totalDays,
      totalWorkDays: attendances.filter((att: typeof attendances[0]) => att.status !== "DAY_OFF").length,
      dayOffCount: attendances.filter((att: typeof attendances[0]) => att.status === "DAY_OFF").length,
      totalHours,
      totalAmount,
      attendances,
    }

    return NextResponse.json(payslip)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Failed to generate payslip" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { workerId, startDate, endDate } = data

    if (!workerId || !startDate || !endDate) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const worker = await prisma.worker.findUnique({
      where: { id: parseInt(workerId) },
    })

    if (!worker) {
      return NextResponse.json(
        { error: "Worker not found" },
        { status: 404 }
      )
    }

    const start = new Date(startDate)
    const end = new Date(endDate)

    const attendances = await prisma.attendance.findMany({
      where: {
        workerId: parseInt(workerId),
        date: {
          gte: start,
          lte: end,
        },
      },
    })

    let totalDays = 0
    let totalHours = 0
    for (const attendance of attendances) {
      if (attendance.status === "FULL_DAY") {
        totalDays += 1 // 1 full day
        totalHours += 8 // 1 day = 8 hours
      } else if (attendance.status === "HALF_DAY") {
        totalDays += 0.5 // 0.5 days
        totalHours += 4 // 0.5 days = 4 hours
      }
    }

    const totalAmount = totalHours * worker.hourlyRate

    const payslip = await prisma.payslip.create({
      data: {
        workerId: parseInt(workerId),
        startDate: start,
        endDate: end,
        totalHours,
        totalAmount,
      },
    })

    return NextResponse.json(payslip, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Failed to save payslip" },
      { status: 500 }
    )
  }
}
