// src/screens/HomeScreen.js

import React, { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { atividades } from '../data/atividades';
import { getMissaoDoDia } from '../services/missao_service';
import { registrarAtividadeCompleta } from '../services/LogicaApp';
import { carregarAtividadesConcluidas } from '../services/atividades';
import { useUser } from '../context/UserContext';

export default function HomeScreen() {
  const { atualizarDadosGlobais } = useUser();
  const [concluidasHoje, setConcluidasHoje] = useState([]);
  const [missaoDoDia] = useState(() => getMissaoDoDia());
  const [carregando, setCarregando] = useState(false);
  const [feedbackId, setFeedbackId] = useState(null);

  useFocusEffect(
    useCallback(() => {
      async function carregar() {
        const ids = await carregarAtividadesConcluidas();
        setConcluidasHoje(ids);
      }
      carregar();
    }, [])
  );

  async function handleRegistrar(atividade) {
    if (concluidasHoje.includes(atividade.id)) return;
    if (carregando) return;

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

  const totalHoje = atividades
    .filter(a => concluidasHoje.includes(a.id))
    .reduce((acc, a) => acc + a.pontos, 0);

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
          {concluidasHoje.length} de {atividades.length} atividades hoje
        </Text>
        <Text style={styles.progressoPontos}>+{totalHoje} pts</Text>
      </View>
      <View style={styles.barraFundo}>
        <View style={[
          styles.barraPreenchida,
          { width: `${atividades.length > 0 ? (concluidasHoje.length / atividades.length) * 100 : 0}%` },
        ]} />
      </View>

      {/* Lista de atividades */}
      <Text style={styles.secaoTitulo}>Atividades de hoje</Text>

      {atividades.map(atividade => {
        const feita = concluidasHoje.includes(atividade.id);
        const feedback = feedbackId === atividade.id;
        const pontosPositivo = atividade.pontos > 0;

        return (
          <TouchableOpacity
            key={atividade.id}
            style={[
              styles.cartao,
              feita && styles.cartaoFeito,
              feedback && styles.cartaoFeedback,
              !pontosPositivo && styles.cartaoNegativo,
            ]}
            onPress={() => handleRegistrar(atividade)}
            activeOpacity={feita ? 1 : 0.7}
          >
            <Text style={styles.cartaoIcone}>{atividade.icone}</Text>

            <View style={styles.cartaoInfo}>
              <Text style={[styles.cartaoTitulo, feita && styles.cartaoTituloFeito]}>
                {atividade.titulo}
              </Text>

              {/* Descrição curta */}
              <Text style={styles.cartaoDescricao} numberOfLines={2}>
                {atividade.descricao}
              </Text>

              {/* Carbono — só mostra se existir e for positivo */}
              {atividade.carbonoKg != null && atividade.carbonoKg > 0 && (
                <Text style={styles.cartaoCarbono}>
                  🌍 -{atividade.carbonoKg} kgCO₂e
                </Text>
              )}
            </View>

            <View style={styles.cartaoPontosArea}>
              {feedback ? (
                <Text style={styles.feedbackTexto}>+{atividade.pontos}!</Text>
              ) : feita ? (
                <Text style={styles.checkFeito}>✓</Text>
              ) : (
                <Text style={[
                  styles.cartaoPontos,
                  !pontosPositivo && styles.cartaoPontosNegativo,
                ]}>
                  {atividade.pontos > 0 ? '+' : ''}{atividade.pontos}
                </Text>
              )}
            </View>
          </TouchableOpacity>
        );
      })}

      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { backgroundColor: '#f1f7ed' },
  container: { padding: 20 },

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
  missaoPontos: { color: '#e0eec6', fontWeight: '700', fontSize: 13 },

  progressoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressoTexto: { fontSize: 13, color: '#666' },
  progressoPontos: { fontSize: 13, fontWeight: '700', color: '#7ca982' },
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

  secaoTitulo: {
    fontSize: 16,
    fontWeight: '700',
    color: '#515a47',
    marginBottom: 12,
  },

  cartao: {
    flexDirection: 'row',
    alignItems: 'flex-start',
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
    opacity: 0.8,
  },
  cartaoFeedback: {
    borderColor: '#c2a83e',
    backgroundColor: '#fffbe6',
  },
  // atividades negativas (pontos < 0) ganham borda avermelhada sutil
  cartaoNegativo: {
    borderColor: '#e8c4c4',
  },
  cartaoIcone: {
    fontSize: 28,
    marginRight: 14,
    marginTop: 2,
  },
  cartaoInfo: { flex: 1 },
  cartaoTitulo: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 3,
  },
  cartaoTituloFeito: {
    color: '#7ca982',
    textDecorationLine: 'line-through',
  },
  cartaoDescricao: {
    fontSize: 12,
    color: '#888',
    lineHeight: 17,
  },
  cartaoCarbono: {
    fontSize: 11,
    color: '#515a47',
    fontWeight: '600',
    marginTop: 5,
  },
  cartaoPontosArea: {
    minWidth: 44,
    alignItems: 'center',
    paddingTop: 2,
  },
  cartaoPontos: {
    fontSize: 14,
    fontWeight: '700',
    color: '#c2a83e',
  },
  cartaoPontosNegativo: {
    color: '#c05050',
  },
  checkFeito: {
    fontSize: 20,
    color: '#7ca982',
    fontWeight: 'bold',
  },
  feedbackTexto: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#c2a83e',
  },
});