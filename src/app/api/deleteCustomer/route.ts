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

    const customer = await prisma.customer.findUnique({
      where: {
        id
      },
      include:{
        services: true
      }
    })
    
    if(customer?.services){

      if(customer?.services?.length > 0 ){
        return NextResponse.json(
          { message: "Não é possível apagar clientes com serviços realizados." },
          { status: 400 }
        );
      }
    }
    
    const response = await prisma.customer.delete({
        where: {
            id
        }
    })


    if (response) {
      return NextResponse.json(
        { message: "Customer deleted", response },
        { status: 200 }
      );
    }

  } catch (error) {
    console.error("Error while deleting customer", error);
    return NextResponse.json(
      { message: "Internal server error" }, 
      { status: 500 }
    );
  }
}
