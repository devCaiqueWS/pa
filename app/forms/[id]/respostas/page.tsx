// =============================================================================
// DASHBOARD DE RESPOSTAS — /forms/[id]/respostas (SÓ ADMIN)
// A autorização acontece AQUI, no servidor (requireRole), além do proxy.
// Tudo é genérico sobre a definição: métricas por tipo de pergunta, filtros por
// período/busca, tabela paginada, detalhe de resposta e exportação XLSX que
// respeita os mesmos filtros da tela.
// =============================================================================
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AdminShell from "@/components/forms/AdminShell";
import AjusteBasePath from "@/components/forms/AjusteBasePath";
import { Barras, MediaEscala, SerieDiaria } from "@/components/forms/Graficos";
import { requireRole } from "@/lib/guard";
import { asset } from "@/lib/site";
import { PAPEIS_RESPOSTAS } from "@/lib/forms/permissoes";
import { getFormulario, perguntasOrdenadas, rotuloOpcao } from "@/lib/forms/definicoes";
import { lerFiltros, paraQuery, paraRepositorio, temFiltro } from "@/lib/forms/filtros";
import {
  getResposta,
  respostasParaAnalise,
  resumoFormulario,
  TETO_EXPORTACAO,
} from "@/lib/forms/repositorio";
import { calcularMetricas } from "@/lib/forms/metricas";
import { formatarDataHora } from "@/lib/forms/datas";
import { exibirTelefone } from "@/lib/forms/validacao";
import type { Pergunta, RespostaRegistro } from "@/lib/forms/tipos";

export const dynamic = "force-dynamic";

const POR_PAGINA = 20;

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const def = getFormulario((await params).id);
  return {
    title: def ? `Respostas — ${def.titulo}` : "Respostas",
    robots: { index: false },
  };
}

// Texto legível da resposta de uma pergunta (para detalhe).
function respostaLegivel(p: Pergunta, r: RespostaRegistro): string {
  const v = r.respostas?.[p.id];
  if (!v) return "—";
  if (p.tipo === "unica") {
    if (!v.valor) return "—";
    const base = rotuloOpcao(p, v.valor);
    return v.detalhe ? `${base} — "${v.detalhe}"` : base;
  }
  if (p.tipo === "multipla") {
    const lista = (v.valores ?? []).map((x) => rotuloOpcao(p, x)).join("; ");
    if (!lista) return "—";
    return v.detalhe ? `${lista} — "${v.detalhe}"` : lista;
  }
  if (p.tipo === "escala") {
    if (typeof v.nota !== "number") return "—";
    const rot = p.niveis?.find((n) => n.nota === v.nota)?.rotulo;
    return rot ? `${v.nota} — ${rot}` : String(v.nota);
  }
  return v.texto || "—";
}

