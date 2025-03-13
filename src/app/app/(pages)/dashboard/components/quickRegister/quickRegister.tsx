"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
// import { Label } from "@/components/ui/label";
import { LoaderCircle, NotebookPen } from "lucide-react";
// import { useState } from "react";
import { CardData } from "./cardData";
import { useEffect, useState } from "react";
import axios from "axios";

interface Service {
  id: string,
  name: string,
  value: number
}
export function QuickRegister () {
    const [services, setServices] = useState<Service[]>([])
    const [paymentMethods, setPaymentMethods] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [isSaved, setIsSaved] = useState(false)

    const getServices = async () => {
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
      getServices();
    }, []);

    return (
      <Dialog onOpenChange={()=> setIsSaved(false)}>
        <DialogTrigger asChild>
          <Card className="hover:cursor-pointer h-36 hover:bg-slate-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="w-full text-center text-sm font-medium">
                Registrar Serviço
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center mt-3 flex-row items-center space-x-2">
                <div></div>
                <NotebookPen className="text-sky-800" />
              </div>
            </CardContent>
          </Card>
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
                <DialogTitle>Registrar Serviço</DialogTitle>
                <DialogDescription></DialogDescription>
              </DialogHeader>
              <CardData 
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