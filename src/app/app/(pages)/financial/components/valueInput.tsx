"use client"

import { useState, useRef, type KeyboardEvent, type ChangeEvent, useEffect } from "react"
import { Input } from "@/components/ui/input"

interface Transaction {
  description: string,
  value: number,
  date: string,
  type: string,
  category: string
  paymentMethodId: string
}
interface ValueInputProps {
  setNewTransaction : (value: Transaction) => void
  newTransaction: Transaction
  servicesTotalValue: number
}
export default function ValueInput({setNewTransaction, newTransaction, servicesTotalValue} : ValueInputProps) {
  const [numericString, setNumericString] = useState<string>("")
  const [displayValue, setDisplayValue] = useState<string>("R$ 0,00")
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (
      newTransaction.type === "Receita" &&
      newTransaction.category === "Serviço"
    ) return; // não atualiza value manualmente nesse caso
  
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

  return (
      <Input
        ref={inputRef}
        type="text"
        name="value"
        value={newTransaction.type === "Receita" && newTransaction.category==="Serviço" ? formatCurrency(servicesTotalValue): displayValue}
        onChange={handleChange}
        onInput={handleInput}
        className=""
        placeholder="R$ 0,00"
        disabled={newTransaction.type === "Receita" && newTransaction.category==="Serviço"}
      />
  )
}

