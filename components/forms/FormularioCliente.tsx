"use client";

// =============================================================================
// FORMULÁRIO PÚBLICO — RENDERIZADOR GENÉRICO (client)
// Desenha QUALQUER formulário a partir da definição (lib/forms/definicoes.ts):
// identificação + um bloco por pergunta, com validação imediata no cliente
// (a mesma de lib/forms/validacao.ts que o servidor repete), máscara de
// telefone, campo "Outro", rolagem até o primeiro erro, envio com loading e
// trava de duplo clique. Os dados digitados NUNCA são descartados em falha de
// rede — o estado fica no cliente e o visitante só reenvia.
// =============================================================================
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type {
  ErrosFormulario,
  FormularioDef,
  MapaRespostas,
  Pergunta,
  ValorResposta,
} from "@/lib/forms/tipos";
import { perguntasOrdenadas } from "@/lib/forms/definicoes";
import {
  mascararTelefone,
  primeiroCampoInvalido,
  validarEnvio,
} from "@/lib/forms/validacao";
import type { RespostaEnvio } from "@/app/forms/[id]/actions";
import { enviarRespostaAction } from "@/app/forms/[id]/actions";

// Ícones pequenos (mesma família de traço usada no site).
function IconeErro() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v4M12 16h.01" strokeLinecap="round" />
    </svg>
  );
}

function IconeOk() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
      <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Obrigatorio() {
  return (
    <>
      <span className="frm-obrig" aria-hidden="true">
        *
      </span>
      <span className="sr-only"> (obrigatório)</span>
    </>
  );
}

function MensagemErro({ id, texto }: { id: string; texto?: string }) {
  if (!texto) return null;
  return (
    <p className="frm-erro" id={id}>
      <IconeErro />
      {texto}
    </p>
  );
}

// Contador visível do textarea (e do detalhe de "Outro").
function Contador({ usado, max }: { usado: number; max: number }) {
  const perto = usado >= max * 0.9;
  return (
    <span className={`frm-contador${perto ? " frm-contador-alerta" : ""}`} aria-hidden="true">
      {usado}/{max}
    </span>
  );
}

