// src/screens/HomeScreen.js

import React, { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { verificarViradaDeDia } from '../services/Armazenamento';
import { atividades } from '../data/atividades';
import { getMissaoDoDia } from '../services/missao_service';
import { registrarAtividadeCompleta } from '../services/LogicaApp';
import { carregarAtividadesConcluidas } from '../services/atividades';
import { useUser } from '../context/UserContext';

const atividadesPositivas = atividades.filter(a => a.pontos >= 0);
const atividadesNegativas = atividades.filter(a => a.pontos < 0);

export default function HomeScreen() {
  const { atualizarDadosGlobais } = useUser();
  const [concluidasHoje, setConcluidasHoje] = useState([]);
  const [missaoDoDia] = useState(() => getMissaoDoDia());
  const [carregando, setCarregando] = useState(false);
  const [feedbackId, setFeedbackId] = useState(null);

  // Roda toda vez que a tela recebe foco (ao navegar de volta, ao abrir o app).
  // É aqui que a virada de dia real é detectada.
  useFocusEffect(
    useCallback(() => {
      async function checarECarregar() {
        await verificarViradaDeDia();
        const ids = await carregarAtividadesConcluidas();
        setConcluidasHoje(ids || []);
        await atualizarDadosGlobais();
      }
      checarECarregar();
    }, [atualizarDadosGlobais])
  );

  async function handleRegistrar(atividade) {
    if (concluidasHoje.includes(atividade.id) || carregando) return;

    setCarregando(true);
    const resultado = await registrarAtividadeCompleta(atividade);

    if (resultado.sucesso) {
      setFeedbackId(atividade.id);
      setConcluidasHoje(prev => [...prev, atividade.id]);
      await atualizarDadosGlobais();
      setTimeout(() => setFeedbackId(null), 1500);
    }
    setCarregando(false);
  }

  // Totais do dia — só atividades positivas contam para a barra de progresso
  const totalHoje = atividades
    .filter(a => concluidasHoje.includes(a.id))
    .reduce((acc, a) => acc + a.pontos, 0);

  const totalCarbono = atividades
    .filter(a => concluidasHoje.includes(a.id) && a.carbonoKg && a.carbonoKg > 0)
    .reduce((acc, a) => acc + a.carbonoKg, 0);

  const positivasFeitas = concluidasHoje.filter(id =>
    atividadesPositivas.some(a => a.id === id)
  ).length;

  const porcentagemProgresso = atividadesPositivas.length > 0
    ? (positivasFeitas / atividadesPositivas.length) * 100
    : 0;

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={carregando} colors={['#515a47']} />
      }
    >

      {/* Missão do dia */}
      <View style={styles.missaoCard}>
        <Text style={styles.missaoLabel}>🎯 Missão do dia</Text>
        <Text style={styles.missaoTitulo}>{missaoDoDia.titulo}</Text>
        <Text style={styles.missaoDescricao}>{missaoDoDia.descricao}</Text>
        <View style={styles.missaoPontosRow}>
          <Text style={styles.missaoPontos}>+{missaoDoDia.pontos} pts se completar</Text>
        </View>
      </View>

      {/* Progresso do dia */}
      <View style={styles.progressoRow}>
        <Text style={styles.progressoTexto}>
          {positivasFeitas} de {atividadesPositivas.length} atividades hoje
        </Text>
        <View style={styles.progressoDireita}>
          <Text style={styles.progressoPontos}>
            {totalHoje >= 0 ? '+' : ''}{totalHoje} pts
          </Text>
          {totalCarbono > 0 && (
            <Text style={styles.progressoCarbono}>
              -{totalCarbono.toFixed(2)} kgCO₂e
            </Text>
          )}
        </View>
      </View>
      <View style={styles.barraFundo}>
        <View style={[styles.barraPreenchida, { width: `${porcentagemProgresso}%` }]} />
      </View>

      {/* Atividades positivas */}
      <Text style={styles.secaoTitulo}>Atividades de hoje</Text>

      {atividadesPositivas.map(atividade => {
        const feita = concluidasHoje.includes(atividade.id);
        const feedback = feedbackId === atividade.id;

        return (
          <TouchableOpacity
            key={atividade.id}
            style={[
              styles.cartao,
              feita && styles.cartaoFeito,
              feedback && styles.cartaoFeedback,
            ]}
            onPress={() => handleRegistrar(atividade)}
            activeOpacity={feita ? 1 : 0.7}
          >
            <Text style={styles.cartaoIcone}>{atividade.icone}</Text>
            <View style={styles.cartaoInfo}>
              <Text style={[styles.cartaoTitulo, feita && styles.cartaoTituloFeito]}>
                {atividade.titulo}
              </Text>
              {atividade.carbonoKg && atividade.carbonoKg > 0 && (
                <Text style={styles.cartaoCarbono}>
                  -{atividade.carbonoKg} kgCO₂e
                </Text>
              )}
            </View>
            <View style={styles.cartaoPontosArea}>
              {feedback ? (
                <Text style={styles.feedbackTexto}>+{atividade.pontos}!</Text>
              ) : feita ? (
                <Text style={styles.checkFeito}>✓</Text>
              ) : (
                <Text style={styles.cartaoPontos}>+{atividade.pontos}</Text>
              )}
            </View>
          </TouchableOpacity>
        );
      })}

      {/* Atividades negativas */}
      <Text style={[styles.secaoTitulo, styles.secaoNegativaTitulo]}>
        Seja honesto — registre também o que não foi legal
      </Text>
      <Text style={styles.secaoSubtitulo}>
        Registrar ações negativas ajuda você a entender sua pegada real.
      </Text>

      {atividadesNegativas.map(atividade => {
        const feita = concluidasHoje.includes(atividade.id);
        const feedback = feedbackId === atividade.id;

        return (
          <TouchableOpacity
            key={atividade.id}
            style={[
              styles.cartao,
              styles.cartaoNegativo,
              feita && styles.cartaoNegativoFeito,
            ]}
            onPress={() => handleRegistrar(atividade)}
            activeOpacity={feita ? 1 : 0.7}
          >
            <Text style={styles.cartaoIcone}>{atividade.icone}</Text>
            <View style={styles.cartaoInfo}>
              <Text style={[styles.cartaoTitulo, feita && styles.cartaoTituloFeito]}>
                {atividade.titulo}
              </Text>
              {atividade.carbonoKg && atividade.carbonoKg < 0 && (
                <Text style={[styles.cartaoCarbono, styles.cartaoCarbonNegativo]}>
                  +{Math.abs(atividade.carbonoKg)} kgCO₂e emitidos
                </Text>
              )}
            </View>
            <View style={styles.cartaoPontosArea}>
              {feedback ? (
                <Text style={styles.feedbackNegativoTexto}>{atividade.pontos}!</Text>
              ) : feita ? (
                <Text style={styles.checkFeito}>✓</Text>
              ) : (
                <Text style={styles.cartaoPontosNegativo}>{atividade.pontos}</Text>
              )}
            </View>
          </TouchableOpacity>
        );
      })}

      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { backgroundColor: '#f1f7ed' },
  container: { padding: 20 },

  // Missão
  missaoCard: {
    backgroundColor: '#515a47',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  missaoLabel: {
    color: '#e0eec6',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  missaoTitulo: {
    color: '#f1f7ed',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  missaoDescricao: {
    color: '#c5d4b5',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  missaoPontosRow: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: 'flex-start',
  },
  missaoPontos: {
    color: '#e0eec6',
    fontWeight: '700',
    fontSize: 13,
  },

  // Progresso
  progressoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  progressoTexto: { fontSize: 13, color: '#666' },
  progressoDireita: { alignItems: 'flex-end' },
  progressoPontos: { fontSize: 13, fontWeight: '700', color: '#7ca982' },
  progressoCarbono: { fontSize: 11, color: '#515a47', marginTop: 2 },
  barraFundo: {
    height: 8,
    backgroundColor: '#e0eec6',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 24,
  },
  barraPreenchida: {
    height: '100%',
    backgroundColor: '#7ca982',
    borderRadius: 4,
  },

  // Seções
  secaoTitulo: {
    fontSize: 16,
    fontWeight: '700',
    color: '#515a47',
    marginBottom: 12,
  },
  secaoNegativaTitulo: {
    color: '#a05050',
    marginTop: 8,
    marginBottom: 4,
  },
  secaoSubtitulo: {
    fontSize: 12,
    color: '#888',
    marginBottom: 12,
  },

  // Cartão base
  cartao: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#e0eec6',
  },
  cartaoFeito: {
    backgroundColor: '#f1f7ed',
    borderColor: '#7ca982',
    opacity: 0.85,
  },
  cartaoFeedback: {
    borderColor: '#c2a83e',
    backgroundColor: '#fffbe6',
  },
  cartaoNegativo: {
    borderColor: '#f5c6c6',
    backgroundColor: '#fff8f8',
  },
  cartaoNegativoFeito: {
    borderColor: '#d08080',
    opacity: 0.85,
  },

  // Conteúdo do cartão
  cartaoIcone: { fontSize: 28, marginRight: 14 },
  cartaoInfo: { flex: 1 },
  cartaoTitulo: { fontSize: 15, fontWeight: '600', color: '#333' },
  cartaoTituloFeito: {
    color: '#7ca982',
    textDecorationLine: 'line-through',
  },
  cartaoCarbono: {
    fontSize: 11,
    color: '#7ca982',
    marginTop: 3,
  },
  cartaoCarbonNegativo: {
    color: '#c05050',
  },

  // Área de pontos
  cartaoPontosArea: { minWidth: 44, alignItems: 'center' },
  cartaoPontos: { fontSize: 14, fontWeight: '700', color: '#c2a83e' },
  cartaoPontosNegativo: { fontSize: 14, fontWeight: '700', color: '#c05050' },
  checkFeito: { fontSize: 20, color: '#7ca982', fontWeight: 'bold' },
  feedbackTexto: { fontSize: 16, fontWeight: 'bold', color: '#c2a83e' },
  feedbackNegativoTexto: { fontSize: 16, fontWeight: 'bold', color: '#c05050' },
});