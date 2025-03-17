"use client"

import { useState } from "react"
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

const transactionHistory = [
  { id: 1, date: "2023-03-15", description: "Haircut - Client #1042", amount: 35.0, type: "income" },
  { id: 2, date: "2023-03-15", description: "Hair products purchase", amount: 120.5, type: "expense" },
  { id: 3, date: "2023-03-14", description: "Beard trim - Client #1039", amount: 15.0, type: "income" },
  { id: 4, date: "2023-03-14", description: "Utility bill payment", amount: 85.3, type: "expense" },
  { id: 5, date: "2023-03-13", description: "Full service - Client #1036", amount: 75.0, type: "income" },
  { id: 6, date: "2023-03-12", description: "Equipment maintenance", amount: 45.0, type: "expense" },
  { id: 7, date: "2023-03-12", description: "Haircut & color - Client #1033", amount: 95.0, type: "income" },
  { id: 8, date: "2023-03-11", description: "Rent payment", amount: 800.0, type: "expense" },
]

export default function FinancialDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  // Calculate summary data
  const totalIncome = transactionHistory
    .filter((t) => t.type === "income")
    .reduce((sum, transaction) => sum + transaction.amount, 0)

  const totalExpenses = transactionHistory
    .filter((t) => t.type === "expense")
    .reduce((sum, transaction) => sum + transaction.amount, 0)

  const netProfit = totalIncome - totalExpenses

  return (
    <div className="flex flex-col bg-background overflow-auto">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <div className="flex items-center">
          <h1 className="text-lg font-semibold md:text-2xl">Financial Dashboard</h1>
          <div className="ml-auto flex items-center gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New Transaction
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Transaction</DialogTitle>
                  <DialogDescription>Enter the details of the new transaction below.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="transaction-type">Transaction Type</Label>
                    <RadioGroup defaultValue="income" id="transaction-type">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="income" id="income" />
                        <Label htmlFor="income">Income</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="expense" id="expense" />
                        <Label htmlFor="expense">Expense</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Input id="description" placeholder="Enter transaction description" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="amount">Amount</Label>
                    <Input id="amount" placeholder="0.00" type="number" step="0.01" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="date">Date</Label>
                    <Input id="date" type="date" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="category">Category</Label>
                    <Select>
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="services">Services</SelectItem>
                        <SelectItem value="products">Products</SelectItem>
                        <SelectItem value="rent">Rent</SelectItem>
                        <SelectItem value="utilities">Utilities</SelectItem>
                        <SelectItem value="supplies">Supplies</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Save Transaction</Button>
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
            Overview
          </Button>
          <Button
            variant={activeTab === "transactions" ? "default" : "outline"}
            onClick={() => setActiveTab("transactions")}
            className="flex items-center"
          >
            <CreditCard className="mr-2 h-4 w-4" />
            Transactions
          </Button>
          <Button
            variant={activeTab === "reports" ? "default" : "outline"}
            onClick={() => setActiveTab("reports")}
            className="flex items-center"
          >
            <BarChart className="mr-2 h-4 w-4" />
            Reports
          </Button>
          <Button
            variant={activeTab === "calendar" ? "default" : "outline"}
            onClick={() => setActiveTab("calendar")}
            className="flex items-center"
          >
            <Calendar className="mr-2 h-4 w-4" />
            Calendar
          </Button>
        </div>

        {activeTab === "overview" && (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Income</CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${totalIncome.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">+12% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                  <TrendingDown className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${totalExpenses.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">+2% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
                  <DollarSign className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${netProfit.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">+18% from last month</p>
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Overview</CardTitle>
                  <CardDescription>Monthly revenue for the current year</CardDescription>
                </CardHeader>
                <CardContent className="px-2">
                  <ChartContainer
                    config={{
                      revenue: {
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
                  <CardTitle>Expense Breakdown</CardTitle>
                  <CardDescription>Monthly expenses for the current year</CardDescription>
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
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Your most recent financial activities</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactionHistory.slice(0, 5).map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>{transaction.date}</TableCell>
                        <TableCell>{transaction.description}</TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              transaction.type === "income"
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
                              transaction.type === "income"
                                ? "text-green-600 dark:text-green-400"
                                : "text-red-600 dark:text-red-400"
                            }
                          >
                            {transaction.type === "income" ? "+" : "-"}${transaction.amount.toFixed(2)}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={() => setActiveTab("transactions")}>
                  View All Transactions
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}

        {activeTab === "transactions" && (
          <Card>
            <CardHeader>
              <CardTitle>All Transactions</CardTitle>
              <CardDescription>A complete list of all your financial transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <Input placeholder="Search transactions..." className="max-w-sm" />
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Transactions</SelectItem>
                    <SelectItem value="income">Income Only</SelectItem>
                    <SelectItem value="expense">Expenses Only</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="newest">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="highest">Highest Amount</SelectItem>
                    <SelectItem value="lowest">Lowest Amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactionHistory.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{transaction.date}</TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            transaction.type === "income"
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
                            transaction.type === "income"
                              ? "text-green-600 dark:text-green-400"
                              : "text-red-600 dark:text-red-400"
                          }
                        >
                          {transaction.type === "income" ? "+" : "-"}${transaction.amount.toFixed(2)}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" disabled>
                Previous
              </Button>
              <Button variant="outline">Next</Button>
            </CardFooter>
          </Card>
        )}

        {activeTab === "reports" && (
          <Card>
            <CardHeader>
              <CardTitle>Financial Reports</CardTitle>
              <CardDescription>Generate and view detailed financial reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="report-type">Report Type</Label>
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

