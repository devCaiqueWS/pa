-- =============================================================================
-- REDESIGN DA HOME — insere o bloco "História (45+ anos)" na home já existente,
-- logo depois da "Faixa de marca" (destaque) e antes da vitrine de novidades.
--
-- Alternativa sem SQL: em /painel/paginas → Home → "Adicionar bloco" →
-- "História (45+ anos)" e arraste para a posição desejada.
--
-- ⚠️ Rode UMA vez (o INSERT não tem chave única — re-rodar duplica).
-- =============================================================================
SET @pid = (SELECT id FROM site_paginas WHERE slug = 'home' LIMIT 1);

-- Abre espaço: tudo a partir da ordem 5 desce uma posição.
UPDATE site_blocos SET ordem = ordem + 1 WHERE pagina_id = @pid AND ordem >= 5;

-- Campos vazios = textos institucionais padrão (os mesmos da página "Sobre").
-- Preencha "marcos" quando a marca fornecer a linha do tempo real (ano | texto).
INSERT INTO site_blocos (pagina_id, tipo, nome, ordem, config, ativo) VALUES
(@pid, 'historia', 'História (45+ anos)', 5, '{"titulo":"","corpo":"","marcos":""}', 1);
