import Link from "next/link";

export default function CtaBand() {
  return (
    <section className="section compact">
      <div className="container cta-band">
        <div>
          <h2>A próxima venda começa aqui.</h2>
          <p>
            Compre Pierre Alexander ou comece a vender uma marca que as pessoas
            já conhecem.
          </p>
        </div>
        <Link className="btn btn-carbon" href="/consultora">
          Quero ser consultora
        </Link>
      </div>
    </section>
  );
}
