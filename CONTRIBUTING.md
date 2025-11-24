# 🤝 Guia de Contribuição

Obrigado por seu interesse em contribuir com o BarberApp! Este documento fornece diretrizes e boas práticas para contribuir com o projeto.

---

## 📋 Índice

- [Código de Conduta](#código-de-conduta)
- [Como Posso Contribuir?](#como-posso-contribuir)
- [Processo de Desenvolvimento](#processo-de-desenvolvimento)
- [Padrões de Código](#padrões-de-código)
- [Commits e Mensagens](#commits-e-mensagens)
- [Pull Requests](#pull-requests)
- [Reportando Bugs](#reportando-bugs)
- [Sugerindo Melhorias](#sugerindo-melhorias)

---

## 📜 Código de Conduta

Este projeto adere a um código de conduta profissional. Ao participar, você concorda em manter um ambiente respeitoso e colaborativo.

### Comportamentos Esperados

✅ Usar linguagem acolhedora e inclusiva  
✅ Respeitar pontos de vista e experiências diferentes  
✅ Aceitar críticas construtivas de forma profissional  
✅ Focar no que é melhor para a comunidade  
✅ Demonstrar empatia com outros membros

### Comportamentos Inaceitáveis

❌ Linguagem ou imagens sexualizadas  
❌ Comentários insultuosos ou depreciativos  
❌ Assédio público ou privado  
❌ Publicar informações privadas de terceiros  
❌ Conduta não profissional ou inadequada

---

## 🚀 Como Posso Contribuir?

### Tipos de Contribuição

1. **Reportar Bugs**: Ajude-nos a identificar e corrigir problemas
2. **Sugerir Features**: Compartilhe ideias para melhorar o sistema
3. **Melhorar Documentação**: Corrija erros ou adicione conteúdo
4. **Desenvolver Features**: Implemente novas funcionalidades
5. **Corrigir Bugs**: Resolva issues existentes
6. **Revisar Código**: Participe de code reviews

---

## 💻 Processo de Desenvolvimento

### 1. Configurar Ambiente

```bash
# Fork o repositório
# Clone seu fork
git clone https://github.com/seu-usuario/barberapp.git
cd barberapp

# Adicione o upstream
git remote add upstream https://github.com/lucasrawlison/barberapp.git

# Instale as dependências
npm install

# Configure o ambiente
cp .env.example .env
# Edite o .env com suas credenciais

# Gere o Prisma Client
npx prisma generate

# Inicie o servidor
npm run dev
```

### 2. Criar Branch

Sempre crie uma nova branch para suas mudanças:

```bash
# Atualize sua main
git checkout main
git pull upstream main

# Crie uma branch descritiva
git checkout -b tipo/descricao-curta

# Exemplos:
git checkout -b feature/add-sms-notifications
git checkout -b fix/scheduling-timezone-bug
git checkout -b docs/update-api-endpoints
git checkout -b refactor/optimize-queries
```

### 3. Desenvolver

- Faça alterações incrementais e testáveis
- Siga os padrões de código do projeto
- Adicione testes quando aplicável
- Atualize a documentação se necessário
- Teste localmente antes de commitar

### 4. Commitar

```bash
# Adicione os arquivos
git add .

# Faça commit com mensagem descritiva
git commit -m "tipo: descrição curta"

# Exemplos no próximo tópico
```

### 5. Push e Pull Request

```bash
# Push para seu fork
git push origin sua-branch

# Abra um Pull Request no GitHub
# Preencha o template fornecido
```

---

## 📝 Padrões de Código

### TypeScript

```typescript
// ✅ BOM - Tipos explícitos
interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
}

async function createCustomer(data: Customer): Promise<Customer> {
  return await prisma.customer.create({ data });
}

// ❌ RUIM - Tipos any e implícitos
async function createCustomer(data: any) {
  return await prisma.customer.create({ data });
}
```

### React Components

```tsx
// ✅ BOM - Componente funcional com tipos
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export function Button({ label, onClick, variant = 'primary' }: ButtonProps) {
  return (
    <button onClick={onClick} className={`btn-${variant}`}>
      {label}
    </button>
  );
}

// ❌ RUIM - Props sem tipos
export function Button(props) {
  return <button onClick={props.onClick}>{props.label}</button>;
}
```

### Server Actions e API Routes

```typescript
// ✅ BOM - Validação com Zod
import { z } from 'zod';

const createCustomerSchema = z.object({
  name: z.string().min(1),
  phone: z.string().regex(/^\d{10,11}$/),
  email: z.string().email().optional(),
});

export async function POST(request: Request) {
  const body = await request.json();
  const validated = createCustomerSchema.parse(body);
  
  const customer = await prisma.customer.create({
    data: validated,
  });
  
  return Response.json(customer);
}

// ❌ RUIM - Sem validação
export async function POST(request: Request) {
  const body = await request.json();
  const customer = await prisma.customer.create({ data: body });
  return Response.json(customer);
}
```

### Estilização

```tsx
// ✅ BOM - Classes do Tailwind organizadas
<div className="
  flex items-center justify-between
  rounded-lg border border-gray-200
  bg-white p-4 shadow-sm
  hover:shadow-md transition-shadow
">

// ✅ BOM - Usando componentes do Shadcn/UI
import { Button } from '@/components/ui/button';

<Button variant="default" size="lg">
  Confirmar Agendamento
</Button>

// ❌ RUIM - Estilos inline
<div style={{ display: 'flex', padding: '16px', backgroundColor: 'white' }}>
```

### Nomenclatura

```typescript
// Arquivos
customer-form.tsx        // Componentes em kebab-case
useCustomerData.ts       // Hooks em camelCase
customer-schema.ts       // Schemas/utils em kebab-case

// Componentes
export function CustomerForm() {}        // PascalCase
export function ServiceSelector() {}

// Funções
function calculateDiscount() {}          // camelCase
async function fetchUserData() {}

// Variáveis
const userName = "João";                 // camelCase
const MAX_RETRIES = 3;                   // SCREAMING_SNAKE_CASE para constantes

// Types/Interfaces
interface UserData {}                    // PascalCase
type ServiceType = 'haircut' | 'beard'; // PascalCase
```

---

## 📮 Commits e Mensagens

### Formato de Commit

Usamos o padrão [Conventional Commits](https://www.conventionalcommits.org/):

```
tipo(escopo): descrição curta

Descrição detalhada (opcional)

Footers (opcional)
```

### Tipos Permitidos

- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Apenas documentação
- `style`: Formatação, ponto e vírgula, etc (sem mudança de código)
- `refactor`: Refatoração de código
- `perf`: Melhoria de performance
- `test`: Adição ou correção de testes
- `chore`: Manutenção, configuração, dependências

### Exemplos de Commits

```bash
# Feature
git commit -m "feat(scheduling): add SMS notification for appointments"

# Fix
git commit -m "fix(financial): correct calculation of monthly revenue"

# Docs
git commit -m "docs(api): update customer endpoints documentation"

# Refactor
git commit -m "refactor(dashboard): optimize query for overview data"

# Com descrição detalhada
git commit -m "feat(services): add service package pricing

- Allow creation of service packages
- Implement discount calculation
- Add UI for package management

Closes #123"
```

---

## 🔀 Pull Requests

### Antes de Abrir o PR

- ✅ Código segue os padrões do projeto
- ✅ Todos os testes passam localmente
- ✅ Código está formatado (`npm run lint`)
- ✅ Documentação foi atualizada
- ✅ Branch está atualizada com a main

### Template do PR

```markdown
## 📝 Descrição

Breve descrição do que foi implementado/corrigido.

## 🎯 Tipo de Mudança

- [ ] Bug fix (mudança que corrige um issue)
- [ ] Nova feature (mudança que adiciona funcionalidade)
- [ ] Breaking change (mudança que quebra compatibilidade)
- [ ] Documentação

## 🧪 Como Testar

1. Passo 1
2. Passo 2
3. Resultado esperado

## 📸 Screenshots (se aplicável)

Cole imagens aqui

## ✅ Checklist

- [ ] Código segue os padrões do projeto
- [ ] Realizei self-review do código
- [ ] Comentei partes complexas
- [ ] Atualizei a documentação
- [ ] Minhas mudanças não geram warnings
- [ ] Adicionei testes que provam o funcionamento
- [ ] Testes novos e existentes passam localmente
```

### Review Process

1. **Automated Checks**: Linting e testes automáticos devem passar
2. **Code Review**: Pelo menos um maintainer deve aprovar
3. **Testing**: Testado em ambiente de staging
4. **Merge**: Squash and merge para manter histórico limpo

---

## 🐛 Reportando Bugs

### Antes de Reportar

- Verifique se o bug já foi reportado nas Issues
- Confirme que é realmente um bug e não um erro de configuração
- Colete informações sobre o ambiente

### Template de Bug Report

```markdown
## 🐛 Descrição do Bug

Descrição clara e concisa do problema.

## 🔄 Passos para Reproduzir

1. Vá para '...'
2. Clique em '...'
3. Veja o erro

## ✅ Comportamento Esperado

O que deveria acontecer.

## ❌ Comportamento Atual

O que está acontecendo.

## 📸 Screenshots

Se aplicável, adicione screenshots.

## 🌐 Ambiente

- OS: [ex: Windows 11]
- Browser: [ex: Chrome 120]
- Node Version: [ex: 20.10]
- Versão do App: [ex: 0.1.0]

## 📋 Informações Adicionais

Qualquer contexto adicional sobre o problema.

## 🔍 Possível Solução

Se você tem ideia de como resolver (opcional).
```

---

## 💡 Sugerindo Melhorias

### Template de Feature Request

```markdown
## 🚀 Feature Request

**Qual problema esta feature resolveria?**
Descrição clara do problema.

**Descreva a solução desejada**
Como você imagina a implementação.

**Descreva alternativas consideradas**
Outras formas de resolver o problema.

**Informações Adicionais**
Contexto, screenshots, mockups, etc.

**Prioridade**
- [ ] Crítica
- [ ] Alta
- [ ] Média
- [ ] Baixa
```

---

## 🧪 Testes

### Executando Testes

```bash
# Rodar todos os testes
npm test

# Testes em watch mode
npm test -- --watch

# Cobertura de testes
npm test -- --coverage
```

### Escrevendo Testes

```typescript
// ✅ BOM - Teste descritivo e completo
describe('calculateDiscount', () => {
  it('should apply 10% discount for services above R$100', () => {
    const result = calculateDiscount(150, 0.1);
    expect(result).toBe(135);
  });

  it('should return original value when discount is 0', () => {
    const result = calculateDiscount(100, 0);
    expect(result).toBe(100);
  });

  it('should throw error for negative values', () => {
    expect(() => calculateDiscount(-50, 0.1)).toThrow();
  });
});
```

---

## 📚 Recursos Adicionais

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [Shadcn/UI Documentation](https://ui.shadcn.com)

---

## 🙋 Dúvidas?

Se você tiver dúvidas sobre como contribuir:

1. Verifique a documentação em `docs/`
2. Procure em Issues fechadas
3. Abra uma Discussion no GitHub
4. Entre em contato com os maintainers

---

## 🎉 Reconhecimento

Contribuidores serão listados no README e receberão créditos apropriados por suas contribuições.

Obrigado por tornar o BarberApp melhor! 🚀

---

<div align="center">

**[⬆ Voltar ao topo](#-guia-de-contribuição)**

</div>
