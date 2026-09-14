# Design system "Maison" — spec de design

Data: 14/09/2026. Escopo: site público inteiro (`/preview-site`), em quatro
etapas publicáveis. Painel administrativo fora do escopo visual.

## 1. Objetivo e direção

Levar o site ao registro das maisons de beleza (Guerlain, Dior Beauty, La Mer,
Sisley) sem perder o que a marca é: brasileira, calorosa, vendida por
consultoras. A direção foi tirada das próprias fotos da marca: embalagens
marfim com tampas douradas, lilás e blush; o Original em vinho profundo; cenas
de seda, pétalas, luz de fim de tarde, madeira clara e veludo bordô.

Princípios:

1. **Ouro é material, não cor.** Aparece como gradiente metálico em fios de
   1px, numerais e brilhos que passam com o scroll. Nunca como fundo chapado.
2. **Vermelho Pierre em dois lugares por tela:** o logotipo e o botão
   principal. Nada mais é vermelho (eyebrows, faixas, chips, sublinhados).
3. **Vinho-noir no lugar do preto.** Todo fundo escuro, texto e rodapé usam
   `#2b181e`. O site inteiro fica mais quente sem parecer marrom.
4. **Hierarquia por tamanho e itálico**, não por caixa alta. Sem eyebrows em
   uppercase, sem etiquetas espaçadas.
5. **Ar e fios, não cards.** Blocos separados por fios de ouro e espaço,
   raios pequenos. Sombras só onde há profundidade real (3D).
6. **Cada seção da home tem um efeito de scroll próprio.** Movimento só com
   `transform`, `opacity`, `clip-path`; tudo desliga com
   `prefers-reduced-motion`; sem scroll hijacking.
7. **Informação verdadeira.** Sem estrelas falsas, sem números inventados.
   Preço aparece quando existe.

## 2. Tokens (`app/globals.css` → `:root`)

Os nomes atuais continuam existindo (muitos componentes os usam); mudam os
valores e entram novos. Aliases legados (`--accent`, `--gold`, `--espresso`,
`--champagne`, `--branco`, `--soft`, `--carbon`) passam a apontar para os
tokens novos, o que já recolore as páginas antigas.

### Cor

| Token | Valor | Uso |
| --- | --- | --- |
| `--papel` | `#fcfaf5` | fundo base (`--bg`, `--branco`) |
| `--marfim` | `#f6f0e6` | seções alternadas (`--soft`), fundo de produto |
| `--areia` | `#e9dfd0` | superfícies de apoio |
| `--vinho` | `#4d2e38` | texto de apoio serifado, voz itálica |
| `--vinho-noir` | `#2b181e` | `--ink`, `--espresso`, `--carbon`, rodapé, faixas escuras |
| `--ink-2` | `#4a3a3c` | texto corrido |
| `--muted` | `#8a7a74` | legendas, contagens |
| `--ouro` | `#b99a68` | `--champagne`, `--gold`; fios, numerais, foco |
| `--ouro-claro` | `#e6cf9f` | ponto alto do metal |
| `--ouro-escuro` | `#8c6d3f` | sombra do metal |
| `--ouro-foil` | `linear-gradient(115deg,#e6cf9f 0%,#b99a68 40%,#8c6d3f 62%,#d9bd8a 100%)` | `background` de numerais e fios com `background-clip:text`; `background-size:200%` para o brilho por scroll |
| `--lilas` | `#e9dff2` | etiquetas, fundos de destaque |
| `--blush` | `#f5dfe0` | etiquetas, fundos de destaque |
| `--pierre` | `#e3301a` | logotipo e `.btn-primary` |
| `--pierre-deep` | `#c2280f` | hover do `.btn-primary` |
| `--line` | `#e8dfd2` | fio padrão |
| `--line-strong` | `#d6c8b4` | fio de apoio |
| `--line-ouro` | `color-mix(in srgb, var(--ouro) 55%, transparent)` | fio de ouro (separadores, hairlines) |

Removidos do uso: `--queimado`, `--terracota`, `--marrom`, `--pierre-tint`
como fundo de chips (vira `--blush`). Foco de teclado: `2px solid var(--ouro)`
com offset 3px (não vermelho). Seleção: `--blush` / `--vinho-noir`.

