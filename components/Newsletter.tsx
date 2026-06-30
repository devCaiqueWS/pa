// Bloco de captura de e-mail (newsletter), padrão de e-commerce.
// Visual por enquanto — na Fase 2 o submit grava lead no Supabase/CRM.
export default function Newsletter() {
  return (
    <section className="section">
      <div className="container">
        <div className="news">
          <div className="news-copy">
            <h2>Receba novidades e ofertas Pierre</h2>
            <p>Lançamentos, campanhas e dicas de beleza direto no seu e-mail.</p>
          </div>
          <form className="news-form" aria-label="Cadastro de newsletter">
            <input
              type="email"
              name="email"
              placeholder="Seu melhor e-mail"
              aria-label="E-mail"
              required
            />
            <button type="submit" className="btn btn-primary">
              Cadastrar
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
