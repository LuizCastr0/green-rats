// src/services/estatisticas.js

import {
  carregarHistorico,
  carregarPontuacao,
  carregarStreak,
  tamanhoDoInventario,
} from "./Armazenamento";

// retorna o valor atual do streak
export async function getStreakAtual() {
  const streak = await carregarStreak();
  return streak.contagem;
}

// retorna o total de ações já registradas no histórico
export async function getTotalDeAcoes() {
  const historico = await carregarHistorico();
  return historico.length;
}

// retorna um resumo geral do usuário para usar na interface
export async function getResumoDoUsuario() {
  return {
    totalDeAcoes: await getTotalDeAcoes(),
    totalDePontos: await carregarPontuacao(),
    streakAtual: await getStreakAtual(),
    itensNoInventario: await tamanhoDoInventario(),
  };
}
