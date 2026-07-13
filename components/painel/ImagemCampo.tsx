"use client";

import { useRef, useState } from "react";
import { asset, BASE_PATH } from "@/lib/site";

// Resolve o caminho da imagem igual o site faz (Header/Footer):
// URL completa ou já prefixada passa direto; caminho local ("/...") ganha o basePath.
function resolveSrc(url: string): string {
  const u = url.trim();
  if (!u) return "";
  if (/^https?:\/\//i.test(u) || u.startsWith(BASE_PATH)) return u;
  if (u.startsWith("/")) return asset(u);
  return u;
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: 8,
  border: "1px solid #ddd",
  borderRadius: 6,
  fontFamily: "inherit",
  fontSize: 14,
};
const labelStyle: React.CSSProperties = { display: "block", fontWeight: 600, marginBottom: 4, fontSize: 13 };
const ajudaStyle: React.CSSProperties = { margin: "3px 0 0", fontSize: 12, color: "#999" };

export default function ImagemCampo({
  name,
  label,
  defaultValue = "",
  ajuda,
  formato = "wide",
  value,
  onChange,
}: {
  name?: string;
  label: string;
  defaultValue?: string;
  ajuda?: React.ReactNode;
  formato?: "wide" | "square";
  // Modo controlado: se onChange for passado, o valor vem de `value` (e o campo
  // não emite um input com `name` — quem controla persiste o valor).
  value?: string;
  onChange?: (v: string) => void;
}) {
  const controlado = onChange !== undefined;
  const [interno, setInterno] = useState(defaultValue);
  const [erro, setErro] = useState(false);
  const valor = controlado ? value ?? "" : interno;
  const setValor = (v: string) => {
    if (controlado) onChange!(v);
    else setInterno(v);
  };
  const src = resolveSrc(valor);
  const quadrado = formato === "square";

  const fileRef = useRef<HTMLInputElement>(null);
  const [enviando, setEnviando] = useState(false);
  const [erroUp, setErroUp] = useState("");

  async function enviar(file: File) {
    setEnviando(true);
    setErroUp("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const resp = await fetch(`${BASE_PATH}/api/upload`, { method: "POST", body: fd });
      const data = await resp.json().catch(() => ({}));
      if (!resp.ok || !data.url) throw new Error(data.error || "Falha no upload.");
      setValor(data.url);
      setErro(false);
    } catch (e) {
      setErroUp(e instanceof Error ? e.message : "Falha no upload.");
    } finally {
      setEnviando(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  const previewBox: React.CSSProperties = {
    width: quadrado ? 64 : 180,
    height: 64,
    flex: "none",
    border: "1px solid #eee",
    borderRadius: 8,
    background: "#faf7f2 repeating-conic-gradient(#f0ece5 0% 25%, transparent 0% 50%) 50% / 14px 14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    color: "#bbb",
    fontSize: 11,
    textAlign: "center",
    padding: 4,
  };

  return (
    <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
      <div style={previewBox}>
        {src && !erro ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={label}
            style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
            onLoad={() => setErro(false)}
            onError={() => setErro(true)}
          />
        ) : (
          <span>{valor.trim() ? "não encontrada" : "sem imagem"}</span>
        )}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <label style={labelStyle}>{label}</label>
        <input
          name={name}
          value={valor}
          onChange={(e) => {
            setValor(e.target.value);
            setErro(false);
          }}
          style={inputStyle}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) enviar(f);
            }}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={enviando}
            style={{
              border: "1px solid #b08d57",
              background: enviando ? "#f2ece2" : "#fff",
              color: "#7a5c1e",
              borderRadius: 6,
              padding: "5px 12px",
              cursor: enviando ? "default" : "pointer",
              fontSize: 13,
            }}
          >
            {enviando ? "Enviando…" : "⬆ Enviar imagem"}
          </button>
          {erroUp && <span style={{ color: "#b00020", fontSize: 12 }}>{erroUp}</span>}
        </div>

        <p style={ajudaStyle}>{ajuda}</p>
      </div>
    </div>
  );
}
