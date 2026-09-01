"use server";

// =============================================================================
// ENVIO DE RESPOSTA (server action)
// A validação DAQUI é a que vale: o payload do navegador é tratado como hostil
// do início ao fim (id de formulário, opções, tamanhos, tudo revalidado).
// Server actions do Next já vêm com proteção CSRF (checagem de Origin/Host).
//
// Privacidade: nada de dado pessoal em log — só o id do formulário e o tipo do
// erro. IP não é gravado: vira um HMAC truncado usado apenas no rate limit.
// =============================================================================
import { headers } from "next/headers";
import { getFormulario } from "@/lib/forms/definicoes";
import { validarEnvio } from "@/lib/forms/validacao";
import {
  registrarTentativa,
  respostaRecenteDoMesmoEmail,
  salvarResposta,
} from "@/lib/forms/repositorio";
import type { ErrosFormulario, Identificacao, MapaRespostas } from "@/lib/forms/tipos";

export type EnvioPayload = {
  formularioId: number;
  formularioVersao: number;
  identificacao: Identificacao;
  respostas: MapaRespostas;
};

export type RespostaEnvio = {
  ok: boolean;
  // Erros por campo (mesmas chaves do cliente) e/ou mensagem geral amigável.
  erros?: ErrosFormulario;
  mensagem?: string;
};

// Primeiro IP do X-Forwarded-For (o que a Vercel/proxy define) — usado SÓ para
// derivar a chave do rate limit, nunca gravado.
async function ipDoPedido(): Promise<string> {
  const h = await headers();
  const xff = h.get("x-forwarded-for") ?? "";
  const primeiro = xff.split(",")[0]?.trim();
  return primeiro || h.get("x-real-ip") || "desconhecido";
}

// Página de origem (referer sem querystring) — contexto útil no painel, sem
// carregar dado pessoal ou parâmetro de campanha.
async function origemDoPedido(): Promise<string | null> {
  const h = await headers();
  const ref = h.get("referer");
  if (!ref) return null;
  try {
    const u = new URL(ref);
    return `${u.origin}${u.pathname}`.slice(0, 255);
  } catch {
    return null;
  }
}

export async function enviarRespostaAction(
  payload: EnvioPayload
): Promise<RespostaEnvio> {
  // 1. Formulário precisa existir e estar ativo (id da URL não é confiável).
  const def = getFormulario(payload?.formularioId);
  if (!def) return { ok: false, mensagem: "Formulário não encontrado." };
  if (!def.ativo) {
    return { ok: false, mensagem: "Este formulário não está mais recebendo respostas." };
  }

  // 2. Rate limit por remetente (anti-spam), antes de qualquer trabalho caro.
  const ip = await ipDoPedido();
  const limite = await registrarTentativa(ip, def.id);
  if (!limite.permitido) {
    return {
      ok: false,
      mensagem: "Muitos envios em sequência. Aguarde alguns minutos e tente novamente.",
    };
  }

  // 3. Revalidação completa no servidor (nunca confiar no navegador).
  const resultado = validarEnvio(
    def,
    payload?.identificacao ?? { nome: "", email: "", telefone: "" },
    payload?.respostas ?? {}
  );
  if (!resultado.ok || !resultado.identificacao || !resultado.respostas) {
    return {
      ok: false,
      erros: resultado.erros,
      mensagem: "Alguns campos precisam de atenção. Revise os itens marcados.",
    };
  }

  try {
    // 4. Duplo clique / reenvio imediato: devolve OK sem criar outra linha.
    const repetida = await respostaRecenteDoMesmoEmail(
      def.id,
      resultado.identificacao.email
    );
    if (repetida) return { ok: true };

    // 5. Grava. A versão registrada é a da DEFINIÇÃO atual (a que o visitante
    //    de fato respondeu), não a que o navegador alegou.
    await salvarResposta({
      formularioId: def.id,
      formularioVersao: def.versao,
      nome: resultado.identificacao.nome,
      email: resultado.identificacao.email,
      telefone: resultado.identificacao.telefone,
      respostas: resultado.respostas,
      origem: await origemDoPedido(),
    });
    return { ok: true };
  } catch (erro) {
    // Log sem dado pessoal: id do formulário + classe do erro.
    console.error(
      `[forms] falha ao gravar resposta do formulário ${def.id}:`,
      erro instanceof Error ? erro.message : "erro desconhecido"
    );
    return {
      ok: false,
      mensagem:
        "Não conseguimos gravar sua resposta agora. Tente novamente em instantes — o que você preencheu foi mantido.",
    };
  }
}
