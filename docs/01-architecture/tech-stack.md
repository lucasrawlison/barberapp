# 🛠️ Tech Stack

Este documento detalha as tecnologias utilizadas no BarberApp, justificativas para cada escolha e como elas se integram.

---

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Frontend](#frontend)
- [Backend](#backend)
- [Database](#database)
- [Autenticação](#autenticação)
- [DevTools](#devtools)
- [Infraestrutura](#infraestrutura)

---

## 🔍 Visão Geral

O BarberApp é construído com uma arquitetura fullstack moderna, utilizando Next.js como framework principal. Esta escolha permite o desenvolvimento de frontend e backend no mesmo repositório, com deploy simplificado e performance otimizada.

### Diagrama de Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                         Cliente                              │
│                    (Browser / Mobile)                        │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                     Next.js 15.2                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           App Router (React Server Components)        │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌────────────────┐  ┌──────────────────────────────────┐   │
│  │   Pages (UI)   │  │    API Routes (Backend)          │   │
│  │  - Dashboard   │  │    - /api/users                  │   │
│  │  - Scheduling  │  │    - /api/transactions           │   │
│  │  - Financial   │  │    - /api/services               │   │
│  └────────────────┘  └──────────────────────────────────┘   │
└─────────────┬─────────────────────────┬─────────────────────┘
              │                         │
              ▼                         ▼
    ┌──────────────────┐      ┌──────────────────┐
    │   NextAuth 5.0   │      │   Prisma ORM     │
    │  (Autenticação)  │      │   (Database)     │
    └──────────────────┘      └────────┬─────────┘
                                       │
                                       ▼
                              ┌──────────────────┐
                              │  MongoDB Atlas   │
                              │   (Database)     │
                              └──────────────────┘
```

---

## 🎨 Frontend

### Core Framework

#### **Next.js 15.2**
```json
"next": "^15.2.4"
```

**Por que Next.js?**
- ✅ **App Router**: Arquitetura moderna com Server Components
- ✅ **Performance**: Otimizações automáticas (Image, Font, Script)
- ✅ **SEO**: Server-Side Rendering (SSR) out-of-the-box
- ✅ **API Routes**: Backend integrado sem necessidade de servidor separado
- ✅ **Turbopack**: Build ultrarrápido em desenvolvimento
- ✅ **TypeScript**: Suporte nativo de primeira classe

**Recursos Utilizados**:
- Server Components para performance
- Client Components para interatividade
- API Routes para endpoints serverless
- Middleware para proteção de rotas
- Metadata API para SEO

---

#### **React 18.2**
```json
"react": "^18.2.0",
"react-dom": "^18.2.0"
```

**Recursos Utilizados**:
- Hooks (useState, useEffect, useCallback, useMemo)
- Context API para estado global
- Suspense e Error Boundaries
- Server Components (via Next.js)

---

#### **TypeScript 5**
```json
"typescript": "^5"
```

**Benefícios**:
- ✅ Tipagem estática para segurança
- ✅ Autocomplete e IntelliSense
- ✅ Detecção de erros em tempo de desenvolvimento
- ✅ Refatoração segura
- ✅ Documentação viva do código

---

### Estilização

#### **TailwindCSS 3.4**
```json
"tailwindcss": "^3.4.1"
```

**Por que Tailwind?**
- ✅ Utility-first para desenvolvimento rápido
- ✅ Purge CSS automático (bundle pequeno)
- ✅ Design tokens consistentes
- ✅ Responsividade simplificada
- ✅ Dark mode built-in

**Configuração Customizada** (`tailwind.config.ts`):
```typescript
{
  theme: {
    extend: {
      colors: {
        primary: {...},
        secondary: {...}
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      }
    }
  },
  plugins: [require('tailwindcss-animate')]
}
```

---

#### **Shadcn/UI**
```json
"components.json"
```

**O que é?**
- Biblioteca de componentes acessíveis e customizáveis
- Baseada em Radix UI primitives
- Código copiado para o projeto (não é dependência npm)
- Controle total sobre o código

**Componentes Utilizados**:
- Button, Input, Select, Checkbox
- Dialog, Dropdown Menu, Popover
- Calendar, Tabs, Toast
- Avatar, Progress, Separator

---

#### **Radix UI**
```json
"@radix-ui/react-*": "^1.x.x"
```

**Por que Radix?**
- ✅ Acessibilidade WCAG 2.1 AAA
- ✅ Componentes headless (sem estilo)
- ✅ Keyboard navigation
- ✅ Focus management
- ✅ Screen reader support

**Primitives Utilizados**:
- Dialog, Dropdown Menu, Select
- Checkbox, Radio Group, Switch
- Popover, Tooltip, Toast

---

### UI e UX

#### **Lucide React**
```json
"lucide-react": "^0.475.0"
```
- Biblioteca de ícones moderna
- Tree-shakeable (importa apenas o necessário)
- Consistência visual
- 1000+ ícones disponíveis

#### **Recharts**
```json
"recharts": "^2.15.1"
```
- Biblioteca de gráficos para React
- Utilizada no dashboard financeiro
- Gráficos de linha, barra, área e pizza
- Responsiva e customizável

#### **date-fns**
```json
"date-fns": "^3.6.0"
```
- Manipulação de datas moderna
- Tree-shakeable (menor bundle)
- Suporte a i18n
- Alternativa ao Moment.js

#### **React Day Picker**
```json
"react-day-picker": "^8.10.1"
```
- Calendário customizável
- Usado no sistema de agendamentos
- Suporte a ranges e múltiplas seleções

---

### Formulários e Validação

#### **React Hook Form**
```json
"react-hook-form": "^7.54.2"
```

**Benefícios**:
- ✅ Performance (menos re-renders)
- ✅ Validação assíncrona
- ✅ Integração com Zod
- ✅ TypeScript support

#### **Zod**
```json
"zod": "^3.24.2"
```

**Schema de Validação**:
```typescript
const customerSchema = z.object({
  name: z.string().min(1, "Nome obrigatório"),
  phone: z.string().regex(/^\d{10,11}$/, "Telefone inválido"),
  email: z.string().email().optional()
});
```

#### **@hookform/resolvers**
```json
"@hookform/resolvers": "^4.1.0"
```
- Integração entre React Hook Form e Zod

---

## ⚙️ Backend

### Runtime e Framework

O backend do BarberApp utiliza as **API Routes do Next.js**, que rodam como **serverless functions** em produção.

**Arquitetura Serverless**:
- Cada rota é uma função independente
- Auto-scaling baseado em demanda
- Cold start otimizado
- Deploy na edge (Vercel)

**Estrutura de API Routes**:
```
src/app/api/
├── users/
│   ├── route.ts          (GET /api/users)
├── createUser/
│   └── route.ts          (POST /api/createUser)
├── transactions/
│   └── route.ts          (GET/POST /api/transactions)
└── ...
```

---

### ORM e Database

#### **Prisma 6.9**
```json
"prisma": "^6.9.0",
"@prisma/client": "^6.9.0"
```

**Por que Prisma?**
- ✅ **Type-safe**: Queries com autocomplete
- ✅ **Migrations**: Controle de versão do schema
- ✅ **Studio**: GUI para visualizar dados
- ✅ **Relações**: Handling simplificado de foreign keys
- ✅ **Performance**: Query optimization automático

**Features Utilizadas**:
- Prisma Client (queries)
- Prisma Migrate (migrations)
- Prisma Studio (admin GUI)
- Relations (1-N, N-N)
- MongoDB ObjectId support

**Exemplo de Query**:
```typescript
const users = await prisma.user.findMany({
  where: { active: true },
  include: {
    services: true,
    scheduling: true
  },
  orderBy: { createdAt: 'desc' }
});
```

---

#### **MongoDB 6.15**
```json
"mongodb": "^6.15.0"
```

**Por que MongoDB?**
- ✅ Schema flexível para evolução rápida
- ✅ Performance em leitura/escrita
- ✅ Escalabilidade horizontal
- ✅ Atlas (DBaaS) com tier gratuito
- ✅ Agregações poderosas

**Configuração**:
```prisma
datasource db {
  provider = "mongodb"
  url      = env("DATABASE_URL")
}
```

**Collections Principais**:
- User (usuários do sistema)
- Customer (clientes da barbearia)
- Service (serviços realizados)
- Scheduling (agendamentos)
- Transactions (transações financeiras)
- PaymentMethod (métodos de pagamento)
- BankAccount (contas bancárias)

---

### HTTP Client

#### **Axios**
```json
"axios": "^1.7.9"
```

**Uso**:
- Requisições HTTP do frontend para API Routes
- Interceptors para tratamento de erros
- Configuração base compartilhada

---

## 🔐 Autenticação

#### **NextAuth.js 5.0**
```json
"next-auth": "^5.0.0-beta.28"
```

**Por que NextAuth?**
- ✅ Integração perfeita com Next.js
- ✅ Suporte a múltiplos providers
- ✅ Sessões JWT ou Database
- ✅ Callbacks customizáveis
- ✅ Proteção CSRF built-in

**Providers Configurados**:
- Credentials (email/password)
- GitHub OAuth (opcional)

**Configuração** (`src/auth.ts`):
```typescript
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Credentials],
  pages: {
    signIn: '/login',
    error: '/login'
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
      }
      return session;
    }
  }
});
```

**Middleware de Proteção** (`src/middleware.ts`):
```typescript
export { auth as middleware } from "@/auth";
```

---

## 🛠️ DevTools

### Build Tools

#### **Turbopack**
- Build tool de próxima geração (substituto do Webpack)
- 700x faster than Webpack
- Usado em `npm run dev --turbopack`

#### **ESLint 9**
```json
"eslint": "^9",
"eslint-config-next": "15.1.7"
```
- Linting de código JavaScript/TypeScript
- Regras do Next.js aplicadas

#### **PostCSS**
```json
"postcss": "^8"
```
- Processor CSS para Tailwind
- Autoprefixer automático

---

### Utilitários

#### **clsx & tailwind-merge**
```json
"clsx": "^2.1.1",
"tailwind-merge": "^3.0.1"
```

**Utility Function** (`lib/utils.ts`):
```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

**Uso**:
```tsx
<div className={cn(
  "base-class",
  condition && "conditional-class",
  className
)} />
```

#### **class-variance-authority (CVA)**
```json
"class-variance-authority": "^0.7.1"
```

**Variants de Componentes**:
```typescript
const buttonVariants = cva(
  "base-button-classes",
  {
    variants: {
      variant: {
        default: "bg-primary",
        destructive: "bg-destructive",
      },
      size: {
        default: "h-10 px-4",
        sm: "h-9 px-3",
      }
    }
  }
);
```

---

## 🌐 Infraestrutura

### Deploy e Hosting

#### **Vercel** (Recomendado)
- Deploy automático do Next.js
- Edge Functions
- Preview deployments
- Analytics e monitoring
- Zero config

**Alternativas**:
- Railway
- Render
- AWS Amplify

### Banco de Dados

#### **MongoDB Atlas**
- DBaaS (Database as a Service)
- Tier gratuito (512MB)
- Backups automáticos
- Monitoring integrado
- Multi-region support

---

## 📦 Gerenciamento de Dependências

### Package Manager: **npm**

```bash
# Instalar dependências
npm install

# Adicionar dependência
npm install <package>

# Remover dependência
npm uninstall <package>

# Atualizar dependências
npm update
```

### Dependências de Produção vs Desenvolvimento

**Produção** (`dependencies`):
- Necessárias em runtime
- Incluídas no bundle

**Desenvolvimento** (`devDependencies`):
- Apenas para desenvolvimento
- Não incluídas no bundle de produção

---

## 🔄 Integrações Futuras

### Planejado para Próximas Versões

- **Stripe/Mercado Pago**: Pagamentos online
- **Twilio**: SMS e WhatsApp notifications
- **SendGrid**: Email transacional
- **Sentry**: Error tracking
- **Vercel Analytics**: Performance monitoring
- **Jest + Testing Library**: Testes automatizados

---

## 📊 Performance

### Métricas de Performance

- **Lighthouse Score**: 95+ (Mobile e Desktop)
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3s
- **Bundle Size**: ~200KB (gzipped)

### Otimizações Aplicadas

- ✅ Server Components para reduzir JS no cliente
- ✅ Image Optimization (next/image)
- ✅ Font Optimization (next/font)
- ✅ Code Splitting automático
- ✅ Lazy Loading de componentes
- ✅ Tree Shaking (Tailwind, Lucide)
- ✅ Prisma Connection Pooling

---

## 🔗 Links Úteis

### Documentação Oficial

- [Next.js](https://nextjs.org/docs)
- [React](https://react.dev)
- [TypeScript](https://www.typescriptlang.org/docs)
- [Prisma](https://www.prisma.io/docs)
- [MongoDB](https://www.mongodb.com/docs)
- [TailwindCSS](https://tailwindcss.com/docs)
- [Shadcn/UI](https://ui.shadcn.com)
- [NextAuth](https://authjs.dev)

---

<div align="center">

**[⬆ Voltar ao topo](#-tech-stack)**

</div>
