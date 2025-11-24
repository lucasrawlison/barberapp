# 📚 Documentação BarberApp

Bem-vindo à documentação completa do BarberApp - Sistema de Gestão para Barbearias.

---

## 🗂️ Índice Geral

Esta documentação está organizada em 4 seções principais:

### 01. Arquitetura
Documentação técnica da arquitetura do sistema.

- **[Tech Stack](./01-architecture/tech-stack.md)**
  - Stack tecnológico completo
  - Justificativas de escolhas
  - Diagramas de arquitetura

- **[Database Schema](./01-architecture/database-schema.md)**
  - Modelos do Prisma
  - Relacionamentos
  - Diagrama ER
  - Índices e performance

- **[Autenticação](./01-architecture/authentication.md)**
  - NextAuth configuração
  - Fluxo de autenticação
  - Proteção de rotas
  - Segurança

---

### 02. Funcionalidades
Documentação das features do sistema.

- **[Fluxo de Agendamento](./02-features/scheduling-flow.md)**
  - Sistema de calendário
  - Horários dinâmicos
  - Status de agendamento
  - Prevenção de conflitos

- **[Módulo Financeiro](./02-features/financial-module.md)**
  - Transações (receitas e despesas)
  - Dashboard analítico
  - Relatórios
  - Métricas de negócio

- **[Gestão de Clientes](./02-features/customer-management.md)**
  - CRUD de clientes
  - Histórico de serviços
  - Buscas e filtros

---

### 03. API Routes
Referência completa dos endpoints.

- **[User Endpoints](./03-api-routes/users-endpoints.md)**
  - CRUD de usuários
  - Validações
  - Permissões

- **[Transaction Endpoints](./03-api-routes/transactions-endpoints.md)**
  - Criação de transações
  - Listagem e filtros
  - Dashboard data

- **[Service Endpoints](./03-api-routes/services-endpoints.md)**
  - Registro de serviços
  - Pagamentos vinculados

- **[Customer Endpoints](./03-api-routes/customers-endpoints.md)**
  - Gerenciamento de clientes
  - Código automático

- **[Scheduling Endpoints](./03-api-routes/scheduling-endpoints.md)**
  - Criação de agendamentos
  - Gestão de status

---

### 04. UI/UX
Documentação da interface e design.

- **[Biblioteca de Componentes](./04-ui-ux/component-library.md)**
  - 29 componentes Shadcn/UI
  - Exemplos de uso
  - Customização

- **[Tema e Estilização](./04-ui-ux/theme-and-styling.md)**
  - Sistema de cores (design tokens)
  - Dark mode
  - Tipografia e espaçamento
  - Animações

- **[Mapa de Páginas](./04-ui-ux/pages-map.md)**
  - Estrutura de rotas
  - Descrição de cada página
  - Navegação

---

## 🚀 Início Rápido

### 1. Pré-requisitos

- Node.js 20+
- MongoDB (local ou Atlas)
- Git

### 2. Instalação

```bash
# Clone o repositório
git clone <repository-url>
cd barberapp

# Instale dependências
npm install

# Configure variáveis de ambiente
cp .env.example .env
# Edite .env com suas credenciais

# Gere o Prisma Client
npx prisma generate

# Inicie o servidor
npm run dev
```

### 3. Acesse a aplicação

Abra `http://localhost:3000` no navegador.

---

## 📖 Guias Adicionais

### Na Raiz do Projeto

- **[README.md](../README.md)** - Visão geral e quickstart
- **[CONTRIBUTING.md](../CONTRIBUTING.md)** - Como contribuir
- **[CHANGELOG.md](../CHANGELOG.md)** - Histórico de versões

---

## 📊 Diagramas Principais

### Arquitetura do Sistema

```
Next.js 15 (App Router)
    ↓
┌─────────────────────┬─────────────────────┐
│   Server Components │  API Routes         │
│   (Frontend)        │  (Backend)          │
└─────────────────────┴─────────────────────┘
    ↓                        ↓
┌─────────────────────┬─────────────────────┐
│   React Components  │  Prisma ORM         │
│   Shadcn/UI         │  (Database Client)  │
└─────────────────────┴─────────────────────┘
                           ↓
                    ┌──────────────┐
                    │  MongoDB     │
                    │  Atlas       │
                    └──────────────┘
```

### Fluxo de Dados

```
User → Frontend → API Route → Prisma → MongoDB
                     ↓
                NextAuth (Autenticação)
```

---

## 🔗 Links Úteis

### Tecnologias

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [MongoDB Documentation](https://www.mongodb.com/docs)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [Shadcn/UI Components](https://ui.shadcn.com)
- [NextAuth Documentation](https://authjs.dev)

### Ferramentas

- [Prisma Studio](https://www.prisma.io/studio) - Database GUI
- [MongoDB Compass](https://www.mongodb.com/products/compass) - MongoDB GUI
- [Vercel](https://vercel.com) - Deployment platform

---

## 🎯 Roadmap

### v0.4.0 (Q2 2025)
- [ ] Notificações WhatsApp
- [ ] Relatórios PDF
- [ ] Sistema de comissões
- [ ] Multi-tenant

### v0.5.0 (Q3 2025)
- [ ] App mobile
- [ ] Programa de fidelidade
- [ ] Integração Instagram

### v1.0.0 (Q4 2025)
- [ ] Versão estável de produção
- [ ] Testes end-to-end
- [ ] Internacionalização (i18n)

---

## 💡 FAQ

### Como faço para...

**...adicionar um novo endpoint?**
1. Crie arquivo em `src/app/api/nome-do-endpoint/route.ts`
2. Documente em `docs/03-api-routes/`

**...criar um novo componente UI?**
1. Use `npx shadcn-ui@latest add <component>`
2. Ou crie manualmente em `src/components/ui/`

**...modificar o schema do banco?**
1. Edite `prisma/schema.prisma`
2. Execute `npx prisma db push`
3. Execute `npx prisma generate`

**...fazer deploy?**
1. Conecte repositório ao Vercel
2. Configure variáveis de ambiente
3. Deploy automático

---

## 🤝 Contribuindo

Leia o [Guia de Contribuição](../CONTRIBUTING.md) para saber como contribuir com o projeto.

---

## 📝 Licença

Este projeto é proprietário e privado. Todos os direitos reservados.

---

## 👥 Equipe

- **Lucas Rawlison** - *Desenvolvimento Inicial*

---

<div align="center">

**[⬆ Voltar ao topo](#-documentação-barberapp)**

Feito com ❤️ para revolucionar a gestão de barbearias

</div>
