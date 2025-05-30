"use client";

import type React from "react";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useState } from "react";
import {
  Calendar,
  Clock,
  User,
  Phone,
  Scissors,
  FileText,
  UsersIcon,
  ChevronsLeft,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsRight,
  Minus,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import axios, { isAxiosError } from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import AddClient from "./addClient";
import { toast } from "@/hooks/use-toast";
import formatarEmReal from "@/app/app/utils/formatarEmReal";

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

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
  servicesValue: number;
  discount: number;
  createdAt: Date;
  servicesTypes: Type[];
  user: User;
  paymentMethodId: string;
  customerId: string;
  customer: Customer;
  // paymentMethod: PaymentMethod
  // transactions: Transaction[];
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface Barbershop {
  id: string;
  name: string;
}

interface Scheduling {
  id: string;
  date: string;
  time: string;
  description?: string;
  userId: string;
  user: User;
  servicesTypes: Type[];
  service?: Service;
  ServiceId?: string;
  customer?: Customer;
  customerId?: string;
  barbershopId?: string;
  barbershop?: Barbershop;
  status: "pendente" | "atendido" | "cancelado" | "agendado";
  wasAttended?: boolean;
}

interface NewAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  /*onSubmit: (appointment: any) => void*/
  /* currentBarber: string*/
  selectedDate: Date;
  newScheduling: Scheduling;
  selectedScheduling: Scheduling | undefined;
  setSelectedScheduling: Dispatch<SetStateAction<Scheduling | undefined>>;
  setNewScheduling: Dispatch<SetStateAction<Scheduling>>;
}

