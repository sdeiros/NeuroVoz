// Dados compartilhados do NeuroVoz: vocabulário, categorias, conteúdo educativo.

export interface VocabItem {
  id: string;
  label: string;
  icon: string; // emoji usado apenas como pictograma dentro dos cartões AAC
  phrase?: string; // frase falada (se diferente do label)
  category: string;
  type?: 'subject' | 'verb' | 'object' | 'feeling' | 'social';
}

export const categories = [
  { id: 'nucleo', name: 'Núcleo', icon: '⭐', color: '#ffd166' },
  { id: 'alimentacao', name: 'Alimentação', icon: '🍎', color: '#ff9b85' },
  { id: 'emocoes', name: 'Emoções', icon: '😊', color: '#5cc9b0' },
  { id: 'escola', name: 'Escola', icon: '📚', color: '#5b8def' },
  { id: 'higiene', name: 'Higiene', icon: '🪥', color: '#8fb4f5' },
  { id: 'familia', name: 'Família', icon: '👨‍👩‍👧', color: '#c3a6ff' },
  { id: 'brincadeiras', name: 'Brincadeiras', icon: '🧸', color: '#ffb3c6' },
  { id: 'rotina', name: 'Rotina', icon: '🕐', color: '#7bd3ea' },
  { id: 'saude', name: 'Saúde', icon: '🩹', color: '#9ee493' },
  { id: 'transporte', name: 'Transporte', icon: '🚗', color: '#ffd6a5' },
];

