"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CardData } from "./cardData";
import { useEffect, useState } from "react";
import { RegisterCardData } from "./registerCardData";
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
  date: string,
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

  if (selectedService) {
    return (
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className=" overflow-auto max-h-[650px]">
          <DialogHeader>
            <DialogTitle>Serviço #{selectedService.code}</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
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
        </DialogContent>
      </Dialog>
    );
  }

  if (newService) {
    return (
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className=" overflow-auto max-h-[650px]">
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
