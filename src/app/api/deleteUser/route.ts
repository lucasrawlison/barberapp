import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/auth";
import { use } from "react";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const session = await auth();
  
  if (!session) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const { userToDelete} = body;

    if (!userToDelete) {
      return NextResponse.json(
        { message: "User to delete Invalid" },
        { status: 400 }
      );
    }
    // Check if user exists
    const userExists = await prisma.user.findUnique({
      where: {
        id: session?.user?.id,

      }
    });

    if (!userExists) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    if(!userExists.isRoot && userToDelete.isRoot){
      return NextResponse.json(
        { message: "Não tem permissão para deletar um usário root" },
        { status: 403 }
      );
    }

    if(userExists.id === userToDelete.id) {
      return NextResponse.json(
        { message: "Não pode deletar seu próprio usuário." },
        { status: 403 }
      );
    }

    const response = await prisma.user.delete({
        where: {
            id: userToDelete.id
        }
    })


    if (response) {
      return NextResponse.json(
        { message: "User deleted", response },
        { status: 200 }
      );
    }

  } catch (error) {
    console.error("Error while deleting user", error);
    return NextResponse.json(
      { message: "Internal server error" }, 
      { status: 500 }
    );
  }
}