### Tipografia

- **Display e títulos:** Bodoni Moda (`next/font/google`, `Bodoni_Moda`,
  variável, `axes: ["opsz"]`, pesos 400–600, normal e itálico), variável CSS
  `--font-bodoni`; `--font-serif` passa a apontar para ela. Cormorant sai do
  `layout.tsx`.
- **Interface e corpo:** Manrope 400/500/600 (mantida).
- **Escala:** `--fs-display: clamp(3.2rem, 1.6rem + 6.4vw, 8rem)`;
  `--fs-h1: clamp(2.6rem, 1.6rem + 3.8vw, 5rem)`;
  `--fs-h2: clamp(2.1rem, 1.4rem + 2.6vw, 3.8rem)`;
  `--fs-h3: clamp(1.4rem, 1.2rem + .9vw, 2rem)`; corpo `1.05rem`, lead
  `clamp(1.1rem, 1rem + .4vw, 1.3rem)`, medida `60ch`.
- Títulos: peso 400 (h1/display) e 500 (h2/h3), entrelinha 0,95 a 1,05,
  tracking `-.01em`. Itálico Bodoni como "voz da casa" em frases curtas
  (kicker, legendas de cena, títulos de coluna do rodapé).
- `.eyebrow` deixa de ser caixa alta: vira Bodoni itálico 1.1rem em `--vinho`,
  sem tracking. Etiquetas pequenas (`.pcard-eyebrow`, `label`) ficam em
  Manrope 500, sentence case, `--muted`.

### Espaço, raio, fios, sombra

- `--section: clamp(5rem, 4rem + 5vw, 9rem)`; `--max: 1320px`;
  `--gutter: clamp(20px, 4.5vw, 64px)`.
- `--radius-sm: 4px; --radius: 8px; --radius-lg: 14px; --radius-xl: 20px`.
- Fios: `1px solid var(--line)`; fio de ouro `1px solid var(--line-ouro)`.
- Sombra só em elementos 3D: `--shadow-3d: 0 40px 80px -40px rgba(43,24,30,.35)`.
- Movimento: `--ease-out: cubic-bezier(.16,1,.3,1)`, `--t-slow: .8s`. Botões
  não pulam no hover (sem `translateY`).

## 3. Chrome

### Faixa do topo (`TopStrip`)

Vinho-noir, texto marfim 12.5px, fio de ouro de 1px na base
(`box-shadow: inset 0 -1px var(--line-ouro)`). Links sublinhados só no hover.

### Header (`Header`)

- Papel com blur após rolar; transparente sobre o hero na home (já existe).
- Itens de menu em Manrope 500 `.9rem`, sublinhado de hover em `--ouro`
  (não vermelho), 1px.
- Busca: campo com fio inferior (`border-bottom:1px solid var(--line-strong)`),
  sem pílula; foco em ouro.
- CTA "Seja consultora": `.btn-carbon` (vinho-noir sólido). O vermelho fica
  para o CTA da página.
- Mega-painel: papel, fio de ouro, sem sombra pesada; primeiro item em Bodoni.
- Menu mobile: itens em Bodoni 1.7rem, fios entre eles, "+" em ouro.

### Rodapé (`Footer`)

Vinho-noir. Colunas separadas por fios verticais de ouro a 20% (em telas
largas), títulos em Bodoni itálico 1.3rem marfim, links marfim a 70%. Linha
final com fio de ouro acima. Redes como pílulas de fio (`.btn-hairline`).
Marca script gigante em ouro a 5% (`.ftr-mark` com `filter` para ouro ou
versão PNG dourada gerada por script).

### Botões (`.btn*`)

Raio 2px, altura 48px, Manrope 500 `.9rem`, tracking `.04em`.

| Classe | Estilo |
| --- | --- |
| `.btn-primary` | vermelho Pierre, texto papel; hover `--pierre-deep` |
| `.btn-carbon`, `.btn-orange` | vinho-noir, texto papel; hover `--vinho` |
| `.btn-outline`, `.btn-ghost`, `.btn-gold`, `.btn-hairline` | fio `--line-strong`, texto ink; hover fio ouro |
| `.btn-light` | papel, texto vinho-noir (em fundos escuros) |
| `.btn-ghost-light` | fio marfim a 55%, texto marfim |
| `.link-line` | traço em `--ouro` que cresce no hover |

