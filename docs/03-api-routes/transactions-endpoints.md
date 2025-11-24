# 💳 Transaction Endpoints

Documentação dos endpoints de transações financeiras.

---

## 🔌 Endpoints

### CREATE TRANSACTION
**POST** `/api/createTransaction`

```json
{
  "newTransaction": {  
    "description": "Aluguel - Janeiro",
    "value": 1500.00,
    "date": "2025-01-05",
    "category": "Despesa Fixa",
    "type": "Despesa",
    "paymentMethodId": "payment_id"
  },
  "userId": "user_id"
}
```

### GET ALL TRANSACTIONS
**GET** `/api/getAllTransactions`

### GET MONTH TRANSACTIONS
**GET** `/api/getMonthTransactions?month=1&year=2025`

### GET OVERVIEW DATA
**GET** `/api/getOverviewData`
**Headers**: `Userid: user_id`

Retorna dados agregados para dashboard (receitas e despesas por mês).

### UPDATE TRANSACTION
**PUT** `/api/updateTransaction`

### DELETE TRANSACTION
**DELETE** `/api/deleteTransaction`

---

<div align="center">

**[⬆ Voltar ao topo](#-transaction-endpoints)**

</div>