export default async function DashboardRespostas({ params, searchParams }: Props) {
  const { id } = await params;
  const def = getFormulario(id);
  if (!def) notFound();

  // Autorização server-side (redireciona para /login ou /sem-acesso).
  const session = await requireRole(PAPEIS_RESPOSTAS, `/forms/${def.id}/respostas`);

  const sp = await searchParams;
  const filtros = lerFiltros(sp);
  const verUid = typeof sp.ver === "string" ? sp.ver : "";

  let erroCarga = false;
  let respostas: RespostaRegistro[] = [];
  let resumoGeral = { total: 0, primeira: null as Date | null, ultima: null as Date | null };
  let detalhe: RespostaRegistro | null = null;

  try {
    // Uma consulta cobre métricas + tabela (o teto de análise é bem maior que
    // qualquer volume esperado de evento); o resumo geral ignora filtros.
    [respostas, resumoGeral] = await Promise.all([
      respostasParaAnalise(paraRepositorio(def.id, filtros)),
      resumoFormulario(def.id),
    ]);
    if (verUid) {
      detalhe =
        respostas.find((r) => r.uid === verUid) ??
        (await getResposta(def.id, verUid));
    }
  } catch {
    erroCarga = true;
  }

  const metricas = calcularMetricas(def, respostas);
  const total = respostas.length;
  const totalPaginas = Math.max(1, Math.ceil(total / POR_PAGINA));
  const pagina = Math.min(filtros.pagina, totalPaginas);
  const daPagina = respostas.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA);
  const filtrado = temFiltro(filtros);
  const linkBase = `/forms/${def.id}/respostas`;
  const urlExportacao = asset(`/api/forms/${def.id}/export${paraQuery(filtros)}`);

  const perguntas = perguntasOrdenadas(def);

  return (
    <AdminShell session={session}>
      <AjusteBasePath />
      {/* Cabeçalho ----------------------------------------------------------- */}
      <div className="fdash-topo">
        <div>
          <p className="muted" style={{ margin: "0 0 2px" }}>
            <Link href="/forms/respostas">Formulários</Link> · Formulário {def.id}
          </p>
          <h1>{def.titulo}</h1>
          <p className="muted" style={{ margin: 0 }}>
            {def.ativo ? (
              <span className="tag tag-ativo">Recebendo respostas</span>
            ) : (
              <span className="tag tag-inativo">Encerrado</span>
            )}{" "}
            <span className="tag">versão {def.versao}</span>
          </p>
        </div>
        <div className="fdash-topo-acoes">
          <Link className="btn btn-outline" href={`/forms/${def.id}`}>
            Ver formulário público
          </Link>
          <a className="btn btn-primary" href={urlExportacao}>
            Exportar XLSX{filtrado ? " (filtros aplicados)" : ""}
          </a>
        </div>
      </div>

      {erroCarga ? (
        <div className="fdash-vazio" role="alert">
          <strong>Não foi possível carregar as respostas agora.</strong>
          <br />
          Verifique a conexão com o banco e recarregue a página.
        </div>
      ) : (
        <>
          {/* Filtros ------------------------------------------------------- */}
          {/* action com basePath explícito: o submit nativo (GET) precisa cair
              na rota real /preview-site/... em qualquer ambiente. */}
          <form className="fdash-filtros" method="get" action={asset(linkBase)}>
            <div className="frm-campo">
              <label htmlFor="f-de">De (data)</label>
              <input id="f-de" type="date" name="de" defaultValue={filtros.de} />
            </div>
            <div className="frm-campo">
              <label htmlFor="f-ate">Até (data)</label>
              <input id="f-ate" type="date" name="ate" defaultValue={filtros.ate} />
            </div>
            <div className="frm-campo frm-campo-busca">
              <label htmlFor="f-q">Pesquisar</label>
              <input
                id="f-q"
                type="search"
                name="q"
                placeholder="Nome, e-mail ou telefone"
                defaultValue={filtros.q}
              />
            </div>
            <div className="frm-campo">
              <label htmlFor="f-ordem">Ordenar</label>
              <select id="f-ordem" name="ordem" defaultValue={filtros.ordem}>
                <option value="recentes">Mais recentes primeiro</option>
                <option value="antigas">Mais antigas primeiro</option>
              </select>
            </div>
            <div className="fdash-filtros-acoes">
              <button className="btn btn-primary" type="submit">
                Filtrar
              </button>
              {filtrado && (
                <Link className="btn btn-outline" href={linkBase}>
                  Limpar
                </Link>
              )}
            </div>
          </form>
          <p className="fdash-aviso-filtro">
            {filtrado
              ? `Os números, gráficos e a exportação abaixo consideram apenas o recorte filtrado (${total} resposta${total === 1 ? "" : "s"}).`
              : "Sem filtros: mostrando todas as respostas."}
          </p>

          {/* Detalhe ------------------------------------------------------- */}
          {verUid && (
            <section className="fdash-detalhe" aria-label="Detalhe da resposta">
              {detalhe ? (
                <>
                  <div className="fdash-detalhe-topo">
                    <h2>Resposta de {detalhe.nome}</h2>
                    <Link
                      className="btn btn-outline"
                      href={`${linkBase}${paraQuery(filtros, { pagina })}`}
                    >
                      Fechar detalhe
                    </Link>
                  </div>
                  <dl>
                    <dt>Enviado em</dt>
                    <dd>{formatarDataHora(detalhe.enviadoEm)} (horário de Brasília)</dd>
                    <dt>Nome completo</dt>
                    <dd>{detalhe.nome}</dd>
                    <dt>E-mail</dt>
                    <dd>{detalhe.email}</dd>
                    <dt>Telefone</dt>
                    <dd>{exibirTelefone(detalhe.telefone)}</dd>
                    {perguntas.map((p) => (
                      <FragmentoPergunta key={p.id} pergunta={p} registro={detalhe!} />
                    ))}
                    {detalhe.origem && (
                      <>
                        <dt>Origem</dt>
                        <dd>{detalhe.origem}</dd>
                      </>
                    )}
                  </dl>
                </>
              ) : (
                <p className="muted" style={{ margin: 0 }}>
                  Resposta não encontrada (pode ter sido removida).{" "}
                  <Link href={linkBase}>Voltar à lista</Link>
                </p>
              )}
            </section>
          )}

          {/* Indicadores gerais -------------------------------------------- */}
          <div className="admin-stats">
            <div className="admin-stat">
              <span className="admin-stat-value">{total}</span>
              <span className="admin-stat-label">
                {filtrado ? "Respostas no recorte" : "Total de respostas"}
              </span>
            </div>
            <div className="admin-stat">
              <span className="admin-stat-value" style={{ fontSize: 20 }}>
                {formatarDataHora(metricas.primeira)}
              </span>
              <span className="admin-stat-label">Primeira resposta</span>
            </div>
            <div className="admin-stat">
              <span className="admin-stat-value" style={{ fontSize: 20 }}>
                {formatarDataHora(metricas.ultima)}
              </span>
              <span className="admin-stat-label">Última resposta</span>
            </div>
            <div className="admin-stat">
              <span className="admin-stat-value">{resumoGeral.total}</span>
              <span className="admin-stat-label">Total geral (sem filtros)</span>
            </div>
          </div>

          {total === 0 ? (
            <div className="fdash-vazio">
              <strong>Nenhuma resposta {filtrado ? "neste recorte" : "ainda"}.</strong>
              <br />
              {filtrado
                ? "Ajuste o período ou limpe a busca para ver tudo."
                : "Compartilhe o link público do formulário para começar a receber."}
            </div>
          ) : (
            <>
              {/* Série temporal + métricas por pergunta -------------------- */}
              <div className="fdash-grid">
                <section className="fdash-painel fdash-grid-full">
                  <h2>Respostas recebidas por dia</h2>
                  <p className="fdash-painel-sub">Fuso America/Sao_Paulo · últimos 30 dias com respostas</p>
                  <SerieDiaria pontos={metricas.porDia} />
                </section>

                {metricas.perguntas.map((m) => {
                  const p = m.pergunta;
                  const titulo = p.grupo ? `${p.grupo} — ${p.titulo}` : p.titulo;
                  if (m.distribuicao) {
                    return (
                      <section className="fdash-painel" key={p.id}>
                        <h2>{titulo}</h2>
                        <p className="fdash-painel-sub">
                          {m.respondentes} respondente(s)
                          {p.tipo === "multipla" ? " · múltipla escolha" : ""}
                        </p>
                        <Barras fatias={m.distribuicao} />
                        {m.detalhes && m.detalhes.length > 0 && (
                          <details style={{ marginTop: 14 }}>
                            <summary className="muted" style={{ cursor: "pointer" }}>
                              Respostas “Outro” ({m.detalhes.length})
                            </summary>
                            <div className="fdash-textos" style={{ marginTop: 10 }}>
                              {m.detalhes.map((t) => (
                                <article className="fdash-texto" key={`${t.uid}-${p.id}`}>
                                  <p>{t.texto}</p>
                                  <footer>
                                    {t.nome} · {formatarDataHora(t.quando)}
                                  </footer>
                                </article>
                              ))}
                            </div>
                          </details>
                        )}
                      </section>
                    );
                  }
                  if (m.notas) {
                    return (
                      <section className="fdash-painel" key={p.id}>
                        <h2>{titulo}</h2>
                        <p className="fdash-painel-sub">
                          Média entre {m.respondentes} avaliação(ões)
                        </p>
                        <MediaEscala media={m.media ?? 0} maximo={p.niveis?.length ?? 3} />
                        <Barras fatias={m.notas} />
                      </section>
                    );
                  }
                  return (
                    <section className="fdash-painel" key={p.id}>
                      <h2>{titulo}</h2>
                      <p className="fdash-painel-sub">
                        {m.textos?.length ?? 0} sugestão(ões) recebida(s)
                      </p>
                      {m.textos && m.textos.length > 0 ? (
                        <div className="fdash-textos">
                          {m.textos.map((t) => (
                            <article className="fdash-texto" key={`${t.uid}-${p.id}`}>
                              <p>{t.texto}</p>
                              <footer>
                                {t.nome} · {formatarDataHora(t.quando)}
                              </footer>
                            </article>
                          ))}
                        </div>
                      ) : (
                        <p className="muted">Nenhum texto neste recorte.</p>
                      )}
                    </section>
                  );
                })}
              </div>

              {/* Tabela ---------------------------------------------------- */}
              <section aria-label="Tabela de respostas">
                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Enviado em</th>
                        <th>Nome</th>
                        <th>E-mail</th>
                        <th>Telefone</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {daPagina.map((r) => (
                        <tr key={r.uid}>
                          <td style={{ whiteSpace: "nowrap" }}>
                            {formatarDataHora(r.enviadoEm)}
                          </td>
                          <td>{r.nome}</td>
                          <td>{r.email}</td>
                          <td style={{ whiteSpace: "nowrap" }}>
                            {exibirTelefone(r.telefone)}
                          </td>
                          <td>
                            <Link
                              className="fdash-linha-link"
                              href={`${linkBase}${paraQuery(filtros, { pagina, ver: r.uid })}`}
                            >
                              Ver resposta
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Paginação ---------------------------------------------- */}
                <nav className="fdash-paginacao" aria-label="Paginação">
                  <span className="fdash-paginacao-info">
                    Página {pagina} de {totalPaginas} · {total} resposta{total === 1 ? "" : "s"}
                    {total >= TETO_EXPORTACAO ? ` (limitado a ${TETO_EXPORTACAO})` : ""}
                  </span>
                  <div className="fdash-paginacao-links">
                    {pagina > 1 ? (
                      <Link href={`${linkBase}${paraQuery(filtros, { pagina: pagina - 1 })}`}>
                        ‹ Anterior
                      </Link>
                    ) : (
                      <span className="desab">‹ Anterior</span>
                    )}
                    <span className="ativo">{pagina}</span>
                    {pagina < totalPaginas ? (
                      <Link href={`${linkBase}${paraQuery(filtros, { pagina: pagina + 1 })}`}>
                        Próxima ›
                      </Link>
                    ) : (
                      <span className="desab">Próxima ›</span>
                    )}
                  </div>
                </nav>
              </section>
            </>
          )}
        </>
      )}
    </AdminShell>
  );
}

// Um par <dt>/<dd> do detalhe (extraído para manter o JSX acima legível).
function FragmentoPergunta({
  pergunta,
  registro,
}: {
  pergunta: Pergunta;
  registro: RespostaRegistro;
}) {
  return (
    <>
      <dt>{pergunta.grupo ? `${pergunta.grupo} ${pergunta.titulo}` : pergunta.titulo}</dt>
      <dd>{respostaLegivel(pergunta, registro)}</dd>
    </>
  );
}
