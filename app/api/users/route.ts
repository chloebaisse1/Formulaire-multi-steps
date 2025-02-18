import prisma from "@/lib/db"

import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const user = await prisma.user.create({
      data: {
        ...data,
        technologies: JSON.stringify(data.technologies),
      },
    })

    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "An error occured" }, { status: 500 })
  }
}
