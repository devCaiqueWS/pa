# Produtos do site × Bling — regra de seleção e estado do espelho

Atualizado em 14/09/2026.

## Regra de seleção (o que entra no site)

O site **não fala com o Bling**: lê o espelho no MySQL. Um produto entra quando:

1. `ofc_pc_produtos.ativo = 1` e tem a tag configurada no painel (padrão
   `Agrupamento:Origem`, coluna JSON `tags`); **e**
2. é da marca configurada no painel (padrão `Pierre Alexander`), lida da
   coluna `ofc_pc_produtos.marca` ou da tag `Marca:<nome>`; **e**
3. existe na tabela `ofc_pierre_produto_bling_espelho` (situação ativa).

É o mesmo filtro **Tags: Origem + Marca: Pierre Alexander** feito no Bling.
Tag e marca ficam em `/painel/produtos` (tabela `site_produtos_cfg`). Marca
vazia = sem filtro de marca. Código: `lib/produtos.ts` (`carregarElegiveis`).

A coluna `marca` é a fonte da marca porque a tag `Marca:...` de vários
produtos traz o fabricante ("Avenca Industria Cosmetica Ltda") e não a marca.

## Comparação com o relatório do Bling (57 produtos, 14/09/2026)

| Situação | Qtd | Códigos |
| --- | --- | --- |
| Passam no site | 50 | — |
| Não existem em `ofc_pc_produtos` (tabela parada em 29/05/2026) | 7 | 40433, 40353 (não existem em tabela nenhuma); 55060, 1594, 1593, 1592, 3005 (existem só no espelho, sem tags) |
| Passam no site mas não estão nos 57 do Bling | 3 | 201923, 28703, 28704 |

Ou seja: a diferença é **dado desatualizado no espelho**, não regra do site.

## O que falta para bater 57

A tabela `ofc_pc_produtos` (tags, marca, descrição, mídia) foi sincronizada
pela última vez em **29/05/2026**; a `ofc_pierre_produto_bling_espelho` em
12/08/2026, mas ela não traz tags nem marca. Quem sincroniza é o **Syscomai**
(o site não tem credenciais do Bling; ver `docs/SYNC_IMAGENS_BLING.md`).

Pedir ao Syscomai: ressincronizar `ofc_pc_produtos` a partir do Bling
(incluindo `tags`, `marca`, `ativo`) para todos os produtos do agrupamento
Origem. Depois disso os 7 entram e os 3 saem sozinhos, sem mexer no site.

Enquanto isso, os 3 produtos extras podem ser ocultados em `/painel/produtos`
(campo "visível"). Os 7 faltantes não têm como entrar sem a ressincronização.
