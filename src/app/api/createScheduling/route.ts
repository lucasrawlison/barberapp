import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
// import { getNextSequence } from "../utils/getNextSequence";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("ESTE É O BODY--------------------------: ", body);
    const { scheduling } = body;
    const {
      time,
      // barbershop,
      customer,
      date,
      user,
      servicesTypes,
      description,
    } = scheduling;

    if (!scheduling) {
      return NextResponse.json(
        { message: "scheduling Invalid" },
        { status: 400 }
      );
    }

    if (!scheduling.customer) {
      return NextResponse.json(
        { message: "É necessário informar um cliente." },
        { status: 400 }
      );
    }

    if (
      scheduling.servicesTypes.length === 1 &&
      scheduling.servicesTypes[0].name === "Selecione"
    ) {
      return NextResponse.json(
        { message: "É necessário informar um serviço." },
        { status: 400 }
      );
    }

    if (!scheduling.time) {
      return NextResponse.json(
        { message: "É necessário informar o horário." },
        { status: 400 }
      );
    }

    if (!scheduling.user.id) {
      return NextResponse.json(
        { message: "É necessário informar o usuário." },
        { status: 400 }
      );
    }


    const [ano, mes, dia] = date.split("-");
    const isoDate = `${ano}-${mes.padStart(2, "0")}-${dia.padStart(2, "0")}`;

    // Concatenando com hora (sem o “Z” = horário local), mas poderia adicionar “Z”:
    const concatenated = `${isoDate}T${time}:00.000Z`;
    const newScheduling = await prisma.scheduling.create({
      data: {
        dateTime: concatenated,
        date,
        status: "agendado",
        time,
        barbershop: {
          connect: {
            id: user.barbershop.id,
          },
        },
        customer: {
          connect: {
            id: customer.id,
          },
        },
        user: {
          connect: {
            id: user.id,
          },
        },
        servicesTypes,
        description,
      },
    });

    // console.log(service)

    if (newScheduling) {
      return NextResponse.json(
        { message: "New scheduling inserted", newScheduling },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Error inserting scheduling", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
