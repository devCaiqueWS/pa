# Maison — Etapa 2: home — plano de implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refazer a home no registro Maison: hero cinematográfico com direção de arte por slide (campos `foco` e `tom` no painel), universos em scroll lateral preso, vitrine "Mais vendidos" em anel 3D (campo `apresentacao`), faixa Original nova (bloco `original`), e as demais seções (história, destaque, mosaico, manifesto, encerramento) restilizadas com Bodoni, ouro e vinho-noir.

**Architecture:** A home continua montada pelos blocos do CMS (`components/cms/BlockRenderer.tsx`) e espelhada pela `HomeClassica` em `app/page.tsx`. Cada seção é um componente em `components/home/` com CSS em `components/home/home.css`. Movimento por scroll usa os primitivos existentes em `components/ui/` (`ScrollProgress` escreve `--p`; `SplitWords`; `CountUp`; `Reveal`). Campos novos entram no catálogo `lib/cms.ts` (o editor do painel lê dali) e em `lib/banners.ts` + `app/painel/banners/BannersEditor.tsx`.

**Tech Stack:** Next.js 16 App Router, React 19, CSS puro (custom properties, 3D transforms, `clip-path`, `position: sticky`), MySQL via `lib/db` (só para o SQL opcional).

**Spec:** `docs/superpowers/specs/2026-09-14-design-system-maison-design.md` (§4 Home, §7 Movimento, §8 Ativos).

## Global Constraints

- Espelho local `C:\Users\dev_c\pa-run`: editar no `G:`, `sh /c/Users/dev_c/sync-pa.sh`, depois `sed -i 's/const pagina = await getPaginaPublicada("home");/const pagina = process.env.FORCAR_HOME_CLASSICA ? null : await getPaginaPublicada("home");/' app/page.tsx` no espelho quando o dev server estiver com `FORCAR_HOME_CLASSICA=1` (a home do banco ainda não tem os blocos novos).
- Verificação: `npx tsc --noEmit` e `npm run build` no espelho (nunca junto com `next dev`). Screenshots em 1440 e 390 com o navegador do Playwright MCP; depois de `scrollTo` instantâneo, tirar um screenshot descartável antes de medir/capturar (o relógio de transições só avança com frame).
- Vermelho `var(--pierre)` só em `.btn-primary`. Fundo escuro = `--vinho-noir`. Ouro só como fio, numeral, brilho ou marquee.
- Movimento só com `transform`, `opacity`, `clip-path`, `background-position`; tudo desligado em `prefers-reduced-motion` (fila e anel viram grade/trilho; véus estáticos). Nenhuma seção pode causar `scrollWidth > clientWidth` (seções com deslocamento lateral usam `overflow-x: clip`).
- Sem dependências novas. Sem scroll hijacking (nada de `wheel` interceptado).
- Commits em português, no imperativo, com `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>`. Branch `maison-etapa-2` no mesmo checkout.

---

## Mapa de arquivos

| Arquivo | Responsabilidade |
| --- | --- |
| `lib/banners.ts` | tipo `Banner` ganha `foco` e `tom`; `bannerVazio`, `normalizar`, `BANNERS_PADRAO` |
| `app/painel/banners/BannersEditor.tsx` | dois selects novos (foco, tom) |
| `components/home/HeroEditorial.tsx` | hero cinematográfico v2 (bleed, direção de arte, cortina, progresso do slide) |
| `components/home/HeroVideo.tsx` (novo) | `<video>` que só anexa a fonte no desktop, depois do primeiro paint |
| `components/home/UniverseStrip.tsx` (novo) | universos em scroll lateral preso (substitui `UniverseIndex.tsx`, que é apagado) |
| `components/home/ProductRing.tsx` (novo) | anel 3D: envolve os cards, marca o card da frente |
| `components/ProductRail.tsx` | prop `apresentacao: "grade" \| "anel"` |
| `components/home/OriginalBand.tsx` (novo) | faixa Original em bleed com perspectiva |
| `components/home/Manifesto.tsx`, `Heritage.tsx`, `EditorialFeature.tsx`, `UniverseMosaic.tsx`, `Closing.tsx` | ajustes de classes/imagens (ouro, marfim, botão) |
| `components/home/home.css` | todo o CSS das seções da home |
| `lib/cms.ts` | tipo `original`, campo `apresentacao` na vitrine, rótulo do manifesto |
| `components/cms/BlockRenderer.tsx` | `atalhos → UniverseStrip`, `vitrine` com `apresentacao`, `original → OriginalBand` |
| `app/page.tsx` | `HomeClassica` com as mesmas seções |
| `db/site_home_original.sql` (novo) | insere o bloco Original na home (opcional, roda uma vez) |
| `docs/REDESIGN.md` | tabela de blocos e estado da etapa |

Linhas citadas abaixo são do commit `d8e2283` + o commit de pesos; confira com `grep -n` antes de editar.

---

### Task 1: Campos `foco` e `tom` no banner (lib + painel)

**Files:**
- Modify: `lib/banners.ts` (tipo `Banner`, `bannerVazio`, `BANNERS_PADRAO`, `normalizar`)
- Modify: `app/painel/banners/BannersEditor.tsx` (`bannerVazio` local e o fieldset "Textos sobre a imagem")

**Interfaces:**
- Produces: `Banner.foco: "esquerda" | "centro" | "direita"` e `Banner.tom: "claro" | "escuro"`, sempre presentes após `normalizar` (padrões `"centro"` e `"escuro"`). A Task 2 lê os dois.

- [ ] **Step 1: Tipo e padrões em `lib/banners.ts`**

No `type Banner`, depois de `mostrarLogo: boolean;`, adicionar:

```ts
  // Direção de arte do slide: onde está o assunto da foto (o texto fica do
  // lado oposto) e se o texto é claro (sobre véu escuro) ou escuro (sobre véu
  // marfim). Padrões: centro + escuro.
  foco: "esquerda" | "centro" | "direita";
  tom: "claro" | "escuro";
```

Em `bannerVazio()`, depois de `mostrarLogo: false,`: `foco: "centro", tom: "escuro",`.

Em `BANNERS_PADRAO`: no slide das gerações, depois de `alt: ...,` adicionar `foco: "direita", tom: "claro",`; no slide Radicaline, `foco: "centro", tom: "escuro",`.

Em `normalizar()`, depois de `mostrarLogo: ...,`:

```ts
    foco: o.foco === "esquerda" || o.foco === "direita" ? o.foco : "centro",
    tom: o.tom === "claro" ? "claro" : "escuro",
```

- [ ] **Step 2: Editor do painel**

