"use client";

import { Suspense } from "react";
import { useActionState, useState } from "react";
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
  const [showPw, setShowPw] = useState(false);

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
            <div style={{ position: "relative" }}>
              <input
                id="password"
                name="password"
                type={showPw ? "text" : "password"}
                required
                autoComplete="current-password"
                style={{ paddingRight: 44 }}
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                aria-label={showPw ? "Ocultar senha" : "Mostrar senha"}
                title={showPw ? "Ocultar senha" : "Mostrar senha"}
                style={{
                  position: "absolute",
                  right: 8,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "transparent",
                  border: 0,
                  cursor: "pointer",
                  color: "#8a7f72",
                  padding: 4,
                  display: "grid",
                  placeItems: "center",
                }}
              >
                {showPw ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M3 3l18 18" />
                    <path d="M10.6 10.6a3 3 0 0 0 4.2 4.2" />
                    <path d="M9.9 5.1A9.4 9.4 0 0 1 12 5c6.5 0 10 7 10 7a15.9 15.9 0 0 1-2.4 3.2M6.5 6.6A15.8 15.8 0 0 0 2 12s3.5 7 10 7a9.3 9.3 0 0 0 3.5-.7" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
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
