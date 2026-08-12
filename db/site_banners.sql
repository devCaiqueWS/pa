-- =============================================================================
-- BANNERS DO CARROSSEL DA HOME (gerenciáveis)
-- Tabela de linha única (id=1) que guarda a lista de slides em JSON: imagem (ou
-- vídeo), texto de apoio, título, subtítulo, dois botões e a ordem de exibição.
--
-- Só precisa CRIAR a tabela. Enquanto não houver a linha id=1, o site mostra os
-- banners padrão (BANNERS_PADRAO em lib/banners.ts = os dois slides que estavam
-- fixos no código). A primeira vez que salvar em /painel/banners, a linha é
-- criada automaticamente.
-- =============================================================================

CREATE TABLE IF NOT EXISTS site_banners (
  id             INT UNSIGNED NOT NULL PRIMARY KEY,   -- sempre 1 (singleton)
  config         TEXT NULL,                            -- JSON da lista de banners
  atualizado_em  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