Em `app/painel/banners/BannersEditor.tsx`, no `bannerVazio()` local, adicionar `foco: "centro", tom: "escuro",` depois de `mostrarLogo: false,`. No fieldset "Textos sobre a imagem", logo depois do `<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", ... }}>` que contém Estilo e a logo (antes de `{!ehLancamento && (` do selo), inserir:

```tsx
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".75rem", marginBottom: ".6rem" }}>
                  <div>
                    <label style={labelStyle}>Onde está o assunto da foto</label>
                    <select style={inputStyle} value={b.foco} onChange={(e) => patch(b.id, "foco", e.target.value as Banner["foco"])}>
                      <option value="esquerda">À esquerda (texto fica à direita)</option>
                      <option value="centro">No centro (texto embaixo, à esquerda)</option>
                      <option value="direita">À direita (texto fica à esquerda)</option>
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Cor do texto</label>
                    <select style={inputStyle} value={b.tom} onChange={(e) => patch(b.id, "tom", e.target.value as Banner["tom"])}>
                      <option value="escuro">Texto claro sobre véu escuro (fotos escuras ou coloridas)</option>
                      <option value="claro">Texto escuro sobre véu marfim (fotos claras)</option>
                    </select>
                    <p style={ajudaStyle}>O véu é um degradê suave só do lado do texto; a foto continua inteira.</p>
                  </div>
                </div>
```

- [ ] **Step 3: Verificar tipos e commit**

```bash
sh /c/Users/dev_c/sync-pa.sh && cd /c/Users/dev_c/pa-run && npx tsc --noEmit && echo TSC_OK
cd "G:/Drives compartilhados/TI/developer/sites/pa" && git add lib/banners.ts app/painel/banners/BannersEditor.tsx && git commit -m "Adiciona foco e tom do texto aos banners do hero

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 2: Hero cinematográfico v2

**Files:**
- Create: `components/home/HeroVideo.tsx`
- Modify: `components/home/HeroEditorial.tsx` (reescrever o JSX das duas variantes e o `Midia`)
- Modify: `components/home/home.css` — bloco `/* --- Hero editorial ---` até o fim de seus `@media` (antes de `/* --- Índice de universos`)

**Interfaces:**
- Consumes: `Banner.foco`, `Banner.tom` (Task 1); `IMAGENS.heroCampanha`, `srcSetWebp` (`lib/imagens.ts`); `asset`, `imagemSrc` (`lib/site.ts`).
- Produces: seção `.hero[data-foco][data-tom]` com cortina (`--p` = scroll ÷ altura) e `.hero-progress` (linha de progresso do slide). A cortina depende de `.hero ~ *{position:relative;z-index:1;background-color:var(--bg)}`, que já existe em `home.css`.

- [ ] **Step 1: `HeroVideo.tsx`**

```tsx
"use client";

import { useEffect, useRef } from "react";

type Props = { src: string; poster?: string; label: string };

// Vídeo do hero: nasce só com o poster (preload="none", sem <source>). No
// desktop, depois do primeiro paint, anexa a fonte e dá play. Celular e
// prefers-reduced-motion ficam com o poster (o mp4 da marca tem 15 MB).
export default function HeroVideo({ src, poster, label }: Props) {
  const ref = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const desktop = window.matchMedia("(min-width: 900px)").matches;
    const reduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!desktop || reduzido) return;
    const t = window.setTimeout(() => {
      const source = document.createElement("source");
      source.src = src;
      source.type = "video/mp4";
      v.appendChild(source);
      v.load();
      v.play().catch(() => {});
    }, 400);
    return () => window.clearTimeout(t);
  }, [src]);

  return <video ref={ref} muted loop playsInline preload="none" poster={poster} aria-label={label} />;
}
```

- [ ] **Step 2: `HeroEditorial.tsx` — JSX novo**

Manter imports, estado, `ir/parar/iniciar`, o `useEffect` da cortina (que já escreve `--p` no `secao`) e o `Seta`. Trocar `import { asset, imagemSrc } from "@/lib/site";` por `import { asset, imagemSrc } from "@/lib/site";\nimport HeroVideo from "@/components/home/HeroVideo";`. Substituir tudo a partir de `if (total === 0) return null;` até o fim do componente principal por:

```tsx
  if (total === 0) return null;
  const s = slides[atual];
  const lancamento = s.estilo === "lancamento";

  const nav =
    total > 1 ? (
      <div className="hero-nav" role="group" aria-label="Trocar destaque">
        <button type="button" aria-label="Destaque anterior" onClick={() => { ir(atual - 1); iniciar(); }}>
          <Seta dir="esq" />
        </button>
        <button type="button" aria-label="Próximo destaque" onClick={() => { ir(atual + 1); iniciar(); }}>
          <Seta dir="dir" />
        </button>
        <span className="hero-nav-count" aria-live="polite">
          {atual + 1} / {total}
        </span>
        {/* Linha de progresso do slide: recomeça a cada troca (key). */}
        <span className="hero-progress" key={`p-${atual}`} aria-hidden="true" style={{ animationDuration: `${INTERVALO}ms` }} />
      </div>
    ) : null;

  const acoes = (s.botao1Texto || s.botao2Texto) && (
    <div className="hero-cta">
      {s.botao1Texto && (
        <Link className="btn btn-primary" href={s.botao1Link || "/onde-comprar"}>
          {s.botao1Texto}
        </Link>
      )}
      {s.botao2Texto && (
        <Link className={s.tom === "claro" ? "link-line" : "btn btn-ghost-light"} href={s.botao2Link || "/onde-comprar"}>
          {s.botao2Texto}
        </Link>
      )}
    </div>
  );

  return (
    <section
      ref={secao}
      className={`hero${lancamento ? " hero-cine" : ""}`}
      data-foco={s.foco}
      data-tom={s.tom}
      aria-roledescription="carrossel"
      aria-label="Destaques Pierre Alexander"
      onMouseEnter={parar}
      onMouseLeave={iniciar}
      onFocus={parar}
      onBlur={iniciar}
    >
      <div className="hero-media" key={`m-${atual}`}>
        <Midia s={s} prioridade={atual === 0} />
      </div>
      <div className="hero-veil" aria-hidden="true" />
      <div className="container hero-inner">
        <div className="hero-copy" key={`c-${atual}`}>
          {s.mostrarLogo && (
            <img className="hero-logo" src={asset("/assets/img/logo-pierre-white.png")} alt="Pierre" width={256} height={160} />
          )}
          {lancamento ? s.subtitulo && <span className="hero-kicker">{s.subtitulo}</span> : s.eyebrow && <span className="hero-kicker">{s.eyebrow}</span>}
          {s.titulo && (atual === 0 ? <h1 className="hero-title">{s.titulo}</h1> : <h2 className="hero-title">{s.titulo}</h2>)}
          {!lancamento && s.subtitulo && <p className="hero-lead">{s.subtitulo}</p>}
          {acoes}
          {nav}
        </div>
      </div>
    </section>
  );
}
```

Substituir a função `Midia` por:

```tsx
// Mídia do slide em bleed total. Vídeo só carrega no desktop (HeroVideo); a
// foto da campanha usa as variantes WebP; imagens do painel vão como vieram.
// object-position vem do CSS por data-foco.
function Midia({ s, prioridade }: { s: Banner; prioridade: boolean }) {
  if (s.tipo === "video" && s.video) {
    return <HeroVideo src={imagemSrc(s.video)} poster={s.imagem ? imagemSrc(s.imagem) : undefined} label={s.alt || s.titulo} />;
  }
  if (!s.imagem) return null;
  const campanha = s.imagem === `/assets/img/${IMAGENS.heroCampanha.nome}.jpg`;
  if (campanha) {
    const img = IMAGENS.heroCampanha;
    return (
      <picture>
        <source type="image/webp" srcSet={srcSetWebp(img)} sizes="100vw" />
        <img
          src={imagemSrc(s.imagem)}
          alt={s.alt || s.titulo}
          width={img.largura}
          height={img.altura}
          loading={prioridade ? "eager" : "lazy"}
          fetchPriority={prioridade ? "high" : undefined}
          decoding={prioridade ? "sync" : "async"}
        />
      </picture>
    );
  }
  return <img src={imagemSrc(s.imagem)} alt={s.alt || s.titulo} loading={prioridade ? "eager" : "lazy"} fetchPriority={prioridade ? "high" : undefined} />;
}
```

- [ ] **Step 3: CSS do hero (substituir o bloco inteiro do hero em `home.css`)**

Apagar de `/* --- Hero editorial ---` até a linha anterior a `/* --- Índice de universos` e colocar:

```css
/* --- Hero cinematográfico --------------------------------------------------
   Mídia em bleed total, texto do lado oposto ao assunto da foto (data-foco),
   véu só do lado do texto (data-tom). Cortina: o hero fica preso no topo do
   <main> enquanto as seções seguintes deslizam por cima (--p = scroll ÷
   altura, escrito pelo HeroEditorial). */
