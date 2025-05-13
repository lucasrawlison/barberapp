import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Check, LoaderCircle, Minus, Plus, User, UserSearch } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import ValueInput from "./valueInput";
import axios from "axios";
import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { toast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import DiscountInput from "./discountInput";
import { set } from "date-fns";

interface Type {
  id: string
  name: string
  value: number
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
  paymentMethodId: string
  customerId: string;
  paymentMethod: PaymentMethod
  transactions: Transaction[];
}

interface Transaction {
  id: string;
  description: string;
  service: Service | null
  value: number;
  date: string;
  type: string;
  category: string;
  paymentMethodId: string;
  paymentMethod: PaymentMethod;
}

interface BankAccount {
  id: string;
  bankName: string;
  initialValue: number;
  agency: string;
  accountNumber: string;
  accountType: string;
  accountOwner: string;
  transactions: Transaction[];
  paymentMethods: PaymentMethod[];
}

interface PaymentMethod {
  id: string;
  name: string;
  bankId: string;
  bankAccount: BankAccount;
  transactions: Transaction[];
}

interface ServiceType {
  id: string;
  name: string;
  value: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  login: string;
  profileType: string;
  profileImgLink: string;
}

interface NewTransactionProps {
  newTransaction: Transaction | undefined;
  setNewTransaction: (value: Transaction | undefined) => void;
  paymentMethods: PaymentMethod[];
  fetchTransactions: (value: number) => void;
  servicesTypes: ServiceType[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  selectedTransaction: Transaction | undefined;
  setSelectedTransaction: (value: Transaction | undefined) => void;
}

export function NewTransaction({
  paymentMethods,
  newTransaction,
  setNewTransaction,
  fetchTransactions,
  servicesTypes,
  pagination,
  selectedTransaction,
  setSelectedTransaction
}: NewTransactionProps) {
  const [isSaving, setIsSaving] = useState(false);
  const { data: session } = useSession();
  const [selects, setSelects] = useState<ServiceType[]>([
    {
      id: "",
      name: "Selecione",
      value: 0,
    },
  ]);
  // const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>();
  const [isLoadingUsers, setIsloadingUsers] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [servicesTotalValue, setServicesTotalValue] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  

  const eraseData = () => {
    if(isModalOpen){

      setIsModalOpen(!isModalOpen);
      setSelectedTransaction(undefined);
      setNewTransaction(
        {
          id: "",
          description: "",
          value: 0,
          date: "",
          type: "",
          category: "",
          paymentMethodId: "",
          paymentMethod: {
            id: "",
            name: "",
            bankAccount: {
              id: "",
              bankName: "",
              initialValue: 0,
              agency: "",
              accountNumber: "",
              accountType: "",
              accountOwner: "",
              transactions: [],
              paymentMethods: [],
            },
            bankId: "",
            transactions: [],
            
          },
service: null
        }
      );
      setSelects([
        {
          id: "",
          name: "Selecione",
          value: 0,
        },
      ]);
      setIsSaved(false)
    }
  };

  const handleServiceValues = () => {
    const total = selects.reduce((soma, service) => soma + service.value, 0);
    setServicesTotalValue(total);
  };

  const handleAddSelect = () => {
    if (selectedTransaction?.service) {
      const currentServiceTypes = selectedTransaction?.service?.servicesTypes;
      currentServiceTypes?.push({
        id: "",
        name: "Selecione",
        value: 0,
      });
      setSelectedTransaction({
        ...selectedTransaction,
        service: {
          ...selectedTransaction?.service,
          servicesTypes: currentServiceTypes,
        },
      });
    }

    if(newTransaction){

      setSelects((prev) => [...prev, { id: "", name: "Selecione", value: 0 }]);
    }
  };

  const handelRemoveSelect = (i: number) => {
    setSelects((prev) => prev.filter((_, index) => index !== i));
  };

  const handleGetUsers = async () => {
    if (!isOpen) {
      setIsOpen(true);
    }

    setIsloadingUsers(true);

    try {
      const response = await axios.post("/api/getUsers");
      if (response) {
        setUsers(response.data.users);
        setIsloadingUsers(false);
      }
    } catch (error) {
      setIsloadingUsers(false);
      console.log(error);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if(selectedTransaction){

      const { name, value } = e.target;
      setSelectedTransaction({
        ...selectedTransaction,
        [name]:
          name === "value"
            ? parseFloat(value.replace(/[^\d,]/g, "").replace(",", ".")) || 0
            : value,
      });
    }
    if(newTransaction){

      const { name, value } = e.target;
      setNewTransaction({
        ...newTransaction,
        [name]:
          name === "value"
            ? parseFloat(value.replace(/[^\d,]/g, "").replace(",", ".")) || 0
            : value,
      });
    }
  };

  useEffect(() => {
    console.log(newTransaction);
  }, [newTransaction]);

  const handleSaveTransaction = async () => {
    if (!newTransaction) return;
    setIsSaving(true);
    if (
      newTransaction.type === "Receita" &&
      newTransaction.category === "Serviço"
    ) {
      console.log("é serviço")
      try {
        const response = await axios.post("/api/createService", {
          value: servicesTotalValue,
          userId: selectedUser?.id,
          selectedServices: selects,
          paymentMethodId: newTransaction.paymentMethodId,
          date: newTransaction.date
        });

        if (response) {
          console.log(response);
          fetchTransactions(pagination.page);
          setIsSaving(false);
          setIsSaved(true)

        }
      } catch (error) {
        console.log(error);
        setIsSaving(false);
      }
    } else {
      try {
        const response = await axios.post(
          "/api/createTransaction",
          {
            newTransaction: newTransaction,
            userId: session?.user?.id,
            selectedService: selects,
            selectedUser,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response) {
          console.log(response);
          fetchTransactions(1);
          setIsSaving(false);
          setIsSaved(true)
        
        }
      } catch (error) {
        console.log(error);
        setIsSaving(false);
      }
    }
  };

  const handleChangeUser = (
    e: React.MouseEvent<HTMLDivElement>,
    user: User
  ) => {
    console.log(user);
    setSelectedUser(user);
    setIsOpen(false);
  };

  const handleChangeSelect = (index: number, serviceId: string) => {
    // console.log(index, serviceId);
    // Encontrar o objeto completo do serviço selecionado
    const selectedService = servicesTypes.find((s) => s.id === serviceId);

    if (selectedService) {
      if(selectedTransaction && selectedTransaction.service){
        const updatedServices = selectedTransaction.service?.servicesTypes;
        updatedServices[index] = selectedService;
        setSelectedTransaction({
          ...selectedTransaction,
          service: {
            ...selectedTransaction.service,
            servicesTypes: updatedServices,
          },
        });
      }
      setSelects((prev) => {
        const updatedServices = [...prev];
        updatedServices[index] = selectedService;
        return updatedServices;
      });


    }
  };

  const handleDeleteTransaction = async () => {
    if (!selectedTransaction) return;
    setIsSaving(true);
    try {
      const response = await axios.post("/api/deleteTransaction", {
        id: selectedTransaction.id,
      });
      if (response.status === 200) {
        toast({
          title: "Transação deletada com sucesso",
          description: "A transação foi deletada com sucesso",
          variant: "default",
          duration: 3000,
        });
        setIsModalOpen(false);
        setSelectedTransaction(undefined);
        fetchTransactions(pagination.page);
        setIsSaving(false);
      }
    } catch (error) {
      console.log(error);
      setIsSaving(false);
    }
  }

  useEffect(() => {
    handleServiceValues();
  }, [selects, handleServiceValues]);

  useEffect(() => {
    console.log(selects);
  }, [selects]);

  useEffect(()=> {
    if(selectedTransaction){
      setIsModalOpen(true)

      if(selectedTransaction.service){
        const total =
          selectedTransaction.service?.servicesTypes.reduce((acc, service) => {
            return acc + service.value;
          }, 0);
        setServicesTotalValue(total)
      }
    }
  }, [selectedTransaction])

  const handleSetDesconto =(value: number) => {
    if(selectedTransaction?.service){

      setSelectedTransaction({
        ...selectedTransaction,
        service:{
          ...selectedTransaction.service,
          discount: value
        }
        
      })
    }
  }

  const handleConvertDate = useCallback((date: string) => {
  const newDate = new Date(date);

  const year = newDate.getFullYear();
  const month = String(newDate.getMonth() + 1).padStart(2, '0'); // mês começa em 0
  const day = String(newDate.getDate()).padStart(2, '0'); // dia do mês

  const hours = String(newDate.getHours()).padStart(2, '0');
  const minutes = String(newDate.getMinutes()).padStart(2, '0');

  const formatted = `${year}-${month}-${day}T${hours}:${minutes}`;
  return formatted;
}, []);



  if(selectedTransaction){
    return (
      <Dialog onOpenChange={() => eraseData()} open={isModalOpen}>
        <DialogTrigger onClick={() => setIsModalOpen(true)} asChild>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nova transação
          </Button>
        </DialogTrigger>
        <DialogContent className="max-h-[600px] sm:max-h-screen overflow-auto portr ">
          <DialogHeader>
            <DialogTitle>{selectedTransaction.description}</DialogTitle>
            <DialogDescription>
              Insira os detalhes da nova transação abaixo.
            </DialogDescription>
          </DialogHeader>
          <Label>Tipo de Transação</Label>
          <Select
            value={selectedTransaction.type}
            name="type"
            onValueChange={(value) =>
              setSelectedTransaction({ ...selectedTransaction, type: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem className=" hover: cursor-pointer" value="Receita">
                Receita
              </SelectItem>
              <SelectItem className=" hover: cursor-pointer" value="Despesa">
                Despesa
              </SelectItem>
            </SelectContent>
          </Select>

          <Label>Descrição</Label>
          <Input
            disabled={
              selectedTransaction.category === "Serviço" &&
              selectedTransaction.type === "Receita"
            }
            placeholder={
              selectedTransaction.category === "Serviço" &&
              selectedTransaction.type === "Receita"
                ? "Descrição gerada pelo serviço"
                : "Deixe uma descrição para a transação"
            }
            type="text"
            name="description"
            value={
              selectedTransaction.category === "Serviço" &&
              selectedTransaction.type === "Receita"
                ? "Descrição gerada pelo serviço"
                : selectedTransaction.description
            }
            onChange={handleChange}
          ></Input>
          <Label>Valor</Label>
          <ValueInput
            servicesTotalValue={selectedTransaction.service?.servicesTypes.reduce((acc, service) => {
            return acc + service.value;
          }, 0)}
            setNewTransaction={setNewTransaction}
            newTransaction={newTransaction}
            selectedTransaction={selectedTransaction}
          />

          {selectedTransaction.service && (
            <>
            <Label>Desconto</Label>
            <DiscountInput desconto={selectedTransaction.service.discount} setDesconto={handleSetDesconto}/>
            </>
          )}

          <Label htmlFor="date">Data</Label>
          <Input
          defaultValue={handleConvertDate(selectedTransaction.date)}
            onChange={handleChange}
            name="date"
            id="date"
            type="datetime-local"
          />
          <Label>Categoria</Label>
          <Select
            value={selectedTransaction.category}
            name="category"
            onValueChange={(value) =>
              setSelectedTransaction({ ...selectedTransaction, type: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem className=" hover: cursor-pointer" value="Produto">
                Produto
              </SelectItem>
              <SelectItem className=" hover: cursor-pointer" value="Serviço">
                Serviço
              </SelectItem>
              <SelectItem
                className=" hover: cursor-pointer"
                value="Suprimentos"
              >
                Suprimentos
              </SelectItem>
              <SelectItem className=" hover: cursor-pointer" value="Aluguel">
                Aluguel
              </SelectItem>
              <SelectItem className=" hover: cursor-pointer" value="Material">
                Material
              </SelectItem>

              <SelectItem className=" hover: cursor-pointer" value="Outros">
                Outros
              </SelectItem>
            </SelectContent>
          </Select>

          {selectedTransaction.category === "Serviço" &&
            selectedTransaction.type === "Receita" && (
              <>
                <Label>Serviço</Label>
                {selectedTransaction.service?.servicesTypes.map((select, i) => (
                  <div
                    key={i}
                    className="w-full flex flex-row items-center gap-3"
                  >
                    <Select
                    value={select.id}
                      onValueChange={(value) => handleChangeSelect(i, value)}
                    >
                      <SelectTrigger>
                        <SelectValue  placeholder={select.name + " - " + formatPrice(select.value)} />
                      </SelectTrigger>
                      <SelectContent>
                        {servicesTypes.map((serviceType) => (
                          <SelectItem
                            className="hover:cursor-pointer"
                            key={serviceType.id}
                            value={serviceType.id}
                          >
                            {serviceType.name +
                              " - " +
                              formatPrice(serviceType.value)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      className="rounded-full size-7 bg-red-700"
                      onClick={() => handelRemoveSelect(i)}
                    >
                      <Minus></Minus>
                    </Button>
                  </div>
                ))}
                <div className="flex w-full justify-center mb-8">
                  <Button
                    className="rounded-full size-8"
                    onClick={handleAddSelect}
                  >
                    <Plus />
                  </Button>
                </div>
                <Label>Responsável:</Label>
                <div className="w-full gap-3   flex flex-row justify-center items-center">
                  <Input
                    value={selectedUser?.name || ""}
                    name="user"
                    id="user"
                    type="text"
                    disabled
                    placeholder="Selecione um usuário"
                    className="hover:cursor-default text-xs"
                  />
                  <Dialog onOpenChange={() => setIsOpen(!isOpen)} open={isOpen}>
                    <DialogTrigger onClick={handleGetUsers} asChild>
                      <Button>
                        <UserSearch></UserSearch>
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Buscar</DialogTitle>
                        <DialogDescription>
                          Selecione um usuário para o serviço
                        </DialogDescription>
                      </DialogHeader>
                      <Input placeholder="Buscar"></Input>

                      <div className="rounded-md border">
                        {isLoadingUsers && (
                          <div className="h-1 bg-slate-400 w-full overflow-hidden relative">
                            <div className="w-1/2 bg-sky-500 h-full animate-slideIn absolute left-0 rounded-lg"></div>
                          </div>
                        )}
                      </div>
                      <div className="grid gap-3 grid-cols-3 overflow-auto min-h-[400px] items-center justify-center">
                        {users?.map((user) => (
                          <Card
                            key={user.id}
                            className=" hover:cursor-pointer hover:shadow-md  transition-all"
                            onClick={(e) => handleChangeUser(e, user)}
                          >
                            <CardHeader>
                              <CardTitle className="text-xs text-center">
                                {user.name}
                              </CardTitle>
                              <CardDescription className="text-center">
                                {user.profileType}
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="w-full flex items-center justify-center">
                                {user.profileImgLink ? (
                                  <Image
                                    className=" rounded-full"
                                    src={user.profileImgLink}
                                    alt={user.name}
                                    width={60}
                                    height={60}
                                  ></Image>
                                ) : (
                                  <User size={60}></User>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </>
            )}

          <Label>Método de pagamento</Label>
          <Select
            onValueChange={(value) =>
              setSelectedTransaction({
                ...selectedTransaction,
                paymentMethodId: value,
              })
            }
          >
            <SelectTrigger>
              <SelectValue
                placeholder={
                  selectedTransaction.paymentMethod.bankAccount.bankName +
                  " - " +
                  selectedTransaction.paymentMethod.name
                }
              ></SelectValue>
            </SelectTrigger>
            <SelectContent>
              {paymentMethods.map((paymentMethod) => (
                <SelectItem
                  key={paymentMethod.id}
                  className="hover: cursor-pointer"
                  value={paymentMethod.id}
                >
                  {paymentMethod.bankAccount.bankName +
                    " - " +
                    paymentMethod.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <DialogFooter>
            {isSaved ? (
              <Button disabled>
                Salvo <Check />
              </Button>
            ) : (
              <>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant={"destructive"}
                      disabled={isSaving}
                      
                    >
                      {isSaving ? (
                        <LoaderCircle className="animate-spin" />
                      ) : (
                        "Deletar Transação"
                      )}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Você realmente tem certeza?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta ação não pode ser desfeita. O registro de transação será deletado permanentemente.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteTransaction}>Continuar</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <Button disabled={isSaving}>
                  {isSaving ? (
                    <LoaderCircle className="animate-spin" />
                  ) : (
                    "Atualizar Transação"
                  )}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );

  }else{
    return (
      <Dialog onOpenChange={() => eraseData()} open={isModalOpen}>
        <DialogTrigger onClick={() => setIsModalOpen(true)} asChild>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nova transação
          </Button>
        </DialogTrigger>
        <DialogContent className="max-h-[600px] sm:max-h-screen overflow-auto portr ">
          <DialogHeader>
            <DialogTitle>Adicionar nova transação</DialogTitle>
            <DialogDescription>
              Insira os detalhes da nova transação abaixo.
            </DialogDescription>
          </DialogHeader>
          <Label>Tipo de Transação</Label>
          <Select
            value={newTransaction?.type}
            name="type"
            onValueChange={(value) =>{
if(!newTransaction)return
              setNewTransaction({ ...newTransaction, type: value })
            }
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem className=" hover: cursor-pointer" value="Receita">
                Receita
              </SelectItem>
              <SelectItem className=" hover: cursor-pointer" value="Despesa">
                Despesa
              </SelectItem>
            </SelectContent>
          </Select>
  
          <Label>Descrição</Label>
          <Input
            disabled={
              newTransaction?.category === "Serviço" &&
              newTransaction?.type === "Receita"
            }
            placeholder={
              newTransaction?.category === "Serviço" &&
              newTransaction?.type === "Receita"
                ? "Descrição gerada pelo serviço"
                : "Deixe uma descrição para a transação"
            }
            type="text"
            name="description"
            value={
              newTransaction?.category === "Serviço" &&
              newTransaction?.type === "Receita"
                ? "Descrição gerada pelo serviço"
                : newTransaction?.description
            }
            onChange={handleChange}
          ></Input>
          <Label>Valor</Label>
          <ValueInput
            servicesTotalValue={servicesTotalValue}
            setNewTransaction={setNewTransaction}
            newTransaction={newTransaction}
            selectedTransaction={undefined}
          />
  
          <Label htmlFor="date">Data</Label>
          <Input onChange={handleChange} name="date" id="date" type="datetime-local" />
          <Label>Categoria</Label>
          <Select
            value={newTransaction?.category}
            name="category"
            onValueChange={(value) =>{
              if(!newTransaction)return
              setNewTransaction({ ...newTransaction, category: value })
            }
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem className=" hover: cursor-pointer" value="Produto">
                Produto
              </SelectItem>
              <SelectItem className=" hover: cursor-pointer" value="Serviço">
                Serviço
              </SelectItem>
              <SelectItem className=" hover: cursor-pointer" value="Suprimentos">
                Suprimentos
              </SelectItem>
              <SelectItem className=" hover: cursor-pointer" value="Aluguel">
                Aluguel
              </SelectItem>
              <SelectItem className=" hover: cursor-pointer" value="Material">
                Material
              </SelectItem>
  
              <SelectItem className=" hover: cursor-pointer" value="Outros">
                Outros
              </SelectItem>
            </SelectContent>
          </Select>
  
          {newTransaction?.category === "Serviço" &&
            newTransaction?.type === "Receita" && (
              <>
                <Label>Serviço</Label>
                {selects.map((select, i) => (
                  <div
                    key={i}
                    className="w-full flex flex-row items-center gap-3"
                  >
                    <Select
                      onValueChange={(value) => handleChangeSelect(i, value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={select.name} />
                      </SelectTrigger>
                      <SelectContent>
                        {servicesTypes.map((serviceType) => (
                          <SelectItem
                            className="hover:cursor-pointer"
                            key={serviceType.id}
                            value={serviceType.id}
                          >
                            {serviceType.name +
                              " - " +
                              formatPrice(serviceType.value)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      className="rounded-full size-7 bg-red-700"
                      onClick={() => handelRemoveSelect(i)}
                    >
                      <Minus></Minus>
                    </Button>
                  </div>
                ))}
                <div className="flex w-full justify-center mb-8">
                  <Button
                    className="rounded-full size-8"
                    onClick={handleAddSelect}
                  >
                    <Plus />
                  </Button>
                </div>
                <Label>Responsável:</Label>
                <div className="w-full gap-3   flex flex-row justify-center items-center">
                  <Input
                    value={selectedUser?.name || ""}
                    name="user"
                    id="user"
                    type="text"
                    disabled
                    placeholder="Selecione um usuário"
                    className="hover:cursor-default text-xs"
                  />
                  <Dialog onOpenChange={() => setIsOpen(!isOpen)} open={isOpen}>
                    <DialogTrigger onClick={handleGetUsers} asChild>
                      <Button>
                        <UserSearch></UserSearch>
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Buscar</DialogTitle>
                        <DialogDescription>
                          Selecione um usuário para o serviço
                        </DialogDescription>
                      </DialogHeader>
                      <Input placeholder="Buscar"></Input>
  
                      <div className="rounded-md border">
                        {isLoadingUsers && (
                          <div className="h-1 bg-slate-400 w-full overflow-hidden relative">
                            <div className="w-1/2 bg-sky-500 h-full animate-slideIn absolute left-0 rounded-lg"></div>
                          </div>
                        )}
                      </div>
                      <div className="grid gap-3 grid-cols-3 overflow-auto min-h-[400px] items-center justify-center">
                        {users?.map((user) => (
                          <Card
                            key={user.id}
                            className=" hover:cursor-pointer hover:shadow-md  transition-all"
                            onClick={(e) => handleChangeUser(e, user)}
                          >
                            <CardHeader>
                              <CardTitle className="text-xs text-center">
                                {user.name}
                              </CardTitle>
                              <CardDescription className="text-center">
                                {user.profileType}
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="w-full flex items-center justify-center">
                                {user.profileImgLink ? (
                                  <Image
                                    className=" rounded-full"
                                    src={user.profileImgLink}
                                    alt={user.name}
                                    width={60}
                                    height={60}
                                  ></Image>
                                ) : (
                                  <User size={60}></User>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </>
            )}
  
          <Label>Método de pagamento</Label>
          <Select
            onValueChange={(value) =>
            {
              if(!newTransaction)return
              setNewTransaction({ ...newTransaction, paymentMethodId: value })
            }
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione"></SelectValue>
            </SelectTrigger>
            <SelectContent>
              {paymentMethods.map((paymentMethod) => (
                <SelectItem
                  key={paymentMethod.id}
                  className="hover: cursor-pointer"
                  value={paymentMethod.id}
                >
                  {paymentMethod.bankAccount.bankName +
                    " - " +
                    paymentMethod.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
  
          <DialogFooter>
            
              {isSaved ? (
            <Button disabled>
              Salvo <Check />
            </Button>
          ) : (
            <Button disabled={isSaving} onClick={handleSaveTransaction}>
              {isSaving ? <LoaderCircle className="animate-spin" /> : "Salvar Transação"}
            </Button>
          )}
            
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );

  }

}
