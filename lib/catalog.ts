// =============================================================================
// CATÁLOGO — fonte única de verdade de categorias e produtos.
//
// Hoje os dados moram aqui (TypeScript tipado). Na Fase 2 do projeto esta mesma
// estrutura passa a ser lida de tabelas no Supabase, e o CRM/admin edita esses
// registros. Por isso NADA de produto deve ser chumbado no JSX das páginas:
// tudo vem destas listas. Ver memória do projeto (projeto-pa-arquitetura).
// =============================================================================

export type Subcategory = {
  slug: string;
  name: string;
};

export type Category = {
  slug: string;
  name: string;
  /** Frase curta para hero da categoria e cards de atalho. */
  tagline: string;
  /** Imagem de capa da categoria (em public/assets/img). */
  image: string;
  subcategories: Subcategory[];
};

export type Product = {
  slug: string;
  name: string;
  categorySlug: string;
  subcategorySlug?: string;
  /** Linha/coleção a que pertence (ex.: "Secrets", "Radicaline"). */
  line?: string;
  /** Público-alvo, quando aplicável. */
  gender?: "feminino" | "masculino" | "unissex" | "infantil";
  /** Família olfativa, para perfumaria. */
  family?: string;
  shortDesc: string;
  image: string;
  /** Preço (do ERP). Opcional — nem toda fonte tem. */
  preco?: number;
  /** Selos exibidos no card (ex.: "Mais vendido", "Novo", "Em breve"). */
  badges?: string[];
  /** Aparece em vitrines de destaque na home. */
  featured?: boolean;
  /** Aparece na vitrine de lançamentos/novidades. */
  isNew?: boolean;
};

// -----------------------------------------------------------------------------
// CATEGORIAS — taxonomia espelhando Natura/Boticário, mapeada ao catálogo Pierre.
// -----------------------------------------------------------------------------
export const categories: Category[] = [
  {
    slug: "perfumaria",
    name: "Perfumaria",
    tagline: "Uma fragrância para cada presença.",
    image: "/assets/img/body-splash.jpg",
    subcategories: [
      { slug: "deo-colonia", name: "Deo Colônia" },
      { slug: "body-splash", name: "Body Splash" },
      { slug: "aguas-virtuosas", name: "Águas Virtuosas" },
      { slug: "femininos", name: "Femininos" },
      { slug: "masculinos", name: "Masculinos" },
    ],
  },
  {
    slug: "cuidado-facial",
    name: "Cuidado Facial",
    tagline: "Seu cuidado, no seu tempo.",
    image: "/assets/img/teaser-radicaline-poster.jpg",
    subcategories: [
      { slug: "radicaline", name: "Radicaline" },
      { slug: "limpeza", name: "Limpeza" },
      { slug: "hidratacao", name: "Hidratação" },
      { slug: "cuidados-especiais", name: "Cuidados Especiais" },
    ],
  },
  {
    slug: "corpo-banho",
    name: "Corpo & Banho",
    tagline: "Frescor e perfume para todos os dias.",
    image: "/assets/img/banhos-aromaticos.jpg",
    subcategories: [
      { slug: "hidratantes", name: "Hidratantes" },
      { slug: "banho-aromatico", name: "Banho Aromático" },
      { slug: "sabonetes", name: "Sabonetes" },
      { slug: "body-splash", name: "Body Splash" },
    ],
  },
  {
    slug: "desodorantes",
    name: "Desodorantes",
    tagline: "O clássico que atravessa gerações.",
    image: "/assets/img/desodorante-original.jpg",
    subcategories: [
      { slug: "original", name: "O Original" },
      { slug: "roll-on", name: "Roll-on" },
      { slug: "aerossol", name: "Aerossol & Pump" },
      { slug: "combos", name: "Combos" },
    ],
  },
  {
    slug: "cabelos",
    name: "Cabelos",
    tagline: "Cuidado completo, da raiz às pontas.",
    image: "/assets/img/teaser-shampoo.jpg",
    subcategories: [
      { slug: "shampoo", name: "Shampoo" },
      { slug: "condicionador", name: "Condicionador" },
      { slug: "tratamento", name: "Tratamento" },
    ],
  },
  {
    slug: "casa",
    name: "Casa",
    tagline: "A Pierre que perfuma o seu lar.",
    image: "/assets/img/maison-sacola.jpg",
    subcategories: [
      { slug: "ambientes", name: "Ambientes" },
      { slug: "tecidos", name: "Tecidos" },
    ],
  },
  {
    slug: "kits",
    name: "Kits & Presentes",
    tagline: "Combinações para usar, vender e presentear.",
    image: "/assets/img/bag-colorida.jpg",
    subcategories: [
      { slug: "por-ocasiao", name: "Por ocasião" },
      { slug: "mais-vendidos", name: "Mais vendidos" },
    ],
  },
];

