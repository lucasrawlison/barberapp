"use client"
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import formatarEmReal from "@/app/app/utils/formatarEmReal";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LoaderCircle, Plus, Check, UsersIcon } from "lucide-react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Service {
  id: string;
  name: string;
  value: number;
}
interface BankAccount {
  id: string;
  bankName: string;

}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface PaymentMethod {
  id: string;
  name: string;
  bankAccount: BankAccount
}


interface CardDataProps {
  services: Service[];
  setIsSaved: (value: boolean) => void;
  isSaved: boolean;
  paymentMethods: PaymentMethod[]
  getServices: () => void;
}

export function RegisterCardData({ services, setIsSaved, isSaved, paymentMethods, getServices }: CardDataProps) {
  const [serviceToSave, setServiceToSave] = useState<Service[]>([
    {
      id: "",
      name: "",
      value: 0
    }
  ]);
  const [paymentMethodToSave, setPaymentMethodsToSave] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(false);
  const { data: session } = useSession();
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | undefined>(undefined)
  const [customers, setCustomers] = useState<Customer[] | undefined>(undefined)
  const [isOpen, setIsOpen] = useState(false)

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
        paymentMethodId: paymentMethodToSave,
        customerId:  selectedCustomer?.id ?? null
      });
      if(response.status === 200) {
        console.log(response);
        getServices()
        setIsLoading(false);
        setIsSaved(true);

      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };


  const handleGetCustomer = async () => {
    setIsLoadingCustomers(true)
    try {
      const response = await axios.get("/api/getCustomers")
      if (response.status === 200) {
        setCustomers(response.data.customers)
        console.log(response.data.customers)
        setIsLoadingCustomers(false)
      }
    } catch (error) {
      setIsLoadingCustomers(false)
      console.log(error)
    }
  }

  return (
    <div className="p-1 flex flex-col gap-4 max-w-full overflow-auto">
      <Label className="pb-1">Serviços realizados:</Label>
      {serviceToSave.map((selected, index) => (
        <div key={index} className=" p-1 flex items-center gap-2 w-full">
          <Select
            value={selected.id}
            onValueChange={(value) => handleChangeService(index, value)}
          >
            <SelectTrigger className=" truncate">
              <SelectValue placeholder={selected.name || "Selecione"} />
            </SelectTrigger>
            <SelectContent className="w-10/12">
              {services
                .filter(
                  (s) =>
                    !serviceToSave.some((sel) => sel.id === s.id) ||
                    s.id === selected.id
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
            onClick={() => handleRemoveService(index)}
          >
            ✕
          </Button>
        </div>
      ))}

      <div className="flex w-full justify-center mb-8">
        <Button className="rounded-full size-8" onClick={handleAddSelect}>
          <Plus />
        </Button>
      </div>
      <Label>Cliente: </Label>
      <div className="w-full flex flex-row items-center gap-3">
        <Input
          disabled
          value={selectedCustomer?.name ?? ""}
          placeholder="Selecione o cliente"
          type="text"
        ></Input>
        <Dialog open={isOpen} onOpenChange={()=>setIsOpen(!isOpen)}>
          <DialogTrigger onClick={handleGetCustomer} asChild>
            <Button className="hover: cursor-pointer">
              <UsersIcon />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Clientes</DialogTitle>
              <DialogDescription>
                Selecione um cliente para o serviço
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col items-center justify-center">
              <Input placeholder="Buscar" className="w-full"></Input>
              <div className="flex flex-col gap-2 mt-4 max-h-96 overflow-auto w-full">
              {isLoadingCustomers && (
          <div className="h-1 bg-slate-400 w-full overflow-hidden relative">
            <div className="w-1/2 bg-sky-500 h-full animate-slideIn absolute left-0 rounded-lg"></div>
          </div>
        )}
                <Table>
                  <TableCaption> Lista de clientes disponíveis</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-black">Nome</TableHead>
                      <TableHead className="text-center text-black">
                        Contato
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customers &&
                      customers.map((customer) => (
                        <TableRow
                          className="hover:cursor-pointer"
                          key={customer.id}
                          onClick={() => {
                            setSelectedCustomer(customer);
                            setIsOpen(false);
                          }}
                        >
                          <TableCell className="text-sm text-gray-600">
                            {customer.name}
                          </TableCell>
                          <TableCell className="text-sm text-gray-600 text-center">
                            {customer.phone}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <Select onValueChange={(value) => setPaymentMethodsToSave(value)}>
        <SelectTrigger>
          <SelectValue placeholder="Forma de pagamento" />
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

      <Separator className="my-4" />
      <div className="flex gap-2 items-center">
        <Label>Total:</Label>
        <Label className="text-md">
          {formatarEmReal(serviceToSave.reduce((acc, s) => acc + s.value, 0))}
        </Label>
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