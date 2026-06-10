// src/components/PontosHeader.js
// Modificação: adiciona detector de 5 toques rápidos no nome/streak
// para abrir a DevScreen (sem aparecer para usuários normais).

import React, { useRef, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../context/UserContext';

// Constantes do easter egg
const TOQUES_NECESSARIOS = 5;
const JANELA_MS = 2000; // os 5 toques precisam ocorrer em 2 segundos

export default function PontosHeader() {
  const navigation = useNavigation();
  const { nome, pontos, streak } = useUser();

  // ── Detector de toques rápidos ──────────────────────────────────────────
  const toquesRef = useRef(0);
  const timerRef = useRef(null);

  const handleToque = useCallback(() => {
    toquesRef.current += 1;

    // Reinicia o timer a cada toque
    if (timerRef.current) clearTimeout(timerRef.current);

    if (toquesRef.current >= TOQUES_NECESSARIOS) {
      toquesRef.current = 0;
      navigation.navigate('Dev');
      return;
    }

    // Se não chegou em 5 dentro da janela, reseta o contador
    timerRef.current = setTimeout(() => {
      toquesRef.current = 0;
    }, JANELA_MS);
  }, [navigation]);

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <View style={s.container}>
      {/* Área clicável para o easter egg — nome + streak */}
      <TouchableOpacity
        onPress={handleToque}
        activeOpacity={1} // sem feedback visual para não chamar atenção
        style={s.infoEsquerda}
      >
        <Text style={s.nome} numberOfLines={1}>
          {nome ?? 'Eco Rato'}
        </Text>
        <Text style={s.streak}>🔥 {streak ?? 0} dias</Text>
      </TouchableOpacity>

      {/* Pontos — lado direito, sem toque especial */}
      <View style={s.pontosContainer}>
        <Text style={s.pontosValor}>⭐ {pontos ?? 0}</Text>
        <Text style={s.pontosLabel}>pts</Text>
      </View>
    </View>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────
// Mantém a mesma aparência visual do header original.
// Ajuste conforme seu theme.js quando ele for implementado.
const s = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#515a47',
    paddingHorizontal: 16,
    paddingVertical: 18,
  },
  infoEsquerda: {
    flex: 1,
    marginRight: 12,
  },
  nome: {
    color: '#f1f7ed',
    fontSize: 16,
    fontWeight: '700',
  },
  streak: {
    color: '#e0eec6',
    fontSize: 12,
    marginTop: 2,
  },
  pontosContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 2,
  },
  pontosValor: {
    color: '#c2a83e',
    fontSize: 18,
    fontWeight: '700',
  },
  pontosLabel: {
    color: '#c2a83e',
    fontSize: 11,
    marginLeft: 2,
  },
});
