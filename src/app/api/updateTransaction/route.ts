import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // console.log(body)
    const { transaction } = body;   
    console.log(transaction)
     
    if (!transaction) {
      return NextResponse.json(
        { message: "no transaction inserted" },
        { status: 400 }
      );
    }


    if(transaction.service){
        const {id, code, user, paymentMethod, customer, ...resto} = transaction.service
        console.log(id, code, user, paymentMethod, customer)
        try {
            
            const updatedService = await prisma.service.update(
                {where: {
                    id
                },
            data: {
               ...resto,
               
            }}
            ) 

            console.log(updatedService)
        } catch (error) {
          console.error("Error updating service", error);
          return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
          );
        }


    }
    const {id, description, value, date, type, category, paymentMethodId} = transaction
    

    const updateTransaction = await prisma.transactions.update({
      where: {
        id,
      },
      data: {
        description,
        value,
        date,
        type,
        category,
        paymentMethodId,
      },
      include: {
        bankAccount: true,
        paymentMethod: {
            include: {
                bankAccount: true,

            }
        },
        service: {
          include: { paymentMethod: true, customer: true },
        },
        user: true,
      },
    });

    // console.log(service)

    if (updateTransaction) {
      return NextResponse.json(
        { message: "Transaction updated", updateTransaction },
        { status: 200 }
      );
    }

  } catch (error) {
    console.error("Error updating transaction", error);
    return NextResponse.json(
      { message: "Internal server error" }, 
      { status: 500 }
    );
  }
}
