import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const data = await request.json()
    const { fullName, hourlyRate } = data

    const worker = await prisma.worker.update({
      where: { id: parseInt(id) },
      data: {
        fullName,
        hourlyRate: parseFloat(hourlyRate),
      },
    })

    return NextResponse.json(worker)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update worker" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    await prisma.worker.delete({
      where: { id: parseInt(id) },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete worker" },
      { status: 500 }
    )
  }
}
