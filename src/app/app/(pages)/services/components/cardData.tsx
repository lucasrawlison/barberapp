"use client";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import formatarEmReal from "@/app/app/utils/formatarEmReal";
import { Button } from "@/components/ui/button";
import { Plus, Minus, LoaderCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SelectItem } from "@radix-ui/react-select";
import { useEffect, useState } from "react";
import axios from "axios";

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
interface Service {
  id: string;
  code: number;
  value: number;
  createdAt: Date;
  servicesTypes: Type[];
  user: User;
  paymentMethodId: string;
  paymentMethod: PaymentMethod;
}

interface CardDataProps {
  selectedService: Service | null;
  servicesTypes: Type[];
  setSelectedService: (value: Service) => void;
  getServices: () => void;
  paymentMethods: PaymentMethod[];
  setOpenDialog: (value: boolean) => void;
}

export function CardData({
  selectedService,
  servicesTypes,
  setSelectedService,
  getServices,
  paymentMethods,
  setOpenDialog,
}: CardDataProps) {
  const [selectedTypes, setSelectedTypes] = useState<Type[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // useEffect(() => {
  //   console.log(selectedService);
  // }, [selectedService]);

  useEffect(() => {
    if (selectedService) {
      setSelectedTypes(selectedService.servicesTypes);
    }
  }, [selectedService]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  const handleChangeSelect = (selectedType: Type, newTypeId: string) => {
    if (selectedType.id === newTypeId) return;

    const newType = servicesTypes.find((type) => type.id === newTypeId);
    if (!newType) return;

    setSelectedTypes((prevTypes) =>
      prevTypes.map((type) => (type.id === selectedType.id ? newType : type))
    );

    if (selectedService) {
      const updatedTypes = selectedTypes.map((type) =>
        type.id === selectedType.id ? newType : type
      );
      const value = updatedTypes.reduce((acc, type) => acc + type.value, 0);
      setSelectedService({
        ...selectedService,
        servicesTypes: updatedTypes,
        value: value,
      });
    }
  };

  const handleChangePayentMethod = (paymentId: string) => {
    if (!paymentId) return;

    const selectedPaymentMethod = paymentMethods.find(
      (paymentMethod) => paymentMethod.id === paymentId
    );

    if (!selectedPaymentMethod || !selectedService) return;

    setSelectedService({
      ...selectedService,
      paymentMethod: selectedPaymentMethod,
      paymentMethodId: selectedPaymentMethod.id,
    });

  };

  const handleAddEmptyType = () => {
    const emptyType: Type = {
      id: `empty-${Date.now()}`, // Garante um ID único temporário
      name: "Novo Serviço",
      value: 0,
    };

    setSelectedTypes((prev) => [...prev, emptyType]);
  };

  const handleRemoveType = (id: string) => {
    setSelectedTypes((prev) => prev.filter((type) => type.id !== id));

    if (selectedService) {
      const updatedTypes = selectedTypes.filter((type) => type.id !== id);
      const value = updatedTypes.reduce((acc, type) => acc + type.value, 0);

      setSelectedService({
        ...selectedService,
        servicesTypes: updatedTypes,
        value: value,
      });
    }
  };

  const handleUpdateService = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post("/api/updateService", {
        selectedService,
      });

      console.log(response);
      getServices();

      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const handleDeleteService = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post("/api/deleteService", {
        selectedService,
      });


      if(response.status === 200) {
      console.log(response);
      setIsLoading(false);
      setOpenDialog(false);
      getServices();
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    console.log("selectedTypes", selectedTypes);
  },[selectedTypes])
  
  return (
    <div className="flex flex-col gap-4">
      <Label className="pb-1">Serviços realizados:</Label>
      {selectedTypes.map((type, i) => (
        <div key={i} className="flex flex-row gap-4">
          <Select
            value={type.id}
            onValueChange={(typeId) => handleChangeSelect(type, typeId)}
          >
            <SelectTrigger>
              <SelectValue>
                {type.name} - {formatarEmReal(type.value)}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {servicesTypes.map((service) => (
                <SelectItem className="hover:cursor-pointer" key={service.id} value={service.id}>
                  {service.name} - {formatarEmReal(service.value)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            className="rounded-full size-7 bg-red-700"
            onClick={() => handleRemoveType(type.id)}
          >
            <Minus />
          </Button>
        </div>
      ))}

      <div className="flex w-full justify-center">
        <Button onClick={handleAddEmptyType} className="rounded-full size-8">
          <Plus />
        </Button>
      </div>

      <Select
        onValueChange={(paymentId) => handleChangePayentMethod(paymentId)}
      >
        <SelectTrigger>
          <SelectValue
            placeholder={`${selectedService?.paymentMethod?.name} - ${selectedService?.paymentMethod?.bankAccount.bankName}`}
          >
            {selectedService?.paymentMethod?.name
              ? `${selectedService.paymentMethod.name} - ${selectedService.paymentMethod.bankAccount.bankName}`
              : "Escolha uma forma de pagamento"}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {paymentMethods.map((paymentMethod) => (
            <SelectItem
              className="hover:cursor-pointer"
              key={paymentMethod.id}
              value={paymentMethod.id}
            >
              {paymentMethod.name} - {paymentMethod.bankAccount.bankName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <ul>
        {selectedTypes.map((type) => (
          <li key={type.id}>
            <span className="text-sm">
              {type.name} - {formatPrice(type.value)}
            </span>
          </li>
        ))}
      </ul>

      <Separator className="my-4" />

      <div className="flex gap-2 items-center">
        <Label>Total:</Label>
        <Label className="text-md">
          {selectedService?.value ? formatarEmReal(selectedService.value) : ""}
        </Label>

        <div className="w-full"></div>
        <Button onClick={handleDeleteService} variant="destructive">
          {isLoading ? <LoaderCircle className="animate-spin" /> : "Deletar"}
        </Button>
        <Button disabled={isLoading} onClick={handleUpdateService}>
          {isLoading ? <LoaderCircle className="animate-spin" /> : "Salvar"}
        </Button>
      </div>
    </div>
  );
}
