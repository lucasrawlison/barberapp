# ✂️ BarberApp

<div align="center">

![Status](https://img.shields.io/badge/status-active-success.svg)
![Next.js](https://img.shields.io/badge/Next.js-15.2-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Prisma](https://img.shields.io/badge/Prisma-6.9-2D3748)
![MongoDB](https://img.shields.io/badge/MongoDB-6.15-47A248)
![License](https://img.shields.io/badge/license-Private-red.svg)

**Sistema de Gestão Completo para Barbearias**

[Documentação](#documentação) • [Instalação](#instalação) • [Deploy](#deploy) • [Contribuir](./CONTRIBUTING.md)

</div>

---

## 📋 Sobre o Projeto

BarberApp é uma aplicação fullstack moderna desenvolvida para gerenciar todos os aspectos de uma barbearia. Construído com Next.js 15 e arquitetura serverless, o sistema oferece funcionalidades completas de agendamento, gestão financeira, controle de clientes e relatórios analíticos.

### ✨ Principais Funcionalidades

- 📅 **Agendamento Inteligente**: Sistema de calendário com horários dinâmicos e gestão de disponibilidade
- 💰 **Gestão Financeira**: Controle completo de entradas, saídas, transações e relatórios
- 👥 **Gestão de Clientes**: Cadastro, histórico e relacionamento com clientes
- 💼 **Gestão de Serviços**: Catálogo de serviços, precificação e pacotes
- 👨‍💼 **Multi-usuários**: Sistema de permissões e controle de acesso
- 📊 **Dashboard Analítico**: Métricas e KPIs em tempo real
- 🔐 **Autenticação Segura**: NextAuth com sessões protegidas

---

## 🚀 Tech Stack

### Core Framework
- **Next.js 15.2** - App Router com Server Components
- **TypeScript** - Tipagem estática e segurança de tipos
- **React 18.2** - Interface reativa e componentes modernos

### Backend & Database
- **Prisma 6.9** - ORM moderno e type-safe
- **MongoDB 6.15** - Banco de dados NoSQL escalável
- **NextAuth 5.0** - Autenticação e autorização

### Frontend & UI
- **TailwindCSS 3.4** - Framework CSS utility-first
- **Shadcn/UI** - Biblioteca de componentes acessíveis
- **Radix UI** - Componentes primitivos headless
- **Lucide React** - Ícones modernos e consistentes

### Bibliotecas Complementares
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de schemas
- **date-fns** - Manipulação de datas
- **Recharts** - Gráficos e visualizações
- **Axios** - Cliente HTTP

---

## 📦 Instalação

### Pré-requisitos

- Node.js 20+ instalado
- MongoDB configurado (local ou cloud)
- Git para versionamento

### Passo a Passo

```bash
# 1. Clone o repositório
git clone <repository-url>
cd barberapp

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
# Copie o arquivo .env.example para .env e preencha os valores
cp .env.example .env

# 4. Gere o cliente do Prisma
npx prisma generate

# 5. (Opcional) Execute as migrations do banco
npx prisma db push

# 6. Inicie o servidor de desenvolvimento
npm run dev
```

O aplicativo estará disponível em `http://localhost:3000`

---

## 🔐 Variáveis de Ambiente

Configure as seguintes variáveis no arquivo `.env`:

```env
# Database
DATABASE_URL="mongodb+srv://usuario:senha@cluster.mongodb.net/barberapp"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="seu-secret-super-seguro-aqui"

# GitHub OAuth (Opcional)
GITHUB_ID="seu-github-client-id"
GITHUB_SECRET="seu-github-client-secret"
```

> ⚠️ **Importante**: Nunca commite o arquivo `.env` com valores reais. Use `.env.example` como template.

---

## 📜 Scripts Disponíveis

```bash
# Desenvolvimento com Turbopack
npm run dev

# Build de produção
npm run build

# Iniciar servidor de produção
npm start

# Linting de código
npm run lint

# Gerar cliente Prisma
npx prisma generate

# Abrir Prisma Studio (GUI do banco)
npx prisma studio
```

---

## 🏗️ Estrutura do Projeto

```
barberapp/
├── prisma/                 # Schema e configuração do Prisma
│   └── schema.prisma      # Modelos do banco de dados
├── public/                # Arquivos estáticos
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── (pages)/      # Páginas da aplicação
│   │   │   ├── dashboard/
│   │   │   ├── scheduling/
│   │   │   ├── financial/
│   │   │   ├── customers/
│   │   │   ├── services/
│   │   │   ├── users/
│   │   │   └── settings/
│   │   ├── api/          # API Routes (Backend)
│   │   ├── app/          # Layout e componentes base
│   │   └── login/        # Autenticação
│   ├── components/       # Componentes React
│   │   └── ui/          # Componentes Shadcn/UI
│   ├── hooks/           # Custom Hooks
│   ├── lib/             # Utilitários e configurações
│   ├── auth.ts          # Configuração NextAuth
│   └── middleware.ts    # Middleware de autenticação
├── docs/                # Documentação detalhada
└── package.json
```

---

## 📚 Documentação

A documentação completa está organizada na pasta `docs/`:

### 🏛️ Arquitetura
- [Tech Stack](./docs/01-architecture/tech-stack.md)
- [Database Schema](./docs/01-architecture/database-schema.md)
- [Autenticação](./docs/01-architecture/authentication.md)

### 🎯 Funcionalidades
- [Fluxo de Agendamento](./docs/02-features/scheduling-flow.md)
- [Módulo Financeiro](./docs/02-features/financial-module.md)
- [Gestão de Clientes](./docs/02-features/customer-management.md)

### 🔌 API Routes
- [User Endpoints](./docs/03-api-routes/users-endpoints.md)
- [Transaction Endpoints](./docs/03-api-routes/transactions-endpoints.md)
- [Service Endpoints](./docs/03-api-routes/services-endpoints.md)
- [Customer Endpoints](./docs/03-api-routes/customers-endpoints.md)
- [Scheduling Endpoints](./docs/03-api-routes/scheduling-endpoints.md)

### 🎨 UI/UX
- [Biblioteca de Componentes](./docs/04-ui-ux/component-library.md)
- [Tema e Estilização](./docs/04-ui-ux/theme-and-styling.md)
- [Mapa de Páginas](./docs/04-ui-ux/pages-map.md)

---

## 🚀 Deploy

### Vercel (Recomendado)

1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático a cada push

```bash
# Ou via CLI
npm install -g vercel
vercel --prod
```

### Outros Provedores

O projeto é compatível com qualquer plataforma que suporte Next.js:
- Railway
- Render
- AWS Amplify
- Google Cloud Run

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor, leia o [Guia de Contribuição](./CONTRIBUTING.md) antes de submeter PRs.

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## 📝 Changelog

Veja o [CHANGELOG.md](./CHANGELOG.md) para histórico de versões e atualizações.

---

## 👥 Autores

- **Lucas Rawlison** - *Desenvolvimento Inicial*

---

## 📄 Licença

Este projeto é proprietário e privado. Todos os direitos reservados.

---

## 🆘 Suporte

Para reportar bugs ou solicitar features:
- Abra uma issue no repositório
- Entre em contato com a equipe de desenvolvimento

---

<div align="center">

**[⬆ Voltar ao topo](#-barberapp)**

Feito com ❤️ por Lucas Rawlison

</div>
