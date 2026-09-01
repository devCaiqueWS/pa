// =============================================================================
// FORMULÁRIOS — MÉTRICAS DO DASHBOARD
// Agregação genérica, derivada da DEFINIÇÃO: cada tipo de pergunta rende o
// indicador que faz sentido para ele (distribuição, média, lista de textos).
// Por isso o dashboard do /forms/3 nasce pronto junto com a definição — não há
// cálculo escrito à mão por formulário.
// Isomórfico: recebe as respostas já lidas do banco.
// =============================================================================
import { perguntasOrdenadas, rotuloOpcao } from "./definicoes";
import { diaSP } from "./datas";
import type { FormularioDef, Pergunta, RespostaRegistro } from "./tipos";

export type FatiaDistribuicao = {
  valor: string;
  rotulo: string;
  total: number;
  percentual: number; // 0–100, sobre quem respondeu a pergunta
};

export type TextoLivre = {
  uid: string;
  nome: string;
  quando: Date;
  texto: string;
};

export type MetricaPergunta = {
  pergunta: Pergunta;
  respondentes: number; // quantas respostas trouxeram algum valor
  // "unica" e "multipla"
  distribuicao?: FatiaDistribuicao[];
  // Detalhamentos de "Outro", agrupados para leitura.
  detalhes?: TextoLivre[];
  // "escala"
  media?: number;
  notas?: FatiaDistribuicao[];
  // "texto"
  textos?: TextoLivre[];
};

export type PontoSerie = { dia: string; total: number };

export type MetricasFormulario = {
  total: number;
  primeira: Date | null;
  ultima: Date | null;
  porDia: PontoSerie[];
  perguntas: MetricaPergunta[];
};

function ordenarPorTotal(a: FatiaDistribuicao, b: FatiaDistribuicao) {
  return b.total - a.total || a.rotulo.localeCompare(b.rotulo, "pt-BR");
}

function pct(parte: number, todo: number): number {
  return todo > 0 ? Math.round((parte / todo) * 1000) / 10 : 0;
}

export function calcularMetricas(
  def: FormularioDef,
  respostas: RespostaRegistro[]
): MetricasFormulario {
  const total = respostas.length;

  // Série por dia (fuso de São Paulo), do mais antigo ao mais recente.
  const contagemDia = new Map<string, number>();
  let primeira: Date | null = null;
  let ultima: Date | null = null;
  for (const r of respostas) {
    const d = r.enviadoEm;
    if (!(d instanceof Date) || Number.isNaN(d.getTime())) continue;
    if (!primeira || d < primeira) primeira = d;
    if (!ultima || d > ultima) ultima = d;
    const chave = diaSP(d);
    contagemDia.set(chave, (contagemDia.get(chave) ?? 0) + 1);
  }
  const porDia = [...contagemDia.entries()]
    .map(([dia, t]) => ({ dia, total: t }))
    .sort((a, b) => a.dia.localeCompare(b.dia));

  const perguntas: MetricaPergunta[] = perguntasOrdenadas(def).map((p) => {
    const m: MetricaPergunta = { pergunta: p, respondentes: 0 };
    const detalhes: TextoLivre[] = [];

    if (p.tipo === "unica" || p.tipo === "multipla") {
      const contagem = new Map<string, number>();
      for (const o of p.opcoes ?? []) contagem.set(o.valor, 0);

      for (const r of respostas) {
        const v = r.respostas?.[p.id];
        if (!v) continue;
        const marcados =
          p.tipo === "unica" ? (v.valor ? [v.valor] : []) : (v.valores ?? []);
        if (marcados.length === 0) continue;
        m.respondentes++;
        for (const valor of marcados) {
          contagem.set(valor, (contagem.get(valor) ?? 0) + 1);
        }
        if (v.detalhe) {
          detalhes.push({
            uid: r.uid,
            nome: r.nome,
            quando: r.enviadoEm,
            texto: v.detalhe,
          });
        }
      }

      m.distribuicao = [...contagem.entries()]
        .map(([valor, t]) => ({
          valor,
          rotulo: rotuloOpcao(p, valor),
          total: t,
          percentual: pct(t, m.respondentes),
        }))
        .sort(ordenarPorTotal);
      if (detalhes.length) m.detalhes = detalhes;
      return m;
    }

    if (p.tipo === "escala") {
      const contagem = new Map<number, number>();
      for (const n of p.niveis ?? []) contagem.set(n.nota, 0);
      let soma = 0;
      for (const r of respostas) {
        const nota = r.respostas?.[p.id]?.nota;
        if (typeof nota !== "number" || !contagem.has(nota)) continue;
        m.respondentes++;
        soma += nota;
        contagem.set(nota, (contagem.get(nota) ?? 0) + 1);
      }
      m.media = m.respondentes ? Math.round((soma / m.respondentes) * 100) / 100 : 0;
      m.notas = (p.niveis ?? []).map((n) => ({
        valor: String(n.nota),
        rotulo: `${n.nota} — ${n.rotulo}`,
        total: contagem.get(n.nota) ?? 0,
        percentual: pct(contagem.get(n.nota) ?? 0, m.respondentes),
      }));
      return m;
    }

    // texto
    const textos: TextoLivre[] = [];
    for (const r of respostas) {
      const t = r.respostas?.[p.id]?.texto;
      if (!t) continue;
      m.respondentes++;
      textos.push({ uid: r.uid, nome: r.nome, quando: r.enviadoEm, texto: t });
    }
    m.textos = textos;
    return m;
  });

  return { total, primeira, ultima, porDia, perguntas };
}
