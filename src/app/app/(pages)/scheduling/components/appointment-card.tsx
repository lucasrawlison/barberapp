"use client";

import { useState } from "react";
import {
  Clock,
  User,
  Scissors,
  FileText,
  MoreHorizontal,
  Check,
  X,
  Edit,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import formatarTelefone from "@/app/app/utils/formatarTelefone";
import Link from "next/link";
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

interface AppointmentCardProps {
  scheduling: Scheduling;
}

export function AppointmentCard({ scheduling }: AppointmentCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pendente":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "atendido":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelado":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "atendido":
        return <Check className="w-3 h-3" />;
      case "cancelado":
        return <X className="w-3 h-3" />;
      default:
        return <Clock className="w-3 h-3" />;
    }
  };

  return (
    <Card
      key={scheduling.id}
      className={`transition-all duration-200 hover:shadow-md ${
        scheduling.status === "cancelado" ? "opacity-75" : ""
      }`}
    >
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row items-center justify-between">
          <div className="w-full mb-4 sm:mb-0 sm:w-max flex items-center space-x-4 flex-1">
            {/* Time */}
            <div className="flex items-center space-x-2 min-w-0">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">{scheduling.time}</p>
                <p className="text-xs text-gray-500">
                  {new Date(`${scheduling.date}`).toLocaleString("pt-br", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
                  
            {/* Client Info */}
            <div className="flex-1 min-w-0 ">
              <div className="flex items-center space-x-2 mb-1">
                <User className="w-4 h-4 text-gray-400" />
                <p className="font-medium text-gray-900 truncate">
                  {scheduling.customer?.name}
                </p>
              </div>
              <div className="flex items-center space-x-2 mb-1">
                {scheduling.servicesTypes?.map((type) => (
                  <div key={type.id} className="flex gap-1">
                    <Scissors className="w-4 h-4 text-gray-400" />
                    <p className="text-sm text-gray-600 truncate">
                      {type.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className=" w-full sm:w-max grid items-center justify-items-end sm:justify-items-end grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-flow-col gap-1 lg:gap-2">
            <Badge
              className={`${getStatusColor(
                scheduling.status
              )} hover:cursor-default hover:bg-black/15 flex items-center space-x-1 h-6 justify-center`}
            >
              {getStatusIcon(scheduling.status)}
              <span className="capitalize">{scheduling.status}</span>
            </Badge>

            {scheduling.status === "pendente" ||
              (scheduling.status === "agendado" && (
                <Button
                  size="sm"
                  onClick={() => console.log("Mudar status")}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Check className="w-4 h-4 mr-1" />
                  Marcar Atendido
                </Button>
              ))}

            <DropdownMenu>
              <DropdownMenuTrigger asChild className="w-10">
                <Button variant="outline" size="sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Edit className="w-4 h-4 mr-2" />
                  Editar Agendamento
                </DropdownMenuItem>
                {scheduling.status !== "atendido" && (
                  <DropdownMenuItem onClick={() => console.log("Mudar status")}>
                    <Check className="w-4 h-4 mr-2" />
                    Marcar como Atendido
                  </DropdownMenuItem>
                )}
                {scheduling.status !== "atendido" && (
                  <DropdownMenuItem
                    onClick={() => console.log("Mudar status")}
                    className="text-red-600"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancelar Agendamento
                  </DropdownMenuItem>
                )}
                {scheduling.status !== "pendente" && (
                  <DropdownMenuItem onClick={() => console.log("Mudar status")}>
                    <Clock className="w-4 h-4 mr-2" />
                    Marcar como Pendente
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Phone number (if expanded or always visible) */}
        {scheduling.customer?.phone && (
          <div className=" flex  gap-4  items-center mt-3 pt-3 border-t border-gray-100">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Telefone:</span>{" "}
              {formatarTelefone(scheduling.customer?.phone)}
            </p>
            <Link
              target="_blank"
              className=" group flex flex-row w-max gap-2 px-2 py-1.5 rounded-md items-center justify-center bg-green-700 text-green-200 text-center text-[10px]"
              href={"http://wa.me/55" + scheduling.customer.phone}
            >
              Whatsapp
              <Send className="group-hover:animate-bounce" size={10} />
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
