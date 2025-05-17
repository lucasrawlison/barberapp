"use client"

import * as React from "react"
import { ChevronLeftIcon, ChevronRightIcon, ChevronsLeft, ChevronsRight, Search, RotateCw, CalendarIcon, User } from "lucide-react"
import { useEffect, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import axios from "axios"
import { useSession } from "next-auth/react"

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import ServiceModal from "./serviceModal"


interface User {
  name: string
}

interface Type {
  id: string
  name: string
  value: number
}

interface BankAccount{
  id: string;
  bankName: string;
}

interface PaymentMethod {
  id: string;
  name: string;
  bankAccount: BankAccount
}
interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
}
interface Transaction {
  date: Date,
  description: string,
  type: string,
  value: number

}
interface Service {
  id: string;
  code: number;
  value: number;
  servicesValue: number;
  discount: number;
  createdAt: Date;
  servicesTypes: Type[];
  user: User;
  paymentMethodId: string
  customerId: string;
  customer: Customer;
  paymentMethod: PaymentMethod
  transactions: Transaction[];
}

interface Pagination {
  total: number
  page: number
  limit: number
  totalPages: number
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(price)
}

export function ServicesList() {
  const [isLoading, setIsLoading] = useState(false)
  const [services, setServices] = useState<Service[]>([])
  const [filterValue, setFilterValue] = useState("")
  const { data: session } = useSession()
  const [servicesTypes, setServicesTypes] = useState([])
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [date, setDate] = React.useState<Date | undefined>(undefined)
  const [paymentMethods, setPaymentMethods] = useState([])
  const [newService, setNewService] = useState<Service | null>(null)
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  })


  // Define handleConvertDate function before using it
  const handleConvertDate = useCallback((date: string) => {
    const newDate = new Date(date)

    const formattedDate = newDate.toLocaleString("pt-BR", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year : "numeric"
    })

    return formattedDate
  }, [])


  const getServices = async ( pageNumber: number) => {
    try {
      setIsLoading(true);
      
      const response = await axios.post("/api/getUserServices", {
        userId: session?.user?.id,
        date,
        page: pageNumber || 1,
        limit: 10,
      });
      if(response.status === 200) {

        const { services, pagination } = response.data;
        // console.log(response.data);
        setPagination(pagination);
        setServices(services);
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const getServicesTypes = async () => {
    try {
      const response = await axios.post("/api/getServicesTypes")
      setServicesTypes(response.data.servicesTypes)
    } catch (error) {
      console.log(error)
    }
  }

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
  
  useEffect(() => {
    setIsLoading(true);
    
    if (!session?.user?.id) {
      setIsLoading(false);
      return;
    }
    
    const fetchData = async () => {
      try {
        await getPaymentMethods();
        await getServices(1);
        await getServicesTypes();
      } catch (error) {
      console.log("Erro ao carregar dados iniciais", error)
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [session?.user?.id]);

  useEffect(() => {
    getServices(1);
  },[date])



  useEffect(() => {
    console.log(selectedService)
  },[selectedService])




  return (
    <div className="space-y-4 p-5">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Filtrar serviços..."
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
            className="pl-8 bg-white"
          />
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[280px] justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon />
              {date ? (
                date.toLocaleString("pt-BR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className=" flex flex-rows items-center justify-between">
        <div
          className="flex flex-row gap-2 items-center hover:cursor-pointer w-min"
          onClick={() => getServices(pagination.page)}
        >
          <span className="text-xs">Atualizar</span>
          <RotateCw className="w-3" />
        </div>
        <div className="flex flex-row gap-2 items-center">
          <Button
          size="sm"
            className="text-white"
            onClick={() => {
              setNewService({
                id: "",
                code: 0,
                value: 0,
                servicesValue: 0,
                discount: 0,
                createdAt: new Date(),
                servicesTypes: [],
                user: { name: "" },
                paymentMethodId: "",
                paymentMethod: {
                  id: "",
                  name: "",
                  bankAccount: { id: "", bankName: "" },
                },
                customerId: "",
                customer: { id: "", name: "", email: "", phone: "" },
                transactions: [],
              });
            }}
          >
            Novo Serviço
          </Button>

          <Button
            variant="destructive"
            onClick={() => {
              setFilterValue("");
              setDate(undefined);
            }}
            size="sm"
            className="bg-orange-400 hover:bg-orange-500 text-white"
          >
            Limpar filtros
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        {isLoading && (
          <div className="h-1 bg-slate-400 w-full overflow-hidden relative">
            <div className="w-1/2 bg-sky-500 h-full animate-slideIn absolute left-0 rounded-lg"></div>
          </div>
        )}
        <Table className=" portrait:text-[10px] sm:text-[12px]  md:text-[13px] bg-white rounded-md text-gray-700">
          <TableHeader>
            <TableRow>
              <TableHead className=" text-center">Código</TableHead>
              <TableHead className=" text-center">Serviços</TableHead>
              <TableHead className=" text-center">Preço</TableHead>
              <TableHead className=" text-center">Data</TableHead>
              <TableHead className=" text-center">Usuário</TableHead>
              <TableHead className=" text-center"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  {services.length === 0
                    ? "Nenhum serviço encontrado."
                    : "Nenhum resultado para sua busca."}
                </TableCell>
              </TableRow>
            ) : (
              services.map((service) => (
                <TableRow
                  onClick={() => setSelectedService(service)}
                  key={service.id}
                  className="hover:bg-gray-50 hover:cursor-pointer"
                >
                  <TableCell className="font-medium text-center">
                    {service.code}
                  </TableCell>
                  <TableCell className="font-medium text-center">
                    {service.servicesTypes.map((type, index) => (
                      <span key={index} className="block">
                        {type.name}
                      </span>
                    ))}
                  </TableCell>

                  <TableCell className=" text-center">
                    {formatPrice(service.value)}
                  </TableCell>
                  <TableCell className=" text-center">
                    {handleConvertDate(service.createdAt.toString()).toString()}
                  </TableCell>
                  <TableCell className="text-center">
                    {service.user.name}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex flex-row gap-2 justify-end mr-2 ">
                    
                    {service.customer ? (
                      <span className="p-1.5 rounded-full bg-blue-100">
                        
                        <User size={"14px"}/>
                        </span>
                      ): ""}
                    {service.transactions.length > 0 ? (
                      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                        Pago
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                        Pendente
                      </span>
                    )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-center space-x-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => getServices(1)}
          disabled={pagination.page === 1}
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => getServices(pagination.page - 1)}
          disabled={pagination.page === 1}
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </Button>
        <span className="text-sm font-medium">
          Página {pagination.page} de {pagination.totalPages || 1}
        </span>
        <Button
          variant="outline"
          size="icon"
          onClick={() => getServices(pagination.page + 1)}
          disabled={
            pagination.page === pagination.totalPages ||
            pagination.totalPages === 0
          }
        >
          <ChevronRightIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => getServices(pagination.totalPages)}
          disabled={
            pagination.page === pagination.totalPages ||
            pagination.totalPages === 0
          }
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
      <ServiceModal
        setNewService={setNewService}
        newService={newService}
        selectedService={selectedService}
        getServices={getServices}
        setSelectedService={setSelectedService}
        servicesTypes={servicesTypes}
        paymentMethods={paymentMethods}
        pagination={pagination}
        setPagination={setPagination}
      />
    </div>
  );
}