### Formulários

`label` em Manrope 500 `.8rem`, sentence case, `--muted`. Campos sem caixa:
fundo transparente, fio inferior `--line-strong`, padding 12px 0; foco = fio
inferior em ouro 1.5px. `.form-box` sem borda, com fio de ouro no topo.
Botão de envio `.btn-primary`. Os formulários de evento (`/forms`) só herdam
tokens e fontes; sua estrutura (`frm-*`, `FormularioCliente`) não muda.

### WhatsApp flutuante

Mantido verde (é a cor do canal), raio 2px em vez de pílula, sombra menor.

## 4. Home

A home continua montada pelos blocos do CMS (`BlockRenderer`) e a
`HomeClassica` espelha a mesma narrativa. Mapeamento:

| Bloco | Componente | Efeito de scroll |
| --- | --- | --- |
| carrossel | `HeroEditorial` v2 (cinematográfico) | cortina (mantida) |
| atalhos | **`UniverseStrip`** (novo) | **scroll lateral preso** |
| historia | `Heritage` | contador + leitura (mantidos), numeral em ouro-foil com brilho |
| vitrine | `ProductRail` v2 (`apresentacao` grade ou **anel 3D**) | entrada 3D (grade) / **anel cilíndrico** (anel) |
| destaque | `EditorialFeature` | perspectiva + parallax (mantidos) |
| **original** (novo) | **`OriginalBand`** | bleed em perspectiva |
| colecoes | `UniverseMosaic` | parallax em colunas (mantido) |
| cta (na home) | `Manifesto` v2 | frase que acende (mantida) |
| newsletter | `Closing` | lista escalonada (mantida) |

### 4.1 Hero cinematográfico (`HeroEditorial` v2)

- Mídia em bleed total, `min-height: 100svh` no desktop (`88svh` no celular).
- **Direção de arte por slide.** `Banner` ganha dois campos, editáveis em
  `/painel/banners` e normalizados em `lib/banners.ts`:
  - `foco`: `"esquerda" | "centro" | "direita"` (padrão `"centro"`). Define
    `object-position` da mídia e a coluna do texto (o texto fica do lado
    oposto ao foco; com `centro`, texto embaixo à esquerda).
  - `tom`: `"claro" | "escuro"` (padrão `"escuro"`). `claro` = texto
    vinho-noir com véu marfim a 70% do lado do texto; `escuro` = texto marfim
    com véu vinho-noir a 60% subindo do rodapé e do lado do texto.
- Slides padrão (`BANNERS_PADRAO`): gerações = `foco:"direita", tom:"claro"`;
  Radicaline = `foco:"centro", tom:"escuro"`.
- Estilo `padrao`: kicker em Bodoni itálico, título display, lead, botões.
  Estilo `lancamento`: logo branca, frase, título centrado (mantido).
- Vídeo: `<video>` com `poster` e `preload="none"`; a `<source>` só é
  anexada no cliente quando `matchMedia("(min-width: 900px)")` e após o
  primeiro paint. Celular usa o poster. Sem `autoplay` com
  `prefers-reduced-motion`.
- Navegação: setas com fio, contador em Bodoni, linha de progresso do slide
  em ouro (1px, cresce durante o intervalo).
- Cortina mantida; véu de saída em vinho-noir.

### 4.2 Universos em scroll lateral (`UniverseStrip`, novo)

- Seção de altura `260svh` com filho `sticky` de `100svh`.
  `ScrollProgress` escreve `--p`; a fila recebe
  `transform: translateX(calc(var(--p) * -1 * (largura-da-fila - largura-da-tela + gutter)))`,
  onde a largura da fila é medida no cliente e escrita em `--fila`.
- Cabeçalho fixo à esquerda: "Explore por universo" em Bodoni itálico e fio de
  ouro que avança como barra de progresso (`scaleX(var(--p))`).
- Cards 4:5, largura `clamp(260px, 28vw, 420px)`, foto com `object-position`
  da categoria, nome em Bodoni 2.4rem sobre véu vinho-noir, tagline em
  Manrope. Hover: foto escala 1.04 em 1.2s.
