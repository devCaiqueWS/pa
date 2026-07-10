export default function TopStrip({ mensagens }: { mensagens: string[] }) {
  if (!mensagens || mensagens.length === 0) return null;
  return (
    <div className="topstrip">
      <div className="container topstrip-inner">
        {mensagens.map((m, i) => (
          <span key={i} className={i === 0 ? "" : "topstrip-extra"}>
            {m}
          </span>
        ))}
      </div>
    </div>
  );
}
