-- =============================================================================
-- BOTÕES E LINKS COM DESTINO REAL
--
-- 1) Página "Seja consultora": os botões apontavam para a própria página
--    (/consultora) e o texto prometia um formulário que não existe. Agora
--    levam ao WhatsApp da marca, com a mensagem já escrita. As seções de
--    treinamentos e conquistas ganham âncora, para os links do rodapé
--    (#universidade, #conquistas) funcionarem.
-- 2) Rodapé: sai o que não tinha destino (Sustentabilidade, Perguntas
--    frequentes, e o "Fale conosco"/"WhatsApp" que caíam em /onde-comprar) e
--    entra o WhatsApp de verdade e a loja oficial (com o nome certo).
--
-- O destino "whatsapp[:mensagem]" é resolvido em tempo de renderização a
-- partir de site_config, então o número continua num lugar só.
-- Pode rodar quantas vezes quiser.
-- =============================================================================
SET @pid = (SELECT id FROM site_paginas WHERE slug = 'consultora' LIMIT 1);

-- Destaque: cadastrar-se é falar com a marca; treinamentos vai para a seção.
UPDATE site_blocos
   SET config = '{"eyebrow":"Pierre Business","titulo":"Você não começa do zero. Começa com Pierre.","corpo":"Ser consultora Pierre Alexander é vender produtos conhecidos, com recompra, campanha, conteúdo e orientação de executiva.\\nMais que vender: crescer com uma marca que as pessoas já confiam. Treinamento, campanhas, evolução e reconhecimento esperam por você.","imagem_url":"/assets/img/consultoras.jpg","imagem_lado":"direita","botao1_texto":"Falar no WhatsApp","botao1_link":"whatsapp:Olá! Quero ser consultora Pierre Alexander.","botao2_texto":"Ver treinamentos","botao2_link":"#universidade"}'
 WHERE pagina_id = @pid AND tipo = 'destaque' AND nome = 'Comece com Pierre';

-- Âncoras para os links do rodapé.
UPDATE site_blocos
   SET config = JSON_SET(config, '$.ancora', 'universidade')
 WHERE pagina_id = @pid AND tipo = 'colunas' AND nome = 'Universidade Pierre';

UPDATE site_blocos
   SET config = JSON_SET(config, '$.ancora', 'conquistas')
 WHERE pagina_id = @pid AND tipo = 'colunas' AND nome = 'Conquistas';

-- Chamada final: sem formulário e sem prometer prazo que ninguém garantiu.
UPDATE site_blocos
   SET config = '{"titulo":"A próxima consultora Pierre pode ser você.","texto":"Chame a Pierre no WhatsApp: uma executiva orienta o primeiro passo, do cadastro ao primeiro pedido.","botao_texto":"Falar no WhatsApp","botao_link":"whatsapp:Olá! Quero ser consultora Pierre Alexander."}'
 WHERE pagina_id = @pid AND tipo = 'cta' AND nome = 'Cadastro';

-- Duas faixas de chamada seguidas viravam repetição.
DELETE FROM site_blocos WHERE pagina_id = @pid AND tipo = 'cta' AND nome = 'Faixa final';

-- --- Rodapé: todo link leva a algum lugar -------------------------------------
UPDATE site_footer
   SET config = '{"logoUrl":"/assets/img/logo-pierre-white.png","marcaTexto":"Marca brasileira com charme francês: perfumaria, cuidado facial, corpo, banho e casa. Sofisticação e confiança de geração em geração.","sacTexto":"Atendimento Pierre · Seg a sex, 8h às 18h","colunas":[{"titulo":"Produtos","links":[{"label":"Perfumaria","href":"/c/perfumaria"},{"label":"Cuidado Facial","href":"/c/cuidado-facial"},{"label":"Corpo & Banho","href":"/c/corpo-banho"},{"label":"Desodorantes","href":"/c/desodorantes"},{"label":"Cabelos","href":"/c/cabelos"},{"label":"Casa","href":"/c/casa"},{"label":"Kits & Presentes","href":"/c/kits"}]},{"titulo":"A Marca","links":[{"label":"Sobre a Pierre","href":"/sobre"},{"label":"Nossa história","href":"/sobre#timeline"},{"label":"Onde comprar","href":"/onde-comprar"}]},{"titulo":"Consultoras","links":[{"label":"Seja consultora","href":"/consultora"},{"label":"Universidade Pierre","href":"/consultora#universidade"},{"label":"Conquistas","href":"/consultora#conquistas"}]},{"titulo":"Atendimento","links":[{"label":"Fale no WhatsApp","href":"https://api.whatsapp.com/send/?phone=5511938101888&text=Estou+acessando+o+site+Pierre+Alexander+e+preciso+de+atendimento.+Poderia+me+ajudar%3F&type=phone_number&app_absent=0"},{"label":"Loja oficial","href":"https://www.pierrecosmeticos.com.br/"},{"label":"Quero ser consultora","href":"/consultora"}]}],"rodapeTexto":"Pierre Alexander ® {ano} - Todos os direitos reservados.","social":[{"label":"Instagram","href":"https://www.instagram.com/pierrealexander_oficial/"},{"label":"Facebook","href":"https://www.facebook.com/PierreAlexanderOficial/"},{"label":"YouTube","href":"https://www.youtube.com/@PierreAlexanderOficial"}]}'
 WHERE id = 1;
