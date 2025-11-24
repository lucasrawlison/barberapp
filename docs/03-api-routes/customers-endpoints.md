# 👥 Customer Endpoints

Documentação dos endpoints de clientes.

---

## 🔌 Endpoints

### CREATE CUSTOMER
**POST** `/api/createCustomer`

```json
{
  "customer": {
    "name": "João Silva",
    "phone": "11987654321",
    "email": "joao@email.com"
  }
}
```

Código automático gerado: `CLI0001`, `CLI0002`, etc.

### GET CUSTOMERS
**GET** `/api/getCustomers`

Lista todos os clientes.

### UPDATE CUSTOMER
**PUT** `/api/updateCustomer`

```json
{
  "customerId": "customer_id",
  "updateData": {
    "name": "João Silva Santos",
    "phone": "11999999999"
  }
}
```

### DELETE CUSTOMER
**DELETE** `/api/deleteCustomer`

```json
{
  "customerId": "customer_id"
}
```

---

<div align="center">

**[⬆ Voltar ao topo](#-customer-endpoints)**

</div>
