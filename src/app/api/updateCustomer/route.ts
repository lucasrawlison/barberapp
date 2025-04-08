import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // console.log(body)
    const { customer } = body;   
     
    if (!customer) {
      return NextResponse.json(
        { message: "Value, selectedServices or serviceId missing" },
        { status: 400 }
      );
    }
    
    const updatedCustomer = await prisma.customer.update({
        where: {
            id: customer.id
        },
        data: {
            name: customer.name,
            email: customer.email,
            phone: customer.phone
        }
    })

    // console.log(service)

    if (customer) {
      return NextResponse.json(
        { message: "Customer updated", updatedCustomer },
        { status: 200 }
      );
    }

  } catch (error) {
    console.error("Error updating customer", error);
    return NextResponse.json(
      { message: "Internal server error" }, 
      { status: 500 }
    );
  }
}
