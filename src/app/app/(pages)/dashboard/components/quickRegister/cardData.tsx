"use client"
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import formatarEmReal from "@/app/app/utils/formatarEmReal";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LoaderCircle, Plus, Check } from "lucide-react";
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
  isSaved: boolean;
}

export function CardData({ services, setIsSaved, isSaved }: CardDataProps) {
  const [serviceToSave, setServiceToSave] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();

  const handleAddSelect = () => {
    setServiceToSave((prev) => [...prev, { id: "", name: "", value: 0 }]);
  };

  const handleChangeService = (index: number, serviceId: string) => {
    const selectedService = services.find((s) => s.id === serviceId);
    if (!selectedService) return;

    setServiceToSave((prev) => {
      const updatedServices = [...prev];
      updatedServices[index] = selectedService;
      return updatedServices;
    });
  };

  const handleRemoveService = (index: number) => {
    setServiceToSave((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveService = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post("/api/createService", {
        value: serviceToSave.reduce((acc, s) => acc + s.value, 0),
        userId: session?.user?.id,
        selectedServices: serviceToSave,
      });
      console.log(response);
      setIsLoading(false);
      setIsSaved(true);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Label className="pb-1">Serviços realizados:</Label>
      {serviceToSave.map((selected, index) => (
        <div key={index} className="flex items-center gap-2">
          <Select value={selected.id} onValueChange={(value) => handleChangeService(index, value)}>
            <SelectTrigger>
              <SelectValue placeholder={selected.name || "Selecione"} />
            </SelectTrigger>
            <SelectContent>
              {services
                .filter((s) => !serviceToSave.some((sel) => sel.id === s.id) || s.id === selected.id)
                .map((service) => (
                  <SelectItem className="hover:cursor-pointer" key={service.id} value={service.id}>
                    {service.name} - {formatarEmReal(service.value)}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          <Button className="rounded-full size-7 bg-red-700" onClick={() => handleRemoveService(index)}>
            ✕
          </Button>
        </div>
      ))}
      <div className="flex w-full justify-center">
        <Button className="rounded-full size-8" onClick={handleAddSelect}>
          <Plus />
        </Button>
      </div>
      <ul>
        {serviceToSave.map((service) => (
          <li key={service.id} className="flex justify-between text-xs">
            {service.name} - {formatarEmReal(service.value)}
          </li>
        ))}
      </ul>
      <Separator className="my-4" />
      <div className="flex gap-2 items-center">
        <Label>Total:</Label>
        <Label className="text-md">{formatarEmReal(serviceToSave.reduce((acc, s) => acc + s.value, 0))}</Label>
        <div className="w-full"></div>
        {isSaved ? (
          <Button disabled>
            Salvo <Check />
          </Button>
        ) : (
          <Button disabled={isLoading} onClick={handleSaveService}>
            {isLoading ? <LoaderCircle className="animate-spin" /> : "Salvar"}
          </Button>
        )}
      </div>
    </div>
  );
}