.hero{position:sticky;top:0;z-index:0;margin-top:calc(-1 * var(--hdr-h));padding-top:var(--hdr-h);min-height:100svh;display:flex;align-items:stretch;background:var(--vinho-noir);color:var(--marfim);overflow:hidden;isolation:isolate}
.hero ~ *{position:relative;z-index:1;background-color:var(--bg)}
.hero-media{position:absolute;inset:0;z-index:0;transform:scale(calc(1 + var(--p,0) * .1));transform-origin:center;will-change:transform}
.hero-media img,.hero-media video{width:100%;height:100%;object-fit:cover;object-position:center}
.hero[data-foco="esquerda"] .hero-media img,.hero[data-foco="esquerda"] .hero-media video{object-position:20% center}
.hero[data-foco="direita"] .hero-media img,.hero[data-foco="direita"] .hero-media video{object-position:80% center}
.hero-veil{position:absolute;inset:0;z-index:1;pointer-events:none}
/* tom escuro: véu vinho-noir subindo do rodapé + do lado do texto */
.hero[data-tom="escuro"] .hero-veil{background:linear-gradient(0deg,rgba(43,24,30,.78) 0%,rgba(43,24,30,.35) 45%,rgba(43,24,30,0) 75%)}
.hero[data-tom="escuro"][data-foco="direita"] .hero-veil{background:linear-gradient(90deg,rgba(43,24,30,.72) 0%,rgba(43,24,30,.35) 40%,rgba(43,24,30,0) 65%),linear-gradient(0deg,rgba(43,24,30,.6) 0%,rgba(43,24,30,0) 50%)}
.hero[data-tom="escuro"][data-foco="esquerda"] .hero-veil{background:linear-gradient(270deg,rgba(43,24,30,.72) 0%,rgba(43,24,30,.35) 40%,rgba(43,24,30,0) 65%),linear-gradient(0deg,rgba(43,24,30,.6) 0%,rgba(43,24,30,0) 50%)}
/* tom claro: texto vinho-noir sobre véu marfim do lado do texto */
.hero[data-tom="claro"]{color:var(--vinho-noir)}
.hero[data-tom="claro"] .hero-veil{background:linear-gradient(0deg,rgba(252,250,245,.9) 0%,rgba(252,250,245,.55) 40%,rgba(252,250,245,0) 70%)}
.hero[data-tom="claro"][data-foco="direita"] .hero-veil{background:linear-gradient(90deg,rgba(252,250,245,.92) 0%,rgba(252,250,245,.7) 38%,rgba(252,250,245,0) 62%)}
.hero[data-tom="claro"][data-foco="esquerda"] .hero-veil{background:linear-gradient(270deg,rgba(252,250,245,.92) 0%,rgba(252,250,245,.7) 38%,rgba(252,250,245,0) 62%)}
.hero-inner{position:relative;z-index:2;display:grid;grid-template-columns:repeat(12,1fr);align-items:end;flex:1;padding:var(--space-7) 0 var(--space-8)}
.hero-copy{grid-column:1 / 7;opacity:calc(1 - var(--p,0) * 2);transform:translateY(calc(var(--p,0) * -12vh));will-change:transform,opacity}
.hero[data-foco="esquerda"] .hero-copy{grid-column:7 / 13}
.hero[data-foco="centro"] .hero-copy{grid-column:1 / 8}
.hero-cine .hero-inner{align-items:end}
.hero-logo{height:52px;width:auto;margin-bottom:var(--space-5);filter:drop-shadow(0 2px 10px rgba(0,0,0,.35))}
.hero[data-tom="claro"] .hero-logo{filter:invert(1) sepia(1) saturate(4) hue-rotate(320deg) brightness(.5)}
.hero-kicker{display:block;font-family:var(--font-serif);font-style:italic;font-weight:500;font-size:clamp(1.2rem,1rem + .8vw,1.6rem);color:var(--ouro-claro);margin-bottom:var(--space-4)}
.hero[data-tom="claro"] .hero-kicker{color:var(--vinho)}
.hero-title{font-family:var(--font-serif);font-size:clamp(3rem,1.6rem + 4.8vw,6rem);line-height:.94;font-weight:600;letter-spacing:-.01em;color:inherit;margin:0 0 var(--space-5);max-width:13ch;text-wrap:balance}
.hero-lead{font-size:var(--fs-lead);color:inherit;opacity:.9;max-width:40ch;margin:0 0 var(--space-6)}
.hero-cta{display:flex;flex-wrap:wrap;align-items:center;gap:var(--space-4) var(--space-5);margin:0}
.hero[data-tom="claro"] .link-line{color:var(--vinho-noir)}
.hero-nav{position:relative;display:flex;align-items:center;gap:10px;margin-top:var(--space-7);padding-top:var(--space-4)}
.hero-nav button{width:44px;height:44px;border-radius:2px;border:1px solid color-mix(in srgb,currentColor 45%,transparent);background:transparent;color:inherit;display:grid;place-items:center;cursor:pointer;transition:border-color var(--t-fast)}
.hero-nav button:hover{border-color:var(--ouro)}
.hero-nav-count{font-family:var(--font-serif);font-size:1.1rem;opacity:.8;margin-left:6px;font-variant-numeric:tabular-nums}
.hero-progress{position:absolute;left:0;top:0;height:1px;width:100%;background:color-mix(in srgb,currentColor 25%,transparent);overflow:hidden}
.hero-progress::after{content:"";position:absolute;inset:0;background:var(--ouro);transform-origin:left;transform:scaleX(0);animation:hero-progress linear forwards;animation-duration:inherit}
@keyframes hero-progress{to{transform:scaleX(1)}}
.hero::after{content:"";position:absolute;inset:0;z-index:3;background:var(--vinho-noir);opacity:calc(var(--p,0) * .5);pointer-events:none}
/* Entrada orquestrada do texto */
@keyframes hero-rise{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}
@keyframes hero-fade{from{opacity:0}to{opacity:1}}
.hero-media{animation:hero-fade 1.2s var(--ease) both}
.hero-copy > *{animation:hero-rise .8s var(--ease-out) both}
.hero-copy > :nth-child(2){animation-delay:.1s}
.hero-copy > :nth-child(3){animation-delay:.2s}
.hero-copy > :nth-child(4){animation-delay:.3s}
.hero-copy > :nth-child(5){animation-delay:.4s}
@media (max-width:900px){
  .hero{position:relative;z-index:auto;min-height:88svh}
  .hero-media,.hero-copy{transform:none;opacity:1}
  .hero::after{display:none}
  .hero-inner{display:block;padding:var(--space-8) 0 var(--space-7)}
  .hero-copy,.hero[data-foco="esquerda"] .hero-copy,.hero[data-foco="centro"] .hero-copy{grid-column:auto}
  .hero[data-tom="escuro"] .hero-veil,.hero[data-tom="escuro"][data-foco="direita"] .hero-veil,.hero[data-tom="escuro"][data-foco="esquerda"] .hero-veil{background:linear-gradient(0deg,rgba(43,24,30,.85) 0%,rgba(43,24,30,.5) 45%,rgba(43,24,30,.05) 80%)}
  .hero[data-tom="claro"] .hero-veil,.hero[data-tom="claro"][data-foco="direita"] .hero-veil,.hero[data-tom="claro"][data-foco="esquerda"] .hero-veil{background:linear-gradient(0deg,rgba(252,250,245,.95) 0%,rgba(252,250,245,.75) 45%,rgba(252,250,245,.1) 80%)}
  .hero[data-foco="direita"] .hero-media img,.hero[data-foco="esquerda"] .hero-media img{object-position:center 30%}
  .hero-title{max-width:none}
}
@media (max-width:560px){
  .hero-cta .btn{width:100%}
  .hero-nav{margin-top:var(--space-6)}
}
@media (prefers-reduced-motion:reduce){
  .hero{position:relative;z-index:auto}
  .hero-media,.hero-copy{transform:none;opacity:1;animation:none}
  .hero-copy > *{animation:none}
  .hero::after{display:none}
  .hero-progress::after{animation:none;transform:scaleX(1)}
}
```

Apagar também, no bloco "Sem movimento" no fim de `home.css`, as linhas que citam `.hero-cine-media`/`.hero-cine-copy` (agora não existem): trocar `.hero-media,.hero-copy,.hero-cine-media,.hero-cine-copy{transform:none;opacity:1}` por `.hero-media,.hero-copy{transform:none;opacity:1}`.

- [ ] **Step 4: Verificar**

Subir o dev server (`FORCAR_HOME_CLASSICA=1`, patch do sed), abrir `/preview-site` em 1440: slide 1 (gerações) com foto em bleed, assunto à direita, texto vinho-noir à esquerda sobre véu marfim, botão vermelho + link com traço ouro, linha de progresso dourada crescendo; setas trocam de slide; slide 2 (Radicaline) com poster e texto marfim; rolar: hero fica preso e a próxima seção desliza por cima. Em 390: hero relativo, véu de baixo para cima. Conferir no console que o `<video>` só ganha `<source>` em 1440 (evaluate `document.querySelector('video source')`).

- [ ] **Step 5: Commit**

```bash
git add components/home/HeroEditorial.tsx components/home/HeroVideo.tsx components/home/home.css && git commit -m "Refaz o hero da home em bleed com direção de arte por slide

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 3: Universos em scroll lateral (`UniverseStrip`)

