-- =============================================================================
-- CATEGORIAS DO CATÁLOGO (gerenciáveis)
-- Tabela de linha única (id=1) que guarda a lista de categorias em JSON:
-- nome, slug, frase (tagline), imagem de capa e subcategorias.
--
-- Só precisa CRIAR a tabela. Enquanto não houver a linha id=1, o site usa as
-- categorias padrão (lib/catalog.ts). A primeira vez que salvar em
-- /painel/categorias, a linha é criada automaticamente.
-- =============================================================================

CREATE TABLE IF NOT EXISTS site_categorias (
  id             INT UNSIGNED NOT NULL PRIMARY KEY,   -- sempre 1 (singleton)
  config         TEXT NULL,                            -- JSON da lista de categorias
  atualizado_em  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
