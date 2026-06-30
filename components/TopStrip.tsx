const MESSAGES = [
  "Encontre uma consultora Pierre perto de você",
  "Beleza que funciona. Há décadas.",
  "Novas fragrâncias chegando — fique por dentro",
];

export default function TopStrip() {
  return (
    <div className="topstrip">
      <div className="container topstrip-inner">
        {MESSAGES.map((m, i) => (
          <span key={i} className={i === 0 ? "" : "topstrip-extra"}>
            {m}
          </span>
        ))}
      </div>
    </div>
  );
}
