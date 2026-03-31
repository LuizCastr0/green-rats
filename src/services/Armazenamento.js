import AsyncStorage from "@react-native-async-storage/async-storage";

// ─────────────────────────────────────────────────────────────────────────────
// Chaves de armazenamento
// ─────────────────────────────────────────────────────────────────────────────

const CHAVES = {
  progresso: "rat:progresso",
  objetivos: "rat:objetivos",
  historico: "rat:historico",
  pontuacao: "rat:pontuacao",
};

// ─────────────────────────────────────────────────────────────────────────────
// Funções internas de apoio (não exportadas)
// ─────────────────────────────────────────────────────────────────────────────

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
async function remover(chave) {
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
export async function salvarProgresso(progresso) {
  await salvar(CHAVES.progresso, progresso);
}

// Retorna o objeto de progresso salvo.
// Se ainda não foi salvo nada, retorna null.
export async function carregarProgresso() {
  return carregar(CHAVES.progresso, null);
}

// Apaga o progresso salvo.
export async function removerProgresso() {
  await remover(CHAVES.progresso);
}

// ─────────────────────────────────────────────────────────────────────────────
// Objetivos concluídos hoje
// Guarda a lista de objetivos que o usuário marcou como feitos no dia.
// Exemplo de array esperado: ["andar", "nao usar ar-condicionado", "sei la"]
// ─────────────────────────────────────────────────────────────────────────────

// Recebe um array com os objetivos do dia e salva.
export async function salvarObjetivosAtuais(objetivos) {
  await salvar(CHAVES.objetivos, objetivos);
}

// Retorna o array de objetivos salvos.
// Se não houver nenhum salvo ainda, retorna uma lista vazia [].
export async function carregarObjetivosAtuais() {
  return carregar(CHAVES.objetivos, []);
}

// Apaga os objetivos do dia salvos.
export async function removerObjetivosAtuais() {
  await remover(CHAVES.objetivos);
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
  await remover(CHAVES.historico);
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
  await remover(CHAVES.pontuacao);
}

// ─────────────────────────────────────────────────────────────────────────────
// Reset completo
// Apaga TODOS os dados do usuário de uma vez.
// ─────────────────────────────────────────────────────────────────────────────

// Apaga todos os dados salvos pelo app de uma só vez.
export async function limparDadosDoUsuario() {
  try {
    await AsyncStorage.multiRemove(Object.values(CHAVES));
  } catch (error) {
    console.error("[storageService] Erro ao limpar dados do usuário:", error);
    throw error;
  }
}
