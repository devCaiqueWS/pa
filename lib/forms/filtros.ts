// =============================================================================
// FORMULÁRIOS — FILTROS DO DASHBOARD (URL <-> consulta)
// Normaliza o que vem da querystring (?de&ate&q&ordem&pagina) para que dashboard
// e exportação enxerguem EXATAMENTE o mesmo recorte, e nada além de valores
// sanados chegue perto do SQL.
// =============================================================================
import { fimDoDiaSP, inicioDoDiaSP } from "./datas";
import type { FiltrosRespostas } from "./repositorio";

export type FiltrosUrl = {
  de: string; // "AAAA-MM-DD" ou ""
  ate: string;
  q: string;
  ordem: "recentes" | "antigas";
  pagina: number;
};

const RE_DIA = /^\d{4}-\d{2}-\d{2}$/;

function um(v: string | string[] | undefined): string {
  return (Array.isArray(v) ? v[0] : v) ?? "";
}

export function lerFiltros(
  sp: Record<string, string | string[] | undefined>
): FiltrosUrl {
  const de = um(sp.de);
  const ate = um(sp.ate);
  const pagina = Number(um(sp.pagina));
  return {
    de: RE_DIA.test(de) ? de : "",
    ate: RE_DIA.test(ate) ? ate : "",
    q: um(sp.q).slice(0, 120),
    ordem: um(sp.ordem) === "antigas" ? "antigas" : "recentes",
    pagina: Number.isInteger(pagina) && pagina >= 1 && pagina <= 10000 ? pagina : 1,
  };
}

export function paraRepositorio(
  formularioId: number,
  f: FiltrosUrl
): FiltrosRespostas {
  return {
    formularioId,
    de: f.de ? inicioDoDiaSP(f.de) : null,
    ate: f.ate ? fimDoDiaSP(f.ate) : null,
    busca: f.q,
    ordem: f.ordem,
  };
}

// Querystring reproduzindo os filtros (para paginação, detalhe e exportação).
export function paraQuery(
  f: FiltrosUrl,
  extras: Record<string, string | number> = {}
): string {
  const q = new URLSearchParams();
  if (f.de) q.set("de", f.de);
  if (f.ate) q.set("ate", f.ate);
  if (f.q) q.set("q", f.q);
  if (f.ordem !== "recentes") q.set("ordem", f.ordem);
  for (const [k, v] of Object.entries(extras)) {
    if (v !== "" && v !== undefined && v !== null) q.set(k, String(v));
  }
  const s = q.toString();
  return s ? `?${s}` : "";
}

export function temFiltro(f: FiltrosUrl): boolean {
  return !!(f.de || f.ate || f.q);
}
