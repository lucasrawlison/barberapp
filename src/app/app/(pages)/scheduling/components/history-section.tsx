"use client"

import { useState } from "react"
import { Search, Filter, Calendar } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AppointmentCard } from "./appointment-card"

interface Appointment {
  id: string
  time: string
  clientName: string
  phone?: string
  service: string
  barber: string
  date: string
  observation?: string
  status: "pending" | "attended" | "cancelled"
}

interface HistorySectionProps {
  appointments: Appointment[]
}

export function HistorySection({ appointments }: HistorySectionProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [serviceFilter, setServiceFilter] = useState("all")
  const [dateRange, setDateRange] = useState("all")

  // Get unique services for filter
  const uniqueServices = Array.from(new Set(appointments.map((apt) => apt.service)))

  // Filter appointments
  const filteredAppointments = appointments
    .filter((appointment) => {
      const matchesSearch =
        appointment.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        appointment.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
        appointment.barber.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus = statusFilter === "all" || appointment.status === statusFilter
      const matchesService = serviceFilter === "all" || appointment.service === serviceFilter

      // Date range filter
      const appointmentDate = new Date(appointment.date)
      const today = new Date()
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
      const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

      let matchesDate = true
      if (dateRange === "week") {
        matchesDate = appointmentDate >= weekAgo
      } else if (dateRange === "month") {
        matchesDate = appointmentDate >= monthAgo
      }

      return matchesSearch && matchesStatus && matchesService && matchesDate
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  // Group appointments by date
  const groupedAppointments = filteredAppointments.reduce(
    (groups, appointment) => {
      const date = appointment.date
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(appointment)
      return groups
    },
    {} as Record<string, Appointment[]>,
  )

  const handleStatusUpdate = (appointmentId: string, newStatus: "pending" | "attended" | "cancelled") => {
    // This would typically update the appointments in the parent component
    console.log(`Update appointment ${appointmentId} to ${newStatus}`)
  }

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
              <label className="text-sm font-medium text-gray-700">Status</label>
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
              <label className="text-sm font-medium text-gray-700">Serviço</label>
              <Select value={serviceFilter} onValueChange={setServiceFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Serviços</SelectItem>
                  {uniqueServices.map((service) => (
                    <SelectItem key={service} value={service}>
                      {service}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Período</label>
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
          {(searchQuery || statusFilter !== "all" || serviceFilter !== "all" || dateRange !== "all") && (
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("")
                setStatusFilter("all")
                setServiceFilter("all")
                setDateRange("all")
              }}
            >
              Limpar Filtros
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Histórico de Agendamentos</h2>
        <Badge variant="outline">{filteredAppointments.length} agendamentos encontrados</Badge>
      </div>

      {/* Appointments List */}
      {Object.keys(groupedAppointments).length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum agendamento encontrado</h3>
            <p className="text-gray-500">Tente ajustar os filtros para ver mais resultados.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedAppointments).map(([date, dayAppointments]) => (
            <div key={date} className="space-y-3">
              <div className="flex items-center space-x-3">
                <h3 className="text-md font-medium text-gray-900">
                  {new Date(date).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </h3>
                <Badge variant="secondary">{dayAppointments.length} agendamentos</Badge>
              </div>
              <div className="space-y-2">
                {dayAppointments.map((appointment) => (
                  <AppointmentCard key={appointment.id} appointment={appointment} onStatusUpdate={handleStatusUpdate} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
