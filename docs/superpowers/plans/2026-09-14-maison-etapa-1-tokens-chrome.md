# Maison — Etapa 1: tokens, tipografia e chrome — plano de implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Trocar o design system do site público para o registro "Maison" (papel, vinho-noir, ouro como material, Bodoni Moda) mudando tokens, tipografia, botões, formulários, faixa do topo, header, rodapé e a camada de classes legadas, sem tocar na estrutura das seções da home (etapa 2), da listagem e do produto (etapa 3) nem dos blocos do CMS (etapa 4).

**Architecture:** Todo o sistema visual vive em `app/globals.css` (tokens em `:root`, base, botões, chrome, camada legada) e as fontes em `app/layout.tsx` via `next/font/google`. Os componentes de chrome (`TopStrip`, `Header`, `Footer`, `CtaBand`) mudam pouco: uma classe de botão, uma imagem de logo em ouro. Os nomes de token atuais continuam existindo com valores novos, então páginas não tocadas já mudam de registro.

**Tech Stack:** Next.js 16 (App Router), React 19, CSS puro com custom properties, `next/font/google` (Bodoni Moda + Manrope), `sharp` (já vem com o Next) para gerar o logo em ouro.

**Spec:** `docs/superpowers/specs/2026-09-14-design-system-maison-design.md` (§2 tokens, §3 chrome, §6 camada legada, §7 regras de movimento, §9 etapa 1).

## Global Constraints

- Desenvolvimento no espelho local `C:\Users\dev_c\pa-run` (o Drive `G:` não roda npm). Editar sempre no `G:`; espelhar com `sh /c/Users/dev_c/sync-pa.sh`; depois do sync, reaplicar no espelho `sed -i 's/const pagina = await getPaginaPublicada("home");/const pagina = process.env.FORCAR_HOME_CLASSICA ? null : await getPaginaPublicada("home");/' app/page.tsx` se o dev server estiver com `FORCAR_HOME_CLASSICA=1`.
- Verificação = `npx tsc --noEmit` + `npm run build` no espelho (não rodar `build` e `dev` ao mesmo tempo). Não há ESLint nem testes unitários no projeto.
- Vermelho `#e3301a` só em `.btn-primary` e no logotipo. Nenhum outro seletor pode usar `var(--pierre)` como cor de fundo ou de texto.
- Preto proibido: superfícies escuras usam `--vinho-noir #2b181e`.
- Sem caixa alta em eyebrows/etiquetas (`text-transform:uppercase` só permanece em `.sr-only`-like utilitários; remover de `.eyebrow`, `label`, `.breadcrumb`, `.pcard-eyebrow`, `.pcard-badge`, `.listing-filters h4`).
- Foco de teclado: `outline:2px solid var(--ouro); outline-offset:3px`.
- Botões sem `transform` no hover.
- Todo movimento respeita `prefers-reduced-motion`.
- Nenhuma página pode ter `scrollWidth > clientWidth` em 390px ou 1440px.
- Commits em português, uma linha de título no imperativo ("Troca…", "Adiciona…"), terminando com `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>`.

---

## Mapa de arquivos

| Arquivo | Responsabilidade nesta etapa |
| --- | --- |
| `app/layout.tsx` | carrega Bodoni Moda e Manrope; expõe `--font-bodoni` e `--font-manrope` |
| `app/globals.css` `:root` (linhas 8–69) | tokens novos e aliases legados |
| `app/globals.css` base/tipografia (linhas 70–100) | body, headings, `.eyebrow`, foco, seleção |
| `app/globals.css` botões (linhas 108–137) | `.btn*`, `.link-line` |
| `app/globals.css` top strip + header (linhas 139–209) | faixa, header, busca, mega, mobile |
| `app/globals.css` footer + WhatsApp (linhas 211–231) | rodapé, marca ouro, redes |
| `app/globals.css` camada legada (linhas 340–460) | `.page-hero`, `.section-red/black/paper`, `.panel*`, `.step`, `.level`, `label/input`, `.cta-band`… |
| `components/Header.tsx` | CTA do header vira `.btn-carbon` |
| `components/Footer.tsx` | marca de fundo usa `logo-pierre-gold.png` |
| `scripts/logo-ouro.mjs` (novo) | gera `public/assets/img/logo-pierre-gold.png` a partir do PNG branco |
| `docs/REDESIGN.md` | seção "Design system Maison" com os tokens e o estado das etapas |

As linhas acima são as do arquivo em 14/09/2026 (commit `89cdcad`); confira com `grep -n` antes de editar.

---

### Task 1: Bodoni Moda no lugar da Cormorant

**Files:**
- Modify: `app/layout.tsx:1-25`

**Interfaces:**
- Produces: variáveis CSS `--font-bodoni` e `--font-manrope` no `<html>`, consumidas pelo `:root` da Task 2 (`--font-serif: var(--font-bodoni), "Bodoni Moda", Didot, "Times New Roman", serif`).

- [ ] **Step 1: Trocar o import e a configuração da fonte**

Em `app/layout.tsx`, substituir o bloco:

```tsx
import { Cormorant_Garamond, Manrope } from "next/font/google";
```

por

```tsx
import { Bodoni_Moda, Manrope } from "next/font/google";
```

e o bloco `const cormorant = Cormorant_Garamond({ ... })` por:

```tsx
// Tipografia editorial: Bodoni Moda (Didone de alto contraste, com tamanhos
// ópticos) nos títulos; Manrope na interface. Poucos pesos; font-display swap.
const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  display: "swap",
  variable: "--font-bodoni",
});
```

- [ ] **Step 2: Trocar a classe aplicada no `<html>`**

Localizar onde o layout aplica `cormorant.variable` (procure `className={` no arquivo, junto de `manrope.variable`) e trocar por `bodoni.variable`. Exemplo do resultado:

```tsx
<html lang="pt-BR" className={`${bodoni.variable} ${manrope.variable}`}>
```

- [ ] **Step 3: Verificar tipos**

```bash
sh /c/Users/dev_c/sync-pa.sh && cd /c/Users/dev_c/pa-run && npx tsc --noEmit && echo TSC_OK
```

Esperado: `TSC_OK`. Se `axes` não for aceito pelo tipo de `Bodoni_Moda`, remover a linha `axes` (a fonte continua variável em peso).

