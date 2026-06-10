// src/services/atividades.js

import AsyncStorage from "@react-native-async-storage/async-storage";
import { categorias } from "../data/categorias";
import { atividades } from "../data/atividades";
import { getHoje, getChaveDoDia } from "./Armazenamento";

const C = {
  atividadesPersonalizadas: "rat:atividadesPersonalizadas",
  atividadesFavoritas: "rat:atividadesFavoritas",
  atividadesConcluidasHoje: "rat:atividadesConcluidasHoje",
};

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
    if (texto != null) return JSON.parse(texto);
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

// ─────────────────────────────────────────────────────────────────────────────
// Categorias e atividades base
// ─────────────────────────────────────────────────────────────────────────────

export function carregarCategorias() {
  return categorias;
}

export function carregarAtividadesBase() {
  return atividades;
}

// ─────────────────────────────────────────────────────────────────────────────
// Atividades personalizadas
// ─────────────────────────────────────────────────────────────────────────────

export async function carregarAtividadesPersonalizadas() {
  return carregar(C.atividadesPersonalizadas, []);
}

export async function adicionarAtividadePersonalizada(novaAtividade) {
  const lista = await carregarAtividadesPersonalizadas();
  const novaLista = [...lista, novaAtividade];
  await salvar(C.atividadesPersonalizadas, novaLista);
  return novaAtividade;
}

export async function removerAtividadePersonalizada(idDaAtividade) {
  const lista = await carregarAtividadesPersonalizadas();
  await salvar(
    C.atividadesPersonalizadas,
    lista.filter((a) => a.id !== idDaAtividade)
  );
}

export async function removerAtividadesPersonalizadas() {
  await remover(C.atividadesPersonalizadas);
}

// ─────────────────────────────────────────────────────────────────────────────
// Lista completa
// ─────────────────────────────────────────────────────────────────────────────

export async function carregarTodasAsAtividades() {
  const personalizadas = await carregarAtividadesPersonalizadas();
  return [...atividades, ...personalizadas];
}

export async function buscarAtividadePorId(idDaAtividade) {
  const todas = await carregarTodasAsAtividades();
  return todas.find((a) => a.id === idDaAtividade) || null;
}

export async function filtrarAtividadesPorCategoria(idDaCategoria) {
  const todas = await carregarTodasAsAtividades();
  return todas.filter((a) => a.categoria === idDaCategoria);
}

// ─────────────────────────────────────────────────────────────────────────────
// Favoritas
// ─────────────────────────────────────────────────────────────────────────────

export async function carregarFavoritas() {
  return carregar(C.atividadesFavoritas, []);
}

export async function favoritarAtividade(idDaAtividade) {
  const favoritas = await carregarFavoritas();
  if (favoritas.includes(idDaAtividade)) return favoritas;
  const novaLista = [...favoritas, idDaAtividade];
  await salvar(C.atividadesFavoritas, novaLista);
  return novaLista;
}

export async function desfavoritarAtividade(idDaAtividade) {
  const favoritas = await carregarFavoritas();
  const novaLista = favoritas.filter((id) => id !== idDaAtividade);
  await salvar(C.atividadesFavoritas, novaLista);
  return novaLista;
}

export async function removerFavoritas() {
  await remover(C.atividadesFavoritas);
}

// ─────────────────────────────────────────────────────────────────────────────
// Atividades concluídas hoje
// Usa getHoje() para respeitar a data simulada nos testes de avanço de dia.
// O objeto salvo tem formato: { data: "2026-06-09", ids: ["id1", "id2"] }
// Quando a data salva é diferente da data atual (ou simulada),
// a lista é zerada automaticamente — é aqui que o reset do dia acontece.
// ─────────────────────────────────────────────────────────────────────────────

export async function carregarAtividadesConcluidas() {
  const hoje = await getHoje();
  const chaveHoje = getChaveDoDia(hoje);

  const statusSalvo = await carregar(C.atividadesConcluidasHoje, {
    data: chaveHoje,
    ids: [],
  });

  // se a data salva é diferente da data atual (ou simulada), zera
  if (statusSalvo.data !== chaveHoje) {
    const novoStatus = { data: chaveHoje, ids: [] };
    await salvar(C.atividadesConcluidasHoje, novoStatus);
    return [];
  }

  return statusSalvo.ids;
}

export async function checarAtividadeJaFoiConcluidaHoje(idDaAtividade) {
  const concluidasHoje = await carregarAtividadesConcluidas();
  return concluidasHoje.includes(idDaAtividade);
}

export async function marcarAtividadeComoConcluida(idDaAtividade) {
  const hoje = await getHoje();
  const chaveHoje = getChaveDoDia(hoje);

  const statusSalvo = await carregar(C.atividadesConcluidasHoje, {
    data: chaveHoje,
    ids: [],
  });

  // reseta se a data mudou
  const statusAtual =
    statusSalvo.data !== chaveHoje
      ? { data: chaveHoje, ids: [] }
      : statusSalvo;

  if (statusAtual.ids.includes(idDaAtividade)) {
    return statusAtual.ids;
  }

  statusAtual.ids.push(idDaAtividade);
  await salvar(C.atividadesConcluidasHoje, statusAtual);
  return statusAtual.ids;
}

export async function desmarcarAtividadeConcluida(idDaAtividade) {
  const hoje = await getHoje();
  const chaveHoje = getChaveDoDia(hoje);

  const statusSalvo = await carregar(C.atividadesConcluidasHoje, {
    data: chaveHoje,
    ids: [],
  });

  const statusAtual =
    statusSalvo.data !== chaveHoje
      ? { data: chaveHoje, ids: [] }
      : statusSalvo;

  statusAtual.ids = statusAtual.ids.filter((id) => id !== idDaAtividade);
  await salvar(C.atividadesConcluidasHoje, statusAtual);
  return statusAtual.ids;
}

// ─────────────────────────────────────────────────────────────────────────────
// Limpeza geral
// ─────────────────────────────────────────────────────────────────────────────

export async function limparDadosDeAtividades() {
  try {
    await AsyncStorage.multiRemove([
      C.atividadesPersonalizadas,
      C.atividadesFavoritas,
      C.atividadesConcluidasHoje,
    ]);
  } catch (error) {
    console.error("[atividadesService] Erro ao limpar dados de atividades:", error);
    throw error;
  }
}