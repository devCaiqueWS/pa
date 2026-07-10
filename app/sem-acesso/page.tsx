import Link from "next/link";
import { logoutAction } from "@/app/login/actions";

export default function SemAcessoPage() {
  return (
    <main className="auth">
      <div className="auth-card">
        <h1>Sem acesso</h1>
        <p className="auth-sub">Sua conta não tem permissão para acessar o painel.</p>
        <p className="auth-warn">
          Se você deveria ter acesso, peça a um administrador para ajustar o seu perfil de usuário.
        </p>
        <form action={logoutAction}>
          <button className="btn btn-outline" type="submit">
            Sair
          </button>
        </form>
        <Link className="btn btn-primary" href="/" style={{ marginTop: 10 }}>
          Voltar ao site
        </Link>
      </div>
    </main>
  );
}
