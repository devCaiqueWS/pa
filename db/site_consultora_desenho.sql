-- =============================================================================
-- PÁGINA "SEJA CONSULTORA" — desenho das três listas.
-- As três seções usavam o mesmo bloco de colunas e ficavam idênticas e cruas.
-- Cada uma passa a ser lida pelo que ela é:
--   • Como funciona          -> passos numerados (é um percurso, em ordem)
--   • Universidade Pierre    -> cartões (é um catálogo de módulos)
--   • Evolução e conquistas  -> níveis (é uma escada; a barra de ouro cresce)
-- Ganham também um subtítulo, para a seção não começar seca no título.
--
-- Pode rodar quantas vezes quiser.
-- =============================================================================
SET @pid = (SELECT id FROM site_paginas WHERE slug = 'consultora' LIMIT 1);

UPDATE site_blocos
   SET config = JSON_SET(config,
         '$.variante', 'passos',
         '$.subtitulo', 'Do primeiro contato ao primeiro pedido, com uma executiva ao lado em cada passo.')
 WHERE pagina_id = @pid AND tipo = 'colunas' AND nome = 'Como funciona';

UPDATE site_blocos
   SET config = JSON_SET(config,
         '$.variante', 'cards',
         '$.subtitulo', 'Conteúdo curto e prático para vender desde a primeira semana.')
 WHERE pagina_id = @pid AND tipo = 'colunas' AND nome = 'Universidade Pierre';

UPDATE site_blocos
   SET config = JSON_SET(config,
         '$.variante', 'niveis',
         '$.subtitulo', 'Cada nível reconhece o que você construiu — e abre o próximo degrau.')
 WHERE pagina_id = @pid AND tipo = 'colunas' AND nome = 'Conquistas';