export function NewAppointmentModal({
  isOpen,
  onClose,
  newScheduling,
  selectedScheduling,
  setNewScheduling,
  setSelectedScheduling,
}: NewAppointmentModalProps) {
  const handleChange = (name: string, value: any) => {
    setNewScheduling((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  const [isCustomerOpen, setIsCustomerOpen] = useState(false);
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customerPagination, setCustomerPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const [isloadingTypes, setIsloadingTypes] = useState(false);
  const [servicesTypes, setServicesTypes] = useState<Type[]>([]);

  const handleGetCustomer = async (pageNumber: number) => {
    setIsLoadingCustomers(true);
    try {
      const response = await axios.get("/api/getCustomers", {
        params: {
          page: pageNumber,
          limit: 10,
        },
      });
      if (response.status === 200) {
        console.log(response.data.customers);
        setCustomerPagination(response.data.pagination);
        setCustomers(response.data.customers);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingCustomers(false);
    }
  };

  const handleSetChosedCustomer = (customer: Customer | undefined) => {
    if (selectedScheduling) {
      setSelectedScheduling({
        ...selectedScheduling,
        customer: customer || undefined,
        customerId: customer?.id || "",
      });
    }

    if (newScheduling) {
      setNewScheduling({
        ...newScheduling,
        customer: customer || undefined,
        customerId: customer?.id || "",
      });
    }
  };

  const getServicesTypes = async () => {
    try {
      setIsloadingTypes(true);
      const response = await axios.post("/api/getServicesTypes");
      if (response.status === 200) {
        const { servicesTypes } = response.data;
        setServicesTypes(servicesTypes);
        setIsloadingTypes(false);
      }
    } catch (error) {
      if (isAxiosError(error)) {
        toast({
          title: "Erro",
          description: error.response?.data.message,
          duration: 5000,
        });
        console.log(error);
        setIsloadingTypes(false);
      }
    }
  };

  const handleRemoveSelect = (i: number) => {
    if (
      newScheduling.servicesTypes.length === 1 ||
      selectedScheduling?.servicesTypes.length === 1
    ) {
      toast({
        title: "Atenção!",
        description: "É necessário selecionar ao menos um serviço",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    const updatedSelects = newScheduling.servicesTypes.filter(
      (_, index) => index !== i
    );

    setNewScheduling({ ...newScheduling, servicesTypes: updatedSelects });
  };

  const handleAddSelect = () => {
    if (newScheduling) {
      const updatedSelects = newScheduling.servicesTypes;
      updatedSelects.push({
        id: "",
        name: "Selecione",
        value: 0,
      });
      setNewScheduling({ ...newScheduling, servicesTypes: updatedSelects });
    }
  };

  const handleChangeSelect = (index: number, serviceId: string) => {
    // console.log(index, serviceId);
    // Encontrar o objeto completo do serviço selecionado
    const selectedService = servicesTypes.find((s) => s.id === serviceId);

    if (selectedService) {
      if (selectedScheduling) {
        const updatedServices = selectedScheduling.servicesTypes;
        updatedServices[index] = selectedService;
        setSelectedScheduling({
          ...selectedScheduling,
          servicesTypes: updatedServices,
        });
      }
    }

    if (newScheduling) {
      const updatedServices = newScheduling.servicesTypes;
      if (selectedService) {
        updatedServices[index] = selectedService;
        setNewScheduling({
          ...newScheduling,
          servicesTypes: updatedServices,
        });
      }
    }
  };

  useEffect(() => {
    getServicesTypes();
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5" />
            <span>Novo Agendamento</span>
          </DialogTitle>
        </DialogHeader>

        {/* Client Name */}
        <Label>Cliente:</Label>
        <div className="w-full gap-3   flex flex-row justify-center items-center">
          <Input
            value={newScheduling.customer?.name || ""}
            name="user"
            id="user"
            type="text"
            disabled
            placeholder={newScheduling.customer?.name || "Selecione um cliente"}
            className="hover:cursor-default text-xs"
          />
          <Dialog
            open={isCustomerOpen}
            onOpenChange={() => setIsCustomerOpen(!isCustomerOpen)}
          >
            <DialogTrigger
              onClick={() => handleGetCustomer(customerPagination.page)}
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

              <Input placeholder="Buscar" className="w-full"></Input>
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
                            handleSetChosedCustomer(customer);
                            setIsCustomerOpen(false);
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
                    disabled={customerPagination.page === 1}
                  >
                    <ChevronsLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      handleGetCustomer(customerPagination.page - 1)
                    }
                    disabled={customerPagination.page === 1}
                  >
                    <ChevronLeftIcon className="h-4 w-4" />
                  </Button>
                  <span className="text-sm font-medium">
                    Página {customerPagination.page} de{" "}
                    {customerPagination.totalPages || 1}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      handleGetCustomer(customerPagination.page + 1)
                    }
                    disabled={
                      customerPagination.page ===
                        customerPagination.totalPages ||
                      customerPagination.totalPages === 0
                    }
                  >
                    <ChevronRightIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      handleGetCustomer(customerPagination.totalPages)
                    }
                    disabled={
                      customerPagination.page ===
                        customerPagination.totalPages ||
                      customerPagination.totalPages === 0
                    }
                  >
                    <ChevronsRight className="h-4 w-4" />
                  </Button>
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <AddClient
            // handleGetCustomers={}
            // pagination={}
            setChosedCustomer={handleSetChosedCustomer}
          />
        </div>

        {/* Service */}
        <Label>Serviço</Label>
        {newScheduling.servicesTypes.map((select, i) => (
          <div key={i} className="w-full flex flex-row items-center gap-3">
            <Select
              value={select.id}
              onValueChange={(value) => handleChangeSelect(i, value)}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    select.name + " - " + formatarEmReal(select.value)
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {servicesTypes.map((service) => (
                  <SelectItem
                    key={service.id}
                    value={service.id}
                    className="text-sm hover:bg-gray-100 hover:cursor-pointer"
                  >
                    {service.name} - {formatarEmReal(service.value)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              className="rounded-full size-7 bg-red-700"
              onClick={() => handleRemoveSelect(i)}
            >
              <Minus></Minus>
            </Button>
          </div>
        ))}
        <div className="flex w-full justify-center mb-8">
          <Button className="rounded-full size-8" onClick={handleAddSelect}>
            <Plus />
          </Button>
        </div>

        {/* Date and Time */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="date">Data *</Label>
            <Input
              id="date"
              type="date"
              value={
                newScheduling.date  || ""
              }
              onChange={(e) => handleChange("date", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="date">Horário *</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o horário" />
              </SelectTrigger>
              <SelectContent></SelectContent>
            </Select>
          </div>
        </div>

        {/* Barber */}
        <div className="space-y-2">
          <Label>Barbeiro</Label>
          <Input
          // value={formData.barber}
          // onChange={(e) => handleChange("barber", e.target.value)}
          // placeholder="Nome do barbeiro"
          />
        </div>

        {/* Observation */}
        <div className="space-y-2">
          <Label htmlFor="observation" className="flex items-center space-x-2">
            <FileText className="w-4 h-4" />
            <span>Observação (Opcional)</span>
          </Label>
          <Textarea
            id="observation"
            // value={formData.observation}
            // onChange={(e) => handleChange("observation", e.target.value)}
            placeholder="Observações especiais ou preferências..."
            rows={3}
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit">Agendar Horário</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
// }