**Files:**
- Create: `components/home/UniverseStrip.tsx`
- Delete: `components/home/UniverseIndex.tsx`
- Modify: `components/cms/BlockRenderer.tsx` (import e `case "atalhos"`), `app/page.tsx` (import e uso)
- Modify: `components/home/home.css` (substituir o bloco `/* --- Índice de universos (atalhos) ---` inteiro)

**Interfaces:**
- Consumes: `getCategorias()` de `lib/categorias` (`{slug, name, tagline, image}`), `ScrollProgress`/`VIAGEM` de `components/ui/ScrollProgress`, `srcSetDeCaminho`, `imagemSrc`.
- Produces: `<UniverseStrip />` (server component async, sem props).

- [ ] **Step 1: Componente**

```tsx
import Link from "next/link";
import type { CSSProperties } from "react";
import { imagemSrc } from "@/lib/site";
import { srcSetDeCaminho } from "@/lib/imagens";
import { getCategorias } from "@/lib/categorias";
import ScrollProgress from "@/components/ui/ScrollProgress";

// Universos em scroll lateral: a seção fica presa na tela e, conforme o scroll
// vertical avança (--p), a fila de categorias desliza para o lado. O CSS faz o
// deslocamento com translateX(calc(--p * (100vw - 100% - gutters))) — a
// porcentagem é relativa à própria fila, então não precisa medir nada. No
// celular e com reduced-motion vira um trilho nativo com snap.
export default async function UniverseStrip() {
  const categorias = await getCategorias();
  if (categorias.length === 0) return null;
  return (
    <ScrollProgress as="section" className="ustrip" id="universos">
      <div className="ustrip-sticky">
        <header className="ustrip-head container">
          <p className="ustrip-intro">Explore por universo</p>
          <span className="ustrip-bar" aria-hidden="true" />
        </header>
        <ul className="ustrip-track" aria-label="Universos Pierre">
          {categorias.map((c, i) => (
            <li key={c.slug} className="ustrip-item" style={{ "--i": i } as CSSProperties}>
              <Link className="ustrip-card" href={`/c/${c.slug}`}>
                {c.image && (
                  <img src={imagemSrc(c.image)} srcSet={srcSetDeCaminho(c.image)} sizes="(min-width: 900px) 30vw, 72vw" alt="" loading="lazy" decoding="async" />
                )}
                <span className="ustrip-cap">
                  <strong>{c.name}</strong>
                  {c.tagline && <small>{c.tagline}</small>}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </ScrollProgress>
  );
}
```

