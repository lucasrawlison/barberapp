"use client"

import * as React from "react"
import { ChevronLeftIcon, ChevronRightIcon, ChevronsLeft, ChevronsRight, LoaderCircle, Search, RotateCw, CalendarIcon, Trash2 } from "lucide-react"
import { useEffect, useState, useMemo, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import axios from "axios"
import { useSession } from "next-auth/react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CardData } from "./cardData"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { QuickRegister } from "./quickRegister"


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
interface Service {
  id: string;
  code: number;
  value: number;
  createdAt: Date;
  servicesTypes: Type[];
  user: User;
  paymentMethodId: string

  paymentMethod: PaymentMethod
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
  const [openDialog, setOpenDialog] = useState(false)
  const [servicesTypes, setServicesTypes] = useState([])
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [date, setDate] = React.useState<Date | undefined>(undefined)
  const [paymentMethods, setPaymentMethods] = useState([])


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


  const getServices = async () => {
    try {
      setIsLoading(true);
      
      const response = await axios.post("/api/getUserServices", {
        userId: session?.user?.id, date
      });

      const { services } = response.data;
      console.log(response);
      setServices(services);
      setIsLoading(false);
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
        await getServices();
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
    getServices();
  },[date])

  const [currentPage, setCurrentPage] = React.useState(1)
  const itemsPerPage = 10

  // Filter services based on search input
  const filteredServices = useMemo(() => {
    if (!filterValue.trim()) return services

    return services.filter((service) => {
      const searchLower = filterValue.toLowerCase()
      const codeMatch = service.code.toString().includes(searchLower)
      const valueMatch = service.value.toString().includes(searchLower)
      const dateMatch = handleConvertDate(service.createdAt.toString()).toLowerCase().includes(searchLower)

      return codeMatch || valueMatch || dateMatch
    })
  }, [services, filterValue, handleConvertDate])

  const totalPages = Math.ceil(filteredServices.length / itemsPerPage)

  // Reset to first page when filter changes
  useEffect(() => {
    setCurrentPage(1)
  }, [filterValue])

  useEffect(() => {
    console.log(selectedService)
  },[selectedService])

  const currentServices = React.useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    const end = start + itemsPerPage
    return filteredServices.slice(start, end)
  }, [currentPage, filteredServices, itemsPerPage])

  const handleSelectService = (service : Service) => {
    setSelectedService(service)
    setOpenDialog(true)
  }

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
          onClick={getServices}
        >
          <span className="text-xs">Atualizar</span>
          <RotateCw className="w-3" />
        </div>
        <div className="flex flex-row gap-2 items-center">

      <QuickRegister/>

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
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredServices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  {services.length === 0
                    ? "Nenhum serviço encontrado."
                    : "Nenhum resultado para sua busca."}
                </TableCell>
              </TableRow>
            ) : (
              currentServices.map((service) => (
                <TableRow
                  onClick={() => handleSelectService(service)}
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
          onClick={() => setCurrentPage(1)}
          disabled={currentPage === 1}
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setCurrentPage((current) => Math.max(1, current - 1))}
          disabled={currentPage === 1}
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </Button>
        <span className="text-sm font-medium">
          Página {currentPage} de {totalPages || 1}
        </span>
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentPage((current) => Math.min(totalPages, current + 1))
          }
          disabled={currentPage === totalPages || totalPages === 0}
        >
          <ChevronRightIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setCurrentPage(totalPages)}
          disabled={currentPage === totalPages || totalPages === 0}
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
      <Dialog open={openDialog} onOpenChange={() => setOpenDialog(!openDialog)}>
        <DialogContent>
          {!selectedService ? (
            <div className="w-full h-full flex items-center justify-center">
              <DialogHeader>
                <DialogTitle></DialogTitle>
                <DialogDescription></DialogDescription>
              </DialogHeader>
              <LoaderCircle className=" animate-spin" />
            </div>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>Serviço {selectedService.code}</DialogTitle>
                <DialogDescription></DialogDescription>
              </DialogHeader>
              <CardData
              setOpenDialog={setOpenDialog}
                getServices={getServices}
                setSelectedService={setSelectedService}
                servicesTypes={servicesTypes}
                selectedService={selectedService}
                paymentMethods={paymentMethods}
              />
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

