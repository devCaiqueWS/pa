-- =============================================================================
-- HOME COMO PÁGINA DE BLOCOS
-- Cria a página com slug "home" e os blocos que reproduzem a home atual
-- (carrossel, atalhos, vitrines de produto, faixa de marca, coleções,
-- faixa consultora e newsletter). Depois disso, a "/" passa a ser editável
-- pelo painel em /painel/paginas.
--
-- ⚠️ Rode UMA vez. Os INSERT de blocos não têm chave única — re-rodar duplica.
--    O jeito seguro é o script db seed (que só cria se a home ainda não existir).
-- =============================================================================

INSERT IGNORE INTO site_paginas (slug, titulo, status, seo_titulo, seo_descricao)
VALUES ('home', 'Home', 'publicado',
        'Pierre Alexander — Beleza que começa na confiança',
        'Desodorantes, fragrâncias e cuidado. A tradição Pierre Alexander.');

-- Os blocos abaixo assumem a home recém-criada (@pid).
SET @pid = (SELECT id FROM site_paginas WHERE slug = 'home' LIMIT 1);

INSERT INTO site_blocos (pagina_id, tipo, nome, ordem, config, ativo) VALUES
(@pid, 'carrossel', 'Carrossel de topo', 1, '{}', 1),
(@pid, 'atalhos', 'Atalhos de categoria', 2, '{}', 1),
(@pid, 'vitrine', 'Mais vendidos', 3,
 '{"titulo":"Mais vendidos","subtitulo":"Os favoritos que conquistaram o Brasil.","fonte":"destaques","ver_todos_link":"/c/desodorantes"}', 1),
(@pid, 'destaque', 'Faixa de marca', 4,
 '{"eyebrow":"Confiança diária","titulo":"A Pierre começa no desodorante. Mas não termina nele.","corpo":"O desodorante abriu caminho porque resolve uma necessidade real. A partir dessa confiança, a marca cresce para fragrâncias, cuidado facial, banho, casa e muito mais.","imagem_url":"/assets/img/desodorantes-varios.jpg","imagem_lado":"esquerda","botao1_texto":"Conhecer a linha","botao1_link":"/c/desodorantes"}', 1),
(@pid, 'vitrine', 'Novidades', 5,
 '{"titulo":"Novidades & Lançamentos","subtitulo":"O que está chegando na Pierre.","fonte":"novos","ver_todos_link":"/c/cuidado-facial"}', 1),
(@pid, 'colecoes', 'Explore por categoria', 6,
 '{"titulo":"Explore por categoria","subtitulo":"Escolha pelo momento, pelo cuidado ou pelo desejo."}', 1),
(@pid, 'cta', 'Faixa consultora', 7,
 '{"titulo":"Venda Pierre. Cresça com uma marca reconhecida.","texto":"Treinamento, campanhas prontas, metas, níveis e acompanhamento. Aqui a Pierre compartilha o sucesso com você.","botao_texto":"Quero ser consultora","botao_link":"/consultora"}', 1),
(@pid, 'newsletter', 'Newsletter', 8, '{}', 1);
