# 🎨 Tema e Estilização

Documentação do sistema de design e estilização do BarberApp.

---

## 📋 Índice

- [Sistema de Cores](#sistema-de-cores)
- [Tipografia](#tipografia)
- [Espaçamento e Layout](#espaçamento-e-layout)
- [Dark Mode](#dark-mode)
- [Animações](#animações)

---

## 🎨 Sistema de Cores

### Design Tokens (CSS Variables)

**Arquivo**: `src/app/globals.css`

```css
:root {
  --background: 0 0% 100%;           /* Branco */
  --foreground: 240 10% 3.9%;        /* Quase preto */
  --primary: 240 5.9% 10%;           /* Cinza escuro */
  --primary-foreground: 0 0% 98%;    /* Branco */
  --secondary: 240 4.8% 95.9%;       /* Cinza claro */
  --muted: 240 4.8% 95.9%;
  --accent: 240 4.8% 95.9%;
  --destructive: 0 84.2% 60.2%;      /* Vermelho */
  --border: 240 5.9% 90%;
  --input: 240 5.9% 90%;
  --ring: 240 10% 3.9%;
  --radius: 0.5rem;                  /* Border radius padrão */
}
```

### Configuração Tailwind

**Arquivo**: `tailwind.config.ts`

```typescript
colors: {
  background: 'hsl(var(--background))',
  foreground: 'hsl(var(--foreground))',
  primary: {
    DEFAULT: 'hsl(var(--primary))',
    foreground: 'hsl(var(--primary-foreground))'
  },
  secondary: {
    DEFAULT: 'hsl(var(--secondary))',
    foreground: 'hsl(var(--secondary-foreground))'
  },
  destructive: {
    DEFAULT: 'hsl(var(--destructive))',
    foreground: 'hsl(var(--destructive-foreground))'
  },
  // ... outros
}
```

### Cores de Gráficos

```css
--chart-1: 12 76% 61%;    /* Laranja */
--chart-2: 173 58% 39%;   /* Verde-azulado */
--chart-3: 197 37% 24%;   /* Azul escuro */
--chart-4: 43 74% 66%;    /* Amarelo */
--chart-5: 27 87% 67%;    /* Laranja claro */
```

---

## 🔤 Tipografia

### Font Family

```css
body {
  font-family: Arial, Helvetica, sans-serif;
}
```

### Classes Tailwind

```tsx
<h1 className="text-4xl font-bold">Título Grande</h1>
<h2 className="text-2xl font-semibold">Subtítulo</h2>
<p className="text-base">Texto normal</p>
<span className="text-sm text-muted-foreground">Texto secundário</span>
```

---

## 📐 Espaçamento e Layout

### Border Radius

```typescript
borderRadius: {
  lg: 'var(--radius)',           // 0.5rem
  md: 'calc(var(--radius) - 2px)',  // 0.375rem
  sm: 'calc(var(--radius) - 4px)'   // 0.25rem
}
```

### Breakpoints

```typescript
screens: {
  'h-sm': { raw: '(max-height: 668px)' }, // iPhone 7
  // Padrões do Tailwind:
  // sm: 640px
  // md: 768px
  // lg: 1024px
  // xl: 1280px
}
```

---

## 🌓 Dark Mode

### Ativação

```typescript
// tailwind.config.ts
darkMode: ["class"]
```

### CSS Variables (Dark)

```css
.dark {
  --background: 240 10% 3.9%;      /* Cinza muito escuro */
  --foreground: 0 0% 98%;          /* Branco */
  --primary: 0 0% 98%;
  --card: 240 10% 3.9%;
  --destructive: 0 62.8% 30.6%;    /* Vermelho escuro */
  /* ... */
}
```

### Uso

```tsx
// Com next-themes
import { ThemeProvider } from "next-themes";

<ThemeProvider attribute="class">
  <App />
</ThemeProvider>

// Toggle
import { useTheme } from "next-themes";

const { theme, setTheme } = useTheme();

<Button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
  Alternar Tema
</Button>
```

---

## ✨ Animações

### Keyframes Customizados

```typescript
keyframes: {
  slideIn: {
    '0%': { transform: 'translateX(-100%)' },
    '100%': { transform: 'translateX(200%)' }
  },
  blink: {
    '0%': { opacity: '0%' },
    '100%': { opacity: '100%' }
  }
},
animation: {
  slideIn: 'slideIn 2s linear infinite',
  blink: 'blink 1.2s linear infinite'
}
```

### Plugin Tailwind Animate

Animações adicionais via `tailwindcss-animate`:
- `animate-spin`
- `animate-ping`
- `animate-pulse`
- `animate-bounce`
- Transições suaves

---

## 🎯 Boas Práticas

### Consistência

```tsx
// ✅ BOM - Usar design tokens
<div className="bg-background text-foreground border-border">

// ❌ RUIM - Cores hardcoded
<div className="bg-white text-black border-gray-300">
```

### Componentes Reutilizáveis

```tsx
// ✅ BOM - Componente com variants
<Button variant="primary" size="lg">Salvar</Button>

// ❌ RUIM - Classes repetidas
<button className="bg-blue-500 text-white px-4 py-2 rounded">Salvar</button>
```

---

<div align="center">

**[⬆ Voltar ao topo](#-tema-e-estilização)**

</div>
