"use client";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import formatarEmReal from "@/app/app/utils/formatarEmReal";
import { Button } from "@/components/ui/button";
import { Plus, Minus, LoaderCircle } from "lucide-react";
import { Select, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select";
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

interface Service {
  id: string;
  code: number;
  value: number;
  createdAt: Date;
  servicesTypes: Type[];
  user: User;
}

interface CardDataProps {
  selectedService: Service | null;
  servicesTypes: Type[];
  setSelectedService: (value: Service) => void;
}

export function CardData({ selectedService, servicesTypes, setSelectedService }: CardDataProps) {
  const [selectedTypes, setSelectedTypes] = useState<Type[]>([]);
  const [isLoading, setIsLoading] = useState(false)
  
  useEffect(()=> {
    console.log(selectedService)
  },[selectedService])

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

    const newType = servicesTypes.find(type => type.id === newTypeId);
    if (!newType) return;

    setSelectedTypes(prevTypes =>
      prevTypes.map(type => (type.id === selectedType.id ? newType : type))
    );

    if (selectedService) {
      const updatedTypes = selectedTypes.map(type => (type.id === selectedType.id ? newType : type))
      const value = updatedTypes.reduce((acc, type) => acc + type.value, 0)
      setSelectedService({
        ...selectedService,
        servicesTypes: updatedTypes,
        value: value
      });
    }
  };

  const handleAddEmptyType = () => {
    const emptyType: Type = {
      id: `empty-${Date.now()}`, // Garante um ID único temporário
      name: "Novo Serviço",
      value: 0,
    };
  
    setSelectedTypes(prev => [...prev, emptyType]);
  };

  const handleRemoveType = (id: string) => {
    
    setSelectedTypes(prev => prev.filter(type => type.id !== id));

    if(selectedService) {
      const updatedTypes = selectedTypes.filter(type => type.id !== id)
      setSelectedService({
        ...selectedService,
      servicesTypes: updatedTypes
      })
    }
  };

  const handleUpdateService = async () => { 
    try {
      setIsLoading(true)
      const response = await axios.post("/api/updateService",{
        selectedService
      })


      
console.log(response)    

      setIsLoading(false)
    } catch (error) {
      console.log(error)
      setIsLoading(false)
      
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <Label className="pb-1">Serviços realizados:</Label>
      {selectedTypes.map((type) => (
        <div key={type.id} className="flex flex-row gap-4">
          <Select onValueChange={(typeId) => handleChangeSelect(type, typeId)}>
            <SelectTrigger>
              <SelectValue placeholder={type.name} />
            </SelectTrigger>
            <SelectContent>
              {servicesTypes
                .filter(
                  (service) =>
                    !selectedTypes.some(
                      (selected) => selected.id === service.id
                    )
                )
                .map((service) => (
                  <SelectItem
                    className="hover:cursor-pointer"
                    key={service.id}
                    value={service.id}
                  >
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

        <Button onClick={handleUpdateService}>{isLoading ? <LoaderCircle className="animate-spin"/> : "Salvar"}</Button>
      </div>
    </div>
  );
}
