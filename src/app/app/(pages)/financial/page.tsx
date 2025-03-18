"use client"

import { useEffect, useState } from "react"
import { BarChart, Calendar, CreditCard, DollarSign, Download, Plus, TrendingDown, TrendingUp } from "lucide-react"
import { Bar, BarChart as RechartsBarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import axios from "axios"
import { useSession } from "next-auth/react"
import {NewTransaction} from "./components/newTransaction"
import { AllTransactions } from "./components/allTransactions"
import { Reports } from "./components/reports"
import { Skeleton } from "@/components/ui/skeleton"

// Sample data for charts and tables
const revenueData = [
  { month: "Jan", revenue: 2400 },
  { month: "Feb", revenue: 1398 },
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

interface Transactions {
  id: string,
  description: string,
  value: number,
  date: string,
  type: string,
}

export default function FinancialDashboard() {
  const {data: session} = useSession(); 
  const [isLoading, setIsLoading] = useState(false)
  const [transactions, setTransactions] = useState<Transactions[]>([])
  const [activeTab, setActiveTab] = useState("overview")
  const [expense, setExpense] = useState(0)
  const [income, setIncome] = useState(0)
  const [profit, setProfit] = useState(0)

  const calculate = () => {
    if(!transactions) return

    
    const totalIncome = transactions
      .filter((t) => t.type === "Receita")
      .reduce((sum, transaction) => sum + transaction.value, 0)

    setIncome(totalIncome)


  
    const totalExpenses = transactions
      .filter((t) => t.type === "Despesa")
      .reduce((sum, transaction) => sum + transaction.value, 0)

    setExpense(totalExpenses)
  
    setProfit(totalIncome - totalExpenses)
  }

  useEffect(()=> {
    const fetchTransactions = async () => {
      try {
        setIsLoading(true)
        const response = await axios.post("/api/getTransactions", {
          id: session?.user?.id
        })
        
        if(response){
          setTransactions(response.data.transactions)
          // setIsLoading(false)
        }
        } catch (error) {
        console.log(error)
        setIsLoading(false)
        
      }
    }

    fetchTransactions();
  },[])


  useEffect(() => {
    calculate();
    setIsLoading(false)
  }, [transactions])


  





  return (
    <div className="flex flex-col bg-background overflow-auto">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <div className="flex items-center">
          <h1 className="text-lg font-semibold md:text-2xl">Financeiro</h1>
          <div className="ml-auto flex items-center gap-2">
            <NewTransaction />

            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <Button
            variant={activeTab === "overview" ? "default" : "outline"}
            onClick={() => setActiveTab("overview")}
            className="flex items-center"
          >
            <DollarSign className="mr-2 h-4 w-4" />
            Geral
          </Button>
          <Button
            variant={activeTab === "transactions" ? "default" : "outline"}
            onClick={() => setActiveTab("transactions")}
            className="flex items-center"
          >
            <CreditCard className="mr-2 h-4 w-4" />
            Transações
          </Button>
          <Button
            variant={activeTab === "reports" ? "default" : "outline"}
            onClick={() => setActiveTab("reports")}
            className="flex items-center"
          >
            <BarChart className="mr-2 h-4 w-4" />
            Relatórios
          </Button>
          <Button
            variant={activeTab === "calendar" ? "default" : "outline"}
            onClick={() => setActiveTab("calendar")}
            className="flex items-center"
          >
            <Calendar className="mr-2 h-4 w-4" />
            Calendário
          </Button>
        </div>

        {activeTab === "overview" && (
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
                    {income ? (
                      "R$ " + income.toFixed(2)
                    ) : (
                      <Skeleton key={1} className="w-52 h-4 mb-4" />
                    )}
                  </div>
                  {income ? (
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
                    {expense ? (
                      "R$ " + expense.toFixed(2)
                    ) : (
                      <Skeleton key={1} className="w-52 h-4 mb-4" />
                    )}
                  </div>

                  {expense ? (
                    <p className="text-xs text-muted-foreground">
                      + 12% que o último mês"
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
                    {profit ? (
                      "R$ " + profit.toFixed(2)
                    ) : (
                      <Skeleton key={1} className="w-52 h-4 mb-4" />
                    )}
                  </div>

                  {profit ? (
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
                      data={revenueData}
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
                      data={expenseData}
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
        )}

        {activeTab === "transactions" && (
          <AllTransactions transactions={transactions} />
        )}

        {activeTab === "reports" && <Reports />}

        {activeTab === "calendar" && (
          <Card>
            <CardHeader>
              <CardTitle>Financial Calendar</CardTitle>
              <CardDescription>
                View scheduled transactions and financial events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center p-8">
                <Calendar className="mx-auto h-16 w-16 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">Calendar View</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Calendar functionality would be implemented here
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}

