# ✂️ Service Endpoints

Documentação dos endpoints de serviços.

---

## 🔌 Endpoints

### CREATE SERVICE
**POST** `/api/createService`

Cria um novo serviço prestado.

```json
{
  "service": {
    "userId": "user_id",
    "customerId": "customer_id",
    "servicesTypes": [
      { "name": "Corte Masculino", "value": 35.00 },
      { "name": "Barba", "value": 25.00 }
    ],
    "servicesValue": 60.00,
    "discount": 10.00,
    "value": 50.00,
    "paymentMethodId": "payment_id"
  }
}
```

### CREATE SERVICE PAYMENT
**POST** `/api/createServicePayment`

Finaliza serviço criando transação financeira vinculada.

### GET USER SERVICES
**GET** `/api/getUserServices?userId=user_id`

Lista serviços de um profissional.

### UPDATE SERVICE
**PUT** `/api/updateService`

### DELETE SERVICE
**DELETE** `/api/deleteService`

---

<div align="center">

**[⬆ Voltar ao topo](#-service-endpoints)**

</div>
