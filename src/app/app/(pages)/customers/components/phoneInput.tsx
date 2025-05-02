"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"

interface BankAccount{
  id: string;
  bankName: string;
}

interface PaymentMethod {
  id: string;
  name: string;
  bankAccount: BankAccount
}
interface Type {
  id: string
  name: string
  value: number
}
interface User {
  name: string
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
  customer: Customer;
  paymentMethod: PaymentMethod
}

interface Customer {
  id: string,
  name: string,
  code: string,
  email: string,
  phone: string,
  services: Service[];
}
interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  code: string;
  services: Service[];


}

type PhoneInputProps = {
  value?: string
  onChange?: (raw: string) => void
  placeholder?: string
  className?: string
  setNewCustomer: React.Dispatch<React.SetStateAction<Customer>>
  selectedCustomer: Customer | undefined
  setSelectedCustomer: React.Dispatch<React.SetStateAction<Customer | undefined>>
}

export default function PhoneInput({
  value = "",
  onChange,
  placeholder = "(00) 00000-0000",
  className = "",
  setNewCustomer,
  setSelectedCustomer,
  selectedCustomer,
}: PhoneInputProps) {

  const [formattedValue, setFormattedValue] = useState("")

  const formatPhoneNumber = (value: string) => {
    const digits = value.replace(/\D/g, "")
    const limitedDigits = digits.slice(0, 11)

    let formatted = ""
    if (limitedDigits.length > 0) {
      formatted = `(${limitedDigits.slice(0, 2)}`
      if (limitedDigits.length > 2) {
        formatted += `) ${limitedDigits.slice(2, 7)}`
        if (limitedDigits.length > 7) {
          formatted += `-${limitedDigits.slice(7)}`
        }
      }
    }

    return { raw: limitedDigits, formatted }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    const { raw, formatted } = formatPhoneNumber(newValue)
    setFormattedValue(formatted)
    if(selectedCustomer) {
      setSelectedCustomer((prev) => {
        if (prev) {
          return { ...prev, phone: formatted };
        }
        return prev;
      });
    }else{
    setNewCustomer((prev: Customer) => ({ ...prev, phone: formatted }))

  }
    onChange?.(raw)
  }

  useEffect(() => {
    if (value) {
      const { formatted } = formatPhoneNumber(value)
      setFormattedValue(formatted)
    }
  }, [value])

  
  return (
    <Input
      type="tel"
      inputMode="numeric"
      value={selectedCustomer ? selectedCustomer.phone: formattedValue}
      onChange={handleChange}
      placeholder={placeholder}
      className={className}
      maxLength={16}
    />
  )
}
