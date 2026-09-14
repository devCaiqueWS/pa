# Produtos do site × Bling — regra de seleção e estado do espelho

Atualizado em 14/09/2026.

## Regra de seleção (o que entra no site)

O site **não fala com o Bling**: lê o espelho no MySQL. Um produto entra quando:

1. existe na tabela `ofc_pierre_produto_bling_espelho` (situação ativa); **e**
2. **pela regra:** `ofc_pc_produtos.ativo = 1`, com a tag configurada no painel
   (padrão `Agrupamento:Origem`, coluna JSON `tags`) e a marca configurada
   (padrão `Pierre Alexander`, coluna `marca` ou tag `Marca:<nome>`);
3. **ou pela curadoria:** tem linha em `site_produtos` marcada como visível.
   Serve para incluir o que ainda não tem tag no ERP e para esconder o que a
   regra traz a mais. A curadoria sempre vence.

É o mesmo filtro **Tags: Origem + Marca: Pierre Alexander** feito no Bling.
Tag e marca ficam em `/painel/produtos` (tabela `site_produtos_cfg`). Marca
vazia = sem filtro de marca. Código: `lib/produtos.ts` (`carregarElegiveis`).

A coluna `marca` é a fonte da marca porque a tag `Marca:...` de vários
produtos traz o fabricante ("Avenca Industria Cosmetica Ltda") e não a marca.

## Comparação com o relatório do Bling (57 produtos, 14/09/2026)

| Situação | Qtd | Códigos |
| --- | --- | --- |
| Entram pela regra (tag + marca) | 50 | — |
| Entram pela curadoria (`db/site_produtos_curadoria.sql`, rodado em 14/09/2026) | 5 | 55060, 1592, 1593, 1594 (linha Radicaline) e 3005 (catálogo) |
| Escondidos pela curadoria por não estarem no filtro do Bling | 3 | 70401 (201923 no ERP), 28703, 28704 |
| **Ainda faltam** — não existem em nenhuma tabela do banco | 2 | 40433 e 40353 (Sabonete para Mãos Vert e Lavande 200ml) |

**Hoje o site mostra 55 dos 57 e nada além deles.** A diferença que resta é
**dado desatualizado no espelho**, não regra do site.

Os 4 produtos da linha Radicaline entraram sem foto (mostram o monograma
"Pierre"): não há packshot deles em `fontes/produtos` — as três imagens
"RADICALINE" da pasta são todas do Sérum Resveratrol 30g (código 1590).

## O que falta para bater 57

A tabela `ofc_pc_produtos` (tags, marca, descrição, mídia) foi sincronizada
pela última vez em **29/05/2026**; a `ofc_pierre_produto_bling_espelho` em
12/08/2026, mas ela não traz tags nem marca. Quem sincroniza é o **Syscomai**
(o site não tem credenciais do Bling; ver `docs/SYNC_IMAGENS_BLING.md`).

Pedir ao Syscomai: ressincronizar `ofc_pc_produtos` a partir do Bling
(incluindo `tags`, `marca`, `ativo`) para todos os produtos do agrupamento
Origem. Depois disso os 7 entram e os 3 saem sozinhos, sem mexer no site.

Depois da ressincronização, as linhas de `site_produtos` podem ficar como
estão: elas continuam valendo como curadoria (categoria de vitrine, ordem,
destaque) e os 3 escondidos continuam escondidos até alguém reexibi-los no
painel.
