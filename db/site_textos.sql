-- =============================================================================
-- CMS: tabela de textos editáveis do site (rode uma vez no banco, ex. phpMyAdmin)
-- =============================================================================
CREATE TABLE IF NOT EXISTS site_textos (
  chave         VARCHAR(100) NOT NULL PRIMARY KEY,
  titulo        VARCHAR(190) NOT NULL,
  grupo         VARCHAR(60)  NOT NULL DEFAULT 'Geral',
  tipo          VARCHAR(10)  NOT NULL DEFAULT 'texto',
  valor         TEXT,
  atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Valores iniciais = textos que hoje estão fixos no código da home.
-- INSERT IGNORE: não sobrescreve se você já tiver editado.
INSERT IGNORE INTO site_textos (chave, titulo, grupo, tipo, valor) VALUES
('home_destaques_titulo',    'Vitrine "Mais vendidos" — título',    'Home', 'texto', 'Mais vendidos'),
('home_destaques_subtitulo', 'Vitrine "Mais vendidos" — subtítulo', 'Home', 'texto', 'Os favoritos que conquistaram o Brasil.'),
('home_marca_eyebrow',       'Faixa de marca — selo',               'Home', 'texto', 'Confiança diária'),
('home_marca_titulo',        'Faixa de marca — título',             'Home', 'texto', 'A Pierre começa no desodorante. Mas não termina nele.'),
('home_marca_texto',         'Faixa de marca — texto',              'Home', 'texto', 'O desodorante abriu caminho porque resolve uma necessidade real. A partir dessa confiança, a marca cresce para fragrâncias, cuidado facial, banho, casa e muito mais.'),
('home_novidades_titulo',    'Vitrine "Novidades" — título',        'Home', 'texto', 'Novidades & Lançamentos'),
('home_novidades_subtitulo', 'Vitrine "Novidades" — subtítulo',     'Home', 'texto', 'O que está chegando na Pierre.'),
('home_categorias_titulo',   'Categorias — título',                 'Home', 'texto', 'Explore por categoria'),
('home_categorias_subtitulo','Categorias — subtítulo',              'Home', 'texto', 'Escolha pelo momento, pelo cuidado ou pelo desejo.'),
('home_consultora_eyebrow',  'Faixa consultora — selo',             'Home', 'texto', 'Pierre Business'),
('home_consultora_titulo',   'Faixa consultora — título',           'Home', 'texto', 'Venda Pierre. Cresça com uma marca reconhecida.'),
('home_consultora_texto',    'Faixa consultora — texto',            'Home', 'texto', 'Treinamento, campanhas prontas, metas, níveis e acompanhamento. Aqui a Pierre compartilha o sucesso com você.');
