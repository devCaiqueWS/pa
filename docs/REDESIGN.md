# Redesign da home (`/preview-site`) — setembro/2026

Conceito: **“45 anos de beleza, cuidado e presença, apresentados por uma
experiência digital contemporânea.”** Marfim como papel, o vermelho medido no
logotipo (`#e3301a`) como assinatura, o vinho do pote do Original (`#4d2e38`)
como profundidade. Cormorant Garamond nos títulos, Manrope na interface.

## Onde as coisas estão

| O quê | Onde |
| --- | --- |
| Design tokens (cores, tipografia, espaço, raios, transições) | `app/globals.css` (`:root`) |
| Header, footer, botões, cards, listagem, PDP, blocos genéricos do CMS, compatibilidade legada | `app/globals.css` |
| Seções editoriais da home | `components/home/*.tsx` + `components/home/home.css` |
| Fontes (next/font, `--font-cormorant` / `--font-manrope`) e metadados/OG/JSON-LD | `app/layout.tsx` |
| Variantes WebP responsivas | `scripts/optimize-images.mjs` → `public/assets/img/opt/` |
| Packshots dos produtos por código do ERP | `scripts/produtos-imagens.mjs` → `public/assets/img/produtos/` + `lib/produtos-imagens.json` |
| Helpers de imagem responsiva | `lib/imagens.ts`, `components/ui/Picture.tsx` |
| Reveal por scroll (IntersectionObserver) | `components/ui/Reveal.tsx` |
| Progresso de scroll (`--p`), texto por palavras, contador | `components/ui/ScrollProgress.tsx`, `SplitWords.tsx`, `CountUp.tsx` |
| Cena sticky tradição → presente | `components/home/HeritageScene.tsx` |

## Como a home é montada

A home em produção é a página `home` do CMS (`/painel/paginas`). Cada tipo de
bloco agora renderiza um componente editorial (`components/cms/BlockRenderer.tsx`):

| Bloco no painel | Componente |
| --- | --- |
| Carrossel de topo | `HeroEditorial` (slides de `/painel/banners`; estilo *lançamento* vira cena cinematográfica) |
| Atalhos de categoria | `UniverseIndex` (linha tipográfica com as categorias) |
| Vitrine de produtos (automática) | `ProductRail` (produtos do ERP; trilho com snap no celular) |
| Destaque com imagem | `EditorialFeature` |
| **História (45+ anos)** — novo | `Heritage` + `HeritageScene` |
| Coleções por categoria | `UniverseMosaic` |
| Chamada com botão (na home) / **Manifesto** — novo | `Manifesto` (faixa vermelha) |
| Encerramento: canais da marca (ex-newsletter) | `Closing` (WhatsApp da faixa do topo, redes do rodapé, onde comprar, seja consultora) |

Sem página `home` no CMS, `app/page.tsx` monta a mesma narrativa com os textos
de `site_textos`.

### Para exibir a seção de história na home atual

A home publicada no banco ainda não tem o bloco. Duas opções:

1. **Painel:** `/painel/paginas` → Home → adicionar bloco “História (45+ anos)” e
   arrastar para depois da “Faixa de marca”.
2. **SQL:** rodar `db/site_home_historia.sql` uma vez.

Os campos do bloco (título, texto, linha do tempo `ano | texto`) podem ficar
vazios: entram os textos institucionais já publicados na página “Sobre”. A
linha do tempo só aparece quando preenchida — **nenhum fato foi inventado**.

## Pendências que dependem de material da marca

- **Linha do tempo real** (anos e marcos) para o bloco História.
- **Fotos históricas / embalagens antigas** para a cena “tradição” (hoje usa
  `hero-mural.jpg`; o campo é `IMAGENS.muralClassico` em `lib/imagens.ts`).
- **Sequência de frames** para uma cena em `<canvas>` controlada pelo scroll:
  não há frames nem ffmpeg no ambiente, então a cena usa crossfade + máscara +
  parallax em camadas (`HeritageScene`). Se a marca produzir 60–90 frames WebP
  (≤1280 px), a estrutura sticky já está pronta para recebê-los.
