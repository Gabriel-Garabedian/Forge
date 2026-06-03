# ⚡ FORGE — Premium Gym Tracker PWA

> Dark-mode gym app com calendário de consistência, planejador de treinos, tracker ativo com timer de descanso, recordes pessoais e painel admin.

---

## 🚀 Setup rápido (5 minutos)

### 1. Pré-requisitos
- **Node.js 18+** → https://nodejs.org
- **npm** (vem com Node)

### 2. Instalar e rodar localmente

```bash
# Descompacte o zip e entre na pasta
cd forge-pwa

# Instale dependências
npm install

# Rode em desenvolvimento
npm run dev
# → Abra http://localhost:5173
```

### 3. Build para produção

```bash
npm run build
# Gera a pasta /dist pronta para deploy
```

---

## 🌐 Deploy gratuito (Vercel — recomendado)

1. Crie conta em https://vercel.com (grátis)
2. Instale Vercel CLI: `npm i -g vercel`
3. Na pasta do projeto: `vercel --prod`
4. Pronto! Você recebe uma URL pública tipo `forge-xxx.vercel.app`

### Alternativa — Netlify

1. Crie conta em https://netlify.com
2. Arraste a pasta `/dist` para o dashboard
3. URL pública instantânea

---

## 🔐 Credenciais padrão

| Papel  | Email             | Senha      |
|--------|-------------------|------------|
| Admin  | admin@forge.app   | forge2024  |
| Aluno  | alex@forge.app    | 123456     |

> O painel admin fica em `/` → faça login como admin → PIN: `forge2024`

---

## 📱 Como instalar como PWA no celular

1. Abra o link do site no Chrome (Android) ou Safari (iOS)
2. **Android**: toque nos 3 pontinhos → "Adicionar à tela inicial"
3. **iOS**: toque em Compartilhar (□↑) → "Adicionar à Tela de Início"
4. O app abre como app nativo, sem barra do navegador

---

## 🏗️ Estrutura do projeto

```
forge-pwa/
├── public/
│   └── manifest.json          # PWA manifest
├── src/
│   ├── context/
│   │   └── AppContext.jsx      # Estado global (usuário, rota, treino ativo)
│   ├── utils/
│   │   └── storage.js          # Toda a camada de dados (localStorage)
│   ├── views/
│   │   ├── LoginView.jsx        # Tela de login premium
│   │   ├── AppShell.jsx         # Nav bar + roteamento de abas
│   │   ├── HomeView.jsx         # Dashboard + calendário de consistência
│   │   ├── RoutineView.jsx      # Planejador de rotina semanal
│   │   ├── ActiveWorkoutView.jsx # Tracker de treino ativo + timer de descanso
│   │   ├── ProfileView.jsx      # PRs + histórico + logout
│   │   └── AdminView.jsx        # Painel admin (criar/gerenciar alunos)
│   ├── App.jsx                  # Router raiz
│   ├── main.jsx                 # Entry point React
│   └── index.css                # Tailwind + custom animations
├── index.html
├── vite.config.js               # Vite + PWA plugin
├── tailwind.config.js
└── package.json
```

---

## ✨ Features completas

### 👤 Usuário
- Login com credenciais fornecidas pelo admin
- **Home**: saudação personalizada, botão de iniciar treino, calendário de consistência com dias treinados destacados em neon, sequência atual, visão geral da semana
- **Rotina**: planejar treino por dia da semana (nome, exercícios, séries, reps, obs), reordenar exercícios
- **Treino Ativo**: timer global, registrar reps/carga por série, marcar série como feita, **overlay de 60s de descanso** com contagem visual circular + vibração ao terminar, finalizar salva no calendário
- **Perfil**: recordes pessoais (Supino, Agachamento, Terra, etc.), histórico de treinos, estatísticas

### 🔧 Admin
- Painel protegido por PIN
- Criar contas de alunos (nome, email, senha)
- Listar alunos, ver/alterar senhas, remover contas

---

## 🎨 Design System

| Token         | Valor        |
|---------------|--------------|
| Background    | `#0A0A0A`    |
| Surface       | `#141414`    |
| Card          | `#1A1A1A`    |
| Border        | `#2A2A2A`    |
| Accent (Neon) | `#CCFF00`    |
| Text          | `#E8E8E8`    |
| Muted         | `#888888`    |
| Font Display  | Barlow Condensed |
| Font Body     | Barlow       |

---

## 🔮 Próximos passos sugeridos

- [ ] Migrar storage para **Supabase** (banco online, multi-device)
- [ ] Notificações push para lembrar de treinar
- [ ] Gráficos de evolução de carga por exercício
- [ ] Modo offline completo com sync

---

Made with ⚡ by Forge
