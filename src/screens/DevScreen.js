// src/screens/DevScreen.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../context/UserContext';
import { resetarTudo, simularViradaDia, adicionarPontosDebug } from '../services/Armazenamento';

export default function DevScreen() {
  const { atualizarDadosGlobais } = useUser();
  const navigation = useNavigation();
  const [log, setLog] = useState("Painel de Controle Dev Ativo 🐀");

  const handleReset = async () => {
    await resetarTudo();
    setLog("TUDO APAGADO! \n\nReinicie o Expo (aperte 'r' no terminal) para voltar à tela de Setup.");
    await atualizarDadosGlobais();
  };

  const handleAvancarDia = async () => {
    const res = await simularViradaDia();
    setLog(`Dia avançado!\nData: ${res.dataSimulada}\nStreak: ${res.streakAnterior} ➔ ${res.streakAtual}\nAtividades resetadas: ${res.atividadesResetadas}`);
    await atualizarDadosGlobais();
  };

  const handleDarDinheiro = async () => {
    await adicionarPontosDebug(500);
    setLog("💰 500 Pontos adicionados na conta!");
    await atualizarDadosGlobais();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Engine de Testes 🛠️</Text>
      
      <View style={styles.logBox}>
        <Text style={styles.logText}>{log}</Text>
      </View>

      <TouchableOpacity style={[styles.btn, { backgroundColor: '#1976d2' }]} onPress={handleAvancarDia}>
        <Text style={styles.btnText}>⏩ Avançar 1 Dia (Testar Streak)</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.btn, { backgroundColor: '#388e3c' }]} onPress={handleDarDinheiro}>
        <Text style={styles.btnText}>💰 Adicionar 500 Pontos</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.btn, { backgroundColor: '#d32f2f', marginTop: 20 }]} onPress={handleReset}>
        <Text style={styles.btnText}>💥 ZERAR O APP</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.btn, { backgroundColor: '#555', marginTop: 40 }]} onPress={() => navigation.goBack()}>
        <Text style={styles.btnText}>Voltar para o App</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, paddingTop: 60, backgroundColor: '#1a1a1a', flexGrow: 1 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#fff', marginBottom: 20 },
  logBox: { backgroundColor: '#000', padding: 16, borderRadius: 10, marginBottom: 24, minHeight: 100, justifyContent: 'center' },
  logText: { color: '#4caf50', fontFamily: 'monospace', fontSize: 14 },
  btn: { padding: 16, borderRadius: 12, marginBottom: 12, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});