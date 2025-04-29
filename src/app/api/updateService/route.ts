import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // console.log(body)
    const { selectedService } = body;   
     
    if (!selectedService) {
      return NextResponse.json(
        { message: "Value, selectedServices or serviceId missing" },
        { status: 400 }
      );
    }

    const {id, value, servicesTypes, paymentMethod, customerId} = selectedService
    

    const service = await prisma.service.update({
      where:{
        id
      }, 
      data: {
            value, servicesTypes, paymentMethodId: paymentMethod.id, customerId
        },
        include:{
          user:true,
          paymentMethod:true
        }
    });

    // console.log(service)

    if (service) {
      return NextResponse.json(
        { message: "Service updated", service },
        { status: 200 }
      );
    }

  } catch (error) {
    console.error("Error updating service", error);
    return NextResponse.json(
      { message: "Internal server error" }, 
      { status: 500 }
    );
  }
}
