"use client";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import formatarEmReal from "@/app/app/utils/formatarEmReal";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LoaderCircle,
  Plus,
  Check,
  UsersIcon,
  Trash2,
  ChevronRightIcon,
  ChevronsRight,
  ChevronLeftIcon,
  ChevronsLeft,
} from "lucide-react";
import axios, { isAxiosError } from "axios";
import { useSession } from "next-auth/react";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import AddClient from "./addClient";
import { useToast } from "@/hooks/use-toast";
import ValueInput from "./valueInput";

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
  bankAccount: BankAccount;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface CardDataProps {
  services: Service[];
  setIsSaved: (value: boolean) => void;
  isSaved: boolean;
  paymentMethods: PaymentMethod[];
}

export function CardData({
  services,
  setIsSaved,
  isSaved,
  paymentMethods,
}: CardDataProps) {
  const [serviceToSave, setServiceToSave] = useState<Service[]>([
    {
      id: "",
      name: "",
      value: 0,
    },
  ]);
  const [paymentMethodToSave, setPaymentMethodsToSave] = useState<
    string | undefined
  >(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(false);
  const { data: session } = useSession();
  const [selectedCustomer, setSelectedCustomer] = useState<
    Customer | undefined
  >(undefined);
  const [customers, setCustomers] = useState<Customer[] | undefined>(undefined);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const [desconto, setDesconto] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });

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
    if (serviceToSave.length === 1) {
      toast({
        title: "Escolha ao menos um serviço",
        variant: "destructive",
        duration: 2000,
      });
      return;
    }
    setServiceToSave((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveService = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post("/api/createService", {
        value: total,
        discount: desconto,
        servicesValue: serviceToSave.reduce(
          (acc, service) => acc + service.value,
          0
        ),
        userId: session?.user?.id,
        selectedServices: serviceToSave,
        paymentMethodId: paymentMethodToSave,
        customerId: selectedCustomer?.id ?? null,
      });
      if (response.status === 200) {
        toast({
          title: "Serviço salvo com sucesso!",
          description: "O serviço foi salvo com sucesso!",
          variant: "default",
          duration: 2000,
        });
        setIsLoading(false);
        setIsSaved(true);
      }
    } catch (error) {
      if(isAxiosError(error)){
        if(error.response?.status === 400){
          toast({
            title: "Erro ao salvar serviço",
            description: error.response.data.message,
            variant: "destructive",
            duration: 3000,
          });
        }
      }
      setIsLoading(false);
    }
  };

  const handleGetCustomer = async ( pageNumber: number, search?: string ) => {
      setIsLoadingCustomers(true);
      try {
        const response = await axios.get("/api/getCustomers", {
          params: {
            search: search || "",
            page: pageNumber,
            limit: 10,
          },
        });
        if (response.status === 200) {
          setPagination(response.data.pagination);
          setCustomers(response.data.customers);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoadingCustomers(false);
      }
    };

  useEffect(() => {

    const soma = serviceToSave.reduce((acc, s) => acc + s.value, 0);
    setTotal(soma - desconto);
  }, [serviceToSave, desconto]);

 



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
              {services.map((service) => (
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
            <Trash2 className="text-white" />
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
        <Dialog open={isOpen} onOpenChange={() => setIsOpen(!isOpen)}>
          <DialogTrigger
            onClick={() => handleGetCustomer(pagination.page)}
            asChild
          >
            <Button className="hover: cursor-pointer">
              <UsersIcon />
            </Button>
          </DialogTrigger>
          <DialogContent className="h-[550px] flex flex-col gap-4">
            <DialogHeader>
              <DialogTitle>Selecione um cliente</DialogTitle>
              <DialogDescription>
                Escolha um cliente para registrar o serviço
              </DialogDescription>
            </DialogHeader>

            <Input onChange={(e)=> {
              handleGetCustomer(1, e.target.value);
            }} placeholder="Buscar" className="w-full"></Input>
            <div className="flex flex-col gap-2  max-h-96 overflow-auto w-full">
              {isLoadingCustomers && (
                <div className="h-1 bg-slate-400 w-full overflow-hidden relative">
                  <div className="w-1/2 bg-sky-500 h-full animate-slideIn absolute left-0 rounded-lg"></div>
                </div>
              )}
              <Table>
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

            <DialogFooter>
              <div className="flex items-center justify-center space-x-2 w-full">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleGetCustomer(1)}
                  disabled={pagination.page === 1}
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleGetCustomer(pagination.page - 1)}
                  disabled={pagination.page === 1}
                >
                  <ChevronLeftIcon className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium">
                  Página {pagination.page} de {pagination.totalPages || 1}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleGetCustomer(pagination.page + 1)}
                  disabled={
                    pagination.page === pagination.totalPages ||
                    pagination.totalPages === 0
                  }
                >
                  <ChevronRightIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleGetCustomer(pagination.totalPages)}
                  disabled={
                    pagination.page === pagination.totalPages ||
                    pagination.totalPages === 0
                  }
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <AddClient
          pagination={pagination}
          setChosedCustomer={setSelectedCustomer}
          handleGetCustomers={handleGetCustomer}
        />
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
      <Label>Desconto:</Label>
      <ValueInput setDesconto={setDesconto} desconto={desconto} />
      <Separator className="my-4" />
      <div className="flex flex-col gap-2 outline outline-1 p-3 outline-gray-300">
        <Label className="mt-3">Resumo:</Label>
        <Table className="w-full">
          <TableBody>
            {serviceToSave.map((service, index) => (
              <TableRow key={index}>
                <TableCell className="text-xs text-green-700">
                  {service.name}
                </TableCell>
                <TableCell className="text-xs text-green-700 text-right">
                  + {formatarEmReal(service.value)}
                </TableCell>
              </TableRow>
            ))}
            {desconto > 0 && (
              <TableRow>
                <TableCell className="text-xs text-red-700">Desconto</TableCell>
                <TableCell className="text-xs text-red-700 text-right">
                  - {formatarEmReal(desconto)}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Separator className="my-4" />
      <div className="flex gap-2 items-center">
        <Label>Total:</Label>
        <Label className="text-md">{formatarEmReal(total)}</Label>
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