- Celular (`max-width: 900px`) e reduced-motion: sem sticky; trilho nativo
  com `scroll-snap`.
- Dados: `getCategorias()` (mesmos do `UniverseIndex`, que é removido).

### 4.3 Vitrine 3D em anel (`ProductRail` v2)

- Bloco `vitrine` ganha `apresentacao: "grade" | "anel"` (padrão `grade`).
  Na `HomeClassica`, "Mais vendidos" usa `anel` e "Novidades" usa `grade`.
- **Anel:** seção `240svh` com filho `sticky` `100svh`; os N cards são
  posicionados num cilindro (`rotateY(i * 360/N deg) translateZ(R)`,
  `R = clamp(420px, 34vw, 640px)`) dentro de um palco com
  `perspective: 1600px; transform-style: preserve-3d`. O palco gira
  `rotateY(calc(var(--p) * -1 * 360/N * (N - 1) deg))`. O card de frente
  (menor ângulo) recebe `--frente: 1` (escala 1.06, sombra 3D, reflexo em
  ouro-foil a 12%); os demais ficam a 70% de opacidade.
- Título e "Ver tudo" fixos no canto superior esquerdo do palco.
- Celular e reduced-motion: grade / trilho com snap (comportamento atual).
- **Grade:** entrada 3D atual mantida.
- Card (`ProductCard`) v2, ver §5.

### 4.4 Faixa Original (`OriginalBand`, bloco `original`, novo)

- Bleed total com `IMAGENS.original` (arte "Original de Vivre"), altura
  `min(90svh, 820px)`. `ScrollProgress` inclina a arte em perspectiva
  (`rotateX` ±6°, `translateY` ±6%) enquanto a seção passa.
- Copy à esquerda sobre véu vinho-noir: kicker itálico "Desde o primeiro
  pote", título "O Original.", uma frase e `.btn-light` para `/original`.
- Campos do bloco no painel: `titulo`, `texto`, `botao_texto`, `botao_link`,
  `imagem_url` (padrão a arte local). Registrar o tipo em `lib/cms.ts` e no
  editor de blocos do painel; SQL opcional em `db/site_home_original.sql`
  (não roda automaticamente; o dono decide).

### 4.5 Demais seções

- `Heritage`: numeral "45+" em `--ouro-foil` com `background-clip:text` e
  `background-position` deslocando com `--p` (brilho que passa). Título Bodoni.
  Marcos com ano em Bodoni ouro. Cena sticky mantida.
- `EditorialFeature`: tags viram fios (`.tag-hairline`), botão secundário
  vira `.link-line` ouro.
- `UniverseMosaic`: raio 8px, legenda em Bodoni; parallax mantido.
- `Manifesto` v2: fundo vinho-noir, marquee em ouro a 55%, marca ao fundo em
  ouro a 6%, frase em marfim acendendo palavra a palavra, texto de apoio
  marfim a 85%, botão `.btn-primary` (único vermelho da seção).
- `Closing`: fios de ouro, nomes em Bodoni, detalhes em Manrope `--muted`.

## 5. Categoria e produto

### Card de produto (`ProductCard` v2)

- Sem caixa branca nem borda. Mídia 4:5 em `--marfim`, raio 8px; a foto usa
  `mix-blend-mode: multiply` (packshots em fundo branco passam a "sentar" no
  marfim). Sem foto: "Pierre" em Bodoni itálico ouro-foil centrado.
- Hover (só `hover:hover`): componente cliente **`Tilt`** aplica
  `rotateX/rotateY` até ±6° seguindo o ponteiro e um reflexo radial em
  ouro-foil a 10% na posição do ponteiro; volta com `--t-slow`.
- Nome em Bodoni 1.3rem/1.1; linha em Manrope `--muted`; preço Manrope 500;
  ação "Consulte uma consultora" como `.link-line` em `--vinho`.
- Etiquetas (`.pcard-badge`): fundo `--lilas` ou `--blush`, texto vinho-noir,
  sentence case, raio 2px.

### Página de categoria (`app/c/[slug]`)

