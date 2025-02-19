import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import formatarEmReal from "@/app/app/utils/formatarEmReal"

export function CardData() {
    const [serviceValue, setServiceValue] = useState(0)

    const services = [
      {
        name: "Só Máquina",
        value: 10,
      },
      {
        name: "Degradê",
        value: 20,
      },
      {
        name: "Tesoura",
        value: 25,
      },
      {
        name: "Barba",
        value: 10,
      },
      

    ];
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

        <div className="flex gap-2 items-center">
          <Label>Total:</Label>
          <Label className="text-md">{formatarEmReal(serviceValue)}</Label>
        </div>
      </div>
    );
}