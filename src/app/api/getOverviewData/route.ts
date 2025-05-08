import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET( request: Request) {
  try {
    const userId = request.headers.get("Userid") || null;
    if(!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (user?.profileType !== "admin") {
      return NextResponse.json(
        { message: "User is not admin" },
        { status: 403 }
      );
    }
    const transactions = await prisma.transactions.findMany({
      orderBy: { id: "desc" },
    });

    if (transactions.length === 0) {
      return NextResponse.json(
        { message: "No transactions found", transactions },
        { status: 400 }
      );
    }
    // console.log(transactions)
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
   
    const monthOrder = [
      "Jan.", "Fev.", "Mar.", "Abr.", "Mai.", "Jun.",
      "Jul.", "Ago.", "Set.", "Out.", "Nov.", "Dez."
    ];
    
    // Juntar todos os meses únicos
    const allMonthsSet = new Set([
      ...Object.keys(revenueByMonth),
      ...Object.keys(expenseByMonth),
    ]);
    
    // Converter para array e ordenar de acordo com a ordem do mês
    const allMonths = Array.from(allMonthsSet).sort(
      (a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b)
    );
    
    // Montar os dados do gráfico
    const chartData = allMonths.map((month) => ({
      month,
      revenue: revenueByMonth[month] || 0,
      expenses: expenseByMonth[month] || 0,
    }));


    return NextResponse.json({ message: "Chart Data", chartData }, { status: 200 });
  } catch (error) {
    console.error("Error fetching transactions", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
