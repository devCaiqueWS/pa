// =============================================================================
// FORMULÁRIOS — ACESSO AO BANCO (somente servidor)
// Toda consulta é PARAMETRIZADA (nunca concatena valor em SQL) e todo filtro
// que vem da URL é normalizado antes de chegar aqui. Uma única tabela serve a
// todos os formulários — ver db/site_form_respostas.sql.
// =============================================================================
// (sem `server-only`: o pacote não está no projeto — a garantia aqui é o
// import de `@/lib/db`, que só resolve no servidor.)
import crypto from "node:crypto";
import { getPool, query } from "@/lib/db";
import { paraDatetimeUtc } from "./datas";
import type { MapaRespostas, RespostaRegistro } from "./tipos";

// ---------------------------------------------------------------------------
// Leitura
// ---------------------------------------------------------------------------

type LinhaResposta = {
  id: number;
  uid: string;
  formulario_id: number;
  formulario_versao: number;
  nome: string;
  email: string;
  telefone: string;
  respostas: unknown; // JSON (o driver já devolve objeto) ou string
  origem: string | null;
  status: string;
  enviado_em: Date;
  criado_em: Date;
  atualizado_em: Date;
};

function paraRegistro(l: LinhaResposta): RespostaRegistro {
  let respostas: MapaRespostas = {};
  try {
    respostas =
      typeof l.respostas === "string"
        ? (JSON.parse(l.respostas) as MapaRespostas)
        : ((l.respostas as MapaRespostas) ?? {});
  } catch {
    respostas = {};
  }
  return {
    id: l.id,
    uid: l.uid,
    formularioId: l.formulario_id,
    formularioVersao: l.formulario_versao,
    nome: l.nome,
    email: l.email,
    telefone: l.telefone,
    respostas,
    origem: l.origem,
    status: l.status,
    enviadoEm: l.enviado_em,
    criadoEm: l.criado_em,
    atualizadoEm: l.atualizado_em,
  };
}

export type FiltrosRespostas = {
  formularioId: number;
  de?: Date | null; // >= (UTC)
  ate?: Date | null; // <  (UTC)
  busca?: string; // nome, e-mail ou telefone
  ordem?: "recentes" | "antigas";
};

// Monta o WHERE compartilhado por listagem, contagem, resumo e exportação.
function condicoes(f: FiltrosRespostas): { sql: string; params: unknown[] } {
  const partes = ["formulario_id = ?"];
  const params: unknown[] = [f.formularioId];

  if (f.de) {
    partes.push("enviado_em >= ?");
    params.push(paraDatetimeUtc(f.de));
  }
  if (f.ate) {
    partes.push("enviado_em < ?");
    params.push(paraDatetimeUtc(f.ate));
  }

  const busca = (f.busca ?? "").trim();
  if (busca) {
    // LIKE com curinga só nos parâmetros — o texto do usuário nunca vira SQL.
    const termo = `%${busca.replace(/[\\%_]/g, (c) => `\\${c}`)}%`;
    const digitos = busca.replace(/\D/g, "");
    if (digitos.length >= 4) {
      partes.push("(nome LIKE ? OR email LIKE ? OR telefone LIKE ?)");
      params.push(termo, termo, `%${digitos}%`);
    } else {
      partes.push("(nome LIKE ? OR email LIKE ?)");
      params.push(termo, termo);
    }
  }

  return { sql: partes.join(" AND "), params };
}

const COLUNAS =
  "id, uid, formulario_id, formulario_versao, nome, email, telefone, respostas, origem, status, enviado_em, criado_em, atualizado_em";

export async function contarRespostas(f: FiltrosRespostas): Promise<number> {
  const { sql, params } = condicoes(f);
  const rows = await query<{ total: number }>(
    `SELECT COUNT(*) AS total FROM site_form_respostas WHERE ${sql}`,
    params
  );
  return Number(rows[0]?.total ?? 0);
}

