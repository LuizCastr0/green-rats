// src/screens/ConquistasScreen.js

import React, { useState, useCallback, useRef } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  TouchableOpacity, ActivityIndicator, Alert, Platform,
  Linking // 🌐 Importado para abrir links externos
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import { useUser } from '../context/UserContext';
import StoryCard from '../components/StoryCard';
import { conquistas } from '../data/conquistas';
import {
  carregarConquistasGanhas,
  carregarHistorico,
  carregarPontuacao,
  carregarStreak,
} from '../services/Armazenamento';

// ✅ Export correto de atividades
import { atividades } from '../data/atividades';

// mapa id -> carbonoKg para lookup rápido
const carbonoPorId = {};
atividades.forEach((a) => {
  if (a.carbonoKg != null && a.carbonoKg > 0) {
    carbonoPorId[a.id] = a.carbonoKg;
  }
});

export default function ConquistasScreen() {
  const [conquistasGanhas, setConquistasGanhas] = useState([]);
  const [historico, setHistorico] = useState([]);
  const [pontos, setPontos] = useState(0);
  const [streak, setStreak] = useState(0);
  const [totalCarbono, setTotalCarbono] = useState(0);

  const { nome, nivel } = useUser();
  const cardRef = useRef(null);
  const [compartilhando, setCompartilhando] = useState(false);

  const LINK_GOOGLE_FORMS = "https://forms.gle/bYsZA8CnHcWP6Fdb7";

  const handleOpenForms = async () => {
    try {
      const suportado = await Linking.canOpenURL(LINK_GOOGLE_FORMS);
      if (suportado) {
        await Linking.openURL(LINK_GOOGLE_FORMS);
      } else {
        Alert.alert("Ops!", "Não foi possível abrir o link do formulário.");
      }
    } catch (error) {
      console.error("Erro ao abrir formulário:", error);
    }
  };

  const handleCompartilhar = async () => {
    if (Platform.OS === 'web') {
      alert('📸 O compartilhamento de Stories só funciona rodando no celular!');
      return;
    }
    setCompartilhando(true);
    try {
      const uri = await captureRef(cardRef.current, {
        format: 'png',
        quality: 1,
        result: 'tmpfile',
      });
      await Sharing.shareAsync(uri, {
        mimeType: 'image/png',
        dialogTitle: 'Compartilhar no Instagram',
      });
    } catch (e) {
      console.error(e);
      Alert.alert('Ops', 'Não foi possível gerar a imagem. Tente novamente.');
    } finally {
      setCompartilhando(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      async function carregar() {
        const cg = await carregarConquistasGanhas();
        const h = await carregarHistorico();
        const p = await carregarPontuacao();
        const s = await carregarStreak();

        const carbono = h.reduce((acc, item) => {
          if (item.idAtividade && carbonoPorId[item.idAtividade]) {
            return acc + carbonoPorId[item.idAtividade];
          }
          return acc;
        }, 0);

        setConquistasGanhas(cg?.ganhas || []);
        setHistorico(h || []);
        setPontos(p || 0);
        setStreak(s?.contagem || 0);
        setTotalCarbono(carbono);
      }
      carregar();
    }, [])
  );

  const acoesPorNome = historico.reduce((acc, item) => {
    if (item && item.acao) {
      acc[item.acao] = (acc[item.acao] || 0) + 1;
    }
    return acc;
  }, {});

  const topAcoes = Object.entries(acoesPorNome)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>

      {/* Mini relatório */}
      <View style={styles.relatorioCard}>
        <Text style={styles.relatorioTitulo}>📊 Seu resumo</Text>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumero}>{historico.length}</Text>
            <Text style={styles.statLabel}>ações</Text>
          </View>
          <View style={styles.separador} />
          <View style={styles.statItem}>
            <Text style={styles.statNumero}>{pontos}</Text>
            <Text style={styles.statLabel}>pontos</Text>
          </View>
          <View style={styles.separador} />
          <View style={styles.statItem}>
            <Text style={styles.statNumero}>{streak}</Text>
            <Text style={styles.statLabel}>dias streak</Text>
          </View>
        </View>

        {totalCarbono > 0 && (
          <View style={styles.carbonoCard}>
            <Text style={styles.carbonoNumero}>{totalCarbono.toFixed(2)}</Text>
            <Text style={styles.carbonoUnidade}>kgCO₂e economizados</Text>
            <Text style={styles.carbonoComparacao}>
              {totalCarbono >= 1
                ? `equivale a ${(totalCarbono / 0.187).toFixed(0)} km não percorridos de carro`
                : `equivale a ${(totalCarbono * 1000).toFixed(0)} g de CO₂ evitados`}
            </Text>
          </View>
        )}

        {topAcoes.length > 0 && (
          <View style={styles.topAcoes}>
            <Text style={styles.topTitulo}>Suas ações mais frequentes:</Text>
            {topAcoes.map(([acao, qtd], i) => (
              <View key={acao} style={styles.topItem}>
                <Text style={styles.topPos}>{i + 1}°</Text>
                <Text style={styles.topAcao} numberOfLines={1}>{acao}</Text>
                <Text style={styles.topQtd}>{qtd}x</Text>
              </View>
            ))}
          </View>
        )}

        {historico.length === 0 && (
          <Text style={styles.semDados}>
            Registre suas primeiras ações na aba Hoje 🌿
          </Text>
        )}
      </View>

      {/* ✨ Card Interativo do Google Forms */}
      <TouchableOpacity 
        style={styles.formsCard} 
        onPress={handleOpenForms}
        activeOpacity={0.85}
      >
        <View style={styles.formsIconeContainer}>
          <Text style={styles.formsIcone}>📝</Text>
        </View>
        <View style={styles.formsInfo}>
          <Text style={styles.formsTitulo}>Pesquisa Green Rats</Text>
          <Text style={styles.formsDescricao}>Ajude a melhorar nossa jornada sustentável respondendo ao formulário!</Text>
        </View>
        <Text style={styles.formsSeta}>➔</Text>
      </TouchableOpacity>

      {/* Conquistas */}
      <Text style={styles.secaoTitulo}>
        Conquistas — {conquistasGanhas.length}/{conquistas.length}
      </Text>

      {conquistas.map((conquista) => {
        const ganhou = conquistasGanhas.includes(conquista.id);
        return (
          <View
            key={conquista.id}
            style={[styles.conquistaCard, !ganhou && styles.conquistaBloqueada]}
          >
            <Text style={[styles.conquistaIcone, !ganhou && { opacity: 0.3 }]}>
              {conquista.icone}
            </Text>
            <View style={styles.conquistaInfo}>
              <Text style={[styles.conquistaTitulo, !ganhou && styles.conquistaTextoBloqueado]}>
                {conquista.titulo}
              </Text>
              <Text style={[styles.conquistaDescricao, !ganhou && styles.conquistaTextoBloqueado]}>
                {conquista.descricao}
              </Text>
              {!ganhou && (
                <Text style={styles.progressoConquistaTexto}>
                  Meta:{' '}
                  {conquista.tipo === 'max_streak'
                    ? `${conquista.objetivo} dias de streak`
                    : conquista.tipo === 'contagem_acao'
                    ? `completar ${conquista.objetivo}x`
                    : conquista.tipo === 'acoes_ids'
                    ? `completar ${conquista.idsNecessarios?.length} atividades específicas`
                    : `${conquista.objetivo} ações`}
                </Text>
              )}
            </View>
            {ganhou && (
              <View style={styles.conquistaBadge}>
                <Text style={styles.conquistaBadgeTexto}>✓</Text>
              </View>
            )}
          </View>
        );
      })}

      {/* Histórico recente */}
      {historico.length > 0 && (
        <>
          <Text style={styles.secaoTitulo}>Histórico recente</Text>
          {historico.slice(0, 10).map((item) => {
            const carbono = item.idAtividade ? carbonoPorId[item.idAtividade] : null;
            return (
              <View key={item.id} style={styles.historicoItem}>
                <View style={styles.historicoInfo}>
                  <Text style={styles.historicoAcao}>{item.acao}</Text>
                  <View style={styles.historicoMetaRow}>
                    <Text style={styles.historicoData}>
                      {new Date(item.data).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'short',
                      })}
                    </Text>
                    {carbono && carbono > 0 && (
                      <Text style={styles.historicoCarbono}>
                        · -{carbono} kgCO₂e
                      </Text>
                    )}
                  </View>
                </View>
                <Text style={[
                  styles.historicoPontos,
                  item.pontos < 0 && styles.historicoPontosNegativo,
                ]}>
                  {item.pontos > 0 ? '+' : ''}{item.pontos} pts
                </Text>
              </View>
            );
          })}
        </>
      )}

      {/* Botão de story */}
      <TouchableOpacity
        style={stylesExtra.botaoStory}
        onPress={handleCompartilhar}
        disabled={compartilhando}
        activeOpacity={0.8}
      >
        {compartilhando
          ? <ActivityIndicator color="#fff" size="small" />
          : <Text style={stylesExtra.botaoStoryTexto}>📸 Gerar story para o Instagram</Text>
        }
      </TouchableOpacity>

      {/* Card invisível para captura */}
      <View ref={cardRef} style={stylesExtra.cardOculto} collapsable={false}>
        <StoryCard
          nome={nome}
          pontos={pontos}
          streak={streak}
          nivel={nivel}
          topAcoes={topAcoes}
          totalConquistas={conquistasGanhas.length}
        />
      </View>

      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { backgroundColor: '#f1f7ed' },
  container: { padding: 20 },

  formsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1.5,
    borderColor: '#7ca982',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  formsIconeContainer: {
    backgroundColor: 'rgba(124, 169, 130, 0.15)',
    borderRadius: 10,
    padding: 10,
    marginRight: 14,
  },
  formsIcone: { fontSize: 22 },
  formsInfo: { flex: 1 },
  formsTitulo: { fontSize: 15, fontWeight: '700', color: '#333' },
  formsDescricao: { fontSize: 12, color: '#666', marginTop: 2, lineHeight: 16 },
  formsSeta: { fontSize: 16, color: '#7ca982', fontWeight: 'bold', marginLeft: 8 },

  relatorioCard: {
    backgroundColor: '#515a47',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  relatorioTitulo: {
    color: '#e0eec6',
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 16,
  },
  statItem: { alignItems: 'center' },
  statNumero: { color: '#f1f7ed', fontSize: 28, fontWeight: 'bold' },
  statLabel: { color: '#a8c09a', fontSize: 12, marginTop: 2 },
  separador: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },

  carbonoCard: {
    backgroundColor: 'rgba(194, 168, 62, 0.2)',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#c2a83e',
  },
  carbonoNumero: { color: '#c2a83e', fontSize: 34, fontWeight: 'bold' },
  carbonoUnidade: { color: '#e0eec6', fontSize: 13, marginTop: 2 },
  carbonoComparacao: {
    color: '#a8c09a',
    fontSize: 11,
    marginTop: 6,
    textAlign: 'center',
  },

  topAcoes: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.15)',
    paddingTop: 14,
  },
  topTitulo: { color: '#c5d4b5', fontSize: 12, marginBottom: 8 },
  topItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  topPos: { color: '#c2a83e', fontWeight: 'bold', width: 24, fontSize: 13 },
  topAcao: { flex: 1, color: '#f1f7ed', fontSize: 13 },
  topQtd: { color: '#7ca982', fontWeight: '700', fontSize: 13 },
  semDados: { color: '#a8c09a', textAlign: 'center', fontSize: 14, marginTop: 8 },

  secaoTitulo: {
    fontSize: 16,
    fontWeight: '700',
    color: '#515a47',
    marginBottom: 12,
  },

  conquistaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#c2a83e',
  },
  conquistaBloqueada: { borderColor: '#e0eec6', backgroundColor: '#f8faf5' },
  conquistaIcone: { fontSize: 32, marginRight: 14 },
  conquistaInfo: { flex: 1 },
  conquistaTitulo: { fontSize: 15, fontWeight: '700', color: '#515a47' },
  conquistaTextoBloqueado: { color: '#bbb' },
  conquistaDescricao: { fontSize: 12, color: '#666', marginTop: 3 },
  progressoConquistaTexto: { fontSize: 11, color: '#aaa', marginTop: 4 },
  conquistaBadge: {
    backgroundColor: '#c2a83e',
    borderRadius: 12,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  conquistaBadgeTexto: { color: '#fff', fontWeight: 'bold', fontSize: 14 },

  historicoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#7ca982',
  },
  historicoInfo: { flex: 1 },
  historicoAcao: { fontSize: 14, fontWeight: '600', color: '#333' },
  historicoMetaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  historicoData: { fontSize: 12, color: '#999' },
  historicoCarbono: { fontSize: 11, color: '#515a47', marginLeft: 4 },
  historicoPontos: { fontSize: 14, fontWeight: '700', color: '#7ca982' },
  historicoPontosNegativo: { color: '#c05050' },
});

const stylesExtra = StyleSheet.create({
  botaoStory: {
    backgroundColor: '#515a47',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  botaoStoryTexto: { color: '#f1f7ed', fontWeight: '700', fontSize: 15 },
  cardOculto: {
    position: 'absolute',
    left: -9999,
    top: 0,
    opacity: 0,
  },
});
