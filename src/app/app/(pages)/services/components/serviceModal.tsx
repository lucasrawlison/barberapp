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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import formatarEmReal from "@/app/app/utils/formatarEmReal";
import PaymentRegister from "./paymentRegister";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Pago from "@/app/app/images/pago.png";

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
  date: Date;
  description: string;
  type: string;
  value: number;
  paymentMethod: PaymentMethod;
  bankAccount: BankAccount;
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
  paymentMethodId: string;
  customerId: string;
  customer: Customer;
  paymentMethod: PaymentMethod;
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
  pagination: Pagination;
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
  const [unpaidAmount, setUnpaidAmount] = useState(0);
  const [paidAmount, setPaidAmount] = useState(0);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  const setPaidValue = (selectedService: Service) => {
    if (selectedService.transactions.length > 0) {
      const totalPaid = selectedService.transactions.reduce(
        (acc, transaction) => acc + transaction.value,
        0
      );
      setPaidAmount(totalPaid);
    } else {
      setPaidAmount(0);
    }
  };

  useEffect(() => {
    if (selectedService) {
      console.log(selectedService);
      setPaidValue(selectedService);
      setOpenDialog(true);
    }

    if (newService) {
      setOpenDialog(true);
    }
  }, [selectedService, newService]);

  useEffect(() => {
    if (selectedService) {
      setUnpaidAmount(selectedService?.value - paidAmount);
    }
  }, [paidAmount, selectedService?.value]);

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
    const newDate = new Date(date);

    const formattedDate = newDate.toLocaleString("pt-BR", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    return formattedDate;
  }, []);

  if (selectedService) {
    return (
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="flex flex-col h-sm:max-h-[430px] min-h-[600px] max-h-[600px] md:max-h-[600px] lg:max-h-[600px] overflow-auto">
          <DialogHeader className="max-h-[150px]">
            <DialogTitle className="flex items-center">
              Serviço #{selectedService.code}{" "}
              <Badge
                className={`hover:cursor-default ml-3 px-4  ${
                  unpaidAmount === 0 ? "bg-green-600" : "bg-red-600"
                }`}
              >
                {unpaidAmount === 0 ? "Pago" : "Pendente"}
              </Badge>
            </DialogTitle>
            <DialogDescription>
              Edite e atualize informações do serviço
            </DialogDescription>
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
                    <TableHead className="text-left">Método</TableHead>
                    <TableHead className="text-left">Data</TableHead>
                    <TableHead className="text-left">Valor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedService.transactions.length > 0 ? (
                    selectedService?.transactions.map((transaction, i) => (
                      <TableRow
                        className="hover:bg-blue-300 hover:cursor-pointer"
                        key={i}
                      >
                        <TableCell className="text-xs text-left">
                          {transaction.paymentMethod.name} -{" "}
                          {transaction.bankAccount.bankName}
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
                        Nenhum pagamento encontrado.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              <div className="w-full pt-6 flex">
                <span className="text-xs text-nowrap mr-3">Total a Pagar:</span>
                <div className="w-full border-b border-black/40 border-dashed"></div>
                <span className="text-xs text-nowrap ml-3">
                  {formatarEmReal(selectedService.value)}
                </span>
              </div>
              <div className="w-full pt-2 flex">
                <span className="text-xs text-nowrap mr-3">Total pago</span>
                <div className="w-full border-b border-black/40 border-dashed"></div>
                <span className="text-sm text-nowrap ml-3 text-blue-600">
                  {formatarEmReal(paidAmount)}
                </span>
              </div>
              <div className="w-full pt-2 flex">
                <span className="text-xs text-nowrap mr-3">Saldo devedor</span>
                <div className="w-full border-b border-black/40 border-dashed"></div>
                <span className="text-xs text-nowrap ml-3 text-red-800">
                  {formatarEmReal(unpaidAmount)}
                </span>
              </div>
              <div className="pt-4 w-full flex justify-end">
                {unpaidAmount > 0 ? (
                  <PaymentRegister
                  setSelectedService={setSelectedService} 
                  isPaymentOpen={isPaymentOpen}
                  setIsPaymentOpen={setIsPaymentOpen}
                  unpaidAmount={unpaidAmount}
                  selectedServiceId={selectedService.id}
                  />
                ) : (
                  <div className="top-0 opacity-20 -z-10 left-0 absolute w-full h-full flex items-center justify-center">
                    <div className="flex flex-row">
                      <Image src={Pago} width={400} height={400} alt="Pago" className=""></Image>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    );
  }

  if (newService) {
    return (
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="h-sm:max-h-[430px] max-h-[600px] md:max-h-[600px] lg:max-h-[600px] overflow-auto">
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
