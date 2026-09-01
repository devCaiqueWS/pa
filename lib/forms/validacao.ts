// =============================================================================
// FORMULÁRIOS — VALIDAÇÃO E NORMALIZAÇÃO (isomórfica)
// O MESMO módulo roda no cliente (feedback imediato) e no servidor (fonte da
// verdade). O servidor NUNCA confia no que chega do navegador: revalida tudo
// aqui antes de gravar. Sem imports de banco ou de `next/*`.
// =============================================================================
import type {
  ErrosFormulario,
  FormularioDef,
  Identificacao,
  MapaRespostas,
  Pergunta,
  ValorResposta,
} from "./tipos";
import { perguntasOrdenadas } from "./definicoes";

export const LIMITE_NOME = 120;
export const LIMITE_EMAIL = 190;
export const LIMITE_DETALHE = 300;

// ---------------------------------------------------------------------------
// Sanitização
// ---------------------------------------------------------------------------

// Remove caracteres de controle (inclusive os que quebram planilha/CSV),
// normaliza espaços e corta no limite. Não "escapa" HTML: a saída é sempre
// renderizada como texto por React e escrita como texto no XLSX — escapar aqui
// só sujaria o dado. O que importa é impedir controle/injeção de fórmula.
// Faixa de caracteres de controle ASCII (montada por código para não
// carregar bytes invisíveis no fonte).
const CONTROLES = new RegExp("[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]", "g");

export function limpar(v: unknown, max: number): string {
  return String(v ?? "")
    // Controles ASCII (quebram planilha/CSV e poluem o dado) fora.
    .replace(CONTROLES, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\r\n?/g, "\n")
    .trim()
    .slice(0, max);
}

// ---------------------------------------------------------------------------
// Telefone brasileiro
// ---------------------------------------------------------------------------

// Só os dígitos, já sem o DDI 55 quando vier digitado.
export function digitosTelefone(v: string): string {
  let d = String(v ?? "").replace(/\D/g, "");
  if (d.length > 11 && d.startsWith("55")) d = d.slice(2);
  return d.slice(0, 11);
}

