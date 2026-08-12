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

// Presets de tamanho por tipo de imagem (rec = recomendado, min/max em px).
type Spec = { rec: [number, number]; min: [number, number]; max: [number, number]; formato: string };
export const PRESETS_IMAGEM: Record<string, Spec> = {
  logo: { rec: [400, 120], min: [200, 60], max: [800, 240], formato: "PNG transparente, horizontal" },
  favicon: { rec: [512, 512], min: [64, 64], max: [1024, 1024], formato: "PNG quadrado" },
  "logo-rodape": { rec: [400, 120], min: [200, 60], max: [800, 240], formato: "PNG (versão clara), horizontal" },
  "capa-categoria": { rec: [1200, 900], min: [600, 450], max: [2400, 1800], formato: "horizontal 4:3" },
  banner: { rec: [1920, 720], min: [1200, 450], max: [2400, 900], formato: "horizontal largo" },
  produto: { rec: [1000, 1000], min: [600, 600], max: [2000, 2000], formato: "quadrado, fundo branco" },
};

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

// Lê a largura/altura reais de um arquivo de imagem (no navegador).
function lerDimensoes(file: File): Promise<{ w: number; h: number }> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new window.Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ w: img.naturalWidth, h: img.naturalHeight });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("imagem inválida"));
    };
    img.src = url;
  });
}

export default function ImagemCampo({
  name,
  label,
  defaultValue = "",
  ajuda,
  formato = "wide",
  value,
  onChange,
  preset,
}: {
  name?: string;
  label: string;
  defaultValue?: string;
  ajuda?: React.ReactNode;
  formato?: "wide" | "square";
  value?: string;
  onChange?: (v: string) => void;
  preset?: keyof typeof PRESETS_IMAGEM;
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
  const spec = preset ? PRESETS_IMAGEM[preset] : undefined;

  const fileRef = useRef<HTMLInputElement>(null);
  const [enviando, setEnviando] = useState(false);
  const [erroUp, setErroUp] = useState("");
  const [aviso, setAviso] = useState("");
  const [arrastando, setArrastando] = useState(false);

  async function enviarArquivo(file: File) {
    const fd = new FormData();
    fd.append("file", file);
    const resp = await fetch(`${BASE_PATH}/api/upload`, { method: "POST", body: fd });
    const data = await resp.json().catch(() => ({}));
    if (!resp.ok || !data.url) throw new Error(data.error || "Falha no upload.");
    setValor(data.url);
    setErro(false);
  }

  async function processar(file: File) {
    setErroUp("");
    setAviso("");
    if (!file.type.startsWith("image/")) {
      setErroUp("O arquivo precisa ser uma imagem.");
      return;
    }
    // Checagem de dimensões conforme o preset.
    if (spec) {
      try {
        const { w, h } = await lerDimensoes(file);
        if (w < spec.min[0] || h < spec.min[1]) {
          setErroUp(`Imagem pequena demais (${w}×${h}px). Mínimo ${spec.min[0]}×${spec.min[1]}px — ficaria borrada.`);
          return;
        }
        if (w > spec.max[0] || h > spec.max[1]) {
          setAviso(`Imagem grande (${w}×${h}px) — será reduzida automaticamente.`);
        }
      } catch {
        /* se não conseguir ler as dimensões, segue o envio mesmo assim */
      }
    }
    setEnviando(true);
    try {
      await enviarArquivo(file);
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
    <div
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setArrastando(true);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setArrastando(false);
      }}
      onDrop={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setArrastando(false);
        const f = e.dataTransfer.files?.[0];
        if (f) processar(f);
      }}
      style={{
        display: "flex",
        gap: "1rem",
        alignItems: "flex-start",
        border: arrastando ? "2px dashed #b08d57" : "2px dashed transparent",
        borderRadius: 10,
        padding: 6,
        margin: -6,
        background: arrastando ? "#fbf7f0" : "transparent",
        transition: "background .1s",
      }}
    >
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

        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6, flexWrap: "wrap" }}>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) processar(f);
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
          <span style={{ fontSize: 12, color: "#aaa" }}>ou arraste a imagem aqui</span>
          {erroUp && <span style={{ color: "#b00020", fontSize: 12, flexBasis: "100%" }}>{erroUp}</span>}
          {aviso && <span style={{ color: "#a15c00", fontSize: 12, flexBasis: "100%" }}>{aviso}</span>}
        </div>

        {spec && (
          <p style={{ ...ajudaStyle, color: "#8a7f72" }}>
            📐 Recomendado <strong>{spec.rec[0]}×{spec.rec[1]}px</strong> — {spec.formato}. (mín {spec.min[0]}×{spec.min[1]}, máx {spec.max[0]}×{spec.max[1]})
          </p>
        )}
        {ajuda && <p style={ajudaStyle}>{ajuda}</p>}
      </div>
    </div>
  );
}
