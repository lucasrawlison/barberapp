# 👤 User Endpoints

Documentação completa dos endpoints de usuários do BarberApp.

---

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Endpoints](#endpoints)
- [Modelos de Dados](#modelos-de-dados)
- [Validações](#validações)

---

## 🔍 Visão Geral

Os endpoints de usuários gerenciam os profissionais e administradores do sistema.

**Base URL**: `/api`

---

## 🔌 Endpoints

### 1. CREATE USER

**POST** `/api/createUser`

Cria um novo usuário (profissional/admin).

#### Request

```json
{
  "user": {
    "name": "Carlos Barbeiro",
    "email": "carlos@barber.com",
    "login": "carlos",
    "password": "senha123",
    "phone": "11987654321",
    "profileType": "barber",
    "breakAt": "12:00",
    "breakEndAt": "13:00",
    "barbershopId": "barbershop_id_123"
  }
}
```

#### Response (200)

```json
{
  "message": "New user inserted",
  "newUser": {
    "id": "user_id_123",
    "code": "USR0001",
    "name": "Carlos Barbeiro",
    "email": "carlos@barber.com",
    "login": "carlos",
    "active": true,
    "isRoot": false,
    "profileType": "barber"
  }
}
```

#### Validações

- ✅ Nome obrigatório
- ✅ Email único e válido
- ✅ Login único
- ✅ Senha mínimo 6 caracteres
- ✅ Código gerado automaticamente (USR0001, USR0002, ...)

---

### 2. GET USERS

**GET** `/api/getUsers`

Lista todos os usuários.

#### Response (200)

```json
{
  "users": [
    {
      "id": "user_id_123",
      "code": "USR0001",
      "name": "Carlos Barbeiro",
      "email": "carlos@barber.com",
      "login": "carlos",
      "active": true,
      "profileType": "barber",
      "phone": "11987654321",
      "breakAt": "12:00",
      "breakEndAt": "13:00"
    }
  ]
}
```

---

### 3. GET ACTIVE USER

**POST** `/api/getActiveUser`

Busca usuário autenticado pela sessão.

#### Request

```json
{
  "email": "carlos@barber.com"
}
```

#### Response (200)

```json
{
  "user": {
    "id": "user_id_123",
    "name": "Carlos Barbeiro",
    "email": "carlos@barber.com",
    "barbershop": {
      "id": "barbershop_id",
      "name": "Barbearia Top"
    }
  }
}
```

---

### 4. CHECK USER

**POST** `/api/checkUser`

Verifica se usuário existe (por email ou login).

#### Request

```json
{
  "identifier": "carlos@barber.com"
}
```

#### Response (200)

```json
{
  "exists": true,
  "user": {
    "id": "user_id_123",
    "name": "Carlos Barbeiro",
    "active": true
  }
}
```

---

### 5. UPDATE USER

**PUT** `/api/updateUser`

Atualiza dados de um usuário.

#### Request

```json
{
  "userId": "user_id_123",
  "updateData": {
    "name": "Carlos Barbeiro Silva",
    "phone": "11999999999",
    "breakAt": "13:00",
    "breakEndAt": "14:00"
  }
}
```

#### Response (200)

```json
{
  "message": "User updated successfully",
  "user": { /* dados atualizados */ }
}
```

#### Campos Atualizáveis

- `name`
- `phone`
- `breakAt`, `breakEndAt`
- `notifications`
- `profileImgLink`
- **Não atualizável**: `email`, `login`, `code`

---

### 6. DELETE USER

**DELETE** `/api/deleteUser`

Desativa usuário (soft delete).

#### Request

```json
{
  "userId": "user_id_123"
}
```

#### Response (200)

```json
{
  "message": "User deactivated successfully"
}
```

⚠️ **Nota**: Usuários não são deletados fisicamente, apenas marcados como `active: false`.

---

## 📦 Modelo de Dados

```typescript
interface User {
  id: string;
  code: string;               // USR0001, USR0002, ...
  name: string;
  email: string;              // Único
  login: string;              // Único
  password: string;           // Hash (TODO: bcrypt)
  phone?: string;
  profileType: string;        // "admin" | "barber"
  active: boolean;            // true = ativo
  isRoot: boolean;            // Super admin
  notifications: boolean;
  profileImgLink?: string;
  breakAt?: string;           // "12:00"
  breakEndAt?: string;        // "13:00"
  barbershopId?: string;
}
```

---

## ✅ Validações Gerais

### Email
- Formato válido
- Único no sistema
- Obrigatório

### Login
- Único no sistema
- Alfanumérico
- Obrigatório

### Password
- TODO: Hash com bcrypt
- Mínimo 6 caracteres
- Obrigatório na criação

### Profile Type
- Valores permitidos: `"admin"`, `"barber"`
- Default: `"admin"`

### Horário de Intervalo
- Formato: `"HH:mm"`
- `breakAt` < `breakEndAt`
- Opcional

---

## 🔐 Permissões

### Rotas Protegidas

- Todas requerem autenticação
- Algumas requerem `profileType: "admin"`

### Exemplo de Verificação

```typescript
const user = await auth();
if (!user) {
  return Response.json({ error: "Unauthorized" }, { status: 401 });
}

const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
if (dbUser.profileType !== "admin") {
  return Response.json({ error: "Forbidden" }, { status: 403 });
}
```

---

## 📊 Queries Úteis

```typescript
// Usuários ativos
const activeUsers = await prisma.user.findMany({
  where: { active: true },
  select: { id: true, name: true, email: true }
});

// Usuários por tipo
const barbers = await prisma.user.findMany({
  where: { profileType: "barber", active: true }
});

// Usuário com estatísticas
const userWithStats = await prisma.user.findUnique({
  where: { id: userId },
  include: {
    services: { take: 10 },
    scheduling: { where: { status: "agendado" } },
    _count: {
      select: { services: true, scheduling: true }
    }
  }
});
```

---

<div align="center">

**[⬆ Voltar ao topo](#-user-endpoints)**

</div>
