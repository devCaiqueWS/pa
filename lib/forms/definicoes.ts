// =============================================================================
// FORMULÁRIOS — REGISTRO DE DEFINIÇÕES
// Fonte única da verdade das perguntas. Para publicar /forms/3, acrescente uma
// definição neste arquivo: rota pública, validação, gravação, dashboard e
// exportação passam a funcionar sem nenhum outro código novo.
//
// REGRAS:
//  - `id` é a numeração da rota (/forms/1) e nunca é reaproveitado.
//  - `valor` das opções e `id` das perguntas são chaves GRAVADAS no banco:
//    não renomeie depois de publicado; para mudar perguntas, suba a `versao`.
// =============================================================================
import type { FormularioDef, NivelEscala, Pergunta } from "./tipos";

// Escala de 3 pontos usada nas avaliações (número + significado sempre visíveis).
const ESCALA_SATISFACAO: NivelEscala[] = [
  { nota: 1, rotulo: "Insatisfeito" },
  { nota: 2, rotulo: "Neutro" },
  { nota: 3, rotulo: "Satisfeito" },
];

const INTERESSE_FUTUROS: Pergunta = {
  id: "interesse_futuros",
  ordem: 3,
  titulo: "Você tem interesse em participar de futuros eventos da Pierre?",
  tipo: "unica",
  obrigatoria: true,
  opcoes: [
    { valor: "sim", rotulo: "Sim" },
    { valor: "nao", rotulo: "Não" },
    { valor: "talvez", rotulo: "Talvez" },
  ],
};

const FORMATO_PREFERIDO: Pergunta = {
  id: "formato_preferido",
  ordem: 4,
  titulo: "Qual formato de evento você prefere?",
  tipo: "unica",
  obrigatoria: true,
  opcoes: [
    { valor: "presencial", rotulo: "Presencial" },
    { valor: "online", rotulo: "Online" },
  ],
};

const LIMITE_SUGESTAO = 1000;

// ---------------------------------------------------------------------------
// 1 — Ausência
// ---------------------------------------------------------------------------
const FORM_1: FormularioDef = {
  id: 1,
  versao: 1,
  titulo: "Ausência — Evento Radicaline",
  resumo: "Ausência no evento Radicaline",
  descricao:
    "Agradecemos seu interesse em participar do nosso evento Pierre. Sabemos que nem sempre é possível estar presente, por isso gostaríamos de entender melhor os motivos da sua ausência. Suas respostas nos ajudarão a criar experiências cada vez mais acessíveis e relevantes para todos.",
  ativo: true,
  criadoEm: "2026-09-01",
  perguntas: [
    {
      id: "motivo_ausencia",
      ordem: 1,
      titulo:
        "Qual foi o principal motivo que impediu sua participação no evento realizado em 17/08?",
      tipo: "unica",
      obrigatoria: true,
      rotuloDetalhe: "Conte qual foi o motivo",
      opcoes: [
        { valor: "distancia", rotulo: "Distância do local" },
        { valor: "horario", rotulo: "Horário do evento" },
        { valor: "data", rotulo: "Data do evento" },
        { valor: "transporte", rotulo: "Dificuldade de deslocamento/transporte" },
        { valor: "compromisso_profissional", rotulo: "Compromisso profissional" },
        { valor: "imprevisto", rotulo: "Imprevisto pessoal ou familiar" },
        { valor: "duracao", rotulo: "Duração do evento" },
        { valor: "sem_interesse_tema", rotulo: "Não tive interesse no tema abordado" },
        { valor: "outro", rotulo: "Outro", abreDetalhe: true },
      ],
    },
    {
      id: "facilitadores",
      ordem: 2,
      titulo: "O que teria facilitado sua participação?",
      ajuda: "Você pode marcar mais de uma opção.",
      tipo: "multipla",
      obrigatoria: true,
      rotuloDetalhe: "Conte o que teria facilitado",
      opcoes: [
        { valor: "local_proximo", rotulo: "Um local mais próximo" },
        { valor: "evento_online", rotulo: "Evento online" },
        { valor: "horario_diferente", rotulo: "Horário diferente" },
        { valor: "final_de_semana", rotulo: "Evento em final de semana" },
        { valor: "menor_duracao", rotulo: "Menor duração" },
        { valor: "mais_antecedencia", rotulo: "Mais antecedência na divulgação" },
        { valor: "outro", rotulo: "Outro", abreDetalhe: true },
      ],
    },
    INTERESSE_FUTUROS,
    FORMATO_PREFERIDO,
    {
      id: "sugestoes",
      ordem: 5,
      titulo: "Gostaria de deixar alguma sugestão para nossos próximos eventos?",
      ajuda: "Opcional.",
      tipo: "texto",
      obrigatoria: false,
      maxLength: LIMITE_SUGESTAO,
      placeholder: "Escreva aqui a sua sugestão",
    },
  ],
};

