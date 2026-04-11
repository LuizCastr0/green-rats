// src/services/atividades.js

import AsyncStorage from "@react-native-async-storage/async-storage";
import { categorias } from "../data/categorias";
import { atividades } from "../data/atividades";

// ─────────────────────────────────────────────────────────────────────────────
// Chaves de armazenamento
// ─────────────────────────────────────────────────────────────────────────────

const C = {
  atividadesPersonalizadas: "rat:atividadesPersonalizadas",
  atividadesFavoritas: "rat:atividadesFavoritas",
  atividadesConcluidasHoje: "rat:atividadesConcluidasHoje",
};

// ─────────────────────────────────────────────────────────────────────────────
// Funções internas de apoio (não exportadas)
// ─────────────────────────────────────────────────────────────────────────────

async function salvar(chave, valor) {
  try {
    await AsyncStorage.setItem(chave, JSON.stringify(valor));
  } catch (error) {
    console.error(`[atividadesService] Erro ao salvar "${chave}":`, error);
    throw error;
  }
}

async function carregar(chave, valorPadrao = null) {
  try {
    const texto = await AsyncStorage.getItem(chave);

    if (texto != null) {
      return JSON.parse(texto);
    }

    return valorPadrao;
  } catch (error) {
    console.error(`[atividadesService] Erro ao carregar "${chave}":`, error);
    throw error;
  }
}

async function remover(chave) {
  try {
    await AsyncStorage.removeItem(chave);
  } catch (error) {
    console.error(`[atividadesService] Erro ao remover "${chave}":`, error);
    throw error;
  }
}

