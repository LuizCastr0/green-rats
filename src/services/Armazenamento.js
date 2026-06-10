// src/services/Armazenamento.js

import AsyncStorage from "@react-native-async-storage/async-storage";

const CHAVES = {
  progresso: "rat:progresso",
  objetivos: "rat:objetivos",
  historico: "rat:historico",
  pontuacao: "rat:pontuacao",
  streak: "rat:streak",
  inventario: "rat:inventario",
  conquistas: "rat:conquistas",
  dataSimulada: "rat:dataSimulada", // usado apenas para testes de avanço de dia
};

// ─────────────────────────────────────────────────────────────────────────────
// Funções internas
// ─────────────────────────────────────────────────────────────────────────────

async function salvar(chave, valor) {
  try {
    await AsyncStorage.setItem(chave, JSON.stringify(valor));
  } catch (error) {
    console.error(`[Armazenamento] Erro ao salvar "${chave}":`, error);
    throw error;
  }
}

async function carregar(chave, valorPadrao = null) {
  try {
    const texto = await AsyncStorage.getItem(chave);
    if (texto != null) return JSON.parse(texto);
    return valorPadrao;
  } catch (error) {
    console.error(`[Armazenamento] Erro ao carregar "${chave}":`, error);
    throw error;
  }
}

async function apagar(chave) {
  try {
    await AsyncStorage.removeItem(chave);
  } catch (error) {
    console.error(`[Armazenamento] Erro ao remover "${chave}":`, error);
    throw error;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Data — respeita simulação de dia para testes
// getHoje() é a única fonte de "hoje" em todo o arquivo.
// Quando há uma data simulada salva, ela é usada no lugar de new Date().
// ─────────────────────────────────────────────────────────────────────────────

export async function getHoje() {
  const simulada = await carregar(CHAVES.dataSimulada, null);
  const data = simulada ? new Date(simulada) : new Date();
  data.setHours(0, 0, 0, 0);
  return data;
}

export function getChaveDoDia(data) {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Ferramenta de teste — avança um dia no AsyncStorage
// Faz tudo atomicamente: avança a data, zera atividades do dia,
// e recalcula o streak corretamente.
// ─────────────────────────────────────────────────────────────────────────────

export async function atualizarStreak() {
  try {
    const hoje = new Date();
    const hojeStr = hoje.toISOString().slice(0, 10); // "2025-06-10"

    const dadosStreak = await carregar(CHAVES.streak, {
      contagem: 0,
      ultimaData: null,
    });

    const ultimaData = dadosStreak.ultimaData; // "2025-06-09" ou null

    // Já registrou algo hoje — não altera nada
    if (ultimaData === hojeStr) {
      return dadosStreak;
    }

    // Calculando diferença em dias
    let novaContagem;
    if (ultimaData === null) {
      // Primeira vez usando o app
      novaContagem = 1;
    } else {
      const ontem = new Date(hoje);
      ontem.setDate(ontem.getDate() - 1);
      const ontemStr = ontem.toISOString().slice(0, 10);

      if (ultimaData === ontemStr) {
        // Usou ontem → sequência continua
        novaContagem = dadosStreak.contagem + 1;
      } else {
        // Pulou um ou mais dias → reseta
        novaContagem = 1;
      }
    }

    const novoStreak = { contagem: novaContagem, ultimaData: hojeStr };
    await salvar(CHAVES.streak, novoStreak);
    return novoStreak;
  } catch (error) {
    console.error('Erro ao atualizar streak:', error);
    return { contagem: 0, ultimaData: null };
  }
}



export async function avancarDiaParaTeste() {
  try {
    // pega a data atual simulada (ou real) e avança 1 dia
    const hoje = await getHoje();
    const amanha = new Date(hoje);
    amanha.setDate(amanha.getDate() + 1);
    amanha.setHours(0, 0, 0, 0);

    // salva a nova data simulada
    await salvar(CHAVES.dataSimulada, amanha.toISOString());

    // zera as atividades concluídas — usa a chave do novo dia (que está vazio)
    // o reset acontece naturalmente porque a chave salva será de ontem
    // não precisamos apagar nada — carregarAtividadesConcluidas vai comparar
    // a data salva com amanha e vai zerar sozinho

    console.log(`[DEV] Dia avançado para: ${getChaveDoDia(amanha)}`);
    return { sucesso: true, novaData: amanha.toISOString() };
  } catch (error) {
    console.error("[DEV] Erro ao avançar dia:", error);
    return { sucesso: false };
  }
}

export async function resetarDataSimulada() {
  await apagar(CHAVES.dataSimulada);
}

// ─────────────────────────────────────────────────────────────────────────────
// Progresso
// ─────────────────────────────────────────────────────────────────────────────

export async function salvarNovoProgresso(progresso) {
  await salvar(CHAVES.progresso, progresso);
}

export async function carregarProgresso() {
  return carregar(CHAVES.progresso, null);
}

export async function apagarProgresso() {
  await apagar(CHAVES.progresso);
}

// ─────────────────────────────────────────────────────────────────────────────
// Objetivos
// ─────────────────────────────────────────────────────────────────────────────

export async function substituirObjetivos(objetivos) {
  await salvar(CHAVES.objetivos, objetivos);
}

export async function carregarObjetivosAtuais() {
  return carregar(CHAVES.objetivos, []);
}

export async function removerObjetivosAtuais() {
  await apagar(CHAVES.objetivos);
}

// ─────────────────────────────────────────────────────────────────────────────
// Histórico
// ─────────────────────────────────────────────────────────────────────────────

export async function salvarHistorico(historico) {
  await salvar(CHAVES.historico, historico);
}

export async function carregarHistorico() {
  return carregar(CHAVES.historico, []);
}

export async function removerHistorico() {
  await apagar(CHAVES.historico);
}

// ─────────────────────────────────────────────────────────────────────────────
// Pontuação
// ─────────────────────────────────────────────────────────────────────────────

export async function salvarPontuacao(pontuacao) {
  await salvar(CHAVES.pontuacao, pontuacao);
}

export async function carregarPontuacao() {
  return carregar(CHAVES.pontuacao, 0);
}

export async function removerPontuacao() {
  await apagar(CHAVES.pontuacao);
}

// ─────────────────────────────────────────────────────────────────────────────
// Histórico + pontuação + streak — registro de ação
// ─────────────────────────────────────────────────────────────────────────────

export async function adicionarAcaoAoHistorico(acaoNome, pontosGanhos, idAtividade = null) {
  try {
    const historicoAtual = await carregar(CHAVES.historico, []);

    const novoRegistro = {
      id: Date.now().toString(),
      idAtividade,
      acao: acaoNome,
      pontos: pontosGanhos,
      data: new Date().toISOString(),
    };

    await salvar(CHAVES.historico, [novoRegistro, ...historicoAtual]);

    const pontuacaoAntiga = await carregarPontuacao();
    await salvarPontuacao(pontuacaoAntiga + pontosGanhos);

    // streak NÃO é atualizado aqui — só muda quando o dia vira

    return true;
  } catch (error) {
    console.error('Erro ao registrar ação:', error);
    return false;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Streak — usa getHoje() para respeitar data simulada
// ─────────────────────────────────────────────────────────────────────────────

// Chamada APENAS quando o dia vira (real ou simulado).
// Recebe a data do dia que ACABOU de passar (ontem) e se houve atividade nele.
// Retorna o novo objeto de streak.
export async function processarStreakDaVirada(dataOntem, teveAtividade) {
  try {
    const dadosStreak = await carregar(CHAVES.streak, {
      contagem: 0,
      ultimaData: null,
    });

    let novaContagem;

    if (!teveAtividade) {
      // não fez nada ontem — streak vai para 0
      novaContagem = 0;
    } else if (!dadosStreak.ultimaData) {
      // primeira vez que registra algo — começa em 1
      novaContagem = 1;
    } else {
      // verifica se ontem é exatamente o dia seguinte ao último streak
      const ultimaData = new Date(dadosStreak.ultimaData);
      ultimaData.setHours(0, 0, 0, 0);
      const ontem = new Date(dataOntem);
      ontem.setHours(0, 0, 0, 0);
      const diferencaDias = Math.round(
        (ontem.getTime() - ultimaData.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (diferencaDias === 1) {
        // dia seguinte consecutivo — incrementa
        novaContagem = dadosStreak.contagem + 1;
      } else if (diferencaDias === 0) {
        // mesmo dia (não deveria acontecer, mas protege)
        novaContagem = dadosStreak.contagem;
      } else {
        // pulou dias — reseta para 1 (teve atividade ontem, só não foi consecutivo)
        novaContagem = 1;
      }
    }

    const novoStreak = {
      contagem: novaContagem,
      ultimaData: dataOntem, // data do dia que acabou de contar
    };

    await salvar(CHAVES.streak, novoStreak);
    return novoStreak;
  } catch (error) {
    console.error('Erro ao processar streak da virada:', error);
    return { contagem: 0, ultimaData: null };
  }
}

export async function carregarStreak() {
  return carregar(CHAVES.streak, { contagem: 0, ultimaData: null });
}

// ─────────────────────────────────────────────────────────────────────────────
// Conquistas
// ─────────────────────────────────────────────────────────────────────────────

import { conquistas } from "../data/conquistas";

export async function carregarConquistasGanhas() {
  return carregar(CHAVES.conquistas, { ganhas: [] });
}

export async function checarNovasConquistas() {
  const historico = await carregarHistorico();
  const streak = await carregarStreak();
  const conquistasJaGanhas = await carregarConquistasGanhas();

  let novasConquistasNestaSessao = [];

  const idsFeitos = new Set(
    historico.map((item) => item.idAtividade).filter(Boolean)
  );

  const contagemPorId = {};
  historico.forEach((item) => {
    if (item.idAtividade) {
      contagemPorId[item.idAtividade] =
        (contagemPorId[item.idAtividade] || 0) + 1;
    }
  });

  conquistas.forEach((c) => {
    if (conquistasJaGanhas.ganhas.includes(c.id)) return;

    let alcancou = false;

    if (c.tipo === "total_acoes") {
      alcancou = historico.length >= c.objetivo;
    } else if (c.tipo === "max_streak") {
      alcancou = streak.contagem >= c.objetivo;
    } else if (c.tipo === "acoes_ids") {
      alcancou = c.idsNecessarios.every((id) => idsFeitos.has(id));
    } else if (c.tipo === "contagem_acao") {
      alcancou = (contagemPorId[c.idAlvo] || 0) >= c.objetivo;
    }

    if (alcancou) {
      conquistasJaGanhas.ganhas.push(c.id);
      novasConquistasNestaSessao.push(c);
    }
  });

  if (novasConquistasNestaSessao.length > 0) {
    await salvar(CHAVES.conquistas, conquistasJaGanhas);
  }

  return novasConquistasNestaSessao;
}

export async function checarConquista(conquista) {
  const conquistasAtuais = await carregarConquistasGanhas();
  return conquistasAtuais.ganhas.includes(conquista.id);
}

export async function limparConquistas() {
  await apagar(CHAVES.conquistas);
}

// ─────────────────────────────────────────────────────────────────────────────
// Inventário e loja
// ─────────────────────────────────────────────────────────────────────────────

export async function carregarInventario() {
  return carregar(CHAVES.inventario, []);
}

export async function checarItemNoInventario(item) {
  const inventarioAtual = await carregarInventario();
  return inventarioAtual.some((i) => i.id === item.id);
}

export async function comprarItem(item) {
  try {
    const pontosAtuais = await carregarPontuacao();

    if (pontosAtuais < item.preco) {
      return { sucesso: false, erro: "Pontos insuficientes!" };
    }

    const itemJaExiste = await checarItemNoInventario(item);
    if (itemJaExiste) {
      return { sucesso: false, erro: "Você já possui este item!" };
    }

    const inventarioAtual = await carregarInventario();
    const novoInventario = [...inventarioAtual, item];

    await salvarPontuacao(pontosAtuais - item.preco);
    await salvar(CHAVES.inventario, novoInventario);

    return { sucesso: true, novoSaldo: pontosAtuais - item.preco };
  } catch (error) {
    console.error("Erro ao processar compra:", error);
    return { sucesso: false, erro: "Erro ao processar compra." };
  }
}

// Chamada pela HomeScreen ao abrir. Verifica se o dia real virou
// desde a última vez que o app foi aberto.
export async function verificarViradaDeDia() {
  try {
    const CHAVE_ATIVIDADES = 'rat:atividadesConcluidasHoje';

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const chaveHoje = hoje.toISOString().slice(0, 10); // "2026-06-09"

    const statusAtividades = await carregar(CHAVE_ATIVIDADES, {
      data: null,
      ids: [],
    });

    // Se a data salva já é hoje, o dia não virou — não faz nada
    if (statusAtividades.data === chaveHoje) return false;

    // O dia virou. A data salva é "ontem" (ou mais antigo).
    // Verifica se o usuário fez alguma atividade naquele dia.
    const teveAtividade =
      Array.isArray(statusAtividades.ids) && statusAtividades.ids.length > 0;

    const dataOntem = statusAtividades.data; // pode ser null se for o primeiro uso

    // Processa o streak com base no que aconteceu ontem
    if (dataOntem !== null) {
      await processarStreakDaVirada(dataOntem, teveAtividade);
    }

    // Abre o novo dia com lista vazia
    await salvar(CHAVE_ATIVIDADES, { data: chaveHoje, ids: [] });

    return true; // houve virada
  } catch (error) {
    console.error('[Armazenamento] Erro em verificarViradaDeDia:', error);
    return false;
  }
}

export async function simularViradaDia() {
  try {
    const dadosStreak = await carregar(CHAVES.streak, { contagem: 0, ultimaData: null });
    const objetivosHoje = await carregarObjetivosAtuais();

    const streakAnterior = dadosStreak.contagem;
    const ultimaData = dadosStreak.ultimaData;

    // Avança 1 dia a partir da última data conhecida (ou hoje)
    const base = ultimaData ? new Date(ultimaData + 'T12:00:00') : new Date();
    base.setDate(base.getDate() + 1);
    const novaDataStr = base.toISOString().slice(0, 10);

    // Tinha atividade "hoje" (antes da virada simulada)?
    const teveAtividade = objetivosHoje.length > 0;
    const streakAtual = teveAtividade ? streakAnterior + 1 : 1;

    await salvar(CHAVES.streak, {
      contagem: streakAtual,
      ultimaData: novaDataStr,
    });
    await removerObjetivosAtuais();

    return {
      streakAnterior,
      streakAtual,
      atividadesResetadas: objetivosHoje.length,
      dataSimulada: base.toLocaleDateString('pt-BR'),
    };
  } catch (error) {
    console.error('[dev] Erro ao simular virada de dia:', error);
    throw error;
  }
}

export async function salvarItemNoInventario(item) {
  const inventarioAtual = await carregarInventario();
  await salvar(CHAVES.inventario, [...inventarioAtual, item]);
}

export async function removerItemDoInventario(item) {
  const itemNoInventario = await checarItemNoInventario(item);
  if (!itemNoInventario) {
    return { sucesso: false, erro: "Item não encontrado no inventário." };
  }
  const inventarioAtual = await carregarInventario();
  const inventarioNovo = inventarioAtual.filter((i) => i.id !== item.id);
  await salvar(CHAVES.inventario, inventarioNovo);
  return { sucesso: true };
}

export async function buscarItemPorId(idDoItem) {
  const inventarioAtual = await carregarInventario();
  return inventarioAtual.find((i) => i.id === idDoItem) || null;
}

export async function limparInventario() {
  await salvar(CHAVES.inventario, []);
}

export async function tamanhoDoInventario() {
  const inventarioAtual = await carregarInventario();
  return inventarioAtual.length;
}

// ─────────────────────────────────────────────────────────────────────────────
// Reset completo
// ─────────────────────────────────────────────────────────────────────────────

export async function limparDadosDoUsuario() {
  try {
    await AsyncStorage.multiRemove(Object.values(CHAVES));
  } catch (error) {
    console.error("[Armazenamento] Erro ao limpar dados do usuário:", error);
    throw error;
  }
}

// alias usado pela DevScreen
export async function resetarTudo() {
  await AsyncStorage.clear();
}