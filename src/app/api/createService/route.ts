import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log(body)
    const { name, value, userId, servicesTypes } = body;
    if (!name || ! value) {
      return NextResponse.json(
        { message: "User ID or Title Invalid" },
        { status: 400 }
      );
    }

    const service = await prisma.service.create({
        data: {
            name, value, userId, servicesTypes
        },
    });

    console.log(service)

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
