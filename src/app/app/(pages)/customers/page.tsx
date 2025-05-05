"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { ChevronLeftIcon, ChevronRightIcon, ChevronsLeft, ChevronsRight, RotateCw, Search, Users } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import axios from "axios"
import AddClient from "./components/addClient"
import { Button } from "@/components/ui/button"

interface BankAccount{
  id: string;
  bankName: string;
}

interface PaymentMethod {
  id: string;
  name: string;
  bankAccount: BankAccount
}
interface Type {
  id: string
  name: string
  value: number
}
interface User {
  name: string
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
}

interface Customer {
  id: string,
  name: string,
  code: string,
  email: string,
  phone: string,
  services: Service[];
}

export default function ClientesDashboard() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [busca, setBusca] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | undefined>(undefined)
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  })

  const handleGetCustomers = async (pageNumber: number) => {
    setIsLoading(true)
    try {
      const response = await axios.get("/api/getCustomers", {
        params: {
          page: pageNumber,
          limit: 10,
        },
      })
      if(response.status === 200){
        setPagination(response.data.pagination)
      setCustomers(response.data.customers)
        console.log(response.data.customers)
      }
    } catch (error) {
      console.log(error)
      setIsLoading(false)
    }finally {
      setIsLoading(false)
    }
  }


  useEffect(()=> {
    handleGetCustomers(1);
  }, [])


  return (
    <div className="flex  w-full flex-col overflow-auto">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Clientes</h2>
            <p className="text-muted-foreground">
              Gerencie seus clientes e adicione novos registros
            </p>
          </div>
          <AddClient
            handleGetCustomers={() => handleGetCustomers(pagination.page)}
            selectedCustomer={selectedCustomer}
            setSelectedCustomer={setSelectedCustomer}
          />
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-1 md:max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar clientes..."
                className="pl-8"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              />
            </div>
          </div>
          <div
            onClick={() => handleGetCustomers(pagination.page)}
            className="flex m-0 p-0 flex-row gap-1 items-center hover: cursor-pointer"
          >
            <span className="text-xs text-gray-600">Atualizar</span>
            <RotateCw size={12} />
          </div>
          <Card>
            <CardHeader className="flex flex-row items-center gap-4 py-4">
              <Users className="h-5 w-5 text-muted-foreground" />
              <div className="grid gap-0.5">
                <CardTitle className="text-base">Lista de Clientes</CardTitle>
                <CardDescription>
                  {pagination.total} clientes cadastrados
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="px-0">
              {isLoading && (
                <div className="h-1 bg-slate-400 w-full overflow-hidden relative">
                  <div className="w-1/2 bg-sky-500 h-full animate-slideIn absolute left-0 rounded-lg"></div>
                </div>
              )}
              <div className="overflow-auto">
                <Table className="text-center">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-center">Código</TableHead>
                      <TableHead className="text-center">Nome</TableHead>
                      <TableHead className="text-center ">Telefone</TableHead>
                      <TableHead className="text-center hidden md:table-cell">
                        Email
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customers.length > 0 ? (
                      customers.map((customer) => (
                        <TableRow
                          className="hover: cursor-pointer hover:bg-gray-100"
                          onClick={() => setSelectedCustomer(customer)}
                          key={customer.id}
                        >
                          <TableCell className="font-medium">
                            {customer.code}
                          </TableCell>
                          <TableCell className="font-medium">
                            {customer.name}
                          </TableCell>
                          <TableCell className="table-cell">
                            {customer.phone}
                          </TableCell>
                          <TableCell className=" hidden md:table-cell">
                            {customer.email || "-"}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} className="h-24 text-center">
                          Nenhum cliente encontrado.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center">
              <div className="flex items-center justify-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleGetCustomers(1)}
                  disabled={pagination.page === 1}
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleGetCustomers(pagination.page - 1)}
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
                  onClick={() => handleGetCustomers(pagination.page + 1)}
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
                  onClick={() => handleGetCustomers(pagination.totalPages)}
                  disabled={
                    pagination.page === pagination.totalPages ||
                    pagination.totalPages === 0
                  }
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}

