"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { NotebookPen } from "lucide-react";
import { useState } from "react";
import { CardData } from "./cardData";

export function QuickRegister () {

    const [isLoadin, setIsLoading] = useState(false)


    return (
      <Dialog>
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar Serviço</DialogTitle>
            <DialogDescription>
            </DialogDescription>
          </DialogHeader>
          <CardData/>
        </DialogContent>
      </Dialog>
    );
}