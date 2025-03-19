import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { newTransaction, userId } = body;
    const {description, value, date, category, type, paymentMethodId} = newTransaction
    if (!newTransaction) {
      return NextResponse.json(
        { message: "New Transaction Invalid" },
        { status: 400 }
      );
    }
    
    const transaction = await prisma.transactions.create({
        data: {
            description, value, date, category, type, userId, paymentMethodId
            }
        })
    

    // console.log(service)

    if (transaction) {
      return NextResponse.json(
        { message: "New transaction inserted", transaction },
        { status: 200 }
      );
    }

  } catch (error) {
    console.error("Error inserting service", error);
    return NextResponse.json(
      { message: "Internal server error" }, 
      { status: 500 }
    );
  }
}
