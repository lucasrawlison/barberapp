import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST() {
  try {

    const transactions = await prisma.transactions.findMany({
    });


    if (transactions) {
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
