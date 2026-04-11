// src/services/LogicaApp.js

// aqui fica a lógica de negócio do app, o que acontece quando o usuário completa uma atividade

import {
  adicionarAcaoAoHistorico,
  checarNovasConquistas,
  carregarStreak,
} from "./Armazenamento";

import {
  atividadeJaFoiConcluidaHoje,
  marcarAtividadeComoConcluida,
} from "./atividades";

export async function registrarAtividadeCompleta(atividade) {
  try {
    // verifica se essa atividade já foi concluída hoje
    const jaFoiConcluidaHoje = await atividadeJaFoiConcluidaHoje(atividade.id);

    if (jaFoiConcluidaHoje) {
      return {
        sucesso: false,
        erro: "Essa atividade já foi concluída hoje.",
      };
    }

    // marca a atividade como concluída no dia atual
    await marcarAtividadeComoConcluida(atividade.id);

    // registra no histórico e soma os pontos da atividade
    await adicionarAcaoAoHistorico(
      atividade.titulo,
      Number(atividade.pontos) || 0,
    );

    // pega o streak já atualizado
    const streakInfo = await carregarStreak();

    // checa se isso desbloqueou algum troféu
    const conquistasDesbloqueadas = await checarNovasConquistas();

    // retorna os dados para a interface
    return {
      sucesso: true,
      novoStreak: streakInfo.contagem,
      novosTrofeus: conquistasDesbloqueadas,
    };
  } catch (error) {
    console.error("Erro ao concluir atividade:", error);

    return {
      sucesso: false,
      erro: "Não foi possível concluir a atividade.",
    };
  }
}
