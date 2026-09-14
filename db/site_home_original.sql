-- =============================================================================
-- DESIGN SYSTEM MAISON — insere o bloco "Faixa Original" na home já existente,
-- logo depois do bloco "História (45+ anos)" (ou na posição 6 se ele não existir).
--
-- Alternativa sem SQL: /painel/paginas → Home → "Adicionar bloco" → "Faixa Original".
-- ⚠️ Rode UMA vez (o INSERT não tem chave única — re-rodar duplica).
-- =============================================================================
SET @pid = (SELECT id FROM site_paginas WHERE slug = 'home' LIMIT 1);
SET @pos = IFNULL((SELECT ordem + 1 FROM site_blocos WHERE pagina_id = @pid AND tipo = 'historia' LIMIT 1), 6);
UPDATE site_blocos SET ordem = ordem + 1 WHERE pagina_id = @pid AND ordem >= @pos;
INSERT INTO site_blocos (pagina_id, tipo, nome, ordem, config, ativo) VALUES
(@pid, 'original', 'Faixa Original', @pos, '{"titulo":"","texto":"","botao_texto":"","botao_link":"","imagem_url":""}', 1);
