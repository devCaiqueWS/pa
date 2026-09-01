-- =============================================================================
-- FORMULÁRIOS DO SITE — RESPOSTAS
-- Uma única tabela atende todos os formulários (/forms/1, /forms/2, /forms/N):
-- a estrutura das perguntas vive em lib/forms/definicoes.ts e o conteúdo
-- respondido vai em `respostas` (JSON), chaveado pelo id da pergunta.
--
-- Rodar UMA VEZ no banco (MySQL 5.7+, Locaweb DBaaS):
--   mysql -h HOST -u USER -p BANCO < db/site_form_respostas.sql
--
-- Nada aqui guarda IP completo: veja `site_form_rate_limit` no fim do arquivo.
-- =============================================================================

CREATE TABLE IF NOT EXISTS site_form_respostas (
  id                 BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  -- Identificador público/estável da resposta (não expõe a sequência do banco).
  uid                CHAR(36)        NOT NULL,
  formulario_id      INT UNSIGNED    NOT NULL,
  formulario_versao  INT UNSIGNED    NOT NULL DEFAULT 1,

  -- Identificação de quem respondeu (obrigatória nos dois formulários).
  nome               VARCHAR(120)    NOT NULL,
  email              VARCHAR(190)    NOT NULL,
  -- Telefone NORMALIZADO: só dígitos, com DDI — ex.: 5511912345678.
  telefone           VARCHAR(20)     NOT NULL,

  -- Respostas de todas as perguntas: { "<id_pergunta>": { valor | valores |
  -- nota | texto, detalhe? } }. Os detalhamentos de "Outro" ficam em `detalhe`.
  respostas          JSON            NOT NULL,

  -- Página/origem de onde veio o envio (sem querystring, sem dado pessoal).
  origem             VARCHAR(255)        NULL,
  -- Ciclo de vida da resposta (uso futuro: triagem, follow-up, descarte).
  status             VARCHAR(20)     NOT NULL DEFAULT 'recebida',

  -- Momento do envio, em UTC (a exibição converte para America/Sao_Paulo).
  enviado_em         DATETIME        NOT NULL,
  criado_em          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP
                                     ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  UNIQUE KEY uq_site_form_respostas_uid (uid),
  -- Consulta padrão do dashboard: um formulário, mais recentes primeiro.
  KEY ix_site_form_respostas_form_data (formulario_id, enviado_em),
  -- Busca por e-mail e trava anti-duplo-envio (mesmo e-mail em segundos).
  KEY ix_site_form_respostas_form_email (formulario_id, email, enviado_em)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =============================================================================
-- RATE LIMIT (anti-spam / anti-abuso)
-- Contador por janela de tempo. A chave NÃO é o IP: é um HMAC-SHA256 truncado
-- de (IP + formulário) com o SESSION_SECRET — serve para limitar o mesmo
-- remetente sem que o banco guarde um dado pessoal identificável (LGPD, art. 6
-- princípio da necessidade). Sem o segredo, a chave não volta a ser um IP.
-- =============================================================================

CREATE TABLE IF NOT EXISTS site_form_rate_limit (
  chave          CHAR(32)     NOT NULL,   -- HMAC truncado (hex)
  janela_inicio  DATETIME     NOT NULL,   -- início da janela corrente (UTC)
  contagem       INT UNSIGNED NOT NULL DEFAULT 0,
  atualizado_em  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
                              ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (chave),
  KEY ix_site_form_rate_limit_janela (janela_inicio)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
