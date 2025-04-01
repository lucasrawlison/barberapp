"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Search, UserPlus, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import axios from "axios"

// Dados de exemplo para clientes

interface Customer {
  id: string,
  name: string,
  email: string,
  phone: string,
  
}

export default function ClientesDashboard() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [busca, setBusca] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [newCustomer, setNewCustomer] = useState<Customer | undefined>(undefined)
  
  const [dialogOpen, setDialogOpen] = useState(false)


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if(newCustomer){

      setNewCustomer({
        ...newCustomer,
        [name]: value,
      })
    }
  }

  const handleGetCustomers = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get("/api/getCustomers")
      if(response){
      setCustomers(response.data.customers)
        
      }
    } catch (error) {
      console.log(error)
      setIsLoading(false)
    }finally {
      setIsLoading(false)
    }
  }


  useEffect(()=> {
    handleGetCustomers();
  }, [])

  return (
    <div className="flex  w-full flex-col overflow-auto">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Clientes</h2>
            <p className="text-muted-foreground">Gerencie seus clientes e adicione novos registros</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                Adicionar Cliente
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Adicionar Novo Cliente</DialogTitle>
                <DialogDescription>Preencha os dados do cliente para cadastrá-lo no sistema.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    name="name"
                    value={newCustomer?.name}
                    onChange={handleInputChange}
                    placeholder="Nome completo"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={newCustomer?.email}
                    onChange={handleInputChange}
                    placeholder="email@exemplo.com"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    name="telefone"
                    value={newCustomer?.phone}
                    onChange={handleInputChange}
                    placeholder="(00) 00000-0000"
                  />
                </div>
                
              </div>
              <DialogFooter>
                <Button>Salvar Cliente</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
          <Card>
            <CardHeader className="flex flex-row items-center gap-4 py-4">
              <Users className="h-5 w-5 text-muted-foreground" />
              <div className="grid gap-0.5">
                <CardTitle className="text-base">Lista de Clientes</CardTitle>
                <CardDescription>{customers.length} clientes cadastrados</CardDescription>
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
                    <TableRow >
                      <TableHead className="text-center">Nome</TableHead>
                      <TableHead className="text-center ">Telefone</TableHead>
                      <TableHead className="text-center hidden md:table-cell">Email</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customers.length > 0 ? (
                      customers.map((customer) => (
                        <TableRow key={customer.id}>
                          <TableCell className="font-medium">{customer.name}</TableCell>
                          <TableCell className="table-cell">{customer.phone}</TableCell>
                          <TableCell className=" hidden md:table-cell">{customer.email}</TableCell>
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
          </Card>
        </div>
      </div>
    </div>
  )
}

