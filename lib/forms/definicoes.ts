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
import type { FormularioDef, MapaRespostas, NivelEscala, Pergunta } from "./tipos";

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

// Apresentação compartilhada pelos dois formulários do evento Radicaline.
const APRESENTACAO_RADICALINE = {
  eyebrow: "Eventos Pierre",
  banner: {
    src: "/assets/img/banner-radicaline.jpg",
    alt: "Linha Radicaline: sérum facial, resveratrol sérum facial, sabonete facial, loção tônica e creme facial",
  },
  avisoPrivacidade:
    "Os dados informados são usados apenas para identificar sua resposta e melhorar os próximos eventos da Pierre Alexander. Não são compartilhados com terceiros e podem ser removidos a qualquer momento mediante solicitação.",
  mensagemSucesso:
    "Recebemos suas respostas com sucesso. Elas nos ajudam a preparar eventos cada vez melhores para você.",
};

// ---------------------------------------------------------------------------
// 1 — Ausência
// ---------------------------------------------------------------------------
const FORM_1: FormularioDef = {
  id: 1,
  versao: 1,
  ...APRESENTACAO_RADICALINE,
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
  ...APRESENTACAO_RADICALINE,
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
// 3 — Avaliação da linha capilar Intensive Care (teste de produto, anônima)
// ---------------------------------------------------------------------------
const ESCALA_CONCORDANCIA: NivelEscala[] = [
  { nota: 1, rotulo: "Discordo totalmente" },
  { nota: 2, rotulo: "Discordo parcialmente" },
  { nota: 3, rotulo: "Neutro" },
  { nota: 4, rotulo: "Concordo parcialmente" },
  { nota: 5, rotulo: "Concordo totalmente" },
];

const ESCALA_SATISFATORIO: NivelEscala[] = [
  { nota: 1, rotulo: "Muito insatisfatório" },
  { nota: 2, rotulo: "Insatisfatório" },
  { nota: 3, rotulo: "Regular" },
  { nota: 4, rotulo: "Satisfatório" },
  { nota: 5, rotulo: "Muito satisfatório" },
];

const ESCALA_RECOMENDACAO: NivelEscala[] = Array.from({ length: 11 }, (_, nota) => ({
  nota,
  rotulo: nota === 0 ? "Nada provável" : nota === 10 ? "Extremamente provável" : "",
}));

const FOTO_IC = {
  shampoo: { src: "/assets/img/intensive-care/shampoo.webp", alt: "Shampoo Intensive Care 300 ml" },
  condicionador: {
    src: "/assets/img/intensive-care/condicionador.webp",
    alt: "Condicionador Intensive Care 300 ml",
  },
  mascara: {
    src: "/assets/img/intensive-care/mascara.webp",
    alt: "Máscara Reconstrutora Intensive Care 250 g",
  },
  leave_in: { src: "/assets/img/intensive-care/leave-in.webp", alt: "Leave-in Intensive Care 200 ml" },
};

const PRODUTOS_IC = [
  { valor: "shampoo", rotulo: "Shampoo", imagem: FOTO_IC.shampoo },
  { valor: "condicionador", rotulo: "Condicionador", imagem: FOTO_IC.condicionador },
  { valor: "mascara", rotulo: "Máscara Reconstrutora", imagem: FOTO_IC.mascara },
  { valor: "leave_in", rotulo: "Leave-in", imagem: FOTO_IC.leave_in },
];

const SECAO_PERFIL = "Sobre você e seus cabelos";
const SECAO_HABITOS = "Hábitos de cuidado capilar";
const SECAO_EXPERIENCIA = "Experiência com os produtos";
const SECAO_SENSORIAL = "Sensorialidade";
const SECAO_EMBALAGEM = "Embalagem e usabilidade";
const SECAO_GERAL = "Avaliação geral";
const SECAO_OPINIAO = "Sua opinião";

// Afirmações de um produto: só aparecem para quem marcou que o testou.
function afirmacoes(
  produto: string,
  nome: string,
  ordemInicial: number,
  itens: [id: string, titulo: string][]
): Pergunta[] {
  return itens.map(([id, titulo], i) => ({
    id: `${produto}_${id}`,
    ordem: ordemInicial + i,
    secao: SECAO_EXPERIENCIA,
    grupo: nome,
    dependeDe: { pergunta: "produtos_testados", valores: [produto, "todos"] },
    titulo,
    tipo: "escala",
    obrigatoria: true,
    niveis: ESCALA_CONCORDANCIA,
  }));
}

function avaliacoes(
  secao: string,
  ordemInicial: number,
  itens: [id: string, titulo: string][]
): Pergunta[] {
  return itens.map(([id, titulo], i) => ({
    id,
    ordem: ordemInicial + i,
    secao,
    grupo: "Como você avalia cada aspecto?",
    titulo,
    tipo: "escala",
    obrigatoria: true,
    niveis: ESCALA_SATISFATORIO,
  }));
}

const FORM_3: FormularioDef = {
  id: 3,
  versao: 1,
  titulo: "Linha capilar Intensive Care — Pesquisa de avaliação",
  resumo: "Avaliação da linha capilar Intensive Care",
  descricao:
    "Sua opinião é muito importante para nós! Esta pesquisa tem como objetivo avaliar sua experiência com a linha capilar Intensive Care, identificando seus principais pontos fortes e oportunidades de melhoria. Leva apenas alguns minutos.",
  ativo: true,
  criadoEm: "2026-10-02",
  anonimo: true,
  eyebrow: "Pesquisa de produto",
  banner: {
    src: "/assets/img/banner-intensive-care.jpg",
    alt: "Linha Intensive Care: shampoo, condicionador, máscara reconstrutora e leave-in",
  },
  imagensGrupo: {
    Shampoo: FOTO_IC.shampoo,
    Condicionador: FOTO_IC.condicionador,
    "Máscara Reconstrutora": FOTO_IC.mascara,
    "Leave-in": FOTO_IC.leave_in,
  },
  avisoPrivacidade:
    "O preenchimento é anônimo: não pedimos nome, e-mail nem telefone. As respostas são usadas apenas para aprimorar a linha Intensive Care.",
  mensagemSucesso:
    "Recebemos sua avaliação com sucesso. Obrigada pela sua participação — ela nos ajuda a deixar a Intensive Care ainda melhor.",
  perguntas: [
    // 1. Sobre você e seus cabelos ------------------------------------------
    {
      id: "tipo_cabelo",
      ordem: 1,
      secao: SECAO_PERFIL,
      titulo: "Como você classifica o seu tipo de cabelo?",
      tipo: "unica",
      obrigatoria: true,
      rotuloDetalhe: "Qual é o seu tipo de cabelo?",
      opcoes: [
        { valor: "liso", rotulo: "Liso" },
        { valor: "ondulado", rotulo: "Ondulado" },
        { valor: "cacheado", rotulo: "Cacheado" },
        { valor: "crespo", rotulo: "Crespo" },
        { valor: "outro", rotulo: "Outro", abreDetalhe: true },
      ],
    },
    {
      id: "espessura_fios",
      ordem: 2,
      secao: SECAO_PERFIL,
      titulo: "Como você considera a espessura dos seus fios?",
      tipo: "unica",
      obrigatoria: true,
      opcoes: [
        { valor: "finos", rotulo: "Finos" },
        { valor: "medios", rotulo: "Médios" },
        { valor: "grossos", rotulo: "Grossos" },
        { valor: "nao_sei", rotulo: "Não sei identificar" },
      ],
    },
    {
      id: "necessidades",
      ordem: 3,
      secao: SECAO_PERFIL,
      titulo: "Quais são as principais necessidades ou características dos seus cabelos?",
      ajuda: "Selecione quantas opções desejar.",
      tipo: "multipla",
      obrigatoria: true,
      rotuloDetalhe: "Qual outra necessidade?",
      opcoes: [
        { valor: "ressecamento", rotulo: "Ressecamento" },
        { valor: "frizz", rotulo: "Frizz" },
        { valor: "falta_brilho", rotulo: "Falta de brilho" },
        { valor: "danos_quebra", rotulo: "Danos/quebra" },
        { valor: "pontas_danificadas", rotulo: "Pontas danificadas" },
        { valor: "desembaracar", rotulo: "Dificuldade para desembaraçar" },
        { valor: "falta_maciez", rotulo: "Falta de maciez" },
        { valor: "reconstrucao", rotulo: "Necessidade de reconstrução" },
        { valor: "oleosidade", rotulo: "Oleosidade excessiva" },
        { valor: "falta_definicao", rotulo: "Falta de definição" },
        { valor: "nenhuma", rotulo: "Nenhuma necessidade específica" },
        { valor: "outra", rotulo: "Outra", abreDetalhe: true },
      ],
    },
    {
      id: "quimica",
      ordem: 4,
      secao: SECAO_PERFIL,
      titulo: "Seu cabelo possui química?",
      ajuda: "Selecione quantas opções desejar.",
      tipo: "multipla",
      obrigatoria: true,
      rotuloDetalhe: "Qual outra química?",
      opcoes: [
        { valor: "nao", rotulo: "Não" },
        { valor: "coloracao", rotulo: "Coloração" },
        { valor: "descoloracao", rotulo: "Descoloração/mechas" },
        { valor: "alisamento", rotulo: "Alisamento/progressiva" },
        { valor: "relaxamento", rotulo: "Relaxamento" },
        { valor: "outro", rotulo: "Outro", abreDetalhe: true },
      ],
    },
    {
      id: "frequencia_calor",
      ordem: 5,
      secao: SECAO_PERFIL,
      titulo: "Com que frequência você utiliza secador, chapinha ou modelador?",
      tipo: "unica",
      obrigatoria: true,
      opcoes: [
        { valor: "diario", rotulo: "Todos ou quase todos os dias" },
        { valor: "3a5_semana", rotulo: "3 a 5 vezes por semana" },
        { valor: "1a2_semana", rotulo: "1 a 2 vezes por semana" },
        { valor: "eventual", rotulo: "Eventualmente" },
        { valor: "nunca", rotulo: "Nunca" },
      ],
    },

    // 2. Hábitos de cuidado capilar ------------------------------------------
    {
      id: "rotina_produtos",
      ordem: 6,
      secao: SECAO_HABITOS,
      titulo: "Quais produtos você utiliza atualmente na sua rotina?",
      ajuda: "Selecione quantas opções desejar.",
      tipo: "multipla",
      obrigatoria: true,
      rotuloDetalhe: "Quais outros produtos?",
      opcoes: [
        { valor: "shampoo", rotulo: "Shampoo" },
        { valor: "condicionador", rotulo: "Condicionador" },
        { valor: "mascara", rotulo: "Máscara de tratamento" },
        { valor: "leave_in", rotulo: "Leave-in/creme para pentear" },
        { valor: "protetor_termico", rotulo: "Protetor térmico" },
        { valor: "oleo", rotulo: "Óleo/reparador de pontas" },
        { valor: "outros", rotulo: "Outros", abreDetalhe: true },
      ],
    },
    {
      id: "marcas_atuais",
      ordem: 7,
      secao: SECAO_HABITOS,
      titulo: "Quais marcas e produtos capilares você utiliza atualmente?",
      ajuda: "Opcional.",
      tipo: "texto",
      obrigatoria: false,
      maxLength: 500,
      placeholder: "Ex.: shampoo da marca X, máscara da marca Y",
    },
    {
      id: "frequencia_teste",
      ordem: 8,
      secao: SECAO_HABITOS,
      titulo: "Com que frequência você utilizou os produtos Intensive Care durante o teste?",
      tipo: "unica",
      obrigatoria: true,
      opcoes: [
        { valor: "diario", rotulo: "Todos ou quase todos os dias" },
        { valor: "3a5_semana", rotulo: "3 a 5 vezes por semana" },
        { valor: "1a2_semana", rotulo: "1 a 2 vezes por semana" },
        { valor: "menos_1_semana", rotulo: "Menos de 1 vez por semana" },
      ],
    },
    {
      id: "produtos_testados",
      ordem: 9,
      secao: SECAO_HABITOS,
      titulo: "Quais produtos Intensive Care você testou?",
      ajuda: "Selecione quantas opções desejar. As perguntas seguintes se ajustam a esta resposta.",
      tipo: "multipla",
      obrigatoria: true,
      opcoes: [...PRODUTOS_IC, { valor: "todos", rotulo: "Todos os produtos" }],
    },

    // 3. Experiência com os produtos (1 = discordo totalmente … 5 = concordo)
    ...afirmacoes("shampoo", "Shampoo", 10, [
      ["limpeza_eficiente", "Limpou meus cabelos de forma eficiente"],
      ["limpos_sem_ressecar", "Deixou os fios limpos e leves, sem ressecar excessivamente"],
      ["facil_aplicar", "Foi fácil de aplicar e espalhar"],
    ]),
    ...afirmacoes("condicionador", "Condicionador", 13, [
      ["macios_alinhados", "Deixou meus cabelos mais macios e alinhados"],
      ["desembaraco", "Facilitou o desembaraço dos fios"],
      ["facil_aplicar", "Foi fácil de aplicar e distribuir"],
    ]),
    ...afirmacoes("mascara", "Máscara Reconstrutora", 16, [
      ["tratamento_intenso", "Proporcionou sensação de tratamento intenso"],
      ["macios_revitalizados", "Deixou meus cabelos mais macios, sedosos e com aparência revitalizada"],
      ["textura_espalhabilidade", "Apresentou textura e espalhabilidade adequadas"],
    ]),
    ...afirmacoes("leave_in", "Leave-in", 19, [
      ["desembaraco_finalizacao", "Facilitou o desembaraço e a finalização"],
      ["reduz_frizz", "Ajudou a reduzir o frizz e deixou os fios mais alinhados"],
      ["nao_pesa", "Não deixou meus cabelos excessivamente pesados ou oleosos"],
      ["funciona_calor", "Funcionou bem quando utilizei secador, chapinha ou modelador"],
    ]),
    {
      id: "resultado_hidratacao",
      ordem: 23,
      secao: SECAO_EXPERIENCIA,
      titulo: "Considerando a proposta de hidratação da Intensive Care, como você avalia o resultado obtido?",
      tipo: "escala",
      obrigatoria: true,
      niveis: ESCALA_SATISFATORIO,
    },

    // 4. Sensorialidade / 5. Embalagem ----------------------------------------
    ...avaliacoes(SECAO_SENSORIAL, 24, [
      ["fragrancia", "Fragrância"],
      ["textura", "Textura dos produtos"],
      ["aplicacao_enxague", "Facilidade de aplicação e enxágue"],
    ]),
    ...avaliacoes(SECAO_EMBALAGEM, 27, [
      ["embalagem_design", "Design e aparência"],
      ["embalagem_praticidade", "Praticidade para abrir, fechar e dosar o produto"],
      ["embalagem_rotulos", "Clareza das informações dos rótulos"],
      ["embalagem_identificacao", "Facilidade para identificar os produtos da linha"],
    ]),
    {
      id: "dificuldade_embalagem",
      ordem: 31,
      secao: SECAO_EMBALAGEM,
      titulo: "Você encontrou alguma dificuldade com as embalagens?",
      tipo: "unica",
      obrigatoria: true,
      rotuloDetalhe: "Qual dificuldade?",
      opcoes: [
        { valor: "nao", rotulo: "Não" },
        { valor: "sim", rotulo: "Sim", abreDetalhe: true },
      ],
    },

    // 6. Avaliação geral ------------------------------------------------------
    {
      id: "satisfacao_geral",
      ordem: 32,
      secao: SECAO_GERAL,
      titulo: "Qual é o seu nível de satisfação geral com a linha Intensive Care?",
      tipo: "escala",
      obrigatoria: true,
      niveis: [
        { nota: 1, rotulo: "Muito insatisfeito(a)" },
        { nota: 2, rotulo: "Insatisfeito(a)" },
        { nota: 3, rotulo: "Neutro" },
        { nota: 4, rotulo: "Satisfeito(a)" },
        { nota: 5, rotulo: "Muito satisfeito(a)" },
      ],
    },
    {
      id: "comparacao",
      ordem: 33,
      secao: SECAO_GERAL,
      titulo: "Comparando a Intensive Care aos produtos capilares que você costuma utilizar, como você avalia sua experiência?",
      tipo: "unica",
      obrigatoria: true,
      opcoes: [
        { valor: "muito_inferior", rotulo: "Muito inferior" },
        { valor: "inferior", rotulo: "Inferior" },
        { valor: "semelhante", rotulo: "Semelhante" },
        { valor: "superior", rotulo: "Superior" },
        { valor: "muito_superior", rotulo: "Muito superior" },
        { valor: "nao_compara", rotulo: "Não consigo comparar" },
      ],
    },
    {
      id: "intencao_compra",
      ordem: 34,
      secao: SECAO_GERAL,
      titulo: "Após experimentar a linha, qual seria sua intenção de compra?",
      tipo: "unica",
      obrigatoria: true,
      opcoes: [
        { valor: "definitivamente_nao", rotulo: "Definitivamente não compraria" },
        { valor: "provavelmente_nao", rotulo: "Provavelmente não compraria" },
        { valor: "talvez", rotulo: "Talvez compraria" },
        { valor: "provavelmente_sim", rotulo: "Provavelmente compraria" },
        { valor: "definitivamente_sim", rotulo: "Definitivamente compraria" },
      ],
    },
    {
      id: "interesse_compra",
      ordem: 35,
      secao: SECAO_GERAL,
      titulo: "Qual produto você teria maior interesse em comprar?",
      tipo: "unica",
      obrigatoria: true,
      opcoes: [
        ...PRODUTOS_IC,
        { valor: "linha_completa", rotulo: "Mais de um produto/linha completa" },
        { valor: "nenhum", rotulo: "Nenhum" },
      ],
    },
    {
      id: "recomendacao",
      ordem: 36,
      secao: SECAO_GERAL,
      titulo: "Em uma escala de 0 a 10, qual é a probabilidade de você recomendar a Intensive Care para um amigo ou familiar?",
      ajuda: "0 = Nada provável · 10 = Extremamente provável",
      tipo: "escala",
      obrigatoria: true,
      niveis: ESCALA_RECOMENDACAO,
    },

    // 7. Sua opinião ----------------------------------------------------------
    {
      id: "mais_gostou",
      ordem: 37,
      secao: SECAO_OPINIAO,
      titulo: "O que você mais gostou na linha Intensive Care?",
      ajuda: "Opcional.",
      tipo: "texto",
      obrigatoria: false,
      maxLength: LIMITE_SUGESTAO,
      placeholder: "Conte o que mais chamou sua atenção",
    },
    {
      id: "melhorar",
      ordem: 38,
      secao: SECAO_OPINIAO,
      titulo: "O que você menos gostou ou acredita que poderia ser melhorado?",
      ajuda: "Opcional.",
      tipo: "texto",
      obrigatoria: false,
      maxLength: LIMITE_SUGESTAO,
      placeholder: "Conte o que poderia ser diferente",
    },
    {
      id: "efeito_indesejado",
      ordem: 39,
      secao: SECAO_OPINIAO,
      titulo: "Você percebeu algum efeito indesejado durante ou após o uso?",
      tipo: "unica",
      obrigatoria: true,
      rotuloDetalhe: "Qual produto e qual efeito?",
      opcoes: [
        { valor: "nao", rotulo: "Não" },
        { valor: "sim", rotulo: "Sim", abreDetalhe: true },
      ],
    },
    {
      id: "sugestoes",
      ordem: 40,
      secao: SECAO_OPINIAO,
      titulo: "Gostaria de deixar alguma outra sugestão ou comentário?",
      ajuda: "Opcional.",
      tipo: "texto",
      obrigatoria: false,
      maxLength: LIMITE_SUGESTAO,
      placeholder: "Escreva aqui",
    },
  ],
};

// ---------------------------------------------------------------------------
// Registro
// ---------------------------------------------------------------------------
export const FORMULARIOS: FormularioDef[] = [FORM_1, FORM_2, FORM_3];

// Pergunta condicional respondida de forma a aparecer? (sem condição = sempre).
export function perguntaVisivel(p: Pergunta, respostas: MapaRespostas): boolean {
  if (!p.dependeDe) return true;
  const r = respostas[p.dependeDe.pergunta];
  const marcados = r?.valores ?? (r?.valor ? [r.valor] : []);
  return marcados.some((v) => p.dependeDe!.valores.includes(v));
}

// Perguntas de escala dentro de um grupo (blocos de afirmações) não levam
// número: a numeração acompanha a do questionário original.
export function perguntaNumerada(p: Pergunta): boolean {
  return !(p.tipo === "escala" && p.grupo);
}

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
