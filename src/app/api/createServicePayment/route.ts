import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("Recebendo body:", body); // Depuração
    const { newTransaction, userId } = body;

    if (!body?.newTransaction) {
      console.log("sem transaction");
      return NextResponse.json(
        { message: "New Transaction Invalid" },
        { status: 400 }
      );
    }

    const service = await prisma.service.findUnique({
      where: { id: newTransaction.serviceId },
    });

    if (!service) {
      return NextResponse.json(
        { message: "Serviço não encontrado" },
        { status: 400 }
      );
    }

    if (!userId) {
      console.log("sem userID");
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }
    const { value, date, paymentMethodId, serviceId } = newTransaction;

    if (!value || value <= 0) {
      return NextResponse.json(
        { message: "Valor inválido para o pagamento" },
        { status: 400 }
      );
    }

    if (!paymentMethodId) {
      return NextResponse.json(
        { message: "Selecione um método de pagamento" },
        { status: 400 }
      );
    }

    if (!date) {
      return NextResponse.json(
        {
          message: "Insira a data em que a transação foi realizada",
        },
        { status: 400 }
      );
    }

    const paymentMethod = await prisma.paymentMethod.findUnique({
      where: { id: paymentMethodId },
    });

    if (!paymentMethod) {
      return NextResponse.json(
        { message: "Método de pagamento não encontrado" },
        { status: 400 }
      );
    }

    const transaction = await prisma.transactions.create({
      data: {
        description: "Serviço de código: " + service.code,
        value,
        date: new Date(date),
        category: "Serviço",
        type: "Receita",
        userId,
        serviceId,
        paymentMethodId,
        bankAccountId: paymentMethod?.bankId,
      },
    });

    if (!transaction) {
      return NextResponse.json(
        { message: "Erro ao inserir transação" },
        { status: 500 }
      );
    }

    const updatedService = await prisma.service.findUnique({
      where: { id: serviceId },
      include: {
        user: true,
        paymentMethod: {
          include: { bankAccount: true },
        },
        customer: true,
        transactions: {
          include: { paymentMethod: true, bankAccount: true },
        },
      },
    });

    if (!updatedService) {
      return NextResponse.json(
        { message: "Serviço atualizado não encontrado" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: "New transaction inserted", transaction, updatedService },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error inserting transaction", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
