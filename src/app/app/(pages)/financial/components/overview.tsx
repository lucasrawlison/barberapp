import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { DollarSign, TrendingDown, TrendingUp } from "lucide-react"
import { Bar, BarChart as RechartsBarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { useEffect } from "react"

const revenueData = [
    { month: "Jan", revenue: 2400, expense: 400},
    { month: "Feb", revenue: 1398, expense: 60000 },
    { month: "Mar", revenue: 9800 },
    { month: "Apr", revenue: 3908 },
    { month: "May", revenue: 4800 },
    { month: "Jun", revenue: 3800 },
  ]
  
  const expenseData = [
    { month: "Jan", expenses: 1400 },
    { month: "Feb", expenses: 1100 },
    { month: "Mar", expenses: 3200 },
    { month: "Apr", expenses: 2900 },
    { month: "May", expenses: 2800 },
    { month: "Jun", expenses: 2100 },
  ]

  interface Dados {
    month: string,
    revenue: number,
    expenses: number
  }


interface OverviewProps {
    income: number,
    expense: number,
    profit: number,
    isLoading: boolean
    chartData: Dados[] | undefined
}




export function Overview ( { income, expense, profit, isLoading, chartData} : OverviewProps) {

  useEffect(()=> {
    console.log(chartData)
  }, [chartData])
    return (
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Receita total
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(income && !isLoading ) || (!income && isLoading)? (
                  "R$ " + income.toFixed(2)
                ) : (
                  <Skeleton key={1} className="w-52 h-4 mb-4" />
                )}
              </div>
              {(income && !isLoading ) || (!income && isLoading)? (
                <p className="text-xs text-muted-foreground">
                  {" "}
                  + 12% que o último mês{" "}
                </p>
              ) : (
                <Skeleton key={2} className="w-52 h-2 mb-4" />
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Despesa total
              </CardTitle>
              <TrendingDown className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
              {(expense && !isLoading ) || (!expense && isLoading)? (
                  "R$ " + expense.toFixed(2)
                ) : (
                  <Skeleton key={1} className="w-52 h-4 mb-4" />
                )}
              </div>

              {(expense && !isLoading ) || (!expense && isLoading)? (
                <p className="text-xs text-muted-foreground">
                  + 12% que o último mês
                </p>
              ) : (
                <Skeleton key={2} className="w-52 h-2 mb-4" />
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Renda Líquida
              </CardTitle>
              <DollarSign className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
              {(profit && !isLoading ) || (!profit && isLoading)? (
                  "R$ " + profit.toFixed(2)
                ) : (
                  <Skeleton key={1} className="w-52 h-4 mb-4" />
                )}
              </div>

              {(profit && !isLoading ) || (!profit && isLoading)? (
                <p className="text-xs text-muted-foreground">
                  + 12% que o último mês
                </p>
              ) : (
                <Skeleton key={2} className="w-52 h-2 mb-4" />
              )}
            </CardContent>
          </Card>
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