import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log(body)
    const { selectedUser } = body;   
     
    if (!selectedUser) {
      return NextResponse.json(
        { message: "Selected user is missing" },
        { status: 400 }
      );
    }
    
    const updatedUser = await prisma.user.update({
        where: {
            id: selectedUser.id
        },
        data: {
            name: selectedUser.name,
            email: selectedUser.email,
            login: selectedUser.login,
            active: selectedUser.active,

        }
    })

    // console.log(service)

    if (updatedUser) {
      return NextResponse.json(
        { message: "Customer updated", updatedUser },
        { status: 200 }
      );
    }

  } catch (error) {
    console.error("Error updating user", error);
    return NextResponse.json(
      { message: "Internal server error" }, 
      { status: 500 }
    );
  }
}