- [ ] **Step 2: Trocar `UniverseIndex` por `UniverseStrip`**

`BlockRenderer.tsx`: `import UniverseIndex from "@/components/home/UniverseIndex";` → `import UniverseStrip from "@/components/home/UniverseStrip";` e `case "atalhos": return <UniverseIndex />;` → `return <UniverseStrip />;`. `app/page.tsx`: mesmo import e `<UniverseIndex />` → `<UniverseStrip />`. Apagar `components/home/UniverseIndex.tsx` (`git rm`). Em `lib/cms.ts`, na entrada `atalhos`, trocar `descricao` por `"Fila de universos (categorias) que desliza para o lado enquanto você rola a página. Sem campos — os dados vêm de Categorias."` e `label` por `"Universos em scroll lateral (home)"`.

- [ ] **Step 3: CSS (substituir o bloco `/* --- Índice de universos (atalhos) ---` até antes de `/* --- Mosaico`)**

```css
/* --- Universos em scroll lateral ------------------------------------------- */
.ustrip{height:260svh;position:relative;background:var(--papel);overflow-x:clip}
.ustrip-sticky{position:sticky;top:0;height:100svh;display:flex;flex-direction:column;justify-content:center;gap:var(--space-6);overflow:hidden;padding-top:var(--hdr-h)}
.ustrip-head{display:flex;align-items:center;gap:var(--space-5)}
.ustrip-intro{font-family:var(--font-serif);font-style:italic;font-weight:500;font-size:clamp(1.4rem,1.1rem + 1.2vw,2.2rem);color:var(--vinho);margin:0;white-space:nowrap}
.ustrip-bar{flex:1;height:1px;background:var(--line);position:relative}
.ustrip-bar::after{content:"";position:absolute;inset:0;background:var(--ouro);transform-origin:left;transform:scaleX(var(--p,0))}
.ustrip-track{display:flex;gap:var(--space-5);list-style:none;margin:0;padding:0 var(--gutter);width:max-content;transform:translateX(calc(var(--p,0) * (100vw - 100%)));will-change:transform}
.ustrip-item{flex:none;width:clamp(260px,28vw,420px)}
.ustrip-card{position:relative;display:block;aspect-ratio:4/5;border-radius:var(--radius);overflow:hidden;background:var(--marfim);isolation:isolate}
.ustrip-card img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:transform 1.2s var(--ease-out)}
.ustrip-card::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(43,24,30,0) 45%,rgba(43,24,30,.72) 100%)}
@media (hover:hover){.ustrip-card:hover img{transform:scale(1.04)}}
.ustrip-cap{position:absolute;left:clamp(16px,2vw,26px);right:clamp(16px,2vw,26px);bottom:clamp(16px,2vw,24px);z-index:1;color:var(--marfim)}
.ustrip-cap strong{display:block;font-family:var(--font-serif);font-weight:600;font-size:clamp(1.6rem,1.2rem + 1.4vw,2.6rem);line-height:1;margin-bottom:4px}
.ustrip-cap small{display:block;font-size:.9rem;opacity:.85;max-width:30ch}
@media (max-width:900px),(prefers-reduced-motion:reduce){
  .ustrip{height:auto;padding:var(--section) 0}
  .ustrip-sticky{position:static;height:auto;padding-top:0;overflow:visible}
  .ustrip-track{width:auto;transform:none;overflow-x:auto;scroll-snap-type:x mandatory;padding-bottom:12px;scrollbar-width:none}
  .ustrip-track::-webkit-scrollbar{display:none}
  .ustrip-item{width:min(72vw,320px);scroll-snap-align:start}
  .ustrip-bar::after{transform:none}
}
```

- [ ] **Step 4: Verificar e commit**

Em 1440: ao rolar, a seção prende e a fila desliza da esquerda para a direita até o último card encostar no gutter direito; a linha dourada avança junto. `scrollWidth === clientWidth`. Em 390: trilho com snap. Commit:

```bash
git add components/home/UniverseStrip.tsx components/cms/BlockRenderer.tsx app/page.tsx lib/cms.ts components/home/home.css && git rm -q components/home/UniverseIndex.tsx && git commit -m "Substitui a linha de atalhos por universos em scroll lateral

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 4: Vitrine em anel 3D (`ProductRing` + `apresentacao`)

**Files:**
- Create: `components/home/ProductRing.tsx`
- Modify: `components/ProductRail.tsx` (prop `apresentacao`), `lib/cms.ts` (campo na vitrine), `components/cms/BlockRenderer.tsx` (`Vitrine` passa `apresentacao`), `app/page.tsx` ("Mais vendidos" com `apresentacao="anel"`)
- Modify: `app/globals.css` (bloco `.rail-3d`, adicionar CSS do anel logo após)

**Interfaces:**
- Consumes: `ProductCard` (com `index`), `useScrollProgress`/`VIAGEM`.
- Produces: `<ProductRail apresentacao="anel" .../>`; bloco `vitrine` com `config.apresentacao` (`"grade"` padrão | `"anel"`).

- [ ] **Step 1: `ProductRing.tsx`**

```tsx
"use client";

