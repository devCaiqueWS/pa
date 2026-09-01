// =============================================================================
// FORMULÁRIOS — DATAS (fuso America/Sao_Paulo)
// O banco guarda UTC; TODA exibição e TODO filtro do dashboard falam no fuso de
// São Paulo. Isomórfico: o mesmo texto no servidor e no cliente (o `timeZone`
// explícito impede a divergência que vem do relógio da máquina do visitante).
// =============================================================================

export const FUSO = "America/Sao_Paulo";

const fmtDataHora = new Intl.DateTimeFormat("pt-BR", {
  timeZone: FUSO,
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

const fmtData = new Intl.DateTimeFormat("pt-BR", {
  timeZone: FUSO,
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

export function formatarDataHora(d: Date | null | undefined): string {
  if (!d || Number.isNaN(d.getTime())) return "—";
  return fmtDataHora.format(d);
}

export function formatarData(d: Date | null | undefined): string {
  if (!d || Number.isNaN(d.getTime())) return "—";
  return fmtData.format(d);
}

// Deslocamento (em minutos) do fuso de São Paulo no instante dado. Calculado
// pelo Intl em vez de fixar -03:00, para continuar correto se o horário de
// verão voltar a existir.
function offsetMinutos(instante: Date): number {
  const partes = new Intl.DateTimeFormat("en-US", {
    timeZone: FUSO,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(instante);
  const get = (t: string) => Number(partes.find((p) => p.type === t)?.value ?? 0);
  const comoUtc = Date.UTC(
    get("year"),
    get("month") - 1,
    get("day"),
    get("hour") % 24,
    get("minute"),
    get("second")
  );
  return (comoUtc - instante.getTime()) / 60000;
}

// "2026-09-01" (data civil em São Paulo) -> instante UTC do começo do dia.
export function inicioDoDiaSP(iso: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso ?? "");
  if (!m) return null;
  const palpite = new Date(
    Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]), 0, 0, 0)
  );
  const off = offsetMinutos(palpite);
  return new Date(palpite.getTime() - off * 60000);
}

// "2026-09-01" -> instante UTC do INSTANTE SEGUINTE ao fim do dia (exclusivo),
// que é o que a consulta usa como `enviado_em < ?`.
export function fimDoDiaSP(iso: string): Date | null {
  const ini = inicioDoDiaSP(iso);
  if (!ini) return null;
  return new Date(ini.getTime() + 24 * 60 * 60 * 1000);
}

// Chave "AAAA-MM-DD" do dia (em São Paulo) de um instante — agrupa o gráfico
// de respostas por dia.
export function diaSP(d: Date): string {
  const p = new Intl.DateTimeFormat("en-CA", {
    timeZone: FUSO,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
  return p; // en-CA já entrega AAAA-MM-DD
}

// "AAAA-MM-DD" -> "01/09" (rótulo curto do gráfico).
export function rotuloDiaCurto(iso: string): string {
  const [, mes, dia] = iso.split("-");
  return `${dia}/${mes}`;
}

// Formato usado no NOME do arquivo exportado: AAAA-MM-DD em São Paulo.
export function hojeSP(): string {
  return diaSP(new Date());
}

// DATETIME para o MySQL (UTC, "AAAA-MM-DD HH:MM:SS"). O pool usa timezone "Z",
// então gravar/ler nesse formato mantém tudo em UTC de ponta a ponta.
export function paraDatetimeUtc(d: Date): string {
  return d.toISOString().slice(0, 19).replace("T", " ");
}
