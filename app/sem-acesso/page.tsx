import Link from "next/link";
import { signOut } from "@/app/admin/actions";

export default function SemAcessoPage() {
  return (
    <main className="auth">
      <div className="auth-card">
        <h1>Sem acesso</h1>
        <p className="auth-sub">
          Sua conta não tem permissão de administrador.
        </p>
        <p className="auth-warn">
          Se você deveria ter acesso, peça a um admin para ajustar seu papel para
          <code> admin</code> na tabela <code>profiles</code> do Supabase.
        </p>
        <form action={signOut}>
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
