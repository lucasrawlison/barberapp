import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("Este é o body: ", body);

    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        {
          message: "No userId detected",
        },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        {
          message: "User not found",
        },
        { status: 400 }
      );
    }

    if (user.profileType === "admin") {
      const services = await prisma.service.findMany({
        orderBy: {
          id: "desc",
        },
        include: {
          user: true,
        },
      });

      if (services) {
        return NextResponse.json(
          { message: "Services", services },
          { status: 200 }
        );
      }
    }

    if (user.profileType === "barber") {
      const services = await prisma.service.findMany({
        where: {
          userId,
        },
        orderBy: {
          id: "desc",
        },
        include: {
          user: true,
        },
      });

      if (services) {
        return NextResponse.json(
          { message: "Services", services },
          { status: 200 }
        );
      }
    }
  } catch (error) {
    console.error("Error fetching services", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
