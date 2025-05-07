"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ListChecks, Settings, Users } from "lucide-react";
import { QuickRegister } from "./components/quickRegister/quickRegister";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

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
      link: "",
      icon: <Settings className="h-10 w-10 text-primary" />,
      bg: "bg-green-800/20",
    },
  ];

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
