"use client"
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import formatarEmReal from "@/app/app/utils/formatarEmReal";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {LoaderCircle, Plus, Check} from "lucide-react"
import axios from "axios";
import { useSession } from "next-auth/react";

interface Service {
  id: string;
  name: string;
  value: number;
}

interface CardDataProps {
  services: Service[];
  setIsSaved: (value: boolean) => void;
  isSaved: boolean
}

export function CardData({ services, setIsSaved, isSaved }: CardDataProps) {
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const [totalValue, setTotalValue] = useState(0);
  const [selects, setSelects] = useState<number[]>([0]);
  const [isLoading, setIsLoading] = useState(false)
  const {data: session} = useSession()

  const handleAddService = (serviceName: string) => {
    const service = services.find((s) => s.name === serviceName);
    if (service && !selectedServices.includes(service)) {
      setSelectedServices((prev) => [...prev, service]);
      setTotalValue((prev) => prev + service.value);
    }



  };

  const handleAddSelect = () => {
    setSelects((prev) => [...prev, prev.length]);
  };

  const handleSaveService = async () => {
    try {
      setIsLoading(true)
      const response = await axios.post("/api/createService", {
        value: totalValue,
        userId: session?.user?.id,
        selectedServices,
      })
      
      console.log(response)
      setIsLoading(false)
      setIsSaved(true)
    } catch (error) {
      console.log(error)
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <Label className="pb-1">Serviços realizados:</Label>
      {selects.map((_, index) => (
        <Select key={index} onValueChange={handleAddService}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent>
            {services.map((service) => (
              <SelectItem className="hover:cursor-pointer" key={service.id} value={service.name}>
                {service.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ))}
      <div className="flex w-full justify-center">

      <Button className=" rounded-full size-8" onClick={handleAddSelect}><Plus/></Button>
      </div>
      
      <ul>
        {selectedServices.map((service) => (
          <li key={service.id} className="flex justify-between text-xs">
            {service.name} - {formatarEmReal(service.value)}
          </li>
        ))}
      </ul>
      
      <Separator className="my-4" />

      <div className="flex gap-2 items-center">
        <Label>Total:</Label>
        <Label className="text-md">{formatarEmReal(totalValue)}</Label>

        <div className="w-full"></div>
        {isSaved ?
         <Button disabled>Salvo <Check/></Button>
         : 
          <Button disabled={isLoading} onClick={handleSaveService}>{isLoading ? <LoaderCircle className="animate-spin"/> : "Salvar"}</Button>
         }
      </div>
    </div>
  );
}
