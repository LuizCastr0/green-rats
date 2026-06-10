// src/screens/DevScreen.js
// Tela de desenvolvedor — acessível apenas via easter egg (5 toques no header).
// NÃO aparece na navegação normal. Remover antes de publicar.

import React, { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Alert, ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import {
  simularViradaDia,
  resetarTudo,
  adicionarPontosDebug,
  exportarEstadoCompleto,
  carregarStreak,
  carregarPontuacao,
  carregarHistorico,
} from '../services/Armazenamento';
import { useUser } from '../context/UserContext';

export default function DevScreen({ navigation }) {
  const { atualizarDadosGlobais } = useUser();

  const [log, setLog] = useState('Aguardando ação...');
  const [carregando, setCarregando] = useState(false);
  const [estadoAtual, setEstadoAtual] = useState(null);

  // ── Carrega o estado atual sempre que a tela abre ─────────────────────────
  async function carregarEstado() {
    const streak = await carregarStreak();
    const pontos = await carregarPontuacao();
    const historico = await carregarHistorico();

    // lê as atividades concluídas hoje direto da chave para não depender
    // de importar services/atividades (evita circular)
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    let atividadesHoje = { data: null, ids: [] };
    try {
      const raw = await AsyncStorage.getItem('rat:atividadesConcluidasHoje');
      if (raw) atividadesHoje = JSON.parse(raw);
    } catch (_) {}

    setEstadoAtual({
      streak: streak.contagem,
      ultimaData: streak.ultimaData
        ? new Date(streak.ultimaData).toLocaleDateString('pt-BR')
        : 'nunca',
      pontos,
      totalAcoes: historico.length,
      atividadesHoje: atividadesHoje.ids?.length ?? 0,
      diaAtividadesHoje: atividadesHoje.data ?? 'sem registro',
    });
  }

  useFocusEffect(
    useCallback(() => {
      carregarEstado();
    }, [])
  );

  // ── Helper para executar ação e atualizar tudo ────────────────────────────
  async function executar(label, fn) {
    setCarregando(true);
    setLog(`Executando: ${label}...`);
    try {
      const resultado = await fn();
      await atualizarDadosGlobais();
      await carregarEstado();
      setLog(resultado ?? 'Concluído.');
    } catch (e) {
      setLog(`❌ Erro: ${String(e)}`);
    }
    setCarregando(false);
  }

  // ── Ações ─────────────────────────────────────────────────────────────────

  async function handleAvancarDia() {
    await executar('Avançar dia', async () => {
      const r = await simularViradaDia();
      if (!r.sucesso) return `❌ Falha: ${r.erro}`;
      return (
        `✅ Dia avançado para ${r.dataSimulada}\n` +
        `Atividades no dia anterior: ${r.teveAtividade ? 'sim' : 'não'}\n` +
        `Streak: ${r.streakAnterior} → ${r.streakAtual}`
      );
    });
  }

  async function handleAdicionarPontos(qtd) {
    await executar(`+${qtd} pontos`, async () => {
      await adicionarPontosDebug(qtd);
      return `✅ ${qtd} pontos adicionados.`;
    });
  }

  async function handleExportarEstado() {
    await executar('Exportar estado', async () => {
      const estado = await exportarEstadoCompleto();
      const txt = JSON.stringify(estado, null, 2);
      console.log('[DEV] Estado completo:\n', txt);
      return `✅ Estado exportado no console (${Object.keys(estado).length} chaves).`;
    });
  }

  function handleResetarTudo() {
    Alert.alert(
      '⚠️ Reset total',
      'Apaga TODOS os dados do app. Isso não pode ser desfeito.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Resetar',
          style: 'destructive',
          onPress: async () => {
            await executar('Reset total', async () => {
              await resetarTudo();
              // volta para o setup depois de resetar
              navigation.reset({ index: 0, routes: [{ name: 'Setup' }] });
              return '✅ Tudo apagado. Voltando para o setup.';
            });
          },
        },
      ]
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <ScrollView style={s.scroll} contentContainerStyle={s.container}>

      {/* Cabeçalho */}
      <View style={s.header}>
        <Text style={s.titulo}>🛠️ Dev Tools</Text>
        <Text style={s.subtitulo}>Não mostrar para usuários</Text>
        <TouchableOpacity style={s.voltarBtn} onPress={() => navigation.goBack()}>
          <Text style={s.voltarTexto}>← Voltar</Text>
        </TouchableOpacity>
      </View>

      {/* Estado atual */}
      {estadoAtual && (
        <View style={s.card}>
          <Text style={s.cardTitulo}>Estado atual no AsyncStorage</Text>
          <LinhaInfo label="Streak" valor={`${estadoAtual.streak} dias`} />
          <LinhaInfo label="Última data do streak" valor={estadoAtual.ultimaData} />
          <LinhaInfo label="Pontos" valor={String(estadoAtual.pontos)} />
          <LinhaInfo label="Total de ações no histórico" valor={String(estadoAtual.totalAcoes)} />
          <LinhaInfo
            label="Atividades concluídas hoje"
            valor={`${estadoAtual.atividadesHoje} (dia: ${estadoAtual.diaAtividadesHoje})`}
          />
        </View>
      )}

      {/* Ações de dia */}
      <View style={s.card}>
        <Text style={s.cardTitulo}>Simulação de tempo</Text>
        <Text style={s.cardDica}>
          Avança um dia a partir da última data registrada no streak.
          Se você tiver atividades marcadas hoje, o streak vai incrementar.
          As atividades do dia são zeradas.
        </Text>
        <BotaoDev
          label="⏭  Avançar 1 dia"
          cor="#515a47"
          onPress={handleAvancarDia}
          disabled={carregando}
        />
        <BotaoDev
          label="⏭⏭  Avançar 3 dias seguidos"
          cor="#515a47"
          onPress={async () => {
            setCarregando(true);
            setLog('Avançando 3 dias...');
            let ultimo = '';
            for (let i = 0; i < 3; i++) {
              const r = await simularViradaDia();
              ultimo = r.sucesso
                ? `Dia ${i + 1}: streak ${r.streakAnterior}→${r.streakAtual} (${r.dataSimulada})`
                : `Dia ${i + 1}: ❌ ${r.erro}`;
            }
            await atualizarDadosGlobais();
            await carregarEstado();
            setLog(`✅ 3 dias avançados.\nÚltimo: ${ultimo}`);
            setCarregando(false);
          }}
          disabled={carregando}
        />
      </View>

      {/* Pontos */}
      <View style={s.card}>
        <Text style={s.cardTitulo}>Pontos</Text>
        <View style={s.botoesRow}>
          <BotaoDev label="+50 pts" cor="#7ca982" onPress={() => handleAdicionarPontos(50)} disabled={carregando} small />
          <BotaoDev label="+200 pts" cor="#7ca982" onPress={() => handleAdicionarPontos(200)} disabled={carregando} small />
          <BotaoDev label="+1000 pts" cor="#7ca982" onPress={() => handleAdicionarPontos(1000)} disabled={carregando} small />
        </View>
      </View>

      {/* Ferramentas */}
      <View style={s.card}>
        <Text style={s.cardTitulo}>Ferramentas</Text>
        <BotaoDev
          label="📋  Exportar estado completo (console)"
          cor="#185FA5"
          onPress={handleExportarEstado}
          disabled={carregando}
        />
        <BotaoDev
          label="🔄  Atualizar estado exibido"
          cor="#515a47"
          onPress={async () => {
            await carregarEstado();
            await atualizarDadosGlobais();
            setLog('✅ Estado atualizado.');
          }}
          disabled={carregando}
        />
        <BotaoDev
          label="💣  Resetar TUDO"
          cor="#A32D2D"
          onPress={handleResetarTudo}
          disabled={carregando}
        />
      </View>

      {/* Console de saída */}
      <View style={s.console}>
        <Text style={s.consoleTitulo}>{'>'} output</Text>
        {carregando
          ? <ActivityIndicator color="#4caf50" />
          : <Text style={s.consoleTexto}>{log}</Text>
        }
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

// ── Componentes auxiliares ────────────────────────────────────────────────────

function LinhaInfo({ label, valor }) {
  return (
    <View style={s.linhaInfo}>
      <Text style={s.linhaLabel}>{label}</Text>
      <Text style={s.linhaValor}>{valor}</Text>
    </View>
  );
}

function BotaoDev({ label, cor, onPress, disabled, small }) {
  return (
    <TouchableOpacity
      style={[s.botao, { backgroundColor: cor }, small && s.botaoSmall, disabled && s.botaoDisabled]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={s.botaoTexto}>{label}</Text>
    </TouchableOpacity>
  );
}

// ── Estilos ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  scroll: { backgroundColor: '#1a1a1a' },
  container: { padding: 20 },

  header: { marginTop: 20, marginBottom: 20 },
  titulo: { color: '#4caf50', fontSize: 24, fontWeight: 'bold' },
  subtitulo: { color: '#888', fontSize: 12, marginTop: 2, marginBottom: 12 },
  voltarBtn: { alignSelf: 'flex-start' },
  voltarTexto: { color: '#4caf50', fontSize: 14 },

  card: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  cardTitulo: {
    color: '#4caf50',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
  },
  cardDica: {
    color: '#888',
    fontSize: 12,
    marginBottom: 12,
    lineHeight: 18,
  },

  linhaInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  linhaLabel: { color: '#888', fontSize: 13 },
  linhaValor: { color: '#fff', fontSize: 13, fontWeight: '600' },

  botoesRow: { flexDirection: 'row', gap: 8 },

  botao: {
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginBottom: 8,
  },
  botaoSmall: { flex: 1, padding: 10 },
  botaoDisabled: { opacity: 0.4 },
  botaoTexto: { color: '#fff', fontWeight: '600', fontSize: 13 },

  console: {
    backgroundColor: '#0d0d0d',
    borderRadius: 10,
    padding: 14,
    minHeight: 80,
    borderWidth: 1,
    borderColor: '#333',
  },
  consoleTitulo: { color: '#4caf50', fontSize: 10, fontWeight: 'bold', marginBottom: 8 },
  consoleTexto: { color: '#fff', fontSize: 13, fontFamily: 'monospace', lineHeight: 20 },
});