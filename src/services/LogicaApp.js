// scr/services/LogicaApp.js

// aqui fica a lógica de negócio do app, o que acontece quando o usuário completa uma atividade,

import {
  adicionarAcaoAoHistorico,
  carregarPontuacao,
  salvarPontuacao,
} from "./Armazenamento";
import { atualizarStreak } from "./Armazenamento";
import { checarNovasConquistas } from "./Armazenamento";

export const registrarAtividadeCompleta = async (atividade) => {
  try {
    // salva ação e pontos
    await adicionarAcaoAoHistorico(atividade.titulo, atividade.pontos);

    // atualiza streak
    const streakInfo = await atualizarStreak();

    // checa se isso desbloqueou algum troféu
    const conquistasDesbloqueadas = await checarNovasConquistas();

    return {
      sucesso: true,
      novoStreak: streakInfo.contagem,
      novosTrofeus: conquistasDesbloqueadas, // isso pode ser uma lista de conquistas que o usuário acabou de ganhar, para mostrar uma notificação
    };
  } catch (error) {
    return { sucesso: false };
  }
};
