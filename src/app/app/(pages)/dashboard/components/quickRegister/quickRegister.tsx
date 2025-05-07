"use client";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
// import { Label } from "@/components/ui/label";
import { ClipboardEdit, LoaderCircle } from "lucide-react";
// import { useState } from "react";
import { CardData } from "./cardData";
import { useEffect, useState } from "react";
import axios from "axios";

interface Service {
  id: string;
  name: string;
  value: number;
}
export function QuickRegister() {
  const [services, setServices] = useState<Service[]>([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const getServices = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post("/api/getServicesTypes");
      const { servicesTypes } = response.data;
      setServices(servicesTypes);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const getPaymentMethods = async () => {
    try {
      setIsLoading(true);

      const response = await axios.post("/api/getPaymentMethods");
      const { paymentMethods } = response.data;
      setPaymentMethods(paymentMethods);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getPaymentMethods();
    getServices();
  }, []);

  return (
    <Dialog onOpenChange={() => setIsSaved(false)}>
      <DialogTrigger asChild>
        <Card className="overflow-hidden group transition-all hover:shadow-md h-[200px]s hover:cursor-pointer">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="rounded-full bg-blue-800/20 p-3 transition-transform group-hover:scale-110">
                <ClipboardEdit className="h-10 w-10 text-primary" />
              </div>
              <div className="space-y-1">
                <h3 className="font-medium">Registrar Serviço</h3>
                <p className="text-sm text-muted-foreground">
                  Adicione um novo serviço ao sistema
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent className=" max-h-[650px] overflow-auto">
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
              <DialogDescription className="text-left">
                Prencha os campos para registrar um serviço
              </DialogDescription>
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
