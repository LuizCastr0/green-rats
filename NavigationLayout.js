import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useUser } from './src/context/UserContext';
import { registrarAtividadeCompleta } from './src/services/LogicaApp';
import { limparDadosDoUsuario } from './src/services/Armazenamento';

export default function NavigationLayout() {
  const { pontos, streak, nivel, atualizarDadosGlobais } = useUser();
  const [loading, setLoading] = useState(false);
  const [log, setLog] = useState("Aguardando ação...");

  const resetarTudoParaTestes = async () => {
  if (confirm("Tem certeza que quer apagar TODOS os dados salvos e testar como novo usuário?")) {
    setLoading(true);
    await limparDadosDoUsuario();
    setLog("💥 Todos os dados foram apagados do celular!\n\n👉 AGORA FAÇA ISSO: Pressione 'r' no seu terminal do VS Code para recarregar o Expo Go. O app vai abrir direto na tela de Setup!");
    setLoading(false);
  }
};

  const executarTeste = async (tipo) => {
    setLoading(true);
    let mockAtividade;

    if (tipo === 'VEGAN') {
      mockAtividade = { titulo: "Refeição Vegana", pontos: 50 };
    } else {
      mockAtividade = { titulo: "Ir de Bike", pontos: 30 };
    }

    const resultado = await registrarAtividadeCompleta(mockAtividade);
    
    if (resultado.sucesso) {
      setLog(`✅ ${mockAtividade.titulo} registrada!\nNovo Streak: ${resultado.novoStreak}`);
      await atualizarDadosGlobais(); // Atualiza os números na tela na hora!
    } else {
      setLog("❌ Erro ao registrar.");
    }
    setLoading(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>GreenRats Engine 🌱</Text>
      
      

      {/* CARD DE STATUS GLOBAL (O que o Context API está vendo) */}
      <View style={styles.statsCard}>
        <Text style={styles.cardTitle}>Status do Usuário (Global)</Text>
        <View style={styles.row}>
          <Text style={styles.statLabel}>Pontos:</Text>
          <Text style={styles.statValue}>{pontos}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.statLabel}>Streak:</Text>
          <Text style={styles.statValue}>{streak} dias</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.statLabel}>Nível:</Text>
          <Text style={styles.statValue}>{nivel}</Text>
        </View>
      </View>

      {/* PAINEL DE CONTROLE (Simulando cliques do usuário) */}
      <View style={styles.controlPanel}>
        <Text style={styles.cardTitle}>Simular Atividades</Text>
        
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => executarTeste('VEGAN')}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Comer Vegano (+50xp)</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, { backgroundColor: '#1976d2' }]} 
          onPress={() => executarTeste('BIKE')}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Usar Bike (+30xp)</Text>
        </TouchableOpacity>
      </View>

      {/* CONSOLE DE LOG */}
      <View style={styles.logBox}>
        <Text style={styles.logTitle}>Console de Saída:</Text>
        {loading ? <ActivityIndicator color="#2e7d32" /> : <Text style={styles.logText}>{log}</Text>}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 40, backgroundColor: '#f0f2f5', alignItems: 'center' },
  header: { fontSize: 24, fontWeight: 'bold', color: '#1b5e20', marginBottom: 20 },
  statsCard: { 
    backgroundColor: '#fff', width: '100%', padding: 20, borderRadius: 15, 
    elevation: 4, marginBottom: 20, borderLeftWidth: 5, borderLeftColor: '#4caf50' 
  },
  controlPanel: { backgroundColor: '#fff', width: '100%', padding: 20, borderRadius: 15, elevation: 4, marginBottom: 20 },
  cardTitle: { fontSize: 12, color: '#888', textTransform: 'uppercase', marginBottom: 15, fontWeight: '700' },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  statLabel: { fontSize: 16, color: '#555' },
  statValue: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  button: { backgroundColor: '#2e7d32', padding: 15, borderRadius: 10, marginBottom: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  logBox: { backgroundColor: '#333', width: '100%', padding: 15, borderRadius: 10 },
  logTitle: { color: '#4caf50', fontSize: 10, marginBottom: 5, fontWeight: 'bold' },
  logText: { color: '#fff', fontSize: 14, fontFamily: 'monospace' }
});