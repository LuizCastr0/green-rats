import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, Alert,
} from 'react-native';

import { atividades } from '../data/atividades';
import { salvarNovoProgresso } from '../services/Armazenamento';
import { useUser } from '../context/UserContext';

export default function SetupScreen({ navigation }) {
  const [nome, setNome] = useState('');
  const [selecionadas, setSelecionadas] = useState([]);
  const { atualizarDadosGlobais } = useUser();

  function toggleAtividade(id) {
    setSelecionadas(atual =>
      atual.includes(id)
        ? atual.filter(x => x !== id)
        : [...atual, id]
    );
  }

  async function confirmar() {
    if (!nome.trim()) {
      Alert.alert('Faltou o nome!', 'Digite seu nome para continuar.');
      return;
    }

    // salva o progresso inicial com nome e atividades habituais
    await salvarNovoProgresso({
      nome: nome.trim(),
      nivel: 1,
      atividadesHabituais: selecionadas,
      dataCriacao: new Date().toISOString(),
    });

    await atualizarDadosGlobais();
    navigation.replace('Main');
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>

      {/* Cabeçalho */}
      <View style={styles.header}>
        <Text style={styles.titulo}>GreenRats 🌱</Text>
        <Text style={styles.subtitulo}>Vamos configurar seu perfil</Text>
      </View>

      {/* Campo de nome */}
      <View style={styles.secao}>
        <Text style={styles.label}>Como você se chama?</Text>
        <TextInput
          style={styles.input}
          placeholder="Seu nome aqui..."
          placeholderTextColor="#aaa"
          value={nome}
          onChangeText={setNome}
          autoFocus
        />
      </View>

      {/* Seleção de atividades */}
      <View style={styles.secao}>
        <Text style={styles.label}>O que você costuma fazer?</Text>
        <Text style={styles.dica}>Toque nas atividades que já fazem parte da sua rotina.</Text>

        <View style={styles.grade}>
          {atividades.map(atividade => {
            const marcada = selecionadas.includes(atividade.id);
            return (
              <TouchableOpacity
                key={atividade.id}
                style={[styles.cartaoAtividade, marcada && styles.cartaoMarcado]}
                onPress={() => toggleAtividade(atividade.id)}
                activeOpacity={0.7}
              >
                <Text style={styles.iconeAtividade}>{atividade.icone}</Text>
                <Text style={[styles.tituloAtividade, marcada && styles.tituloMarcado]}>
                  {atividade.titulo}
                </Text>
                <Text style={[styles.pontosAtividade, marcada && styles.pontosMarcado]}>
                  +{atividade.pontos} pts
                </Text>
                {marcada && (
                  <View style={styles.checkMark}>
                    <Text style={styles.checkTexto}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Botão confirmar */}
      <TouchableOpacity style={styles.botao} onPress={confirmar}>
        <Text style={styles.botaoTexto}>Começar →</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#f1f7ed',
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 32,
  },
  titulo: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#515a47',
  },
  subtitulo: {
    fontSize: 16,
    color: '#7ca982',
    marginTop: 6,
  },
  secao: {
    marginBottom: 28,
  },
  label: {
    fontSize: 18,
    fontWeight: '700',
    color: '#515a47',
    marginBottom: 6,
  },
  dica: {
    fontSize: 14,
    color: '#888',
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0eec6',
    color: '#333',
  },
  grade: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  cartaoAtividade: {
    width: '47%',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    borderWidth: 2,
    borderColor: '#e0eec6',
    alignItems: 'center',
    position: 'relative',
  },
  cartaoMarcado: {
    backgroundColor: '#e0eec6',
    borderColor: '#7ca982',
  },
  iconeAtividade: {
    fontSize: 28,
    marginBottom: 8,
  },
  tituloAtividade: {
    fontSize: 13,
    fontWeight: '600',
    color: '#444',
    textAlign: 'center',
  },
  tituloMarcado: {
    color: '#515a47',
  },
  pontosAtividade: {
    fontSize: 12,
    color: '#aaa',
    marginTop: 4,
  },
  pontosMarcado: {
    color: '#7ca982',
    fontWeight: '700',
  },
  checkMark: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#7ca982',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkTexto: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  botao: {
    backgroundColor: '#515a47',
    padding: 18,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  botaoTexto: {
    color: '#f1f7ed',
    fontSize: 18,
    fontWeight: 'bold',
  },
});