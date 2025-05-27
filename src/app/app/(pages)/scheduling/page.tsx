"use client";

import { useEffect, useState } from "react";
import {
  Calendar,
  Search,
  Plus,
  Clock,
  User,
  Scissors,
  FileText,
  History,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppointmentCard } from "./components/appointment-card";
import { NewAppointmentModal } from "./components/new-appointment-modal";
import { CalendarNavigation } from "./components/calendar-navigation";
import { HistorySection } from "./components/history-section";
import axios, { isAxiosError } from "axios";
import { useSession } from "next-auth/react";
import { toast } from "@/hooks/use-toast";

// Mock data

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

export default function SchedulingApp() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState(false);
  const [schedulings, setSchedulings] = useState<Scheduling[] | undefined>(
    undefined
  );
  const [activeTab, setActiveTab] = useState("today");
  const { data: session } = useSession();
  const [isLoadingSchedulings, setIsLoadingSchedulings] = useState(false);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });

  const handleGetAllSchedulings = async (
    pageNumber: number
  ) => {
    setIsLoadingSchedulings(true);
    try {
      const response = await axios.post("/api/getUserSchedulings", {
        userId: session?.user?.id,
        page: pageNumber || 1,
        limit: 10,
      });

      if (response.status === 200) {
        const { schedulings, pagination } = response.data;
        setSchedulings(schedulings);
        setPagination(pagination);
        setIsLoadingSchedulings(false);
        console.log(schedulings)
      }
    } catch (error) {
      setIsLoadingSchedulings(false);

      if (isAxiosError(error)) {
        toast({
          title: "Erro ao buscar agendamentos",
          description:
            error.response?.data?.message ||
            "Ocorreu um erro ao buscar os agendamentos.",
          variant: "destructive",
        });
      }
    }
  };

  useEffect(() => {
    if (session?.user?.id) {
      handleGetAllSchedulings(1);
    }
  }, [session?.user?.id]);

  useEffect(() => {
    console.log("Selected Date Changed:", selectedDate);
    console.log(new Date());
  }, [selectedDate]);

  return (
    <div className="overflow-auto bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
                <Scissors className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Agendamento Barbearia
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex flex-row items-center space-x-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>{new Date().toLocaleDateString()}</span>
                {isLoadingSchedulings && (
                  <div className="flex flex-row">
                    <div className=" animate-spin h-4 w-4 rounded-full border-blue-600 border-b-2 mr-2"></div>
                    <span className="text-blue-600">Carregando</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-2 lg:w-400">
            <TabsTrigger value="today" className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>Agenda de Hoje</span>
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="flex items-center space-x-2"
            >
              <History className="w-4 h-4" />
              <span>Histórico</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="today" className="space-y-6">
            {/* Calendar Navigation */}
            <CalendarNavigation
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
            />

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total</p>
                      {/* <p className="text-2xl font-bold text-gray-900">{stats.total}</p> */}
                    </div>
                    <Calendar className="w-8 h-8 text-gray-400" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Pendentes
                      </p>
                      {/* <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p> */}
                    </div>
                    <Clock className="w-8 h-8 text-yellow-400" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Atendidos
                      </p>
                      {/* <p className="text-2xl font-bold text-green-600">{stats.attended}</p> */}
                    </div>
                    <User className="w-8 h-8 text-green-400" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Cancelados
                      </p>
                      {/* <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p> */}
                    </div>
                    <FileText className="w-8 h-8 text-red-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Search Bar */}
            <div className="flex items-center space-x-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por cliente, serviço ou horário..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button
                onClick={() => setIsNewAppointmentOpen(true)}
                className="flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Novo Agendamento</span>
              </Button>
            </div>

            {/* Appointments List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Agendamentos para {selectedDate.toLocaleDateString()}
                </h2>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history">
            <HistorySection schedulings={schedulings}
            pagination={pagination}
            handleGetAllSchedulings={handleGetAllSchedulings}
            isLoadingSchedulings={isLoadingSchedulings}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* New Appointment Modal */}
      {/* <NewAppointmentModal
        isOpen={isNewAppointmentOpen}
        onClose={() => setIsNewAppointmentOpen(false)}
        onSubmit={handleAddAppointment}
        currentBarber={currentBarber}
        selectedDate={selectedDate}
      /> */}
    </div>
  );
}
