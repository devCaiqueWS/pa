-- =============================================================================
-- PÁGINA "ONDE COMPRAR" — troca as três colunas com link morto ("#") por
-- cartões de canal com destino REAL:
--   • Loja oficial  -> https://www.pierrecosmeticos.com.br
--   • Consultora    -> WhatsApp cadastrado em Configurações (faixa do topo)
-- e remove a faixa de chamada duplicada no fim da página.
--
-- O destino "whatsapp" é resolvido em tempo de renderização a partir de
-- site_config, então o número continua vivendo num lugar só.
--
-- Pode rodar quantas vezes quiser.
-- =============================================================================
SET @pid = (SELECT id FROM site_paginas WHERE slug = 'onde-comprar' LIMIT 1);

-- Topo: o subtítulo passa a anunciar os dois caminhos reais.
UPDATE site_blocos
   SET config = '{"eyebrow":"Onde comprar","titulo":"Onde comprar Pierre Alexander","subtitulo":"Compre na loja oficial ou fale com uma consultora pelo WhatsApp.","alinhamento":"centro"}'
 WHERE pagina_id = @pid AND tipo = 'hero' AND nome = 'Topo';

-- As colunas antigas (links "#") saem; entra o bloco de canais.
DELETE FROM site_blocos WHERE pagina_id = @pid AND tipo = 'colunas' AND nome = 'Canais';
DELETE FROM site_blocos WHERE pagina_id = @pid AND tipo = 'canais';

INSERT INTO site_blocos (pagina_id, tipo, nome, ordem, config, ativo) VALUES
(@pid, 'canais', 'Canais de compra', 2,
 '{"titulo":"Escolha como prefere comprar.","subtitulo":"A loja entrega praticidade. A consultora entrega proximidade. A Pierre entrega confiança.","qtd":"2","col1_rotulo":"Compra online","col1_titulo":"Loja oficial","col1_texto":"Para quem quer comprar direto e receber em casa, com o catálogo da marca.","col1_botao_texto":"Comprar na loja oficial","col1_link":"https://www.pierrecosmeticos.com.br","col1_botao_estilo":"secundario","col2_rotulo":"Atendimento pessoal","col2_titulo":"Consultora Pierre","col2_texto":"Atendimento próximo, indicação personalizada e acompanhamento pelo WhatsApp.","col2_botao_texto":"Falar no WhatsApp","col2_link":"whatsapp","col2_botao_estilo":"primario"}', 1);

-- Duas faixas de chamada seguidas viravam repetição: fica a da rede Pierre.
DELETE FROM site_blocos WHERE pagina_id = @pid AND tipo = 'cta' AND nome = 'Faixa final';
UPDATE site_blocos SET ordem = 3 WHERE pagina_id = @pid AND tipo = 'cta' AND nome = 'Rede Pierre';
