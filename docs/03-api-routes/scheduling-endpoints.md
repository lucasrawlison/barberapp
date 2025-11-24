# 📅 Scheduling Endpoints

Documentação dos endpoints de agendamento.

---

## 🔌 Endpoints

### CREATE SCHEDULING
**POST** `/api/createScheduling`

```json
{
  "scheduling": {
    "customer": { "id": "customer_id" },
    "user": { 
      "id": "user_id",
      "barbershop": { "id": "barbershop_id" }
    },
    "date": "2025-01-20",
    "time": "14:30",
    "servicesTypes": [
      { "name": "Corte", "value": 35.00 }
    ],
    "description": "Observações opcionais"
  }
}
```

### GET USER SCHEDULINGS
**GET** `/api/getUserSchedulings?userId=user_id&date=2025-01-20`

Lista agendamentos de um profissional em uma data específica.

### UPDATE SCHEDULING
**PUT** `/api/updateScheduling`

Atualiza status ou dados do agendamento.

### DELETE SCHEDULING  
**DELETE** `/api/deleteScheduling`

Cancela agendamento (status = cancelado).

---

## 📊 Status de Agendamento

- `agendado`: Confirmado
- `pendente`: Aguardando confirmação
- `atendido`: Concluído
- `cancelado`: Cancelado

---

<div align="center">

**[⬆ Voltar ao topo](#-scheduling-endpoints)**

</div>
