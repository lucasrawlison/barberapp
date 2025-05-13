"use client"

import { useState, useRef, type ChangeEvent, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { format } from "path";

interface Transaction {
  id: string;
  description: string;
  value: number;
  service: Service | null
  date: string;
  type: string;
  category: string;
  paymentMethodId: string;
  paymentMethod: PaymentMethod;
}
interface PaymentMethod {
  id: string;
  name: string;
  bankId: string;
  bankAccount: BankAccount;
  transactions: Transaction[];
}

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

interface User {
  id: string;
  name: string;
  email: string;
  login: string;
  profileType: string;
  profileImgLink: string;
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

interface ValueInputProps {
  setNewTransaction : (value: Transaction | undefined) => void
  newTransaction: Transaction | undefined
  servicesTotalValue: number | undefined
  selectedTransaction: Transaction | undefined
}
export default function ValueInput({setNewTransaction, newTransaction, servicesTotalValue, selectedTransaction} : ValueInputProps) {
  const [numericString, setNumericString] = useState<string>("")
  const [displayValue, setDisplayValue] = useState<string>("R$ 0,00")
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!newTransaction) return;
    if (
      newTransaction?.type === "Receita" &&
      newTransaction?.category === "Serviço"
    )
      return; // não atualiza value manualmente nesse caso
    if (
      selectedTransaction?.type === "Receita" &&
      selectedTransaction?.category === "Serviço"
    )
      return; // não atualiza value manualmente nesse caso

    const floatValue = getFloatValue(numericString);

    setNewTransaction({
      ...newTransaction,
      value: floatValue,
    });
  }, [numericString]);
  // Formata a string como moeda brasileira (R$)
  const formatCurrency = (value: string | number): string => {
    if (!value) return "R$ 0,00"

    // Converte a string para número (em centavos)
    if(typeof value === "string"){

      const numericValue = Number.parseInt(value) / 100
      return numericValue.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    }

    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })

  }

  

  // Converte a string para float
  const getFloatValue = (value: string): number => {
    if (!value) return 0
    return Number.parseInt(value) / 100
  }

  // Atualiza o valor formatado sempre que a string numérica mudar
  useEffect(() => {
    setDisplayValue(formatCurrency(numericString))
  }, [numericString])

  // Manipula as teclas pressionadas
  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, "") // remove tudo que não for número
    setNumericString(rawValue)
  }

  // Manipula mudanças no input (incluindo backspace)
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value

    // Se o valor diminuiu, significa que o backspace foi pressionado
    if (newValue.length < displayValue.length) {
      setNumericString((prev) => prev.slice(0, -1))
    }

    // Mantém o input com o valor formatado
    e.target.value = displayValue
  }

  // Foca no input quando o componente montar
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(()=> {
    console.log(selectedTransaction)
  },[selectedTransaction])


  useEffect(()=>{
    console.log("displayValue: ", displayValue)
  },[displayValue])

  useEffect(()=>{
    if(selectedTransaction){

      setDisplayValue(formatCurrency(selectedTransaction?.value))
    }
  },[selectedTransaction])



if(selectedTransaction){

  return (
    <Input
      ref={inputRef}
      type="text"
      name="value"
      value={
        selectedTransaction?.type === "Receita" &&
        selectedTransaction?.category === "Serviço" &&
        servicesTotalValue &&
        selectedTransaction.service
          ? formatCurrency(
              servicesTotalValue - selectedTransaction.service?.discount
            )
          : displayValue
      }
      onChange={handleChange}
      onInput={handleInput}
      className=""
      placeholder="R$ 0,00"
      disabled={
        selectedTransaction?.type === "Receita" &&
        selectedTransaction?.category === "Serviço"
      }
    />
  );
}else{

  return (
      <Input
        ref={inputRef}
        type="text"
        name="value"
        value={newTransaction?.type === "Receita" && newTransaction?.category==="Serviço" && servicesTotalValue ? formatCurrency(servicesTotalValue): displayValue}
        onChange={handleChange}
        onInput={handleInput}
        className=""
        placeholder="R$ 0,00"
        disabled={newTransaction?.type === "Receita" && newTransaction?.category==="Serviço"}
      />
  )
}


}