function getChaveDoDia() {
  const hoje = new Date();

  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, "0");
  const dia = String(hoje.getDate()).padStart(2, "0");

  return `${ano}-${mes}-${dia}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Categorias e atividades base
// Esses dados vêm dos arquivos da pasta /data
// ─────────────────────────────────────────────────────────────────────────────

// Retorna a lista de categorias cadastradas no app.
export function carregarCategorias() {
  return categorias;
}

// Retorna a lista de atividades padrão do app.
export function carregarAtividadesBase() {
  return atividades;
}

// ─────────────────────────────────────────────────────────────────────────────
// Atividades personalizadas
// São atividades criadas pelo próprio usuário
// ─────────────────────────────────────────────────────────────────────────────

// Retorna a lista de atividades personalizadas.
// Se não houver nenhuma salva ainda, retorna [].
export async function carregarAtividadesPersonalizadas() {
  return carregar(C.atividadesPersonalizadas, []);
}

// Adiciona uma nova atividade personalizada à lista já salva.
export async function adicionarAtividadePersonalizada(novaAtividade) {
  const atividadesPersonalizadas = await carregarAtividadesPersonalizadas();
  const novaLista = [...atividadesPersonalizadas, novaAtividade];

  await salvar(C.atividadesPersonalizadas, novaLista);

  return novaAtividade;
}

// Remove uma atividade personalizada pelo id.
export async function removerAtividadePersonalizada(idDaAtividade) {
  const atividadesPersonalizadas = await carregarAtividadesPersonalizadas();

  const novaLista = atividadesPersonalizadas.filter((atividade) => {
    return atividade.id !== idDaAtividade;
  });

  await salvar(C.atividadesPersonalizadas, novaLista);
}

// Apaga todas as atividades personalizadas salvas.
export async function removerAtividadesPersonalizadas() {
  await remover(C.atividadesPersonalizadas);
}

// ─────────────────────────────────────────────────────────────────────────────
// Lista completa de atividades
// Junta as atividades padrão com as personalizadas
// ─────────────────────────────────────────────────────────────────────────────

// Retorna todas as atividades do app.
export async function carregarTodasAsAtividades() {
  const atividadesPersonalizadas = await carregarAtividadesPersonalizadas();
  return [...atividades, ...atividadesPersonalizadas];
}

// Busca uma atividade pelo id.
// Se não encontrar, retorna null.
export async function buscarAtividadePorId(idDaAtividade) {
  const todasAsAtividades = await carregarTodasAsAtividades();

  const atividadeEncontrada = todasAsAtividades.find((item) => {
    return item.id === idDaAtividade;
  });

  return atividadeEncontrada || null;
}

// Retorna apenas as atividades de uma categoria específica.
export async function filtrarAtividadesPorCategoria(idDaCategoria) {
  const todasAsAtividades = await carregarTodasAsAtividades();

  return todasAsAtividades.filter((atividade) => {
    return atividade.categoria === idDaCategoria;
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Favoritas
// Guarda apenas os ids das atividades marcadas como favoritas
// ─────────────────────────────────────────────────────────────────────────────

// Retorna a lista de ids favoritos.
// Se não houver nada salvo, retorna [].
export async function carregarFavoritas() {
  return carregar(C.atividadesFavoritas, []);
}

// Marca uma atividade como favorita.
export async function favoritarAtividade(idDaAtividade) {
  const favoritas = await carregarFavoritas();

  if (favoritas.includes(idDaAtividade)) {
    return favoritas;
  }

  const novaLista = [...favoritas, idDaAtividade];
  await salvar(C.atividadesFavoritas, novaLista);

  return novaLista;
}

// Remove uma atividade da lista de favoritas.
export async function desfavoritarAtividade(idDaAtividade) {
  const favoritas = await carregarFavoritas();

  const novaLista = favoritas.filter((id) => {
    return id !== idDaAtividade;
  });

  await salvar(C.atividadesFavoritas, novaLista);

  return novaLista;
}

// Apaga toda a lista de favoritas.
export async function removerFavoritas() {
  await remover(C.atividadesFavoritas);
}

// Carrega as atividades concluídas de hoje e zera a lista automaticamente se o dia mudou.
// { data: "2026-04-11", ids: ["atividade-1", "atividade-2"] }
export async function carregarAtividadesConcluidas() {
  const hoje = getChaveDoDia();

  const statusSalvo = await carregar(C.atividadesConcluidasHoje, {
    data: hoje,
    ids: [],
  });

  if (statusSalvo.data !== hoje) {
    const novoStatus = {
      data: hoje,
      ids: [],
    };

    await salvar(C.atividadesConcluidasHoje, novoStatus);
    return novoStatus.ids;
  }

  return statusSalvo.ids;
}

export async function atividadeJaFoiConcluidaHoje(idDaAtividade) {
  const concluidasHoje = await carregarAtividadesConcluidas();
  return concluidasHoje.includes(idDaAtividade);
}

// Marca uma atividade como concluída no dia atual.
export async function marcarAtividadeComoConcluida(idDaAtividade) {
  const hoje = getChaveDoDia();

  const statusSalvo = await carregar(C.atividadesConcluidasHoje, {
    data: hoje,
    ids: [],
  });

  let statusAtual = statusSalvo;

  if (statusSalvo.data !== hoje) {
    statusAtual = {
      data: hoje,
      ids: [],
    };
  }

  if (statusAtual.ids.includes(idDaAtividade)) {
    return statusAtual.ids;
  }

  statusAtual.ids.push(idDaAtividade);

  await salvar(C.atividadesConcluidasHoje, statusAtual);

  return statusAtual.ids;
}

// Remove uma atividade da lista de concluídas do dia atual.
export async function desmarcarAtividadeConcluida(idDaAtividade) {
  const hoje = getChaveDoDia();

  const statusSalvo = await carregar(C.atividadesConcluidasHoje, {
    data: hoje,
    ids: [],
  });

  let statusAtual = statusSalvo;

  if (statusSalvo.data !== hoje) {
    statusAtual = {
      data: hoje,
      ids: [],
    };
  }

  statusAtual.ids = statusAtual.ids.filter((id) => {
    return id !== idDaAtividade;
  });

  await salvar(C.atividadesConcluidasHoje, statusAtual);

  return statusAtual.ids;
}

// ─────────────────────────────────────────────────────────────────────────────
// Limpeza geral
// Remove todos os dados relacionados às atividades
// ─────────────────────────────────────────────────────────────────────────────

// Apaga atividades personalizadas, favoritas e o controle de concluídas do dia.
export async function limparDadosDeAtividades() {
  try {
    await AsyncStorage.multiRemove([
      C.atividadesPersonalizadas,
      C.atividadesFavoritas,
      C.atividadesConcluidasHoje,
    ]);
  } catch (error) {
    console.error(
      "[atividadesService] Erro ao limpar dados de atividades:",
      error,
    );
    throw error;
  }
}
