import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const [transactions, total] = await Promise.all([
      
      prisma.transactions.findMany({
        skip,
        take: limit,
        orderBy: {
          id: "desc"
  
        },
      }),
      prisma.transactions.count(),
    ]) ;



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
