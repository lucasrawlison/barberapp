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
}
export default function ValueInput({setNewTransaction, newTransaction} : ValueInputProps) {
  const [numericString, setNumericString] = useState<string>("")
  const [displayValue, setDisplayValue] = useState<string>("R$ 0,00")
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(()=> {
    // console.log(getFloatValue(numericString))
    setNewTransaction({
      ...newTransaction,
      value: getFloatValue(numericString),
    });
  }, [numericString])
  // Formata a string como moeda brasileira (R$)
  const formatCurrency = (value: string): string => {
    if (!value) return "R$ 0,00"

    // Converte a string para número (em centavos)
    const numericValue = Number.parseInt(value) / 100

    return numericValue.toLocaleString("pt-BR", {
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
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    // Permite apenas teclas numéricas e backspace
    if (!/^\d$/.test(e.key) && e.key !== "Backspace") {
      e.preventDefault()
      return
    }

    if (e.key === "Backspace") {
      // Deixa o comportamento padrão do backspace acontecer no input
      // A string será atualizada no handleChange
    } else {
      // Adiciona o dígito à string
      setNumericString((prev) => prev + e.key)
      e.preventDefault() // Previne a entrada padrão no input
    }
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
        value={displayValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className=""
        placeholder="R$ 0,00"
        disabled={newTransaction.category==="Serviço"}
      />
  )
}

