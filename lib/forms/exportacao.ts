// =============================================================================
// FORMULÁRIOS — MONTAGEM DA PLANILHA (XLSX)
// Derivada da DEFINIÇÃO: uma coluna por pergunta (+ coluna própria para cada
// detalhamento de "Outro"), identificação, data como DATA de verdade e uma aba
// "Resumo" com os indicadores do dashboard. Vale para qualquer formulário.
// =============================================================================
import type { Aba, ValorCelula } from "@/lib/xlsx";
import { formatarDataHora } from "./datas";
import { perguntasOrdenadas, rotuloOpcao } from "./definicoes";
import { exibirTelefone } from "./validacao";
import type { MetricasFormulario } from "./metricas";
import type { FormularioDef, Pergunta, RespostaRegistro } from "./tipos";

// Valor legível de uma pergunta numa linha da planilha.
function celulaDaPergunta(p: Pergunta, r: RespostaRegistro): ValorCelula {
  const v = r.respostas?.[p.id];
  if (!v) return "";
  if (p.tipo === "unica") return v.valor ? rotuloOpcao(p, v.valor) : "";
  if (p.tipo === "multipla") {
    return (v.valores ?? []).map((x) => rotuloOpcao(p, x)).join("; ");
  }
  if (p.tipo === "escala") {
    if (typeof v.nota !== "number") return "";
    const rot = p.niveis?.find((n) => n.nota === v.nota)?.rotulo;
    return rot ? `${v.nota} — ${rot}` : v.nota;
  }
  return v.texto ?? "";
}

export function montarAbas(
  def: FormularioDef,
  respostas: RespostaRegistro[],
  metricas: MetricasFormulario,
  descricaoDoRecorte: string
): Aba[] {
  const perguntas = perguntasOrdenadas(def);

  // ---- Aba 1: Respostas ----------------------------------------------------
  const colunas = [
    { titulo: "Enviado em", largura: 17 },
    { titulo: "Nome completo", largura: 30 },
    { titulo: "E-mail", largura: 32 },
    { titulo: "Telefone", largura: 17 },
  ];
  for (const p of perguntas) {
    colunas.push({ titulo: p.grupo ? `${p.grupo} ${p.titulo}` : p.titulo, largura: 34 });
    if (p.opcoes?.some((o) => o.abreDetalhe)) {
      colunas.push({ titulo: `${p.titulo} — detalhe de "Outro"`, largura: 34 });
    }
  }
  colunas.push({ titulo: "Origem", largura: 26 }, { titulo: "ID da resposta", largura: 38 });

  const linhas = respostas.map((r) => {
    const linha: ValorCelula[] = [
      r.enviadoEm,
      r.nome,
      r.email,
      exibirTelefone(r.telefone),
    ];
    for (const p of perguntas) {
      linha.push(celulaDaPergunta(p, r));
      if (p.opcoes?.some((o) => o.abreDetalhe)) {
        linha.push(r.respostas?.[p.id]?.detalhe ?? "");
      }
    }
    linha.push(r.origem ?? "", r.uid);
    return linha;
  });

  // ---- Aba 2: Resumo -------------------------------------------------------
  const resumo: ValorCelula[][] = [
    ["Formulário", def.titulo],
    ["Versão do formulário", def.versao],
    ["Exportado em", new Date()],
    ["Recorte exportado", descricaoDoRecorte],
    ["Total de respostas no recorte", metricas.total],
    ["Primeira resposta", metricas.primeira ? formatarDataHora(metricas.primeira) : "—"],
    ["Última resposta", metricas.ultima ? formatarDataHora(metricas.ultima) : "—"],
    ["", ""],
  ];

  for (const m of metricas.perguntas) {
    const p = m.pergunta;
    resumo.push([p.grupo ? `${p.grupo} ${p.titulo}` : p.titulo, `${m.respondentes} respondente(s)`]);
    if (m.distribuicao) {
      for (const fatia of m.distribuicao) {
        resumo.push([`   ${fatia.rotulo}`, `${fatia.total} (${fatia.percentual}%)`]);
      }
    }
    if (typeof m.media === "number" && m.notas) {
      resumo.push(["   Média", m.media]);
      for (const nota of m.notas) {
        resumo.push([`   ${nota.rotulo}`, `${nota.total} (${nota.percentual}%)`]);
      }
    }
    if (m.textos) resumo.push(["   Textos recebidos", m.textos.length]);
    resumo.push(["", ""]);
  }

  return [
    { nome: "Respostas", colunas, linhas },
    {
      nome: "Resumo",
      colunas: [
        { titulo: "Indicador", largura: 52 },
        { titulo: "Valor", largura: 30 },
      ],
      linhas: resumo,
      filtros: false,
    },
  ];
}
