import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LoaderCircle, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import ValueInput from "./valueInput";
import axios from "axios";

interface Transaction {
  description: string,
  value: number,
  date: string,
  type: string,
  category: string,
}

interface BankAccount {
  id: string;
  bankName: string;

}

interface PaymentMethod {
  id: string;
  name: string;
  bankAccount: BankAccount
}

interface NewTransactionProps {
  newTransaction: Transaction
  setNewTransaction: (value: Transaction) => void
  paymentMethods: PaymentMethod[]
}

export  function NewTransaction ( {paymentMethods, newTransaction, setNewTransaction} : NewTransactionProps) {
  const [isSaving, setIsSaving] = useState(false)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewTransaction({
      ...newTransaction,
      [name]: name === "value" ? parseFloat(value.replace(/[^\d,]/g, "").replace(",", ".")) || 0 : value,
    });
  };

  
  useEffect(() => {
    console.log(newTransaction)
  },[newTransaction])

const handleSaveTransaction = async () => {
  setIsSaving(true)
  try {
    const response = await axios.post("/api/createTransaction", {
      newTransaction: newTransaction
    }, {
      headers: {
        "Content-Type": "application/json",
      }
    });
    if(response){
      console.log(response)
      setIsSaving(false)
    }
  } catch (error) {
    setIsSaving(false)
  }
}
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nova transação
          </Button>
        </DialogTrigger>
        <DialogContent>
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
            placeholder="Deixe uma descrição para a transação"
            type="text"
            name="description"
            value={newTransaction.description}
            onChange={handleChange}
          ></Input>
          <Label>Valor</Label>
          <ValueInput
            setNewTransaction={setNewTransaction}
            newTransaction={newTransaction}
          />

          <Label htmlFor="date">Date</Label>
          <Input onChange={handleChange} name="date" id="date" type="date" />
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
            </SelectContent>
          </Select>

          <Label>Método de pagamento</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Selecione"></SelectValue>
            </SelectTrigger>
            <SelectContent>
              {paymentMethods.map((paymentMethod)=> (

              <SelectItem key={paymentMethod.id} className="hover: cursor-pointer" value={paymentMethod.name}>{paymentMethod.bankAccount.bankName + " - " + paymentMethod.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>



          <DialogFooter>
            <Button disabled={isSaving} className="w-[130px]" onClick={handleSaveTransaction} type="submit">{isSaving ? <LoaderCircle className=" animate-spin"/> : "Salvar transação"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
}