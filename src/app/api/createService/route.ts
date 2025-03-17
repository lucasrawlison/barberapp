import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // console.log("ESTE É O BODY--------------------------: ", body)
    const { value, userId, selectedServices, paymentMethodId } = body;
    const randomCode = Math.floor(Math.random() * 1000000); // Gera código único
    
    if (!value || !userId || !selectedServices) {
      return NextResponse.json(
        { message: "User ID or Title Invalid" },
        { status: 400 }
      );
    }
    
    const service = await prisma.service.create({
        data: {
            value, userId, servicesTypes: selectedServices, code: randomCode, paymentMethodId
        },
    });

    // console.log(service)

    if (service) {
      return NextResponse.json(
        { message: "New service inserted", service },
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
