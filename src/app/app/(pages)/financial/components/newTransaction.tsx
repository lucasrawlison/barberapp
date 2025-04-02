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
import { useEffect, useState } from "react";
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

interface Transaction {
  description: string;
  value: number;
  date: string;
  type: string;
  category: string;
  paymentMethodId: string;
}

interface BankAccount {
  id: string;
  bankName: string;
}

interface PaymentMethod {
  id: string;
  name: string;
  bankAccount: BankAccount;
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
  newTransaction: Transaction;
  setNewTransaction: (value: Transaction) => void;
  paymentMethods: PaymentMethod[];
  fetchTransactions: () => void;
  servicesTypes: ServiceType[];
}

export function NewTransaction({
  paymentMethods,
  newTransaction,
  setNewTransaction,
  fetchTransactions,
  servicesTypes,
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
    setIsModalOpen(!isModalOpen);
    setNewTransaction({
      description: "",
      value: 0,
      date: "",
      type: "",
      category: "",
      paymentMethodId: "",
    });
    setSelects([
      {
        id: "",
        name: "Selecione",
        value: 0,
      },
    ]);
    setIsSaved(false)
  };

  const handleServiceValues = () => {
    const total = selects.reduce((soma, service) => soma + service.value, 0);
    setServicesTotalValue(total);
  };

  const handleAddSelect = () => {
    setSelects((prev) => [...prev, { id: "", name: "Selecione", value: 0 }]);
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
    const { name, value } = e.target;
    setNewTransaction({
      ...newTransaction,
      [name]:
        name === "value"
          ? parseFloat(value.replace(/[^\d,]/g, "").replace(",", ".")) || 0
          : value,
    });
  };

  useEffect(() => {
    console.log(newTransaction);
  }, [newTransaction]);

  const handleSaveTransaction = async () => {
    setIsSaving(true);
    if (
      newTransaction.type === "Receita" &&
      newTransaction.category === "Serviço"
    ) {
      try {
        const response = await axios.post("/api/createService", {
          value: servicesTotalValue,
          userId: selectedUser?.id,
          selectedServices: selects,
          paymentMethodId: newTransaction.paymentMethodId,
        });

        if (response) {
          console.log(response);
          fetchTransactions();
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
          fetchTransactions();
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
    console.log(index, serviceId);
    // Encontrar o objeto completo do serviço selecionado
    const selectedService = servicesTypes.find((s) => s.id === serviceId);

    if (selectedService) {
      setSelects((prev) => {
        const updatedServices = [...prev];
        updatedServices[index] = selectedService;
        return updatedServices;
      });
    }
  };

  useEffect(() => {
    handleServiceValues();
  }, [selects, handleServiceValues]);

  useEffect(() => {
    console.log(selects);
  }, [selects]);

  return (
    <Dialog onOpenChange={() => eraseData()} open={isModalOpen}>
      <DialogTrigger onClick={() => setIsModalOpen(true)} asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nova transação
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-screen overflow-auto">
        <DialogHeader>
          <DialogTitle>Adicionar nova transação</DialogTitle>
          <DialogDescription>
            Insira os detalhes da nova transação abaixo.
          </DialogDescription>
        </DialogHeader>
        <Label>Tipo de Transação</Label>
        <Select
          value={newTransaction.type}
          name="type"
          onValueChange={(value) =>
            setNewTransaction({ ...newTransaction, type: value })
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
            newTransaction.category === "Serviço" &&
            newTransaction.type === "Receita"
          }
          placeholder={
            newTransaction.category === "Serviço" &&
            newTransaction.type === "Receita"
              ? "Descrição gerada pelo serviço"
              : "Deixe uma descrição para a transação"
          }
          type="text"
          name="description"
          value={
            newTransaction.category === "Serviço" &&
            newTransaction.type === "Receita"
              ? "Descrição gerada pelo serviço"
              : newTransaction.description
          }
          onChange={handleChange}
        ></Input>
        <Label>Valor</Label>
        <ValueInput
          servicesTotalValue={servicesTotalValue}
          setNewTransaction={setNewTransaction}
          newTransaction={newTransaction}
        />

        <Label htmlFor="date">Date</Label>
        <Input onChange={handleChange} name="date" id="date" type="datetime-local" />
        <Label>Categoria</Label>
        <Select
          value={newTransaction.category}
          name="category"
          onValueChange={(value) =>
            setNewTransaction({ ...newTransaction, category: value })
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

        {newTransaction.category === "Serviço" &&
          newTransaction.type === "Receita" && (
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
            setNewTransaction({ ...newTransaction, paymentMethodId: value })
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
