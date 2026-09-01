# Formulários de eventos (/forms)

Sistema de pesquisas orientado por configuração: **um** conjunto de código
renderiza, valida, grava, resume e exporta **todos** os formulários. As perguntas
vivem em [lib/forms/definicoes.ts](../lib/forms/definicoes.ts).

## Rotas

| Rota | O que é | Acesso |
| --- | --- | --- |
| `/forms/1` | Ausência — Evento Radicaline | pública |
| `/forms/2` | Pesquisa — Evento Radicaline | pública |
| `/forms/respostas` | Índice de todos os formulários | admin (`admin`, `admin_ti`) |
| `/forms/[id]/respostas` | Dashboard: métricas, filtros, tabela, detalhe | admin |
| `/api/forms/[id]/export` | Exportação XLSX (aceita `?de&ate&q&ordem`) | admin |

**As URLs públicas oficiais são as LIMPAS**: `pierrealexander.com.br/forms/1`
(com ou sem `www` — a Vercel redireciona o apex para o `www`). O app vive sob
`basePath /preview-site`; o `vercel.json` faz o rewrite de `/forms/*` e
`/api/forms/*` (como já era feito com `/links`), e o componente
[AjusteBasePath](../components/forms/AjusteBasePath.tsx) corrige o caminho no
navegador para a hidratação do React funcionar na URL limpa — devolvendo a URL
limpa à barra depois de hidratado. Os caminhos com `/preview-site/forms/...`
também continuam funcionando.

## Banco

Migration: [db/site_form_respostas.sql](../db/site_form_respostas.sql) — cria
`site_form_respostas` (uma linha por resposta; perguntas em JSON) e
`site_form_rate_limit` (anti-spam; guarda só um HMAC truncado do IP, nunca o IP).
**Já aplicada** no banco em 01/09/2026. Datas gravadas em UTC; exibição sempre em
`America/Sao_Paulo`.

## Como adicionar o /forms/3

1. Em `lib/forms/definicoes.ts`, crie uma `FormularioDef` com `id: 3` e as
   perguntas (tipos: `unica`, `multipla`, `escala`, `texto`; opção com
   `abreDetalhe: true` abre o campo "Outro" obrigatório).
2. Acrescente-a ao array `FORMULARIOS`.

Pronto: página pública, validação (cliente + servidor), gravação, dashboard,
filtros e XLSX passam a existir para o novo id. Nenhuma tabela nova é
necessária. **Nunca renomeie** `id` de pergunta ou `valor` de opção depois de
publicado — para mudanças estruturais, suba `versao`.

## Segurança (resumo)

- Server action com revalidação completa no servidor (id, opções, tamanhos);
  consultas 100% parametrizadas; CSRF coberto pelo mecanismo de server actions.
- `proxy.ts` barra as rotas administrativas antes de renderizar; cada página e a
  API de exportação revalidam sessão + papel de novo (defesa em profundidade).
- Rate limit: 5 envios por remetente a cada 10 min (contado no banco, funciona
  em serverless). Duplo clique/reenvio (< 90 s, mesmo e-mail) não duplica linha.
- Nada de dado pessoal em logs, URLs ou payloads de erro.

## Desenvolvimento local (máquina no Google Drive)

`npm install` **não funciona** dentro do G: (o Drive não suporta as operações do
npm/tar). Use o espelho local:

```sh
sh /c/Users/dev_c/sync-pa.sh        # copia G: -> C:\Users\dev_c\pa-run (só o que mudou)
cd /c/Users/dev_c/pa-run && npm ci  # só na primeira vez
npx next dev -p 3777                # http://localhost:3777/preview-site/forms/1
```

Para testar as **URLs limpas como em produção**, use o build de produção mais o
simulador dos rewrites da Vercel (o modo dev não hidrata atrás do proxy porque
o HMR não conecta — isso não existe em produção):

```sh
cd /c/Users/dev_c/pa-run && npm run build && npx next start -p 3777
node _dev_proxy_vercel.mjs          # http://localhost:3888/forms/1
```

Edite sempre no G: (fonte da verdade) e rode `sync-pa.sh` para refletir no
espelho. O deploy continua sendo o push na `main` (Vercel).
