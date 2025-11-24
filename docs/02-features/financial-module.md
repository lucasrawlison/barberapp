# 💰 Módulo Financeiro

Este documento detalha o sistema de gestão financeira do BarberApp, incluindo transações, relatórios e dashboard analítico.

---

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Tipos de Transações](#tipos-de-transações)
- [Criação de Transações](#criação-de-transações)
- [Dashboard e Métricas](#dashboard-e-métricas)
- [Relatórios](#relatórios)
- [APIs](#apis)

---

## 🔍 Visão Geral

O módulo financeiro do BarberApp oferece controle completo sobre todas as transações financeiras da barbearia, permitindo:

- ✅ Registro de receitas (serviços e outras entradas)
- ✅ Registro de despesas (fixas e variáveis)
- ✅ Análise de faturamento mensal
- ✅ Gráficos comparativos de receitas vs despesas
- ✅ Filtros por período e categoria
- ✅ Vinculação com métodos de pagamento e contas bancárias

---

## 💵 Tipos de Transações

### 1. Receitas

Transações do tipo `"Receita"` representam entradas de dinheiro.

#### Categorias de Receita

| Categoria | Descrição | Vinculação |
|-----------|-----------|------------|
| `Serviço` | Serviços prestados | Vinculado a `Service` |
| `Outras Receitas` | Vendas de produtos, gorjetas, etc | Sem vinculação |

#### Exemplo de Receita de Serviço

```typescript
{
  description: "Corte + Barba - João Silva",
  value: 60.00,
  type: "Receita",
  category: "Serviço",
  serviceId: "service_123...",
  paymentMethodId: "pix_payment_id",
  userId: "barber_user_id",
  date: "2025-01-20T14:30:00.000Z"
}
```

### 2. Despesas

Transações do tipo `"Despesa"` representam saídas de dinheiro.

#### Categorias de Despesa

| Categoria | Exemplos |
|-----------|----------|
| `Despesa Fixa` | Aluguel, água luz, internet, salários |
| `Compra de Material` | Produtos, equipamentos, ferramentas |
| `Comissão` | Comissões de profissionais |
| `Manutenção` | Reparos, limpeza |
| `Marketing` | Publicidade, redes sociais |
| `Outras Despesas` | Diversos |

#### Exemplo de Despesa

```typescript
{
  description: "Aluguel - Janeiro/2025",
  value: 1500.00,
  type: "Despesa",
  category: "Despesa Fixa",
  paymentMethodId: "transferencia_id",
  userId: "admin_user_id",
  date: "2025-01-05T10:00:00.000Z"
}
```

---

## 📝 Criação de Transações

### API Endpoint

**POST** `/api/createTransaction`

#### Request Body

```typescript
{
  "newTransaction": {
    "description": string,        // Obrigatório
    "value": number,             // Obrigatório (exceto se Receita de Serviço)
    "date": string,              // ISO date string
    "category": string,          // Obrigatório
    "type": "Receita" | "Despesa", // Obrigatório
    "paymentMethodId": string,   // Obrigatório
    "serviceId"?: string        // Opcional (apenas para Receita de Serviço)
  },
  "userId": string               // ID do usuário que está criando
}
```

#### Response (Success)

```json
{
  "message": "New transaction inserted",
  "transaction": {
    "id": "transaction_id_123",
    "description": "Aluguel - Janeiro/2025",
    "value": 1500.00,
    "date": "2025-01-05T10:00:00.000Z",
    "category": "Despesa Fixa",
    "type": "Despesa",
    "userId": "user_id",
    "paymentMethodId": "payment_method_id",
    "bankAccountId": "bank_account_id"
  }
}
```

### Validações

**Arquivo**: `src/app/api/createTransaction/route.ts`

```typescript
// 1. Validar tipo
if (!type) {
  return NextResponse.json(
    { message: "É necessário informar um tipo para a transação" },
    { status: 400 }
  );
}

// 2. Validar valor (obrigatório exceto para Receita de Serviço)
if ((category !== "Serviço" && type === "Receita" && !value) || 
    (type === "Despesa" && !value)) {
  return NextResponse.json(
    { message: "Insira o valor da transação" },
    { status: 400 }
  );
}

// 3. Validar descrição
if (!description) {
  return NextResponse.json(
    { message: "É necessário informar uma descrição para a transação" },
    { status: 400 }
  );
}

// 4. Validar categoria
if (!category) {
  return NextResponse.json(
    { message: "É necessário informar uma categoria para a transação" },
    { status: 400 }
  );
}

// 5. Validar método de pagamento
if (!paymentMethodId) {
  return NextResponse.json(
    { message: "Selecione um método de pagamento" },
    { status: 400 }
  );
}

// 6. Validar data
if (!date) {
  return NextResponse.json(
    { message: "Insira a data em que a transação foi realizada" },
    { status: 400 }
  );
}
```

### Vinculação Automática com Conta Bancária

```typescript
// Buscar método de pagamento para obter conta bancária vinculada
const paymentMethod = await prisma.paymentMethod.findUnique({
  where: { id: paymentMethodId },
});

// Criar transação com conta bancária automaticamente vinculada
const transaction = await prisma.transactions.create({
  data: {
    // ...outros dados,
    bankAccountId: paymentMethod?.bankId,  // Vinculação automática
  },
});
```

---

## 📊 Dashboard e Métricas

### Dados do Dashboard

O dashboard apresenta:

1. **Gráfico de Receitas vs Despesas** (mensal)
2. **Total de Receitas** (período)
3. **Total de Despesas** (período)
4. **Saldo** (Receitas - Despesas)
5. **Transações Recentes**

### API de Overview

**GET** `/api/getOverviewData`

**Headers**:
```
Userid: <user_id>
```

#### Lógica de Cálculo

**Arquivo**: `src/app/api/getOverviewData/route.ts`

```typescript
export async function GET(request: Request) {
  const userId = request.headers.get("Userid");
  
  // 1. Validar permissão (apenas admin)
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (user?.profileType !== "admin") {
    return NextResponse.json(
      { message: "User is not admin" },
      { status: 403 }
    );
  }

  // 2. Buscar todas as transações
  const transactions = await prisma.transactions.findMany({
    orderBy: { id: "desc" },
  });

  // 3. Agrupar por mês
  const revenueByMonth: { [key: string]: number } = {};
  const expenseByMonth: { [key: string]: number } = {};

  transactions.forEach((transaction) => {
    const date = new Date(transaction.date);
    const month = date.toLocaleString("pt-BR", { month: "short" });
    const formattedMonth = month.charAt(0).toUpperCase() + month.slice(1);

    if (transaction.type === "Receita") {
      revenueByMonth[formattedMonth] = 
        (revenueByMonth[formattedMonth] || 0) + transaction.value;
    } else if (transaction.type === "Despesa") {
      expenseByMonth[formattedMonth] = 
        (expenseByMonth[formattedMonth] || 0) + transaction.value;
    }
  });

  // 4. Ordenar meses cronologicamente
  const monthOrder = [
    "Jan.", "Fev.", "Mar.", "Abr.", "Mai.", "Jun.",
    "Jul.", "Ago.", "Set.", "Out.", "Nov.", "Dez."
  ];

  const allMonths = Array.from(new Set([
    ...Object.keys(revenueByMonth),
    ...Object.keys(expenseByMonth),
  ])).sort((a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b));

  // 5. Montar dados do gráfico
  const chartData = allMonths.map((month) => ({
    month,
    revenue: revenueByMonth[month] || 0,
    expenses: expenseByMonth[month] || 0,
  }));

  return NextResponse.json({ chartData }, { status: 200 });
}
```

#### Response

```json
{
  "chartData": [
    { "month": "Jan.", "revenue": 4500.00, "expenses": 2300.00 },
    { "month": "Fev.", "revenue": 5200.00, "expenses": 2100.00 },
    { "month": "Mar.", "revenue": 4800.00, "expenses": 2500.00 }
  ]
}
```

---

## 📈 Gráficos

### Visualização com Recharts

```typescript
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

<LineChart width={600} height={300} data={chartData}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="month" />
  <YAxis />
  <Tooltip />
  <Legend />
  <Line type="monotone" dataKey="revenue" stroke="#10b981" name="Receitas" />
  <Line type="monotone" dataKey="expenses" stroke="#ef4444" name="Despesas" />
</LineChart>
```

### Métricas Calculadas

```typescript
// Totais do período
const totalRevenue = chartData.reduce((sum, item) => sum + item.revenue, 0);
const totalExpenses = chartData.reduce((sum, item) => sum + item.expenses, 0);
const balance = totalRevenue - totalExpenses;

// Crescimento mês a mês
const currentMonth = chartData[chartData.length - 1];
const previousMonth = chartData[chartData.length - 2];
const revenueGrowth = 
  ((currentMonth.revenue - previousMonth.revenue) / previousMonth.revenue) * 100;
```

---

## 📑 Relatórios

### Filtros Disponíveis

1. **Por Período**
   - Mês atual
   - Últimos 3 meses
   - Últimos 6 meses
   - Ano atual
   - Personalizado (data início - data fim)

2. **Por Tipo**
   - Todas
   - Apenas Receitas
   - Apenas Despesas

3. **Por Categoria**
   - Todas
   - Categoria específica

4. **Por Método de Pagamento**
   - Todos
   - Dinheiro, PIX, Cartão, etc.

### Queries de Exemplo

```typescript
// Transações do mês atual
const startOfMonth = new Date(year, month, 1);
const endOfMonth = new Date(year, month + 1, 0);

const monthlyTransactions = await prisma.transactions.findMany({
  where: {
    date: {
      gte: startOfMonth,
      lte: endOfMonth,
    },
  },
  include: {
    paymentMethod: true,
    user: { select: { name: true } },
  },
  orderBy: { date: 'desc' },
});

// Top categorias de despesa
const expensesByCategory = await prisma.transactions.groupBy({
  by: ['category'],
  where: { type: 'Despesa' },
  _sum: { value: true },
  orderBy: { _sum: { value: 'desc' } },
});
```

---

## 🔗 APIs Relacionadas

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/createTransaction` | Criar transação |
| GET | `/api/getAllTransactions` | Listar todas as transações |
| GET | `/api/getMonthTransactions` | Transações do mês |
| GET | `/api/getOverviewData` | Dados do dashboard |
| PUT | `/api/updateTransaction` | Atualizar transação |
| DELETE | `/api/deleteTransaction` | Deletar transação |

---

## 🎯 Métricas de Negócio

### KPIs Principais

```typescript
// Ticket Médio
const averageTicket = totalRevenue / numberOfServices;

// Receita Média Diária
const averageDailyRevenue = totalRevenue / daysInPeriod;

// Margem de Lucro
const profitMargin = ((totalRevenue - totalExpenses) / totalRevenue) * 100;

// Despesas Fixas vs Variáveis
const fixedExpenses = transactions
  .filter(t => t.type === 'Despesa' && t.category === 'Despesa Fixa')
  .reduce((sum, t) => sum + t.value, 0);

const variableExpenses = totalExpenses - fixedExpenses;
```

---

## 🔮 Melhorias Futuras

- [ ] Exportação de relatórios em PDF/Excel
- [ ] Conciliação bancária automática
- [ ] Previsão de fluxo de caixa
- [ ] Categorias customizáveis
- [ ] Metas de faturamento
- [ ] Alertas de despesas acima do orçamento
- [ ] Integração com gateways de pagamento
- [ ] Multi-moeda

---

<div align="center">

**[⬆ Voltar ao topo](#-módulo-financeiro)**

</div>
