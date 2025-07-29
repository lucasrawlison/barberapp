"use client";
import { Button } from "@/components/ui/button";
import {
  DialogTitle,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
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
import { useCallback, useEffect, useState } from "react";
import ValueInput from "./valueInput";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "@/hooks/use-toast";
import { LoaderCircle } from "lucide-react";

interface Type {
  id: string;
  name: string;
  value: number;
}


interface Transaction {
  id: string;
  value: number;
  date: string;
  paymentMethodId: string;
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


interface User {
  id: string;
  name: string;
  email: string;
  login: string;
  profileType: string;
  profileImgLink: string;
}

interface SelectedService {
  id: string;
  code: number;
  value: number;
  servicesValue: number;
  discount: number;
  createdAt: Date;
  servicesTypes: Type[];
  user: User;
  paymentMethodId: string;
  customerId: string;
  customer: Customer;
  paymentMethod: PaymentMethod;
  transactions: STransaction[];
  
}

interface STransaction {
  date: Date;
  description: string;
  type: string;
  value: number;
  paymentMethod: PaymentMethod;
  bankAccount: BankAccount;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  code: string;
}
interface paymentRegisterProps {
  selectedServiceId: string;
  unpaidAmount: number;
  isPaymentOpen: boolean;
  setIsPaymentOpen: (isOpen: boolean) => void;
  setSelectedService: (service: SelectedService | null) => void;
  
}

export default function PaymentRegister({
  setSelectedService,
  isPaymentOpen,
  setIsPaymentOpen,
  unpaidAmount,
  selectedServiceId,
}: paymentRegisterProps) {
  const handleConvertDate = useCallback((date: string) => {
    console.log("date", date);
    const newDate = new Date(date);

    const year = newDate.getFullYear();
    const month = String(newDate.getMonth() + 1).padStart(2, "0"); // mês começa em 0
    const day = String(newDate.getDate()).padStart(2, "0"); // dia do mês

    const hours = String(newDate.getHours()).padStart(2, "0");
    const minutes = String(newDate.getMinutes()).padStart(2, "0");

    const formatted = `${year}-${month}-${day}T${hours}:${minutes}`;
    console.log(formatted);
    return formatted;
  }, []);

  const router = useRouter();
  const [newTransaction, setNewTransaction] = useState<Transaction>({
    id: "",
    value: 0,
    date: handleConvertDate(new Date().toString()),
    paymentMethodId: "",
  });
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [, setIsLoadingMethods] = useState(false);
  const [isSavingPayment, setIsSavingPayment] = useState(false);
  const { data: session } = useSession();

  const createServicePayment = async () => {
    setIsSavingPayment(true);
    try {
      const response = await axios.post("/api/createServicePayment", {
        newTransaction: {
          ...newTransaction,
          date: newTransaction.date,
          serviceId: selectedServiceId,
        },
        userId: session?.user?.id, // Substitua pelo ID do usuário real
      });

      if (response.status === 200) {
        const { updatedService } = response.data;
        setSelectedService(updatedService);
        setIsSavingPayment(false);
        toast({
          title: "Pagamento registrado com sucesso!",
          description: "O pagamento foi registrado com sucesso.",
          variant: "default",
        })
        // router.push("/app/services");
      }
    } catch (error) {
      if(axios.isAxiosError(error)){
        if(error.response?.status === 403){
          toast(
            {
              title: "Erro",
              description:error.message,
              variant: "destructive",
            }
          )
        }else{
          toast(
            {
              title: "Erro",
              description:error.message,
              variant: "destructive",
            }
          )
        }

      }
      setIsSavingPayment(false);
    }
  };

  const getPaymentMethods = async () => {
    try {
      setIsLoadingMethods(true);

      const response = await axios.post("/api/getPaymentMethods");

      if (response.status === 200) {
        const { paymentMethods } = response.data;
        setPaymentMethods(paymentMethods);
        setIsLoadingMethods(false);
        eraseData();
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 403) {
          router.push("/app/dashboard");
        }
      }
      setIsLoadingMethods(false);
    }
  };

  useEffect(() => {
    getPaymentMethods();
  }, []);

  const setNewValue = (value: number) => {
    setNewTransaction({ ...newTransaction, value: value });
  };

  useEffect(() => {
    if (newTransaction) {
      console.log(newTransaction);
    }
  }, [newTransaction]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (newTransaction) {
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

  const verifyPayment = () => {
    if(!newTransaction.value || newTransaction.value <= 0){
      toast({
        title: "Valor inválido",
        description: "O valor do pagamento deve ser maior que zero.",
        variant: "destructive",
      });
      return;
    }

    if(newTransaction.value > unpaidAmount){
      toast({
        title: "Valor inválido",
        description: "O valor do pagamento não pode ser maior que o valor pendente.",
        variant: "destructive",
      })
      return;
    }

    if (!newTransaction.paymentMethodId) {
      toast({
        title: "Método de pagamento não selecionado",
        description: "Por favor, selecione um método de pagamento.",
        variant: "destructive",
      });
      return;
    }

    if (!newTransaction.date) {
      toast({
        title: "Data inválida",
        description: "Por favor, selecione uma data válida.",
        variant: "destructive",
      });
      return;
    }
    createServicePayment();
  }

  const eraseData = () => {
    if(isPaymentOpen){
      setNewTransaction({
        id: "",
        value: 0,
        date: handleConvertDate(new Date().toString()),
        paymentMethodId: "",
      });

      setIsPaymentOpen(false);
    }

  };
  return (
    <Dialog open={isPaymentOpen} onOpenChange={eraseData} >
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:cursor-pointer hover:bg-blue-700"
        onClick={() => {setIsPaymentOpen(true)}}
        >
          Registrar Pagamento
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[600px] sm:max-h-screen overflow-auto portr ">
        <DialogHeader>
          <DialogTitle>Adicionar nova transação</DialogTitle>
          <DialogDescription>
            Insira os detalhes da nova transação abaixo.
          </DialogDescription>
        </DialogHeader>

        <Label>Valor</Label>
        <ValueInput desconto={newTransaction.value} setDesconto={setNewValue} />

        <Label htmlFor="date">Data</Label>
        <Input
          defaultValue={handleConvertDate(newTransaction.date)}
          onChange={handleChange}
          name="date"
          id="date"
          type="datetime-local"
        />
        <Label>Categoria: Serviço</Label>

        <Label>Método de pagamento</Label>
        <Select
          value={newTransaction?.paymentMethodId}
          onValueChange={(value) => {
            if (!newTransaction) return;
            setNewTransaction({ ...newTransaction, paymentMethodId: value });
          }}
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

        <DialogFooter className="flex w-full justify-end">
          <Button
          disabled={isSavingPayment}
          onClick={verifyPayment}>{isSavingPayment ? <LoaderCircle className="animate-spin"/> : "Registrar"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
