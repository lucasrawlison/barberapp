import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import NoWorkResult_ from "postcss/lib/no-work-result";

const prisma = new PrismaClient();

export async function GET() {
  try {
    
    const transactions = await prisma.transactions.findMany({
      orderBy: {
        id: "desc"

      },
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
