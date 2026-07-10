-- =============================================================================
-- HIERARQUIA E ORDEM DAS PÁGINAS
-- Adiciona duas colunas em site_paginas:
--   ordem      -> posição na lista (arrastar-e-soltar no painel)
--   parent_id  -> página-mãe (aninhar uma página sob outra); NULL = principal
-- FK com ON DELETE SET NULL: se a mãe é excluída, as filhas viram principais.
--
-- Rode UMA vez. (Se as colunas já existirem, dá erro de coluna duplicada — o
-- script de migração ignora esse caso.)
-- =============================================================================

ALTER TABLE site_paginas
  ADD COLUMN ordem INT NOT NULL DEFAULT 0,
  ADD COLUMN parent_id INT UNSIGNED NULL,
  ADD CONSTRAINT fk_pagina_parent FOREIGN KEY (parent_id) REFERENCES site_paginas (id) ON DELETE SET NULL;
