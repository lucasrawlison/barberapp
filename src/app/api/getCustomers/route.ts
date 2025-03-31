import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {

    const customers = await prisma.customer.findMany({
    });


    if (customers) {
      return NextResponse.json(
        { message: "customers", customers },
        { status: 200 }
      );
    }

    
    
  } catch (error) {
    console.error("Error fetching customers", error);
    return NextResponse.json(
      { message: "Internal server error" }, 
      { status: 500 }
    );
  }
}
