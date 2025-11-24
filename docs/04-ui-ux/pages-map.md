# 🗺️ Mapa de Páginas

Documentação da estrutura de páginas e rotas do BarberApp.

---

## 📋 Estrutura de Rotas

### Páginas Públicas

| Rota | Arquivo | Descrição |
|------|---------|-----------|
| `/login` | `(pages)/login/page.tsx` | Página de autenticação |

### Páginas Protegidas (`/app/*`)

| Rota | Arquivo | Descrição |
|------|---------|-----------|
| `/app/dashboard` | `app/(pages)/dashboard/page.tsx` | Dashboard principal com métricas |
| `/app/scheduling` | `app/(pages)/scheduling/page.tsx` | Calendário e agendamentos |
| `/app/financial` | `app/(pages)/financial/page.tsx` | Gestão financeira e transações |
| `/app/customers` | `app/(pages)/customers/page.tsx` | CRUD de clientes |
| `/app/services` | `app/(pages)/services/page.tsx` | Registro de serviços |
| `/app/users` | `app/(pages)/users/page.tsx` | Gestão de usuários (admin) |
| `/app/settings` | `app/(pages)/settings/page.tsx` | Configurações do sistema |

---

## 📄 Detalhamento das Páginas

### 🏠 Dashboard (`/app/dashboard`)

**Funcionalidades**:
- Visão geral de métricas (receitas, despesas, saldo)
- Gráfico de receitas vs despesas por mês
- Últimas transações
- Próximos agendamentos
- Cadastro rápido de serviço

**Componentes Principais**:
- Gráfico de linha (Recharts)
- Cards de métricas
- Tabela de transações recentes
- Formulário de cadastro rápido

---

### 📅 Scheduling (`/app/scheduling`)

**Funcionalidades**:
- Calendário mensal interativo
- Visualização de agendamentos por profissional
- Criação de novos agendamentos
- Edição/cancelamento de agendamentos
- Filtro por profissional e data

**Componentes Principais**:
- Calendar (Shadcn/UI)
- Dialog para novo agendamento
- Lista de agendamentos do dia
- Seletor de profissional

**Lógica Especial**:
- Geração de horários dinâmicos (baseado em abertura, fechamento e intervalo)
- Prevenção de conflitos de horário
- Status coloridos (agendado, atendido, cancelado)

---

### 💰 Financial (`/app/financial`)

**Funcionalidades**:
- Listagem de todas as transações
- Criação de receitas e despesas
- Filtros por período, tipo e categoria
- Visualização de total de receitas, despesas e saldo
- Edição e exclusão de transações

**Componentes Principais**:
- Tabela de transações
- Dialog para nova transação
- Filtros de data e tipo
- Cards de resumo financeiro

**Categorias**:
- **Receitas**: Serviço, Outras Receitas
- **Despesas**: Despesa Fixa, Compra de Material, Comissão, etc.

---

### 👥 Customers (`/app/customers`)

**Funcionalidades**:
- Listagem de todos os clientes
- Criação de novos clientes
- Edição de dados de clientes
- Exclusão de clientes (se sem vínculos)
- Busca por nome ou telefone
- Visualização de histórico de serviços e agendamentos

**Componentes Principais**:
- Tabela de clientes
- Dialog para cadastro/edição
- Campo de busca
- Badge com código do cliente (CLI0001, CLI0002, ...)

---

### ✂️ Services (`/app/services`)

**Funcionalidades**:
- Registro de serviços prestados
- Seleção de cliente
- Seleção múltipla de tipos de serviços
- Cálculo automático de valor (com desconto)
- Vinculação com método de pagamento
- Geração automática de transação financeira

**Componentes Principais**:
- Formulário de serviço
- Seletor de cliente (com autocomplete)
- Seletor múltiplo de serviços
- Campo de desconto
- Resumo de valores

**Fluxo**:
1. Seleciona cliente
2. Escolhe serviços
3. Aplica desconto (opcional)
4. Seleciona forma de pagamento
5. Confirma → Cria Service + Transaction

---

### 👤 Users (`/app/users`)

**Funcionalidades** (Admin only):
- Listagem de profissionais/admins
- Criação de novos usuários
- Edição de dados de usuários
- Desativação/ativação de usuários
- Configuração de horário de intervalo
- Definição de permissões (admin/barber)

**Componentes Principais**:
- Tabela de usuários
- Dialog para cadastro/edição
- Toggle de ativo/inativo
- Campos de horário de intervalo

---

### ⚙️ Settings (`/app/settings`)

**Funcionalidades** (Planejado):
- Configurações da barbearia (nome, endereço, horários)
- Configurações de notificações
- Gerenciamento de métodos de pagamento
- Gerenciamento de contas bancárias
- Configurações de serviços (tipos e preços)
- Backup e exportação de dados

---

## 🔗 Navegação

### Layout Principal

**Arquivo**: `src/app/app/layout.tsx`

```tsx
<div className="flex">
  <Sidebar />  {/* Navegação lateral */}
  <main className="flex-1">
    <Header />  {/* Cabeçalho com usuário */}
    {children}  {/* Conteúdo da página */}
  </main>
</div>
```

### Sidebar

Itens do menu:
- 🏠 Dashboard
- 📅 Agendamentos
- 💰 Financeiro
- 👥 Clientes
- ✂️ Serviços
- 👤 Usuários (apenas admin)
- ⚙️ Configurações

---

## 🔐 Proteção de Rotas

Todas as rotas `/app/*` são protegidas pelo middleware:

```typescript
// src/middleware.ts
export { auth as middleware } from "@/auth";
```

- Usuários não autenticados → redirecionados para `/login`
- Usuários autenticados → acesso permitido

---

## 📱 Responsividade

Todas as páginas são **responsivas**:
- **Mobile**: Stack vertical, sidebar colapsável
- **Tablet**: Layout otimizado para touch
- **Desktop**: Layout com sidebar fixa

---

<div align="center">

**[⬆ Voltar ao topo](#-mapa-de-páginas)**

</div>
