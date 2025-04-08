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
import { use, useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import axios from "axios";
import PhoneInput from "./phoneInput";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface AddClientsProps {
  selectedCustomer: Customer | undefined;
  setSelectedCustomer: React.Dispatch<React.SetStateAction<Customer | undefined>>;
}

export default function AddClient({selectedCustomer, setSelectedCustomer} : AddClientsProps){
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newCustomer, setNewCustomer] = useState<Customer>({
    id: "",
    name: "",
    email: "",
    phone: "",
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
        setIsLoading(false);
        // setDialogOpen(false);
        setIsSaved(true);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const handleUpdateCustomer = async () => {
    setIsLoading(true);
    try {
      const response = await axios.put("/api/updateCustomer", {
        customer: selectedCustomer,
      });
      if (response.status === 200) {
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
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
        });
        setSelectedCustomer(undefined);
    }
  }, [dialogOpen])

  useEffect(() => {
    if (selectedCustomer) {
      setDialogOpen(true);}
    },[selectedCustomer])

  if(selectedCustomer){
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
            <DialogTitle>Cliente #{selectedCustomer.id}</DialogTitle>
            <DialogDescription>
              Preencha os dados do cliente para alterá-lo no sistema.
            </DialogDescription>
          </DialogHeader>
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
              {/* <PhoneInput setNewCustomer={setSelectedCostumer} /> */}
              
            </div>
          </div>
          <DialogFooter>
            
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
              <PhoneInput setNewCustomer={setNewCustomer} />
              {/* <Input
                id="phone"
                name="phone"
                value={newCustomer?.phone}
                onChange={handleInputChange}
                placeholder="(00) 00000-0000"
              /> */}
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
