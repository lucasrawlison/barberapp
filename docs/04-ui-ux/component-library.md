# 🎨 Biblioteca de Componentes

Documentação da biblioteca de componentes UI do BarberApp.

---

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Componentes Disponíveis](#componentes-disponíveis)
- [Como Usar](#como-usar)
- [Customização](#customização)

---

## 🔍 Visão Geral

O BarberApp utiliza **Shadcn/UI** como base para seus componentes, construídos sobre os primitivos do **Radix UI**.

### Características

- ✅ **29 componentes** prontos para uso
- ✅ **Acessibilidade** WCAG 2.1 AAA
- ✅ **Totalmente customizáveis** (código no projeto)
- ✅ **TypeScript** nativo
- ✅ **Dark mode** suportado
- ✅ **Responsivos** por padrão

---

## 📦 Componentes Disponíveis

### Formulários

| Componente | Descrição | Arquivo |
|------------|-----------|---------|
| **Button** | Botões com variants (default, destructive, outline, ghost) | `button.tsx` |
| **Input** | Campo de texto | `input.tsx` |
| **Textarea** | Campo de texto multilinha | `textarea.tsx` |
| **Checkbox** | Caixa de seleção | `checkbox.tsx` |
| **Radio Group** | Grupo de opções exclusivas | `radio-group.tsx` |
| **Select** | Dropdown de seleção | `select.tsx` |
| **Switch** | Toggle on/off | `switch.tsx` |
| **Label** | Rótulo de formulário | `label.tsx` |
| **Form** | Wrapper de formulário com validação | `form.tsx` |

### Feedback & Overlays

| Componente | Descrição |
|------------|-----------|
| **Dialog** | Modal/diálogo |
| **Alert Dialog** | Diálogo de confirmação |
| **Toast** | Notificação temporária |
| **Tooltip** | Dica ao passar mouse |
| **Sheet** | Painel lateral |
| **Popover** | Popup contextual |
| **Sonner** | Toast avançado |

### Layout

| Componente | Descrição |
|------------|-----------|
| **Card** | Cartão de conteúdo |
| **Separator** | Linha divisória |
| **Tabs** | Abas de navegação |
| **Table** | Tabela de dados |
| **Skeleton** | Loading placeholder |

### Navegação

| Componente | Descrição |
|------------|-----------|
| **Dropdown Menu** | Menu suspenso |
| **Pagination** | Paginação |

### Data Display

| Componente | Descrição |
|------------|-----------|
| **Avatar** | Foto de perfil |
| **Badge** | Etiqueta/selo |
| **Progress** | Barra de progresso |
| **Calendar** | Calendário |
| **Chart** | Gráficos (Recharts) |

---

## 🔧 Como Usar

### Importação

```typescript
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
```

### Exemplos de Uso

#### Button

```tsx
import { Button } from '@/components/ui/button';

<Button variant="default">Salvar</Button>
<Button variant="destructive">Deletar</Button>
<Button variant="outline">Cancelar</Button>
<Button variant="ghost">Voltar</Button>

// Com ícone
<Button>
  <PlusIcon className="mr-2 h-4 w-4" />
  Adicionar
</Button>
```

#### Input

```tsx
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

<div>
  <Label htmlFor="email">Email</Label>
  <Input 
    id="email" 
    type="email" 
    placeholder="seuemail@exemplo.com" 
  />
</div>
```

#### Dialog

```tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

<Dialog>
  <DialogTrigger asChild>
    <Button>Abrir Modal</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Título do Modal</DialogTitle>
      <DialogDescription>
        Descrição do conteúdo
      </DialogDescription>
    </DialogHeader>
    {/* Conteúdo do modal */}
  </DialogContent>
</Dialog>
```

#### Select

```tsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

<Select>
  <SelectTrigger>
    <SelectValue placeholder="Selecione uma opção" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Opção 1</SelectItem>
    <SelectItem value="option2">Opção 2</SelectItem>
  </SelectContent>
</Select>
```

#### Card

```tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

<Card>
  <CardHeader>
    <CardTitle>Título do Card</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Conteúdo do card</p>
  </CardContent>
</Card>
```

#### Toast (Sonner)

```tsx
"use client";
import { toast } from "sonner";

// Sucesso
toast.success("Operação realizada com sucesso!");

// Erro
toast.error("Ocorreu um erro!");

// Info
toast.info("Informação importante");

// Com ação
toast("Arquivo deletado", {
  action: {
    label: "Desfazer",
    onClick: () => console.log("Desfazer"),
  },
});
```

#### Calendar

```tsx
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";

const [date, setDate] = useState<Date | undefined>(new Date());

<Calendar
  mode="single"
  selected={date}
  onSelect={setDate}
  className="rounded-md border"
/>
```

---

## 🎨 Customização

### Variants (Button)

```typescript
const buttonVariants = cva(
  "base-classes",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        destructive: "bg-destructive text-destructive-foreground",
        outline: "border border-input bg-background",
        ghost: "hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-8",
      },
    },
  }
);
```

### Modificando Componentes

Como os componentes estão no projeto, você pode editá-los diretamente:

```typescript
// src/components/ui/button.tsx
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
```

### Utilizando o cn() Helper

```typescript
import { cn } from "@/lib/utils";

<Button 
  className={cn(
    "custom-class",
    isActive && "bg-blue-500",
    isDisabled && "opacity-50"
  )}
>
  Botão
</Button>
```

---

## 📚 Recursos

- [Shadcn/UI Documentation](https://ui.shadcn.com)
- [Radix UI Documentation](https://www.radix-ui.com)
- [TailwindCSS Documentation](https://tailwindcss.com)

---

<div align="center">

**[⬆ Voltar ao topo](#-biblioteca-de-componentes)**

</div>