// -----------------------------------------------------------------------------
// PRODUTOS — derivados do conteúdo real do site (linhas e nomes existentes).
// Sem preço por enquanto (modelo de venda direta: "Consulte uma consultora").
// -----------------------------------------------------------------------------
export const products: Product[] = [
  // ---- Perfumaria --------------------------------------------------------
  {
    slug: "deo-colonia-laura",
    name: "Deo Colônia Laura Um",
    categorySlug: "perfumaria",
    subcategorySlug: "deo-colonia",
    line: "Laura",
    gender: "feminino",
    family: "Floral elegante",
    shortDesc: "Floral marcante e sofisticado, para presença feminina inesquecível.",
    image: "/assets/img/deo-colonias-laura.jpg",
    badges: ["Mais vendido"],
    featured: true,
  },
  {
    slug: "deo-colonia-aura-unica",
    name: "Deo Colônia Aura Única",
    categorySlug: "perfumaria",
    subcategorySlug: "deo-colonia",
    gender: "feminino",
    family: "Floral",
    shortDesc: "A assinatura olfativa para quem tem uma aura só sua.",
    image: "/assets/img/deo-colonias-laura.jpg",
    featured: true,
  },
  {
    slug: "secrets-black",
    name: "Secrets Black",
    categorySlug: "perfumaria",
    subcategorySlug: "femininos",
    line: "Secrets",
    gender: "feminino",
    family: "Floral amadeirado",
    shortDesc: "Intenso e envolvente, para a noite e os momentos marcantes.",
    image: "/assets/img/fragrancia-secrets.jpg",
    badges: ["Mais vendido"],
    featured: true,
  },
  {
    slug: "secrets-pour-homme",
    name: "Secrets Pour Homme",
    categorySlug: "perfumaria",
    subcategorySlug: "masculinos",
    line: "Secrets",
    gender: "masculino",
    family: "Amadeirado masculino",
    shortDesc: "Sofisticação masculina com a sedução da linha Secrets.",
    image: "/assets/img/fragrancia-secrets.jpg",
    featured: true,
  },
  {
    slug: "body-splash-jabuticaba",
    name: "Body Splash Jabuticaba",
    categorySlug: "perfumaria",
    subcategorySlug: "body-splash",
    gender: "feminino",
    family: "Frutal brasileira",
    shortDesc: "Memória frutal brasileira em uma bruma leve e refrescante.",
    image: "/assets/img/body-splash.jpg",
    isNew: true,
  },
  {
    slug: "body-splash-vert",
    name: "Body Splash Vert",
    categorySlug: "perfumaria",
    subcategorySlug: "body-splash",
    gender: "unissex",
    family: "Fresca e verde",
    shortDesc: "Frescor cítrico e verde para o dia a dia, de uso livre.",
    image: "/assets/img/body-splash.jpg",
  },

  // ---- Cuidado Facial ----------------------------------------------------
  {
    slug: "radicaline-sabonete",
    name: "Radicaline Sabonete Facial",
    categorySlug: "cuidado-facial",
    subcategorySlug: "radicaline",
    line: "Radicaline",
    shortDesc: "A nova era do cuidado facial Pierre começa pela limpeza.",
    image: "/assets/img/teaser-radicaline-poster.jpg",
    badges: ["Em breve"],
    isNew: true,
    featured: true,
  },
  {
    slug: "radicaline-serum",
    name: "Radicaline Sérum",
    categorySlug: "cuidado-facial",
    subcategorySlug: "radicaline",
    line: "Radicaline",
    shortDesc: "Cuidado intensivo dia e noite para uma pele revitalizada.",
    image: "/assets/img/teaser-radicaline.jpg",
    badges: ["Em breve"],
    isNew: true,
  },
  {
    slug: "agua-micelar",
    name: "Água Micelar Pierre",
    categorySlug: "cuidado-facial",
    subcategorySlug: "limpeza",
    shortDesc: "Limpa, remove maquiagem e prepara a pele em um só passo.",
    image: "/assets/img/teaser-radicaline-poster.jpg",
    featured: true,
  },
  {
    slug: "creme-aloe-vera",
    name: "Creme Facial Aloe Vera",
    categorySlug: "cuidado-facial",
    subcategorySlug: "hidratacao",
    line: "Aloe Vera",
    shortDesc: "Hidratação, frescor e cuidado versátil para todos os tipos de pele.",
    image: "/assets/img/teaser-protetor.jpg",
  },
  {
    slug: "creme-rosa-mosqueta",
    name: "Creme Facial Rosa Mosqueta",
    categorySlug: "cuidado-facial",
    subcategorySlug: "cuidados-especiais",
    line: "Rosa Mosqueta",
    shortDesc: "Nutrição e reparação para um cuidado especial da pele.",
    image: "/assets/img/teaser-protetor.jpg",
  },

  // ---- Corpo & Banho -----------------------------------------------------
  {
    slug: "banho-aromatico-lavande",
    name: "Banho Aromático Lavande",
    categorySlug: "corpo-banho",
    subcategorySlug: "banho-aromatico",
    family: "Floral relaxante",
    shortDesc: "O perfume da lavanda transforma o banho em um ritual de calma.",
    image: "/assets/img/banhos-aromaticos.jpg",
    featured: true,
  },
  {
    slug: "banho-aromatico-dazur",
    name: "Banho Aromático D’Azur",
    categorySlug: "corpo-banho",
    subcategorySlug: "banho-aromatico",
    family: "Fresca aquática",
    shortDesc: "Frescor aquático para começar ou encerrar o dia com leveza.",
    image: "/assets/img/banhos-aromaticos.jpg",
  },
  {
    slug: "hidratante-corporal",
    name: "Hidratante Corporal Pierre",
    categorySlug: "corpo-banho",
    subcategorySlug: "hidratantes",
    shortDesc: "Maciez e perfume que permanecem na pele o dia inteiro.",
    image: "/assets/img/banhos-aromaticos.jpg",
    featured: true,
  },

  // ---- Desodorantes ------------------------------------------------------
  {
    slug: "creme-original",
    name: "Desodorante Creme Original",
    categorySlug: "desodorantes",
    subcategorySlug: "original",
    line: "O Original",
    shortDesc: "O desodorante em creme que atravessa gerações. O inigualável Pierre.",
    image: "/assets/img/desodorante-original.jpg",
    badges: ["Mais vendido"],
    featured: true,
  },
  {
    slug: "creme-bloqueador",
    name: "Creme Bloqueador de Odores",
    categorySlug: "desodorantes",
    subcategorySlug: "original",
    line: "O Original",
    shortDesc: "A confiança do Original, reforçada para proteção intensa.",
    image: "/assets/img/desodorantes-varios.jpg",
    featured: true,
  },
  {
    slug: "roll-on-cinza",
    name: "Roll-on Cinza",
    categorySlug: "desodorantes",
    subcategorySlug: "roll-on",
    shortDesc: "Proteção prática e suave para a rotina. Um dos mais procurados.",
    image: "/assets/img/desodorantes-varios.jpg",
    badges: ["TOP 2"],
  },
  {
    slug: "roll-on-toque-seco",
    name: "Roll-on Toque Seco",
    categorySlug: "desodorantes",
    subcategorySlug: "roll-on",
    shortDesc: "Sensação seca imediata e proteção de longa duração.",
    image: "/assets/img/desodorantes-varios.jpg",
  },

  // ---- Cabelos -----------------------------------------------------------
  {
    slug: "shampoo-pierre",
    name: "Shampoo Pierre",
    categorySlug: "cabelos",
    subcategorySlug: "shampoo",
    shortDesc: "Limpeza suave que respeita o equilíbrio dos fios.",
    image: "/assets/img/teaser-shampoo.jpg",
    badges: ["Em breve"],
    isNew: true,
  },
  {
    slug: "condicionador-pierre",
    name: "Condicionador Pierre",
    categorySlug: "cabelos",
    subcategorySlug: "condicionador",
    shortDesc: "Maciez, brilho e fácil de pentear, do comprimento às pontas.",
    image: "/assets/img/teaser-shampoo.jpg",
    badges: ["Em breve"],
    isNew: true,
  },

  // ---- Casa --------------------------------------------------------------
  {
    slug: "aromatizador-ambiente",
    name: "Aromatizador de Ambiente",
    categorySlug: "casa",
    subcategorySlug: "ambientes",
    line: "Maison",
    shortDesc: "Deixe a casa acolhedora com a assinatura olfativa Pierre.",
    image: "/assets/img/maison-sacola.jpg",
    featured: true,
  },
  {
    slug: "agua-rouparia",
    name: "Água de Rouparia",
    categorySlug: "casa",
    subcategorySlug: "tecidos",
    line: "Maison",
    shortDesc: "Perfume suave para lençóis, toalhas, roupas e armários.",
    image: "/assets/img/maison-sacola.jpg",
  },

  // ---- Kits & Presentes --------------------------------------------------
  {
    slug: "kit-original",
    name: "Kit Original",
    categorySlug: "kits",
    subcategorySlug: "mais-vendidos",
    shortDesc: "Desodorantes e variações para recompra. O presente certeiro.",
    image: "/assets/img/bag-colorida.jpg",
    badges: ["Mais vendido"],
    featured: true,
  },
  {
    slug: "kit-fragrancias",
    name: "Kit Fragrâncias",
    categorySlug: "kits",
    subcategorySlug: "por-ocasiao",
    shortDesc: "Body splash, deo colônia e presença marcante em um só presente.",
    image: "/assets/img/bag-colorida.jpg",
    featured: true,
  },
  {
    slug: "kit-primeira-compra",
    name: "Kit Primeira Compra",
    categorySlug: "kits",
    subcategorySlug: "por-ocasiao",
    shortDesc: "A porta de entrada perfeita para conhecer a marca Pierre.",
    image: "/assets/img/bag-colorida.jpg",
  },
];

// -----------------------------------------------------------------------------
// HELPERS — uma API simples que as páginas consomem (e que troca facilmente
// por chamadas ao Supabase na Fase 2 sem mexer nos componentes).
// -----------------------------------------------------------------------------
export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function productsByCategory(slug: string): Product[] {
  return products.filter((p) => p.categorySlug === slug);
}

export function relatedProducts(product: Product, limit = 4): Product[] {
  return products
    .filter((p) => p.categorySlug === product.categorySlug && p.slug !== product.slug)
    .slice(0, limit);
}

export function featuredProducts(limit = 8): Product[] {
  return products.filter((p) => p.featured).slice(0, limit);
}

export function newProducts(limit = 8): Product[] {
  return products.filter((p) => p.isNew).slice(0, limit);
}
