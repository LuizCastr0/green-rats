// scr/services/estatisticas.js

import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  carregarPontuacao,
  carregarStreak,
  tamanhoDoInventario,
} from "./Armazenamento";
import { carregarAtividadesConcluidas } from "./atividades";

export async function getStreakAtual() {
  const streak = await carregarStreak();
  return streak.contagem;
}

export async function getTotalDeAcoes() {
  const atividadesConcluidas = await carregarAtividadesConcluidas();
  return atividadesConcluidas.length;
}

export async function getResumoDoUsuario() {
  return {
    totalDeAcoes: await getTotalDeAcoes(),
    totalDePontos: await carregarPontuacao(),
    streakAtual: await getStreakAtual(),
    itensNoInventario: await tamanhoDoInventario(),
  };
}
