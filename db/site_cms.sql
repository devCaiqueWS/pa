-- =============================================================================
-- CMS DE BLOCOS: páginas montadas por blocos configuráveis.
-- Rode uma vez no banco (ex.: phpMyAdmin da Locaweb).
--
--   site_paginas -> uma página do site (slug, título, status).
--   site_blocos  -> os "pedaços montáveis" de cada página, em ordem.
--                   A configuração de cada bloco fica em JSON na coluna `config`
--                   (texto, imagem, botão, colunas...), o que dá flexibilidade
--                   sem precisar de uma tabela por tipo de bloco.
-- =============================================================================

CREATE TABLE IF NOT EXISTS site_paginas (
  id             INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  slug           VARCHAR(150) NOT NULL,
  titulo         VARCHAR(190) NOT NULL,
  status         VARCHAR(12)  NOT NULL DEFAULT 'rascunho',   -- rascunho | publicado
  seo_titulo     VARCHAR(190) NULL,
  seo_descricao  VARCHAR(300) NULL,
  criado_em      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS site_blocos (
  id             INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  pagina_id      INT UNSIGNED NOT NULL,
  tipo           VARCHAR(30)  NOT NULL,                        -- hero | texto | cta | colunas | produtos
  nome           VARCHAR(120) NOT NULL DEFAULT '',             -- rótulo que o editor dá à área
  ordem          INT NOT NULL DEFAULT 0,
  config         TEXT NULL,                                    -- JSON com os campos do bloco
  ativo          TINYINT(1) NOT NULL DEFAULT 1,
  atualizado_em  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_pagina_ordem (pagina_id, ordem),
  CONSTRAINT fk_bloco_pagina FOREIGN KEY (pagina_id)
    REFERENCES site_paginas (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------------------------------
-- Página de exemplo, pra você já ver a fundação funcionando em /pagina/exemplo.
-- INSERT IGNORE: não duplica se você rodar o script de novo.
-- -----------------------------------------------------------------------------
INSERT IGNORE INTO site_paginas (id, slug, titulo, status, seo_titulo, seo_descricao)
VALUES (1, 'exemplo', 'Página de exemplo', 'publicado',
        'Pierre Alexander', 'Página de demonstração do CMS de blocos.');

INSERT IGNORE INTO site_blocos (pagina_id, tipo, nome, ordem, config, ativo) VALUES
(1, 'hero', 'Banner de topo', 1,
 '{"eyebrow":"Pierre Alexander","titulo":"Beleza que começa na confiança","subtitulo":"Fragrâncias, cuidado e bem-estar para o seu dia a dia.","imagem_url":"","botao_texto":"Conheça os produtos","botao_link":"#produtos","alinhamento":"centro"}', 1),
(1, 'texto', 'Introdução', 2,
 '{"titulo":"Nossa proposta","corpo":"Este é um bloco de texto de exemplo. Edite tudo pelo painel, em Páginas do site.","alinhamento":"centro"}', 1),
(1, 'cta', 'Chamada consultora', 3,
 '{"titulo":"Seja um(a) consultor(a) Pierre","texto":"Cresça com uma marca reconhecida. Treinamento, campanhas e acompanhamento.","botao_texto":"Quero ser consultor(a)","botao_link":"#"}', 1);
