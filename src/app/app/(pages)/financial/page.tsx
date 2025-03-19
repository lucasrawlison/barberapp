"use client"

import { useEffect, useState } from "react"
import {  Calendar, CreditCard, DollarSign, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import axios from "axios"
import { useSession } from "next-auth/react"
import {NewTransaction} from "./components/newTransaction"
import { AllTransactions } from "./components/allTransactions"
import { Reports } from "./components/reports"
import { Overview } from "./components/overview"

// Sample data for charts and tables

interface Transaction {
  description: string,
  value: number,
  date: string,
  type: string,
  category: string
}

export default function FinancialDashboard() {
  const {data: session} = useSession(); 
  const [, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [expense, setExpense] = useState(0)
  const [income, setIncome] = useState(0)
  const [profit, setProfit] = useState(0)
  const [paymentMethods, setPaymentMethods] = useState([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [newTransaction, setNewTransaction] = useState<Transaction>({
    description: "",
    value: 0,
    date: "",
    type: "",
    category: "",
  });

  const getPaymentMethods = async () => {
    try {
      setIsLoading(true)
      
      const response = await axios.post("/api/getPaymentMethods");
      const { paymentMethods } = response.data;
      setPaymentMethods(paymentMethods);
      setIsLoading(false)
    } catch (error) {
      console.log(error)
      setIsLoading(false)
    }
  }

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
    getPaymentMethods();
    fetchTransactions();
  },[session?.user?.id])


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
            <NewTransaction
            paymentMethods={paymentMethods}
              newTransaction={newTransaction}
              setNewTransaction={setNewTransaction}
            />

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
          {/* <Button
            variant={activeTab === "reports" ? "default" : "outline"}
            onClick={() => setActiveTab("reports")}
            className="flex items-center"
          >
            <BarChart className="mr-2 h-4 w-4" />
            Relatórios
          </Button> */}
          {/* <Button
            variant={activeTab === "calendar" ? "default" : "outline"}
            onClick={() => setActiveTab("calendar")}
            className="flex items-center"
          >
            <Calendar className="mr-2 h-4 w-4" />
            Calendário
          </Button> */}
        </div>

        {activeTab === "overview" && (
          <Overview income={income} expense={expense} profit={profit} />
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

