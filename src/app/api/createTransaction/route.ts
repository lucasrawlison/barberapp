import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("Recebendo body:", body); // Depuração

    if (!body?.newTransaction) {
      console.log("sem transaction");
      return NextResponse.json(
        { message: "New Transaction Invalid" },
        { status: 400 }
      );
    }

    const { newTransaction, userId } = body;
    const { description, value, date, category, type, paymentMethodId } =
      newTransaction;



    if (!userId) {
      console.log("sem userID");
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    if(!type){
      return NextResponse.json(
        {message: "É necessário informar um tipo para a transação"},
        {status: 400}
      )
    }

    if((category !== "Serviço" && type === "Receita") ||(type === "Despesa") && !value){
      return NextResponse.json(
        {message: "Insira o valor da transação"},
        {status: 400}
      )
    }
    if(!description){
      return NextResponse.json(
        {message: "É necessário informar uma descrição para a transação"},
        {status: 400}
      )
    }
    if(!category){
      return NextResponse.json(
        {message: "É necessário informar uma categoria para a transação"},
        {status: 400}
      )
    }
    if(!paymentMethodId){
      return NextResponse.json(
        {message: "Selecione um método de pagamento"},
        {status: 400}
      )
    }

    if(!date){
      return NextResponse.json({
        message: "Insira a data em que a transação foi realizada"
      },
    {status: 400})
    }

    

    const paymentMethod = await prisma.paymentMethod.findUnique({
      where: { id: paymentMethodId },
    });

    const transaction = await prisma.transactions.create({
      data: {
        description,
        value,
        date: new Date(date),
        category,
        type,
        userId,
        paymentMethodId,
        bankAccountId: paymentMethod?.bankId, 
      },
    });

    return NextResponse.json(
      { message: "New transaction inserted", transaction },
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
