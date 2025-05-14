"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { LoaderCircle, UserPlus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import axios, { isAxiosError } from "axios";
import PhoneInput from "./phoneInput";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import formatarEmReal from "@/app/app/utils/formatarEmReal";
import { toast } from "@/hooks/use-toast";

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
interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  code: string;
  services: Service[];


}

interface AddClientsProps {
  selectedCustomer: Customer | undefined;
  setSelectedCustomer: React.Dispatch<React.SetStateAction<Customer | undefined>>;
  handleGetCustomers: () => Promise<void>;
}

export default function AddClient({selectedCustomer, setSelectedCustomer, handleGetCustomers} : AddClientsProps){
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [newCustomer, setNewCustomer] = useState<Customer>({
    id: "",
    name: "",
    email: "",
    phone: "",
    code:"",
    services: [],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if(selectedCustomer) {
      const { name, value } = e.target;
      setSelectedCustomer((prev) => {
        if (prev) {
          return { ...prev, [name]: value };
        }
        return prev;
      });
    }else{

      const { name, value } = e.target;
      setNewCustomer((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSaveCustomer = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post("/api/createCustomer", {
        customer: newCustomer,
      });
      if (response.status === 200) {
        handleGetCustomers();
        setIsLoading(false);
        setSelectedCustomer(response.data.newCustomer);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const handleUpdateCustomer = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post("/api/updateCustomer", {
        customer: selectedCustomer,
      });
      if (response.status === 200) {
        setIsLoading(false);
        handleGetCustomers();
        
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }

  const handleDeleteCustomer = async () => {
    setIsDeleting(true);

    try {
      const response = await axios.post("/api/deleteCustomer", {
        id: selectedCustomer?.id,
      });

      if(response.status === 200){
        setIsDeleting(false);
        handleGetCustomers();
        setSelectedCustomer(undefined);
        setDialogOpen(false);
      }
    } catch (error) {
      if(isAxiosError(error)){
        if(error.status === 400){
          toast({
            title: "Erro",
            description: error.message,
            duration: 3000
          })
        }
      }
      console.log(error);
      setIsDeleting(false);
    }
  }

  useEffect(()=>{
    if(!dialogOpen){
        setIsSaved(false);
        setNewCustomer({
          id: "",
          name: "",
          email: "",
          phone: "",
          code:"",
          services: [],
        });
        setSelectedCustomer(undefined);
    }
  }, [dialogOpen])

  useEffect(() => {
    if (selectedCustomer) {
      setDialogOpen(true);}
    },[selectedCustomer])

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
  if(selectedCustomer){
    return (
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Adicionar Cliente
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] min-h-[500px] flex flex-col align-top max-h-[500px]">
          <DialogHeader>
            <DialogTitle>Cliente #{selectedCustomer.code}</DialogTitle>
            <DialogDescription>
              Preencha os dados do cliente para alterá-lo no sistema.
            </DialogDescription>
          </DialogHeader>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="overview">Geral</TabsTrigger>
              <TabsTrigger value="services">Serviços {`(${selectedCustomer.services?.length || 0})`}</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    name="name"
                    value={selectedCustomer?.name}
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
                    value={selectedCustomer?.email}
                    onChange={handleInputChange}
                    placeholder="email@exemplo.com"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <PhoneInput
                    setSelectedCustomer={setSelectedCustomer}
                    selectedCustomer={selectedCustomer}
                    setNewCustomer={setNewCustomer}
                  />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="services">
              <div className="h-full overflow-auto max-h-[250px] flex">

              <Table className="w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-left">Código</TableHead>
                    <TableHead className="text-left">Serviços</TableHead>
                    <TableHead className="text-left">Data</TableHead>
                    <TableHead className="text-left">Valor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedCustomer.services ? (
                    selectedCustomer?.services.map((service) => (
                      <TableRow
                        className="hover:bg-slate-50 hover:cursor-pointer"
                        key={service.id}
                      >
                        <TableCell className="text-xs text-left">
                          {service.code}
                        </TableCell>
                        <TableCell className="text-xs text-left">
                          {service.servicesTypes
                            .map((type) => type.name)
                            .join(", ")}
                        </TableCell>
                        <TableCell className="text-xs text-left">
                          {handleConvertDate(service.createdAt.toString())}
                        </TableCell>
                        <TableCell className="text-xs text-left">
                          {formatarEmReal(service.value)}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="h-24 text-center">
                        Nenhum serviço encontrado.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              </div>
            </TabsContent>
          </Tabs>
          <DialogFooter>
            
            <Button
              onClick={handleDeleteCustomer}
              disabled={isDeleting}
              variant="destructive"
            >
              {isDeleting ? (
                <LoaderCircle className=" animate-spin" />
              ) : (
                "Deletar"
              )}
            </Button>

            <Button onClick={handleUpdateCustomer} disabled={isLoading}>
              {isLoading ? (
                <LoaderCircle className=" animate-spin" />
              ) : (
                "Atualizar Cliente"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }else{

    return (
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
            <DialogDescription>
              Preencha os dados do cliente para cadastrá-lo no sistema.
            </DialogDescription>
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
              <PhoneInput setSelectedCustomer={setSelectedCustomer} selectedCustomer={selectedCustomer} setNewCustomer={setNewCustomer} />
            </div>
          </div>
          <DialogFooter>
            {isSaved ? (
              <Button disabled={isSaved}>Cliente salvo com sucesso!</Button>
            ) : (
              <Button onClick={handleSaveCustomer} disabled={isLoading}>
                {isLoading ? (
                  <LoaderCircle className=" animate-spin" />
                ) : (
                  "Salvar Cliente"
                )}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }


  



  

}