export async function listarRespostas(
  f: FiltrosRespostas,
  pagina: number,
  porPagina: number
): Promise<RespostaRegistro[]> {
  const { sql, params } = condicoes(f);
  // LIMIT/OFFSET entram como inteiros já sanados (nunca texto da URL).
  const limite = Math.min(Math.max(1, Math.trunc(porPagina)), 200);
  const salto = Math.max(0, Math.trunc(pagina - 1)) * limite;
  const direcao = f.ordem === "antigas" ? "ASC" : "DESC";
  const rows = await query<LinhaResposta>(
    `SELECT ${COLUNAS} FROM site_form_respostas
      WHERE ${sql}
      ORDER BY enviado_em ${direcao}, id ${direcao}
      LIMIT ${limite} OFFSET ${salto}`,
    params
  );
  return rows.map(paraRegistro);
}

// Usada pelo dashboard (métricas) e pela exportação: respeita os MESMOS
// filtros, sem paginação. O teto evita estourar memória num acidente.
export const TETO_EXPORTACAO = 10000;

export async function respostasParaAnalise(
  f: FiltrosRespostas
): Promise<RespostaRegistro[]> {
  const { sql, params } = condicoes(f);
  const direcao = f.ordem === "antigas" ? "ASC" : "DESC";
  const rows = await query<LinhaResposta>(
    `SELECT ${COLUNAS} FROM site_form_respostas
      WHERE ${sql}
      ORDER BY enviado_em ${direcao}, id ${direcao}
      LIMIT ${TETO_EXPORTACAO}`,
    params
  );
  return rows.map(paraRegistro);
}

export type ResumoFormulario = {
  total: number;
  primeira: Date | null;
  ultima: Date | null;
};

// Resumo SEM filtros (o "estado do formulário" no índice administrativo).
export async function resumoFormulario(
  formularioId: number
): Promise<ResumoFormulario> {
  const rows = await query<{ total: number; primeira: Date | null; ultima: Date | null }>(
    `SELECT COUNT(*) AS total, MIN(enviado_em) AS primeira, MAX(enviado_em) AS ultima
       FROM site_form_respostas WHERE formulario_id = ?`,
    [formularioId]
  );
  const r = rows[0];
  return {
    total: Number(r?.total ?? 0),
    primeira: r?.primeira ?? null,
    ultima: r?.ultima ?? null,
  };
}

// Resumo de vários formulários de uma vez (índice /forms/respostas).
export async function resumoDeTodos(
  ids: number[]
): Promise<Map<number, ResumoFormulario>> {
  const mapa = new Map<number, ResumoFormulario>();
  if (ids.length === 0) return mapa;
  const marcadores = ids.map(() => "?").join(",");
  const rows = await query<{
    formulario_id: number;
    total: number;
    primeira: Date | null;
    ultima: Date | null;
  }>(
    `SELECT formulario_id, COUNT(*) AS total,
            MIN(enviado_em) AS primeira, MAX(enviado_em) AS ultima
       FROM site_form_respostas
      WHERE formulario_id IN (${marcadores})
      GROUP BY formulario_id`,
    ids
  );
  for (const r of rows) {
    mapa.set(Number(r.formulario_id), {
      total: Number(r.total),
      primeira: r.primeira,
      ultima: r.ultima,
    });
  }
  for (const id of ids) {
    if (!mapa.has(id)) mapa.set(id, { total: 0, primeira: null, ultima: null });
  }
  return mapa;
}

export async function getResposta(
  formularioId: number,
  uid: string
): Promise<RespostaRegistro | null> {
  if (!/^[0-9a-f-]{36}$/i.test(uid)) return null;
  const rows = await query<LinhaResposta>(
    `SELECT ${COLUNAS} FROM site_form_respostas WHERE formulario_id = ? AND uid = ? LIMIT 1`,
    [formularioId, uid]
  );
  return rows[0] ? paraRegistro(rows[0]) : null;
}

// ---------------------------------------------------------------------------
// Gravação
// ---------------------------------------------------------------------------

