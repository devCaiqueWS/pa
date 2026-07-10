-- =============================================================================
-- RODAPÉ CONFIGURÁVEL
-- Tabela de linha única (id=1) que guarda a configuração do rodapé em JSON:
-- texto da marca, SAC, colunas de links, texto de rodapé e redes sociais.
--
-- Só precisa CRIAR a tabela. Enquanto não houver a linha id=1, o site usa o
-- rodapé padrão (lib/footer.ts -> PADRAO); a primeira vez que você salvar em
-- /painel/rodape, a linha é criada automaticamente.
-- =============================================================================

CREATE TABLE IF NOT EXISTS site_footer (
  id             INT UNSIGNED NOT NULL PRIMARY KEY,   -- sempre 1 (singleton)
  config         TEXT NULL,                            -- JSON da configuração
  atualizado_em  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
