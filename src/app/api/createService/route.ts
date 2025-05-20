import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import {getNextSequence}  from "@/app/api/utils/getNextSequence";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // console.log("ESTE É O BODY--------------------------: ", body)
    const { value, userId, servicesValue, selectedServices, paymentMethodId, customerId, date, discount} = body;
    const randomCode = await getNextSequence("service");
    
    if (!userId ) {
      return NextResponse.json(
        { message: "Usuário invalido" },
        { status: 400 }
      );
    }

    if(selectedServices.length === 1 && selectedServices[0].id === ""){
      return NextResponse.json(
        { message: "Selecione ao menos um Serviço" },
        { status: 400 }
      );
    }

    if(!value){
      return NextResponse.json(
        { message: "Selecione um Serviço" },
        { status: 400 }
      );
    }

    if(value < 0){
      return NextResponse.json(
        { message: "Valor total negativo" },
        { status: 400 }
      );
    }

      if(!paymentMethodId){
        return NextResponse.json(
          { message: "Selecione um método de pagamento" },
          { status: 400 }
        );
      }


    // console.log("ESTE É O BODY--------------------------: ", body)

    const paymentMethod = await prisma.paymentMethod.findUnique({
      where: { id: paymentMethodId },
    });
    
    const service = await prisma.service.create({
        data: {
            value, servicesValue, discount, createdAt: date ? new Date(date): new Date(), userId, servicesTypes: selectedServices, code: randomCode.toString(), paymentMethodId, customerId: customerId ?? null,
            transactions: {
              create: {
                value, date: date ? new Date(date): new Date(), paymentMethodId, description: `Serviço de código ${randomCode}`, userId, type: "Receita", category: "Serviço", bankAccountId: paymentMethod?.bankId,
              }
            }
        },
        include: {
          paymentMethod: true,
          customer: true,
          user: true
        }
    });

    // console.log(service)

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
