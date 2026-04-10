
// adicionando mock test para validar a lógica do app sem precisar da interface completa
// sera apagado a mendida que o front ficar pronto

import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';

// Importamos a função mestra que criamos no passo anterior
// Ajuste o caminho conforme onde você salvou o arquivo
import { registrarAtividadeCompleta } from './src/services/LogicaApp'; 

export default function App() {
  const [statusTeste, setStatusTeste] = useState("Aguardando teste...");
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    async function rodarMockTest() {
      console.log("🧪 Iniciando Mock Test: Simulando registro de atividade...");
      setCarregando(true);

      // Simulamos um objeto de atividade que viria do seu atividades.js
      const atividadeMock = {
        titulo: "Refeição Vegana",
        pontos: 50
      };

      // Chamamos a sua lógica
      const resultado = await registrarAtividadeCompleta(atividadeMock);

      if (resultado.sucesso) {
        const mensagem = `✅ Sucesso! Streak: ${resultado.novoStreak}`;
        console.log(mensagem);
        setStatusTeste(mensagem);
      } else {
        const mensagem = "❌ Falha no teste de lógica.";
        console.error(mensagem);
        setStatusTeste(mensagem);
      }
      
      setCarregando(false);
    }

    rodarMockTest();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>GreenRats 🌱</Text>
      
      <View style={styles.testBox}>
        <Text style={styles.statusTitle}>Console de Teste (Mock):</Text>
        {carregando ? (
          <ActivityIndicator color="#2e7d32" />
        ) : (
          <Text style={styles.statusText}>{statusTeste}</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 35,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 40,
  },
  testBox: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    width: '80%',
    alignItems: 'center',
    elevation: 3, // Sombra no Android
    shadowColor: '#000', // Sombra no iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
  },
  statusTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  statusText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center'
  },
});