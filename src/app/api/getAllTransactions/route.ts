import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = request.headers.get("Userid") || null;

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (user?.profileType !== "admin") {
      return NextResponse.json(
        { message: "User is not admin" },
        { status: 403 }
      );
    }
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const [transactions, total] = await Promise.all([
      prisma.transactions.findMany({
        skip,
        take: limit,
        orderBy: {
          id: "desc",
        },
        include: {
         paymentMethod:{
          include: {
            bankAccount: true,
          },
         },
         bankAccount: true,
         service: true,
         user: true
        },
      }),
      prisma.transactions.count(),
    ]);

    if (transactions) {
      return NextResponse.json(
        {
          message: "transactions",
          transactions,
          pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
          },
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Error fetching transactions", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
