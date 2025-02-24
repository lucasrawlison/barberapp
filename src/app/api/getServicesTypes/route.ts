import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST() {
  try {

    const servicesTypes = await prisma.servicesTypes.findMany({
    });

    console.log(servicesTypes)

    if (servicesTypes) {
      return NextResponse.json(
        { message: "Services types", servicesTypes },
        { status: 200 }
      );
    }

    
    
  } catch (error) {
    console.error("Error fetching services types", error);
    return NextResponse.json(
      { message: "Internal server error" }, 
      { status: 500 }
    );
  }
}
