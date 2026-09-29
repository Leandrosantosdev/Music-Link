# 🥁 Drummer & Musician Bio Links Hub

<div align="center">

![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Auth_%26_RLS-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![WebAudio](https://img.shields.io/badge/Web_Audio-API_Procedural-FFA500?style=for-the-badge&logo=audacity&logoColor=white)
![License](https://img.shields.io/badge/Licença-MIT-brightgreen?style=for-the-badge)

<p align="center">
  <strong>Hub de bio links interativo e personalizável (estilo Linktree) voltado para bateristas, músicos e criadores de conteúdo.</strong><br>
  Conta com simulador de bateria acústica tocável via WebAudio API, vitrine de equipamentos para afiliados (Shopee, Mercado Livre, Amazon), painel administrativo protegido e sincronização opcional com Supabase.
</p>

[✨ Demonstração & Recursos](#-recursos-em-destaque) •
[🚀 Início Rápido](#-início-rápido-para-iniciantes) •
[✏️ Como Personalizar](#️-como-personalizar-seus-dados) •
[🎛️ Painel Admin](#️-painel-administrativo-embutido) •
[🗄️ Guia Supabase](#️-banco-de-dados-e-segurança-supabase) •
[🛠️ Arquitetura Sênior](#-detalhes-de-engenharia-para-desenvolvedores-seniores)

</div>

---

## 📸 Visão Geral

Este projeto foi construído para resolver um problema comum de músicos na internet: **links de bio tradicionais são estáticos e genéricos**. 

Aqui você tem uma experiência imersiva:
1. **Design System Cyberpunk / Obsidian Glassmorphism** com luz ambiente animada e responsividade total (Mobile-First).
2. **Bateria Virtual Interativa Integrada:** os visitantes podem tocar bumbos, caixa, chimbal, pratos crash/ride/splash e tons diretamente no celular (touch) ou no teclado do computador.
3. **Groove Demo Automatizado:** demonstração sonora de viradas e ritmos reais de bateria sintetizados direto no navegador via **Web Audio API** (sem carregar megabytes de MP3s).
4. **Painel de Controle Administrativo Integrado:** gerencie links, ordens, badges promocionais e status ativo/inativo sem precisar republicar o código.
5. **Zero Vendor Lock-in:** funciona 100% offline via LocalStorage ou integrado na nuvem com Supabase (PostgreSQL + RLS).

---

## ✨ Recursos em Destaque

| Recurso | Descrição |
|---|---|
| 🥁 **Virtual Drum Kit** | 13 sensores mapeados sobre o kit de bateria com feedback visual e sonoro de alta fidelidade |
| 🛍️ **Vitrine de Afiliados** | Categorias dedicadas para produtos e lojas (Shopee, Mercado Livre, Amazon, etc.) |
| 🔍 **Busca & Filtros em Tempo Real** | Localização instantânea de links e equipamentos por nome, descrição ou selo |
| 🔐 **Painel Admin Oculto** | Acesso discreto via atalho `Alt + A` ou rota `/#admin` |
| 🛡️ **Segurança Rigorosa (CSP & RLS)** | Content Security Policy estrita, sanitização de URLs contra `javascript:` e Row Level Security no banco |
| 🍪 **Privacidade & LGPD** | Consentimento de cookies com disparo condicional de Google Tag Manager, GA4 e Microsoft Clarity |
| 📱 **Web Share API & QR** | Compartilhamento nativo para WhatsApp, redes sociais e cópia rápida de URL com HTTPS safe fallback |

---

## 🚀 Início Rápido (Para Iniciantes)

Se você nunca programou ou está dando os primeiros passos, siga este roteiro simples:

### 1. Pré-requisitos
Tenha o [Node.js (versão 18 ou superior)](https://nodejs.org/) instalado no seu computador.

### 2. Clonar o repositório
Abra o seu terminal (Prompt de Comando ou PowerShell no Windows, Terminal no Mac/Linux) e rode:
```bash
git clone https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git
cd SEU-REPOSITORIO
```

### 3. Instalar as dependências
```bash
npm install
```

### 4. Executar em modo de desenvolvimento
```bash
npm run dev
```
O terminal exibirá um endereço local (geralmente `http://localhost:5173`). Abra esse link no seu navegador para ver o site funcionando! 🎉

---

## ✏️ Como Personalizar Seus Dados

Você não precisa mexer em regras de programação complexas para deixar o site com a sua cara:

### 1. Alterar Nome, Bio e Redes Sociais
Abra o arquivo `src/data/linksData.js` no seu editor (ex: VS Code):
```javascript
export const profileData = {
  name: "Seu Nome Aqui",              // Seu nome ou nome artístico
  handle: "@seuperfil",               // Seu @ nas redes sociais
  role: "Baterista • Criador de Conteúdo",
  bio: "Baterista e criador de conteúdo. Confira meus canais oficiais e equipamentos!",
  location: "Brasil",
  verified: true,                     // Exibe selo azul de verificado
  avatarUrl: "/profile.jpg",          // Foto de perfil
  socialLinks: {
    youtube: "https://youtube.com/@seucanal",
    instagram: "https://instagram.com/seuperfil",
    tiktok: "https://tiktok.com/@seuperfil",
  }
};
```

### 2. Trocar a Foto de Perfil
Substitua a imagem `public/profile.jpg` pela sua foto pessoal (recomenda-se imagem quadrada, ex: `500x500px` ou `1000x1000px`).

### 3. Alterar os Links e Equipamentos
No mesmo arquivo `src/data/linksData.js`, edite o array `linksList`. Você pode adicionar, renomear ou trocar as URLs pelos seus links de afiliado:
```javascript
{
  id: "meu-equipamento-1",
  title: "Fone de Retorno Intra-auricular",
  subtitle: "Isolamento acústico de alta definição",
  url: "https://shopee.com.br/seu-link-de-afiliado",
  category: "shopee",
  icon: "Headphones",
  platform: "shopee",
  badge: "Mais Vendido",
  highlightColor: "#EE4D2D",
}
```

---

## 🎛️ Painel Administrativo Embutido

O projeto possui um painel administrativo integrado para adicionar, editar, desativar ou reordenar links:

- **Como acessar:**
  - Pressione as teclas **`Alt + A`** no teclado; **OU**
  - Digite **`/#admin`** no final do endereço no navegador (ex: `http://localhost:5173/#admin`).

### Modo Offline (Padrão)
Se o Supabase não estiver configurado, o painel armazena todas as modificações no `localStorage` do seu navegador. Ideal para testar ou usar sem nenhum backend.

### Modo Nuvem (com Supabase)
Ao conectar com o Supabase, o painel passa a exigir login seguro com **E-mail e Senha**, persistindo as edições diretamente no PostgreSQL para todos os visitantes do site.

---

## 🗄️ Banco de Dados e Segurança (Supabase)

Para sincronizar suas alterações com qualquer visitante que acessar a página na internet, utilize o backend gratuito do [Supabase](https://supabase.com).

<details>
<summary><strong>👉 Clique aqui para ver o passo a passo de configuração do Supabase</strong></summary>

### Passo 1: Criar o Projeto no Supabase
1. Crie uma conta gratuita em [supabase.com](https://supabase.com).
2. Clique em **"New Project"**, defina um nome e senha segura para o banco.

### Passo 2: Rodar o Script de Criação da Tabela e Políticas RLS
1. No menu lateral do Supabase, clique em **SQL Editor** -> **New query**.
2. Abra o arquivo `supabase_setup.sql` deste projeto.
3. Substitua `'SEU_EMAIL@EXEMPLO.COM'` nas 3 políticas de escrita pelo e-mail que você usará como Administrador.
4. Cole o conteúdo no SQL Editor e clique em **Run**.

### Passo 3: Criar o Usuário Administrador
1. No painel do Supabase, vá em **Authentication** -> **Providers** -> **Email**.
2. **Desative** a opção `"Enable sign-ups"` (para impedir que outras pessoas criem contas).
3. Vá em **Authentication** -> **Users** -> clique no botão **"Add user"** -> **"Create user"**.
4. Insira exatamente o e-mail que você definiu nas políticas RLS e defina uma senha forte.

### Passo 4: Configurar as Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto (ou copie de `.env.example`):
```env
VITE_SUPABASE_URL=https://SEU_PROJETO.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_anon_publica_aqui
```
*(Você encontra esses valores em: Project Settings -> API no painel do Supabase)*

Pronto! Agora faça login pelo painel `/#admin` e clique em **"Popular Banco Inicial"** para subir todos os links de exemplo.

</details>

---

## 🛠️ Detalhes de Engenharia (Para Desenvolvedores Seniores)

<details>
<summary><strong>👉 Clique aqui para detalhes de arquitetura, áudio procedural e conformidade</strong></summary>

### 1. Síntese Sonora Procedural (`src/utils/drumAudio.js`)
Não há carregamento de dezenas de megabytes de samples de áudio estáticos:
- **Bumbo (Kick):** Síntese senoidal descendente de frequência (`startFreq -> 0.001Hz`) acoplada a nó de ganho exponencial para punch acústico.
- **Caixa (Snare):** Combinação de oscilador triangular para ressonância do corpo do tambor + nó de ruído branco filtrado com passa-altas (`BiquadFilterNode`) para simulação da esteira.
- **Pratos e Chimbal (Cymbals):** Gerador estocástico de ruído branco processado por filtros passa-altas de corte agudo (`BiquadFilterNode`) e envelopes de decaimento rápido (hi-hat fechado) ou cauda longa com decay exponencial (crash e ride).
- **Tons & Surdo:** Ondas senoidais com queda dinâmica de frequência e ressonância calculada individualmente por diâmetro de tambor.

### 2. Controles de Acessibilidade & Mobile Performance
- Mapeamento de eventos `touchstart` e `touchend` com delta threshold de 12px e intervalo temporal < 450ms, eliminando conflito entre toque percussivo e rolagem nativa da página (sem `preventDefault` indiscriminado que travaria o scroll no mobile).
- Mapeamento por teclado físico para bateristas que acessam via desktop:
  - Pratos: `Q` (Crash 1), `W` (Hi-Hat Closed), `E` (Hi-Hat Open), `R` (Splash), `U` (Crash 2), `O` (Ride)
  - Tambores: `T` (Tom 1), `Y` (Tom 2), `I` (Tom 3), `S` (Snare), `C` (Floor Tom)
  - Pés: `Z` (Bumbo 1), `X` (Bumbo 2)

### 3. Segurança & CSP (Content Security Policy)
Configuração estrita de headers de segurança declarados no `index.html`:
- `frame-ancestors 'none'` impedindo ataques de Clickjacking.
- `Permissions-Policy` bloqueando uso indevido de câmera, microfone, geolocalização e pagamentos.
- Sanitização de URLs em `src/utils/security.js` que rejeita protocolos `javascript:`, `data:`, `vbscript:`, permitindo apenas `http:`, `https:` e esquemas de mensageiros autorizados (`whatsapp:`, `tg:`, `mailto:`).

### 4. Row Level Security (RLS) no PostgreSQL
As regras de permissão no Supabase segregam rigorosamente leitura e escrita:
- **`SELECT`:** Público irrestrito (`using (true)`) para que qualquer cliente web possa carregar a lista de links ativos sem autenticação.
- **`INSERT`, `UPDATE`, `DELETE`:** Restritos a usuários autenticados cujo claim `auth.jwt() ->> 'email'` coincida estritamente com o e-mail pré-autorizado do proprietário do hub.

</details>

---

## 📂 Estrutura de Pastas

```text
├── public/                     # Arquivos estáticos servidos diretamente
│   ├── drumkit-real.jpg        # Imagem base da bateria virtual
│   ├── favicon.svg             # Favicon vetorizado do projeto
│   ├── profile.jpg             # Foto de perfil padrão (substituível)
│   ├── robots.txt              # Regras de indexação para SEO
│   └── sitemap.xml             # Sitemap XML oficial
├── src/
│   ├── assets/                 # SVGs e imagens complementares
│   ├── components/
│   │   ├── AdminPanel.jsx      # Painel completo de administração e login
│   │   ├── CategoryFilter.jsx  # Barra de pesquisa e abas de categorias
│   │   ├── CookieConsent.jsx   # Banner LGPD com opt-in de analytics
│   │   ├── DrumPadWidget.jsx   # Bateria virtual interativa com animação SVG
│   │   ├── Footer.jsx          # Rodapé com ano dinâmico
│   │   ├── Header.jsx          # Avatar animado, arroba e redes sociais
│   │   ├── LinkCard.jsx        # Cards de links e produtos com badges
│   │   ├── ShareModal.jsx      # Modal de compartilhamento nativo e cópia
│   │   ├── SocialIcons.jsx     # Ícones vetorizados das principais redes
│   │   └── TopBar.jsx          # Barra superior com ações rápidas
│   ├── data/
│   │   └── linksData.js        # Configuração central de dados (Nome, Bio, Links)
│   ├── services/
│   │   └── supabaseClient.js   # Cliente Supabase, queries e script SQL
│   ├── utils/
│   │   ├── analytics.js        # Gerenciamento de eventos (GTM / GA4 / Clarity)
│   │   ├── drumAudio.js        # Motor de áudio em Web Audio API procedural
│   │   └── security.js         # Sanitização de links e proteção contra XSS
│   ├── App.jsx                 # Componente raiz da aplicação
│   ├── index.css               # Design system obsidian neon em CSS nativo
│   └── main.jsx                # Ponto de entrada React 19
├── .env.example                # Modelo de variáveis de ambiente
├── index.html                  # HTML5 com CSP, meta tags e JSON-LD SEO
├── package.json                # Dependências e scripts npm
├── supabase_setup.sql          # Script de banco de dados pronto para execução
└── vite.config.js              # Configuração do Vite e plugins
```

---

## 🚀 Como Fazer o Deploy (Publicar na Internet)

Você pode hospedar este projeto gratuitamente em plataformas como **Vercel**, **Netlify** ou **Cloudflare Pages**:

### Deploy na Vercel (Recomendado)
1. Suba seu código no seu GitHub.
2. Acesse [vercel.com](https://vercel.com) e conecte sua conta do GitHub.
3. Importe este repositório.
4. Se estiver usando o Supabase, adicione as variáveis de ambiente (`VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`) nas configurações do projeto na Vercel.
5. Clique em **Deploy**! O site estará no ar em poucos segundos com HTTPS automático.

---

## 📜 Licença

Distribuído sob a licença **MIT**. Veja o arquivo `LICENSE` ou sinta-se livre para usar, customizar e distribuir este template para seus próprios projetos musicais ou comerciais.

<div align="center">
  <sub>Feito com 🥁 ritmo e código para a comunidade musical e de desenvolvedores.</sub>
</div>
