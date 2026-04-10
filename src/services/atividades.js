import AsyncStorage from "@react-native-async-storage/async-storage";
import { categorias } from "../data/categorias";
import { atividades } from "../data/atividades";

// ─────────────────────────────────────────────────────────────────────────────
// Chaves de armazenamento
// ─────────────────────────────────────────────────────────────────────────────

const C = {
  atividadesPersonalizadas: "rat:atividadesPersonalizadas",
  favoritas: "rat:favoritas",
  concluidasHoje: "rat:concluidasHoje",
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
  return carregar(C.favoritas, []);
}

// Marca uma atividade como favorita.
export async function favoritarAtividade(idDaAtividade) {
  const favoritas = await carregarFavoritas();

  if (favoritas.includes(idDaAtividade)) {
    return favoritas;
  }

  const novaLista = [...favoritas, idDaAtividade];
  await salvar(C.favoritas, novaLista);

  return novaLista;
}

// Remove uma atividade da lista de favoritas.
export async function desfavoritarAtividade(idDaAtividade) {
  const favoritas = await carregarFavoritas();

  const novaLista = favoritas.filter((id) => {
    return id !== idDaAtividade;
  });

  await salvar(C.favoritas, novaLista);

  return novaLista;
}

// Apaga toda a lista de favoritas.
export async function removerFavoritas() {
  await remover(C.favoritas);
}

// ─────────────────────────────────────────────────────────────────────────────
// Concluídas hoje
// Guarda apenas os ids das atividades concluídas no dia
// ─────────────────────────────────────────────────────────────────────────────

// Retorna a lista de ids concluídos hoje.
// Se não houver nada salvo, retorna [].
export async function carregarConcluidasHoje() {
  return carregar(C.concluidasHoje, []);
}

// Marca uma atividade como concluída hoje.
export async function marcarAtividadeComoConcluida(idDaAtividade) {
  const concluidasHoje = await carregarConcluidasHoje();

  if (concluidasHoje.includes(idDaAtividade)) {
    return concluidasHoje;
  }

  const novaLista = [...concluidasHoje, idDaAtividade];
  await salvar(C.concluidasHoje, novaLista);

  return novaLista;
}

// Remove uma atividade da lista de concluídas hoje.
export async function desmarcarAtividadeConcluida(idDaAtividade) {
  const concluidasHoje = await carregarConcluidasHoje();

  const novaLista = concluidasHoje.filter((id) => {
    return id !== idDaAtividade;
  });

  await salvar(C.concluidasHoje, novaLista);

  return novaLista;
}

// Apaga toda a lista de concluídas hoje.
export async function removerConcluidasHoje() {
  await remover(C.concluidasHoje);
}

// ─────────────────────────────────────────────────────────────────────────────
// Limpeza geral
// Remove todos os dados relacionados às atividades
// ─────────────────────────────────────────────────────────────────────────────

// Apaga atividades personalizadas, favoritas e concluídas hoje.
export async function limparDadosDeAtividades() {
  try {
    await AsyncStorage.multiRemove([
      C.atividadesPersonalizadas,
      C.favoritas,
      C.concluidasHoje,
    ]);
  } catch (error) {
    console.error(
      "[atividadesService] Erro ao limpar dados de atividades:",
      error,
    );
    throw error;
  }
}
