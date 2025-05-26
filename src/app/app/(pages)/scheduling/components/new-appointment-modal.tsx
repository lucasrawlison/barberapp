"use client"

import type React from "react"

import { useState } from "react"
import { Calendar, Clock, User, Phone, Scissors, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface NewAppointmentModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (appointment: any) => void
  currentBarber: string
  selectedDate: Date
}

const services = [
  "Corte de Cabelo",
  "Aparar Barba",
  "Corte + Barba",
  "Barbear",
  "Corte + Barbear",
  "Lavagem",
  "Penteado",
]

const timeSlots = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
]

export function NewAppointmentModal({
  isOpen,
  onClose,
  onSubmit,
  currentBarber,
  selectedDate,
}: NewAppointmentModalProps) {
  const [formData, setFormData] = useState({
    clientName: "",
    phone: "",
    service: "",
    barber: currentBarber,
    date: selectedDate.toISOString().split("T")[0],
    time: "",
    observation: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.clientName || !formData.service || !formData.time) {
      return
    }

    onSubmit(formData)
    setFormData({
      clientName: "",
      phone: "",
      service: "",
      barber: currentBarber,
      date: selectedDate.toISOString().split("T")[0],
      time: "",
      observation: "",
    })
    onClose()
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5" />
            <span>Novo Agendamento</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Client Name */}
          <div className="space-y-2">
            <Label htmlFor="clientName" className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>Nome do Cliente *</span>
            </Label>
            <Input
              id="clientName"
              value={formData.clientName}
              onChange={(e) => handleChange("clientName", e.target.value)}
              placeholder="Digite o nome do cliente"
              required
            />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center space-x-2">
              <Phone className="w-4 h-4" />
              <span>Telefone (Opcional)</span>
            </Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="+1 (555) 123-4567"
            />
          </div>

          {/* Service */}
          <div className="space-y-2">
            <Label className="flex items-center space-x-2">
              <Scissors className="w-4 h-4" />
              <span>Serviço *</span>
            </Label>
            <Select value={formData.service} onValueChange={(value) => handleChange("service", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um serviço" />
              </SelectTrigger>
              <SelectContent>
                {services.map((service) => (
                  <SelectItem key={service} value={service}>
                    {service}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Data *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleChange("date", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>Horário *</span>
              </Label>
              <Select value={formData.time} onValueChange={(value) => handleChange("time", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o horário" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Barber */}
          <div className="space-y-2">
            <Label>Barbeiro</Label>
            <Input
              value={formData.barber}
              onChange={(e) => handleChange("barber", e.target.value)}
              placeholder="Nome do barbeiro"
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
              value={formData.observation}
              onChange={(e) => handleChange("observation", e.target.value)}
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
        </form>
      </DialogContent>
    </Dialog>
  )
}
