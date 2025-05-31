import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getNextSequence } from "@/app/api/utils/getNextSequence";
import axios from "axios";

const prisma = new PrismaClient();

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(price);
};

const handleConvertDate = (date: string) => {
  const newDate = new Date(date);

  const formattedDate = newDate.toLocaleString("pt-BR", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return formattedDate;
};

export async function POST(req: NextRequest) {
  const url = process.env.NEXT_PUBLIC_WPPSERVER_URL;

  try {
    const body = await req.json();
    console.log("ESTE É O BODY--------------------------: ", body)
    const {
      value,
      userId,
      servicesValue,
      selectedServices,
      paymentMethodId,
      customerId,
      date,
      discount,
    } = body;
    const randomCode = await getNextSequence("service");

    if (!userId) {
      return NextResponse.json(
        { message: "Usuário invalido" },
        { status: 400 }
      );
    }

    if (selectedServices.length === 1 && selectedServices[0].id === "") {
      return NextResponse.json(
        { message: "Selecione ao menos um Serviço" },
        { status: 400 }
      );
    }

    if (!value) {
      return NextResponse.json(
        { message: "Selecione um Serviço" },
        { status: 400 }
      );
    }

    if (value < 0) {
      return NextResponse.json(
        { message: "Valor total negativo" },
        { status: 400 }
      );
    }

    if (!paymentMethodId) {
      return NextResponse.json(
        { message: "Selecione um método de pagamento" },
        { status: 400 }
      );
    }

    // console.log("ESTE É O BODY--------------------------: ", body)
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Usuário invalido" },
        { status: 400 }
      );
    }

    const paymentMethod = await prisma.paymentMethod.findUnique({
      where: { id: paymentMethodId },
    });

    if (paymentMethod?.name === "Não Pago") {
       const service = await prisma.service.create({
      data: {
        value,
        servicesValue,
        discount,
        createdAt: date ? new Date(date) : new Date(),
        userId,
        servicesTypes: selectedServices,
        code: randomCode.toString(),
        paymentMethodId,
        customerId: customerId ?? null,
      },
      include: {
        paymentMethod: true,
        customer: true,
        user: true,
      },
    });

    console.log(service);
    type ServiceType = { name: string };
    if (service) {
      const serviceList = service.servicesTypes as ServiceType[];

      //Envia mensagens para os admins e para o usuário que registrou o serviço
      if (url) {
        try {
          const admins = await prisma.user.findMany({
            where: {
              profileType: "admin",
              notifications: true,
              phone: { not: null },
            },
          });

          if (admins) {
            admins.map(async (admin) => {
              try {
                const wppResponse = await axios.post(url, {
                  number: "55" + admin.phone,
                  message: `📝 Novo serviço registrado!\n\n
📌 Usuário: ${service.user.name}
${service.discount > 0 && `💸 Desconto: ${formatPrice(service.discount)}`}
Serviços:\n${
                    serviceList &&
                    serviceList.map((service) => `* ${service.name}`).join("\n")
                  }
💲 Valor: ${formatPrice(service.value)}
📅 Data: ${handleConvertDate(service.createdAt.toString())}\n
-----------------------------------`,
                });

                console.log(wppResponse.data);
              } catch (error) {
                console.error("Erro ao enviar mensagem via wppconnect", error);
              }
            });
          }

          if (user.notifications && user.profileType !== "admin") {
            try {
              const wppResponse = await axios.post(url, {
                number: "55" + user.phone,
                message: `📝 Novo serviço registrado!\n\n
📌 Usuário: ${service.user.name}
${service.discount > 0 && `💸 Desconto: ${formatPrice(service.discount)}`}
Serviços:\n${
                  serviceList &&
                  serviceList.map((service) => `* ${service.name}`).join("\n")
                }
💲 Valor: ${formatPrice(service.value)}
📅 Data: ${handleConvertDate(service.createdAt.toString())}\n
-----------------------------------`,
              });

              console.log(wppResponse.data);
            } catch (error) {
              console.error(
                "Erro ao enviar mensagem via wppconnect para o usuário que registrou o serviço",
                error
              );
            }
          }
        } catch (error) {
          console.error(
            "erro ao buscar admins ou erro ao enviar mensagens",
            error
          );
        }
      } else {
        console.error("url api wppconnect offline");
      }
    }

    return NextResponse.json(
      // { message: "New service inserted", service },
      { status: 200 }
    );
    }else{
    const service = await prisma.service.create({
      data: {
        value,
        servicesValue,
        discount,
        createdAt: date ? new Date(date) : new Date(),
        userId,
        servicesTypes: selectedServices,
        code: randomCode.toString(),
        paymentMethodId,
        customerId: customerId ?? null,
        transactions: {
          create: {
            value,
            date: date ? new Date(date) : new Date(),
            paymentMethodId,
            description: `Serviço de código ${randomCode}`,
            userId,
            type: "Receita",
            category: "Serviço",
            bankAccountId: paymentMethod?.bankId,
          },
        },
      },
      include: {
        paymentMethod: true,
        customer: true,
        user: true,
      },
    });

    console.log(service);
    type ServiceType = { name: string };
    if (service) {
      const serviceList = service.servicesTypes as ServiceType[];

      //Envia mensagens para os admins e para o usuário que registrou o serviço
      if (url) {
        try {
          const admins = await prisma.user.findMany({
            where: {
              profileType: "admin",
              notifications: true,
              phone: { not: null },
            },
          });

          if (admins) {
            admins.map(async (admin) => {
              try {
                const wppResponse = await axios.post(url, {
                  number: "55" + admin.phone,
                  message: `📝 Novo serviço registrado!\n\n
📌 Usuário: ${service.user.name}
${service.discount > 0 && `💸 Desconto: ${formatPrice(service.discount)}`}
Serviços:\n${
                    serviceList &&
                    serviceList.map((service) => `* ${service.name}`).join("\n")
                  }
💲 Valor: ${formatPrice(service.value)}
📅 Data: ${handleConvertDate(service.createdAt.toString())}\n
-----------------------------------`,
                });

                console.log(wppResponse.data);
              } catch (error) {
                console.error("Erro ao enviar mensagem via wppconnect", error);
              }
            });
          }

          if (user.notifications && user.profileType !== "admin") {
            try {
              const wppResponse = await axios.post(url, {
                number: "55" + user.phone,
                message: `📝 Novo serviço registrado!\n\n
📌 Usuário: ${service.user.name}
${service.discount > 0 && `💸 Desconto: ${formatPrice(service.discount)}`}
Serviços:\n${
                  serviceList &&
                  serviceList.map((service) => `* ${service.name}`).join("\n")
                }
💲 Valor: ${formatPrice(service.value)}
📅 Data: ${handleConvertDate(service.createdAt.toString())}\n
-----------------------------------`,
              });

              console.log(wppResponse.data);
            } catch (error) {
              console.error(
                "Erro ao enviar mensagem via wppconnect para o usuário que registrou o serviço",
                error
              );
            }
          }
        } catch (error) {
          console.error(
            "erro ao buscar admins ou erro ao enviar mensagens",
            error
          );
        }
      } else {
        console.error("url api wppconnect offline");
      }
    }

    return NextResponse.json(
      // { message: "New service inserted", service },
      { status: 200 }
    );
  }
    // }
  } catch (error) {
    console.error("Error inserting service", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