// Máscara progressiva usada no input: (11) 91234-5678 / (11) 1234-5678.
export function mascararTelefone(v: string): string {
  const d = digitosTelefone(v);
  if (d.length <= 2) return d.length ? `(${d}` : "";
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

// Forma gravada no banco: E.164 sem o "+" (55 + DDD + número). Guardar
// normalizado evita duplicidade e permite buscar por qualquer formatação.
export function normalizarTelefone(v: string): string | null {
  const d = digitosTelefone(v);
  if (d.length !== 10 && d.length !== 11) return null;
  const ddd = Number(d.slice(0, 2));
  if (ddd < 11 || ddd > 99) return null;
  // Celular (11 dígitos) sempre começa com 9; fixo (10) começa de 2 a 5.
  if (d.length === 11 && d[2] !== "9") return null;
  if (d.length === 10 && !/[2-5]/.test(d[2])) return null;
  return `55${d}`;
}

// Volta o normalizado para exibição no painel.
export function exibirTelefone(normalizado: string): string {
  return mascararTelefone(normalizado);
}

// ---------------------------------------------------------------------------
// Identificação
// ---------------------------------------------------------------------------

const RE_NOME = /^[A-Za-zÀ-ÖØ-öø-ÿ'’.\- ]+$/;
// Simples e permissiva o suficiente para e-mails reais, restritiva o bastante
// para pegar erro de digitação. A validação definitiva é o e-mail chegar.
const RE_EMAIL = /^[^\s@,;:<>()[\]\\"]+@[A-Za-z0-9]([A-Za-z0-9-]*[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]*[A-Za-z0-9])?)+$/;

export function validarNome(v: string): string | null {
  const nome = limpar(v, LIMITE_NOME);
  if (!nome) return "Informe seu nome completo.";
  if (nome.length < 5) return "Nome muito curto — informe o nome completo.";
  if (!RE_NOME.test(nome)) return "Use apenas letras, espaços, hífen e apóstrofo.";
  const partes = nome.split(" ").filter((p) => p.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ]/g, "").length >= 2);
  if (partes.length < 2) return "Informe nome e sobrenome.";
  return null;
}

export function validarEmail(v: string): string | null {
  const email = limpar(v, LIMITE_EMAIL).toLowerCase();
  if (!email) return "Informe seu e-mail.";
  if (!RE_EMAIL.test(email)) return "E-mail inválido. Exemplo: nome@empresa.com.br";
  return null;
}

export function validarTelefone(v: string): string | null {
  const d = digitosTelefone(v);
  if (!d) return "Informe seu telefone com DDD.";
  if (d.length < 10) return "Telefone incompleto — informe DDD e número.";
  if (!normalizarTelefone(v)) return "Telefone inválido. Exemplo: (11) 91234-5678";
  return null;
}

// ---------------------------------------------------------------------------
// Respostas
// ---------------------------------------------------------------------------

// Valida UMA pergunta. Devolve { erros } por chave (id e id__detalhe) e o valor
// já normalizado para gravação (só quando não há erro).
function validarPergunta(
  p: Pergunta,
  bruto: ValorResposta | undefined
): { erros: ErrosFormulario; valor?: ValorResposta } {
  const erros: ErrosFormulario = {};
  const r = bruto ?? {};
  const chaveDetalhe = `${p.id}__detalhe`;
  const maxDetalhe = p.maxLength ?? LIMITE_DETALHE;

  const validos = new Set((p.opcoes ?? []).map((o) => o.valor));
  const abreDetalhe = (valor: string) =>
    !!p.opcoes?.find((o) => o.valor === valor)?.abreDetalhe;

  if (p.tipo === "unica") {
    const valor = limpar(r.valor, 60);
    if (!valor) {
      if (p.obrigatoria) erros[p.id] = "Selecione uma opção.";
      return { erros, valor: p.obrigatoria ? undefined : {} };
    }
    if (!validos.has(valor)) {
      erros[p.id] = "Selecione uma opção válida.";
      return { erros };
    }
    const out: ValorResposta = { valor };
    if (abreDetalhe(valor)) {
      const detalhe = limpar(r.detalhe, maxDetalhe);
      if (!detalhe) erros[chaveDetalhe] = "Descreva o motivo para concluir.";
      else out.detalhe = detalhe;
    }
    return { erros, valor: out };
  }

  if (p.tipo === "multipla") {
    const brutos = Array.isArray(r.valores) ? r.valores : [];
    const valores = Array.from(
      new Set(brutos.map((v) => limpar(v, 60)).filter((v) => validos.has(v)))
    );
    if (valores.length === 0) {
      if (p.obrigatoria) erros[p.id] = "Selecione pelo menos uma opção.";
      return { erros, valor: p.obrigatoria ? undefined : {} };
    }
    const out: ValorResposta = { valores };
    if (valores.some(abreDetalhe)) {
      const detalhe = limpar(r.detalhe, maxDetalhe);
      if (!detalhe) erros[chaveDetalhe] = "Descreva a opção “Outro” para concluir.";
      else out.detalhe = detalhe;
    }
    return { erros, valor: out };
  }

  if (p.tipo === "escala") {
    const permitidas = new Set((p.niveis ?? []).map((n) => n.nota));
    const nota = Number(r.nota);
    if (!Number.isFinite(nota) || !permitidas.has(nota)) {
      if (p.obrigatoria) erros[p.id] = "Escolha uma nota.";
      return { erros, valor: p.obrigatoria ? undefined : {} };
    }
    return { erros, valor: { nota } };
  }

  // texto
  const max = p.maxLength ?? 1000;
  const texto = limpar(r.texto, max);
  if (!texto && p.obrigatoria) {
    erros[p.id] = "Este campo é obrigatório.";
    return { erros };
  }
  return { erros, valor: texto ? { texto } : {} };
}

export type ResultadoValidacao = {
  ok: boolean;
  erros: ErrosFormulario;
  // Preenchido apenas quando ok === true.
  identificacao?: { nome: string; email: string; telefone: string };
  respostas?: MapaRespostas;
};

// Validação completa (identificação + todas as perguntas), em ordem de
// exibição — a primeira chave de `erros` é o primeiro campo inválido da tela.
export function validarEnvio(
  def: FormularioDef,
  ident: Identificacao,
  respostas: MapaRespostas
): ResultadoValidacao {
  const erros: ErrosFormulario = {};

  const eNome = validarNome(ident.nome);
  if (eNome) erros.nome = eNome;
  const eEmail = validarEmail(ident.email);
  if (eEmail) erros.email = eEmail;
  const eTel = validarTelefone(ident.telefone);
  if (eTel) erros.telefone = eTel;

  const limpas: MapaRespostas = {};
  for (const p of perguntasOrdenadas(def)) {
    const { erros: e, valor } = validarPergunta(p, respostas?.[p.id]);
    Object.assign(erros, e);
    if (valor && Object.keys(valor).length > 0) limpas[p.id] = valor;
  }

  if (Object.keys(erros).length > 0) return { ok: false, erros };

  return {
    ok: true,
    erros: {},
    identificacao: {
      nome: limpar(ident.nome, LIMITE_NOME),
      email: limpar(ident.email, LIMITE_EMAIL).toLowerCase(),
      telefone: normalizarTelefone(ident.telefone) as string,
    },
    respostas: limpas,
  };
}

// Ordem dos campos na tela — usada para rolar até o PRIMEIRO campo inválido.
export function ordemDosCampos(def: FormularioDef): string[] {
  const ids = ["nome", "email", "telefone"];
  for (const p of perguntasOrdenadas(def)) {
    ids.push(p.id, `${p.id}__detalhe`);
  }
  return ids;
}

export function primeiroCampoInvalido(
  def: FormularioDef,
  erros: ErrosFormulario
): string | null {
  return ordemDosCampos(def).find((id) => erros[id]) ?? null;
}