- `.cat-hero` v2: foto da categoria em 21:9 (`aspect-ratio`), altura máxima
  `520px`, parallax via `ScrollProgress`; sobre ela, no canto inferior
  esquerdo, breadcrumbs em Manrope marfim e título em Bodoni display marfim;
  tagline em itálico. Sem foto: cabeçalho em marfim com título vinho-noir.
- Listagem: filtros como lista com fios (sem fundo nos botões; ativo em
  vinho-noir com fio de ouro à esquerda). Chips com fio (`--line-strong`) e
  "×" em ouro. Barra de ordenação: `select` com fio inferior. Contagem em
  Bodoni itálico.
- Grade 3 colunas (2 em 980px, 1 em 420px) com o card v2 e entrada 3D
  escalonada (`.rail-3d`).

### Página de produto (`app/p/[slug]`)

- Galeria em `--marfim`, raio 14px, foto com `multiply`, `Tilt` até ±4°.
- Coluna de informação: linha em itálico vinho, título Bodoni h1, lead,
  **preço** em Bodoni 2rem quando `product.preco` existe (hoje não aparece),
  ficha `dl` com fios de ouro entre linhas (categoria, família, indicado
  para), ações (`.btn-primary` "Encontrar uma consultora", `.btn-outline`
  "Quero vender este produto"), nota em `--muted`.
- **Removido:** bloco `.pdp-rating` com estrelas.
- "Sobre o produto": fio de ouro acima, medida 60ch.
- Celular: **`PdpBar`** (cliente) fixa no rodapé com preço e o botão
  principal, aparece quando `.pdp-actions` sai da tela (IntersectionObserver).
- Vitrine "Você também pode gostar": grade.

## 6. Páginas internas, blocos genéricos do CMS e compatibilidade

As páginas Sobre, Onde comprar, Consultora, Maison, Original, Tratamentos,
Fragrâncias, Kits, `/pagina/[slug]` e Busca são montadas por blocos do CMS
quando existe conteúdo publicado; senão usam o HTML de fallback com as
classes legadas. Os dois caminhos recebem o mesmo tratamento:

### Blocos genéricos (`.cms-*`, `BlockRenderer`)

- `hero` (`.cms-hero`): deixa de ser faixa vinho chapada. Com `imagem_url`:
  faixa 21:9 com parallax e título marfim sobre véu (igual ao `.cat-hero`
  v2). Sem imagem: cabeçalho em papel, título Bodoni display vinho-noir,
  fio de ouro abaixo, lead em itálico. Eyebrow vira itálico.
- `texto`: medida 60ch, corpo 1.1rem/1.75, h2 Bodoni.
- `destaque`: `EditorialFeature` (já).
- `cta` (fora da home): faixa vinho-noir, título Bodoni marfim, botão
  `.btn-primary`. Nunca vermelho de fundo.
- `colunas`: fios de ouro no topo de cada coluna, título Bodoni.
- Blocos `cta` consecutivos numa mesma página são conteúdo duplicado; o
  código não os funde. Fica anotado para ajuste no painel (Onde comprar e
  Consultora têm dois hoje).

### Camada legada (`globals.css`, seção "COMPATIBILIDADE")

- `.page-hero`: papel, título Bodoni display, fio de ouro, `.breadcrumb` em
  Manrope `--muted` sentence case; `.hero-tag` em Bodoni itálico ouro-foil.
- `.section-red` → vinho-noir (mesmo visual do `cta`). `.section-black` →
  vinho-noir. `.section-paper` → marfim.
- `.panel`, `.quick-card`, `.step`, `.level`, `.story-card`, `.product-card`,
  `.motivo-row`, `.table-like`: sem fundo branco nem borda em volta; fio de
  ouro no topo (ou à esquerda em `.motivo-row`), padding vertical. `.step:before`
  e `.level` (borda vermelha) → ouro. `.panel.red` → vinho-noir.
- `.cta-band` (`CtaBand`): faixa marfim com fio de ouro, `.btn-carbon`.
- `.color-band`, `.top2-badge`, `.motivo-badge`: vermelho → vinho-noir/ouro.
- Botões `.btn-orange`/`.btn-gold` mapeados em §3.

## 7. Movimento — inventário e regras

