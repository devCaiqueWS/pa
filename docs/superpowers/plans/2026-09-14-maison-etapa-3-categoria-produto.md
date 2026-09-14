# Maison — Etapa 3: categoria e produto — plano de implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Levar o card de produto, a página de categoria e a página de produto ao registro Maison: cards sem caixa branca (packshot "sentado" no marfim, inclinação com reflexo dourado ao passar o mouse), cabeçalho de categoria com foto 21:9 em parallax e filtros com fios, página de produto com preço, ficha em fios de ouro, sem estrelas falsas e com barra fixa no celular.

**Architecture:** O card (`components/ProductCard.tsx`) é compartilhado por vitrines da home, listagem e "você também pode gostar"; muda uma vez e reflete em todo lugar. A inclinação é um componente cliente genérico (`components/ui/Tilt.tsx`) que escreve variáveis CSS (`--rx`, `--ry`, `--mx`, `--my`) no próprio elemento; o CSS faz o resto e desliga sem hover ou com reduced-motion. O cabeçalho de categoria usa `ScrollProgress` (faixa `SAIDA`) para o parallax. A barra fixa do produto (`components/PdpBar.tsx`) observa as ações da página com `IntersectionObserver`.

**Tech Stack:** Next.js 16 App Router, React 19, CSS puro. Sem dependências novas.

**Spec:** `docs/superpowers/specs/2026-09-14-design-system-maison-design.md` (§5 Categoria e produto, §7 Movimento).

## Global Constraints

- Espelho local `C:\Users\dev_c\pa-run`: editar no `G:`, `sh /c/Users/dev_c/sync-pa.sh`; depois do sync, `sed -i 's/const pagina = await getPaginaPublicada("home");/const pagina = process.env.FORCAR_HOME_CLASSICA ? null : await getPaginaPublicada("home");/' app/page.tsx` no espelho quando o dev server estiver com `FORCAR_HOME_CLASSICA=1`.
- Verificação: `npx tsc --noEmit` e `npm run build` no espelho (nunca junto com `next dev`). Screenshots em 1440 e 390 com o navegador do Playwright MCP (screenshot descartável após `scrollTo` antes de medir). Páginas de teste: `/preview-site/c/perfumaria`, `/preview-site/c/cuidado-facial`, `/preview-site/p/aguas-virtuosas-camomila-215-ml-pierre-alexander`.
- Vermelho `var(--pierre)` só em `.btn-primary`. Fundo escuro = `--vinho-noir`. Ouro só como fio, numeral, brilho ou reflexo. Sem caixa alta em etiquetas.
- Movimento só com `transform`/`opacity`; `Tilt` só com `(hover:hover)` e sem `prefers-reduced-motion`. Nenhuma página com `scrollWidth > clientWidth` em 390 e 1440.
- Sem sinais falsos: o bloco de estrelas sai; preço só aparece quando `product.preco` existe.
- Commits em português, no imperativo, com `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>`. Branch `maison-etapa-3` no mesmo checkout. Merge no Drive: se `git merge` abortar no meio ("Updating files"), `git reset --hard HEAD`, apagar sobras não rastreadas que já existem no branch e repetir.

---

## Mapa de arquivos

| Arquivo | Responsabilidade |
| --- | --- |
| `components/ui/Tilt.tsx` (novo) | inclinação + reflexo que seguem o ponteiro (escreve `--rx --ry --mx --my`) |
| `components/ProductCard.tsx` | mídia envolvida pelo `Tilt`; etiquetas |
| `components/ProductImage.tsx` | placeholder sem foto vira "Pierre" em ouro-foil |
| `app/globals.css` — `.pcard*`, `.tilt*`, `.cat-hero*`, `.listing*`, `.pdp*`, `.pdp-bar*` | todo o CSS desta etapa |
| `app/c/[slug]/page.tsx` | cabeçalho de categoria com foto 21:9 em parallax |
| `components/CategoryListing.tsx` | grade com entrada 3D (`Reveal plain` + `index`) |
| `app/p/[slug]/page.tsx` | preço, ficha, sem estrelas, `Tilt` na galeria, `PdpBar` |
| `components/PdpBar.tsx` (novo) | barra fixa no celular com nome, preço e botão |
| `docs/REDESIGN.md` | estado da etapa 3 |

