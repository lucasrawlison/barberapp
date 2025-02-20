import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {  useState } from "react";
import formatarEmReal from "@/app/app/utils/formatarEmReal"
import { Button } from "@/components/ui/button";

interface Service {
  name: string,
  value: number
}

interface CardDataProps {
  services: Service[]
}

export function CardData( {services} : CardDataProps) {
    const [serviceValue,] = useState(0) 

    return (
      <div className="flex flex-col gap-4">
        <Label className="pb-1">Serviços realizados:</Label>
        {services.map((service) => (
          <div key={service.name} className="flex gap-2 items-center h-5">
            <Checkbox />
            <Label>{service.name}</Label>


          </div>
        ))}
        <Separator className="my-4" />

        <div className=" flex gap-2 items-center">
          <Label>Total:</Label>
          <Label className="text-md">{formatarEmReal(serviceValue)}</Label>

          <div className="w-full">
          </div>
          <Button>Salvar</Button>
        </div>
      </div>
    );
}