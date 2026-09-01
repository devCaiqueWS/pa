// =============================================================================
// FORMULÁRIOS — TIPOS
// Estrutura orientada a configuração: cada formulário é uma DEFINIÇÃO (dados),
// nunca uma página escrita à mão. Renderização, validação, gravação, dashboard
// e exportação leem daqui, então adicionar /forms/3 é acrescentar uma definição.
// Este arquivo é isomórfico (serve ao cliente e ao servidor) — sem imports de
// banco, `next/headers` ou qualquer coisa exclusiva de servidor.
// =============================================================================

// Tipos de campo suportados pelo renderizador genérico.
export type TipoPergunta =
  | "unica" // um valor entre N opções (radio)
  | "multipla" // um ou mais valores entre N opções (checkbox)
  | "escala" // nota inteira dentro de uma faixa, com rótulo por nota
  | "texto"; // texto livre (textarea) com limite de caracteres

export type Opcao = {
  valor: string; // chave estável gravada no banco (nunca mude depois de publicado)
  rotulo: string; // texto exibido
  // Quando marcada, exige um campo de texto complementar ("Outro" → qual?).
  abreDetalhe?: boolean;
};

export type NivelEscala = {
  nota: number;
  rotulo: string;
};

export type Pergunta = {
  id: string; // chave estável no JSON de respostas
  ordem: number;
  titulo: string;
  ajuda?: string;
  // Perguntas com o mesmo `grupo` aparecem sob um único cabeçalho (ex.: as três
  // avaliações do formulário 2), mas continuam sendo perguntas independentes
  // para validação, dashboard e exportação.
  grupo?: string;
  tipo: TipoPergunta;
  obrigatoria: boolean;
  opcoes?: Opcao[];
  niveis?: NivelEscala[]; // tipo "escala"
  maxLength?: number; // tipo "texto" (e também o limite do campo de detalhe)
  placeholder?: string;
  rotuloDetalhe?: string; // rótulo do campo aberto por `abreDetalhe`
};

export type FormularioDef = {
  id: number; // numeração sequencial da rota /forms/[id]
  versao: number; // suba a versão quando as perguntas mudarem
  titulo: string;
  descricao: string; // texto introdutório exibido no topo
  ativo: boolean; // inativo => página informa que está encerrado, não grava
  criadoEm: string; // ISO (data de criação da definição)
  // Assunto curto usado em metadados/exportação.
  resumo: string;
  perguntas: Pergunta[];
};

// ---------------------------------------------------------------------------
// Respostas
// ---------------------------------------------------------------------------

// Formato do valor gravado por pergunta (o tipo vem da definição, não do banco).
export type ValorResposta = {
  valor?: string; // "unica"
  valores?: string[]; // "multipla"
  nota?: number; // "escala"
  texto?: string; // "texto"
  detalhe?: string; // complemento de "Outro"
};

export type MapaRespostas = Record<string, ValorResposta>;

export type Identificacao = {
  nome: string;
  email: string;
  telefone: string; // como digitado (com máscara) no cliente
};

// Uma resposta já persistida.
export type RespostaRegistro = {
  id: number;
  uid: string;
  formularioId: number;
  formularioVersao: number;
  nome: string;
  email: string;
  telefone: string; // normalizado (somente dígitos, com DDI 55)
  respostas: MapaRespostas;
  origem: string | null;
  status: string;
  enviadoEm: Date;
  criadoEm: Date;
  atualizadoEm: Date;
};

// Erros de validação: chave = "nome" | "email" | "telefone" | id da pergunta
// (ou `${id}__detalhe` para o campo complementar).
export type ErrosFormulario = Record<string, string>;
