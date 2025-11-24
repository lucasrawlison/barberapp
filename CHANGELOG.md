# 📝 Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

---

## [Unreleased]

### 🚀 Planejado
- Notificações via SMS/WhatsApp
- Relatórios avançados com exportação PDF
- Sistema de fidelidade para clientes
- Integração com gateways de pagamento
- App mobile (React Native)

---

## [0.3.0] - 2025-01-15

### ✨ Adicionado
- Sistema de gestão financeira completo
- Dashboard com métricas e KPIs em tempo real
- Gráficos de faturamento com Recharts
- Filtros de data para transações
- Relatório mensal de receitas e despesas
- API endpoints para transações financeiras

### 🔧 Melhorado
- Performance do calendário de agendamentos
- Validação de formulários com Zod
- UI/UX do módulo de serviços
- Responsividade em dispositivos móveis
- Otimização de queries do Prisma

### 🐛 Corrigido
- Bug no cálculo de horários disponíveis
- Problema de timezone em agendamentos
- Erro ao deletar serviços vinculados
- Inconsistência em estados de loading
- Validação de CPF/telefone

---

## [0.2.0] - 2024-12-20

### ✨ Adicionado
- Sistema de agendamento com calendário interativo
- Gestão de horários dinâmicos por profissional
- Status de agendamento (pendente, atendido, cancelado)
- Horário de intervalo configurável para cada usuário
- Notificações de agendamento no dashboard
- API endpoints para scheduling

### 🔧 Melhorado
- Migração para Next.js 15 com App Router
- Atualização do Prisma para v6.9
- Implementação de Server Components
- Melhorias no sistema de autenticação
- Organização da estrutura de pastas

### 🐛 Corrigido
- Conflitos de horários no agendamento
- Problema na listagem de clientes inativos
- Erro 500 ao criar serviço sem desconto

### 🗑️ Removido
- Dependências não utilizadas do package.json
- Código legado da versão Pages Router

---

## [0.1.0] - 2024-11-10

### ✨ Adicionado
- Estrutura inicial do projeto Next.js
- Configuração do Prisma com MongoDB
- Schema do banco de dados (11 models)
- Sistema de autenticação com NextAuth
- CRUD de usuários
- CRUD de clientes
- CRUD de serviços
- Configuração do TailwindCSS
- Integração com Shadcn/UI
- Componentes base da UI
- Middleware de proteção de rotas
- Layout principal da aplicação

### 🔐 Segurança
- Implementação de autenticação JWT
- Proteção de rotas sensíveis
- Validação de sessão no middleware
- Hash de senhas (a implementar bcrypt)

---

## [0.0.1] - 2024-10-25

### 🎉 Inicial
- Criação do repositório
- Definição da arquitetura do projeto
- Escolha do tech stack
- Planejamento de funcionalidades

---

## 📊 Estatísticas de Versões

| Versão | Data | Commits | Arquivos Alterados | Linhas Adicionadas | Linhas Removidas |
|--------|------|---------|--------------------|--------------------|------------------|
| 0.3.0  | 2025-01-15 | 47 | 89 | +3,421 | -892 |
| 0.2.0  | 2024-12-20 | 38 | 72 | +2,876 | -1,234 |
| 0.1.0  | 2024-11-10 | 156 | 143 | +8,945 | -234 |
| 0.0.1  | 2024-10-25 | 12 | 8 | +476 | -0 |

---

## 🏷️ Convenções de Versionamento

### Formato: MAJOR.MINOR.PATCH

- **MAJOR**: Mudanças incompatíveis com versões anteriores
- **MINOR**: Novas funcionalidades mantendo compatibilidade
- **PATCH**: Correções de bugs mantendo compatibilidade

### Tipos de Mudanças

- `✨ Adicionado` - Para novas funcionalidades
- `🔧 Melhorado` - Para melhorias em funcionalidades existentes
- `🐛 Corrigido` - Para correções de bugs
- `🔐 Segurança` - Para correções de vulnerabilidades
- `🗑️ Removido` - Para funcionalidades removidas
- `⚠️ Deprecated` - Para funcionalidades que serão removidas
- `📚 Documentação` - Para mudanças apenas em documentação

---

## 🔗 Links

- [Notas de Release](https://github.com/lucasrawlison/barberapp/releases)
- [Issues Fechadas](https://github.com/lucasrawlison/barberapp/issues?q=is%3Aissue+is%3Aclosed)
- [Milestones](https://github.com/lucasrawlison/barberapp/milestones)

---

## 🎯 Roadmap

### v0.4.0 - Q2 2025
- [ ] Sistema de notificações push
- [ ] Integração com WhatsApp Business
- [ ] Exportação de relatórios em PDF
- [ ] Sistema de comissões para profissionais
- [ ] Multi-tenant (múltiplas barbearias)

### v0.5.0 - Q3 2025
- [ ] App mobile iOS/Android
- [ ] Sistema de fidelidade e pontos
- [ ] Programa de indicação
- [ ] Integração com Instagram
- [ ] Galeria de trabalhos realizados

### v1.0.0 - Q4 2025
- [ ] Versão estável de produção
- [ ] Documentação completa
- [ ] Testes end-to-end
- [ ] Suporte a múltiplos idiomas
- [ ] Modo offline para agendamentos

---

<div align="center">

**[⬆ Voltar ao topo](#-changelog)**

Para mais informações sobre versões, visite o [histórico de commits](https://github.com/lucasrawlison/barberapp/commits/main).

</div>
