export type DropdownItem = { label: string; href: string };

export type NavEntry =
  | { type: "link"; key: string; label: string; href: string }
  | {
      type: "dropdown";
      key: string;
      label: string;
      href: string;
      items: DropdownItem[];
    };

export const navEntries: NavEntry[] = [
  { type: "link", key: "inicio", label: "Início", href: "/" },
  {
    type: "dropdown",
    key: "produtos",
    label: "Produtos",
    href: "/produtos",
    items: [
      { label: "Desodorantes", href: "/original" },
      { label: "Cuidado Facial", href: "/tratamentos" },
      { label: "Cuidados Corporais", href: "/produtos#corpo" },
      { label: "Banho", href: "/produtos#banho" },
      { label: "Hidratantes", href: "/produtos#hidratantes" },
      { label: "Body Splash", href: "/fragrancias#body-splash" },
      { label: "Deo Colônias", href: "/fragrancias#deo-colonias" },
      { label: "Casa & Ambientes", href: "/maison" },
      { label: "Cabelos", href: "/produtos#cabelos" },
      { label: "Pós-Barba", href: "/produtos#pos-barba" },
      { label: "Kits & Presentes", href: "/produtos#presentes" },
    ],
  },
  {
    type: "dropdown",
    key: "linhas",
    label: "Linhas",
    href: "#",
    items: [
      { label: "O Original", href: "/original" },
      { label: "Radicaline", href: "/tratamentos#radicaline" },
      { label: "Cuidados Especiais", href: "/tratamentos#cuidados-especiais" },
      { label: "Banho Aromático", href: "/fragrancias#banho-aromatico" },
      { label: "Águas Virtuosas", href: "/fragrancias#aguas-virtuosas" },
      { label: "Maison", href: "/maison" },
      { label: "Perfumaria Pierre", href: "/fragrancias#perfumaria" },
    ],
  },
  {
    type: "dropdown",
    key: "voce",
    label: "Para você",
    href: "#",
    items: [
      { label: "Cuidado Facial", href: "/tratamentos" },
      { label: "Corpo & Bem-estar", href: "/produtos#corpo" },
      { label: "Banho & Frescor", href: "/fragrancias#banho" },
      { label: "Fragrâncias & Expressão", href: "/fragrancias" },
      { label: "Bem-estar em Casa", href: "/maison" },
      { label: "Proteção Diária", href: "/original" },
      { label: "Para Presentear", href: "/produtos#presentes" },
    ],
  },
  { type: "link", key: "pierre", label: "A Pierre", href: "/sobre" },
  { type: "link", key: "onde-comprar", label: "Onde Comprar", href: "/onde-comprar" },
];

// Qual entrada do menu fica "ativa" em cada rota (replicando o protótipo).
export const activeKeyByPath: Record<string, string> = {
  "/": "inicio",
  "/produtos": "produtos",
  "/original": "linhas",
  "/produto-original": "linhas",
  "/maison": "linhas",
  "/fragrancias": "voce",
  "/tratamentos": "voce",
  "/sobre": "pierre",
  "/onde-comprar": "onde-comprar",
};
