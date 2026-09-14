-- =============================================================================
-- CURADORIA DE PRODUTOS — alinha a lista do site com o filtro do Bling
-- ("Tags: Origem" + "Marca: Pierre Alexander", 57 produtos em 14/09/2026).
--
-- Por que é preciso: a tabela de tags/marca (ofc_pc_produtos) está parada em
-- 29/05/2026. Os produtos abaixo já existem no espelho novo
-- (ofc_pierre_produto_bling_espelho, 12/08/2026), mas sem tag — então a regra
-- automática não os pega. A linha em site_produtos os inclui (visivel = 1) e
-- esconde (visivel = 0) o que a regra traz a mais.
--
-- Quando o ERP for ressincronizado, estas linhas podem ficar: elas continuam
-- valendo como curadoria (categoria, ordem, destaque). Tudo aqui é editável em
-- /painel/produtos. Rodar quantas vezes quiser (ON DUPLICATE KEY UPDATE).
-- =============================================================================

-- --- Linha Radicaline (cuidado facial) — entram --------------------------------
INSERT INTO site_produtos (bling_id, slug, categoria_slug, subcategoria_slug, imagem, destaque, novo, visivel, ordem)
SELECT produto_bling_id, 'sabonete-facial-radicaline-120ml', 'cuidado-facial', 'radicaline', '', 0, 1, 1, 1
  FROM ofc_pierre_produto_bling_espelho WHERE codigo = '55060'
ON DUPLICATE KEY UPDATE slug = VALUES(slug), categoria_slug = VALUES(categoria_slug),
  subcategoria_slug = VALUES(subcategoria_slug), novo = VALUES(novo), visivel = VALUES(visivel), ordem = VALUES(ordem);

INSERT INTO site_produtos (bling_id, slug, categoria_slug, subcategoria_slug, imagem, destaque, novo, visivel, ordem)
SELECT produto_bling_id, 'locao-tonica-radicaline-120ml', 'cuidado-facial', 'radicaline', '', 0, 1, 1, 2
  FROM ofc_pierre_produto_bling_espelho WHERE codigo = '1592'
ON DUPLICATE KEY UPDATE slug = VALUES(slug), categoria_slug = VALUES(categoria_slug),
  subcategoria_slug = VALUES(subcategoria_slug), novo = VALUES(novo), visivel = VALUES(visivel), ordem = VALUES(ordem);

INSERT INTO site_produtos (bling_id, slug, categoria_slug, subcategoria_slug, imagem, destaque, novo, visivel, ordem)
SELECT produto_bling_id, 'serum-facial-radicaline-30ml', 'cuidado-facial', 'radicaline', '', 0, 1, 1, 3
  FROM ofc_pierre_produto_bling_espelho WHERE codigo = '1593'
ON DUPLICATE KEY UPDATE slug = VALUES(slug), categoria_slug = VALUES(categoria_slug),
  subcategoria_slug = VALUES(subcategoria_slug), novo = VALUES(novo), visivel = VALUES(visivel), ordem = VALUES(ordem);

INSERT INTO site_produtos (bling_id, slug, categoria_slug, subcategoria_slug, imagem, destaque, novo, visivel, ordem)
SELECT produto_bling_id, 'creme-facial-radicaline-30g', 'cuidado-facial', 'radicaline', '', 0, 1, 1, 4
  FROM ofc_pierre_produto_bling_espelho WHERE codigo = '1594'
ON DUPLICATE KEY UPDATE slug = VALUES(slug), categoria_slug = VALUES(categoria_slug),
  subcategoria_slug = VALUES(subcategoria_slug), novo = VALUES(novo), visivel = VALUES(visivel), ordem = VALUES(ordem);

-- --- Catálogo vigente (está no filtro do Bling) --------------------------------
-- Se não quiser catálogo na vitrine, basta marcar "visível" = não no painel.
INSERT INTO site_produtos (bling_id, slug, categoria_slug, subcategoria_slug, imagem, destaque, novo, visivel, ordem)
SELECT produto_bling_id, 'catalogo-vigente', 'kits', '', '', 0, 0, 1, 90
  FROM ofc_pierre_produto_bling_espelho WHERE codigo = '3005'
ON DUPLICATE KEY UPDATE slug = VALUES(slug), categoria_slug = VALUES(categoria_slug), visivel = VALUES(visivel), ordem = VALUES(ordem);

-- --- Fora do filtro do Bling — saem do site -----------------------------------
INSERT INTO site_produtos (bling_id, slug, categoria_slug, subcategoria_slug, imagem, destaque, novo, visivel, ordem)
-- No espelho este item tem código 70401 (no ofc_pc_produtos aparece como 201923).
SELECT produto_bling_id, 'sabonete-barra-banho-aromatico-lavande', 'corpo-banho', 'sabonetes', '', 0, 0, 0, 0
  FROM ofc_pierre_produto_bling_espelho WHERE codigo = '70401'
ON DUPLICATE KEY UPDATE visivel = VALUES(visivel);

INSERT INTO site_produtos (bling_id, slug, categoria_slug, subcategoria_slug, imagem, destaque, novo, visivel, ordem)
SELECT produto_bling_id, 'body-spray-iluminador-flash-rubi', 'perfumaria', '', '', 0, 0, 0, 0
  FROM ofc_pierre_produto_bling_espelho WHERE codigo = '28703'
ON DUPLICATE KEY UPDATE visivel = VALUES(visivel);

INSERT INTO site_produtos (bling_id, slug, categoria_slug, subcategoria_slug, imagem, destaque, novo, visivel, ordem)
SELECT produto_bling_id, 'body-spray-iluminador-gold-flash', 'perfumaria', '', '', 0, 0, 0, 0
  FROM ofc_pierre_produto_bling_espelho WHERE codigo = '28704'
ON DUPLICATE KEY UPDATE visivel = VALUES(visivel);

-- Ainda faltam (não existem em NENHUMA tabela do banco; dependem da
-- ressincronização do ERP pelo Syscomai — ver docs/PRODUTOS_BLING.md):
--   40433 Sabonete para Mãos Vert 200ml
--   40353 Sabonete para Mãos Lavande 200ml
