// src/data/missoes.js

// missoẽs para senso de progrssão e comunidade

// criando missão global: todos os usuários recebem juntos,
// usando data local para contorinar o fato de nao termos servidor

export const missoesGlobais = [
  {
    id: "missao_sem_plastico",
    titulo: "Dia sem Plástico",
    descricao: "Não use sacolas ou garrafas plásticas hoje.",
    pontos: 100,
    icone: "🥤",
  },
  {
    id: "missao_banho_curto",
    titulo: "Banho de 5 Minutos",
    descricao: "Reduza seu tempo no banho para economizar água.",
    pontos: 80,
    icone: "🚿",
  },
  {
    id: "missao_apague_luzes",
    titulo: "Apague as Luzes",
    descricao: "Deixe luzes apagadas em cômodos vazios o dia todo.",
    pontos: 50,
    icone: "💡",
  },
  {
    id: "missao_sem_carne",
    titulo: "Segunda sem Carne",
    descricao: "Tente não consumir carne hoje.",
    pontos: 120,
    icone: "🌱",
  },
  {
    id: "missao_caminhada",
    titulo: "Caminhada Ecológica",
    descricao: "Troque um trajeto curto de carro por caminhada.",
    pontos: 90,
    icone: "🚶",
  },
  // adicionar mais missoes globais (nao sabemos sobre atualizações então quanto mais, melhor)
];
