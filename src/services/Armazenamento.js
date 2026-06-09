// src/services/Armazenamento.js

// arquivo responsável por toda a lógica de armazenamento local do app, usando AsyncStorage para guardar os dados no celular do usuário
// vai ficar desorganizado no começo, mas a ideia é ir melhorando e organizando conforme o desenvolvimento do app avança

import AsyncStorage from "@react-native-async-storage/async-storage";

// chaves de armazenamento para organizar os dados salvos no celular
const CHAVES = {
  progresso: "rat:progresso",
  objetivos: "rat:objetivos",
  historico: "rat:historico",
  pontuacao: "rat:pontuacao",
  streak: "rat:streak",
  inventario: "rat:inventario", // itens já comprados
  conquistas: "rat:conquistas",
};

//funções externas────────────────────────────────────────────────────────────────────────

// Converte qualquer valor em texto e salva no armazenamento local.
async function salvar(chave, valor) {
  try {
    await AsyncStorage.setItem(chave, JSON.stringify(valor));
  } catch (error) {
    console.error(`[storageService] Erro ao salvar "${chave}":`, error);
    throw error;
  }
}

// Lê o valor salvo e converte de volta para o tipo original.
// Se não existir nada, retorna o "valorPadrao" informado.
async function carregar(chave, valorPadrao = null) {
  try {
    const texto = await AsyncStorage.getItem(chave);
    if (texto != null) {
      return JSON.parse(texto);
    }
    return valorPadrao;
  } catch (error) {
    console.error(`[storageService] Erro ao carregar "${chave}":`, error);
    throw error;
  }
}

