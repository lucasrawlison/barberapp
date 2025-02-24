"use client"

import * as React from "react"
import { ChevronLeftIcon, ChevronRightIcon, ChevronsLeft, ChevronsRight } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import axios from "axios"
import { useSession } from "next-auth/react"

interface Service  {
    id: string,
    code: number,
    value: number,
    createdAt: Date

}

const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(price)
}

interface Service {
  id: string,
  value: number,
  createdAt: Date
}

export function ServicesList() {
  const [isLoading, setIsLoading] = useState(false)
  const [services, setServices] = useState<Service[]>([])
  const {data: session} = useSession();

  useEffect(() => {
    const getServices = async () => {
      try {
        setIsLoading(true)
        const response = await axios.post("/api/getUserServices",{
          userId: session?.user?.id
        } );
        
        const { services } = response.data;
        console.log(response)
        setServices(services);
        setIsLoading(false)
      } catch (error) {
        console.log(error)
      }
    };

    getServices();
  }, [session]);

  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(services.length / itemsPerPage);

  const currentServices = React.useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return services.slice(start, end);
  }, [currentPage, services]);

  const handleConvertDate = (date: string) => {
    const newDate = new Date(date);
    
    const formattedDate = newDate.toLocaleString('pt-BR', {
      hour12: false,
  });
  
    return formattedDate;
};

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className=" text-center">Código</TableHead>
              <TableHead className=" text-center">Preço</TableHead>
              <TableHead className=" text-center">Data</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
          {isLoading ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center">Carregando...</TableCell>
              </TableRow>
            ) : (
              currentServices.map((service) => (
                <TableRow key={service.id}>
                  <TableCell className="font-medium text-center">{service.code}</TableCell>
                  <TableCell className=" text-center">{formatPrice(service.value)}</TableCell>
                  <TableCell className=" text-center">
                    {handleConvertDate(service.createdAt.toString()).toString()}
                    </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-center space-x-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setCurrentPage(1)}
          disabled={currentPage === 1}
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setCurrentPage((current) => Math.max(1, current - 1))}
          disabled={currentPage === 1}
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </Button>
        <span className="text-sm font-medium">
          Página {currentPage} de {totalPages}
        </span>
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentPage((current) => Math.min(totalPages, current + 1))
          }
          disabled={currentPage === totalPages}
        >
          <ChevronRightIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setCurrentPage(totalPages)}
          disabled={currentPage === totalPages}
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

