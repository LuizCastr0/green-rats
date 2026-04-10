// scr/services/LogicaApp.js

// aqui fica a lógica de negócio do app, o que acontece quando o usuário completa uma atividade,



import { adicionarAcaoAoHistorico, carregarPontuacao, salvarPontuacao } from './Armazenamento';
import { atualizarStreak } from './Armazenamento';

export const registrarAtividadeCompleta = async (atividade) => {
  try {
    // salva no histórico e já soma os pontos automaticamente
    await adicionarAcaoAoHistorico(atividade.titulo, atividade.pontos);

    // 2. Valida o Streak (se é um novo dia, etc)
    const novoStreak = await atualizarStreak();

    return { 
      sucesso: true, 
      novoStreak: novoStreak.contagem,
      // Você pode retornar mais coisas para o front fazer brilhar na tela
    };
  } catch (error) {
    console.error("Falha na operação mestre:", error);
    return { sucesso: false };
  }
};