import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getNextSequence } from "../utils/getNextSequence";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("ESTE É O BODY--------------------------: ", body)
    const { user } = body;
    
    if (!user) {
      return NextResponse.json(
        { message: "User Invalid" },
        { status: 400 }
      );
    }

    const code = await getNextSequence("user");
    
    
    const newUser = await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        login: user.login,
        profileType: user.profileType,
        profileImgLink: user.profileImgLink,
        active: user.active,
        password: "123",
        code: code.toString(),
      },
    });

    // console.log(service)

    if (newUser) {
      return NextResponse.json(
        { message: "New user inserted", newUser },
        { status: 200 }
      );
    }

  } catch (error) {
    console.error("Error inserting user", error);
    return NextResponse.json(
      { message: "Internal server error" }, 
      { status: 500 }
    );
  }
}
