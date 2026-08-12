"use client";

import { useMemo, useState } from "react";
import type { OpcaoLink } from "@/lib/menu";

export const ehExterno = (v: string) => /^https?:\/\//i.test(v.trim());

// Campo de link com escolha entre INTERNO (lista de páginas do site) e
// EXTERNO (URL digitada). Default: interno — a menos que o valor atual já
// seja uma URL http(s).
export default function LinkField({
  value,
  onChange,
  opcoes,
  style,
}: {
  value: string;
  onChange: (v: string) => void;
  opcoes: OpcaoLink[];
  style?: React.CSSProperties;
}) {
  const [modo, setModo] = useState<"interno" | "externo">(ehExterno(value) ? "externo" : "interno");

  const grupos = useMemo(() => {
    const m = new Map<string, OpcaoLink[]>();
    for (const o of opcoes) {
      const arr = m.get(o.grupo) ?? [];
      arr.push(o);
      m.set(o.grupo, arr);
    }
    return [...m.entries()];
  }, [opcoes]);

  const naLista = opcoes.some((o) => o.href === value);
  const radio: React.CSSProperties = { display: "inline-flex", gap: 4, alignItems: "center", cursor: "pointer" };

  return (
    <div style={{ display: "grid", gap: 6 }}>
      <div style={{ display: "flex", gap: 14, fontSize: 13, color: "#555" }}>
        <label style={radio}>
          <input type="radio" checked={modo === "interno"} onChange={() => setModo("interno")} /> Link interno
        </label>
        <label style={radio}>
          <input type="radio" checked={modo === "externo"} onChange={() => setModo("externo")} /> Link externo
        </label>
      </div>

      {modo === "interno" ? (
        <select style={style} value={value} onChange={(e) => onChange(e.target.value)}>
          <option value="">— escolher página —</option>
          {value && !naLista ? <option value={value}>{value} (link atual)</option> : null}
          {grupos.map(([grupo, itens]) => (
            <optgroup key={grupo} label={grupo}>
              {itens.map((o) => (
                <option key={o.href} value={o.href}>
                  {o.label} — {o.href}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      ) : (
        <input
          style={style}
          value={value}
          placeholder="https://exemplo.com"
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  );
}
