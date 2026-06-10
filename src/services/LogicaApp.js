// src/services/LogicaApp.js

// aqui fica a lógica de negócio do app, o que acontece quando o usuário completa uma atividade
import {
  adicionarAcaoAoHistorico,
  checarNovasConquistas,
  carregarStreak,
} from './Armazenamento';

import {
  checarAtividadeJaFoiConcluidaHoje,
  marcarAtividadeComoConcluida,
} from './atividades';

export async function registrarAtividadeCompleta(atividade) {
  try {
    const jaFoiConcluidaHoje = await checarAtividadeJaFoiConcluidaHoje(atividade.id);

    if (jaFoiConcluidaHoje) {
      return {
        sucesso: false,
        erro: 'Essa atividade já foi concluída hoje.',
      };
    }

    await marcarAtividadeComoConcluida(atividade.id);

    await adicionarAcaoAoHistorico(
      atividade.titulo,
      Number(atividade.pontos) || 0,
      atividade.id,
    );

    // streak não é tocado aqui — só muda na virada de dia

    const streakInfo = await carregarStreak();
    const conquistasDesbloqueadas = await checarNovasConquistas();

    return {
      sucesso: true,
      novoStreak: streakInfo.contagem,
      novosTrofeus: conquistasDesbloqueadas,
    };
  } catch (error) {
    console.error('Erro ao concluir atividade:', error);
    return {
      sucesso: false,
      erro: 'Não foi possível concluir a atividade.',
    };
  }
}

export const calcularNovoStreak = (ultimaData, streakAtual) => {
  const hoje = new Date().toDateString();
  const ultima = new Date(ultimaData).toDateString();

  // Se a última interação foi ontem, incrementa
  const ontem = new Date();
  ontem.setDate(ontem.getDate() - 1);

  if (ultima === hoje) return streakAtual; // Mesmo dia, não faz nada
  if (ultima === ontem.toDateString()) return streakAtual + 1; // Streak continua
  return 1; // Perdeu o streak, reinicia em 1
};