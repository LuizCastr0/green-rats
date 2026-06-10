// src/components/StoryCard.js
// Card visual capturável para compartilhar como story.
// Não aparece na tela — fica com opacity 0 e posição absoluta,
// só existe para ser fotografado pelo expo-view-shot.

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function StoryCard({ nome, pontos, streak, nivel, topAcoes, totalConquistas }) {
  return (
    <View style={s.card}>
      {/* Fundo decorativo — círculos */}
      <View style={s.circuloGrande} />
      <View style={s.circuloPequeno} />

      {/* Logo / título */}
      <View style={s.topo}>
        <Text style={s.logo}>🌿 GreenRats</Text>
        <Text style={s.tagline}>meu impacto ecológico</Text>
      </View>

      {/* Nome */}
      <Text style={s.nome}>{nome || 'Eco Rato'}</Text>

      {/* Stats principais */}
      <View style={s.statsRow}>
        <View style={s.statBox}>
          <Text style={s.statNumero}>{pontos}</Text>
          <Text style={s.statLabel}>pontos</Text>
        </View>
        <View style={s.statDivisor} />
        <View style={s.statBox}>
          <Text style={s.statNumero}>{streak}</Text>
          <Text style={s.statLabel}>dias streak</Text>
        </View>
        <View style={s.statDivisor} />
        <View style={s.statBox}>
          <Text style={s.statNumero}>{totalConquistas}</Text>
          <Text style={s.statLabel}>conquistas</Text>
        </View>
      </View>

      {/* Nível */}
      <View style={s.nivelRow}>
        <Text style={s.nivelTexto}>{nivel?.icone} {nivel?.titulo ?? `Nível ${nivel?.nivel}`}</Text>
      </View>

      {/* Top ações */}
      {topAcoes?.length > 0 && (
        <View style={s.acoesBox}>
          <Text style={s.acoesLabel}>minhas ações favoritas</Text>
          {topAcoes.map(([acao, qtd], i) => (
            <View key={acao} style={s.acaoRow}>
              <Text style={s.acaoPos}>{['🥇','🥈','🥉'][i]}</Text>
              <Text style={s.acaoNome} numberOfLines={1}>{acao}</Text>
              <Text style={s.acaoQtd}>{qtd}x</Text>
            </View>
          ))}
        </View>
      )}

      {/* Rodapé */}
      <Text style={s.rodape}>faça o seu também 🌍</Text>
    </View>
  );
}

const VERDE_ESCURO = '#515a47';
const VERDE_MEDIO  = '#7ca982';
const VERDE_CLARO  = '#e0eec6';
const DOURADO      = '#c2a83e';
const FUNDO        = '#f1f7ed';

const s = StyleSheet.create({
  card: {
    width: 320,
    minHeight: 480,
    backgroundColor: VERDE_ESCURO,
    borderRadius: 24,
    padding: 28,
    overflow: 'hidden',
  },

  // Decoração de fundo
  circuloGrande: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(124,169,130,0.15)',
    top: -80,
    right: -80,
  },
  circuloPequeno: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(194,168,62,0.1)',
    bottom: -40,
    left: -40,
  },

  // Topo
  topo: {
    marginBottom: 20,
  },
  logo: {
    color: VERDE_CLARO,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  tagline: {
    color: VERDE_MEDIO,
    fontSize: 11,
    marginTop: 2,
  },

  // Nome
  nome: {
    color: '#ffffff',
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 20,
    letterSpacing: -0.5,
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 8,
    marginBottom: 14,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statNumero: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '800',
  },
  statLabel: {
    color: VERDE_MEDIO,
    fontSize: 11,
    marginTop: 2,
  },
  statDivisor: {
    width: 1,
    height: 36,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },

  // Nível
  nivelRow: {
    backgroundColor: DOURADO,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  nivelTexto: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },

  // Top ações
  acoesBox: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 14,
    padding: 14,
    marginBottom: 20,
  },
  acoesLabel: {
    color: VERDE_MEDIO,
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
  },
  acaoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  acaoPos: {
    fontSize: 14,
    marginRight: 8,
  },
  acaoNome: {
    flex: 1,
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '500',
  },
  acaoQtd: {
    color: DOURADO,
    fontWeight: '700',
    fontSize: 13,
  },

  // Rodapé
  rodape: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 4,
  },
});