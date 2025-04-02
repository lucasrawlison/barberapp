import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { selectedService} = body;
    console.log(body)
    if (!selectedService) {
      return NextResponse.json(
        { message: "Service Invalid" },
        { status: 400 }
      );
    }
    
    const response = await prisma.service.delete({
        where: {
            id: selectedService.id
        }
    })


    if (response) {
      return NextResponse.json(
        { message: "Service deleted", service: response },
        { status: 200 }
      );
    }

  } catch (error) {
    console.error("Error while delete service", error);
    return NextResponse.json(
      { message: "Internal server error" }, 
      { status: 500 }
    );
  }
}
