"use client";

import { Suspense } from "react";
import { useActionState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { loginAction } from "./actions";
import type { LoginState } from "./types";

function LoginForm() {
  const params = useSearchParams();
  const next = params.get("next") || "/painel";
  const [state, formAction, pending] = useActionState<LoginState, FormData>(
    loginAction,
    {}
  );

  return (
    <main className="auth">
      <div className="auth-card">
        <Link href="/" className="auth-brand">
          Pierre Alexander
        </Link>
        <h1>Entrar</h1>
        <p className="auth-sub">Acesse o painel da Pierre.</p>

        <form action={formAction} className="auth-form">
          <input type="hidden" name="next" value={next} />
          <div className="form-field full">
            <label htmlFor="email">E-mail</label>
            <input id="email" name="email" type="email" required autoComplete="email" />
          </div>
          <div className="form-field full">
            <label htmlFor="password">Senha</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
            />
          </div>
          {state?.error && <p className="auth-error">{state.error}</p>}
          <button className="btn btn-primary" type="submit" disabled={pending}>
            {pending ? "Entrando…" : "Entrar"}
          </button>
        </form>

        <p style={{ marginTop: "1rem", textAlign: "center" }}>
          <Link href="/recuperar-senha">Esqueci minha senha</Link>
        </p>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
