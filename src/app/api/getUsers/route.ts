import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST() {
  try {

    const users = await prisma.user.findMany({
      include:{
        transactions: true,
        scheduling: true,
        barbershop: true,
        services:true
      }
    });

    // console.log(users)

    if (users) {
      return NextResponse.json(
        { message: "Users:", users },
        { status: 200 }
      );
    }

    
    
  } catch (error) {
    console.error("Error fetching users", error);
    return NextResponse.json(
      { message: "Internal server error" }, 
      { status: 500 }
    );
  }
}
