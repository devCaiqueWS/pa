// =============================================================================
// EXPORTAÇÃO XLSX — GET /api/forms/[id]/export?de&ate&q&ordem
// Só admin autenticado (validação NO SERVIDOR; o proxy é só a primeira grade).
// Respeita os MESMOS filtros do dashboard — a querystring é idêntica à da tela.
// =============================================================================
import { NextResponse } from "next/server";
import { getSession } from "@/lib/guard";
import { PAPEIS_RESPOSTAS } from "@/lib/forms/permissoes";
import { getFormulario } from "@/lib/forms/definicoes";
import { lerFiltros, paraRepositorio, temFiltro } from "@/lib/forms/filtros";
import { respostasParaAnalise } from "@/lib/forms/repositorio";
import { calcularMetricas } from "@/lib/forms/metricas";
import { montarAbas } from "@/lib/forms/exportacao";
import { hojeSP } from "@/lib/forms/datas";
import { gerarXlsx } from "@/lib/xlsx";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  // Autorização server-side — sem sessão de admin, nada sai daqui.
  const session = await getSession();
  if (!session || !PAPEIS_RESPOSTAS.includes(session.perfil)) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const { id } = await ctx.params;
  const def = getFormulario(id);
  if (!def) {
    return NextResponse.json({ error: "Formulário não encontrado." }, { status: 404 });
  }

  const url = new URL(req.url);
  const filtros = lerFiltros(Object.fromEntries(url.searchParams.entries()));

  try {
    const respostas = await respostasParaAnalise(paraRepositorio(def.id, filtros));
    const metricas = calcularMetricas(def, respostas);

    const partes: string[] = [];
    if (filtros.de) partes.push(`a partir de ${filtros.de}`);
    if (filtros.ate) partes.push(`até ${filtros.ate}`);
    if (filtros.q) partes.push(`busca: "${filtros.q}"`);
    const recorte = temFiltro(filtros)
      ? `Filtros aplicados — ${partes.join("; ")}`
      : "Todas as respostas";

    const xlsx = gerarXlsx(montarAbas(def, respostas, metricas, recorte));
    const nomeArquivo = `respostas-formulario-${def.id}-${hojeSP()}.xlsx`;

    return new NextResponse(new Uint8Array(xlsx), {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${nomeArquivo}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (erro) {
    // Log sem dado pessoal; resposta sem detalhe interno.
    console.error(
      `[forms] falha na exportação do formulário ${def.id}:`,
      erro instanceof Error ? erro.message : "erro desconhecido"
    );
    return NextResponse.json(
      { error: "Falha ao gerar a exportação. Tente novamente." },
      { status: 500 }
    );
  }
}