- [ ] **Step 4: Commit**

```bash
cd "G:/Drives compartilhados/TI/developer/sites/pa" && git add app/layout.tsx && git commit -m "Troca Cormorant por Bodoni Moda nos títulos

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 2: Tokens Maison em `:root`

**Files:**
- Modify: `app/globals.css:1-69` (cabeçalho e `:root`)

**Interfaces:**
- Produces: tokens listados abaixo; todos os seletores das tasks seguintes usam exatamente estes nomes.

- [ ] **Step 1: Substituir o comentário de cabeçalho e o bloco `:root` inteiro**

Trocar tudo entre a linha 1 e a linha `@media (max-width:820px){:root{--hdr-h:62px}}` (inclusive) por:

```css
/* ============================================================================
   PIERRE ALEXANDER — Design system "Maison"
   Papel marfim, vinho-noir no lugar do preto, ouro como material (fios,
   numerais, brilhos), lilás e blush das embalagens. Vermelho Pierre só no
   logotipo e no botão principal. Bodoni Moda nos títulos, Manrope na
   interface. Spec: docs/superpowers/specs/2026-09-14-design-system-maison-design.md
   ========================================================================== */
:root{
  /* --- Cor ------------------------------------------------------------- */
  --papel:#fcfaf5;           /* fundo base */
  --marfim:#f6f0e6;          /* seções alternadas, fundo de produto */
  --areia:#e9dfd0;           /* superfícies de apoio */
  --vinho:#4d2e38;           /* cor do pote do Original; voz itálica */
  --vinho-noir:#2b181e;      /* o "preto" da casa: texto, rodapé, faixas */
  --ouro:#b99a68;            /* metal: fios, numerais, foco */
  --ouro-claro:#e6cf9f;
  --ouro-escuro:#8c6d3f;
  --ouro-foil:linear-gradient(115deg,#e6cf9f 0%,#b99a68 40%,#8c6d3f 62%,#d9bd8a 100%);
  --lilas:#e9dff2;           /* das embalagens */
  --blush:#f5dfe0;
  --pierre:#e3301a;          /* vermelho do logotipo: só logo + .btn-primary */
  --pierre-deep:#c2280f;     /* hover do .btn-primary */

  --ink:var(--vinho-noir);
  --ink-2:#4a3a3c;           /* texto corrido */
  --muted:#8a7a74;
  --bg:var(--papel);
  --soft:var(--marfim);
  --line:#e8dfd2;
  --line-strong:#d6c8b4;
  --line-ouro:color-mix(in srgb,var(--ouro) 55%,transparent);

  /* aliases legados: páginas antigas continuam compilando e já mudam de tom */
  --branco:var(--papel);
  --espresso:var(--vinho-noir);
  --carbon:var(--vinho-noir);
  --marrom:var(--vinho);
  --vinho-deep:var(--vinho-noir);
  --champagne:var(--ouro);
  --gold:var(--ouro);
  --accent:var(--pierre);
  --accent-dark:var(--pierre-deep);
  --accent-soft:var(--blush);
  --pierre-tint:var(--blush);
  --queimado:var(--vinho);
  --terracota:var(--vinho);

  /* --- Tipografia ------------------------------------------------------ */
  --font-serif:var(--font-bodoni), "Bodoni Moda", Didot, "Bodoni 72", "Times New Roman", serif;
  --font-sans:var(--font-manrope), Manrope, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Arial, sans-serif;
  --fs-display:clamp(3.2rem, 1.6rem + 6.4vw, 8rem);
  --fs-h1:clamp(2.6rem, 1.6rem + 3.8vw, 5rem);
  --fs-h2:clamp(2.1rem, 1.4rem + 2.6vw, 3.8rem);
  --fs-h3:clamp(1.4rem, 1.2rem + .9vw, 2rem);
  --fs-lead:clamp(1.1rem, 1rem + .4vw, 1.3rem);
  --fs-body:1.05rem;
  --fs-small:.875rem;
  --fs-label:.8rem;
  --measure:60ch;

  /* --- Espaço, raio, sombra, movimento --------------------------------- */
  --space-1:.25rem; --space-2:.5rem; --space-3:.75rem; --space-4:1rem;
  --space-5:1.5rem; --space-6:2rem; --space-7:3rem; --space-8:4.5rem; --space-9:7rem;
  --section:clamp(5rem, 4rem + 5vw, 9rem);
  --radius-sm:4px; --radius:8px; --radius-lg:14px; --radius-xl:20px;
  --shadow:none;
  --shadow-hover:none;
  --shadow-3d:0 40px 80px -40px rgba(43,24,30,.35);
  --ease:cubic-bezier(.22,.61,.36,1);
  --ease-out:cubic-bezier(.16,1,.3,1);
  --t-fast:.18s; --t-base:.32s; --t-slow:.8s;
  --max:1320px;
  --gutter:clamp(20px, 4.5vw, 64px);
  --hdr-h:72px;
}
@media (max-width:820px){:root{--hdr-h:62px}}
```

- [ ] **Step 2: Conferir que nenhum token usado no CSS ficou sem definição**

```bash
cd "G:/Drives compartilhados/TI/developer/sites/pa" && grep -ohE 'var\(--[a-z0-9-]+' app/globals.css components/home/home.css | sort -u | sed 's/var(//' > /tmp/usados.txt && grep -oE '^\s*--[a-z0-9-]+' app/globals.css | tr -d ' ' | sort -u > /tmp/definidos.txt && comm -23 /tmp/usados.txt /tmp/definidos.txt
```

Esperado: só tokens definidos inline (`--p`, `--i`, `--n`, `--lp`, `--v`, `--s`, `--ftr-cols`, `--fila`, `--frente`) e as variáveis de fonte (`--font-bodoni`, `--font-manrope`). Qualquer outro nome na saída precisa entrar no `:root`.

- [ ] **Step 3: Build rápido**

```bash
sh /c/Users/dev_c/sync-pa.sh && cd /c/Users/dev_c/pa-run && npx tsc --noEmit && npm run build 2>&1 | grep -E "✓|error" | head
```

Esperado: duas linhas `✓` e nenhuma `error`.

- [ ] **Step 4: Commit**

```bash
cd "G:/Drives compartilhados/TI/developer/sites/pa" && git add app/globals.css && git commit -m "Define os tokens do design system Maison

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 3: Base, tipografia e eyebrow

**Files:**
- Modify: `app/globals.css` — bloco `/* --- Base ---` até `.sec-head-row p` (hoje linhas 70–107)

- [ ] **Step 1: Trocar foco, seleção e skip-link**

```css
:focus-visible{outline:2px solid var(--ouro);outline-offset:3px;border-radius:2px}
::selection{background:var(--blush);color:var(--vinho-noir)}
.skip-link{position:absolute;left:12px;top:-60px;z-index:200;background:var(--vinho-noir);color:var(--papel);padding:10px 16px;border-radius:2px;font-weight:500;font-size:14px;transition:top var(--t-fast)}
```

- [ ] **Step 2: Trocar headings, parágrafo, lead e eyebrow**

Substituir da linha `h1,h2,h3,h4,p,ul,ol,figure{margin-top:0}` até `.eyebrow{...}` por:

```css
h1,h2,h3,h4,p,ul,ol,figure{margin-top:0}
h1,h2,h3,.serif{font-family:var(--font-serif);font-weight:500;letter-spacing:-.01em;color:var(--ink);text-wrap:balance;font-optical-sizing:auto}
h1{font-size:var(--fs-h1);line-height:.98;font-weight:400;margin-bottom:var(--space-5)}
h2{font-size:var(--fs-h2);line-height:1.02;margin-bottom:var(--space-4)}
h3{font-size:var(--fs-h3);line-height:1.12;margin-bottom:var(--space-2);font-weight:500}
h4{font-size:1rem;font-weight:600;margin-bottom:var(--space-2)}
p{color:var(--ink-2);max-width:var(--measure)}
.lead{font-size:var(--fs-lead);line-height:1.5;color:var(--ink-2)}
em,.ital{font-style:italic}
/* Voz da casa: a linha pequena acima de um título é itálico serifado, nunca caixa alta. */
.eyebrow{display:inline-block;font-family:var(--font-serif);font-style:italic;font-weight:400;font-size:1.15rem;letter-spacing:0;text-transform:none;color:var(--vinho);margin-bottom:var(--space-3)}
/* Numeral / palavra em ouro metálico (usa background-clip:text). */
.foil{background:var(--ouro-foil);background-size:200% 100%;-webkit-background-clip:text;background-clip:text;color:transparent}
```

- [ ] **Step 3: Seções e cabeçalhos de seção**

Substituir de `.section{...}` até `.sec-head-row p{...}` por:

```css
.section{padding:var(--section) 0}
.section-tight{padding:calc(var(--section) * .5) 0}
.section-soft{background:var(--soft)}
.sec-head{max-width:640px;margin:0 0 var(--space-7)}
.sec-head p{font-size:var(--fs-lead)}
.sec-head-row{display:flex;align-items:flex-end;justify-content:space-between;gap:var(--space-5);margin-bottom:var(--space-7);padding-bottom:var(--space-4);border-bottom:1px solid var(--line-ouro)}
.sec-head-row h2{margin:0}
.sec-head-row p{margin:var(--space-2) 0 0}
```

- [ ] **Step 4: Verificar no navegador que o eyebrow não está em caixa alta**

Subir o dev server (`cd /c/Users/dev_c/pa-run && FORCAR_HOME_CLASSICA=1 npx next dev -p 3777`), abrir `http://localhost:3777/preview-site/sobre` e conferir que "história e confiança" aparece em itálico serifado, não em maiúsculas. Conferir também que os títulos estão em Bodoni (hastes finas).

- [ ] **Step 5: Commit**

```bash
git add app/globals.css && git commit -m "Aplica tipografia Bodoni e voz itálica no lugar dos eyebrows em caixa alta

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 4: Botões e link textual

**Files:**
- Modify: `app/globals.css` — bloco `/* --- Botões ---` (hoje linhas 109–137)

- [ ] **Step 1: Substituir o bloco inteiro de botões**

```css
/* --- Botões ---------------------------------------------------------------- */
/* Raio quase reto, sem pulo no hover. Só .btn-primary é vermelho. */
.btn{
  display:inline-flex;align-items:center;justify-content:center;gap:10px;
  min-height:48px;padding:0 28px;border:1px solid transparent;border-radius:2px;
  font-weight:500;font-size:.9rem;line-height:1;letter-spacing:.04em;cursor:pointer;white-space:nowrap;
  transition:background var(--t-base) var(--ease),color var(--t-base) var(--ease),border-color var(--t-base) var(--ease);
}
.btn-primary{background:var(--pierre);color:var(--papel)}
.btn-primary:hover{background:var(--pierre-deep)}
.btn-carbon,.btn-orange{background:var(--vinho-noir);color:var(--papel)}
.btn-carbon:hover,.btn-orange:hover{background:var(--vinho)}
.btn-outline,.btn-ghost,.btn-gold,.btn-hairline{background:transparent;color:var(--ink);border-color:var(--line-strong)}
.btn-outline:hover,.btn-ghost:hover,.btn-gold:hover,.btn-hairline:hover{border-color:var(--ouro)}
.btn-light{background:var(--papel);color:var(--vinho-noir)}
.btn-light:hover{background:var(--marfim)}
.btn-ghost-light{background:transparent;color:var(--papel);border-color:color-mix(in srgb,var(--papel) 55%,transparent)}
.btn-ghost-light:hover{border-color:var(--ouro)}
.btn-sm{min-height:40px;padding:0 18px;font-size:.85rem}
/* Link textual com traço de ouro que cresce */
.link-line{position:relative;display:inline-flex;align-items:center;gap:8px;font-weight:500;color:var(--ink);padding-bottom:3px}
.link-line::after{content:"";position:absolute;left:0;bottom:0;height:1px;width:100%;background:var(--ouro);transform:scaleX(.4);transform-origin:left;transition:transform var(--t-base) var(--ease-out)}
.link-line:hover::after{transform:scaleX(1)}
```

- [ ] **Step 2: Conferir que não sobrou hover com `transform:translateY` em `.btn`**

```bash
grep -n "btn:hover\|btn:active" "G:/Drives compartilhados/TI/developer/sites/pa/app/globals.css"
```

Esperado: nenhuma linha.

- [ ] **Step 3: Commit**

```bash
git add app/globals.css && git commit -m "Redesenha os botões: raio reto, fios, vermelho só no principal

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 5: Faixa do topo e header

**Files:**
- Modify: `app/globals.css` — blocos `/* --- Faixa do topo ---` e `/* --- Header ---` (hoje linhas 139–209)
- Modify: `components/Header.tsx:190` (classe do CTA)

- [ ] **Step 1: Faixa do topo**

```css
/* --- Faixa do topo --------------------------------------------------------- */
.topstrip{background:var(--vinho-noir);color:color-mix(in srgb,var(--marfim) 86%,transparent);position:relative;z-index:41;box-shadow:inset 0 -1px var(--line-ouro)}
.topstrip-inner{min-height:36px;display:flex;align-items:center;justify-content:center;gap:34px;font-size:12.5px;letter-spacing:.02em;padding:6px 0}
.topstrip a{color:inherit}
.topstrip a:hover{color:var(--marfim);text-decoration:underline;text-underline-offset:3px;text-decoration-color:var(--ouro)}
.topstrip strong{color:var(--marfim);font-weight:600}
@media (max-width:900px){.topstrip-extra{display:none}}
```

- [ ] **Step 2: Header (desktop)**

Substituir de `.hdr{` até `.hdr-toggle[aria-expanded="true"] span:nth-child(3){...}` por:

```css
/* --- Header ---------------------------------------------------------------- */
.hdr{position:sticky;top:0;z-index:40;background:color-mix(in srgb,var(--papel) 90%,transparent);
  backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border-bottom:1px solid var(--line);
  transition:background var(--t-base) var(--ease),border-color var(--t-base) var(--ease)}
.hdr[data-transparent="true"]:not(.is-scrolled):not(.is-nav-open){background:transparent;border-bottom-color:transparent;backdrop-filter:none;-webkit-backdrop-filter:none}
.hdr.is-scrolled{border-bottom-color:var(--line-ouro)}
.hdr-bar{height:var(--hdr-h);display:flex;align-items:center;gap:var(--space-5)}
.hdr-brand{flex:0 0 auto;display:flex;align-items:center;padding:6px 0}
.hdr-brand img{height:48px;width:auto;max-width:none}
.hdr-nav{display:flex;align-items:center;gap:2px;margin:0 auto}
.hdr-navitem{display:inline-flex;align-items:center;min-height:44px;font-size:.9rem;font-weight:500;color:var(--ink);padding:0 13px;white-space:nowrap;position:relative;transition:color var(--t-fast)}
.hdr-navitem::after{content:"";position:absolute;left:13px;right:13px;bottom:10px;height:1px;background:var(--ouro);transform:scaleX(0);transform-origin:left;transition:transform var(--t-base) var(--ease-out)}
.hdr-navitem:hover::after,.hdr-navitem.active::after,.hdr-mega.open > .hdr-navitem::after{transform:scaleX(1)}
.hdr-mega{position:relative}
.hdr-mega-panel{position:absolute;top:calc(100% + 6px);left:50%;transform:translateX(-50%) translateY(-6px);
  background:var(--papel);border:1px solid var(--line-ouro);border-radius:var(--radius-sm);box-shadow:0 20px 50px -30px rgba(43,24,30,.3);
  padding:8px;min-width:240px;opacity:0;visibility:hidden;transition:opacity var(--t-fast),transform var(--t-fast),visibility var(--t-fast);z-index:50}
.hdr-mega:hover .hdr-mega-panel,.hdr-mega.open .hdr-mega-panel,.hdr-mega:focus-within .hdr-mega-panel{opacity:1;visibility:visible;transform:translateX(-50%) translateY(0)}
.hdr-mega-cols{display:flex;flex-direction:column;gap:1px}
.hdr-mega-cols a{display:block;padding:10px 14px;border-radius:2px;font-size:.9rem;color:var(--ink-2);transition:background var(--t-fast),color var(--t-fast)}
.hdr-mega-cols a:hover{background:var(--marfim);color:var(--vinho-noir)}
.hdr-mega-cols a:first-child{color:var(--ink);font-family:var(--font-serif);font-style:italic;font-weight:400;font-size:1.2rem}
.hdr-actions{display:flex;align-items:center;gap:10px;margin-left:auto}
.hdr-icon{border:0;background:transparent;color:var(--ink);width:44px;height:44px;border-radius:2px;display:grid;place-items:center;cursor:pointer;transition:background var(--t-fast);flex:0 0 44px}
.hdr-icon:hover{background:var(--marfim)}
.hdr-search{display:flex;align-items:center;border-bottom:1px solid var(--line-strong);background:transparent;padding-left:4px;transition:border-color var(--t-fast)}
.hdr-search:focus-within{border-bottom-color:var(--ouro)}
.hdr-search-input{border:0;outline:0;background:transparent;font:inherit;font-size:.9rem;width:150px;min-width:0;padding:8px 0;color:var(--ink);border-radius:0}
.hdr-search-input::placeholder{color:var(--muted)}
.hdr-cta{min-height:42px;padding:0 20px;font-size:.85rem}
.hdr-toggle{display:none;border:0;background:transparent;width:44px;height:44px;cursor:pointer;align-items:center;justify-content:center;flex-direction:column;gap:6px;border-radius:2px}
.hdr-toggle span{display:block;width:22px;height:1px;background:var(--ink);transition:transform var(--t-base) var(--ease),opacity var(--t-fast)}
.hdr-toggle[aria-expanded="true"] span:nth-child(1){transform:translateY(7px) rotate(45deg)}
.hdr-toggle[aria-expanded="true"] span:nth-child(2){opacity:0}
.hdr-toggle[aria-expanded="true"] span:nth-child(3){transform:translateY(-7px) rotate(-45deg)}
```

- [ ] **Step 3: Header (mobile)**

Substituir o bloco `@media (max-width:1080px){ ... }` do header por:

```css
@media (max-width:1080px){
  .hdr-search-input{width:120px}
  .hdr-nav{position:absolute;top:100%;left:0;right:0;height:calc(100dvh - var(--hdr-h));margin:0;flex-direction:column;align-items:stretch;gap:0;
    background:var(--papel);padding:12px var(--gutter) 40px;overflow-y:auto;overscroll-behavior:contain;
    transform:translateY(-8px);opacity:0;visibility:hidden;transition:opacity var(--t-base) var(--ease),transform var(--t-base) var(--ease),visibility var(--t-base)}
  .hdr-nav.open{transform:none;opacity:1;visibility:visible}
  .hdr.is-nav-open{background:var(--papel);border-bottom-color:var(--line-ouro)}
  .hdr-navitem{min-height:60px;font-family:var(--font-serif);font-size:1.7rem;font-weight:400;padding:0 4px;border-radius:0;border-bottom:1px solid var(--line);width:100%;justify-content:space-between}
  .hdr-navitem::after{display:none}
  .hdr-mega{width:100%}
  .hdr-mega > .hdr-navitem::before{content:"+";font-family:var(--font-sans);font-size:1.4rem;font-weight:300;color:var(--ouro);order:2;transition:transform var(--t-base)}
  .hdr-mega.open > .hdr-navitem::before{transform:rotate(45deg)}
  .hdr-mega-panel{position:static;transform:none;opacity:1;visibility:visible;border:0;box-shadow:none;background:transparent;padding:0;min-width:0;display:none}
  .hdr-mega.open .hdr-mega-panel,.hdr-mega:hover .hdr-mega-panel,.hdr-mega:focus-within .hdr-mega-panel{transform:none;opacity:1;visibility:visible}
  .hdr-mega.open .hdr-mega-panel{display:block;padding:4px 0 12px}
  .hdr-mega-cols a{padding:12px 4px;font-size:1rem;border-bottom:1px solid color-mix(in srgb,var(--line) 60%,transparent)}
  .hdr-mega-cols a:first-child{font-size:1rem;font-family:var(--font-sans);font-style:normal;font-weight:600}
  .hdr-toggle{display:flex}
  .hdr-nav-foot{display:flex;flex-direction:column;gap:12px;padding-top:24px}
  .hdr-nav-foot .btn{width:100%}
}
@media (min-width:1081px){.hdr-nav-foot{display:none}}
@media (max-width:560px){
  .hdr-cta{display:none}
  .hdr-search-input{display:none}
  .hdr-search{border:0;background:transparent;padding:0}
  .hdr-brand img{height:40px}
}
```

- [ ] **Step 4: CTA do header em vinho-noir**

Em `components/Header.tsx`, trocar `className="btn btn-primary hdr-cta"` por `className="btn btn-carbon hdr-cta"`. O CTA do rodapé do menu mobile (`hdr-nav-foot`) continua `btn btn-primary` (é o CTA da tela no celular).

- [ ] **Step 5: Verificar no navegador**

Abrir `http://localhost:3777/preview-site/c/perfumaria` em 1440 e 390 (menu aberto). Esperado: faixa do topo vinho com fio dourado; sublinhado de hover em ouro; busca com fio inferior; "Seja consultora" em vinho-noir; menu mobile com itens grandes em Bodoni.

- [ ] **Step 6: Commit**

```bash
git add app/globals.css components/Header.tsx && git commit -m "Refaz faixa do topo e header no registro Maison

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 6: Logo em ouro e rodapé

**Files:**
- Create: `scripts/logo-ouro.mjs`
- Create (gerado): `public/assets/img/logo-pierre-gold.png`
- Modify: `components/Footer.tsx:36` (`.ftr-mark` src)
- Modify: `app/globals.css` — bloco `/* --- Footer ---` e `/* --- WhatsApp flutuante ---` (hoje linhas 211–231)

**Interfaces:**
- Produces: `public/assets/img/logo-pierre-gold.png` (mesmas dimensões do PNG branco), usado pelo rodapé nesta etapa e pelo `Manifesto` v2 na etapa 2.

- [ ] **Step 1: Script que tinge o logo branco de ouro**

```js
// scripts/logo-ouro.mjs — gera public/assets/img/logo-pierre-gold.png a partir
// do PNG branco: mantém o alpha e pinta os pixels com o ouro do design system.
// Rodar no espelho local: node scripts/logo-ouro.mjs
import sharp from "sharp";
import { resolve } from "node:path";

const ORIGEM = resolve("public/assets/img/logo-pierre-white.png");
const DESTINO = resolve("public/assets/img/logo-pierre-gold.png");
const OURO = { r: 0xb9, g: 0x9a, b: 0x68 };

const { data, info } = await sharp(ORIGEM).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
for (let i = 0; i < data.length; i += 4) {
  data[i] = OURO.r;
  data[i + 1] = OURO.g;
  data[i + 2] = OURO.b;
  // alpha (data[i+3]) fica como está
}
await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } }).png().toFile(DESTINO);
console.log(`ok: ${DESTINO} (${info.width}x${info.height})`);
```

- [ ] **Step 2: Gerar o arquivo no espelho e copiar para o G:**

```bash
sh /c/Users/dev_c/sync-pa.sh && cd /c/Users/dev_c/pa-run && node scripts/logo-ouro.mjs && cp public/assets/img/logo-pierre-gold.png "G:/Drives compartilhados/TI/developer/sites/pa/public/assets/img/"
```

Esperado: `ok: ...logo-pierre-gold.png (LxA)`. Abrir o PNG (Read) e conferir que é o script "Pierre" em dourado sobre transparente.

- [ ] **Step 3: Rodapé usa a marca em ouro**

Em `components/Footer.tsx`, trocar a linha do `.ftr-mark`:

```tsx
<img className="ftr-mark" src={asset("/assets/img/logo-pierre-gold.png")} alt="" aria-hidden="true" width={256} height={160} />
```

- [ ] **Step 4: CSS do rodapé e do WhatsApp**

Substituir de `.ftr{` até `@media (max-width:560px){.wa-float span{display:none}...}` por:

```css
/* --- Footer ---------------------------------------------------------------- */
.ftr{background:var(--vinho-noir);color:var(--marfim);padding:var(--space-9) 0 var(--space-6);position:relative;overflow:hidden}
.ftr-top{display:grid;grid-template-columns:1.4fr repeat(var(--ftr-cols,4),1fr);gap:0;padding-bottom:var(--space-8);border-bottom:1px solid var(--line-ouro);position:relative;z-index:1}
.ftr-top > *{padding:0 var(--space-6)}
.ftr-top > :first-child{padding-left:0}
.ftr-top > :last-child{padding-right:0}
.ftr-top > * + *{border-left:1px solid color-mix(in srgb,var(--ouro) 20%,transparent)}
.ftr-logo{height:52px;width:auto;margin-bottom:var(--space-5)}
.ftr-brand-col p{color:color-mix(in srgb,var(--marfim) 72%,transparent);font-size:.95rem;line-height:1.65;max-width:34ch;margin-bottom:var(--space-3)}
.ftr-sac{font-size:.85rem!important;color:color-mix(in srgb,var(--marfim) 55%,transparent)!important}
.ftr-col h4{margin:0 0 var(--space-4);font-family:var(--font-serif);font-style:italic;font-size:1.3rem;font-weight:400;color:var(--marfim)}
.ftr-col a{display:block;padding:6px 0;color:color-mix(in srgb,var(--marfim) 70%,transparent);font-size:.92rem;transition:color var(--t-fast)}
.ftr-col a:hover{color:var(--ouro-claro)}
.ftr-bottom{display:flex;justify-content:space-between;align-items:center;gap:var(--space-5);padding-top:var(--space-5);color:color-mix(in srgb,var(--marfim) 50%,transparent);font-size:.82rem;flex-wrap:wrap;position:relative;z-index:1}
.ftr-social{display:flex;gap:8px;flex-wrap:wrap}
.ftr-social a{display:inline-flex;align-items:center;min-height:40px;padding:0 16px;border:1px solid color-mix(in srgb,var(--ouro) 40%,transparent);border-radius:2px;color:color-mix(in srgb,var(--marfim) 82%,transparent);font-size:.85rem;letter-spacing:.03em;transition:border-color var(--t-fast),color var(--t-fast)}
.ftr-social a:hover{border-color:var(--ouro);color:var(--marfim)}
.ftr-mark{position:absolute;right:-2%;bottom:-6%;width:min(52vw,560px);opacity:.05;pointer-events:none;user-select:none;z-index:0}
@media (max-width:1000px){
  .ftr-top{grid-template-columns:1fr 1fr;gap:var(--space-6)}
  .ftr-top > *{padding:0}
  .ftr-top > * + *{border-left:0}
  .ftr-brand-col{grid-column:1/-1;padding-bottom:var(--space-5);border-bottom:1px solid color-mix(in srgb,var(--ouro) 20%,transparent)}
}
@media (max-width:560px){.ftr{padding-top:var(--space-8)}.ftr-top{grid-template-columns:1fr;gap:var(--space-5)}.ftr-bottom{flex-direction:column;align-items:flex-start}}

/* --- WhatsApp flutuante ---------------------------------------------------- */
.wa-float{position:fixed;right:20px;bottom:20px;background:#25d366;color:#fff;border-radius:2px;min-height:48px;padding:0 18px 0 14px;font-weight:500;font-size:.875rem;display:flex;align-items:center;gap:8px;box-shadow:0 12px 28px -12px rgba(0,0,0,.35);z-index:60;transition:background var(--t-fast)}
.wa-float:hover{background:#1eb858}
@media (max-width:560px){.wa-float span{display:none}.wa-float{width:52px;height:52px;padding:0;justify-content:center}}
```

- [ ] **Step 5: Verificar no navegador**

Rodapé em 1440: fios verticais dourados entre colunas, títulos em Bodoni itálico, marca dourada ao fundo. Em 390: colunas empilhadas, sem fios verticais.

- [ ] **Step 6: Commit**

```bash
cd "G:/Drives compartilhados/TI/developer/sites/pa" && git add scripts/logo-ouro.mjs public/assets/img/logo-pierre-gold.png components/Footer.tsx app/globals.css && git commit -m "Refaz o rodapé com fios de ouro e marca dourada

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 7: Formulários, camada legada e blocos genéricos (recolorir)

**Files:**
- Modify: `app/globals.css` — bloco `/* --- Blocos genéricos do CMS ---` (hoje linhas 315–343) e bloco `COMPATIBILIDADE` (linhas 344–454)

Esta task só recolore e tira caixas; a estrutura dos blocos do CMS (§6 da spec, hero 21:9 etc.) fica para a etapa 4.

- [ ] **Step 1: Blocos genéricos do CMS — fundos**

Trocar:

```css
.cms-hero{background:var(--vinho-deep);color:#fff;...
```
por
```css
.cms-hero{background:var(--vinho-noir);color:var(--marfim);padding:calc(var(--section) * 1.1) 0;position:relative;overflow:hidden;isolation:isolate}
```

e

```css
.cms-cta{background:var(--pierre);color:#fff;padding:var(--section) 0;text-align:center}
.cms-cta h2,.cms-cta p{color:#fff}
.cms-cta p{margin-inline:auto;font-size:var(--fs-lead);color:rgba(255,255,255,.9)}
```
por
```css
.cms-cta{background:var(--vinho-noir);color:var(--marfim);padding:var(--section) 0;text-align:center;box-shadow:inset 0 1px var(--line-ouro)}
.cms-cta h2,.cms-cta p{color:var(--marfim)}
.cms-cta p{margin-inline:auto;font-size:var(--fs-lead);color:color-mix(in srgb,var(--marfim) 88%,transparent)}
```

Em `.cms-hero .eyebrow{color:var(--areia)}` trocar para `color:var(--ouro-claro)`. Em `.cms-col{border-top:1px solid var(--line-strong)...}` trocar para `border-top:1px solid var(--line-ouro)`. Em `.cms-produtos-vazio` trocar `border-radius:var(--radius)` por `border-radius:2px`.

- [ ] **Step 2: Camada legada — cabeçalho de página e faixas**

Substituir de `.page-hero{` até `.section-title p{...}` por:

```css
.page-hero{background:var(--papel);padding:var(--space-8) 0 var(--space-7);border-bottom:1px solid var(--line-ouro)}
.page-hero h1{margin-bottom:var(--space-3);font-size:var(--fs-display);line-height:.95}
.page-hero p{font-size:var(--fs-lead);max-width:640px;font-family:var(--font-serif);font-style:italic;font-size:1.35rem;color:var(--vinho)}
.breadcrumb{font-size:var(--fs-label);letter-spacing:0;text-transform:none;font-weight:500;color:var(--muted);margin-bottom:var(--space-4)}
.hero-tag{display:inline-block;font-family:var(--font-serif);font-style:italic;font-weight:400;font-size:clamp(2.6rem,5vw,4.5rem);line-height:1;margin-bottom:6px;background:var(--ouro-foil);-webkit-background-clip:text;background-clip:text;color:transparent}
.section-paper{background:var(--marfim)}
.section-red,.section-black{background:var(--vinho-noir);color:var(--marfim)}
.section-red h2,.section-red .eyebrow,.section-black h2{color:var(--marfim)}
.section-red p,.section-black p{color:color-mix(in srgb,var(--marfim) 80%,transparent)}
.section-red .eyebrow,.section-black .eyebrow{color:var(--ouro-claro)}
.section-title{margin-bottom:var(--space-6)}
.section-title p{font-size:var(--fs-lead);max-width:560px}
```

- [ ] **Step 3: Camada legada — caixas viram fios**

Trocar as regras abaixo (mantendo as demais):

```css
.feature-img{border-radius:var(--radius-lg);overflow:hidden;aspect-ratio:4/3;background:var(--marfim)}
.pill{display:inline-flex;align-items:center;min-height:36px;padding:0 14px;border-radius:2px;background:transparent;border:1px solid var(--line-strong);font-size:.82rem;font-weight:500;color:var(--ink)}
.section-red .pill{background:transparent;border-color:color-mix(in srgb,var(--ouro) 45%,transparent);color:var(--marfim)}
.panel{background:transparent;border:0;border-top:1px solid var(--line-ouro);border-radius:0;padding:22px 0 0}
.panel.dark{background:transparent;color:var(--marfim);border-top-color:color-mix(in srgb,var(--ouro) 45%,transparent)}
.panel.dark p{color:color-mix(in srgb,var(--marfim) 72%,transparent)}
.panel.red{background:var(--vinho-noir);color:var(--marfim);border:0;padding:28px;border-radius:2px}
.panel.red h3,.panel.dark h3{color:var(--marfim)}
.panel.red p{color:color-mix(in srgb,var(--marfim) 88%,transparent)}
.section-black .level{background:transparent;border-color:color-mix(in srgb,var(--ouro) 35%,transparent);color:var(--marfim)}
.section-black .level span{color:color-mix(in srgb,var(--marfim) 70%,transparent)}
.quick-card{background:transparent;border:0;border-top:1px solid var(--line-ouro);border-radius:0;padding:22px 0 0}
.quick-card b{display:block;margin-bottom:8px;color:var(--vinho);font-family:var(--font-serif);font-size:1.5rem;font-weight:400}
.product-card{background:transparent;border:0;border-top:1px solid var(--line-ouro);border-radius:0;overflow:hidden}
.product-card img{width:100%;height:260px;object-fit:cover;background:var(--marfim);margin-top:18px}
.pc-body{padding:22px 0}.pc-body p{font-size:.95rem}
.pc-link{font-weight:500;color:var(--vinho)}
.cta-band{background:var(--marfim);border-radius:2px;border-top:1px solid var(--line-ouro);padding:var(--space-7);display:flex;align-items:center;justify-content:space-between;gap:var(--space-5)}
.category-strip a{background:transparent;border:0;border-top:1px solid var(--line-ouro);border-radius:0;padding:22px 0 0;min-height:140px;display:flex;flex-direction:column;justify-content:space-between}
.category-strip strong{font-size:1.5rem;color:var(--vinho);font-family:var(--font-serif);font-weight:400}
.step{background:transparent;border:0;border-top:1px solid var(--line-ouro);border-radius:0;padding:22px 0 0}
.step:before{content:"";display:block;width:32px;height:1px;background:var(--ouro);margin-bottom:18px}
.level{background:transparent;border:0;border-top:2px solid var(--ouro);border-radius:0;padding:18px 0 0}
.form-box{background:transparent;border:0;border-top:1px solid var(--line-ouro);border-radius:0;padding:28px 0 0}
label{display:block;font-size:var(--fs-label);text-transform:none;letter-spacing:0;font-weight:500;margin-bottom:6px;color:var(--muted)}
input,select,textarea{width:100%;border:0;border-bottom:1px solid var(--line-strong);border-radius:0;background:transparent;padding:12px 0;font:inherit;color:var(--ink);transition:border-color var(--t-fast)}
input:focus,select:focus,textarea:focus{outline:0;border-bottom:1.5px solid var(--ouro)}
.story-card{background:transparent;border:0;border-top:1px solid var(--line-ouro);border-radius:0;padding:26px 0 0}
.story-card .quote{font-family:var(--font-serif);font-style:italic;font-size:1.7rem;line-height:1.2;color:var(--vinho);font-weight:400}
.list-check li:before{content:"—";position:absolute;left:0;color:var(--ouro);font-weight:400}
.color-band span:nth-child(1){background:var(--vinho-noir)}
.color-band span:nth-child(2){background:var(--ouro)}
.price{font-family:var(--font-serif);font-size:2.2rem;font-weight:400;color:var(--vinho-noir);margin:16px 0}
.benefit{background:transparent;border:0;border-top:1px solid var(--line-ouro);border-radius:0;padding:14px 0 0;font-weight:500}
.motivo-row{display:flex;align-items:center;gap:24px;background:transparent;border:0;border-left:1px solid var(--line-ouro);border-radius:0;padding:8px 0 8px 28px}
.motivo-icon{flex-shrink:0;width:74px;height:74px;display:flex;align-items:center;justify-content:center;background:var(--blush);border-radius:50%;color:var(--vinho)}
.motivo-highlight{background:var(--vinho-noir);border:0;color:var(--marfim);position:relative;padding:24px 28px;border-radius:2px}
.motivo-highlight .motivo-icon{background:color-mix(in srgb,var(--marfim) 14%,transparent);color:var(--marfim)}
.motivo-badge{position:absolute;top:-12px;right:22px;background:var(--ouro);color:var(--vinho-noir);font-size:.72rem;font-weight:600;letter-spacing:.02em;text-transform:none;padding:7px 13px;border-radius:2px}
.motivo-stat-label{font-size:.8rem;font-weight:500;letter-spacing:0;text-transform:none;color:color-mix(in srgb,var(--marfim) 80%,transparent)}
.table-like{display:flex;flex-direction:column;margin-top:22px;border-radius:0;overflow:hidden;background:transparent;border:0;border-top:1px solid var(--line-ouro)}
.table-row.table-sub{padding-left:50px;background:var(--marfim);position:relative}
.top2-badge{display:inline-block;background:var(--vinho-noir);color:var(--marfim);font-size:.7rem;font-weight:500;letter-spacing:.02em;text-transform:none;padding:3px 9px;border-radius:2px;margin:0 4px}
```

- [ ] **Step 4: Conferir que não sobrou vermelho fora do permitido**

```bash
cd "G:/Drives compartilhados/TI/developer/sites/pa" && grep -n "var(--pierre)" app/globals.css | grep -v "btn-primary\|--pierre-deep\|^[0-9]*:  --"
```

Esperado: nenhuma linha (a única regra com `var(--pierre)` como cor é `.btn-primary`; o `:root` define o token). Se aparecer `.hdr-mega > .hdr-navitem::before`, `.pcard-cta`, `.crumbs a:hover`, `.filter-check input`, `.chip`, `.filter-group button.active`, `.hdr-search:focus-within`, trocar para `var(--ouro)` (bordas/ícones) ou `var(--vinho)` (texto). `.pcard-cta` e `.chip` são da etapa 3, mas a cor já muda aqui.

- [ ] **Step 5: Build e commit**

```bash
sh /c/Users/dev_c/sync-pa.sh && cd /c/Users/dev_c/pa-run && npx tsc --noEmit && npm run build 2>&1 | grep -E "✓|error" | head
cd "G:/Drives compartilhados/TI/developer/sites/pa" && git add app/globals.css && git commit -m "Recolore formulários, blocos do CMS e camada legada para o registro Maison

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 8: Verificação visual, overflow e documentação

**Files:**
- Modify: `docs/REDESIGN.md` (seção nova "Design system Maison")

- [ ] **Step 1: Subir o dev server no espelho**

```bash
cd /c/Users/dev_c/pa-run && sed -i 's/const pagina = await getPaginaPublicada("home");/const pagina = process.env.FORCAR_HOME_CLASSICA ? null : await getPaginaPublicada("home");/' app/page.tsx && (FORCAR_HOME_CLASSICA=1 npx next dev -p 3777 > dev.log 2>&1 &) ; sleep 8; tail -3 dev.log
```

- [ ] **Step 2: Screenshots e overflow com o navegador do Playwright MCP**

Com `browser_run_code_unsafe`, para cada página em `["/preview-site", "/preview-site/c/perfumaria", "/preview-site/p/aguas-virtuosas-camomila-215-ml-pierre-alexander", "/preview-site/sobre", "/preview-site/consultora", "/preview-site/onde-comprar"]` e cada largura em `[1440, 390]`: `page.setViewportSize`, `page.goto(url, {waitUntil:"networkidle"})`, forçar `document.querySelectorAll('.reveal,.reveal-plain').forEach(e=>e.classList.add('is-in'))`, tirar screenshot `fullPage` no scratchpad e registrar `[document.documentElement.scrollWidth, document.documentElement.clientWidth]`.

Esperado: `scrollWidth === clientWidth` em todas as combinações. Abrir (Read) cada screenshot e conferir contra a spec §3: nenhum fundo vermelho além do `.btn-primary`; títulos em Bodoni; eyebrows em itálico; rodapé com fios de ouro; header com CTA vinho-noir.

- [ ] **Step 3: Documentar**

Em `docs/REDESIGN.md`, adicionar antes de "## Movimento":

```markdown
## Design system Maison (set/2026)

Spec completa em `docs/superpowers/specs/2026-09-14-design-system-maison-design.md`.
Etapas: (1) tokens, tipografia e chrome — **no ar**; (2) home; (3) categoria e
produto; (4) institucionais, blocos do CMS e formulários.

Regras rápidas: vermelho `--pierre` só no logotipo e em `.btn-primary`; fundo
escuro é `--vinho-noir`, nunca preto; ouro (`--ouro`, `--ouro-foil`) só como
fio, numeral ou brilho; eyebrows em Bodoni itálico (`.eyebrow`), nunca caixa
alta; foco de teclado em ouro; botões com raio 2px e sem pulo no hover.
Fontes: Bodoni Moda (`--font-bodoni`) e Manrope (`--font-manrope`), em
`app/layout.tsx`. Logo em ouro: `node scripts/logo-ouro.mjs`.
```

Atualizar também a tabela "Onde as coisas estão" (linha das fontes: `--font-bodoni` / `--font-manrope`).

- [ ] **Step 4: Parar o dev server, build final e commit**

```powershell
$c = Get-NetTCPConnection -LocalPort 3777 -State Listen -ErrorAction SilentlyContinue | Select-Object -First 1; if ($c) { Stop-Process -Id $c.OwningProcess -Force -Confirm:$false }
```

```bash
sh /c/Users/dev_c/sync-pa.sh && cd /c/Users/dev_c/pa-run && npx tsc --noEmit && npm run build 2>&1 | grep -E "✓|error" | head
cd "G:/Drives compartilhados/TI/developer/sites/pa" && git add docs/REDESIGN.md && git commit -m "Documenta a etapa 1 do design system Maison

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

- [ ] **Step 5: Mostrar ao usuário e só então publicar**

Subir o dev server de novo para o usuário ver em `http://localhost:3777/preview-site`. Push na `main` (`git push origin main`) só depois do "pode publicar" dele; o Vercel faz o deploy.

---

## Self-review (feito ao escrever)

- **Cobertura da spec (§2, §3, §6-cores, §9 etapa 1):** tokens (Task 2), tipografia e eyebrow (Task 1, 3), botões (4), faixa do topo e header (5), rodapé e logo ouro (6), formulários e camada legada recolorida (7), verificação e docs (8). A estrutura nova dos blocos do CMS (hero 21:9) e `.cat-hero`/`.pcard` ficam para as etapas 3 e 4, como a spec prevê.
- **Placeholders:** nenhum; todo passo tem o código ou o comando.
- **Consistência de nomes:** `--vinho-noir`, `--ouro`, `--ouro-foil`, `--line-ouro`, `--papel`, `--marfim`, `--blush`, `--lilas` usados nas Tasks 3–7 são todos definidos na Task 2; `--font-bodoni` da Task 1 é consumida na Task 2; `logo-pierre-gold.png` da Task 6 é referenciado no Footer na mesma task.
