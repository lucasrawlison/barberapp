import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const transactions = await prisma.transactions.findMany({
      orderBy: { id: "desc" },
    });

    if (transactions.length === 0) {
      return NextResponse.json(
        { message: "No transactions found", transactions },
        { status: 400 }
      );
    }

    // Objetos para armazenar os valores das receitas e despesas por mês
    const revenueByMonth: { [key: string]: number } = {};
    const expenseByMonth: { [key: string]: number } = {};

    // Processar todas as transações em um único loop
    transactions.forEach((transaction) => {
      const date = new Date(transaction.date);
      const month = date.toLocaleString("pt-BR", { month: "short" }); // "jan", "fev", "mar"...
      const formattedMonth = month.charAt(0).toUpperCase() + month.slice(1); // "Jan", "Fev", "Mar"...

      if (transaction.type === "Receita") {
        revenueByMonth[formattedMonth] = (revenueByMonth[formattedMonth] || 0) + transaction.value;
      } else if (transaction.type === "Despesa") {
        expenseByMonth[formattedMonth] = (expenseByMonth[formattedMonth] || 0) + transaction.value;
      }
    });

    // Criar os arrays de receitas e despesas
    const chartData = Object.keys(revenueByMonth).map((month) => ({
      month,
      revenue: revenueByMonth[month] || 0,
      expenses: expenseByMonth[month] || 0,
    }));

    console.log(chartData)
    return NextResponse.json({ message: "Chart Data", chartData }, { status: 200 });
  } catch (error) {
    console.error("Error fetching transactions", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
