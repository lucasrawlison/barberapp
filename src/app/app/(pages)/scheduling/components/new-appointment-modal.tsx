"use client";

import type React from "react";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useState } from "react";
import {
  Calendar,
  User,
  FileText,
  UsersIcon,
  ChevronsLeft,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsRight,
  Minus,
  Plus,
  UserSearch,
  Loader2,
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
  // DialogClose,
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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import Image from "next/image";
import { useSession } from "next-auth/react";
import gerarHorariosComIntervalo from "@/app/app/utils/gerarHorarioDinamico";

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  login: string;
  profileType: string;
  profileImgLink: string;
  breakAt: string;
  breakEndAt: string;
  barbershop: Barbershop;
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
  openAt: string;
  closeAt: string;
}

interface Scheduling {
  id: string;
  date: string;
  time: string;
  dateTime: Date;
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
  const handleChange = <K extends keyof Scheduling>(
    name: K,
    value: Scheduling[K]
  ) => {
    setNewScheduling((prev) => ({
      ...prev,
      [name]: value,
    }));
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
  const { data: session } = useSession();
  const [, setIsloadingTypes] = useState(false);
  // const [isLoadingHours, ysetIsLoadingHours] = useState(false);
  const [isLoadingScheduling, setIsLoadingScheduling] = useState(false);
  const [servicesTypes, setServicesTypes] = useState<Type[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isUsersOpen, setIsUsersOpen] = useState(false);
  const [isLoadingActiveUser, setIsLoadingActiveUser] = useState(false);
  const [schedulingHours, setSchedulingHours] = useState<string[]>([]);

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

  const handleGetUsers = async () => {
    if (!isOpen) {
      setIsUsersOpen(true);
    }

    setIsLoadingUsers(true);

    try {
      const response = await axios.post("/api/getUsers");
      if (response.status === 200) {
        setIsLoadingUsers(false);
        setUsers(response.data.users);
        // setIsUsersOpen(false);
      }
    } catch (error) {
      setIsUsersOpen(false);

      setIsLoadingUsers(false);
      console.log(error);
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
    console.log("Fetching services types...");
    try {
      setIsloadingTypes(true);
      const response = await axios.post("/api/getServicesTypes");
      if (response.status === 200) {
        const { servicesTypes } = response.data;
        setServicesTypes(servicesTypes);
        console.log("Services Types: ", servicesTypes);
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

  const handleGetActiveUser = async () => {
    console.log("Fetching active user...");
    setIsLoadingActiveUser(true);
    try {
      const response = await axios.post("/api/getActiveUser", {
        id: session?.user?.id,
      });

      if (response.status === 200) {
        const activeUser = response.data;
        setNewScheduling({
          ...newScheduling,
          userId: activeUser.id,
          user: activeUser,
        });
        setIsLoadingActiveUser(false);
      }
    } catch (error) {
      setIsLoadingActiveUser(false);

      if (isAxiosError(error)) {
        toast({
          title: "Erro ao buscar usuário ativo",
          description:
            error.response?.data?.message ||
            "Ocorreu um erro ao buscar o usuário ativo.",
          variant: "destructive",
        });
      }
    }
  };

  const handleSetSchedulingHours = () => {
    if (newScheduling.user) {
      const { breakAt, breakEndAt } = newScheduling.user;
      const { openAt, closeAt } = newScheduling.user.barbershop;
      const hours = gerarHorariosComIntervalo(
        openAt,
        closeAt,
        60,
        breakAt,
        breakEndAt
      );
      console.log("Horas: ", hours);
      setSchedulingHours(hours);
    }
  };

  const handleCreateScheduling = () => async () => {
    setIsLoadingScheduling(true);
    try {
      const response = await axios.post("/api/createScheduling", {
        scheduling: newScheduling,
      });
      if (response.status === 200) {
            setIsLoadingScheduling(false);

        toast({
          title: "Agendamento criado com sucesso!",
          description: "O agendamento foi registrado com sucesso.",
          duration: 3000,
        });
        setSelectedScheduling(response.data.newScheduling);
        setNewScheduling({
          id: "",
          date: "",
          time: "",
          dateTime: new Date(),
          description: "",
          userId: "",
          user: {
            id: "",
            name: "",
            email: "",
            login: "",
            profileType: "",
            profileImgLink: "",
            breakAt: "",
            breakEndAt: "",
            barbershop: {
              id: "",
              name: "",
              openAt: "",
              closeAt: "",
            },
          },
          servicesTypes: [{ id: "", name: "Selecione", value: 0 }],
          customerId: "",
          customer: undefined,
          barbershopId: "",
          barbershop: undefined,
          status: "pendente",
        });
        onClose();
      }
    } catch (error) {
      if(isAxiosError(error)) {
        setIsLoadingScheduling(false);
        toast({
          title: "Erro ao criar agendamento",
          description: error.response?.data.message || "Ocorreu um erro ao criar o agendamento.",
          variant: "destructive",
          duration: 5000,
        });
      }
    }
  }

  useEffect(() => {
    handleSetSchedulingHours();
  }, [newScheduling.user]);

  useEffect(() => {
    getServicesTypes();
    handleSetSchedulingHours();
    handleGetActiveUser();
  },[]);


  useEffect(() => {
    console.log("New Scheduling: ", newScheduling);
  }, [newScheduling]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="h-[600px] overflow-auto sm:max-w-md">
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
              value={newScheduling.date || ""}
              onChange={(e) => handleChange("date", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="date">Horário *</Label>
            <Select onValueChange={(value) => handleChange("time", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o horário" />
              </SelectTrigger>
              <SelectContent>
                {schedulingHours.map((hour) => (
                  <SelectItem
                    key={hour}
                    value={hour}
                    className="text-sm hover:bg-gray-100 hover:cursor-pointer"
                  >
                    {hour}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Barber */}
        <Label className="mt-4">Responsável:</Label>
        <div className="w-full gap-3   flex flex-row justify-center items-center">
          <Input
            value={
              isLoadingActiveUser ? "Carregando..." : newScheduling.user?.name
            }
            name="user"
            id="user"
            type="text"
            disabled
            placeholder="Selecione um usuário"
            className="hover:cursor-default text-xs"
          />
          <Dialog
            onOpenChange={() => setIsUsersOpen(!isUsersOpen)}
            open={isUsersOpen}
          >
            <DialogTrigger onClick={handleGetUsers} asChild>
              <Button>
                <UserSearch></UserSearch>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Buscar</DialogTitle>
                <DialogDescription>
                  Selecione um usuário para o serviço
                </DialogDescription>
              </DialogHeader>
              <Input placeholder="Buscar"></Input>

              <div className="rounded-md border">
                {isLoadingUsers && (
                  <div className="h-1 bg-slate-400 w-full overflow-hidden relative">
                    <div className="w-1/2 bg-sky-500 h-full animate-slideIn absolute left-0 rounded-lg"></div>
                  </div>
                )}
              </div>
              <div className="grid gap-3 grid-cols-3 overflow-auto min-h-[400px] items-center justify-center">
                {users?.map((user) => (
                  <Card
                    key={user.id}
                    className=" hover:cursor-pointer hover:shadow-md  transition-all"
                    onClick={() => {
                      setNewScheduling((prev) => ({
                        ...prev,
                        userId: user.id,
                        user: user,
                      }));
                      setIsUsersOpen(false);
                    }}
                  >
                    <CardHeader>
                      <CardTitle className="text-xs text-center">
                        {user.name}
                      </CardTitle>
                      <CardDescription className="text-center">
                        {user.profileType}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="w-full flex items-center justify-center">
                        {user.profileImgLink ? (
                          <Image
                            className=" rounded-full"
                            src={user.profileImgLink}
                            alt={user.name}
                            width={60}
                            height={60}
                          ></Image>
                        ) : (
                          <User size={60}></User>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Observation */}
        <div className="space-y-2">
          <Label htmlFor="observation" className="flex items-center space-x-2">
            <FileText className="w-4 h-4" />
            <span>Observação (Opcional)</span>
          </Label>
          <Textarea
            id="observation"
            value={newScheduling.description || ""}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Observações especiais ou preferências..."
            rows={3}
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button disabled={isLoadingScheduling} type="submit" onClick={handleCreateScheduling()}>{isLoadingScheduling ? (<Loader2 className=" animate-spin"/>): (
            "Agendar horário"
          )}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
// }
