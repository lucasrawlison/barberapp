"use client";

import type React from "react";
import { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import { Calendar, Clock, User, Phone, Scissors, FileText } from "lucide-react";
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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
  setNewScheduling: Dispatch<SetStateAction<Scheduling>>;
}

export function NewAppointmentModal({
  isOpen,
  onClose,
  newScheduling,
  selectedScheduling,
  setNewScheduling,
}: NewAppointmentModalProps) {

 const handleChange = (name: string, value: any) => {
  setNewScheduling(prev => ({
    ...prev,
    [name]: value,
  }))
 }

  if (selectedScheduling) {
    // <Dialog open={isOpen} onOpenChange={onClose}>
    //   <DialogContent className="sm:max-w-md">
    //     <DialogHeader>
    //       <DialogTitle className="flex items-center space-x-2">
    //         <Calendar className="w-5 h-5" />
    //         <span>Agendamento</span>
    //       </DialogTitle>
    //     </DialogHeader>

    //     {/* Client Name */}
    //     <div className="space-y-2">
    //       <Label htmlFor="clientName" className="flex items-center space-x-2">
    //         <User className="w-4 h-4" />
    //         <span>Nome do Cliente *</span>
    //       </Label>
    //       <Input
    //         id="clientName"
    //         // value={formData.clientName}
    //         // onChange={(e) => handleChange("clientName", e.target.value)}
    //         placeholder="Digite o nome do cliente"
    //         required
    //       />
    //     </div>

    //     {/* Phone */}
    //     <div className="space-y-2">
    //       <Label htmlFor="phone" className="flex items-center space-x-2">
    //         <Phone className="w-4 h-4" />
    //         <span>Telefone (Opcional)</span>
    //       </Label>
    //       <Input
    //         id="phone"
    //         type="tel"
    //         // value={formData.phone}
    //         // onChange={(e) => handleChange("phone", e.target.value)}
    //         placeholder="+1 (555) 123-4567"
    //       />
    //     </div>

    //     {/* Service */}
    //     <div className="space-y-2">
    //       <Label className="flex items-center space-x-2">
    //         <Scissors className="w-4 h-4" />
    //         <span>Serviço *</span>
    //       </Label>
    //       <Select
    //       // value={formData.service}
    //       // onValueChange={(value) => handleChange("service", value)}
    //       >
    //         <SelectTrigger>
    //           <SelectValue placeholder="Selecione um serviço" />
    //         </SelectTrigger>
    //         <SelectContent></SelectContent>
    //       </Select>
    //     </div>

    //     {/* Date and Time */}
    //     <div className="grid grid-cols-2 gap-4">
    //       <div className="space-y-2">
    //         <Label htmlFor="date">Data *</Label>
    //         <Input
    //           id="date"
    //           type="date"
    //           // value={formData.date}
    //           // onChange={(e) => handleChange("date", e.target.value)}
    //           required
    //         />
    //       </div>
    //       <div className="space-y-2">
    //         <Label className="flex items-center space-x-2">
    //           <Clock className="w-4 h-4" />
    //           <span>Horário *</span>
    //         </Label>
    //         <Select
    //         // value={formData.time}
    //         // onValueChange={(value) => handleChange("time", value)}
    //         >
    //           <SelectTrigger>
    //             <SelectValue placeholder="Selecione o horário" />
    //           </SelectTrigger>
    //           <SelectContent></SelectContent>
    //         </Select>
    //       </div>
    //     </div>

    //     {/* Barber */}
    //     <div className="space-y-2">
    //       <Label>Barbeiro</Label>
    //       <Input
    //       // value={formData.barber}
    //       // onChange={(e) => handleChange("barber", e.target.value)}
    //       // placeholder="Nome do barbeiro"
    //       />
    //     </div>

    //     {/* Observation */}
    //     <div className="space-y-2">
    //       <Label htmlFor="observation" className="flex items-center space-x-2">
    //         <FileText className="w-4 h-4" />
    //         <span>Observação (Opcional)</span>
    //       </Label>
    //       <Textarea
    //         id="observation"
    //         // value={formData.observation}
    //         // onChange={(e) => handleChange("observation", e.target.value)}
    //         placeholder="Observações especiais ou preferências..."
    //         rows={3}
    //       />
    //     </div>

    //     {/* Actions */}
    //     <div className="flex justify-end space-x-3 pt-4">
    //       <Button type="button" variant="outline" onClick={onClose}>
    //         Cancelar
    //       </Button>
    //       <Button type="submit">Agendar Horário</Button>
    //     </div>
    //   </DialogContent>
    // </Dialog>;
  } else {
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
          <div className="space-y-2">
            <Label htmlFor="clientName" className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>Nome do Cliente *</span>
            </Label>
            <Input
              id="clientName"
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
            
          </div>

          {/* Service */}
          <div className="space-y-2">
            <Label className="flex items-center space-x-2">
              <Scissors className="w-4 h-4" />
              <span>Serviço *</span>
            </Label>
            <Select
            // value={formData.service}
            // onValueChange={(value) => handleChange("service", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um serviço" />
              </SelectTrigger>
              <SelectContent></SelectContent>
            </Select>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Data *</Label>
              <Input
                id="date"
                type="date"
                // value={formData.date}
                // onChange={(e) => handleChange("date", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>Horário *</span>
              </Label>
              <Select
              // value={formData.time}
              // onValueChange={(value) => handleChange("time", value)}
              >
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
            <Label
              htmlFor="observation"
              className="flex items-center space-x-2"
            >
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
}
