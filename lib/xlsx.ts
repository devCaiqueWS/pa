// =============================================================================
// XLSX — GERADOR MÍNIMO (sem dependências)
// Escreve um .xlsx de verdade (OOXML dentro de um ZIP) com o que a exportação
// do painel precisa: várias abas, cabeçalho destacado + congelado, filtros no
// cabeçalho (autoFilter), largura de coluna e datas que o Excel reconhece COMO
// data. Foi escrito à mão em vez de trazer exceljs/sheetjs (~1 MB + transitivas)
// porque isto é tudo que o projeto usa de planilha.
//
// Segurança: todo texto vai como `inlineStr`. Célula de texto literal nunca é
// interpretada como fórmula pelo Excel, então não existe aqui o buraco de
// "CSV injection" (=cmd|...) — e nada precisa ser mutilado com apóstrofo.
// =============================================================================
import { deflateRawSync } from "node:zlib";

export type ValorCelula = string | number | Date | null | undefined;

export type Coluna = {
  titulo: string;
  largura?: number; // em "caracteres" do Excel (padrão 18)
};

export type Aba = {
  nome: string; // <= 31 caracteres, sem : \ / ? * [ ]
  colunas: Coluna[];
  linhas: ValorCelula[][];
  // Liga os filtros no cabeçalho. Padrão: true.
  filtros?: boolean;
};

// ---------------------------------------------------------------------------
// XML
// ---------------------------------------------------------------------------

// Faixa que o XML 1.0 nao aceita, montada por codigo para nao deixar bytes
// invisiveis no fonte. Tab, quebra de linha e retorno de carro sao validos
// e por isso ficam fora da faixa.
const XML_PROIBIDOS = new RegExp("[\u0000-\u0008\u000B\u000C\u000E-\u001F]", "g");

function esc(v: string): string {
  return v
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
    // Caracteres que o XML 1.0 simplesmente não aceita.
    .replace(XML_PROIBIDOS, "");
}

// A1, B1 … AA1 …
function refColuna(indice: number): string {
  let n = indice + 1;
  let s = "";
  while (n > 0) {
    const r = (n - 1) % 26;
    s = String.fromCharCode(65 + r) + s;
    n = Math.floor((n - 1) / 26);
  }
  return s;
}