export const vocabulary: VocabItem[] = [
  // Núcleo
  { id: 'eu-quero', label: 'Eu quero', icon: '🙋', category: 'nucleo', type: 'subject' },
  { id: 'eu-nao-quero', label: 'Não quero', icon: '🙅', category: 'nucleo', type: 'subject' },
  { id: 'eu-estou', label: 'Estou', icon: '👤', category: 'nucleo', type: 'subject' },
  { id: 'sim', label: 'Sim', icon: '✅', category: 'nucleo' },
  { id: 'nao', label: 'Não', icon: '❌', category: 'nucleo' },
  { id: 'ajuda', label: 'Ajuda', icon: '🆘', phrase: 'Preciso de ajuda', category: 'nucleo' },
  { id: 'mais', label: 'Mais', icon: '➕', category: 'nucleo' },
  { id: 'acabou', label: 'Acabou', icon: '🏁', category: 'nucleo' },
  { id: 'por-favor', label: 'Por favor', icon: '🙏', category: 'nucleo', type: 'social' },
  { id: 'obrigado', label: 'Obrigado', icon: '💖', category: 'nucleo', type: 'social' },

  // Alimentação
  { id: 'agua', label: 'Água', icon: '💧', category: 'alimentacao', type: 'object' },
  { id: 'suco', label: 'Suco', icon: '🧃', category: 'alimentacao', type: 'object' },
  { id: 'leite', label: 'Leite', icon: '🥛', category: 'alimentacao', type: 'object' },
  { id: 'comida', label: 'Comida', icon: '🍽️', category: 'alimentacao', type: 'object' },
  { id: 'fruta', label: 'Fruta', icon: '🍎', category: 'alimentacao', type: 'object' },
  { id: 'pao', label: 'Pão', icon: '🍞', category: 'alimentacao', type: 'object' },
  { id: 'bolacha', label: 'Bolacha', icon: '🍪', category: 'alimentacao', type: 'object' },
  { id: 'fome', label: 'Fome', icon: '🍴', phrase: 'com fome', category: 'alimentacao', type: 'feeling' },
  { id: 'sede', label: 'Sede', icon: '🥤', phrase: 'com sede', category: 'alimentacao', type: 'feeling' },

  // Emoções
  { id: 'feliz', label: 'Feliz', icon: '😀', category: 'emocoes', type: 'feeling' },
  { id: 'triste', label: 'Triste', icon: '😢', category: 'emocoes', type: 'feeling' },
  { id: 'bravo', label: 'Bravo', icon: '😠', category: 'emocoes', type: 'feeling' },
  { id: 'cansado', label: 'Cansado', icon: '😴', category: 'emocoes', type: 'feeling' },
  { id: 'medo', label: 'Com medo', icon: '😨', category: 'emocoes', type: 'feeling' },
  { id: 'animado', label: 'Animado', icon: '🤩', category: 'emocoes', type: 'feeling' },
  { id: 'calmo', label: 'Calmo', icon: '😌', category: 'emocoes', type: 'feeling' },
  { id: 'amor', label: 'Amo você', icon: '🥰', category: 'emocoes', type: 'social' },

  // Escola
  { id: 'professor', label: 'Professor', icon: '🧑‍🏫', category: 'escola' },
  { id: 'amigo', label: 'Amigo', icon: '🧑‍🤝‍🧑', category: 'escola' },
  { id: 'livro', label: 'Livro', icon: '📖', category: 'escola', type: 'object' },
  { id: 'desenhar', label: 'Desenhar', icon: '🖍️', category: 'escola', type: 'verb' },
  { id: 'ler', label: 'Ler', icon: '📕', category: 'escola', type: 'verb' },
  { id: 'pintar', label: 'Pintar', icon: '🎨', category: 'escola', type: 'verb' },
  { id: 'recreio', label: 'Recreio', icon: '⚽', category: 'escola' },
  { id: 'terminei', label: 'Terminei', icon: '🎉', category: 'escola' },

  // Higiene
  { id: 'banheiro', label: 'Banheiro', icon: '🚻', category: 'higiene' },
  { id: 'lavar-maos', label: 'Lavar as mãos', icon: '🧼', category: 'higiene', type: 'verb' },
  { id: 'escovar', label: 'Escovar dentes', icon: '🪥', category: 'higiene', type: 'verb' },
  { id: 'banho', label: 'Banho', icon: '🛁', category: 'higiene' },
  { id: 'trocar', label: 'Trocar roupa', icon: '👕', category: 'higiene', type: 'verb' },

  // Família
  { id: 'mamae', label: 'Mamãe', icon: '👩', category: 'familia' },
  { id: 'papai', label: 'Papai', icon: '👨', category: 'familia' },
  { id: 'irmao', label: 'Irmão', icon: '👦', category: 'familia' },
  { id: 'irma', label: 'Irmã', icon: '👧', category: 'familia' },
  { id: 'vovo', label: 'Vovó', icon: '👵', category: 'familia' },
  { id: 'vovô', label: 'Vovô', icon: '👴', category: 'familia' },
  { id: 'casa', label: 'Casa', icon: '🏠', category: 'familia' },
  { id: 'abraco', label: 'Abraço', icon: '🤗', category: 'familia', type: 'social' },

  // Brincadeiras
  { id: 'brincar', label: 'Brincar', icon: '🧸', category: 'brincadeiras', type: 'verb' },
  { id: 'bola', label: 'Bola', icon: '⚽', category: 'brincadeiras', type: 'object' },
  { id: 'carrinho', label: 'Carrinho', icon: '🚙', category: 'brincadeiras', type: 'object' },
  { id: 'boneca', label: 'Boneca', icon: '🪆', category: 'brincadeiras', type: 'object' },
  { id: 'blocos', label: 'Blocos', icon: '🧱', category: 'brincadeiras', type: 'object' },
  { id: 'musica', label: 'Música', icon: '🎵', category: 'brincadeiras', type: 'object' },
  { id: 'video', label: 'Vídeo', icon: '📺', category: 'brincadeiras', type: 'object' },
  { id: 'parque', label: 'Parque', icon: '🛝', category: 'brincadeiras' },

  // Rotina
  { id: 'acordar', label: 'Acordar', icon: '🌅', category: 'rotina', type: 'verb' },
  { id: 'dormir', label: 'Dormir', icon: '🛏️', category: 'rotina', type: 'verb' },
  { id: 'comer', label: 'Comer', icon: '🍽️', category: 'rotina', type: 'verb' },
  { id: 'ir', label: 'Ir', icon: '🚶', category: 'rotina', type: 'verb' },
  { id: 'esperar', label: 'Esperar', icon: '⏳', category: 'rotina', type: 'verb' },
  { id: 'agora', label: 'Agora', icon: '⏰', category: 'rotina' },
  { id: 'depois', label: 'Depois', icon: '➡️', category: 'rotina' },

  // Saúde
  { id: 'dor', label: 'Dor', icon: '🤕', phrase: 'com dor', category: 'saude', type: 'feeling' },
  { id: 'doente', label: 'Doente', icon: '🤒', category: 'saude', type: 'feeling' },
  { id: 'remedio', label: 'Remédio', icon: '💊', category: 'saude', type: 'object' },
  { id: 'medico', label: 'Médico', icon: '🩺', category: 'saude' },
  { id: 'curativo', label: 'Curativo', icon: '🩹', category: 'saude', type: 'object' },

  // Transporte
  { id: 'carro', label: 'Carro', icon: '🚗', category: 'transporte', type: 'object' },
  { id: 'onibus', label: 'Ônibus', icon: '🚌', category: 'transporte', type: 'object' },
  { id: 'bicicleta', label: 'Bicicleta', icon: '🚲', category: 'transporte', type: 'object' },
  { id: 'aviao', label: 'Avião', icon: '✈️', category: 'transporte', type: 'object' },
  { id: 'passear', label: 'Passear', icon: '🌳', category: 'transporte', type: 'verb' },
];

export function vocabByCategory(catId: string): VocabItem[] {
  return vocabulary.filter((v) => v.category === catId);
}
