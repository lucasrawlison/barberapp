import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST() {
  try {

    const paymentMethods = await prisma.paymentMethod.findMany({
      include: {
        bankAccount: true,
      }
    });

    // console.log(paymentMethods)

    if (paymentMethods) {
      return NextResponse.json(
        { message: "paymentMethods types", paymentMethods },
        { status: 200 }
      );
    }

    
    
  } catch (error) {
    console.error("Error fetching paymentMethods", error);
    return NextResponse.json(
      { message: "Internal server error" }, 
      { status: 500 }
    );
  }
}