import { Children, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { useScrollProgress, VIAGEM } from "@/components/ui/ScrollProgress";

// Anel 3D: os cards ficam num cilindro (rotateY(i·360/n) translateZ(R)) e o
// palco gira com o scroll (--p). O card mais de frente recebe data-frente para
// crescer e ganhar o reflexo. Celular e reduced-motion: trilho com snap (CSS).
export default function ProductRing({ children }: { children: ReactNode }) {
  const itens = Children.toArray(children);
  const n = itens.length;
  const ref = useRef<HTMLElement | null>(null);
  const [frente, setFrente] = useState(0);
  useScrollProgress(ref, VIAGEM);

  // Lê --p do próprio elemento a cada scroll e escolhe o card da frente.
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const medir = () => {
      raf = 0;
      const p = parseFloat(el.style.getPropertyValue("--p") || "0");
      setFrente(Math.min(n - 1, Math.max(0, Math.round(p * (n - 1)))));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(medir);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    medir();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [n]);

  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} className="ring" style={{ "--n": n } as CSSProperties}>
      <div className="ring-sticky">
        <div className="ring-stage">
          {itens.map((child, i) => (
            <div key={i} className="ring-card" data-frente={i === frente ? "true" : undefined} style={{ "--i": i } as CSSProperties}>
              {child}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

Nota: `useScrollProgress` aceita `RefObject<HTMLElement | null>`; o cast no `ref` do `div` é só de tipagem.

- [ ] **Step 2: `ProductRail.tsx` com `apresentacao`**

```tsx
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import ProductRing from "@/components/home/ProductRing";
import Reveal from "@/components/ui/Reveal";
import SplitWords from "@/components/ui/SplitWords";
import type { Product } from "@/lib/catalog";

type Props = {
  title: string;
  subtitle?: string;
  products: Product[];
  seeAllHref?: string;
  /** "grade" (padrão): grade com entrada 3D. "anel": cilindro 3D girado pelo scroll (home). */
  apresentacao?: "grade" | "anel";
};

// Vitrine de produtos: grade editorial (entrada 3D) ou anel 3D preso na tela.
export default function ProductRail({ title, subtitle, products, seeAllHref, apresentacao = "grade" }: Props) {
  if (products.length === 0) return null;
  const head = (
    <Reveal className="rail-head">
      <div>
        <h2 className="rail-title">
          <SplitWords texto={title} />
        </h2>
        {subtitle && <p className="rail-sub">{subtitle}</p>}
      </div>
      {seeAllHref && (
        <Link className="link-line rail-seeall" href={seeAllHref}>
          Ver tudo
        </Link>
      )}
    </Reveal>
  );

  if (apresentacao === "anel" && products.length >= 4) {
    return (
      <section className="section ring-section">
        <div className="container">{head}</div>
        <ProductRing>
          {products.slice(0, 8).map((p, i) => (
            <ProductCard key={p.slug} product={p} index={i} />
          ))}
        </ProductRing>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="container">
        {head}
        {/* Entrada 3D: os cards giram em perspectiva, um após o outro (CSS .rail-3d). */}
        <Reveal className="rail-track rail-3d" plain>
          {products.map((p, i) => (
            <ProductCard key={p.slug} product={p} index={i} />
          ))}
        </Reveal>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: CMS e home clássica**

`lib/cms.ts`, entrada `vitrine`, depois do campo `fonte`:

```ts
      {
        name: "apresentacao",
        label: "Apresentação",
        tipo: "select",
        opcoes: [
          { valor: "grade", label: "Grade (padrão)" },
          { valor: "anel", label: "Anel 3D girado pelo scroll (só no desktop; no celular vira trilho)" },
        ],
      },
```

`BlockRenderer.tsx`, em `Vitrine`: `<ProductRail ... apresentacao={c.apresentacao === "anel" ? "anel" : "grade"} />`. `app/page.tsx`: no `ProductRail` de "Mais vendidos", adicionar `apresentacao="anel"`.

- [ ] **Step 4: CSS do anel (em `globals.css`, logo após `.rail-3d.is-in .pcard{...}`)**

```css
/* Vitrine em anel 3D: cilindro de cards girado pelo scroll (--p). */
.ring-section{padding-bottom:0}
.ring{height:240svh;position:relative;overflow-x:clip;--r:clamp(420px,34vw,640px);--w:clamp(220px,22vw,320px)}
.ring-sticky{position:sticky;top:0;height:100svh;display:grid;place-items:center;overflow:hidden;perspective:1600px}
.ring-stage{position:relative;width:var(--w);aspect-ratio:4/6;transform-style:preserve-3d;transform:rotateY(calc(-1 * var(--p,0) * (360deg / var(--n,8)) * (var(--n,8) - 1)));will-change:transform}
.ring-card{position:absolute;inset:0;transform:rotateY(calc(var(--i,0) * (360deg / var(--n,8)))) translateZ(var(--r));backface-visibility:hidden;transition:opacity .4s var(--ease),scale .5s var(--ease-out);opacity:.55;scale:.92}
.ring-card[data-frente="true"]{opacity:1;scale:1.06;z-index:1}
.ring-card[data-frente="true"] .pcard-media{box-shadow:var(--shadow-3d)}
.ring-card[data-frente="true"] .pcard-media::after{content:"";position:absolute;inset:0;background:var(--ouro-foil);opacity:.1;mix-blend-mode:screen;pointer-events:none}
@media (max-width:900px),(prefers-reduced-motion:reduce){
  .ring{height:auto;--r:0px}
  .ring-sticky{position:static;height:auto;display:block;perspective:none;overflow:visible}
  .ring-stage{width:auto;aspect-ratio:auto;transform:none;display:flex;gap:14px;overflow-x:auto;scroll-snap-type:x mandatory;padding:4px var(--gutter) 18px;scrollbar-width:none}
  .ring-stage::-webkit-scrollbar{display:none}
  .ring-card{position:static;transform:none;flex:0 0 min(72vw,300px);scroll-snap-align:start;opacity:1;scale:1}
  .ring-card[data-frente="true"] .pcard-media{box-shadow:none}
}
```

- [ ] **Step 5: Verificar e commit**

1440: "Mais vendidos" prende na tela; rolar gira o anel; o card da frente cresce e ganha brilho; cards de trás somem (backface). 390: trilho com snap. `tsc` OK. Commit:

```bash
git add components/home/ProductRing.tsx components/ProductRail.tsx lib/cms.ts components/cms/BlockRenderer.tsx app/page.tsx app/globals.css && git commit -m "Adiciona a vitrine em anel 3D girado pelo scroll

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 5: Faixa Original (`OriginalBand`, bloco `original`)

**Files:**
- Create: `components/home/OriginalBand.tsx`, `db/site_home_original.sql`
- Modify: `lib/cms.ts` (tipo + catálogo), `components/cms/BlockRenderer.tsx` (`case "original"`), `app/page.tsx` (após `EditorialFeature`), `components/home/home.css` (bloco novo antes de `/* --- Mosaico`)

**Interfaces:**
- Consumes: `IMAGENS.original`, `Picture`, `ScrollProgress`, `SplitWords`.
- Produces: `<OriginalBand titulo? texto? botaoTexto? botaoLink? imagem? />`; bloco CMS `original` com `titulo, texto, botao_texto, botao_link, imagem_url`.

- [ ] **Step 1: Componente**

```tsx
import Link from "next/link";
import Picture from "@/components/ui/Picture";
import ScrollProgress from "@/components/ui/ScrollProgress";
import SplitWords from "@/components/ui/SplitWords";
import Reveal from "@/components/ui/Reveal";
import { IMAGENS } from "@/lib/imagens";
import { imagemSrc } from "@/lib/site";

type Props = { titulo?: string; texto?: string; botaoTexto?: string; botaoLink?: string; imagem?: string };

// Faixa Original: a arte "Original de Vivre" em bleed total, inclinada em
// perspectiva conforme a seção atravessa a tela (--p), com a chamada sobre um
// véu vinho-noir à esquerda. Imagem do painel substitui a arte local.
export default function OriginalBand({ titulo, texto, botaoTexto, botaoLink, imagem }: Props) {
  return (
    <ScrollProgress as="section" className="orig" id="original">
      <div className="orig-stage" aria-hidden="true">
        {imagem ? (
          <img className="orig-img" src={imagemSrc(imagem)} alt="" loading="lazy" decoding="async" />
        ) : (
          <Picture img={IMAGENS.original} alt="" sizes="100vw" className="orig-img" />
        )}
      </div>
      <div className="orig-veil" aria-hidden="true" />
      <div className="container orig-body">
        <Reveal className="orig-copy">
          <span className="orig-kicker">Desde o primeiro pote</span>
          <h2>
            <SplitWords texto={titulo || "O Original."} />
          </h2>
          <p>{texto || "O desodorante em creme que abriu caminho para tudo o que a Pierre faz hoje. Simples de entender, fácil de indicar, difícil de largar."}</p>
          <Link className="btn btn-light" href={botaoLink || "/original"}>
            {botaoTexto || "Conhecer o Original"}
          </Link>
        </Reveal>
      </div>
    </ScrollProgress>
  );
}
```

- [ ] **Step 2: CMS**

`lib/cms.ts`: em `BlocoTipo` adicionar `| "original"` depois de `"historia"`. No `CATALOGO`, depois da entrada `historia`:

```ts
  {
    tipo: "original",
    label: "Faixa Original",
    descricao: "A arte do desodorante Original em tela cheia, inclinada com o scroll, com uma chamada e um botão. Campos vazios usam os textos padrão.",
    campos: [
      { name: "titulo", label: "Título", tipo: "text", ajuda: "Vazio = 'O Original.'" },
      { name: "texto", label: "Texto", tipo: "textarea" },
      { name: "botao_texto", label: "Texto do botão", tipo: "text", ajuda: "Vazio = 'Conhecer o Original'" },
      { name: "botao_link", label: "Link do botão", tipo: "text", ajuda: "Vazio = /original" },
      { name: "imagem_url", label: "Imagem (URL, opcional)", tipo: "url", ajuda: "Vazio = a arte 'Original de Vivre' local." },
    ],
  },
```

Trocar também o rótulo do manifesto: `label: "Manifesto (faixa vermelha)"` → `"Manifesto (faixa vinho)"` e na descrição `"Frase editorial grande em vermelho Pierre"` → `"Frase editorial grande em vinho-noir com o botão vermelho"`.

`BlockRenderer.tsx`: `import OriginalBand from "@/components/home/OriginalBand";` e, no `switch`, antes de `case "manifesto"`:

```tsx
    case "original":
      return <OriginalBand titulo={c.titulo} texto={c.texto} botaoTexto={c.botao_texto} botaoLink={c.botao_link} imagem={c.imagem_url} />;
```

`app/page.tsx`: `import OriginalBand from "@/components/home/OriginalBand";` e `<OriginalBand />` logo depois do `<EditorialFeature ... />`.

- [ ] **Step 3: SQL opcional**

```sql
-- =============================================================================
-- DESIGN SYSTEM MAISON — insere o bloco "Faixa Original" na home já existente,
-- logo depois do bloco "História (45+ anos)" (ou na posição 6 se ele não existir).
--
-- Alternativa sem SQL: /painel/paginas → Home → "Adicionar bloco" → "Faixa Original".
-- ⚠️ Rode UMA vez (o INSERT não tem chave única — re-rodar duplica).
-- =============================================================================
SET @pid = (SELECT id FROM site_paginas WHERE slug = 'home' LIMIT 1);
SET @pos = IFNULL((SELECT ordem + 1 FROM site_blocos WHERE pagina_id = @pid AND tipo = 'historia' LIMIT 1), 6);
UPDATE site_blocos SET ordem = ordem + 1 WHERE pagina_id = @pid AND ordem >= @pos;
INSERT INTO site_blocos (pagina_id, tipo, nome, ordem, config, ativo) VALUES
(@pid, 'original', 'Faixa Original', @pos, '{"titulo":"","texto":"","botao_texto":"","botao_link":"","imagem_url":""}', 1);
```

- [ ] **Step 4: CSS (antes de `/* --- Mosaico`)**

```css
/* --- Faixa Original: arte em bleed inclinada com o scroll ------------------ */
.orig{position:relative;min-height:min(90svh,820px);display:flex;align-items:center;background:var(--vinho-noir);color:var(--marfim);overflow:hidden;isolation:isolate;perspective:1400px}
.orig-stage{position:absolute;inset:-6% 0;z-index:0;transform:rotateX(calc((var(--p,.5) - .5) * -12deg)) translateY(calc((var(--p,.5) - .5) * -8%));transform-origin:center;will-change:transform}
.orig-img{width:100%;height:100%;object-fit:cover;object-position:center 40%}
.orig-veil{position:absolute;inset:0;z-index:1;background:linear-gradient(90deg,rgba(43,24,30,.86) 0%,rgba(43,24,30,.55) 42%,rgba(43,24,30,.05) 72%);pointer-events:none}
.orig-body{position:relative;z-index:2;padding:var(--section) 0}
.orig-copy{max-width:520px}
.orig-kicker{display:block;font-family:var(--font-serif);font-style:italic;font-weight:500;font-size:1.3rem;color:var(--ouro-claro);margin-bottom:var(--space-3)}
.orig-copy h2{color:var(--marfim);font-size:clamp(3rem,1.8rem + 4.6vw,6.4rem);line-height:.92;margin-bottom:var(--space-5)}
.orig-copy p{color:color-mix(in srgb,var(--marfim) 88%,transparent);font-size:var(--fs-lead);margin-bottom:var(--space-6)}
@media (max-width:900px){
  .orig{min-height:0;perspective:none}
  .orig-stage{inset:0;transform:none}
  .orig-veil{background:linear-gradient(0deg,rgba(43,24,30,.9) 0%,rgba(43,24,30,.55) 55%,rgba(43,24,30,.15) 100%)}
}
@media (prefers-reduced-motion:reduce){.orig-stage{transform:none;inset:0}}
```

- [ ] **Step 5: Verificar e commit**

1440: arte pink/vinho em bleed com os três potes, inclinando ao rolar; chamada legível à esquerda. 390: sem inclinação, véu de baixo. Commit:

```bash
git add components/home/OriginalBand.tsx db/site_home_original.sql lib/cms.ts components/cms/BlockRenderer.tsx app/page.tsx components/home/home.css && git commit -m "Adiciona a faixa Original em bleed com perspectiva

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 6: História, destaque, mosaico, manifesto e encerramento no registro Maison

**Files:**
- Modify: `components/home/Manifesto.tsx` (marca em ouro, botão vermelho), `components/home/home.css` (blocos História, Destaque, Mosaico, Manifesto, Encerramento)

- [ ] **Step 1: Manifesto**

Em `Manifesto.tsx`: `src={asset("/assets/img/logo-pierre-white.png")}` → `src={asset("/assets/img/logo-pierre-gold.png")}`; `className="btn btn-light"` → `className="btn btn-primary"`.

Em `home.css`, bloco Manifesto: `.mani-mark{...opacity:.09...}` → `opacity:.07`; `.mani-marquee{...color:rgba(255,255,255,.62)...}` → `color:color-mix(in srgb,var(--ouro) 60%,transparent)`; `.mani-side p{color:rgba(255,255,255,.9);...}` → `color:color-mix(in srgb,var(--marfim) 86%,transparent);`; `.mani-scrub .split-w>span{...opacity:calc(.22 + ...)}` mantém.

- [ ] **Step 2: História**

`.her-num-big` já está em ouro-foil; adicionar o brilho por scroll: `.her-leitura` já tem `--p`; adicionar a regra `.her-num-big{background-position:calc(var(--p,0) * 100%) 0}` **não** funciona porque `--p` está em outro ramo; em vez disso, no `Heritage.tsx`, envolver `.her-num` num `ScrollProgress` (`<ScrollProgress className="her-num" faixa={VIAGEM} aria-hidden="true">`) substituindo o `<div className="her-num" aria-hidden="true">`, e em CSS `.her-num-big{background-position:calc(var(--p,0) * 100%) 0}`. `.her-marcos{border-top:1px solid var(--line-strong)}` → `var(--line-ouro)`; `.her-marco{...border-bottom:1px solid var(--line-strong)}` → `var(--line)`. `.her-frame{...border-radius:var(--radius-xl)...}` → `var(--radius-lg)`.

- [ ] **Step 3: Destaque, mosaico, encerramento**

`.feat-tags li{...border-radius:999px;border:1px solid var(--line-strong);font-size:.8rem;font-weight:600;...}` → `border-radius:2px;border:1px solid var(--line-strong);font-size:.8rem;font-weight:500;`. `.mosaic-tile{...border-radius:var(--radius-lg)...}` → `var(--radius)`. `.mosaic-cap h3` já 600. `.close-list{...border-top:1px solid var(--line-strong)}` → `var(--line-ouro)`; `.close-item a{...border-bottom:1px solid var(--line-strong)...}` → `var(--line)`.

- [ ] **Step 4: Verificar e commit**

Home inteira em 1440 e 390 sem vermelho fora dos botões; manifesto vinho-noir com marquee ouro e marca dourada. Commit:

```bash
git add components/home/Manifesto.tsx components/home/Heritage.tsx components/home/home.css && git commit -m "Ajusta história, destaque, mosaico, manifesto e encerramento ao registro Maison

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 7: Verificação final, documentação e integração

**Files:**
- Modify: `docs/REDESIGN.md` (tabela "Como a home é montada" e estado da etapa 2)

- [ ] **Step 1: Screenshots e overflow**

Com o dev server (`FORCAR_HOME_CLASSICA=1`), em 1440 e 390: home no topo, hero após rolar 60%, universos no meio da fila, história, anel no meio, faixa Original, manifesto. Medir `scrollWidth === clientWidth` nas duas larguras. Conferir `prefers-reduced-motion` com `page.emulateMedia({ reducedMotion: 'reduce' })`: fila e anel viram trilho, hero relativo.

- [ ] **Step 2: Docs**

Em `docs/REDESIGN.md`, na tabela de blocos: `Atalhos de categoria | UniverseIndex` → `Universos em scroll lateral | UniverseStrip`; `Vitrine de produtos (automática) | ProductRail` → `ProductRail (grade ou anel 3D, campo "apresentação")`; adicionar linha `**Faixa Original** — novo | OriginalBand`. Na seção "Design system Maison", marcar a etapa 2 como feita e citar `db/site_home_original.sql` e os campos novos do banner (foco, tom).

- [ ] **Step 3: Parar o dev server, build final, commit, mostrar, integrar**

```powershell
$c = Get-NetTCPConnection -LocalPort 3777 -State Listen -ErrorAction SilentlyContinue | Select-Object -First 1; if ($c) { Stop-Process -Id $c.OwningProcess -Force -Confirm:$false }
```

```bash
sh /c/Users/dev_c/sync-pa.sh && cd /c/Users/dev_c/pa-run && npx tsc --noEmit && npm run build 2>&1 | grep -E "✓|rror" | head
cd "G:/Drives compartilhados/TI/developer/sites/pa" && git add docs/REDESIGN.md && git commit -m "Documenta a etapa 2 do design system Maison

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

Subir o dev server de novo para o usuário ver; merge na `main` e push só depois do "pode publicar" dele. Lembrar que a home publicada só mostra a faixa Original depois do bloco ser adicionado (painel ou SQL).

---

## Self-review

- **Cobertura da spec §4:** 4.1 hero (Task 1–2), 4.2 universos (3), 4.3 anel (4), 4.4 Original (5), 4.5 demais seções (6); §7 regras de movimento aplicadas em cada CSS (reduced-motion, overflow-x clip); §8 vídeo lazy no desktop (Task 2). Ficam fora, como a spec previa: o aviso de tamanho de vídeo no painel (texto de ajuda já existe no editor; ajustar a frase é opcional).
- **Placeholders:** nenhum.
- **Nomes:** `Banner.foco/tom` (Task 1) usados na Task 2 como `data-foco`/`data-tom` e `s.tom`; `UniverseStrip` (3) referenciado no BlockRenderer e page; `ProductRing` (4) importado em `ProductRail`; `apresentacao` (4) em `lib/cms.ts`, `BlockRenderer`, `page.tsx`; `OriginalBand` (5) com props `titulo,texto,botaoTexto,botaoLink,imagem` casando com o `case "original"`.
