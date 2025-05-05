"use client";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import formatarEmReal from "@/app/app/utils/formatarEmReal";
import { Button } from "@/components/ui/button";
import { Plus, LoaderCircle, UsersIcon, Trash2, ChevronRightIcon, ChevronLeftIcon, ChevronsLeft, ChevronsRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import AddClient from "./addClient";

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
  discount: number;
  servicesValue: number;
  createdAt: Date;
  servicesTypes: Type[];
  user: User;
  paymentMethodId: string;
  paymentMethod: PaymentMethod;
  customerId: string;
  customer: Customer;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}




interface CardDataProps {
  selectedService: Service;
  servicesTypes: Type[];
  setSelectedService: (value: Service) => void;
  getServices: ( value: number) => void;
  paymentMethods: PaymentMethod[];
  setOpenDialog: (value: boolean) => void;
  pagination: Pagination;
  setPagination: (value: Pagination) => void;
}

export function CardData({
  selectedService,
  servicesTypes,
  setSelectedService,
  getServices,
  paymentMethods,
  setOpenDialog,
  pagination,
  setPagination,
}: CardDataProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [customers, setCustomers] = useState<Customer[] | undefined>(undefined);
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!selectedService) return;
    const soma = selectedService.servicesTypes.reduce((acc, type) => acc + type.value, 0);
    const valorTotal = soma - selectedService.discount;
    setSelectedService({
      ...selectedService,
      value: valorTotal,
      servicesValue: soma,
    });
  }, [selectedService.servicesTypes, selectedService.discount]);

  const handleChangeSelect = (selectedType: Type, newTypeId: string) => {
    if (selectedType.id === newTypeId) return;
    const newType = servicesTypes.find((type) => type.id === newTypeId);
    if (!newType) return;
    const updatedTypes = selectedService.servicesTypes.map((type) =>
      type.id === selectedType.id ? newType : type
    );
    setSelectedService({
      ...selectedService,
      servicesTypes: updatedTypes,
    });
  };

  const handleChangePayentMethod = (paymentId: string) => {
    const selectedPaymentMethod = paymentMethods.find(
      (paymentMethod) => paymentMethod.id === paymentId
    );
    if (!selectedPaymentMethod) return;
    setSelectedService({
      ...selectedService,
      paymentMethod: selectedPaymentMethod,
      paymentMethodId: selectedPaymentMethod.id,
    });
  };

  const handleAddEmptyType = () => {
    const emptyType: Type = {
      id: `empty-${Date.now()}`,
      name: "Selecione",
      value: 0,
    };
    setSelectedService({
      ...selectedService,
      servicesTypes: [...selectedService.servicesTypes, emptyType],
    });
  };

  const handleRemoveType = (index: number) => {
    if (selectedService.servicesTypes.length === 1) {
      toast({
        title: "Escolha ao menos um serviço",
        variant: "destructive",
        duration: 2000,
      });
      return;
    }
    const updatedTypes = selectedService.servicesTypes.filter((_, i) => i !== index);
    setSelectedService({
      ...selectedService,
      servicesTypes: updatedTypes

    });
  };

  const handleUpdateService = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post("/api/updateService", {
        selectedService,
      });
      if (response.status === 200) {
        toast({
          title: "Sucesso",
          description: "Serviço atualizado com sucesso!",
          duration: 2000,
        });
        getServices(pagination.page);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteService = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post("/api/deleteService", {
        selectedService,
      });
      if (response.status === 200) {
        toast({
          title: "Sucesso",
          description: "Serviço deletado com sucesso!",
          duration: 2000,
        });
        setOpenDialog(false);
        getServices(pagination.page);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetCustomer = async ( pageNumber: number) => {
    setIsLoadingCustomers(true);
    try {
      const response = await axios.get("/api/getCustomers", {
        params: {
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

  const handleSetSelectedCustomer = (customer: Customer | undefined) => {
    if (!customer) return;
    setSelectedService({
      ...selectedService,
      customerId: customer.id,
      customer,
    });
  };


  if (!selectedService) return null;

  if(selectedService){
    
    return (
      <div className="flex flex-col gap-4">
        <Label className="pb-1">Serviços realizados:</Label>
        {selectedService.servicesTypes.map((type, index) => (
          <div key={index} className="flex flex-row gap-4">
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
                {!servicesTypes.find((s) => s.id === type.id) && (
                  <SelectItem value={type.id}>
                    {type.name} - {formatarEmReal(type.value)}
                  </SelectItem>
                )}
                {servicesTypes.map((service) => (
                  <SelectItem key={service.id} value={service.id}>
                    {service.name} - {formatarEmReal(service.value)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              className="rounded-full size-7 bg-red-700"
              onClick={() => handleRemoveType(index)}
            >
              <Trash2 className="text-white" />
            </Button>
          </div>
        ))}
        <div className="flex w-full justify-center">
          <Button onClick={handleAddEmptyType} className="rounded-full size-8">
            <Plus />
          </Button>
        </div>
        <Label>Cliente: </Label>
        <div className="w-full flex flex-row items-center gap-3">
          <Input
            disabled
            value={selectedService?.customer?.name ?? ""}
            placeholder="Selecione o cliente"
          />
          <Dialog open={isOpen} onOpenChange={() => setIsOpen(!isOpen)}>
            <DialogTrigger onClick={()=>handleGetCustomer(1)} asChild>
              <Button>
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
                <Input placeholder="Buscar" className="w-full" />
                <div className="flex flex-col gap-2 mt-4 max-h-96 overflow-auto w-full">
                  {isLoadingCustomers && (
                    <div className="h-1 bg-slate-400 w-full overflow-hidden relative">
                      <div className="w-1/2 bg-sky-500 h-full animate-slideIn absolute left-0 rounded-lg"></div>
                    </div>
                  )}
                  <Table>
                    {/* <TableCaption>Lista de clientes disponíveis</TableCaption> */}
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-black">Nome</TableHead>
                        <TableHead className="text-center text-black">Contato</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {customers?.map((customer) => (
                        <TableRow
                          className="hover:cursor-pointer"
                          key={customer.id}
                          onClick={() => {
                            setSelectedService({
                              ...selectedService,
                              customerId: customer.id,
                              customer,
                            });
                            setIsOpen(false);
                          }}
                        >
                          <TableCell className="text-sm text-gray-600">{customer.name}</TableCell>
                          <TableCell className="text-sm text-gray-600 text-center">
                            {customer.phone}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <div className="flex items-center justify-center space-x-2">
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
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <AddClient
          pagination={pagination}
            setChosedCustomer={handleSetSelectedCustomer}
            handleGetCustomers={handleGetCustomer}
          />
        </div>
        <Select onValueChange={handleChangePayentMethod}>
          <SelectTrigger>
            <SelectValue
              placeholder={
                selectedService?.paymentMethod
                  ? `${selectedService.paymentMethod.name} - ${selectedService.paymentMethod.bankAccount.bankName}`
                  : "Escolha uma forma de pagamento"
              }
            />
          </SelectTrigger>
          <SelectContent>
            {paymentMethods.map((paymentMethod) => (
              <SelectItem key={paymentMethod.id} value={paymentMethod.id}>
                {paymentMethod.name} - {paymentMethod.bankAccount.bankName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Separator className="my-4" />
        <Label>Desconto:</Label>
        <Separator className="my-4" />
        <div className="flex flex-col gap-2 outline outline-1 p-3 outline-gray-300">
          <Label className="mt-3">Resumo:</Label>
          <Table className="w-full">
            <TableBody>
              {selectedService.servicesTypes.map((service, index) => (
                <TableRow key={index}>
                  <TableCell className="text-xs text-green-700">{service.name}</TableCell>
                  <TableCell className="text-xs text-green-700 text-right">
                    + {formatarEmReal(service.value)}
                  </TableCell>
                </TableRow>
              ))}
              {selectedService.discount > 0 && (
                <TableRow>
                  <TableCell className="text-xs text-red-700">Desconto</TableCell>
                  <TableCell className="text-xs text-red-700 text-right">
                    - {formatarEmReal(selectedService.discount)}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <Separator className="my-4" />
        <div className="flex gap-2 items-center">
          <Label>Total:</Label>
          <Label className="text-md">
            {selectedService?.value ? formatarEmReal(selectedService.value) : ""}
          </Label>
          <div className="w-full" />
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
}
