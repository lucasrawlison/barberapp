import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const userId = request.headers.get("Userid") || null;

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }


    const banks = await prisma.bankAccount.findMany({
      include: {
        transactions: true,
        paymentMethods: true,
      },
    });

    // console.log(users)

    if (banks) {
      return NextResponse.json({ message: "Banks:", banks }, { status: 200 });
    }
  } catch (error) {
    console.error("Error fetching banks", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
