"use client";

import { useEffect, useState } from "react";
import { CreditCard, DollarSign, Landmark, LoaderCircle, Radio, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios, { isAxiosError } from "axios";
import { useSession } from "next-auth/react";
import { NewTransaction } from "./components/newTransaction";
import { AllTransactions } from "./components/allTransactions";
import { Overview } from "./components/overview";
import { useRouter } from "next/navigation";
import { BanksInfo } from "./components/banksInfo";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface Type {
  id: string
  name: string
  value: number
}
interface Service {
  id: string;
  code: number;
  value: number;
  customer: Customer | null;
  servicesValue: number;
  discount: number;
  createdAt: Date;
  servicesTypes: Type[];
  userId: string;
  user: User | undefined;
  paymentMethodId: string
  customerId: string;
  paymentMethod: PaymentMethod | null
  transactions: Transaction[];
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  code: string;

}

interface Transaction {
  id: string;
  description: string;
  service: Service | null
  value: number;
  date: string;
  type: string;
  category: string;
  paymentMethodId: string;
  paymentMethod: PaymentMethod;
  user: User | null;
  userId: string;
}

interface Transaction {
  description: string;
  service: Service | null
  value: number;
  date: string;
  type: string;
  category: string;
  paymentMethodId: string;
  paymentMethod: PaymentMethod;
}

interface PaymentMethod {
  id: string;
  name: string;
  bankId: string;
  bankAccount: BankAccount;
  transactions: Transaction[];
}


interface Dados {
  month: string;
  revenue: number;
  expenses: number;
}

interface BankAccount {
  id: string;
  bankName: string;
  initialValue: number;
  agency: string;
  accountNumber: string;
  accountType: string;
  accountOwner: string;
  transactions: Transaction[];
  paymentMethods: PaymentMethod[];
}

interface PaymentMethod {
  id: string;
  name: string;
  bankId: string;
  bankAccount: BankAccount;
  transactions: Transaction[];
}


interface User {
  id: string;
  name: string;
  email: string;
  login: string;
  profileType: string;
  profileImgLink: string;
}

export default function FinancialDashboard() {
  const { data: session } = useSession();
  const [servicesTypes, setServicesTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [, setIsFetching] = useState(false);
  const [isLoadingMonth, setIsLoadingMonth] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [expense, setExpense] = useState(0);
  const [income, setIncome] = useState(0);
  const [profit, setProfit] = useState(0);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [monthTransactions, setMonthTransactions] = useState<Transaction[]>([]);
  const [newTransaction, setNewTransaction] = useState<Transaction | undefined>(
    {
      id: "",
      description: "",
      value: 0,
      date: "",
      type: "Receita",
      category: "Serviço",
      paymentMethodId: "",
      paymentMethod: {
        id: "",
        name: "",
        bankId: "",
        bankAccount: {
          id: "",
          bankName: "",
          initialValue: 0,
          agency: "",
          accountNumber: "",
          accountType: "",
          accountOwner: "",
          transactions: [],
          paymentMethods: [],
        },
        transactions: [],
      },
      user: null,
      userId: "",
      service: null
    }
  );
  const [chartData, setChartData] = useState<Dados[] | undefined>(undefined);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const [banks, setBanks] = useState<BankAccount[]>([]);
  const [isLoadingBanks, setIsLoadingBanks] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | undefined>(undefined);
  const router = useRouter();
  

  const getBanks = async () => {
    try {
      setIsLoadingBanks(true);
      const response = await axios.get("/api/getBanks", {
        headers: {
          Userid: session?.user?.id || null,
        },
      });
      
      if (response.status === 200) {
        const { banks } = response.data;
        setBanks(banks);
        setIsLoadingBanks(false);
      }
      
    } catch (error) {
      console.log(error);
      if(axios.isAxiosError(error)) {
        if (error.response?.status === 403) {
          router.push("/app/dashboard");
        }
      }
      setIsLoadingBanks(false);
    }
  };

  const getPaymentMethods = async () => {
    try {
      setIsLoading(true);

      const response = await axios.post("/api/getPaymentMethods");
      
      if (response.status === 200) {
        const { paymentMethods } = response.data;
        setPaymentMethods(paymentMethods);
        setIsLoading(false);
      }
    } catch (error) {
      if(axios.isAxiosError(error)) {
        if (error.response?.status === 403) {
          router.push("/app/dashboard");
        }
      }
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

  const fetchTransactions = async (pageNumber: number) => {
    try {
      setIsLoading(true);
      const response = await axios.get("/api/getAllTransactions", {
        params: {
          page: pageNumber || 1,
          limit: 10,
        },
        headers: {
          Userid: session?.user?.id || null,
        },
      });


      if (response.status === 200) {
        // console.log(response.data);
        setPagination(response.data.pagination);
        setTransactions(response.data.transactions);
        // setIsLoading(false)
      }
    } catch (error) {
      if(axios.isAxiosError(error)) {
        if (error.response?.status === 403) {
          router.push("/app/dashboard");
        }
      }
      setIsLoading(false);
    }
  };

  const fetchMonthTransactions = async () => {
    try {
      setIsLoadingMonth(true);
      const response = await axios.get("/api/getMonthTransactions", {
        headers: {
          Userid: session?.user?.id || null,
        },
      });
      

      if (response.status === 200) {
        setMonthTransactions(response.data.transactions);
        setIsLoadingMonth(false);
      }
    } catch (error) {
      if(axios.isAxiosError(error)) {
        if (error.response?.status === 403) {
          router.push("/app/dashboard");
        }
      }
      setIsLoadingMonth(false);
    }
  };

  const getServicesTypes = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post("/api/getServicesTypes");
      if (response.status === 200) {
        const { servicesTypes } = response.data;
        setServicesTypes(servicesTypes);
        setIsLoading(false);
      }
    } catch (error) {
      if(isAxiosError(error)){

        toast({
          title: "Erro",
          description: error.response?.data.message,
          duration: 5000
        })
        console.log(error);
        setIsLoading(false);
      }

      
    }
  };

  const fetchChartsData = async () => {
    setIsFetching(true);
    // setChartData(undefined);
    try {
      const response = await axios.get("/api/getOverviewData",
        {
          headers: {
            Userid: session?.user?.id || null,
          },
        }
      );
      if (response.status === 200) {
        // console.log(response.data.chartData)
        setChartData(response.data.chartData);
        setIsFetching(false);
      }
    } catch (error) {
      if(axios.isAxiosError(error)) {
        if (error.response?.status === 403) {
          router.push("/app/dashboard");
        }
      }
      setIsFetching(false);
    }
  };


  useEffect(() => {
    getBanks();
    getServicesTypes();
    getPaymentMethods();
    fetchMonthTransactions();
    fetchTransactions(1);
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
          <div className="ml-auto flex items-center gap-2">
            <NewTransaction
            fetchMonthTransactions={fetchMonthTransactions}
            fetchChartsData={fetchChartsData}
            setSelectedTransaction={setSelectedTransaction}
            selectedTransaction={selectedTransaction}
              servicesTypes={servicesTypes}
              fetchTransactions={fetchTransactions}
              paymentMethods={paymentMethods}
              newTransaction={newTransaction}
              setNewTransaction={setNewTransaction}
              pagination={pagination}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 ">
          <Button
            variant={activeTab === "overview" ? "default" : "outline"}
            onClick={() => setActiveTab("overview")}
            className="flex items-center w-32"
          >
            <DollarSign className="mr-2 h-4 w-4" />
            Geral
          </Button>

          <Button
            variant={activeTab === "banks" ? "default" : "outline"}
            onClick={() => setActiveTab("banks")}
            className="flex items-center w-32"
          >
            <Landmark className="mr-2 h-4 w-4" />
            Contas
          </Button>
          <Button
            variant={activeTab === "transactions" ? "default" : "outline"}
            onClick={() => setActiveTab("transactions")}
            className="flex items-center w-32"
          >
            <CreditCard className="mr-2 h-4 w-4" />
            Transações
          </Button>
        </div>
        <div
          className="flex flex-row gap-2 items-center hover:cursor-pointer w-min"
          onClick={async () => {
            try {
              toast({
                title: " ",
              description: <div className="flex flex-row items-center">
                
                <LoaderCircle className="size-4 mr-2 animate-spin" />
                <span>Atualizando...</span>
                </div>,
                duration: 10000
              });
              
              await Promise.all([

                fetchMonthTransactions(),
                fetchTransactions(pagination.page),
                fetchChartsData(),
                getBanks()
              ])
              toast({
                title:" ",
                description: "Painel Atualizado!",
                duration: 1000
              })
            } catch (error) {
              console.log(error)
              toast({
                title:"Erro!",
                description: "falha durante alguma atualização do painel!",
                duration: 3000,
                variant: "destructive"
              })
              
            }
          }}
        >
          <span className="text-xs">Atualizar</span>
          <RotateCw className="w-3" />
        </div>

        {activeTab === "overview" && (
          <Overview
          fetchMonthTransactions={fetchMonthTransactions}
            chartData={chartData}
            isLoadingMonth={isLoadingMonth}
            income={income}
            expense={expense}
            profit={profit}
          />
        )}

        {activeTab === "transactions" && (
          <AllTransactions
            isLoading={isLoading}
            transactions={transactions}
            pagination={pagination}
            fetchTransactions={fetchTransactions}
            setSelectedTransaction={setSelectedTransaction}
          />
        )}

        {activeTab === "banks" && (
          <BanksInfo isLoadingBanks={isLoadingBanks} banks={banks} />
        )}
      </main>
    </div>
  );
}