export default function FormularioCliente({ def }: { def: FormularioDef }) {
  const perguntas = useMemo(() => perguntasOrdenadas(def), [def]);

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [respostas, setRespostas] = useState<MapaRespostas>({});
  const [erros, setErros] = useState<ErrosFormulario>({});
  const [erroGeral, setErroGeral] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  // Quando a visita chegou pela URL limpa (pierrealexander.com.br/forms/1), o
  // <AjusteBasePath> prefixou o caminho para a hidratação funcionar; com o
  // React montado, devolvemos a URL limpa à barra de endereço. (O envio
  // continua funcionando: o POST em /forms/[id] passa pelo mesmo rewrite.)
  useEffect(() => {
    const limpa = (window as { __urlLimpa?: string }).__urlLimpa;
    if (limpa) history.replaceState(null, "", limpa);
  }, []);

  function limparErro(...chaves: string[]) {
    setErros((atual) => {
      if (!chaves.some((c) => atual[c])) return atual;
      const proximo = { ...atual };
      for (const c of chaves) delete proximo[c];
      return proximo;
    });
    if (erroGeral) setErroGeral("");
  }

  function mudarResposta(p: Pergunta, mudanca: Partial<ValorResposta>) {
    setRespostas((atual) => ({ ...atual, [p.id]: { ...atual[p.id], ...mudanca } }));
  }

  // Rola até o bloco do primeiro campo inválido e foca o controle.
  function irParaCampo(chave: string) {
    const raiz = formRef.current;
    if (!raiz) return;
    const bloco = raiz.querySelector<HTMLElement>(`[data-campo="${chave}"]`);
    bloco?.scrollIntoView({ behavior: "smooth", block: "center" });
    const controle = bloco?.querySelector<HTMLElement>("input, textarea, select");
    controle?.focus({ preventScroll: true });
  }

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    if (enviando) return; // trava de duplo clique

    const resultado = validarEnvio(def, { nome, email, telefone }, respostas);
    if (!resultado.ok) {
      setErros(resultado.erros);
      setErroGeral("Alguns campos precisam de atenção. Revise os itens marcados abaixo.");
      const primeiro = primeiroCampoInvalido(def, resultado.erros);
      if (primeiro) irParaCampo(primeiro);
      return;
    }

    setErros({});
    setErroGeral("");
    setEnviando(true);
    try {
      const r: RespostaEnvio = await enviarRespostaAction({
        formularioId: def.id,
        formularioVersao: def.versao,
        identificacao: { nome, email, telefone },
        respostas,
      });
      if (r.ok) {
        setSucesso(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setErros(r.erros ?? {});
        setErroGeral(r.mensagem ?? "Não foi possível enviar. Tente novamente.");
        const primeiro = r.erros ? primeiroCampoInvalido(def, r.erros) : null;
        if (primeiro) irParaCampo(primeiro);
      }
    } catch {
      // Falha de rede/servidor: nada digitado se perde — só avisa.
      setErroGeral(
        "Falha de conexão ao enviar. Verifique sua internet e tente de novo — suas respostas continuam preenchidas."
      );
    } finally {
      setEnviando(false);
    }
  }

  if (sucesso) {
    return (
      <div className="container frm-wrap">
        <section className="frm-sucesso" role="status" aria-live="polite">
          <div className="frm-sucesso-icone">
            <IconeOk />
          </div>
          <h2>Resposta enviada. Obrigado!</h2>
          <p>
            Recebemos suas respostas com sucesso. Elas nos ajudam a preparar
            eventos cada vez melhores para você.
          </p>
          <Link className="btn btn-primary" href="/">
            Voltar ao site
          </Link>
        </section>
      </div>
    );
  }

  // Blocos na ordem, com o título de grupo aparecendo uma única vez.
  let grupoAnterior: string | undefined;

  return (
    <div className="container frm-wrap">
      {/* method="post": se alguém conseguir submeter ANTES da hidratação do
          React (clique muito rápido), o navegador não pode jogar os dados
          pessoais na URL como faria com o GET padrão. Depois de hidratado, o
          onSubmit assume e o envio é sempre via server action. */}
      <form ref={formRef} className="frm-form" method="post" onSubmit={enviar} noValidate>
        {/* Identificação ----------------------------------------------------- */}
        <section className="frm-bloco" aria-labelledby={`frm-${def.id}-ident`}>
          <h2 className="frm-legenda" id={`frm-${def.id}-ident`}>
            Preencha os dados a seguir
          </h2>
          <p className="frm-ajuda">
            Usamos estes dados apenas para identificar sua resposta.
          </p>
          <div className="frm-campos">
            <div className="frm-campo frm-campo-full" data-campo="nome">
              <label htmlFor="frm-nome">
                Nome completo
                <Obrigatorio />
              </label>
              <input
                id="frm-nome"
                name="nome"
                type="text"
                autoComplete="name"
                maxLength={120}
                placeholder="Seu nome e sobrenome"
                value={nome}
                required
                aria-required="true"
                aria-invalid={erros.nome ? "true" : undefined}
                aria-describedby={erros.nome ? "frm-nome-erro" : undefined}
                onChange={(e) => {
                  setNome(e.target.value);
                  limparErro("nome");
                }}
              />
              <MensagemErro id="frm-nome-erro" texto={erros.nome} />
            </div>
            <div className="frm-campo" data-campo="email">
              <label htmlFor="frm-email">
                E-mail
                <Obrigatorio />
              </label>
              <input
                id="frm-email"
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                maxLength={190}
                placeholder="nome@exemplo.com.br"
                value={email}
                required
                aria-required="true"
                aria-invalid={erros.email ? "true" : undefined}
                aria-describedby={erros.email ? "frm-email-erro" : undefined}
                onChange={(e) => {
                  setEmail(e.target.value);
                  limparErro("email");
                }}
              />
              <MensagemErro id="frm-email-erro" texto={erros.email} />
            </div>
            <div className="frm-campo" data-campo="telefone">
              <label htmlFor="frm-telefone">
                Número de telefone
                <Obrigatorio />
              </label>
              <input
                id="frm-telefone"
                name="telefone"
                type="tel"
                inputMode="tel"
                autoComplete="tel-national"
                maxLength={16}
                placeholder="(11) 91234-5678"
                value={telefone}
                required
                aria-required="true"
                aria-invalid={erros.telefone ? "true" : undefined}
                aria-describedby={erros.telefone ? "frm-telefone-erro" : undefined}
                onChange={(e) => {
                  setTelefone(mascararTelefone(e.target.value));
                  limparErro("telefone");
                }}
              />
              <MensagemErro id="frm-telefone-erro" texto={erros.telefone} />
            </div>
          </div>
        </section>

        {/* Perguntas --------------------------------------------------------- */}
        {perguntas.map((p, indice) => {
          const mostrarGrupo = !!p.grupo && p.grupo !== grupoAnterior;
          grupoAnterior = p.grupo;
          const numero = indice + 1;
          return (
            <div key={p.id}>
              {mostrarGrupo && <h2 className="frm-grupo-titulo">{p.grupo}</h2>}
              <BlocoPergunta
                def={def}
                pergunta={p}
                numero={numero}
                valor={respostas[p.id] ?? {}}
                erros={erros}
                aoMudar={(m, chaves) => {
                  mudarResposta(p, m);
                  limparErro(...chaves);
                }}
              />
            </div>
          );
        })}

        {/* Erro geral + envio ------------------------------------------------ */}
        <div aria-live="assertive">
          {erroGeral && <p className="frm-alerta-geral">{erroGeral}</p>}
        </div>
        <div className="frm-acoes">
          <button className="btn btn-primary frm-enviar" type="submit" disabled={enviando}>
            {enviando && <span className="frm-spinner" aria-hidden="true" />}
            {enviando ? "Enviando…" : "Enviar respostas"}
          </button>
          <p className="frm-voltar">
            <Link href="/">Voltar ao site</Link> · Campos com{" "}
            <span className="frm-obrig" aria-hidden="true">
              *
            </span>
            <span className="sr-only">asterisco</span> são obrigatórios.
          </p>
        </div>
      </form>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Um bloco por pergunta
// ---------------------------------------------------------------------------
function BlocoPergunta({
  def,
  pergunta: p,
  numero,
  valor,
  erros,
  aoMudar,
}: {
  def: FormularioDef;
  pergunta: Pergunta;
  numero: number;
  valor: ValorResposta;
  erros: ErrosFormulario;
  aoMudar: (mudanca: Partial<ValorResposta>, limparChaves: string[]) => void;
}) {
  const base = `frm-${def.id}-${p.id}`;
  const chaveDetalhe = `${p.id}__detalhe`;
  const erro = erros[p.id];
  const erroDetalhe = erros[chaveDetalhe];
  const comErro = !!(erro || erroDetalhe);

  const detalheAberto =
    p.tipo === "unica"
      ? !!p.opcoes?.find((o) => o.valor === valor.valor)?.abreDetalhe
      : p.tipo === "multipla"
        ? (valor.valores ?? []).some(
            (v) => p.opcoes?.find((o) => o.valor === v)?.abreDetalhe
          )
        : false;

  const maxDetalhe = p.maxLength ?? 300;

  const campoDetalhe = detalheAberto && (
    <div className="frm-detalhe" data-campo={chaveDetalhe}>
      <label htmlFor={`${base}-detalhe`}>
        {p.rotuloDetalhe ?? "Conte mais"}
        <Obrigatorio />
      </label>
      <textarea
        id={`${base}-detalhe`}
        rows={2}
        maxLength={maxDetalhe}
        value={valor.detalhe ?? ""}
        aria-required="true"
        aria-invalid={erroDetalhe ? "true" : undefined}
        aria-describedby={erroDetalhe ? `${base}-detalhe-erro` : undefined}
        onChange={(e) => aoMudar({ detalhe: e.target.value }, [chaveDetalhe])}
      />
      <Contador usado={(valor.detalhe ?? "").length} max={maxDetalhe} />
      <MensagemErro id={`${base}-detalhe-erro`} texto={erroDetalhe} />
    </div>
  );

  // ---- seleção única / múltipla -------------------------------------------
  if (p.tipo === "unica" || p.tipo === "multipla") {
    const multipla = p.tipo === "multipla";
    return (
      <fieldset
        className={`frm-bloco${comErro ? " frm-bloco-erro" : ""}`}
        data-campo={p.id}
        aria-describedby={erro ? `${base}-erro` : undefined}
      >
        <legend className="frm-legenda">
          {numero}. {p.titulo}
          {p.obrigatoria && <Obrigatorio />}
        </legend>
        {p.ajuda && <p className="frm-ajuda">{p.ajuda}</p>}
        <div className="frm-opcoes">
          {(p.opcoes ?? []).map((o) => {
            const marcado = multipla
              ? (valor.valores ?? []).includes(o.valor)
              : valor.valor === o.valor;
            return (
              <label className="frm-opcao" key={o.valor} htmlFor={`${base}-${o.valor}`}>
                <input
                  id={`${base}-${o.valor}`}
                  type={multipla ? "checkbox" : "radio"}
                  name={base}
                  value={o.valor}
                  checked={marcado}
                  onChange={() => {
                    if (multipla) {
                      const atuais = valor.valores ?? [];
                      const proximos = marcado
                        ? atuais.filter((v) => v !== o.valor)
                        : [...atuais, o.valor];
                      aoMudar({ valores: proximos }, [p.id, chaveDetalhe]);
                    } else {
                      aoMudar({ valor: o.valor }, [p.id, chaveDetalhe]);
                    }
                  }}
                />
                {o.rotulo}
              </label>
            );
          })}
        </div>
        {campoDetalhe}
        <MensagemErro id={`${base}-erro`} texto={erro} />
      </fieldset>
    );
  }

  // ---- escala --------------------------------------------------------------
  if (p.tipo === "escala") {
    return (
      <fieldset
        className={`frm-bloco${comErro ? " frm-bloco-erro" : ""}`}
        data-campo={p.id}
        aria-describedby={erro ? `${base}-erro` : undefined}
      >
        <legend className="frm-legenda">
          {p.titulo}
          {p.obrigatoria && <Obrigatorio />}
        </legend>
        {p.ajuda && <p className="frm-ajuda">{p.ajuda}</p>}
        <div className="frm-escala">
          {(p.niveis ?? []).map((n) => (
            <label className="frm-escala-item" key={n.nota} htmlFor={`${base}-${n.nota}`}>
              <input
                id={`${base}-${n.nota}`}
                type="radio"
                name={base}
                value={n.nota}
                checked={valor.nota === n.nota}
                onChange={() => aoMudar({ nota: n.nota }, [p.id])}
              />
              <span className="frm-escala-nota" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.5 14.9 8.6l6.6.8-4.9 4.6 1.3 6.5L12 17.3l-5.9 3.2 1.3-6.5L2.5 9.4l6.6-.8z" />
                </svg>
                {n.nota}
              </span>
              <span className="frm-escala-rotulo">
                <span className="sr-only">{n.nota} — </span>
                {n.rotulo}
              </span>
            </label>
          ))}
        </div>
        <MensagemErro id={`${base}-erro`} texto={erro} />
      </fieldset>
    );
  }

  // ---- texto livre ----------------------------------------------------------
  const max = p.maxLength ?? 1000;
  return (
    <div
      className={`frm-bloco${comErro ? " frm-bloco-erro" : ""}`}
      data-campo={p.id}
    >
      <label className="frm-legenda" htmlFor={`${base}-texto`}>
        {numero}. {p.titulo}
        {p.obrigatoria && <Obrigatorio />}
      </label>
      {p.ajuda && <p className="frm-ajuda">{p.ajuda}</p>}
      <textarea
        id={`${base}-texto`}
        rows={4}
        maxLength={max}
        placeholder={p.placeholder}
        value={valor.texto ?? ""}
        aria-required={p.obrigatoria ? "true" : undefined}
        aria-invalid={erro ? "true" : undefined}
        aria-describedby={erro ? `${base}-erro` : undefined}
        onChange={(e) => aoMudar({ texto: e.target.value }, [p.id])}
      />
      <Contador usado={(valor.texto ?? "").length} max={max} />
      <MensagemErro id={`${base}-erro`} texto={erro} />
    </div>
  );
}
