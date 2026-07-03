"use client";

import { useActionState } from "react";
import Link from "next/link";
import { requestResetAction } from "./actions";
import type { ResetRequestState } from "./types";

export default function RecuperarSenhaPage() {
  const [state, action, pending] = useActionState<ResetRequestState, FormData>(
    requestResetAction,
    {}
  );

  return (
    <main className="auth">
      <div className="auth-card">
        <Link href="/" className="auth-brand">
          Pierre Alexander
        </Link>
        <h1>Recuperar senha</h1>

        {state?.ok ? (
          <p className="auth-sub">
            Se o e-mail estiver cadastrado, enviamos as instruções para redefinir
            sua senha. Verifique sua caixa de entrada (e o spam).
          </p>
        ) : (
          <>
            <p className="auth-sub">
              Informe seu e-mail para receber o link de redefinição.
            </p>
            <form action={action} className="auth-form">
              <div className="form-field full">
                <label htmlFor="email">E-mail</label>
                <input id="email" name="email" type="email" required autoComplete="email" />
              </div>
              {state?.error && <p className="auth-error">{state.error}</p>}
              <button className="btn btn-primary" type="submit" disabled={pending}>
                {pending ? "Enviando…" : "Enviar link"}
              </button>
            </form>
          </>
        )}

        <p style={{ marginTop: "1rem" }}>
          <Link href="/login">← Voltar ao login</Link>
        </p>
      </div>
    </main>
  );
}