// Apaga o valor de uma chave específica do armazenamento local.
async function apagar(chave) {
  try {
    await AsyncStorage.removeItem(chave);
  } catch (error) {
    console.error(`[storageService] Erro ao remover "${chave}":`, error);
    throw error;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Progresso geral do usuário
// Guarda informações como nível atual, pontos acumulados, etc.
// Exemplo de objeto esperado: { nivel: 2, pontos: 150 }
// ─────────────────────────────────────────────────────────────────────────────

// Recebe um objeto com o progresso atual e salva.
export async function salvarNovoProgresso(progresso) {
  await salvar(CHAVES.progresso, progresso);
}

// Retorna o objeto de progresso salvo.
// Se ainda não foi salvo nada, retorna null.
export async function carregarProgresso() {
  return carregar(CHAVES.progresso, null);
}

// Apaga o progresso salvo.
export async function apagarProgresso() {
  await apagar(CHAVES.progresso);
}

// ─────────────────────────────────────────────────────────────────────────────
// Objetivos concluídos hoje
// Guarda a lista de objetivos que o usuário marcou como feitos no dia.
// Exemplo de array esperado: ["andar", "nao usar ar-condicionado", "sei la"]
// ─────────────────────────────────────────────────────────────────────────────

export async function substituirObjetivos(objetivos) {
  await salvar(CHAVES.objetivos, objetivos);
}

// Retorna o array de objetivos salvos.
// Se não houver nenhum salvo ainda, retorna uma lista vazia [].
export async function carregarObjetivosAtuais() {
  return carregar(CHAVES.objetivos, []);
}

// Apaga os objetivos do dia salvos.
export async function removerObjetivosAtuais() {
  await apagar(CHAVES.objetivos);
}

// ─────────────────────────────────────────────────────────────────────────────
// Histórico do usuário
// Guarda um registro de atividades passadas para exibir no app.
// Exemplo de array esperado: [{ data: "2025-06-01", pontos: 80 }, ...]
// ─────────────────────────────────────────────────────────────────────────────

// Recebe um array com todo o histórico e salva no celular.
export async function salvarHistorico(historico) {
  await salvar(CHAVES.historico, historico);
}

// Retorna o array com o histórico completo.
// Se não houver nada salvo ainda, retorna uma lista vazia [].
export async function carregarHistorico() {
  return carregar(CHAVES.historico, []);
}

// Apaga o histórico salvo.
export async function removerHistorico() {
  await apagar(CHAVES.historico);
}

// ─────────────────────────────────────────────────────────────────────────────
// Pontuação total
// Guarda um número simples (int) representando a pontuação acumulada do usuário.
// ─────────────────────────────────────────────────────────────────────────────

// Recebe um número e salva como pontuação total.
export async function salvarPontuacao(pontuacao) {
  await salvar(CHAVES.pontuacao, pontuacao);
}

// Retorna a pontuação total salva.
// Se ainda não existir nenhuma, retorna 0.
export async function carregarPontuacao() {
  return carregar(CHAVES.pontuacao, 0);
}

// Apaga a pontuação salva.
export async function removerPontuacao() {
  await apagar(CHAVES.pontuacao);
}

// reset completo (nao pode ser desfeito, cuidado ao usar)
export async function limparDadosDoUsuario() {
  try {
    await AsyncStorage.multiRemove(Object.values(CHAVES));
  } catch (error) {
    console.error("[storageService] Erro ao limpar dados do usuário:", error);
    throw error;
  }
}

// lógica de Histórico e Impacto

export async function adicionarAcaoAoHistorico(acaoNome, pontosGanhos, idAtividade = null) {
  try {
    const historicoAtual = await carregar(CHAVES.historico, []);

    const novoRegistro = {
      id: Date.now().toString(),
      idAtividade,           // ← campo novo, necessário para conquistas por id
      acao: acaoNome,
      pontos: pontosGanhos,
      data: new Date().toISOString(),
    };

    const novoHistorico = [novoRegistro, ...historicoAtual];
    await salvar(CHAVES.historico, novoHistorico);

    const pontuacaoAntiga = await carregarPontuacao();
    await salvarPontuacao(pontuacaoAntiga + pontosGanhos);

    await atualizarStreak();

    return true;
  } catch (error) {
    console.error("Erro ao registrar ação:", error);
    return false;
  }
}

// lógica do streak
export async function atualizarStreak() {
  try {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0); // compara apenas datas, verificar com o grupo se é melhor considerar o horário

    const dadosStreak = await carregar(CHAVES.streak, {
      contagem: 0,
      ultimaData: null,
    });

    if (!dadosStreak.ultimaData) {
      // primeira vez
      const novoStreak = { contagem: 1, ultimaData: hoje.toISOString() };
      await salvar(CHAVES.streak, novoStreak);
      return novoStreak;
    }

    const ultimaData = new Date(dadosStreak.ultimaData);
    ultimaData.setHours(0, 0, 0, 0);

    const diferencaDias = (hoje - ultimaData) / (1000 * 60 * 60 * 24);

    let novaContagem = dadosStreak.contagem;

    if (diferencaDias === 1) {
      novaContagem += 1;
    } else if (diferencaDias > 1) {
      novaContagem = 1;
    }

    const novoStreak = {
      contagem: novaContagem,
      ultimaData: hoje.toISOString(),
    };
    await salvar(CHAVES.streak, novoStreak);
    return novoStreak;
  } catch (error) {
    console.error("Erro ao atualizar streak:", error);
    return { contagem: 0, ultimaData: null };
  }
}

export async function carregarStreak() {
  return carregar(CHAVES.streak, { contagem: 0, ultimaData: null });
}

// sistema de conquistas: compaa o que o usuário já fez (histórico, streak, etc) com os requisitos de cada conquista e salva quais ele já ganhou para mostrar no perfil, etc
import { conquistas } from "../data/conquistas";

export async function carregarConquistasGanhas() {
  return carregar(CHAVES.conquistas, { ganhas: [] });
}

export async function checarNovasConquistas() {
  const historico = await carregarHistorico();
  const streak = await carregarStreak();
  const conquistasJaGanhas = await carregarConquistasGanhas();

  let novasConquistasNestaSessao = [];

  // monta um Set com todos os ids de atividades já feitas (para lookup rápido)
  const idsFeitos = new Set(historico.map(item => item.idAtividade).filter(Boolean));

  // monta um contador de quantas vezes cada atividade foi feita
  const contagemPorId = {};
  historico.forEach(item => {
    if (item.idAtividade) {
      contagemPorId[item.idAtividade] = (contagemPorId[item.idAtividade] || 0) + 1;
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
      // verifica se todos os ids necessários já foram feitos pelo menos uma vez
      alcancou = c.idsNecessarios.every(id => idsFeitos.has(id));

    } else if (c.tipo === "contagem_acao") {
      // verifica se uma atividade específica foi feita X vezes
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

export async function carregarInventario() {
  return carregar(CHAVES.inventario, []);
}

export async function checarItemNoInventario(item) {
  const inventarioAtual = await carregarInventario();
  const itemParaEncontrar = inventarioAtual.find((i) => i.id === item.id);

  if (itemParaEncontrar) {
    return true;
  }
  return false;
}

// logica da compra e armazenamento dos itens da loja, o usuário pode comprar itens usando os pontos acumulados, e esses itens ficam salvos no inventário para o usuário usar no perfil, etc
export async function comprarItem(item) {
  try {
    const pontosAtuais = await carregarPontuacao();

    // verifica se tem dinheiro
    if (pontosAtuais < item.preco) {
      return { sucesso: false, erro: "Pontos insuficientes!" };
    }

    // verifica se o item ja foi comprado
    const itemJaExiste = await checarItemNoInventario(item);
    if (itemJaExiste) {
      return { sucesso: false, erro: "Você já possui este item!" };
    }

    // carrega o inventário
    const inventarioAtual = await carregarInventario();

    //adiciona o item
    const novoInventario = [...inventarioAtual, item];

    await salvarPontuacao(pontosAtuais - item.preco);
    await salvar(CHAVES.inventario, novoInventario);

    return { sucesso: true, novoSaldo: pontosAtuais - item.preco };
  } catch (error) {
    console.error("Erro ao processar compra:", error);
    return { sucesso: false, erro: "Erro ao processar compra." };
  }
}

export async function salvarItemNoInventario(item) {
  const inventarioAtual = await carregarInventario();
  const inventarioNovo = [...inventarioAtual, item];
  await salvar(CHAVES.inventario, inventarioNovo);
}

export async function removerItemDoInventario(item) {
  // checagem para ver se o item sequer está no inventário
  const itemNoInventario = await checarItemNoInventario(item);
  // se estiver continua, se não estiver para a função
  if (!itemNoInventario) {
    return { sucesso: false, erro: "Item não encontrado no inventário." };
  }

  const inventarioAtual = await carregarInventario();
  //cria um novo inventario
  const inventarioNovo = [];

  // para todo item dentro do inventario se for diferente do item a ser removido é adicionado no novo inventario
  for (let i = 0; i < inventarioAtual.length; i++) {
    if (inventarioAtual[i].id !== item.id) {
      inventarioNovo.push(inventarioAtual[i]);
    }
  }
  // substitui inventario antigo pelo novo
  await salvar(CHAVES.inventario, inventarioNovo);

  return { sucesso: true, erro: false };
}

export async function buscarItemPorId(idDoItem) {
  const inventarioAtual = await carregarInventario();
  const itemExiste = inventarioAtual.find((i) => i.id === idDoItem);
  if (itemExiste) {
    return itemExiste;
  }
  return null;
}

export async function limparInventario() {
  await salvar(CHAVES.inventario, []);
}

export async function tamanhoDoInventario() {
  const inventarioAtual = await carregarInventario();
  return inventarioAtual.length;
}

export async function checarConquista(conquista) {
  const conquistasAtuais = await carregarConquistasGanhas();

  if (conquistasAtuais.ganhas.includes(conquista.id)) {
    return true;
  }

  return false;
}

export async function limparConquistas() {
  await apagar(CHAVES.conquistas);
}

// ─── DEV TOOLS (não usar em produção) ────────────────────────────────────────

export async function resetarTudo() {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.error('[dev] Erro ao resetar tudo:', error);
    throw error;
  }
}

export async function simularViradaDia() {
  try {
    const dadosStreak = await carregar(CHAVES.streak, { contagem: 0, ultimaData: null });
    const objetivosHoje = await carregarObjetivosAtuais();

    const streakAnterior = dadosStreak.contagem;
    const teveAtividade = objetivosHoje.length > 0;

    // Calcula nova data (ontem + 1 dia a partir da ultimaData, ou amanhã a partir de hoje)
    const baseData = dadosStreak.ultimaData
      ? new Date(dadosStreak.ultimaData)
      : new Date();
    baseData.setDate(baseData.getDate() + 1);
    baseData.setHours(0, 0, 0, 0);

    // Streak: incrementa se teve atividade hoje, zera se não teve
    const streakAtual = teveAtividade ? streakAnterior + 1 : 0;

    await salvar(CHAVES.streak, {
      contagem: streakAtual,
      ultimaData: baseData.toISOString(),
    });

    // Reseta as atividades do dia
    await removerObjetivosAtuais();

    return {
      streakAnterior,
      streakAtual,
      atividadesResetadas: objetivosHoje.length,
      dataSimulada: baseData.toLocaleDateString('pt-BR'),
    };
  } catch (error) {
    console.error('[dev] Erro ao simular virada de dia:', error);
    throw error;
  }
}

export async function adicionarPontosDebug(quantidade) {
  try {
    const atual = await carregarPontuacao();
    await salvarPontuacao(atual + quantidade);
  } catch (error) {
    console.error('[dev] Erro ao adicionar pontos:', error);
    throw error;
  }
}

export async function exportarEstadoCompleto() {
  try {
    const todasChaves = await AsyncStorage.getAllKeys();
    const pares = await AsyncStorage.multiGet(todasChaves);
    const estado = {};
    for (const [chave, valor] of pares) {
      try {
        estado[chave] = JSON.parse(valor);
      } catch {
        estado[chave] = valor;
      }
    }
    return estado;
  } catch (error) {
    console.error('[dev] Erro ao exportar estado:', error);
    throw error;
  }
}