"use client"
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import formatarEmReal from "@/app/app/utils/formatarEmReal";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";
import { Select, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SelectItem } from "@radix-ui/react-select";
import { useEffect } from "react";

interface User {
  name: string
}

interface Type {
  id: string
  name: string
  value: number
}

interface Service {
  id: string
  code: number
  value: number
  createdAt: Date
  servicesTypes: Type[]
  user: User
}

interface CardDataProps {
  selectedService: Service | null
  servicesTypes: Type[]
}

export function CardData( {selectedService, servicesTypes} : CardDataProps) {
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price)
  }

  useEffect(()=> {
    const selectedTypes = selectedService?.servicesTypes
  }, [selectedService])
  
  const handleAddService = (serviceName: string) => {
    const service = servicesTypes.find((s) => s.name === serviceName);
    if (service && !selectedServices.includes(service)) {
      setSelectedServices((prev) => [...prev, service]);
      setTotalValue((prev) => prev + service.value);
    }



  };

  return (
    <div className="flex flex-col gap-4">
      <Label className="pb-1">Serviços realizados:</Label>
      {selectedService?.servicesTypes.map((type) => (
        <div key={type.id} className="flex flex-row gap-4">
          <Select onValueChange={handleAddService}>
            <SelectTrigger>
              <SelectValue placeholder={type.name}/>
            </SelectTrigger>
            <SelectContent>
              {servicesTypes.map((service) => (
                <SelectItem
                  className="hover:cursor-pointer"
                  key={service.id}
                  value={service.name}
                >
                  {service.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button className=" rounded-full size-7 bg-red-700">
            <Minus />
          </Button>
        </div>
      ))}

      <div className="flex w-full justify-center">
        <Button className=" rounded-full size-8 ">
          <Plus />
        </Button>
      </div>

      <ul>
        {selectedService?.servicesTypes.map((type) => (
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
          {selectedService?.value ? formatarEmReal(selectedService?.value) : ""}
        </Label>

        <div className="w-full"></div>

        <Button>Salvar</Button>
      </div>
    </div>
  );
}
