"use client"

import { useState } from "react"
import { Clock, User, Scissors, FileText, MoreHorizontal, Check, X, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

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

interface AppointmentCardProps {
  appointment: Appointment
  onStatusUpdate: (id: string, status: "pending" | "attended" | "cancelled") => void
}

export function AppointmentCard({ appointment, onStatusUpdate }: AppointmentCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "attended":
        return "bg-green-100 text-green-800 border-green-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "attended":
        return <Check className="w-3 h-3" />
      case "cancelled":
        return <X className="w-3 h-3" />
      default:
        return <Clock className="w-3 h-3" />
    }
  }

  return (
    <Card
      className={`transition-all duration-200 hover:shadow-md ${
        appointment.status === "cancelled" ? "opacity-75" : ""
      }`}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            {/* Time */}
            <div className="flex items-center space-x-2 min-w-0">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">{appointment.time}</p>
                <p className="text-xs text-gray-500">
                  {new Date(`${appointment.date}T${appointment.time}`).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>

            {/* Client Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <User className="w-4 h-4 text-gray-400" />
                <p className="font-medium text-gray-900 truncate">{appointment.clientName}</p>
              </div>
              <div className="flex items-center space-x-2 mb-1">
                <Scissors className="w-4 h-4 text-gray-400" />
                <p className="text-sm text-gray-600 truncate">{appointment.service}</p>
              </div>
              {appointment.observation && (
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-gray-400" />
                  <p className="text-sm text-gray-500 truncate">{appointment.observation}</p>
                </div>
              )}
            </div>

            {/* Status */}
            <div className="flex items-center space-x-3">
              <Badge className={`${getStatusColor(appointment.status)} flex items-center space-x-1`}>
                {getStatusIcon(appointment.status)}
                <span className="capitalize">{appointment.status}</span>
              </Badge>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2 ml-4">
            {appointment.status === "pending" && (
              <Button
                size="sm"
                onClick={() => onStatusUpdate(appointment.id, "attended")}
                className="bg-green-600 hover:bg-green-700"
              >
                <Check className="w-4 h-4 mr-1" />
                Marcar Atendido
              </Button>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Edit className="w-4 h-4 mr-2" />
                  Editar Agendamento
                </DropdownMenuItem>
                {appointment.status !== "attended" && (
                  <DropdownMenuItem onClick={() => onStatusUpdate(appointment.id, "attended")}>
                    <Check className="w-4 h-4 mr-2" />
                    Marcar como Atendido
                  </DropdownMenuItem>
                )}
                {appointment.status !== "cancelled" && (
                  <DropdownMenuItem
                    onClick={() => onStatusUpdate(appointment.id, "cancelled")}
                    className="text-red-600"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancelar Agendamento
                  </DropdownMenuItem>
                )}
                {appointment.status !== "pending" && (
                  <DropdownMenuItem onClick={() => onStatusUpdate(appointment.id, "pending")}>
                    <Clock className="w-4 h-4 mr-2" />
                    Marcar como Pendente
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Phone number (if expanded or always visible) */}
        {appointment.phone && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Telefone:</span> {appointment.phone}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
