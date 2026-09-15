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
| Fontes (next/font, `--font-bodoni` / `--font-manrope`) e metadados/OG/JSON-LD | `app/layout.tsx` |
| Variantes WebP responsivas | `scripts/optimize-images.mjs` → `public/assets/img/opt/` |
| Packshots dos produtos por código do ERP | `scripts/produtos-imagens.mjs` → `public/assets/img/produtos/` + `lib/produtos-imagens.json` |
| Helpers de imagem responsiva | `lib/imagens.ts`, `components/ui/Picture.tsx` |
| Reveal por scroll (IntersectionObserver) | `components/ui/Reveal.tsx` |
| Inclinação com reflexo (cards, galeria do produto) e barra fixa do produto | `components/ui/Tilt.tsx`, `components/PdpBar.tsx` |
| Progresso de scroll (`--p`), texto por palavras, contador | `components/ui/ScrollProgress.tsx`, `SplitWords.tsx`, `CountUp.tsx` |
| Cena sticky tradição → presente | `components/home/HeritageScene.tsx` |

## Como a home é montada

A home em produção é a página `home` do CMS (`/painel/paginas`). Cada tipo de
bloco agora renderiza um componente editorial (`components/cms/BlockRenderer.tsx`):

| Bloco no painel | Componente |
| --- | --- |
| Carrossel de topo | `HeroEditorial` (slides de `/painel/banners`, mídia em bleed; campos *foco* e *tom* definem o lado do texto e o véu; vídeo só no desktop) |
| Atalhos de categoria | `UniverseStrip` (universos em scroll lateral preso; trilho no celular) |
| Vitrine de produtos (automática) | `ProductRail` (grade com entrada 3D ou **anel 3D** girado pelo scroll, campo *apresentação*; trilho no celular) |
| Destaque com imagem | `EditorialFeature` |
| **História (45+ anos)** | `Heritage` + `HeritageScene` |
| **Faixa Original** — novo (`original`) | `OriginalBand` (arte em bleed inclinada com o scroll; SQL opcional `db/site_home_original.sql`) |
| Coleções por categoria | `UniverseMosaic` |
| Chamada com botão (na home) / **Manifesto** | `Manifesto` (faixa vinho-noir, marquee em ouro, botão vermelho) |
| Encerramento: canais da marca (ex-newsletter) | `Closing` (WhatsApp da faixa do topo, redes do rodapé, onde comprar, seja consultora) |

Blocos novos para páginas institucionais (set/2026), usados na página **Sobre**
(`db/site_sobre_conteudo.sql`):

| Bloco no painel | Componente | Observação |
| --- | --- | --- |
| Canais de compra | `components/cms/Canais.tsx` | cartões com destino real; no campo de link, a palavra `whatsapp` usa o número de Configurações |
| Valores numerados (01 / 02 / 03) | `components/cms/Valores.tsx` | o numeral vem da ordem; o painel guarda rótulo, título e texto |
| Linha do tempo | `components/cms/Timeline.tsx` | fio de ouro que se preenche com o scroll; campo *Aviso* para marcar conteúdo ilustrativo |
| Novidades por e-mail | `components/cms/Novidades.tsx` | **não grava nada ainda**: o aviso abaixo do formulário diz isso e o envio não finge sucesso |

O bloco *Texto* ganhou o campo **Selo**, a linha pequena acima do título.

A página **Onde comprar** (`db/site_onde_comprar.sql`) usa o bloco de canais
para levar a dois destinos reais: a loja oficial
(`https://www.pierrecosmeticos.com.br`) e o WhatsApp da marca.

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

## Design system Maison (set/2026)

Spec completa em `docs/superpowers/specs/2026-09-14-design-system-maison-design.md`
e planos por etapa em `docs/superpowers/plans/`. Etapas: (1) tokens, tipografia
e chrome — **feita**; (2) home — **feita** (hero em bleed com foco/tom,
universos em scroll lateral, anel 3D, faixa Original, manifesto vinho-noir);
(3) categoria e produto — **feita** (card sem caixa com packshot em multiply
sobre marfim e inclinação com reflexo; cabeçalho de categoria com foto 21:9 em
parallax; filtros com fios; página de produto com preço, ficha em fios, sem
estrelas e barra fixa no celular); (4) institucionais, blocos do CMS e
formulários.

Para a home publicada mostrar a faixa Original, adicionar o bloco no painel
ou rodar `db/site_home_original.sql` uma vez. Os banners existentes ganham
`foco: centro` e `tom: escuro` por padrão; ajuste em /painel/banners (a foto
das gerações fica melhor com foco à direita e tom claro).

Regras rápidas: vermelho `--pierre` só no logotipo e em `.btn-primary`; fundo
escuro é `--vinho-noir`, nunca preto; ouro (`--ouro`, `--ouro-foil`, classe
`.foil`) só como fio, numeral ou brilho; eyebrows em Bodoni itálico
(`.eyebrow`), nunca caixa alta; foco de teclado em ouro; botões com raio 2px e
sem pulo no hover. Fontes: Bodoni Moda (`--font-bodoni`, peso variável com eixo
`opsz`) e Manrope (`--font-manrope`), em `app/layout.tsx`. Logo em ouro para
fundos escuros: `public/assets/img/logo-pierre-gold.png`, gerada por
`node scripts/logo-ouro.mjs` no espelho local.

Ajuste de conteúdo pendente no painel: "Onde comprar" e "Consultora" têm dois
blocos "cta" seguidos (duas faixas escuras); remover um em cada página.

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