Linhas citadas são do commit `ccf1067`; confira com `grep -n` antes de editar.

---

### Task 1: `Tilt` e card de produto v2

**Files:**
- Create: `components/ui/Tilt.tsx`
- Modify: `components/ProductCard.tsx` (linhas 8–10: `<div className="pcard-media">` → `<Tilt className="pcard-media">`)
- Modify: `components/ProductImage.tsx` (placeholder)
- Modify: `app/globals.css` — bloco `/* --- Vitrine e card de produto ---` (`.pcard{` até `.pcard-noimg{...}`)

**Interfaces:**
- Produces: `<Tilt className? max?>` (cliente; `div.tilt` com `is-tilt` enquanto o ponteiro está sobre ele); classes `.pcard-media` sem borda, `.pcard-noimg span` em ouro-foil. As Tasks 2 e 3 reutilizam `Tilt`.

- [ ] **Step 1: `components/ui/Tilt.tsx`**

```tsx
"use client";

import { useRef, type PointerEvent, type ReactNode } from "react";

type Props = { children: ReactNode; className?: string; /** inclinação máxima em graus */ max?: number };

// Inclinação que segue o ponteiro (até `max` graus em cada eixo) e um reflexo
// radial em ouro na posição do ponteiro. Só escreve variáveis CSS; o CSS
// (.tilt) aplica a transformação e desliga sem hover ou com reduced-motion.
export default function Tilt({ children, className = "", max = 6 }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty("--rx", `${((0.5 - y) * max * 2).toFixed(2)}deg`);
    el.style.setProperty("--ry", `${((x - 0.5) * max * 2).toFixed(2)}deg`);
    el.style.setProperty("--mx", `${(x * 100).toFixed(1)}%`);
    el.style.setProperty("--my", `${(y * 100).toFixed(1)}%`);
    el.classList.add("is-tilt");
  };
  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    for (const v of ["--rx", "--ry", "--mx", "--my"]) el.style.removeProperty(v);
    el.classList.remove("is-tilt");
  };

  return (
    <div ref={ref} className={`tilt ${className}`.trim()} onPointerMove={onMove} onPointerLeave={onLeave}>
      {children}
    </div>
  );
}
```

- [ ] **Step 2: `ProductCard.tsx`**

Adicionar `import Tilt from "@/components/ui/Tilt";` e trocar `<div className="pcard-media">` … `</div>` (o wrapper da mídia, que contém as etiquetas e o `ProductImage`) por `<Tilt className="pcard-media">` … `</Tilt>`.

- [ ] **Step 3: `ProductImage.tsx` — placeholder**

Trocar o bloco `if (!src || broken) { return (<div className="pcard-noimg" ...><span>Pierre</span></div>); }` mantendo a estrutura; só o CSS muda (Step 4). Nenhuma alteração de TSX é necessária além de conferir que o `<span>` existe.

- [ ] **Step 4: CSS do card (substituir de `.pcard{` até `.pcard-noimg{...}` inclusive)**

