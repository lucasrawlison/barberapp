"use client"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
// import { Label } from "@/components/ui/label";
import { LoaderCircle } from "lucide-react";
// import { useState } from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { RegisterCardData } from "./registerCardData";
import { Button } from "@/components/ui/button";

interface Service {
  id: string,
  name: string,
  value: number
}

interface QuickRegisterProps {
  getServices: () => void;
}

export function QuickRegister ({getServices} : QuickRegisterProps)  {
    const [services, setServices] = useState<Service[]>([])
    const [paymentMethods, setPaymentMethods] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [isSaved, setIsSaved] = useState(false)

    const getServicesTypes = async () => {
      try {
        setIsLoading(true)
        const response = await axios.post("/api/getServicesTypes");
        const { servicesTypes } = response.data;
        setServices(servicesTypes);
        setIsLoading(false)
      } catch (error) {
        console.log(error)
        setIsLoading(false)
      }
    };

    const getPaymentMethods = async () => {
      try {
        setIsLoading(true)
        
        const response = await axios.post("/api/getPaymentMethods");
        const { paymentMethods } = response.data;
        setPaymentMethods(paymentMethods);
        setIsLoading(false)
      } catch (error) {
        console.log(error)
        setIsLoading(false)
      }
    }
    useEffect(() => {
      getPaymentMethods();
      getServicesTypes();
    }, []);

    return (
      <Dialog onOpenChange={()=> setIsSaved(false)}>
        <DialogTrigger asChild>
          <Button size="sm">Novo Serviço</Button>
        </DialogTrigger>
        <DialogContent className=" min-h-96">
          {isLoading ? (
            <div className="w-full h-full flex items-center justify-center">
              <DialogHeader>
                <DialogTitle></DialogTitle>
                <DialogDescription></DialogDescription>
              </DialogHeader>
              <LoaderCircle className=" animate-spin" />
            </div>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className="text-left">Serviço</DialogTitle>
                <DialogDescription className="text-left">Prencha os campos para registrar um serviço</DialogDescription>
              </DialogHeader>
              <RegisterCardData
              getServices={getServices}
              isSaved={isSaved}
              setIsSaved={setIsSaved}
              services={services} 
              paymentMethods={paymentMethods}
              />
            </>
          )}
        </DialogContent>
      </Dialog>
    );
}