"use client";

import { useRef, useState } from "react";
import ImagemCampo from "@/components/painel/ImagemCampo";
import LinkField from "@/components/painel/LinkField";
// Só o TIPO vem de lib/banners (import de tipo some na compilação). Nada de
// importar valor de lá: aquele arquivo fala com o MySQL e é só de servidor.
import type { Banner } from "@/lib/banners";
import type { OpcaoLink } from "@/lib/menu";

type Row = Banner & { id: number };

function bannerVazio(): Banner {
  return {
    tipo: "imagem",
    imagem: "",
    video: "",
    alt: "",
    estilo: "padrao",
    mostrarLogo: false,
    eyebrow: "",
    titulo: "",
    subtitulo: "",
    botao1Texto: "",
    botao1Link: "",
    botao2Texto: "",
    botao2Link: "",
    ativo: true,
  };
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

function proxId(arr: Row[]): number {
  return arr.reduce((m, x) => Math.max(m, x.id), 0) + 1;
}

export default function BannersEditor({
  initial,
  opcoesLink,
}: {
  initial: Banner[];
  opcoesLink: OpcaoLink[];
}) {
  const [rows, setRows] = useState<Row[]>(() => initial.map((b, i) => ({ ...b, id: i + 1 })));
  const dragId = useRef<number | null>(null);
  const [draggingId, setDraggingId] = useState<number | null>(null);

  const jsonValue = JSON.stringify(
    rows.map(({ id: _id, ...b }) => b) // a ordem do array É a ordem dos slides
  );

  const add = () => setRows((p) => [...p, { ...bannerVazio(), id: proxId(p) }]);
  const remove = (id: number) => setRows((p) => p.filter((r) => r.id !== id));
  function patch<K extends keyof Banner>(id: number, campo: K, v: Banner[K]) {
    setRows((p) => p.map((r) => (r.id === id ? { ...r, [campo]: v } : r)));
  }

  function liveMove(fromId: number, toId: number) {
    if (fromId === toId) return;
    setRows((prev) => {
      const arr = [...prev];
      const from = arr.findIndex((x) => x.id === fromId);
      if (from < 0) return prev;
      const [it] = arr.splice(from, 1);
      const to = arr.findIndex((x) => x.id === toId);
      arr.splice(to < 0 ? arr.length : to, 0, it);
      return arr;
    });
  }

  return (
    <div>
      <input type="hidden" name="banners_json" value={jsonValue} readOnly />

      <div style={{ display: "grid", gap: "1rem" }}>
        {rows.map((b, i) => {
          const ehVideo = b.tipo === "video";
          const ehLancamento = b.estilo === "lancamento";
          return (
            <div
              key={b.id}
              draggable
              onDragStart={(e) => {
                dragId.current = b.id;
                setDraggingId(b.id);
                e.dataTransfer.effectAllowed = "move";
              }}
              onDragEnter={() => {
                if (dragId.current != null && dragId.current !== b.id) liveMove(dragId.current, b.id);
              }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => e.preventDefault()}
              onDragEnd={() => {
                setDraggingId(null);
                dragId.current = null;
              }}
              style={{
                border: "1px solid #e7e2da",
                borderRadius: 10,
                padding: "1rem",
                background: "#fff",
                opacity: draggingId === b.id ? 0.4 : 1,
              }}
            >
              {/* Cabeçalho do slide */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: ".75rem" }}>
                <span aria-hidden="true" title="Arraste para reordenar" style={{ color: "#bbb", fontSize: 18, cursor: "grab" }}>
                  ⠿
                </span>
                <span
                  style={{
                    background: "#f4efe7",
                    color: "#8a7a68",
                    borderRadius: 20,
                    fontSize: 12,
                    fontWeight: 700,
                    padding: "2px 9px",
                    flex: "none",
                  }}
                >
                  {i + 1}º
                </span>
                <strong style={{ fontSize: 15, flex: 1 }}>{b.titulo || b.eyebrow || "Novo banner"}</strong>
                <label style={{ display: "inline-flex", gap: 5, alignItems: "center", fontSize: 13, color: "#555", cursor: "pointer" }}>
                  <input type="checkbox" checked={b.ativo} onChange={(e) => patch(b.id, "ativo", e.target.checked)} />
                  Exibir no site
                </label>
                <button
                  type="button"
                  onClick={() => remove(b.id)}
                  style={{ border: "1px solid #eee", background: "#fff", borderRadius: 6, cursor: "pointer", color: "#b00020", fontSize: 12, padding: "5px 10px" }}
                >
                  Remover
                </button>
              </div>

              {/* Mídia */}
              <div style={{ display: "grid", gridTemplateColumns: "160px 1fr", gap: ".75rem", marginBottom: ".75rem" }}>
                <div>
                  <label style={labelStyle}>Tipo</label>
                  <select
                    style={inputStyle}
                    value={b.tipo}
                    onChange={(e) => patch(b.id, "tipo", e.target.value as Banner["tipo"])}
                  >
                    <option value="imagem">Imagem</option>
                    <option value="video">Vídeo</option>
                  </select>
                </div>
                <div>
                  <ImagemCampo
                    label={ehVideo ? "Quadro de capa do vídeo (poster)" : "Imagem do banner"}
                    preset="banner"
                    value={b.imagem}
                    onChange={(v) => patch(b.id, "imagem", v)}
                    ajuda={
                      ehVideo
                        ? "É o que aparece enquanto o vídeo carrega. Mesmo tamanho do banner."
                        : "Deixe a área do texto (esquerda) mais limpa na foto — é onde entram o título e os botões."
                    }
                  />
                </div>
              </div>

              {ehVideo && (
                <div style={{ marginBottom: ".75rem" }}>
                  <label style={labelStyle}>Arquivo de vídeo (.mp4)</label>
                  <input
                    style={inputStyle}
                    value={b.video}
                    placeholder="/assets/video/teaser-radicaline.mp4"
                    onChange={(e) => patch(b.id, "video", e.target.value)}
                  />
                  <p style={ajudaStyle}>
                    O envio de vídeo pelo painel ainda não existe: informe o caminho de um arquivo já publicado
                    (pasta <code>public/assets/video</code>) ou uma URL completa.
                  </p>
                </div>
              )}

              <div style={{ marginBottom: ".75rem" }}>
                <label style={labelStyle}>Descrição da imagem (acessibilidade e Google)</label>
                <input
                  style={inputStyle}
                  value={b.alt}
                  placeholder="Ex.: Mulher aplicando o desodorante em creme Original"
                  onChange={(e) => patch(b.id, "alt", e.target.value)}
                />
              </div>

              {/* Textos */}
              <fieldset style={{ border: "1px solid #eee", borderRadius: 8, padding: ".6rem .75rem", marginBottom: ".75rem" }}>
                <legend style={{ fontSize: 12, fontWeight: 700, color: "#666", padding: "0 .4rem" }}>Textos sobre a imagem</legend>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".75rem", marginBottom: ".6rem" }}>
                  <div>
                    <label style={labelStyle}>Estilo</label>
                    <select
                      style={inputStyle}
                      value={b.estilo}
                      onChange={(e) => patch(b.id, "estilo", e.target.value as Banner["estilo"])}
                    >
                      <option value="padrao">Comercial (selo, título, texto e botões)</option>
                      <option value="lancamento">Lançamento / teaser (centrado, sóbrio)</option>
                    </select>
                  </div>
                  <div style={{ display: "flex", alignItems: "flex-end", paddingBottom: 8 }}>
                    <label style={{ display: "inline-flex", gap: 6, alignItems: "center", fontSize: 13, color: "#555", cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        checked={b.mostrarLogo}
                        onChange={(e) => patch(b.id, "mostrarLogo", e.target.checked)}
                      />
                      Mostrar a logo Pierre (branca) acima do texto
                    </label>
                  </div>
                </div>

                {!ehLancamento && (
                  <div style={{ marginBottom: ".6rem" }}>
                    <label style={labelStyle}>Selo (linha pequena acima do título)</label>
                    <input
                      style={inputStyle}
                      value={b.eyebrow}
                      placeholder="Ex.: Original e Inigualável"
                      onChange={(e) => patch(b.id, "eyebrow", e.target.value)}
                    />
                  </div>
                )}

                <div style={{ marginBottom: ".6rem" }}>
                  <label style={labelStyle}>Título</label>
                  <input
                    style={inputStyle}
                    value={b.titulo}
                    placeholder="Ex.: A tradição que passa de geração em geração."
                    onChange={(e) => patch(b.id, "titulo", e.target.value)}
                  />
                </div>

                <div>
                  <label style={labelStyle}>{ehLancamento ? "Frase acima do título" : "Subtítulo"}</label>
                  <input
                    style={inputStyle}
                    value={b.subtitulo}
                    placeholder="Ex.: O desodorante em creme que une mães, filhas e avós há décadas."
                    onChange={(e) => patch(b.id, "subtitulo", e.target.value)}
                  />
                </div>
              </fieldset>

              {/* Botões */}
              {!ehLancamento && (
                <fieldset style={{ border: "1px solid #eee", borderRadius: 8, padding: ".6rem .75rem" }}>
                  <legend style={{ fontSize: 12, fontWeight: 700, color: "#666", padding: "0 .4rem" }}>Botões (opcionais)</legend>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".75rem" }}>
                    <div>
                      <label style={labelStyle}>Botão principal</label>
                      <input
                        style={{ ...inputStyle, marginBottom: 6 }}
                        value={b.botao1Texto}
                        placeholder="Texto. Ex.: Conhecer o Inigualável"
                        onChange={(e) => patch(b.id, "botao1Texto", e.target.value)}
                      />
                      <LinkField
                        value={b.botao1Link}
                        onChange={(v) => patch(b.id, "botao1Link", v)}
                        opcoes={opcoesLink}
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Botão secundário</label>
                      <input
                        style={{ ...inputStyle, marginBottom: 6 }}
                        value={b.botao2Texto}
                        placeholder="Texto. Ex.: Onde comprar"
                        onChange={(e) => patch(b.id, "botao2Texto", e.target.value)}
                      />
                      <LinkField
                        value={b.botao2Link}
                        onChange={(v) => patch(b.id, "botao2Link", v)}
                        opcoes={opcoesLink}
                        style={inputStyle}
                      />
                    </div>
                  </div>
                </fieldset>
              )}
            </div>
          );
        })}
      </div>

      {rows.length === 0 && (
        <p style={{ color: "#999", fontSize: 14, margin: "1rem 0 0" }}>
          Nenhum banner. Sem banners ativos, o carrossel simplesmente não aparece na home.
        </p>
      )}

      <button
        type="button"
        onClick={add}
        style={{ marginTop: "1rem", border: "1px dashed #ccc", background: "#fff", borderRadius: 8, padding: "8px 14px", cursor: "pointer", fontSize: 14, color: "#555" }}
      >
        + Adicionar banner
      </button>
    </div>
  );
}
