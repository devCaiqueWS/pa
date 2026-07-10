-- =============================================================================
-- CONFIG DO CABEÇALHO (logo do topo, favicon e frases da faixa do topo)
-- Tabela de linha única (id=1) com a configuração em JSON.
-- (O menu de navegação fica na tabela própria site_menu.)
--
-- Só precisa CRIAR a tabela. Enquanto não houver a linha id=1, o site usa o
-- cabeçalho padrão (lib/site-config.ts -> padraoSiteConfig). A primeira vez que
-- você salvar em /painel/cabecalho, a linha é criada automaticamente.
-- =============================================================================

CREATE TABLE IF NOT EXISTS site_config (
  id             INT UNSIGNED NOT NULL PRIMARY KEY,   -- sempre 1 (singleton)
  config         TEXT NULL,                            -- JSON: logo, favicon, menu
  atualizado_em  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
