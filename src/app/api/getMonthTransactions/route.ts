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

    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    console.log(firstDayOfMonth, lastDayOfMonth);
    const transactions = await prisma.transactions.findMany({
      where: {
        date: {
          gte: firstDayOfMonth,
          lte: lastDayOfMonth,
        },
      },
      orderBy: {
        id: "desc",
      },
    });

    if (transactions) {
      // console.log(transactions)
      return NextResponse.json(
        { message: "transactions", transactions },
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