// Data -> número de série do Excel (dias desde 1899-12-30), na hora de parede
// do fuso pedido. Sem isso a planilha mostraria UTC.
function serialExcel(d: Date, fuso: string): number {
  const p = new Intl.DateTimeFormat("en-US", {
    timeZone: fuso,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(d);
  const get = (t: string) => Number(p.find((x) => x.type === t)?.value ?? 0);
  const ms = Date.UTC(
    get("year"),
    get("month") - 1,
    get("day"),
    get("hour") % 24,
    get("minute"),
    get("second")
  );
  return ms / 86400000 + 25569;
}

// Índices de estilo definidos em `styles.xml` (ordem de `cellXfs`).
const ESTILO_PADRAO = 0;
const ESTILO_CABECALHO = 1;
const ESTILO_DATA = 2;
const ESTILO_TEXTO_LONGO = 3;

function celula(ref: string, v: ValorCelula, fuso: string): string {
  if (v === null || v === undefined || v === "") return "";
  if (v instanceof Date) {
    if (Number.isNaN(v.getTime())) return "";
    return `<c r="${ref}" s="${ESTILO_DATA}"><v>${serialExcel(v, fuso)}</v></c>`;
  }
  if (typeof v === "number" && Number.isFinite(v)) {
    return `<c r="${ref}"><v>${v}</v></c>`;
  }
  const texto = String(v);
  const estilo = texto.length > 60 || texto.includes("\n") ? ESTILO_TEXTO_LONGO : ESTILO_PADRAO;
  return `<c r="${ref}" s="${estilo}" t="inlineStr"><is><t xml:space="preserve">${esc(
    texto
  )}</t></is></c>`;
}

function xmlAba(aba: Aba, fuso: string): string {
  const nCols = Math.max(aba.colunas.length, 1);
  const nLinhas = aba.linhas.length + 1;
  const ultimaCol = refColuna(nCols - 1);

  const cols = aba.colunas
    .map(
      (c, i) =>
        `<col min="${i + 1}" max="${i + 1}" width="${c.largura ?? 18}" customWidth="1"/>`
    )
    .join("");

  const cabecalho = aba.colunas
    .map(
      (c, i) =>
        `<c r="${refColuna(i)}1" s="${ESTILO_CABECALHO}" t="inlineStr"><is><t xml:space="preserve">${esc(
          c.titulo
        )}</t></is></c>`
    )
    .join("");

  const corpo = aba.linhas
    .map((linha, li) => {
      const r = li + 2;
      const cs = linha
        .map((v, ci) => celula(`${refColuna(ci)}${r}`, v, fuso))
        .join("");
      return `<row r="${r}">${cs}</row>`;
    })
    .join("");

  const filtros =
    aba.filtros === false ? "" : `<autoFilter ref="A1:${ultimaCol}${nLinhas}"/>`;

  return (
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>` +
    `<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">` +
    `<dimension ref="A1:${ultimaCol}${nLinhas}"/>` +
    `<sheetViews><sheetView workbookViewId="0">` +
    `<pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/>` +
    `</sheetView></sheetViews>` +
    `<sheetFormatPr defaultRowHeight="15"/>` +
    (cols ? `<cols>${cols}</cols>` : "") +
    `<sheetData><row r="1">${cabecalho}</row>${corpo}</sheetData>` +
    filtros +
    `</worksheet>`
  );
}

const STYLES_XML =
  `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>` +
  `<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">` +
  `<numFmts count="1"><numFmt numFmtId="164" formatCode="dd/mm/yyyy\\ hh:mm"/></numFmts>` +
  `<fonts count="2">` +
  `<font><sz val="11"/><name val="Calibri"/></font>` +
  `<font><b/><sz val="11"/><color rgb="FFFFFFFF"/><name val="Calibri"/></font>` +
  `</fonts>` +
  `<fills count="3">` +
  `<fill><patternFill patternType="none"/></fill>` +
  `<fill><patternFill patternType="gray125"/></fill>` +
  // Vermelho Pierre (--accent) no cabeçalho, para a planilha parecer da casa.
  `<fill><patternFill patternType="solid"><fgColor rgb="FFD6311C"/><bgColor indexed="64"/></patternFill></fill>` +
  `</fills>` +
  `<borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders>` +
  `<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>` +
  `<cellXfs count="4">` +
  `<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>` +
  `<xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1" applyAlignment="1"><alignment vertical="center"/></xf>` +
  `<xf numFmtId="164" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/>` +
  `<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0" applyAlignment="1"><alignment vertical="top" wrapText="1"/></xf>` +
  `</cellXfs>` +
  `<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>` +
  `</styleSheet>`;

// Nome de aba aceito pelo Excel.
function nomeAba(nome: string, indice: number): string {
  const limpo = nome.replace(/[:\\/?*[\]]/g, " ").trim().slice(0, 31);
  return limpo || `Planilha${indice + 1}`;
}

// ---------------------------------------------------------------------------
// ZIP
// ---------------------------------------------------------------------------

const TABELA_CRC = (() => {
  const t = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[i] = c >>> 0;
  }
  return t;
})();

function crc32(buf: Buffer): number {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = TABELA_CRC[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

type Entrada = { nome: string; dados: Buffer };

function zip(entradas: Entrada[]): Buffer {
  const locais: Buffer[] = [];
  const central: Buffer[] = [];
  let offset = 0;

  // Data/hora fixa (1980-01-01): a planilha é gerada sob demanda e um carimbo
  // variável só serviria para tornar o arquivo não reprodutível.
  const hora = 0;
  const data = 33;

  for (const e of entradas) {
    const nome = Buffer.from(e.nome, "utf8");
    const bruto = e.dados;
    const comprimido = deflateRawSync(bruto, { level: 6 });
    const crc = crc32(bruto);

    const local = Buffer.alloc(30 + nome.length);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4); // versão necessária
    local.writeUInt16LE(0x0800, 6); // nome em UTF-8
    local.writeUInt16LE(8, 8); // método: deflate
    local.writeUInt16LE(hora, 10);
    local.writeUInt16LE(data, 12);
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(comprimido.length, 18);
    local.writeUInt32LE(bruto.length, 22);
    local.writeUInt16LE(nome.length, 26);
    local.writeUInt16LE(0, 28);
    nome.copy(local, 30);
    locais.push(local, comprimido);

    const cd = Buffer.alloc(46 + nome.length);
    cd.writeUInt32LE(0x02014b50, 0);
    cd.writeUInt16LE(20, 4); // versão de criação
    cd.writeUInt16LE(20, 6); // versão necessária
    cd.writeUInt16LE(0x0800, 8);
    cd.writeUInt16LE(8, 10);
    cd.writeUInt16LE(hora, 12);
    cd.writeUInt16LE(data, 14);
    cd.writeUInt32LE(crc, 16);
    cd.writeUInt32LE(comprimido.length, 20);
    cd.writeUInt32LE(bruto.length, 24);
    cd.writeUInt16LE(nome.length, 28);
    cd.writeUInt16LE(0, 30); // extra
    cd.writeUInt16LE(0, 32); // comentário
    cd.writeUInt16LE(0, 34); // disco
    cd.writeUInt16LE(0, 36); // atributos internos
    cd.writeUInt32LE(0, 38); // atributos externos
    cd.writeUInt32LE(offset, 42);
    nome.copy(cd, 46);
    central.push(cd);

    offset += local.length + comprimido.length;
  }

  const dirCentral = Buffer.concat(central);
  const fim = Buffer.alloc(22);
  fim.writeUInt32LE(0x06054b50, 0);
  fim.writeUInt16LE(0, 4);
  fim.writeUInt16LE(0, 6);
  fim.writeUInt16LE(entradas.length, 8);
  fim.writeUInt16LE(entradas.length, 10);
  fim.writeUInt32LE(dirCentral.length, 12);
  fim.writeUInt32LE(offset, 16);
  fim.writeUInt16LE(0, 20);

  return Buffer.concat([...locais, dirCentral, fim]);
}

// ---------------------------------------------------------------------------
// API
// ---------------------------------------------------------------------------

export function gerarXlsx(abas: Aba[], fuso = "America/Sao_Paulo"): Buffer {
  const usadas = abas.length ? abas : [{ nome: "Planilha1", colunas: [], linhas: [] }];
  const nomes = usadas.map((a, i) => nomeAba(a.nome, i));

  const tipos =
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>` +
    `<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">` +
    `<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>` +
    `<Default Extension="xml" ContentType="application/xml"/>` +
    `<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>` +
    usadas
      .map(
        (_, i) =>
          `<Override PartName="/xl/worksheets/sheet${i + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`
      )
      .join("") +
    `<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>` +
    `</Types>`;

  const rels =
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>` +
    `<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">` +
    `<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>` +
    `</Relationships>`;

  const workbook =
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>` +
    `<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" ` +
    `xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets>` +
    nomes
      .map((n, i) => `<sheet name="${esc(n)}" sheetId="${i + 1}" r:id="rId${i + 1}"/>`)
      .join("") +
    `</sheets></workbook>`;

  const workbookRels =
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>` +
    `<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">` +
    usadas
      .map(
        (_, i) =>
          `<Relationship Id="rId${i + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${i + 1}.xml"/>`
      )
      .join("") +
    `<Relationship Id="rId${usadas.length + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>` +
    `</Relationships>`;

  const entradas: Entrada[] = [
    { nome: "[Content_Types].xml", dados: Buffer.from(tipos, "utf8") },
    { nome: "_rels/.rels", dados: Buffer.from(rels, "utf8") },
    { nome: "xl/workbook.xml", dados: Buffer.from(workbook, "utf8") },
    { nome: "xl/_rels/workbook.xml.rels", dados: Buffer.from(workbookRels, "utf8") },
    { nome: "xl/styles.xml", dados: Buffer.from(STYLES_XML, "utf8") },
    ...usadas.map((a, i) => ({
      nome: `xl/worksheets/sheet${i + 1}.xml`,
      dados: Buffer.from(xmlAba(a, fuso), "utf8"),
    })),
  ];

  return zip(entradas);
}
