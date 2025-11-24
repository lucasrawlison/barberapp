# 🚀 Guia de Instalação

Guia completo para configurar o BarberApp em seu ambiente de desenvolvimento.

---

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** versão 20.x ou superior
  - [Download Node.js](https://nodejs.org/)
  - Verificar: `node --version`

- **npm** (incluído com Node.js)
  - Verificar: `npm --version`

- **Git**
  - [Download Git](https://git-scm.com/)
  - Verificar: `git --version`

- **MongoDB** (uma das opções):
  - [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (Recomendado - free tier)
  - Ou MongoDB local

---

## 📥 Passo 1: Clonar o Repositório

```bash
# Clone o repositório
git clone <repository-url>

# Entre na pasta do projeto
cd barberapp
```

---

## 📦 Passo 2: Instalar Dependências

```bash
# Instale todas as dependências do projeto
npm install
```

Este comando irá instalar:
- Next.js 15.2
- Prisma 6.9
- React 18.2
- TailwindCSS 3.4
- NextAuth 5.0
- E todas as outras dependências listadas em `package.json`

---

## 🗄️ Passo 3: Configurar Banco de Dados

### Opção A: MongoDB Atlas (Recomendado)

1. **Criar conta**:
   - Acesse [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Crie uma conta gratuita

2. **Criar Cluster**:
   - Clique em "Build a Database"
   - Escolha "FREE" tier (M0)
   - Selecione região mais próxima

3. **Configurar Acesso**:
   - Em "Security" → "Database Access", crie um usuário
   - Em "Security" → "Network Access", adicione seu IP (ou `0.0.0.0/0` para qualquer IP)

4. **Obter Connection String**:
   - Clique em "Connect" no seu cluster
   - Escolha "Connect your application"
   - Copie a connection string
   - Formato: `mongodb+srv://<username>:<password>@cluster.mongodb.net/<database>`

### Opção B: MongoDB Local

```bash
# Instalar MongoDB Community Edition
# Windows: https://www.mongodb.com/try/download/community
# Mac: brew install mongodb-community
# Linux: https://docs.mongodb.com/manual/administration/install-on-linux/

# Iniciar MongoDB
mongod
```

Connection string: `mongodb://localhost:27017/barberapp`

---

## 🔐 Passo 4: Configurar Variáveis de Ambiente

1. **Criar arquivo `.env`**:

```bash
# Windows
copy NUL .env

# Mac/Linux
touch .env
```

2. **Preencher com as variáveis**:

Abra o arquivo `.env` e adicione:

```env
# Database
DATABASE_URL="mongodb+srv://usuario:senha@cluster.mongodb.net/barberapp"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="sua-chave-secreta-super-segura-aqui"

# GitHub OAuth (Opcional)
GITHUB_ID="seu-github-client-id"
GITHUB_SECRET="seu-github-client-secret"
```

3. **Gerar NEXTAUTH_SECRET**:

```bash
# Linux/Mac
openssl rand -base64 32

# Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))

# Ou use um gerador online
# https://generate-secret.vercel.app/32
```

**Substitua os valores**:
- `DATABASE_URL`: Sua connection string do MongoDB
- `NEXTAUTH_SECRET`: Chave gerada acima
- `NEXTAUTH_URL`: `http://localhost:3000` (desenvolvimento)

---

## 🔧 Passo 5: Configurar Prisma

```bash
# Gerar o Prisma Client
npx prisma generate

# Push do schema para o MongoDB (cria as collections)
npx prisma db push
```

**Verificar banco**:

```bash
# Abrir Prisma Studio (GUI do banco)
npx prisma studio
```

Acesse `http://localhost:5555` para visualizar as collections criadas.

---

## 🏃 Passo 6: Iniciar o Servidor

```bash
# Modo desenvolvimento (com Turbopack)
npm run dev
```

O servidor iniciará em `http://localhost:3000`

---

## ✅ Passo 7: Verificar Instalação

1. **Acesse a aplicação**:
   - Abra `http://localhost:3000` no navegador
   - Você deve ver a página de login

2. **Verificações**:
   - ✅ Página carrega sem erros
   - ✅ Tailwind CSS está funcionando (estilos aplicados)
   - ✅ Prisma Studio abre sem erros

---

## 👤 Passo 8: Criar Primeiro Usuário

Como não há interface de cadastro inicial, crie o primeiro usuário via Prisma Studio ou script:

### Opção A: Via Prisma Studio

1. Abra Prisma Studio:
   ```bash
   npx prisma studio
   ```

2. Vá para a tabela `User`

3. Clique em "Add record"

4. Preencha:
   ```json
   {
     "code": "USR0001",
     "name": "Admin",
     "email": "admin@barberapp.com",
     "login": "admin",
     "password": "senha123",
     "active": true,
     "isRoot": true,
     "profileType": "admin",
     "notifications": false
   }
   ```

5. Salve

### Opção B: Via Script Node.js

Crie `seed.js` na raiz:

```javascript
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      code: "USR0001",
      name: "Admin",
      email: "admin@barberapp.com",
      login: "admin",
      password: "senha123", // TODO: hash com bcrypt
      active: true,
      isRoot: true,
      profileType: "admin",
      notifications: false
    }
  });
  console.log('Usuário criado:', user);
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
```

Execute:
```bash
node seed.js
```

---

## 🔑 Passo 9: Fazer Login

1. Acesse `http://localhost:3000/login`

2. Credenciais:
   - **Email ou Login**: `admin` ou `admin@barberapp.com`
   - **Senha**: `senha123`

3. Clique em "Entrar"

4. Você será redirecionado para `/app/dashboard`

---

## 🎉 Pronto!

Sua instalação está completa. Agora você pode:

- ✅ Criar clientes
- ✅ Agendar serviços
- ✅ Registrar transações financeiras
- ✅ Visualizar dashboard com métricas

---

## 🐛 Troubleshooting

### Erro: "Cannot find module 'X'"

```bash
# Limpar e reinstalar dependências
rm -rf node_modules package-lock.json
npm install
```

### Erro: "Prisma Client did not initialize"

```bash
# Gerar novamente o Prisma Client
npx prisma generate
```

### Erro: "Connection refused" ao conectar MongoDB

- **Atlas**: Verifique se seu IP está na whitelist
- **Local**: Certifique-se de que `mongod` está rodando

### Erro ao fazer login

- Verifique se o usuário foi criado corretamente
- Confirme que `NEXTAUTH_SECRET` está definido no `.env`
- Veja logs no terminal onde `npm run dev` está rodando

### Página não carrega estilos

```bash
# Reconstruir CSS
npm run dev
# Força reload: Ctrl+Shift+R (Windows) ou Cmd+Shift+R (Mac)
```

---

## 📚 Próximos Passos

1. **Leia a documentação**:
   - [docs/README.md](../docs/README.md) - Índice da documentação
   - [README.md](../README.md) - Visão geral do projeto

2. **Explore as features**:
   - Dashboard
   - Agendamentos
   - Financeiro

3. **Configure a barbearia**:
   - Crie métodos de pagamento
   - Configure horários de funcionamento
   - Adicione serviços ao catálogo

---

## 🔄 Comandos Úteis

```bash
# Desenvolvimento
npm run dev              # Iniciar servidor dev

# Build
npm run build           # Build de produção
npm start               # Iniciar servidor de produção

# Prisma
npx prisma studio       # Abrir GUI do banco
npx prisma generate     # Gerar client
npx prisma db push      # Push schema para DB

# Linting
npm run lint            # Verificar código
```

---

<div align="center">

**[⬆ Voltar ao topo](#-guia-de-instalação)**

Precisa de ajuda? Abra uma issue no repositório ou consulte a [documentação completa](../docs/README.md).

</div>
