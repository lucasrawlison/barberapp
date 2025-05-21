"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ListChecks, Radio, Settings, Users } from "lucide-react";
import { QuickRegister } from "./components/quickRegister/quickRegister";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
  const options = [
    {
      name: "Meus serviços",
      description: "Visualize e gerencie seus serviços",
      link: "/app/services",
      icon: <ListChecks className="h-10 w-10 text-primary" />,
      bg: "bg-green-800/20",
    },
    {
      name: "Cadastro e visualização de Clientes",
      description: "Gerencie sua base de clientes",
      link: "/app/customers",
      icon: <Users className="h-10 w-10 text-primary" />,
      bg: "bg-orange-800/20",
    },
    {
      name: "Edite Configurações do Aplicativo",
      description: "Personalize o sistema conforme suas necessidades",
      link: "/app/settings",
      icon: <Settings className="h-10 w-10 text-primary" />,
      bg: "bg-green-800/20",
    },
  ];

  const [wppStatus, setWppStatus] = useState<string | undefined>(undefined);
  const url = process.env.NEXT_PUBLIC_WPPSERVER_URL

   useEffect(() => {
    const check = async () => {
      console.log("Verificando status do servidor de mensagem")
      if(url){
        console.log(url)
        try {
          const res = await axios.get(url);
          if(res.status === 200){
            setWppStatus("Online")
          }
        } catch {
            setWppStatus("Offline")
        }
      }else{
        setWppStatus("NO URL")
      }
    };

    check();
    const interval = setInterval(check, 5000); // 
    return () => clearInterval(interval);
  }, []);
    

  return (
    <main className="p-6 overflow-auto">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <QuickRegister />
        {options.map((option) => (
          <ShortcutCard
            bg={option.bg}
            key={option.name}
            title={option.name}
            description={option.description}
            icon={option.icon}
            link={option.link}
          />
        ))}
      </div>
      <div className="mt-8 grid">
        <Card>
          <CardHeader>
            <CardTitle>Servidores / APIs</CardTitle>
            <CardDescription>
              Verifique os Status de Servidores e APIs{" "}
            </CardDescription>
            <CardContent className="p-0 gap-4 grid md:grid-cols-2 lg:grid-cols-4 items-center pt-3">
              <Card className="">
                <CardContent className="p-0 flex items-center">
                  <div className="p-4 flex flex-row items-center justify-center gap-3">
                    <div className="flex items-center justify-center flex-col">
                      <div className="flex flex-col animate-pulse justify-center items-center">
                        <Radio
                          className={`size-5 animate-pulse ${wppStatus === "Online" ?"text-green-600": "text-red-600" } `}
                        />
                        <span className={`rounded-sm text-[8px] ${wppStatus === "Online" ?"text-green-600": "text-red-600"}`}>
                          {wppStatus?.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-center flex-col">
                      <Label className="text-primary text-xs">
                        Servidor de Mensagens
                      </Label>
                      <span className="text-primary/60 text-xs text-nowrap overflow-hidden max-w-[120px]">
                        https://attended-occupation-restricted-traditions.trycloudflare.com/send-message
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              {/* <Card className="">
                <CardContent className="p-0 flex items-center justify-center">
                  <div className="p-4 flex flex-row items-center justify-center gap-3">
                    <div className="flex items-center justify-center flex-col">
                      <div className="flex flex-col animate-pulse justify-center items-center">
                        <Radio className="size-5 animate-pulse text-green-600" />
                        <span className="rounded-sm text-[8px] text-green-600 ">
                          OPERANDO
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-center flex-col">
                      <Label className="text-primary text-xs">
                        Servidor de tempo real
                      </Label>
                      <span className="text-primary/60 text-xs">
                        http://api.figo.com.br
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card> */}
            </CardContent>
          </CardHeader>
        </Card>
      </div>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Próximos Agendamentos</CardTitle>
            <CardDescription>
              Visualize os próximos clientes agendados
            </CardDescription>
          </CardHeader>
          <CardContent className="overflow-auto max-h-[260px] min-h-[260px]">
            <div className="space-y-4">
              <div className="flex items-center gap-4 rounded-lg border p-3">
                <Avatar>
                  <AvatarFallback>C</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium">Cliente </p>
                  <p className="text-sm text-muted-foreground">Corte + Barba</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">14:3</p>
                  <p className="text-xs text-muted-foreground">Hoje</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resumo Financeiro</CardTitle>
            <CardDescription>Visão geral das suas finanças</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg border p-3">
                <p className="text-sm font-medium text-muted-foreground">
                  Hoje
                </p>
                <p className="text-2xl font-bold">-</p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-sm font-medium text-muted-foreground">
                  Esta Semana
                </p>
                <p className="text-2xl font-bold">-</p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-sm font-medium text-muted-foreground">
                  Este Mês
                </p>
                <p className="text-2xl font-bold">-</p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-sm font-medium text-muted-foreground">
                  Média Diária
                </p>
                <p className="text-2xl font-bold">-</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

function ShortcutCard({
  title,
  description,
  icon,
  link,
  bg,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
  bg: string;
}) {
  return (
    <Link href={link}>
      <Card className="overflow-hidden group transition-all hover:shadow-md h-[200px]">
        <CardContent className="p-6">
          <div className="flex flex-col items-center text-center gap-4">
            <div
              className={`rounded-full ${bg} p-3 transition-transform group-hover:scale-110 `}
            >
              {icon}
            </div>
            <div className="space-y-1">
              <h3 className="font-medium">{title}</h3>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
