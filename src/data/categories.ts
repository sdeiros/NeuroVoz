// @ts-nocheck
/**
 * Categorização visual automática.
 * Define a cor de cada atividade com base em sua categoria, emoji ou nome.
 * Nunca mais o usuário escolhe cor manualmente.
 */

export type CategoryId =
  | 'estudo' | 'arte' | 'esporte' | 'alimentacao'
  | 'higiene' | 'sono' | 'lazer' | 'saude' | 'outro';

export type CategoryDef = {
  id: CategoryId;
  label: string;
  emoji: string;
  color: string;
  emojis: string[];
  keywords: string[];
};

export const CATEGORIES: CategoryDef[] = [
  {
    id: 'estudo', label: 'Estudo', emoji: '📚', color: '#5b8def',
    emojis: ['📚','✏️','🎒','🏫','📖','🖊️','🧮','📝','🗒️','💻','🔬'],
    keywords: ['estudo','estudar','escola','aula','lição','dever','tarefa escolar','leitura','ler','livro','prova','redação','tema','curso','faculdade'],
  },
  {
    id: 'arte', label: 'Arte', emoji: '🎨', color: '#a78bfa',
    emojis: ['🎨','🖌️','🖼️','✂️','🎭','🪄','🖍️','🧶'],
    keywords: ['arte','desenhar','desenho','pintar','pintura','colorir','massinha','artesanato','musical','teatro','dança','dancar','dança'],
  },
  {
    id: 'esporte', label: 'Esporte', emoji: '⚽', color: '#2fbf71',
    emojis: ['⚽','🏀','🏃','🚴','🤸','🏊','🏐','🥋','🎾','⛹️'],
    keywords: ['esporte','futebol','correr','corrida','bike','bicicleta','natação','treino','academia','exercicio','exercício','caminhar','caminhada','jogar bola'],
  },
  {
    id: 'alimentacao', label: 'Alimentação', emoji: '🍽', color: '#f5a623',
    emojis: ['🍎','🥣','🥤','🍞','🍪','🥦','🧃','🍽️','🍝','🥗','🍌','🥪','🍚','🥘','🍳','🥛'],
    keywords: ['café','cafe','café da manhã','cafe da manha','almoço','almoco','jantar','lanche','comida','comer','beber','água','agua','suco','refeição','refeicao','merenda'],
  },
  {
    id: 'higiene', label: 'Higiene', emoji: '🛁', color: '#06b6d4',
    emojis: ['🦷','🚿','🛁','👕','🧼','🚽','🪥','🧴','🪞'],
    keywords: ['higiene','escovar','dente','dentes','banho','tomar banho','lavar','lavar mão','lavar mãos','lavar mao','rosto','vestir','trocar de roupa','pentear','xixi','cocô','coco','banheiro'],
  },
  {
    id: 'sono', label: 'Sono', emoji: '😴', color: '#6366f1',
    emojis: ['😴','🌙','🛏️','💤','🌛'],
    keywords: ['dormir','sono','soneca','cochilo','cama','descansar','descanso','noite'],
  },
  {
    id: 'lazer', label: 'Lazer', emoji: '🎮', color: '#ec4899',
    emojis: ['🎮','📺','🎵','🧩','🎲','🐶','🎬','🪀','🃏'],
    keywords: ['lazer','brincar','brincadeira','jogar','jogo','vídeo','video','desenho animado','tv','tablet','passear','parque','filme','assistir'],
  },
  {
    id: 'saude', label: 'Saúde', emoji: '❤️', color: '#ef6b6b',
    emojis: ['❤️','💊','🩺','🧘','💧','🩹','🌡️'],
    keywords: ['saúde','saude','remédio','remedio','medicação','medicacao','médico','medico','consulta','terapia','fono','fonoaudio','psico','TO','to ','dentista','vacina','meditar','respirar','meditação'],
  },
];

const FALLBACK_PALETTE = ['#5b8def','#a78bfa','#2fbf71','#f5a623','#06b6d4','#6366f1','#ec4899','#ef6b6b','#22c1c3','#84cc16'];

const CAT_BY_EMOJI = new Map<string, CategoryDef>();
CATEGORIES.forEach((c) => c.emojis.forEach((e) => CAT_BY_EMOJI.set(e, c)));

function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) { h = ((h << 5) - h + s.charCodeAt(i)) | 0; }
  return Math.abs(h);
}

/** Resolve categoria a partir de { category? , icon?, name? } */
export function detectCategory(input: { category?: string; icon?: string; name?: string }): CategoryDef {
  if (input.category) {
    const c = CATEGORIES.find((x) => x.id === input.category);
    if (c) return c;
  }
  if (input.icon && CAT_BY_EMOJI.has(input.icon)) return CAT_BY_EMOJI.get(input.icon)!;
  const name = (input.name || '').toLowerCase();
  if (name) {
    for (const c of CATEGORIES) {
      if (c.keywords.some((k) => name.includes(k))) return c;
    }
  }
  // fallback determinístico pelo nome
  const seed = input.name || input.icon || 'x';
  const color = FALLBACK_PALETTE[hashStr(seed) % FALLBACK_PALETTE.length];
  return { id: 'outro', label: 'Outro', emoji: '✨', color, emojis: [], keywords: [] };
}

/** Cor inteligente para uma atividade (com fallback). */
export function colorForActivity(a: { category?: string; icon?: string; name?: string; color?: string }): string {
  // Mantém compat: se houver color salvo de versão antiga, ainda funciona;
  // mas a partir de agora a cor é sempre derivada pela categoria.
  return detectCategory(a).color;
}
