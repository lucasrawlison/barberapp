import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("Recebendo body:", body); // Depuração

    if (!body?.newTransaction) {
      return NextResponse.json(
        { message: "New Transaction Invalid" },
        { status: 400 }
      );
    }

    const { newTransaction, userId } = body;
    const { description, value, date, category, type, paymentMethodId } = newTransaction;

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    const transaction = await prisma.transactions.create({
      data: {
        description,
        value,
        date: new Date(date), // Converter string para Date corretamente
        category,
        type,
        userId,
        paymentMethodId,
      },
    });

    return NextResponse.json(
      { message: "New transaction inserted", transaction },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error inserting transaction", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

