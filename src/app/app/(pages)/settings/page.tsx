import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger,  } from "@/components/ui/tabs";
import { Scissors, Palette, Bell, Lock, Save} from "lucide-react";
// import { User, CreditCard} from "lucide-react";

export default function SettingsPage () {
    return(
        <main className="p-6 overflow-auto">
        <Tabs defaultValue="business" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 h-auto">
            {/* <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden md:inline">Perfil</span>
            </TabsTrigger> */}
            <TabsTrigger value="business" className="flex items-center gap-2">
              <Scissors className="h-4 w-4" />
              <span className="hidden md:inline">Barbearia</span>
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              <span className="hidden md:inline">Aparência</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden md:inline">Notificações</span>
            </TabsTrigger>
            {/* <TabsTrigger value="billing" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              <span className="hidden md:inline">Pagamentos</span>
            </TabsTrigger> */}
            {/* <TabsTrigger value="security" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              <span className="hidden md:inline">Segurança</span>
            </TabsTrigger> */}
          </TabsList>

          {/* Profile Settings */}
          {/* <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações do Perfil</CardTitle>
                <CardDescription>Atualize suas informações pessoais e de contato.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex flex-col items-center gap-4">
                    <Avatar className="h-24 w-24">
                      <AvatarImage
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-GtZa0JJezcJn95qVreceNc8MDhmHVC.png"
                        alt="Lucas Rawlison"
                      />
                      <AvatarFallback>LR</AvatarFallback>
                    </Avatar>
                    <Button variant="outline" size="sm">
                      Alterar foto
                    </Button>
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nome</Label>
                        <Input id="name" defaultValue="Lucas" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="surname">Sobrenome</Label>
                        <Input id="surname" defaultValue="Rawlison" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" defaultValue="lucas@agilebarber.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefone</Label>
                      <Input id="phone" defaultValue="(11) 98765-4321" />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Salvar alterações
                </Button>
              </CardFooter>
            </Card>
          </TabsContent> */}

          {/* Business Settings */}
          <TabsContent value="business" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações da Barbearia</CardTitle>
                <CardDescription>Configure as informações da sua barbearia.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="business-name">Nome da Barbearia</Label>
                    <Input id="business-name" defaultValue="Agile Barber" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="business-description">Descrição</Label>
                    {/* <Textarea
                      id="business-description"
                      defaultValue="Barbearia moderna com serviços de alta qualidade."
                      rows={3}
                    /> */}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="business-phone">Telefone</Label>
                      <Input id="business-phone" defaultValue="(11) 3456-7890" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="business-email">Email</Label>
                      <Input id="business-email" type="email" defaultValue="contato@agilebarber.com" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="business-address">Endereço</Label>
                    <Input id="business-address" defaultValue="Rua das Tesouras, 123" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="business-city">Cidade</Label>
                      <Input id="business-city" defaultValue="São Paulo" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="business-state">Estado</Label>
                      <Input id="business-state" defaultValue="SP" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="business-zip">CEP</Label>
                      <Input id="business-zip" defaultValue="01234-567" />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Horário de Funcionamento</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="business-hours-weekday">Segunda a Sexta</Label>
                      <Input id="business-hours-weekday" defaultValue="09:00 - 19:00" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="business-hours-weekend">Sábado</Label>
                      <Input id="business-hours-weekend" defaultValue="09:00 - 17:00" />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="closed-sunday" defaultChecked />
                    <Label htmlFor="closed-sunday">Fechado aos domingos</Label>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Salvar alterações
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Appearance Settings */}
          <TabsContent value="appearance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Aparência</CardTitle>
                <CardDescription>Personalize a aparência do aplicativo.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Tema</Label>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <input type="radio" id="theme-light" name="theme" defaultChecked />
                        <Label htmlFor="theme-light">Claro</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="radio" id="theme-dark" name="theme" />
                        <Label htmlFor="theme-dark">Escuro</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="radio" id="theme-system" name="theme" />
                        <Label htmlFor="theme-system">Sistema</Label>
                      </div>
                    </div>
                  </div>

                  {/* <div className="space-y-2">
                    <Label>Cor Principal</Label>
                    <div className="grid grid-cols-6 gap-2">
                      {["#0ea5e9", "#8b5cf6", "#22c55e", "#ef4444", "#f59e0b", "#64748b"].map((color, index) => (
                        <div
                          key={index}
                          className="h-10 w-10 rounded-full cursor-pointer border-2 border-transparent hover:border-primary"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div> */}
{/* 
                  <div className="space-y-2">
                    <Label htmlFor="font-size">Tamanho da Fonte</Label>
                    <Select defaultValue="medium">
                      <SelectTrigger id="font-size">
                        <SelectValue placeholder="Selecione o tamanho da fonte" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Pequeno</SelectItem>
                        <SelectItem value="medium">Médio</SelectItem>
                        <SelectItem value="large">Grande</SelectItem>
                      </SelectContent>
                    </Select>
                  </div> */}

                  {/* <div className="flex items-center space-x-2">
                    <Switch id="animations" defaultChecked />
                    <Label htmlFor="animations">Ativar animações</Label>
                  </div>*/}
                </div> 
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Salvar alterações
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Notifications Settings */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notificações</CardTitle>
                <CardDescription>Configure como e quando você recebe notificações.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Notificações por Email</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="email-appointments">Novos agendamentos</Label>
                        <p className="text-sm text-muted-foreground">
                          Receba emails quando um cliente agendar um serviço
                        </p>
                      </div>
                      <Switch id="email-appointments" defaultChecked />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="email-cancellations">Cancelamentos</Label>
                        <p className="text-sm text-muted-foreground">
                          Receba emails quando um cliente cancelar um agendamento
                        </p>
                      </div>
                      <Switch id="email-cancellations" defaultChecked />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="email-reminders">Lembretes</Label>
                        <p className="text-sm text-muted-foreground">
                          Receba lembretes diários dos agendamentos do dia
                        </p>
                      </div>
                      <Switch id="email-reminders" defaultChecked />
                    </div>
                  </div>

                  <Separator />

                  <h3 className="text-lg font-medium">Notificações por SMS</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="sms-appointments">Novos agendamentos</Label>
                        <p className="text-sm text-muted-foreground">
                          Receba SMS quando um cliente agendar um serviço
                        </p>
                      </div>
                      <Switch id="sms-appointments" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="sms-cancellations">Cancelamentos</Label>
                        <p className="text-sm text-muted-foreground">
                          Receba SMS quando um cliente cancelar um agendamento
                        </p>
                      </div>
                      <Switch id="sms-cancellations" />
                    </div>
                  </div>

                  <Separator />

                  <h3 className="text-lg font-medium">Notificações no Aplicativo</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="app-all">Todas as notificações</Label>
                        <p className="text-sm text-muted-foreground">Ativar todas as notificações no aplicativo</p>
                      </div>
                      <Switch id="app-all" defaultChecked />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Salvar alterações
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Billing Settings */}
          {/* <TabsContent value="billing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pagamentos</CardTitle>
                <CardDescription>Gerencie suas informações de pagamento e assinatura.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Plano Profissional</h3>
                        <p className="text-sm text-muted-foreground">R$ 99,90/mês</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Alterar plano
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  <h3 className="text-lg font-medium">Método de Pagamento</h3>
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CreditCard className="h-5 w-5" />
                        <div>
                          <p className="font-medium">Cartão de crédito</p>
                          <p className="text-sm text-muted-foreground">Visa terminando em 4242</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        Editar
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="billing-email">Email para fatura</Label>
                    <Input id="billing-email" type="email" defaultValue="financeiro@agilebarber.com" />
                  </div>

                  <Separator />

                  <h3 className="text-lg font-medium">Histórico de Pagamentos</h3>
                  <div className="space-y-2">
                    {[
                      { date: "01/05/2023", amount: "R$ 99,90", status: "Pago" },
                      { date: "01/04/2023", amount: "R$ 99,90", status: "Pago" },
                      { date: "01/03/2023", amount: "R$ 99,90", status: "Pago" },
                    ].map((invoice, index) => (
                      <div key={index} className="flex items-center justify-between rounded-lg border p-3">
                        <div>
                          <p className="font-medium">{invoice.date}</p>
                          <p className="text-sm text-muted-foreground">{invoice.amount}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-green-600 font-medium">{invoice.status}</span>
                          <Button variant="ghost" size="sm">
                            Ver
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Salvar alterações
                </Button>
              </CardFooter>
            </Card>
          </TabsContent> */}

          {/* Security Settings */}
          {/* <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Segurança</CardTitle>
                <CardDescription>Gerencie suas configurações de segurança e privacidade.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Alterar Senha</h3>
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Senha Atual</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">Nova Senha</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                  <Button className="w-full sm:w-auto">Atualizar senha</Button>

                  <Separator />

                  <h3 className="text-lg font-medium">Autenticação de Dois Fatores</h3>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="2fa">Ativar autenticação de dois fatores</Label>
                      <p className="text-sm text-muted-foreground">
                        Adicione uma camada extra de segurança à sua conta
                      </p>
                    </div>
                    <Switch id="2fa" />
                  </div>

                 
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Salvar alterações
                </Button>
              </CardFooter>
            </Card>
          </TabsContent> */}
        </Tabs>
      </main>
    )
}