export type NovaResposta = {
  formularioId: number;
  formularioVersao: number;
  nome: string;
  email: string;
  telefone: string;
  respostas: MapaRespostas;
  origem: string | null;
};

// Janela em que um segundo envio idêntico é tratado como duplo clique/reenvio.
const JANELA_DUPLICADO_SEG = 90;

// Devolve o uid da resposta já existente quando o mesmo e-mail acabou de
// responder o mesmo formulário — assim um duplo clique (ou um retry de rede)
// não vira duas linhas.
export async function respostaRecenteDoMesmoEmail(
  formularioId: number,
  email: string
): Promise<string | null> {
  const rows = await query<{ uid: string }>(
    `SELECT uid FROM site_form_respostas
      WHERE formulario_id = ? AND email = ?
        AND enviado_em >= (UTC_TIMESTAMP() - INTERVAL ? SECOND)
      ORDER BY id DESC LIMIT 1`,
    [formularioId, email, JANELA_DUPLICADO_SEG]
  );
  return rows[0]?.uid ?? null;
}

export async function salvarResposta(nova: NovaResposta): Promise<string> {
  const uid = crypto.randomUUID();
  await getPool().execute(
    `INSERT INTO site_form_respostas
       (uid, formulario_id, formulario_versao, nome, email, telefone,
        respostas, origem, status, enviado_em)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'recebida', UTC_TIMESTAMP())`,
    [
      uid,
      nova.formularioId,
      nova.formularioVersao,
      nova.nome,
      nova.email,
      nova.telefone,
      JSON.stringify(nova.respostas),
      nova.origem,
    ]
  );
  return uid;
}

// ---------------------------------------------------------------------------
// Rate limit
// ---------------------------------------------------------------------------

// A chave é um HMAC truncado de (IP + formulário). O IP COMPLETO nunca é
// gravado: sem o SESSION_SECRET a chave não volta a ser um endereço, e ainda
// assim limita o mesmo remetente. Ver db/site_form_respostas.sql.
function chaveLimite(ip: string, formularioId: number): string {
  const segredo = process.env.SESSION_SECRET ?? "sem-segredo";
  return crypto
    .createHmac("sha256", segredo)
    .update(`${ip}|${formularioId}`)
    .digest("hex")
    .slice(0, 32);
}

export type ResultadoLimite = { permitido: boolean; restantes: number };

// Janela deslizante simples e suficiente para um formulário público:
// N envios por IP a cada X minutos, contados no próprio banco (funciona em
// serverless, onde memória de processo não é compartilhada entre instâncias).
export async function registrarTentativa(
  ip: string,
  formularioId: number,
  maximo = 5,
  janelaMinutos = 10
): Promise<ResultadoLimite> {
  const chave = chaveLimite(ip, formularioId);
  try {
    // Zera a janela quando ela expirou; senão incrementa.
    await getPool().execute(
      `INSERT INTO site_form_rate_limit (chave, janela_inicio, contagem)
            VALUES (?, UTC_TIMESTAMP(), 1)
       ON DUPLICATE KEY UPDATE
            contagem = IF(janela_inicio < (UTC_TIMESTAMP() - INTERVAL ? MINUTE), 1, contagem + 1),
            janela_inicio = IF(janela_inicio < (UTC_TIMESTAMP() - INTERVAL ? MINUTE), UTC_TIMESTAMP(), janela_inicio)`,
      [chave, janelaMinutos, janelaMinutos]
    );
    const rows = await query<{ contagem: number }>(
      "SELECT contagem FROM site_form_rate_limit WHERE chave = ?",
      [chave]
    );
    const contagem = Number(rows[0]?.contagem ?? 1);
    return { permitido: contagem <= maximo, restantes: Math.max(0, maximo - contagem) };
  } catch {
    // Sem a tabela de limite (ou banco instável), NÃO bloqueia o envio legítimo:
    // o formulário público continua funcionando e o resto da validação segue.
    return { permitido: true, restantes: maximo };
  }
}
