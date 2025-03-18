import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // console.log("ESTE É O BODY--------------------------: ", body)
    const { customer } = body;
    
    if (!customer) {
      return NextResponse.json(
        { message: "User Invalid" },
        { status: 400 }
      );
    }
    
    const newCustomer = await prisma.customer.create({
      data: {
        name: customer.name,
        phone: customer.phone,
        email: customer.email,
      },
    });

    // console.log(service)

    if (newCustomer) {
      return NextResponse.json(
        { message: "New customer inserted", newCustomer },
        { status: 200 }
      );
    }

  } catch (error) {
    console.error("Error inserting customer", error);
    return NextResponse.json(
      { message: "Internal server error" }, 
      { status: 500 }
    );
  }
}
