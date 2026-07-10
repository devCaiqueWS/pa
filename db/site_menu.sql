-- =============================================================================
-- MENU DE NAVEGAÇÃO — uma linha por item do menu do topo.
--   parent_id NULL  -> item principal;  parent_id = id -> submenu.
--   tipo: link | botao | busca
--
-- Só precisa CRIAR a tabela. O SEED (itens iniciais = menu atual) é feito pelo
-- script de seed, que só insere se a tabela estiver vazia. Sem itens, o site
-- usa o menu padrão (lib/menu.ts -> menuPadrao).
-- =============================================================================

CREATE TABLE IF NOT EXISTS site_menu (
  id             INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  label          VARCHAR(120) NOT NULL DEFAULT '',
  href           VARCHAR(255) NOT NULL DEFAULT '#',
  tipo           VARCHAR(10)  NOT NULL DEFAULT 'link',   -- link | botao | busca
  parent_id      INT UNSIGNED NULL,
  ordem          INT NOT NULL DEFAULT 0,
  ativo          TINYINT(1) NOT NULL DEFAULT 1,
  atualizado_em  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_parent_ordem (parent_id, ordem),
  CONSTRAINT fk_menu_parent FOREIGN KEY (parent_id) REFERENCES site_menu (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
