import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DollarSign, TrendingDown, TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useEffect } from "react";
import { Tooltip } from "@radix-ui/react-tooltip";
import { TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Dados {
  month: string;
  revenue: number;
  expenses: number;
}

interface OverviewProps {
  income: number;
  expense: number;
  profit: number;
  isLoadingMonth: boolean;
  chartData: Dados[] | undefined;
  fetchMonthTransactions: ()=> void
}

export function Overview({
  income,
  expense,
  profit,
  isLoadingMonth,
  chartData,
  fetchMonthTransactions
}: OverviewProps) {

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price)
  }

  useEffect(()=> {
    const interval = setInterval(()=> {
      console.log("fetching data:")
      fetchMonthTransactions();
    }, 10000)

    return ()=> clearInterval(interval)
  }, [])
  
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium flex flex-row items-center">
                    <span>Receita total</span>
                    <span className="ml-2 text-primary/50">{"(Este mês)"}</span>
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {isLoadingMonth && !income ? (
                      <Skeleton key={1} className="w-52 h-4 mb-4" />
                    ) : (
                      formatPrice(income)
                    )}
                  </div>
                  <></>
                  {/* {isLoadingMonth ? (
              <Skeleton key={2} className="w-52 h-2 mb-4" />
            ) : (
              <p className="text-xs text-muted-foreground">
                {" "}
                + 12% que o último mês{" "}
              </p>
            )} */}
                </CardContent>
              </Card>
            </TooltipTrigger>
            <TooltipContent>
              <p>Atualizando em tempo real</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    <span>Despesa Total</span>
                    <span className="ml-2 text-primary/50">{"(Este mês)"}</span>
                  </CardTitle>
                  <TrendingDown className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {isLoadingMonth && !expense ? (
                      <Skeleton key={1} className="w-52 h-4 mb-4" />
                    ) : (
                      formatPrice(expense)
                    )}
                  </div>
                  <></>
                  {/* {isLoadingMonth ? (
              <Skeleton key={2} className="w-52 h-2 mb-4" />
            ) : (
              <p className="text-xs text-muted-foreground">
                + 12% que o último mês
              </p>
            )} */}
                </CardContent>
              </Card>
            </TooltipTrigger>
            <TooltipContent>
              <p>Atualizando em tempo real.</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    <span>Renda Líquida</span>
                    <span className="ml-2 text-primary/50">{"(Este mês)"}</span>
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {isLoadingMonth && !profit ? (
                      <Skeleton key={1} className="w-52 h-4 mb-4" />
                    ) : (
                      formatPrice(profit)
                    )}
                  </div>
                  <></>
                  {/* {isLoadingMonth ? (
            <Skeleton key={2} className="w-52 h-2 mb-4" />
            ) : (
              <p className="text-xs text-muted-foreground">
                + 12% que o último mês
              </p>
            )} */}
                </CardContent>
              </Card>
            </TooltipTrigger>
            <TooltipContent>
              <p>Atualizando em tempo real.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Receita geral</CardTitle>
            <CardDescription>Receita mensal do ano</CardDescription>
          </CardHeader>
          <CardContent className="px-2">
            <ChartContainer
              config={{
                Receita: {
                  label: "Revenue",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="aspect-[4/3]"
            >
              <RechartsBarChart
                data={chartData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="revenue"
                  fill="var(--color-revenue)"
                  radius={[4, 4, 0, 0]}
                />
              </RechartsBarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Divisão de despesa</CardTitle>
            <CardDescription>Despesa mensal do ano</CardDescription>
          </CardHeader>
          <CardContent className="px-2">
            <ChartContainer
              config={{
                expenses: {
                  label: "Expenses",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="aspect-[4/3]"
            >
              <RechartsBarChart
                data={chartData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="expenses"
                  fill="var(--color-expenses)"
                  radius={[4, 4, 0, 0]}
                />
              </RechartsBarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
