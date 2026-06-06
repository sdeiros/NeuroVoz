export type InterestKeys = 'dinosaurs' | 'vehicles' | 'animals';

export type AlphabetItem = {
  letter: string;
  lower: string;
  word: string; // default example word
  examplePronunciation?: string; // e.g. "A de Água"
  emoji?: string; // small illustration fallback
  extras?: string[]; // extra words for the same letter
  interests?: Partial<Record<InterestKeys, string>>;
};

export const ALPHABET: AlphabetItem[] = [
  { letter: 'A', lower: 'a', word: 'Água', examplePronunciation: 'A de Água', emoji: '💧', extras: ['Abelha', 'Amigo', 'Arco'], interests: { dinosaurs: 'Apatossauro', vehicles: 'Automóvel', animals: 'Arara' } },
  { letter: 'B', lower: 'b', word: 'Bola', examplePronunciation: 'B de Bola', emoji: '⚽', extras: ['Bicicleta', 'Barco', 'Biscoito'], interests: { dinosaurs: 'Braquiossauro', vehicles: 'Bicicleta', animals: 'Borboleta' } },
  { letter: 'C', lower: 'c', word: 'Cachorro', examplePronunciation: 'C de Cachorro', emoji: '🐶', extras: ['Cama', 'Casa', 'Cadeado'], interests: { dinosaurs: 'Carnotauro', vehicles: 'Caminhão', animals: 'Cachorro' } },
  { letter: 'D', lower: 'd', word: 'Dado', examplePronunciation: 'D de Dado', emoji: '🎲', extras: ['Dente', 'Dinheiro', 'Dança'], interests: { dinosaurs: 'Dilophosaurus', vehicles: 'Drone', animals: 'Dinossauro (brinquedo)' } },
  { letter: 'E', lower: 'e', word: 'Elefante', examplePronunciation: 'E de Elefante', emoji: '🐘', extras: ['Escola', 'Estrela', 'Espelho'], interests: { dinosaurs: 'Estrutossauro', vehicles: 'Escavadeira', animals: 'Elefante' } },
  { letter: 'F', lower: 'f', word: 'Foca', examplePronunciation: 'F de Foca', emoji: '🐟', extras: ['Flor', 'Futebol', 'Faca'], interests: { dinosaurs: 'Fukuiraptor', vehicles: 'Furgão', animals: 'Foca' } },
  { letter: 'G', lower: 'g', word: 'Gato', examplePronunciation: 'G de Gato', emoji: '🐱', extras: ['Gelo', 'Gira‑gira', 'Garrafa'], interests: { dinosaurs: 'Giganotossauro', vehicles: 'Guincho', animals: 'Gato' } },
  { letter: 'H', lower: 'h', word: 'Helicóptero', examplePronunciation: 'H de Helicóptero', emoji: '🚁', extras: ['Habitação', 'Horta', 'Hospital'], interests: { dinosaurs: 'Heterodontossauro', vehicles: 'Helicóptero', animals: 'Hiena' } },
  { letter: 'I', lower: 'i', word: 'Igreja', examplePronunciation: 'I de Igreja', emoji: '⛪', extras: ['Ilha', 'Inseto', 'Ímã'], interests: { dinosaurs: 'Irritator', vehicles: 'Ilha (barco)', animals: 'Iguana' } },
  { letter: 'J', lower: 'j', word: 'Janela', examplePronunciation: 'J de Janela', emoji: '🪟', extras: ['Jardim', 'Jogo', 'Jornal'], interests: { dinosaurs: 'Jobaria', vehicles: 'Jipe', animals: 'Jacaré' } },
  { letter: 'K', lower: 'k', word: 'Kilo', examplePronunciation: 'K de Kilo', emoji: '⚖️', extras: ['Karatê', 'Ketchup', 'Kiwi'], interests: { dinosaurs: 'Kritosaurus', vehicles: 'Kayak', animals: 'Kiwi' } },
  { letter: 'L', lower: 'l', word: 'Leão', examplePronunciation: 'L de Leão', emoji: '🦁', extras: ['Livro', 'Laranja', 'Lápis'], interests: { dinosaurs: 'Lesothosaurus', vehicles: 'Limusine', animals: 'Leão' } },
  { letter: 'M', lower: 'm', word: 'Moto', examplePronunciation: 'M de Moto', emoji: '🏍️', extras: ['Mamãe', 'Mesa', 'Mala'], interests: { dinosaurs: 'Megalosaurus', vehicles: 'Moto', animals: 'Macaco' } },
  { letter: 'N', lower: 'n', word: 'Navio', examplePronunciation: 'N de Navio', emoji: '🚢', extras: ['Ninho', 'Nuvem', 'Noite'], interests: { dinosaurs: 'Nodosaurus', vehicles: 'Navio', animals: 'Naja' } },
  { letter: 'O', lower: 'o', word: 'Óculos', examplePronunciation: 'O de Óculos', emoji: '👓', extras: ['Ovelha', 'Ovo', 'Olho'], interests: { dinosaurs: 'Oviraptor', vehicles: 'Ônibus', animals: 'Ovelha' } },
  { letter: 'P', lower: 'p', word: 'Pato', examplePronunciation: 'P de Pato', emoji: '🦆', extras: ['Pipa', 'Pente', 'Pão'], interests: { dinosaurs: 'Parasaurolophus', vehicles: 'Patinete', animals: 'Pato' } },
  { letter: 'Q', lower: 'q', word: 'Queijo', examplePronunciation: 'Q de Queijo', emoji: '🧀', extras: ['Quarto', 'Quente', 'Quintal'], interests: { dinosaurs: 'Quetzalcoatlus', vehicles: 'Quadriciclo', animals: 'Quati' } },
  { letter: 'R', lower: 'r', word: 'Rosa', examplePronunciation: 'R de Rosa', emoji: '🌹', extras: ['Rato', 'Relógio', 'Rampa'], interests: { dinosaurs: 'Rugops', vehicles: 'Rádio (carrinho)', animals: 'Rinoceronte' } },
  { letter: 'S', lower: 's', word: 'Sol', examplePronunciation: 'S de Sol', emoji: '☀️', extras: ['Sapato', 'Sapo', 'Sereia'], interests: { dinosaurs: 'Spinosaurus', vehicles: 'Skate', animals: 'Sapo' } },
  { letter: 'T', lower: 't', word: 'Trator', examplePronunciation: 'T de Trator', emoji: '🚜', extras: ['Telefone', 'Tijolo', 'Túnel'], interests: { dinosaurs: 'Tiranossauro', vehicles: 'Trator', animals: 'Tartaruga' } },
  { letter: 'U', lower: 'u', word: 'Urso', examplePronunciation: 'U de Urso', emoji: '🐻', extras: ['Umbigo', 'Ultrassom', 'Uva'], interests: { dinosaurs: 'Ultrasaurus', vehicles: 'U-boat', animals: 'Urso' } },
  { letter: 'V', lower: 'v', word: 'Van', examplePronunciation: 'V de Van', emoji: '🚐', extras: ['Vela', 'Vaca', 'Violão'], interests: { dinosaurs: 'Velociraptor', vehicles: 'Van', animals: 'Vaca' } },
  { letter: 'W', lower: 'w', word: 'Waffle', examplePronunciation: 'W de Waffle', emoji: '🧇', extras: ['Whisky', 'Website', 'Windsurf'], interests: { dinosaurs: 'Wuerhosaurus', vehicles: 'Winch', animals: 'Wallaby' } },
  { letter: 'X', lower: 'x', word: 'Xilofone', examplePronunciation: 'X de Xilofone', emoji: '🎼', extras: ['Xícara', 'Xadrez', 'Xarope'], interests: { dinosaurs: 'Xenoceratops', vehicles: 'X-wing (brinquedo)', animals: 'Xaréu' } },
  { letter: 'Y', lower: 'y', word: 'Yoga', examplePronunciation: 'Y de Yoga', emoji: '🧘', extras: ['Yakult', 'YOGA', 'Yin'], interests: { dinosaurs: 'Yamaceratops', vehicles: 'Yacht', animals: 'Yak' } },
  { letter: 'Z', lower: 'z', word: 'Zebra', examplePronunciation: 'Z de Zebra', emoji: '🦓', extras: ['Zíper', 'Zangão', 'Zoológico'], interests: { dinosaurs: 'Zby', vehicles: 'Zepelim', animals: 'Zebra' } },
];

export default ALPHABET;
