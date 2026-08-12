-- =============================================================================
-- PRODUTOS DO SITE — camada de CURADORIA sobre o catálogo do ERP (Bling).
--
-- A ORIGEM dos produtos é o ERP: ofc_pierre_produto_bling_espelho (base) +
-- ofc_pc_produtos (imagem/categoria/descrição). Um produto entra no site quando
-- carrega a tag configurada (padrão "Agrupamento:Origem").
--
-- Estas tabelas NÃO duplicam o produto: guardam só a CURADORIA do site
-- (categoria-de-vitrine, destaque, ordem, visível, imagem caprichada),
-- referenciando o produto do ERP por bling_id.
-- =============================================================================

CREATE TABLE IF NOT EXISTS site_produtos (
  id                INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  bling_id          BIGINT UNSIGNED NOT NULL,             -- ref. ao ERP (espelho.produto_bling_id)
  slug              VARCHAR(191) NOT NULL DEFAULT '',      -- URL do produto no site (/p/<slug>)
  categoria_slug    VARCHAR(191) NOT NULL DEFAULT '',      -- categoria-de-vitrine do site
  subcategoria_slug VARCHAR(191) NOT NULL DEFAULT '',
  imagem            VARCHAR(600) NOT NULL DEFAULT '',      -- imagem curada (sobrepõe a do Bling)
  destaque          TINYINT(1) NOT NULL DEFAULT 0,         -- vitrine "mais vendidos"
  novo              TINYINT(1) NOT NULL DEFAULT 0,         -- vitrine "novidades"
  visivel           TINYINT(1) NOT NULL DEFAULT 1,         -- aparece no site?
  ordem             INT NOT NULL DEFAULT 0,
  atualizado_em     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_bling (bling_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Configuração (linha única id=1): qual(is) tag(s) marcam um produto como "do
-- site" e o mapa de categoria do ERP -> categoria do site. JSON.
CREATE TABLE IF NOT EXISTS site_produtos_cfg (
  id             INT UNSIGNED NOT NULL PRIMARY KEY,        -- sempre 1
  config         TEXT NULL,
  atualizado_em  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
