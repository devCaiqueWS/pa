-- =============================================================================
-- PÁGINA "SOBRE" — enriquece o conteúdo com quatro seções novas:
--   3. Texto      "Conhecimento nas fórmulas. Sensibilidade nas relações."
--   4. Valores    01 conhecer / 02 criar / 03 conectar
--   6. Timeline   "Uma história que segue em movimento." (marcos ILUSTRATIVOS)
--   8. Novidades  "Uma boa novidade sempre faz bem." (cadastro ainda sem backend)
-- e reposiciona os blocos que já existiam (Pilares e Faixa final).
--
-- ⚠️ A linha do tempo é ILUSTRATIVA: as datas 1981, 1990, 2005 e 2015 são uma
-- proposta, não a história oficial. O aviso e o rótulo "marco ilustrativo"
-- ficam visíveis na página justamente por isso — troque pelos fatos reais
-- antes de tirar o /preview-site do ar.
--
-- Pode rodar quantas vezes quiser: apaga e recria os blocos novos.
-- =============================================================================
SET @pid = (SELECT id FROM site_paginas WHERE slug = 'sobre' LIMIT 1);

-- Abre espaço para as seções novas.
UPDATE site_blocos SET ordem = 5 WHERE pagina_id = @pid AND tipo = 'colunas' AND nome = 'Pilares';
UPDATE site_blocos SET ordem = 7 WHERE pagina_id = @pid AND tipo = 'cta' AND nome = 'Faixa final';

-- Encerramento alinhado à narrativa da página.
UPDATE site_blocos
   SET config = '{"titulo":"A próxima história também pode ser sua.","texto":"","botao_texto":"Encontre a Pierre","botao_link":"/onde-comprar"}'
 WHERE pagina_id = @pid AND tipo = 'cta' AND nome = 'Faixa final';

-- Recria os blocos novos (idempotente).
DELETE FROM site_blocos WHERE pagina_id = @pid AND tipo IN ('valores', 'timeline', 'novidades');
DELETE FROM site_blocos WHERE pagina_id = @pid AND tipo = 'texto' AND nome = 'Conhecimento e sensibilidade';

INSERT INTO site_blocos (pagina_id, tipo, nome, ordem, config, ativo) VALUES
(@pid, 'texto', 'Conhecimento e sensibilidade', 3,
 '{"eyebrow":"Beleza que tem história","titulo":"Conhecimento nas fórmulas. Sensibilidade nas relações.","corpo":"A Pierre encontra inspiração na vida real: nas escolhas de todos os dias, nas conversas que aproximam e na vontade de experimentar algo novo.\\nÉ assim que imaginamos esta história sendo contada: com o olhar de quem entende de beleza e a atenção de quem sabe que, por trás de cada escolha, existe uma pessoa.","alinhamento":"esquerda"}', 1),

(@pid, 'valores', 'Conhecer, criar, conectar', 4,
 '{"qtd":"3","col1_rotulo":"Conhecer","col1_titulo":"Experiência que inspira","col1_texto":"Uma história que olha para o que aprendeu e mantém espaço para novas perguntas.","col2_rotulo":"Criar","col2_titulo":"Curiosidade que move","col2_texto":"Novas ideias para acompanhar os diferentes jeitos de viver e de se cuidar.","col3_rotulo":"Conectar","col3_titulo":"Beleza que aproxima","col3_texto":"Relações, encontros e pessoas que ajudam a escrever os próximos capítulos."}', 1),

(@pid, 'timeline', 'Linha do tempo (ilustrativa)', 6,
 '{"eyebrow":"Do primeiro capítulo ao agora","titulo":"Uma história que segue em movimento.","aviso":"Linha do tempo ilustrativa: as datas e os marcos abaixo são uma proposta para esta apresentação e serão substituídos pela história oficial da Pierre.","qtd":"5","col1_ano":"1981","col1_rotulo":"Marco ilustrativo","col1_titulo":"Uma ideia começa a ganhar forma","col1_texto":"Na história que imaginamos para esta apresentação, a Pierre nasce do encontro entre o conhecimento das fórmulas e a vontade de aproximar a beleza das pessoas.","col2_ano":"1990","col2_rotulo":"Marco ilustrativo","col2_titulo":"A beleza encontra novos caminhos","col2_texto":"O segundo capítulo simulado representa a ampliação das conversas e a chegada da marca a novas rotinas, com pessoas que compartilham descobertas e cuidado.","col3_ano":"2005","col3_rotulo":"Marco ilustrativo","col3_titulo":"Uma história feita de conexões","col3_texto":"Neste marco ilustrativo, a rede de consultoras ganha destaque como parte da relação entre a marca e quem escolhe seus produtos.","col4_ano":"2015","col4_rotulo":"Marco ilustrativo","col4_titulo":"Curiosidade para continuar criando","col4_texto":"A evolução do portfólio e novas possibilidades de cuidado entram em cena. Este capítulo será substituído pelos lançamentos e acontecimentos reais da Pierre.","col5_ano":"2026","col5_rotulo":"Marco ilustrativo","col5_titulo":"O próximo capítulo começa agora","col5_texto":"A linha do tempo chega ao presente com uma proposta de marca mais próxima: conhecimento, escolhas e novas conversas sobre beleza. Os acontecimentos reais serão confirmados pela Pierre."}', 1),

(@pid, 'novidades', 'Novidades por e-mail', 8,
 '{"eyebrow":"Continue por perto","titulo":"Uma boa novidade sempre faz bem.","texto":"Conteúdos, lançamentos e novas conversas sobre beleza. Receba o universo Pierre no seu e-mail.","placeholder":"Seu melhor e-mail","botao_texto":"Quero receber","aviso":"Cadastro de novidades disponível em breve."}', 1);
