"use client";

import { Suspense, useActionState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { resetPasswordAction } from "./actions";
import type { ResetState } from "./types";

function RedefinirForm() {
  const token = useSearchParams().get("token") || "";
  const [state, action, pending] = useActionState<ResetState, FormData>(
    resetPasswordAction,
    {}
  );

  return (
    <main className="auth">
      <div className="auth-card">
        <Link href="/" className="auth-brand">
          Pierre Alexander
        </Link>
        <h1>Definir nova senha</h1>

        {state?.ok ? (
          <>
            <p className="auth-sub">Senha alterada com sucesso.</p>
            <Link className="btn btn-primary" href="/login">
              Ir para o login
            </Link>
          </>
        ) : !token ? (
          <p className="auth-error">
            Link inválido. Solicite uma nova redefinição em “Esqueci minha senha”.
          </p>
        ) : (
          <form action={action} className="auth-form">
            <input type="hidden" name="token" value={token} />
            <div className="form-field full">
              <label htmlFor="password">Nova senha</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
              />
            </div>
            <div className="form-field full">
              <label htmlFor="password2">Confirmar senha</label>
              <input
                id="password2"
                name="password2"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
              />
            </div>
            {state?.error && <p className="auth-error">{state.error}</p>}
            <button className="btn btn-primary" type="submit" disabled={pending}>
              {pending ? "Salvando…" : "Salvar nova senha"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}

export default function RedefinirSenhaPage() {
  return (
    <Suspense>
      <RedefinirForm />
    </Suspense>
  );
}