// ---------------------------------------------------------------------------
// 2 — Pesquisa (quem participou)
// ---------------------------------------------------------------------------
const GRUPO_AVALIACAO = "Como você avalia os seguintes aspectos?";

const FORM_2: FormularioDef = {
  id: 2,
  versao: 1,
  titulo: "Pesquisa — Evento Radicaline",
  resumo: "Pesquisa de satisfação do evento Radicaline",
  descricao:
    "Sua presença tornou nosso evento ainda mais especial. Gostaríamos de ouvir sua opinião para continuar criando experiências cada vez melhores para nossa rede de consultores, distribuidores e parceiros.",
  ativo: true,
  criadoEm: "2026-09-01",
  perguntas: [
    {
      id: "pontos_positivos",
      ordem: 1,
      titulo: "O que você mais gostou no evento?",
      ajuda: "Você pode marcar mais de uma opção.",
      tipo: "multipla",
      obrigatoria: true,
      rotuloDetalhe: "Conte o que mais gostou",
      opcoes: [
        { valor: "local", rotulo: "Local do evento" },
        { valor: "treinamento_samantha", rotulo: "O treinamento da Dra. Samantha" },
        { valor: "lancamentos", rotulo: "Conhecer os lançamentos em primeira mão" },
        { valor: "networking", rotulo: "Troca de experiências e networking" },
        { valor: "organizacao", rotulo: "Organização do evento" },
        { valor: "coffee_break", rotulo: "Coffee break" },
        { valor: "equipe_pierre", rotulo: "Interação com a equipe Pierre" },
        { valor: "outro", rotulo: "Outro", abreDetalhe: true },
      ],
    },
    {
      id: "nota_organizacao",
      ordem: 2,
      grupo: GRUPO_AVALIACAO,
      titulo: "Organização do evento",
      tipo: "escala",
      obrigatoria: true,
      niveis: ESCALA_SATISFACAO,
    },
    {
      id: "nota_conteudo",
      ordem: 3,
      grupo: GRUPO_AVALIACAO,
      titulo: "Conteúdo apresentado",
      tipo: "escala",
      obrigatoria: true,
      niveis: ESCALA_SATISFACAO,
    },
    {
      id: "nota_experiencia",
      ordem: 4,
      grupo: GRUPO_AVALIACAO,
      titulo: "Experiência geral no evento",
      tipo: "escala",
      obrigatoria: true,
      niveis: ESCALA_SATISFACAO,
    },
    { ...INTERESSE_FUTUROS, ordem: 5 },
    { ...FORMATO_PREFERIDO, ordem: 6 },
    {
      id: "sugestoes",
      ordem: 7,
      titulo: "Quais são suas sugestões para os próximos eventos?",
      ajuda: "Opcional.",
      tipo: "texto",
      obrigatoria: false,
      maxLength: LIMITE_SUGESTAO,
      placeholder: "Escreva aqui a sua sugestão",
    },
  ],
};

// ---------------------------------------------------------------------------
// Registro
// ---------------------------------------------------------------------------
export const FORMULARIOS: FormularioDef[] = [FORM_1, FORM_2];

// Aviso de privacidade exibido em todos os formulários (LGPD).
export const AVISO_PRIVACIDADE =
  "Os dados informados são usados apenas para identificar sua resposta e melhorar os próximos eventos da Pierre Alexander. Não são compartilhados com terceiros e podem ser removidos a qualquer momento mediante solicitação.";

// Busca por id de rota. Aceita string vinda de params e rejeita qualquer coisa
// que não seja um inteiro positivo conhecido (evita manipulação do id).
export function getFormulario(id: unknown): FormularioDef | null {
  const n =
    typeof id === "number"
      ? id
      : typeof id === "string" && /^[0-9]{1,6}$/.test(id)
        ? Number(id)
        : NaN;
  if (!Number.isInteger(n)) return null;
  return FORMULARIOS.find((f) => f.id === n) ?? null;
}

// Perguntas na ordem de exibição.
export function perguntasOrdenadas(def: FormularioDef): Pergunta[] {
  return [...def.perguntas].sort((a, b) => a.ordem - b.ordem);
}

// Rótulo legível de uma opção (para dashboard e exportação).
export function rotuloOpcao(pergunta: Pergunta, valor: string): string {
  return pergunta.opcoes?.find((o) => o.valor === valor)?.rotulo ?? valor;
}

// Rótulo legível de uma nota da escala.
export function rotuloNivel(pergunta: Pergunta, nota: number): string {
  const n = pergunta.niveis?.find((x) => x.nota === nota);
  return n ? `${n.nota} — ${n.rotulo}` : String(nota);
}