```css
.pcard{display:flex;flex-direction:column;background:transparent;border-radius:0;overflow:visible;height:100%;position:relative}
/* Mídia em marfim, sem borda; o packshot (fundo branco) "senta" no marfim via multiply. */
.pcard-media{position:relative;aspect-ratio:4/5;background:var(--marfim);border:0;overflow:hidden;border-radius:var(--radius)}
.pcard-media img{width:100%;height:100%;object-fit:cover;mix-blend-mode:multiply;transition:transform var(--t-slow) var(--ease-out)}
@media (hover:hover){.pcard:hover .pcard-media img{transform:scale(1.04)}}
.pcard-badges{position:absolute;top:12px;left:12px;display:flex;flex-direction:column;gap:6px;z-index:2}
.pcard-badge{background:var(--lilas);color:var(--vinho-noir);font-size:.74rem;font-weight:500;letter-spacing:0;text-transform:none;padding:6px 10px;border-radius:2px}
.pcard-badge:nth-child(2n){background:var(--blush)}
.pcard-body{padding:16px 2px 6px;display:flex;flex-direction:column;flex:1;gap:4px}
.pcard-eyebrow{font-size:.78rem;letter-spacing:0;text-transform:none;font-weight:500;color:var(--muted)}
.pcard-name{font-family:var(--font-serif);font-size:1.3rem;font-weight:600;margin:0;line-height:1.1;letter-spacing:0}
.pcard-desc{font-size:.9rem;line-height:1.5;color:var(--muted);margin:2px 0 8px;flex:1;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.pcard-price{display:block;font-weight:500;color:var(--ink);margin:0 0 6px}
.pcard-cta{align-self:flex-start;font-size:.875rem;font-weight:500;color:var(--vinho);padding-bottom:2px;border-bottom:1px solid var(--line-ouro)}
.pcard-noimg{display:flex;align-items:center;justify-content:center;width:100%;height:100%;min-height:200px;background:var(--marfim)}
.pcard-noimg span{font-family:var(--font-serif);font-style:italic;font-weight:500;font-size:2.2rem;letter-spacing:0;text-transform:none;background:var(--ouro-foil);-webkit-background-clip:text;background-clip:text;color:transparent}
/* Inclinação + reflexo (Tilt): só com ponteiro fino e sem reduced-motion. */
.tilt{transform:perspective(900px) rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg));transition:transform .6s var(--ease-out);will-change:transform}
.tilt.is-tilt{transition:transform .08s linear}
.tilt::after{content:"";position:absolute;inset:0;border-radius:inherit;background:radial-gradient(circle at var(--mx,50%) var(--my,50%),rgba(230,207,159,.38),rgba(230,207,159,0) 55%);opacity:0;transition:opacity .4s var(--ease);pointer-events:none;z-index:1}
.tilt.is-tilt::after{opacity:1}
@media (hover:none),(prefers-reduced-motion:reduce){.tilt,.tilt.is-tilt{transform:none;transition:none}.tilt::after{display:none}}
```

- [ ] **Step 5: Verificar e commit**

`/preview-site/c/perfumaria` em 1440: cards sem caixa branca, packshots sobre marfim (fundo branco some), etiquetas em lilás/blush; mover o mouse sobre um card inclina e mostra o reflexo; `page.emulateMedia({reducedMotion:'reduce'})` remove a inclinação. Produto sem foto mostra "Pierre" dourado. Home: anel e grade continuam corretos. Commit:

```bash
git add components/ui/Tilt.tsx components/ProductCard.tsx components/ProductImage.tsx app/globals.css && git commit -m "Refaz o card de produto: marfim, multiply, inclinação com reflexo dourado

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 2: Página de categoria (cabeçalho 21:9 em parallax, filtros com fios, grade com entrada 3D)

**Files:**
- Modify: `app/c/[slug]/page.tsx` (a `<section className="cat-hero">`)
- Modify: `components/CategoryListing.tsx` (a `listing-grid`)
- Modify: `app/globals.css` — bloco `/* --- Categoria (hero, breadcrumbs, listagem) ---`

**Interfaces:**
- Consumes: `ScrollProgress`/`SAIDA` (`components/ui/ScrollProgress`), `Reveal` (`plain`), `ProductCard` com `index`, `srcSetDeCaminho`, `imagemSrc`.

- [ ] **Step 1: Cabeçalho com foto**

Em `app/c/[slug]/page.tsx`, adicionar `import ScrollProgress, { SAIDA } from "@/components/ui/ScrollProgress";`, `import { imagemSrc } from "@/lib/site";` e `import { srcSetDeCaminho } from "@/lib/imagens";`. Substituir a `<section className="cat-hero">…</section>` por:

```tsx
      {/* Foto da categoria em 21:9 com parallax (--p via ScrollProgress); sem foto, cabeçalho em marfim. */}
      <ScrollProgress as="section" className={`cat-hero${category.image ? " has-img" : ""}`} faixa={SAIDA}>
        {category.image && (
          <div className="cat-hero-media" aria-hidden="true">
            <img src={imagemSrc(category.image)} srcSet={srcSetDeCaminho(category.image)} sizes="100vw" alt="" loading="eager" fetchPriority="high" />
          </div>
        )}
        <div className="container cat-hero-copy">
          <nav className="crumbs" aria-label="Caminho">
            <Link href="/">Início</Link>
            <span>/</span>
            <span>{category.name}</span>
          </nav>
          <h1>{category.name}</h1>
          {category.tagline && <p>{category.tagline}</p>}
        </div>
      </ScrollProgress>