- **Imagens dos produtos do ERP**: 49 dos 54 produtos têm packshot local
  (`public/assets/img/produtos/<codigo>-960.webp`, gerado por
  `scripts/produtos-imagens.mjs` a partir das fotos brutas em `fontes/produtos`,
  pasta fora do deploy e do git). Prioridade no site: imagem do painel >
  packshot local > foto do Bling. Sem foto bruta: Adesivo de Pés (1591), After
  Shave (11501), Caixa de sabonetes (70541), Sabonete em barra Lavande (70401)
  e Parafina Bronzeadora (LOR1245). Para trocar uma foto, ajuste o `MAPA` do
  script e rode-o de novo no espelho local.
- **Newsletter**: o formulário anterior não gravava nada; foi substituído pelos
  canais reais. Para captar e-mails é preciso backend (tabela + action).
- **TikTok** no rodapé está com `#` no painel e por isso não aparece.

## Movimento

Sem dependências novas. Keyframes CSS no hero (uma entrada orquestrada),
`IntersectionObserver` para reveals pontuais, `requestAnimationFrame` para as
cenas ligadas ao scroll (só `transform`, `opacity`, `clip-path`). Tudo respeita
`prefers-reduced-motion` (a cena vira duas fotos lado a lado; marquee, logo,
cortina, parallax e preenchimentos desligam). Sem scroll hijacking.

### Animações de scroll (set/2026)

Cada seção da home tem **um** efeito próprio, com técnica diferente:

| Seção | Efeito | Como |
| --- | --- | --- |
| Hero | Cortina vertical: fica preso no topo e as seções seguintes deslizam por cima; a foto encolhe e o texto sobe e some | `.hero{position:sticky}` + `.hero ~ *` opaco acima; `--p` = scroll ÷ altura (calculado no próprio `HeroEditorial`). Só no desktop (>900px) |
| História | O "45" conta de 0 a 45; o título entra palavra a palavra; os parágrafos acendem de cima para baixo conforme a leitura | `CountUp`, `SplitWords`, `ScrollProgress` (faixa `LEITURA`) + gradiente com `background-clip:text` |
| Vitrine | Cards entram girando em perspectiva, um após o outro | `.rail-3d` (perspective) + `--i` em cada `ProductCard` |
| Destaque | Foto inclina em perspectiva conforme a posição na tela; imagem desliza dentro do quadro (parallax) | `ScrollProgress` na seção; `rotateY/rotateX` e `translateY` lidos de `--p` |
| Mosaico | Parallax em colunas: cada foto desliza numa velocidade (`--v`) | `ScrollProgress` na grade; `@property --s` para o zoom do hover |
| Manifesto | Frase grande acende palavra a palavra; marca ao fundo desliza | `SplitWords` + `--p` (opacidade por `--i`); `translate` no logo |
| Encerramento | Canais entram pela lateral, escalonados | `Reveal plain` + `--i` |

Primitivos em `components/ui/`:

- `ScrollProgress` (componente e hook `useScrollProgress`): escreve `--p` (0→1)
  no elemento conforme ele atravessa uma faixa da tela (`VIAGEM`, `SAIDA`,
  `LEITURA`). Só escuta o scroll perto da tela; nada com reduced-motion.
- `SplitWords`: divide um texto em `<span class="split-w">` com `--i`/`--n`.
  Dentro de um `.is-in` as palavras sobem escalonadas (CSS em `globals.css`).
- `CountUp`: conta até o valor quando entra na tela (o HTML já traz o final).
- `Reveal` ganhou `plain`: só marca `is-in`, o efeito fica no CSS da seção.

Para testar no Playwright headless: o relógio das transições CSS só avança
quando o navegador pinta um frame — tire um screenshot logo após o `scrollTo`
(ou use scroll suave) antes de capturar o estado intermediário.

## Rodando localmente

Ver memória/README: o Drive não suporta `npm`; espelhar em `C:\Users\dev_c\pa-run`
(`sync-pa.sh`), rodar `npx tsc --noEmit`, `npm run build` e
`npx next dev -p 3777`. Para regenerar as variantes WebP:
`node scripts/optimize-images.mjs` (usa o `sharp` que já vem com o Next).
