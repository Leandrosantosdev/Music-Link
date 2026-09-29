# Guia: Configurar GA4 + Microsoft Clarity no Google Tag Manager

Este site carrega o container GTM após o consentimento de cookies e envia eventos
via `dataLayer`. Este guia configura o **lado do GTM** para receber esses eventos
e distribuí-los para o GA4 e o Clarity.

---

## 0. O que o site já envia (contrato do dataLayer)

| Evento | Parâmetros | Disparado quando |
|---|---|---|
| `link_click` | `link_id`, `link_title`, `link_category`, `link_domain` | Visitante clica em um card de link |
| `social_click` | `social_network` (`youtube`/`instagram`/`tiktok`) | Visitante clica em um ícone social do header |

O push é feito em `src/utils/analytics.js` → `trackEvent()`:
`window.dataLayer.push({ event: 'link_click', link_id: '...', ... })`

⚠️ **Importante:** o GTM só carrega **depois** que o visitante aceita o banner de
cookies (LGPD). Testes no Preview do GTM exigem clicar em "Aceitar" no site.

---

## 1. Criar as variáveis no GTM

No painel do GTM (`tagmanager.google.com`) → seu container → aba **Variáveis** →
**Variáveis definidas pelo usuário** → **Nova**. Crie uma a uma:

| Nome da variável | Tipo | Valor/Caminho da variável de dados |
|---|---|---|
| `DLV - link_id` | Variável de dados da camada | `link_id` |
| `DLV - link_title` | Variável de dados da camada | `link_title` |
| `DLV - link_category` | Variável de dados da camada | `link_category` |
| `DLV - link_domain` | Variável de dados da camada | `link_domain` |
| `DLV - social_network` | Variável de dados da camada | `social_network` |

> "Variável de dados da camada" = *Data Layer Variable*. O nome deve ser exatamente
> igual ao parâmetro enviado no push.

---

## 2. Criar os acionadores (Triggers)

Aba **Acionadores** → **Novo** → tipo **Evento personalizado** (*Custom Event*):

**Acionador 1**
- Nome: `CE - link_click`
- Nome do evento: `link_click`
- Este acionador é disparado em: *Todos os eventos personalizados*

**Acionador 2**
- Nome: `CE - social_click`
- Nome do evento: `social_click`

---

## 3. Criar a tag do GA4

Se você ainda não tem a tag de página do GA4 no GTM, crie primeiro a de configuração:

### 3a. Tag de configuração do GA4
1. **Tags** → **Nova** → tipo **Google Tag**
2. ID da tag: seu `G-XXXXXXXXXX` (do GA4: Admin → Fluxos de dados)
3. Acionamento: **Initialization - All Pages** (acionador padrão do GTM)
4. Nomeie: `GA4 - Config` e salve

### 3b. Tag do evento link_click
1. **Tags** → **Nova** → tipo **Evento do Google Analytics: GA4**
2. **ID de medição**: `G-XXXXXXXXXX` (ou use a variável `{{Google Tag - Config}}` se preferir)
3. **Nome do evento**: `link_click`
4. **Parâmetros do evento** (adicionar linha a linha):

| Parâmetro | Valor |
|---|---|
| `link_id` | `{{DLV - link_id}}` |
| `link_title` | `{{DLV - link_title}}` |
| `link_category` | `{{DLV - link_category}}` |
| `link_domain` | `{{DLV - link_domain}}` |

5. **Acionamento**: `CE - link_click`
6. Nomeie: `GA4 - Evento link_click` e salve

### 3c. Tag do evento social_click
Mesma estrutura, mas:
- **Nome do evento**: `social_click`
- **Parâmetro**: `social_network` = `{{DLV - social_network}}`
- **Acionamento**: `CE - social_click`
- Nomeie: `GA4 - Evento social_click`

---

## 4. Criar a tag do Microsoft Clarity

1. **Tags** → **Nova** → pesquise o modelo **Microsoft Clarity**
   (disponível na Galeria de Modelos da comunidade)
2. Preencha:
   - **Project ID**: `yodggkhll3` (do painel do Clarity: Configurações → ID do projeto)
3. (Opcional) Configure o modelo para **rastrear eventos do dataLayer**:
   - Muitos modelos têm um campo "Track events" / "Data Layer events" — adicione:
     - `link_click`
     - `social_click`
   - Assim os cliques aparecem como filtros nas gravações de sessão do Clarity
4. **Acionamento**: **Initialization - All Pages**
5. Nomeie: `Clarity - Base` e salve

> Sem o modelo da galeria: use uma tag **HTML personalizado** com o snippet
> oficial do Clarity e o mesmo acionamento. O Project ID continua `yodggkhll3`.

---

## 5. Publicar e testar

1. **Clique em Enviar** (canto superior direito) → **Publicar** no GTM
2. Instale o **Tag Assistant** (Preview do GTM) e abra o site
3. No site, **clique em "Aceitar"** no banner de cookies (senão o GTM não carrega)
4. Verifique na janela de Preview:
   - Evento `gtm.js` → tag `GA4 - Config` disparada ✓
   - Clique em um card → evento `link_click` com as variáveis preenchidas ✓
   - Clique em um ícone social → evento `social_click` ✓
5. **GA4**: Relatórios → Tempo real → o evento deve aparecer ao clicar
6. **Clarity**: Painel → as gravações começam a chegar; filtre por evento

---

## 6. No GA4: registrar dimensões e conversões

Os eventos personalizados aparecem em **Admin → Eventos** após o primeiro tráfego
(pode levar algumas horas). Então:

**Marcar como evento-chave/conversão:**
1. Admin → Eventos → localize `link_click` e `social_click`
2. Menu ⋮ → **Marcar como evento-chave**

**Criar dimensões personalizadas (para relatórios por título do link):**
1. Admin → Definições personalizadas → **Criar dimensão personalizada**
2. Nome: `Link Title` → Parâmetro do evento: `link_title` → Escopo: Evento
3. Repita para `link_category` e `social_network` se quiser filtrar por elas

---

## 7. Checklist final

- [ ] Container publicado no GTM
- [ ] Banner "Aceitar" clicado durante o teste (CSP/consentimento)
- [ ] `GA4 - Config` disparando em todas as páginas
- [ ] `link_click` com `link_title` visível no Preview
- [ ] `social_click` com `social_network` visível no Preview
- [ ] Clarity recebendo gravações (verificar em ~30 min)
- [ ] Dimensões personalizadas criadas no GA4
- [ ] Eventos marcados como conversão no GA4

## Solução de problemas

| Sintoma | Causa provável | Correção |
|---|---|---|
| GTM não carrega nem com "Aceitar" | CSP bloqueando ou `.env` sem `VITE_GTM_ID` | Veja seção CSP do `README`/`.htaccess`; confirme a variável no build |
| Evento chega sem parâmetros | Nome da variável de dados ≠ nome do push | Confira letra por letra (ex.: `link_title`) |
| Tag não dispara | Acionador com nome de evento errado | Deve ser exatamente `link_click`/`social_click` |
| Clarity sem dados | Project ID errado ou "Mask input" agressivo | Confirme `yodggkhll3`; aguarde ~30 min |
| Nada carrega sem banner | Comportamento correto (LGPD) | Aceite os cookies no teste |
