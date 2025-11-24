# 🔐 Autenticação e Autorização

Este documento detalha o sistema de autenticação e autorização do BarberApp, incluindo configuração, fluxos e proteção de rotas.

---

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Tecnologia Utilizada](#tecnologia-utilizada)
- [Configuração](#configuração)
- [Fluxo de Autenticação](#fluxo-de-autenticação)
- [Proteção de Rotas](#proteção-de-rotas)
- [Sessões](#sessões)
- [Segurança](#segurança)

---

## 🔍 Visão Geral

O BarberApp utiliza **NextAuth.js 5.0** para gerenciar autenticação e sessões. O sistema suporta múltiplos providers e implementa proteção de rotas através de middleware.

### Características

- ✅ Autenticação via Credentials (email/password)
- ✅ Suporte a OAuth (GitHub configurado)
- ✅ Sessões JWT
- ✅ Proteção automática de rotas via middleware
- ✅ Callbacks customizados
- ✅ Páginas customizadas (login/erro)

---

## 🛠️ Tecnologia Utilizada

### NextAuth.js 5.0

```json
{
  "next-auth": "^5.0.0-beta.28"
}
```

**Por que NextAuth?**
- ✅ Integração nativa com Next.js
- ✅ Suporte a múltiplos providers
- ✅ Gerenciamento de sessões JWT ou database
- ✅ Proteção CSRF automática
- ✅ Callbacks poderosos e flexíveis
- ✅ TypeScript support

### Prisma Client

```typescript
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
```

Usado para validar credenciais contra o banco de dados.

---

## ⚙️ Configuração

### Arquivo de Configuração (`src/auth.ts`)

```typescript
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    // Provider OAuth (opcional)
    GitHub,
    
    // Provider Credentials (principal)
    Credentials({
      id: "credentials",
      name: "Credentials",
      credentials: {
        userName: { label: "Login", placeholder: "Email or Username" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // 1. Validar se credenciais foram fornecidas
        if (!credentials?.userName || !credentials?.password) {
          return null;
        }

        // 2. Validar tipo de userName
        if (typeof credentials.userName !== "string") {
          return null;
        }

        // 3. Buscar usuário no banco (email OU login)
        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { email: credentials.userName },
              { login: credentials.userName }
            ]
          },
        });

        // 4. Verificar se usuário existe
        if (!user) {
          return null;
        }

        // 5. Verificar se usuário está ativo
        if (!user.active) {
          return null;
        }

        // 6. Validar senha (TODO: implementar bcrypt)
        if (credentials.password !== user.password) {
          return null;
        }

        // 7. Retornar dados do usuário para a sessão
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.profileImgLink as string | null
        };
      },
    }),
  ],
  
  // Páginas customizadas
  pages: {
    signIn: "/login",      // Redireciona para /login
    error: "/login",       // Erros também vão para /login
  },
  
  // Callbacks
  callbacks: {
    // Callback de signIn - validação adicional
    async signIn({ user }) {
      if (!user) {
        throw new Error("Credenciais inválidas");
      }
      return true;
    },
    
    // Callback de sessão - adicionar dados extras à sessão
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
    
    // Callback de JWT - guardar dados no token
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
  
  debug: true, // Logs detalhados em desenvolvimento
});
```

---

## 🔄 Fluxo de Autenticação

### Diagrama de Fluxo

```mermaid
sequenceDiagram
    participant U as Usuário
    participant L as /login
    participant A as NextAuth
    participant P as Prisma
    participant D as MongoDB
    participant M as Middleware
    participant App as /app/*

    U->>L: Acessa /login
    U->>L: Preenche email/senha
    L->>A: submit credentials
    A->>P: findFirst(email OR login)
    P->>D: Query usuário
    D-->>P: Retorna user ou null
    P-->>A: user data
    
    alt Usuário não encontrado
        A-->>L: return null (erro)
        L-->>U: "Credenciais inválidas"
    else Usuário inativo
        A-->>L: return null (erro)
        L-->>U: "Usuário inativo"
    else Senha incorreta
        A-->>L: return null (erro)
        L-->>U: "Credenciais inválidas"
    else Autenticação OK
        A->>A: Cria JWT token
        A->>A: Cria sessão
        A-->>L: Autenticado
        L-->>U: Redireciona para /app
        U->>App: Acessa página protegida
        M->>M: Valida sessão
        M-->>App: Acesso permitido
        App-->>U: Renderiza página
    end
```

### Passo a Passo

1. **Usuário acessa /login**
   - Página de login é renderizada
   - Formulário com email/username e senha

2. **Submit do formulário**
   ```typescript
   const result = await signIn("credentials", {
     userName: email,
     password: password,
     redirect: false,
   });
   ```

3. **Validação das credenciais**
   - NextAuth chama `authorize()` do provider
   - Busca usuário no banco via Prisma
   - Valida senha (atualmente plaintext, TODO: bcrypt)
   - Valida se usuário está ativo

4. **Criação da sessão**
   - Se válido, NextAuth cria JWT token
   - Token contém: `id`, `email`, `name`, `image`
   - Cookie de sessão é setado

5. **Redirecionamento**
   - Usuário é redirecionado para `/app/dashboard`
   - Middleware valida sessão em todas as rotas `/app/*`

---

## 🛡️ Proteção de Rotas

### Middleware (`src/middleware.ts`)

```typescript
export { auth as middleware } from "@/auth";
```

Este simples export protege **todas as rotas** automaticamente, exceto:
- Rotas públicas definidas no NextAuth
- `/login`
- `/api/auth/*` (rotas do NextAuth)

### Configuração de Rotas Protegidas

Por padrão, todas as rotas são protegidas. Para customizar:

```typescript
// src/middleware.ts (versão expandida)
import { auth } from "@/auth";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  
  // Rotas públicas
  const publicRoutes = ['/login', '/api/auth'];
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  
  if (isPublicRoute) {
    return; // Permite acesso
  }
  
  // Verificar se há sessão
  if (!req.auth) {
    return Response.redirect(new URL('/login', req.url));
  }
});

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
```

### Proteção no Lado do Servidor

Para proteger Server Components e API Routes:

```typescript
// app/(pages)/dashboard/page.tsx
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();
  
  if (!session) {
    redirect('/login');
  }
  
  return <div>Dashboard protegido</div>;
}
```

### Proteção no Lado do Cliente

Para proteger Client Components:

```typescript
"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function ClientComponent() {
  const { data: session, status } = useSession();
  
  if (status === "loading") {
    return <div>Carregando...</div>;
  }
  
  if (status === "unauthenticated") {
    redirect('/login');
  }
  
  return <div>Conteúdo protegido</div>;
}
```

---

## 🎫 Sessões

### Estrutura da Sessão

```typescript
interface Session {
  user: {
    id: string;          // Adicionado via callback
    name: string;        // Do banco de dados
    email: string;       // Do banco de dados
    image: string | null; // profileImgLink do banco
  };
  expires: string;       // Data de expiração
}
```

### Acessar Sessão no Server Component

```typescript
import { auth } from "@/auth";

export default async function Page() {
  const session = await auth();
  
  console.log(session?.user.id);    // ID do usuário
  console.log(session?.user.name);  // Nome
  console.log(session?.user.email); // Email
  
  return <div>Olá, {session?.user.name}</div>;
}
```

### Acessar Sessão no Client Component

```typescript
"use client";

import { useSession } from "next-auth/react";

export default function ClientPage() {
  const { data: session, status } = useSession();
  
  if (status === "loading") return <div>Loading...</div>;
  if (status === "unauthenticated") return <div>Not authenticated</div>;
  
  return <div>Olá, {session?.user.name}</div>;
}
```

### Acessar Sessão em API Routes

```typescript
// app/api/some-route/route.ts
import { auth } from "@/auth";

export async function GET(request: Request) {
  const session = await auth();
  
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  const userId = session.user.id;
  // Usar userId para queries...
  
  return Response.json({ data: "..." });
}
```

---

## 🔒 Segurança

### Boas Práticas Implementadas

#### 1. Validação de Usuário Ativo

```typescript
if (!user.active) {
  return null; // Não permite login de usuários inativos
}
```

#### 2. Busca Flexível (Email ou Username)

```typescript
where: {
  OR: [
    { email: credentials.userName },
    { login: credentials.userName }
  ]
}
```

#### 3. Proteção CSRF

NextAuth automaticamente protege contra CSRF attacks.

#### 4. Sessões JWT

Sessões são armazenadas em JWT (não em database), reduzindo:
- Queries ao banco em cada request
- Complexidade de gerenciamento de sessões

---

### ⚠️ Melhorias de Segurança Recomendadas

#### 1. **Hash de Senhas com bcrypt**

**Status**: 🚧 TODO

**Implementação**:
```typescript
import bcrypt from "bcrypt";

// Ao criar usuário
const hashedPassword = await bcrypt.hash(password, 10);
await prisma.user.create({
  data: { ...userData, password: hashedPassword }
});

// Ao validar senha
const isValid = await bcrypt.compare(credentials.password, user.password);
if (!isValid) {
  return null;
}
```

#### 2. **Rate Limiting**

**Status**: 🚧 Planejado

Prevenir brute-force attacks:
```typescript
// Implementar com Vercel KV ou Redis
import { Ratelimit } from "@upstash/ratelimit";

const ratelimit = new Ratelimit({
  limiter: Ratelimit.slidingWindow(5, "1 m"), // 5 tentativas por minuto
});

const { success } = await ratelimit.limit(ip);
if (!success) {
  throw new Error("Too many requests");
}
```

#### 3. **Two-Factor Authentication (2FA)**

**Status**: 🚧 Planejado

Adicionar camada extra de segurança:
- TOTP (Google Authenticator)
- SMS verification
- Email verification

#### 4. **Session Timeout**

**Configuração**:
```typescript
export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 dias
  },
});
```

#### 5. **Audit Log**

**Status**: 🚧 Planejado

Registrar tentativas de login:
```typescript
await prisma.auditLog.create({
  data: {
    userId: user.id,
    action: "LOGIN",
    ip: request.headers.get("x-forwarded-for"),
    userAgent: request.headers.get("user-agent"),
    success: true,
  }
});
```

---

## 🔑 Variáveis de Ambiente

### Obrigatórias

```env
# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="sua-chave-secreta-super-segura-aqui"

# Database
DATABASE_URL="mongodb+srv://user:pass@cluster.mongodb.net/barberapp"
```

### Opcionais (OAuth)

```env
# GitHub OAuth
GITHUB_ID="seu-github-client-id"
GITHUB_SECRET="seu-github-client-secret"
```

### Gerar NEXTAUTH_SECRET

```bash
# Linux/Mac
openssl rand -base64 32

# Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

## 🔄 Logout

### Server-Side

```typescript
import { signOut } from "@/auth";

export default async function LogoutButton() {
  return (
    <form action={async () => {
      "use server";
      await signOut();
    }}>
      <button type="submit">Sair</button>
    </form>
  );
}
```

### Client-Side

```typescript
"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button onClick={() => signOut({ callbackUrl: '/login' })}>
      Sair
    </button>
  );
}
```

---

## 🧪 Testando Autenticação

### Usuário de Teste

Para testar o sistema, crie um usuário diretamente no banco:

```typescript
// Script de seed (prisma/seed.ts)
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.user.create({
    data: {
      code: "USR001",
      name: "Admin Teste",
      email: "admin@barberapp.com",
      login: "admin",
      password: "senha123", // TODO: hash com bcrypt
      active: true,
      isRoot: true,
    }
  });
}

main();
```

**Executar**:
```bash
npx ts-node prisma/seed.ts
```

### Credenciais de Teste

- **Email**: `admin@barberapp.com`
- **Username**: `admin`
- **Senha**: `senha123`

---

## 📊 Fluxograma de Decisão de Acesso

```mermaid
flowchart TD
    Start([Usuário tenta acessar rota]) --> CheckRoute{Rota pública?}
    CheckRoute -->|Sim /login| Allow[Permitir acesso]
    CheckRoute -->|Não /app/*| CheckSession{Tem sessão?}
    CheckSession -->|Não| Redirect[Redirecionar para /login]
    CheckSession -->|Sim| ValidateSession{Sessão válida?}
    ValidateSession -->|Não| Redirect
    ValidateSession -->|Sim| CheckActive{Usuário ativo?}
    CheckActive -->|Não| Logout[Encerrar sessão] --> Redirect
    CheckActive -->|Sim| Allow
    Allow --> End([Acesso concedido])
    Redirect --> End
```

---

## 📚 Recursos Úteis

- [NextAuth.js Documentation](https://authjs.dev)
- [NextAuth.js with Next.js 15](https://authjs.dev/getting-started/migrating-to-v5)
- [Prisma + NextAuth](https://authjs.dev/reference/adapter/prisma)
- [JWT Best Practices](https://datatracker.ietf.org/doc/html/rfc8725)

---

<div align="center">

**[⬆ Voltar ao topo](#-autenticação-e-autorização)**

</div>
