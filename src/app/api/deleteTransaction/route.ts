import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id} = body;
    if (!id) {
      return NextResponse.json(
        { message: "Id to delete Invalid" },
        { status: 400 }
      );
    }

    const response = await prisma.transactions.delete({
        where: {
            id
        }
    })


    if (response) {
      return NextResponse.json(
        { message: "Transaction deleted", response },
        { status: 200 }
      );
    }

  } catch (error) {
    console.error("Error while deleting transaction", error);
    return NextResponse.json(
      { message: "Internal server error" }, 
      { status: 500 }
    );
  }
}
