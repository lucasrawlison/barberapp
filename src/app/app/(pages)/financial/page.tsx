"use client";

import { useEffect, useState } from "react";
import { Calendar, CreditCard, DollarSign, Download, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import axios from "axios";
import { useSession } from "next-auth/react";
import { NewTransaction } from "./components/newTransaction";
import { AllTransactions } from "./components/allTransactions";
import { Reports } from "./components/reports";
import { Overview } from "./components/overview";

// Sample data for charts and tables

interface Transaction {
  description: string;
  value: number;
  date: string;
  type: string;
  category: string;
  paymentMethodId: string;
}
interface Dados {
  month: string,
  revenue: number,
  expenses: number
}



export default function FinancialDashboard() {
  const { data: session } = useSession();
  const [servicesTypes, setServicesTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [,setIsFetching] = useState(false);
  const [isLoadingMonth, setIsLoadingMonth] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [expense, setExpense] = useState(0);
  const [income, setIncome] = useState(0);
  const [profit, setProfit] = useState(0);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [monthTransactions, setMonthTransactions] = useState<Transaction[]>([]);
  const [newTransaction, setNewTransaction] = useState<Transaction>({
    description: "",
    value: 0,
    date: "",
    type: "",
    category: "",
    paymentMethodId: "",
  });
const [chartData, setChartData]= useState<Dados[] | undefined>(undefined)



  const getPaymentMethods = async () => {
    try {
      setIsLoading(true);

      const response = await axios.post("/api/getPaymentMethods");
      const { paymentMethods } = response.data;
      setPaymentMethods(paymentMethods);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const calculate = () => {
    if (!monthTransactions) return;

    const totalIncome = monthTransactions
      .filter((t) => t.type === "Receita")
      .reduce((sum, transaction) => sum + transaction.value, 0);

    setIncome(totalIncome);

    const totalExpenses = monthTransactions
      .filter((t) => t.type === "Despesa")
      .reduce((sum, transaction) => sum + transaction.value, 0);

    setExpense(totalExpenses);

    setProfit(totalIncome - totalExpenses);
  };

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("/api/getAllTransactions");

      if (response) {
        setTransactions(response.data.transactions);
        // setIsLoading(false)
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const fetchMonthTransactions = async () => {
    try {
      setIsLoadingMonth(true);
      const response = await axios.get("/api/getMonthTransactions");

      if (response) {
        setMonthTransactions(response.data.transactions);
        setIsLoadingMonth(false);

      }
    } catch (error) {
      console.log(error);
      setIsLoadingMonth(false);
    }
  };

  const getServicesTypes = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post("/api/getServicesTypes");
      const { servicesTypes } = response.data;
      setServicesTypes(servicesTypes);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const fetchChartsData = async () => {
    setIsFetching(true)
    setChartData(undefined)
    try {
      const response = await axios.get("/api/getOverviewData")
      if(response){
        // console.log(response.data.chartData)
        setChartData(response.data.chartData)
        setIsFetching(false)


      }
    } catch (error) {
      console.log(error)
      setIsFetching(false)
    }
  }

  useEffect(() => {
    getServicesTypes();
    getPaymentMethods();
    fetchMonthTransactions();
    fetchTransactions();
  }, [session?.user?.id]);

  useEffect(() => {
    calculate();
    setIsLoading(false);
    
    fetchChartsData();
  }, [transactions, monthTransactions]);



  

  return (
    
    <div className="flex flex-col bg-background overflow-auto">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <div className="flex items-center">
          <h1 className="text-lg font-semibold md:text-2xl">Financeiro</h1>
          <div className="ml-auto flex items-center gap-2">
            {/* <Button disabled={isFetching} onClick={fetch}>{isFetching ? (<LoaderCircle className="animate-spin"></LoaderCircle>) : "Fetch"}</Button> */}
            <NewTransaction
              servicesTypes={servicesTypes}
              fetchTransactions={fetchTransactions}
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

        <div className="flex flex-wrap gap-2 ">
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

        <div
          className="flex flex-row gap-2 items-center hover:cursor-pointer w-min"
          onClick={()=> {
            fetchMonthTransactions();
            fetchTransactions();
            fetchChartsData();
          }}
        >
          <span className="text-xs">Atualizar</span>
          <RotateCw className="w-3" />
        </div>
        {activeTab === "overview" && (
          <Overview chartData={chartData} isLoadingMonth={isLoadingMonth} income={income} expense={expense} profit={profit} />
        )}

        {activeTab === "transactions" && (
          <AllTransactions isLoading={isLoading} transactions={transactions} />
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
