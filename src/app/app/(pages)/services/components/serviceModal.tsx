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
import { LoaderCircle } from "lucide-react";
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

interface Service {
  id: string;
  code: number;
  value: number;
  createdAt: Date;
  servicesTypes: Type[];
  user: User;
  paymentMethodId: string;
  customerId: string;
  customer: Customer;
  paymentMethod: PaymentMethod;
}

interface ServiceModalProps {
  selectedService: Service | null;
  getServices: () => void;
  setSelectedService: (value: Service | null) => void;
  servicesTypes: Type[];
  paymentMethods: PaymentMethod[];
  newService: Service | null;
  setNewService: (value: Service | null) => void;
}

export default function ServiceModal({
  setNewService,
  newService,
  selectedService,
  getServices,
  setSelectedService,
  servicesTypes,
  paymentMethods,
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
                <DialogTitle>Serviço #{selectedService.code}</DialogTitle>
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
    );
  }

  if (newService) {
    return (
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className=" min-h-96">
          <DialogHeader>
            <DialogTitle className="text-left">Serviço</DialogTitle>
            <DialogDescription className="text-left">
              Prencha os campos para registrar um serviço
            </DialogDescription>
          </DialogHeader>
          <RegisterCardData
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