```

- [ ] **Step 2: Grade com entrada 3D**

Em `components/CategoryListing.tsx`, adicionar `import Reveal from "@/components/ui/Reveal";` e trocar

```tsx
            <div className="listing-grid">
              {filtered.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
```
por
```tsx
            <Reveal className="listing-grid rail-3d" plain>
              {filtered.map((p, i) => (
                <ProductCard key={p.slug} product={p} index={i} />
              ))}
            </Reveal>
```

- [ ] **Step 3: CSS (substituir de `.cat-hero{` até `.crumbs span{...}` e ajustar a listagem)**

```css
/* --- Categoria (cabeçalho, breadcrumbs, listagem) -------------------------- */
.cat-hero{position:relative;background:var(--marfim);padding:var(--space-7) 0 var(--space-6);overflow:hidden;isolation:isolate}
.cat-hero.has-img{min-height:min(48vw,520px);display:flex;align-items:flex-end;padding:var(--space-8) 0 var(--space-6);background:var(--vinho-noir)}
.cat-hero-media{position:absolute;inset:-14% 0 0;z-index:0;transform:translateY(calc(var(--p,0) * 14%));will-change:transform}
.cat-hero-media img{width:100%;height:100%;object-fit:cover;object-position:center 40%}
.cat-hero.has-img::after{content:"";position:absolute;inset:0;z-index:1;background:linear-gradient(0deg,rgba(43,24,30,.82) 0%,rgba(43,24,30,.38) 50%,rgba(43,24,30,.06) 100%);pointer-events:none}
.cat-hero-copy{position:relative;z-index:2}
.cat-hero h1{font-size:var(--fs-display);line-height:.95;margin-bottom:var(--space-2)}
.cat-hero p{font-family:var(--font-serif);font-style:italic;font-weight:500;font-size:1.35rem;color:var(--vinho);margin:0;max-width:560px}
.cat-hero.has-img h1,.cat-hero.has-img p,.cat-hero.has-img .crumbs,.cat-hero.has-img .crumbs a{color:var(--marfim)}
.cat-hero.has-img p{color:color-mix(in srgb,var(--marfim) 88%,transparent)}
.crumbs{display:flex;align-items:center;gap:8px;font-size:.8rem;color:var(--muted);margin-bottom:var(--space-4)}
.crumbs a:hover{color:var(--vinho)}
.crumbs span{opacity:.6}
@media (max-width:760px){.cat-hero.has-img{min-height:min(70vw,420px)}}
@media (prefers-reduced-motion:reduce){.cat-hero-media{transform:none;inset:0}}
```

E, nas regras da listagem que seguem, trocar:

- `.listing-filters h4{font-size:.75rem;text-transform:uppercase;letter-spacing:.1em;color:var(--muted);margin:0 0 14px}` → `.listing-filters h4{font-family:var(--font-serif);font-style:italic;font-weight:500;font-size:1.15rem;text-transform:none;letter-spacing:0;color:var(--vinho);margin:0 0 10px}`
- `.filter-block:not(:first-child){padding-top:22px;border-top:1px solid var(--line)}` → `border-top:1px solid var(--line-ouro)`
- `.filter-check{...border-radius:var(--radius-sm);...}` → `border-radius:2px`; `.filter-check:hover{background:var(--soft)}` → `background:var(--marfim)`
- `.filter-group button{...border-radius:var(--radius-sm);...}` → `border-radius:2px;padding:0 12px`; `.filter-group button:hover{background:var(--soft)}` → `background:var(--marfim)`
- `.listing-bar{...border-bottom:1px solid var(--line)}` → `border-bottom:1px solid var(--line-ouro)`
- `.listing-count{font-size:.875rem;color:var(--muted)}` → `.listing-count{font-family:var(--font-serif);font-style:italic;font-size:1.05rem;color:var(--vinho)}`
- `.listing-sort select{width:auto;border:1px solid var(--line-strong);border-radius:999px;padding:9px 14px;font:inherit;font-size:.875rem;background:var(--branco);color:var(--ink);cursor:pointer}` → `.listing-sort select{width:auto;border:0;border-bottom:1px solid var(--line-strong);border-radius:0;padding:8px 4px;font:inherit;font-size:.875rem;background:transparent;color:var(--ink);cursor:pointer}`
- `.listing-filter-toggle{display:none;border:1px solid var(--line-strong);background:var(--branco);border-radius:999px;...}` → `border-radius:2px;background:transparent;`

- [ ] **Step 4: Verificar e commit**

`/preview-site/c/perfumaria` e `/c/cuidado-facial` em 1440 e 390: foto em 21:9 com título marfim embaixo à esquerda; ao rolar, a foto desliza (parallax); filtros sem caixas; cards entram em 3D; trocar uma subcategoria refaz a entrada. Overflow zero. Commit:

```bash
git add "app/c/[slug]/page.tsx" components/CategoryListing.tsx app/globals.css && git commit -m "Refaz a página de categoria: foto em parallax, filtros com fios, grade em 3D

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 3: Página de produto (preço, ficha em fios, sem estrelas, galeria com Tilt, barra fixa)

**Files:**
- Create: `components/PdpBar.tsx`
- Modify: `app/p/[slug]/page.tsx` (galeria, rating, preço, ficha, barra)
- Modify: `app/globals.css` — bloco `/* --- Página de produto ---` e `.wa-float`

**Interfaces:**
- Consumes: `Tilt` (Task 1), `product.preco?: number` (`lib/catalog.ts`).
- Produces: `<PdpBar nome preco? />` (cliente); classe `has-pdp-bar` no `<body>` enquanto a barra está visível.

- [ ] **Step 1: `components/PdpBar.tsx`**

```tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Props = { nome: string; preco?: number };

// Barra fixa no rodapé do celular: aparece quando os botões da página de
// produto (.pdp-actions) já rolaram para fora da tela. Marca o <body> com
// has-pdp-bar para o WhatsApp flutuante subir.
export default function PdpBar({ nome, preco }: Props) {
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    const alvo = document.querySelector(".pdp-actions");
    if (!alvo || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setVisivel(!e.isIntersecting && e.boundingClientRect.top < 0), { threshold: 0 });
    io.observe(alvo);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    document.body.classList.toggle("has-pdp-bar", visivel);
    return () => document.body.classList.remove("has-pdp-bar");
  }, [visivel]);

  return (
    <div className={`pdp-bar${visivel ? " is-on" : ""}`} aria-hidden={!visivel}>
      <div className="pdp-bar-info">
        <strong>{nome}</strong>
        {preco != null && <span>{preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>}
      </div>
      <Link className="btn btn-primary btn-sm" href="/onde-comprar" tabIndex={visivel ? 0 : -1}>
        Encontrar consultora
      </Link>
    </div>
  );
}
```

- [ ] **Step 2: `app/p/[slug]/page.tsx`**

Imports: `import Tilt from "@/components/ui/Tilt";` e `import PdpBar from "@/components/PdpBar";`. Trocar `<div className="pdp-gallery">` … `</div>` por `<Tilt className="pdp-gallery" max={4}>` … `</Tilt>`. Remover o bloco:

```tsx
              <div className="pdp-rating" aria-label="Avaliação">
                <span className="stars">★★★★★</span>
                <span className="pdp-rating-count">Avaliado por clientes Pierre</span>
              </div>
```

e, logo depois do `<h1>{product.name}</h1>`, inserir:

```tsx
              {product.preco != null && (
                <p className="pdp-price">{product.preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p>
              )}
```

Antes do `</section>` da `.pdp` (depois de `.pdp-desc`), adicionar `<PdpBar nome={product.name} preco={product.preco} />`.

- [ ] **Step 3: CSS (substituir o bloco `/* --- Página de produto ---` até `@media (max-width:820px){.pdp-grid{...}}`)**

```css
/* --- Página de produto ----------------------------------------------------- */
.pdp-grid{display:grid;grid-template-columns:1fr 1fr;gap:var(--space-8);align-items:start;margin-top:8px}
.pdp-gallery{position:relative;border-radius:var(--radius-lg);overflow:hidden;background:var(--marfim);border:0;aspect-ratio:4/5}
.pdp-gallery img{width:100%;height:100%;object-fit:cover;mix-blend-mode:multiply}
.pdp-info h1{margin-bottom:var(--space-3)}
.pdp-price{font-family:var(--font-serif);font-size:2.2rem;font-weight:600;line-height:1;color:var(--vinho-noir);margin:0 0 18px}
.pdp-lead{font-size:var(--fs-lead);color:var(--ink);margin-bottom:24px}
.pdp-attrs{display:flex;flex-direction:column;gap:0;margin:0 0 28px;padding:0;background:transparent;border-top:1px solid var(--line-ouro)}
.pdp-attrs > div{display:flex;justify-content:space-between;gap:16px;font-size:.92rem;padding:12px 0;border-bottom:1px solid var(--line)}
.pdp-attrs dt{color:var(--muted);margin:0}
.pdp-attrs dd{margin:0;font-weight:500}
.cap{text-transform:capitalize}
.pdp-actions{display:flex;flex-wrap:wrap;gap:12px;margin-bottom:14px}
.pdp-note{font-size:.85rem;color:var(--muted);margin:0}
.pdp-desc{margin-top:56px;max-width:60ch;border-top:1px solid var(--line-ouro);padding-top:36px}
.pdp-desc p{font-size:1.05rem;margin-bottom:14px}
.section-soft-wrap{background:var(--marfim)}
/* Barra fixa no celular (PdpBar) */
.pdp-bar{position:fixed;left:0;right:0;bottom:0;z-index:55;display:none;align-items:center;justify-content:space-between;gap:12px;padding:10px var(--gutter);background:color-mix(in srgb,var(--papel) 94%,transparent);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border-top:1px solid var(--line-ouro);transform:translateY(100%);transition:transform var(--t-base) var(--ease)}
.pdp-bar-info{min-width:0}
.pdp-bar-info strong{display:block;font-family:var(--font-serif);font-weight:600;font-size:1rem;line-height:1.1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.pdp-bar-info span{font-weight:500;font-size:.9rem}
@media (max-width:820px){
  .pdp-grid{grid-template-columns:1fr;gap:var(--space-6)}
  .pdp-bar{display:flex}
  .pdp-bar.is-on{transform:none}
  .has-pdp-bar .wa-float{bottom:84px}
}
@media (prefers-reduced-motion:reduce){.pdp-bar{transition:none}}
```

- [ ] **Step 4: Verificar e commit**

`/preview-site/p/aguas-virtuosas-camomila-215-ml-pierre-alexander` em 1440: galeria marfim com o frasco sem caixa branca, inclinando com o mouse; preço em Bodoni abaixo do título; sem estrelas; ficha com fios. Em 390: rolar até o texto "Sobre o produto" faz a barra fixa aparecer com preço e botão; o WhatsApp sobe. Commit:

```bash
git add components/PdpBar.tsx "app/p/[slug]/page.tsx" app/globals.css && git commit -m "Refaz a página de produto: preço, ficha em fios, galeria com inclinação e barra fixa

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 4: Verificação final, documentação e integração

- [ ] **Step 1:** Screenshots (1440 e 390) de `/c/perfumaria`, `/c/cuidado-facial`, `/p/aguas-virtuosas-camomila-215-ml-pierre-alexander` e da home (anel + grade com o card novo); `scrollWidth === clientWidth` em todas; `emulateMedia({reducedMotion:'reduce'})` sem inclinação nem parallax.
- [ ] **Step 2:** `docs/REDESIGN.md`: marcar a etapa 3 como feita na seção "Design system Maison" e acrescentar uma linha na tabela "Onde as coisas estão": `| Inclinação com reflexo (cards, galeria) e barra fixa do produto | \`components/ui/Tilt.tsx\`, \`components/PdpBar.tsx\` |`.
- [ ] **Step 3:** Parar o dev server, `sync` + `tsc` + `build`, commit "Documenta a etapa 3 do design system Maison", subir o dev server, mostrar ao usuário, merge na `main` e push só depois do "pode publicar".

---

## Self-review

- **Cobertura da spec §5:** card v2 (Task 1: marfim, multiply, Tilt, etiquetas lilás/blush, placeholder ouro, ação em vinho); categoria (Task 2: foto 21:9 com parallax, filtros com fios, chips já em fio desde a etapa 1, contagem itálica, grade 3D); produto (Task 3: galeria marfim + Tilt, preço, ficha com fios, estrelas removidas, barra fixa). "Você também pode gostar" continua em grade (ProductRail padrão).
- **Placeholders:** nenhum.
- **Nomes:** `Tilt` (Task 1) usado nas Tasks 1 e 3 com a mesma assinatura; `PdpBar` props `nome`/`preco` casam com o uso em `page.tsx`; `has-pdp-bar` definido no componente e no CSS; `.rail-3d` já existe em `globals.css`.
