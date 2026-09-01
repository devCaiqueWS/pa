// =============================================================================
// GRÁFICOS DO DASHBOARD — HTML/CSS puros (server components)
// O projeto não tinha biblioteca de gráficos; para barras e distribuições,
// HTML acessível pesa zero bytes de JS no cliente e herda o design do site.
// Cada gráfico carrega os números por extenso (nada "só visual").
// =============================================================================
import { rotuloDiaCurto } from "@/lib/forms/datas";
import type { FatiaDistribuicao, PontoSerie } from "@/lib/forms/metricas";

// Barras horizontais: distribuição de opções (motivos, facilitadores, notas…).
export function Barras({
  fatias,
  rotuloVazio = "Ainda sem respostas para esta pergunta.",
}: {
  fatias: FatiaDistribuicao[];
  rotuloVazio?: string;
}) {
  const maior = Math.max(...fatias.map((f) => f.total), 0);
  if (maior === 0) return <p className="muted">{rotuloVazio}</p>;
  return (
    <ul className="fdash-barras" style={{ listStyle: "none", margin: 0, padding: 0 }}>
      {fatias.map((f) => (
        <li className="fdash-barra" key={f.valor}>
          <span className="fdash-barra-rotulo">{f.rotulo}</span>
          <span className="fdash-barra-trilha" aria-hidden="true">
            <span
              className="fdash-barra-valor"
              style={{
                width: f.total === 0 ? 0 : `${Math.max(2, (f.total / maior) * 100)}%`,
              }}
            />
          </span>
          <span className="fdash-barra-num">
            {f.total} · {f.percentual}%
          </span>
        </li>
      ))}
    </ul>
  );
}

// Colunas por dia: volume de respostas recebidas por período.
export function SerieDiaria({ pontos }: { pontos: PontoSerie[] }) {
  if (pontos.length === 0) return <p className="muted">Ainda sem respostas no período.</p>;
  const maior = Math.max(...pontos.map((p) => p.total));
  // Muitos dias não cabem: mostra os 30 mais recentes.
  const vistos = pontos.slice(-30);
  return (
    <div
      className="fdash-serie"
      role="img"
      aria-label={`Respostas por dia: ${vistos
        .map((p) => `${rotuloDiaCurto(p.dia)}: ${p.total}`)
        .join(", ")}`}
    >
      {vistos.map((p) => (
        <div className="fdash-serie-col" key={p.dia}>
          <span className="fdash-serie-num">{p.total}</span>
          <span
            className="fdash-serie-barra"
            style={{ height: `${Math.max(4, (p.total / maior) * 78)}%` }}
          />
          <span className="fdash-serie-rotulo">{rotuloDiaCurto(p.dia)}</span>
        </div>
      ))}
    </div>
  );
}

// Média de uma escala 1–3 com estrelas proporcionais.
export function MediaEscala({ media, maximo }: { media: number; maximo: number }) {
  const cheias = Math.round(media);
  return (
    <div className="fdash-media">
      <span className="fdash-media-valor">{media.toFixed(2).replace(".", ",")}</span>
      <span className="fdash-media-max">/ {maximo}</span>
      <span className="fdash-estrelas" aria-hidden="true">
        {"★".repeat(Math.max(0, cheias))}
        {"☆".repeat(Math.max(0, maximo - cheias))}
      </span>
    </div>
  );
}
