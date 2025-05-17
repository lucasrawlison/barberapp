"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CardData } from "./cardData";
import { useCallback, useEffect, useState } from "react";
import { RegisterCardData } from "./registerCardData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import formatarEmReal from "@/app/app/utils/formatarEmReal";

interface User {
  name: string;
}
interface Type {
  id: string;
  name: string;
  value: number;
}

interface BankAccount {
  id: string;
  bankName: string;
}

interface PaymentMethod {
  id: string;
  name: string;
  bankAccount: BankAccount;
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
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface ServiceModalProps {
  selectedService: Service | null;
  getServices: (value: number) => void;
  setSelectedService: (value: Service | null) => void;
  servicesTypes: Type[];
  paymentMethods: PaymentMethod[];
  newService: Service | null;
  setNewService: (value: Service | null) => void;
  pagination: Pagination,
  setPagination: (value: Pagination) => void;
}

export default function ServiceModal({
  setNewService,
  newService,
  selectedService,
  getServices,
  setSelectedService,
  servicesTypes,
  paymentMethods,
  pagination,
  setPagination,
}: ServiceModalProps) {
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    if (selectedService) {
      setOpenDialog(true);
    }

    if (newService) {
      setOpenDialog(true);
    }
  }, [selectedService, newService]);

  useEffect(() => {
    if (!openDialog) {
      setSelectedService(null);
      setNewService(null);
    }
  }, [openDialog]);

  useEffect(() => {
    console.log(newService);
  }, [newService]);

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

  if (selectedService) {
    return (
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className=" flex flex-col items-start min-h-screen max-h-screen overflow-auto portr">
          <DialogHeader className="max-h-[150px]">
            <DialogTitle>Serviço #{selectedService.code}</DialogTitle>
            <DialogDescription>Edite e atualize informações do serviço</DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="overview" className=" w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="overview">Geral</TabsTrigger>
              <TabsTrigger value="transactions">
                Pagamentos {`(${selectedService.transactions.length || 0})`}
              </TabsTrigger>
            </TabsList>
            <TabsContent value={"overview"}>
              <CardData
                pagination={pagination}
                setPagination={setPagination}
                setOpenDialog={setOpenDialog}
                getServices={getServices}
                setSelectedService={setSelectedService}
                servicesTypes={servicesTypes}
                selectedService={selectedService}
                paymentMethods={paymentMethods}
              />
            </TabsContent>
            <TabsContent value={"transactions"}>
              <Table className="w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-left">Descrição</TableHead>
                    <TableHead className="text-left">Data</TableHead>
                    <TableHead className="text-left">Valor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedService.transactions ? (
                    selectedService?.transactions.map((transaction, i) => (
                      <TableRow
                        className="hover:bg-slate-50 hover:cursor-pointer"
                        key={i}
                      >
                        <TableCell className="text-xs text-left">
                          {transaction.description}
                        </TableCell>
                       
                        <TableCell className="text-xs text-left">
                          {handleConvertDate(transaction.date.toString())}
                        </TableCell>
                        <TableCell className="text-xs text-left">
                          {formatarEmReal(transaction.value)}
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
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    );
  }

  if (newService) {
    return (
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-h-[600px] sm:max-h-screen overflow-auto portr">
          <DialogHeader>
            <DialogTitle className="text-left">Serviço</DialogTitle>
            <DialogDescription className="text-left">
              Prencha os campos para registrar um serviço
            </DialogDescription>
          </DialogHeader>
          <RegisterCardData
            setPagination={setPagination}
            pagination={pagination}
            getServices={getServices}
            selectedService={newService}
            services={servicesTypes}
            paymentMethods={paymentMethods}
          />
        </DialogContent>
      </Dialog>
    );
  }
}
