"use client"

import { useState } from "react"
import { Search, Filter, Calendar, RotateCw } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AppointmentCard } from "./appointment-card"

interface Pagination {
  total: number
  page: number
  limit: number
  totalPages: number
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
  id: string
  name: string
  value: number
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

interface HistorySectionProps {
  schedulings: Scheduling[] | undefined
  handleGetAllSchedulings: (value: number)=> void
  pagination: Pagination
}

export function HistorySection({ schedulings, pagination, handleGetAllSchedulings }: HistorySectionProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [serviceFilter, setServiceFilter] = useState("all")
  const [dateRange, setDateRange] = useState("all")

  // Get unique services for filter
  // const uniqueServices = Array.from(new Set(appointments.map((apt) => apt.service)))

  // Filter appointments
  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="w-5 h-5" />
            <span>Filtrar Agendamentos</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar por cliente, serviço ou barbeiro..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filter Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Status
              </label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Status</SelectItem>
                  <SelectItem value="attended">Atendidos</SelectItem>
                  <SelectItem value="cancelled">Cancelados</SelectItem>
                  <SelectItem value="pending">Pendentes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Serviço
              </label>
              <Select value={serviceFilter} onValueChange={setServiceFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Serviços</SelectItem>
                  {/* {uniqueServices.map((service) => (
                    <SelectItem key={service} value={service}>
                      {service}
                    </SelectItem>
                  ))} */}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Período
              </label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todo o Período</SelectItem>
                  <SelectItem value="week">Última Semana</SelectItem>
                  <SelectItem value="month">Último Mês</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Clear Filters */}
          {(searchQuery ||
            statusFilter !== "all" ||
            serviceFilter !== "all" ||
            dateRange !== "all") && (
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
                setServiceFilter("all");
                setDateRange("all");
              }}
            >
              Limpar Filtros
            </Button>
          )}
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Histórico</h2>
        <Badge variant="outline">
          {schedulings?.length || 0} appointments found
        </Badge>
      </div>
      <div className="flex gap-1 items-center justify-center hover:cursor-pointer w-max hover:bg-black/10 transition-all duration-500 px-2 py-1 rounded-lg"
      onClick={()=>{
        handleGetAllSchedulings(pagination.page)
      }}
      >
        <span className="text-xs">Recarregar</span>
        <RotateCw className="h-[12px] p-0 m-0" />
      </div>
      {schedulings?.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum agendamento encontrado.
            </h3>
            <p className="text-gray-500">
              Tente ajustar os filtros para ter mais resultados.
            </p>
          </CardContent>
        </Card>
      ) : (
        schedulings?.map((scheduling) => (
          <AppointmentCard
            key={scheduling.id}
            scheduling={scheduling}
          ></AppointmentCard>
        ))
      )}
    </div>
  );
}
