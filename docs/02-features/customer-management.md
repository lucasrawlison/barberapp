# 👥 Gestão de Clientes

Documentação do módulo de gestão de clientes do BarberApp.

---

## 🔍 Visão Geral

O módulo de clientes permite cadastrar, visualizar, editar e gerenciar a base de clientes da barbearia.

### Funcionalidades

- ✅ CRUD completo de clientes
- ✅ Busca e filtros
- ✅ Histórico de serviços
- ✅ Histórico de agendamentos
- ✅ Código único automático

---

## 📦 Modelo de Dados

```prisma
model Customer {
  id         String       @id @default(auto()) @map("_id") @db.ObjectId
  code       String       @unique  // CLI0001, CLI0002, ...
  name       String       // Nome completo
  email      String?      // Email (opcional)
  phone      String       // Telefone (obrigatório)
  
  services   Service[]    // Histórico de serviços
  scheduling Scheduling[] // Histórico de agendamentos
}
```

---

## 🔌 APIs

### CREATE - Criar Cliente

**POST** `/api/createCustomer`

```json
{
  "customer": {
    "name": "João Silva",
    "phone": "11987654321",
    "email": "joao@email.com"  // opcional
  }
}
```

**Código Automático**: Sistema gera `code` sequencial (CLI0001, CLI0002, ...).

### READ - Listar Clientes

**GET** `/api/getCustomers`

```json
{
  "customers": [
    {
      "id": "...",
      "code": "CLI0001",
      "name": "João Silva",
      "phone": "11987654321",
      "email": "joao@email.com"
    }
  ]
}
```

### UPDATE - Atualizar Cliente

**PUT** `/api/updateCustomer`

```json
{
  "customerId": "customer_id_123",
  "updateData": {
    "name": "João Silva Santos",
    "phone": "11999999999"
  }
}
```

### DELETE - Deletar Cliente

**DELETE** `/api/deleteCustomer`

```json
{
  "customerId": "customer_id_123"
}
```

⚠️ **Nota**: Deleta apenas se não houver serviços ou agendamentos vinculados.

---

## 🔍 Buscas e Filtros

```typescript
// Busca por nome (case-insensitive)
const customers = await prisma.customer.findMany({
  where: {
  name: {
      contains: searchTerm,
      mode: 'insensitive'
    }
  },
  orderBy: { name: 'asc' }
});

// Busca por telefone
const customer = await prisma.customer.findFirst({
  where: { phone: phoneNumber }
});
```

---

## 📊 Histórico do Cliente

```typescript
// Cliente com histórico completo
const customerWithHistory = await prisma.customer.findUnique({
  where: { id: customerId },
  include: {
    services: {
      orderBy: { createdAt: 'desc' },
      take: 10
    },
    scheduling: {
      where: { status: 'atendido' },
      orderBy: { dateTime: 'desc' }
    }
  }
});

// Estatísticas do cliente
const totalSpent = customerWithHistory.services.reduce(
  (sum, service) => sum + service.value, 0
);
const totalVisits = customerWithHistory.services.length;
const averageTicket = totalSpent / totalVisits;
```

---

## ✅ Validações

- **Nome**: Obrigatório, mínimo 2 caracteres
- **Telefone**: Obrigatório, formato válido (10-11 dígitos)
- **Email**: Opcional, formato de email válido
- **Código**: Gerado automaticamente, único

---

## 🔮 Melhorias Futuras

- [ ] Programa de fidelidade
- [ ] Tags/categorias de clientes
- [ ] Notas/observações sobre preferências
- [ ] Aniversários com notificações automáticas
- [ ] Importação/exportação de clientes
- [ ] Integração com WhatsApp

---

<div align="center">

**[⬆ Voltar ao topo](#-gestão-de-clientes)**

</div>