| Onde | Efeito | Técnica |
| --- | --- | --- |
| Hero | cortina + véu; progresso do slide | sticky no `<main>`, `--p` = scroll ÷ altura |
| Universos | fila lateral presa | sticky + `translateX` de `--p` |
| História | contador, leitura, brilho do numeral | `CountUp`, `ScrollProgress` (LEITURA), `background-position` |
| Vitrine | anel 3D / entrada 3D | sticky + `rotateY` do palco; `.rail-3d` |
| Destaque | perspectiva + parallax | `ScrollProgress` |
| Original | bleed em perspectiva | `ScrollProgress` |
| Mosaico | parallax em colunas | `ScrollProgress` |
| Manifesto | frase que acende, marquee ouro | `SplitWords` + `--p` |
| Cards | tilt + reflexo | `Tilt` (pointer), só `hover:hover` |
| Categoria / hero CMS | parallax da faixa 21:9 | `ScrollProgress` |
| Títulos | palavra a palavra | `SplitWords` |

Regras: só `transform`/`opacity`/`clip-path`/`background-position`; listeners
de scroll passivos e ativos apenas com o elemento perto da tela
(`IntersectionObserver`); `will-change` só nos elementos animados por scroll;
`prefers-reduced-motion` desliga tudo (fila e anel viram grade; contador
mostra o valor final; véus estáticos); sem scroll hijacking; nenhum efeito
pode gerar scroll horizontal (seções com deslocamento lateral usam
`overflow-x: clip`). Verificação em cada etapa: `scrollWidth === clientWidth`
em 390px e 1440px.

## 8. Ativos e pendências da marca

- **Vídeo do hero:** `teaser-radicaline.mp4` tem 15 MB. Precisa de uma
  versão H.264 1280px ≤ 4 MB (e opcionalmente WebM). Não há ffmpeg na
  máquina. Enquanto não chega, vale a regra do §4.1 (vídeo só no desktop,
  depois do primeiro paint, poster no celular) e o campo de vídeo do painel
  passa a mostrar o tamanho recomendado.
- **Fotos de categoria em 21:9:** usam as imagens atuais com
  `object-position`; nenhum recorte novo é obrigatório.
- **Recorte do pote do Original (PNG sem fundo):** opcional, deixaria a faixa
  Original com camadas de profundidade. Sem ele, a arte inteira inclina.
- **Marcos da linha do tempo** e **fotos históricas**: já pendentes desde o
  redesign anterior.
- **Logo em ouro para o rodapé:** gerada por script a partir do PNG branco
  (tint), em `public/assets/img/logo-pierre-gold.png`.

## 9. Etapas de entrega e verificação

Cada etapa termina com `npx tsc --noEmit`, `npm run build` no espelho local,
screenshots desktop (1440) e celular (390) das páginas tocadas, checagem de
overflow horizontal, atualização de `docs/REDESIGN.md` e commit próprio.

1. **Tokens, tipografia e chrome.** `globals.css` (`:root`, base, botões,
   formulários, top strip, header, footer, WhatsApp, camada legada §6),
   `layout.tsx` (Bodoni Moda), `Header`, `Footer`, `TopStrip`, `CtaBand`,
   logo ouro. Resultado: o site inteiro já muda de registro.
2. **Home.** `HeroEditorial` v2 + campos `foco`/`tom` (lib, painel, SQL
   opcional), `UniverseStrip`, `ProductRail` v2 (anel) + campo
   `apresentacao`, `OriginalBand` + bloco `original`, `Heritage`,
   `Manifesto` v2, `Closing`, `home.css`, `BlockRenderer`, `HomeClassica`.
3. **Categoria e produto.** `ProductCard` v2 + `Tilt`, `CategoryListing`,
   `app/c/[slug]`, `app/p/[slug]` + `PdpBar`, `ProductImage`.
4. **Institucionais, blocos CMS e formulários.** `.cms-*`, `.page-hero` e
   demais classes legadas, `ConsultoraForm`, `app/busca`, revisão de todas as
   páginas de fallback; lista de ajustes de conteúdo para o painel.

## 10. Fora de escopo

Visual do painel `/painel`; backend de newsletter; textos e SEO (só o que é
necessário para tirar sinais falsos); compressão do vídeo; produção de fotos.
