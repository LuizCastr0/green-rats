// src/data/conquistas.js
// lista de conquistas para o usuário ganhar, vai precisasr de um sistema de notificações futuramente

export const conquistas = [
  {
    id: "eco_iniciante",
    titulo: "Eco Iniciante",
    descricao: "Registrou sua primeira ação pelo planeta.",
    objetivo: 1,
    tipo: "total_acoes",
    icone: "🍃",
  },
  {
    id: "mestre_veggie",
    titulo: "Mestre Veggie",
    descricao: "Fez 5 refeições veganas.",
    objetivo: 5,
    tipo: "categoria_alimentacao",
    icone: "🥗",
  },
  {
    id: "fogo_eterno",
    titulo: "Fogo Eterno",
    descricao: "Manteve um streak de 7 dias.",
    objetivo: 7,
    tipo: "max_streak",
    icone: "🔥",
  },
];

// adicionar mais conquistas, checar com o front
