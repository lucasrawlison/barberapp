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
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Nova transação
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adicionar nova transação</DialogTitle>
                  <DialogDescription>Insira os detalhes da nova transação abaixo.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="transaction-type">Tipo de transação</Label>
                    <RadioGroup defaultValue="income" id="transaction-type">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="income" id="income" />
                        <Label htmlFor="income">Receita</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="expense" id="expense" />
                        <Label htmlFor="expense">Despesa</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Descrição</Label>
                    <Input id="description" placeholder="Enter transaction description" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="amount">Quantidade</Label>
                    <Input id="amount" placeholder="0.00" type="number" step="0.01" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="date">Data</Label>
                    <Input id="date" type="date" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="category">Categoria</Label>
                    <Select>
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="services">Serviço</SelectItem>
                        <SelectItem value="products">Produto</SelectItem>
                        <SelectItem value="rent">Aluguel</SelectItem>
                        <SelectItem value="utilities">Utilidades</SelectItem>
                        <SelectItem value="supplies">Suprimentos</SelectItem>
                        <SelectItem value="other">Outros</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Salvar transação</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
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
                  <CardTitle className="text-sm font-medium">Receita total</CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${income.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">+12% que o último mês</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Despesa total</CardTitle>
                  <TrendingDown className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${expense.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">+2% que o último mês</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Renda Líquida</CardTitle>
                  <DollarSign className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${profit.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">+18% que o último mês</p>
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
                      <Bar dataKey="revenue" fill="var(--color-revenue)" radius={[4, 4, 0, 0]} />
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
                      <Bar dataKey="expenses" fill="var(--color-expenses)" radius={[4, 4, 0, 0]} />
                    </RechartsBarChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Transações recentes</CardTitle>
                <CardDescription>Sua atividade financeira mais recente</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead className="text-right">Quantidade</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.slice(0, 5).map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>{transaction.date}</TableCell>
                        <TableCell>{transaction.description}</TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              transaction.type === "Receita"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                            }`}
                          >
                            {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <span
                            className={
                              transaction.type === "Receita"
                                ? "text-green-600 dark:text-green-400"
                                : "text-red-600 dark:text-red-400"
                            }
                          >
                            {transaction.type === "Receita" ? "+" : "-"}${transaction.value.toFixed(2)}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={() => setActiveTab("transactions")}>
                  Ver todas as transações
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}

        {activeTab === "transactions" && (
          <Card>
            <CardHeader>
              <CardTitle>Todas as Transações</CardTitle>
              <CardDescription>Lista completa de todas as suas transações financeiras</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <Input placeholder="Search transactions..." className="max-w-sm" />
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as transações</SelectItem>
                    <SelectItem value="income">Apenas receitas</SelectItem>
                    <SelectItem value="expense">Apenas despesa</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="newest">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Novos primeiro</SelectItem>
                    <SelectItem value="oldest">Antigos primeiro</SelectItem>
                    <SelectItem value="highest">Maiores</SelectItem>
                    <SelectItem value="lowest">Menores</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead className="text-right">Quantidade</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{transaction.date}</TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            transaction.type === "Receita"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                          }`}
                        >
                          {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <span
                          className={
                            transaction.type === "Receita"
                              ? "text-green-600 dark:text-green-400"
                              : "text-red-600 dark:text-red-400"
                          }
                        >
                          {transaction.type === "income" ? "+" : "-"}${transaction.value.toFixed(2)}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" disabled>
                Anterior
              </Button>
              <Button variant="outline">Próximo</Button>
            </CardFooter>
          </Card>
        )}

        {activeTab === "reports" && (
          <Card>
            <CardHeader>
              <CardTitle>Relatórios financeiros</CardTitle>
              <CardDescription>Gere e visualize relatórios gerais de finanças</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="report-type">Tipo de relatório</Label>
                  <Select defaultValue="income-expense">
                    <SelectTrigger id="report-type">
                      <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="income-expense">Income vs Expenses</SelectItem>
                      <SelectItem value="profit-loss">Profit & Loss</SelectItem>
                      <SelectItem value="service-revenue">Service Revenue</SelectItem>
                      <SelectItem value="expense-categories">Expense Categories</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time-period">Time Period</Label>
                  <Select defaultValue="this-month">
                    <SelectTrigger id="time-period">
                      <SelectValue placeholder="Select time period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="this-week">This Week</SelectItem>
                      <SelectItem value="this-month">This Month</SelectItem>
                      <SelectItem value="last-month">Last Month</SelectItem>
                      <SelectItem value="this-quarter">This Quarter</SelectItem>
                      <SelectItem value="this-year">This Year</SelectItem>
                      <SelectItem value="custom">Custom Range</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="mt-6">
                <Button>Generate Report</Button>
              </div>
              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">Saved Reports</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Report Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Date Generated</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Monthly Income Report - March 2023</TableCell>
                      <TableCell>Income vs Expenses</TableCell>
                      <TableCell>2023-04-01</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                        <Button variant="ghost" size="sm">
                          Download
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Q1 Profit & Loss</TableCell>
                      <TableCell>Profit & Loss</TableCell>
                      <TableCell>2023-04-05</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                        <Button variant="ghost" size="sm">
                          Download
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "calendar" && (
          <Card>
            <CardHeader>
              <CardTitle>Financial Calendar</CardTitle>
              <CardDescription>View scheduled transactions and financial events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center p-8">
                <Calendar className="mx-auto h-16 w-16 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">Calendar View</h3>
                <p className="mt-2 text-sm text-muted-foreground">Calendar functionality would be implemented here</p>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}

