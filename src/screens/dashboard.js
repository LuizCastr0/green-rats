import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  Image,
  Switch,
  FlatList
} from 'react-native';

// 🔌 ESPAÇO PARA IMPORTS DO BACK-END / CONTEXTO
// import { useUser } from './src/context/UserContext';
// import { registrarAtividadeCompleta } from './src/services/LogicaApp';

export default function DashboardPreview() {
  // 💾 ESTADOS (STATE) - Para controle dos inputs e testes de interface
  const [textoInput, setTextoInput] = useState('');
  const [isSwitchOn, setIsSwitchOn] = useState(false);

  // 🧪 MOCK DATA - Dados temporários para testar listas antes do Banco de Dados estar pronto
  const dadosMockExemplo = [
    { id: '1', titulo: 'Reciclagem de Plástico', xp: '30 XP' },
    { id: '2', titulo: 'Uso de Transporte Público', xp: '40 XP' },
    { id: '3', titulo: 'Almoço Sem Carne', xp: '50 XP' },
  ];

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
      
      {/* ═════════════════════════════════════════════════════════════ */}
      {/* 1. CABEÇALHO / HEADER                                         */}
      {/* ═════════════════════════════════════════════════════════════ */}
      <View style={styles.headerContainer}>
        <Text style={styles.titleApp}>GreenRats 🌱</Text>
        <Text style={styles.subtitleApp}>Protótipo de Interface & Testes</Text>
      </View>

      {/* ═════════════════════════════════════════════════════════════ */}
      {/* 2. CARD DE STATUS (Ideal para conectar com o UserContext)     */}
      {/* ═════════════════════════════════════════════════════════════ */}
      <View style={styles.statusCard}>
        <Text style={styles.cardSectionTitle}>Status do Usuário</Text>
        
        {/* Exemplo de exibição de dados dinâmicos */}
        <View style={styles.rowInfo}>
          <Text style={styles.labelHeader}>Pontuação Atual:</Text>
          <Text style={styles.valueHeader}>350 XP</Text> {/* 🔌 Conectar {pontos} aqui */}
        </View>

        {/* BARRA DE PROGRESSO RESPONSIVA (Simulada com Views) */}
        <View style={styles.progressBarBackground}>
          <View style={[styles.progressBarFill, { width: '65%' }]} /> {/* ALTERE O % PARA TESTAR A BARRA */}
        </View>
      </View>

      {/* ═════════════════════════════════════════════════════════════ */}
      {/* 3. BOTÕES DE AÇÃO (Componentes de toque interativos)          */}
      {/* ═════════════════════════════════════════════════════════════ */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Controles e Ações</Text>

        {/* Botão Principal (Estilo Sucesso/Verde) */}
        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={() => console.log('Botão Principal Pressionado!')} /* 🔌 Conectar função do back aqui */
        >
          <Text style={styles.buttonText}>Registrar Ação Sustentável</Text>
        </TouchableOpacity>

        {/* Botão Secundário (Estilo Alerta/Borda) */}
        <TouchableOpacity style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>Resetar Histórico (Debug)</Text>
        </TouchableOpacity>
      </View>

      {/* ═════════════════════════════════════════════════════════════ */}
      {/* 4. ELEMENTOS DE FORMULÁRIO (Inputs, Seletores)               */}
      {/* ═════════════════════════════════════════════════════════════ */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Entrada de Dados</Text>

        <TextInput
          style={styles.inputField}
          placeholder="Digite o nome de uma nova atividade..."
          placeholderTextColor="#999"
          value={textoInput}
          onChangeText={setTextoInput}
        />

        {/* Elemento de Chave (Liga/Desliga) - Bom para configurações */}
        <View style={styles.rowSwitch}>
          <Text style={styles.labelField}>Ativar Notificações:</Text>
          <Switch
            value={isSwitchOn}
            onValueChange={(value) => setIsSwitchOn(value)}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={isSwitchOn ? '#f5dd4b' : '#f4f3f4'}
          />
        </View>
      </View>

      {/* ═════════════════════════════════════════════════════════════ */}
      {/* 5. LISTAGEM DE DADOS (Simulação de Histórico ou Missões)      */}
      {/* ═════════════════════════════════════════════════════════════ */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Listagem Provisória</Text>
        
        {dadosMockExemplo.map((item) => (
          <View key={item.id} style={styles.listItem}>
            <Text style={styles.listItemText}>{item.titulo}</Text>
            <Text style={styles.listItemBadge}>{item.xp}</Text>
          </View>
        ))}
      </View>

    </ScrollView>
  );
}

// ═════════════════════════════════════════════════════════════════
// 🧠 ESTILIZAÇÃO (StyleSheet) - Organizado por contexto visual
// ═════════════════════════════════════════════════════════════════
const styles = StyleSheet.create({
  scrollContainer: {
    padding: 24,
    backgroundColor: '#f8f9fa', // Fundo cinza claro moderno
    alignItems: 'center',
  },
  // 1. Cabeçalho
  headerContainer: {
    alignItems: 'center',
    marginBottom: 25,
    marginTop: 20,
  },
  titleApp: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1b5e20',
  },
  subtitleApp: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  // 2. Card de Status
  statusCard: {
    backgroundColor: '#ffffff',
    width: '100%',
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 20,
  },
  cardSectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9e9e9e',
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  rowInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  labelHeader: { fontSize: 16, color: '#333' },
  valueHeader: { fontSize: 20, fontWeight: 'bold', color: '#2e7d32' },
  progressBarBackground: {
    width: '100%',
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#4caf50',
  },
  // 3. Seções Gerais
  sectionContainer: {
    width: '100%',
    backgroundColor: '#ffffff',
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  // 4. Botões
  primaryButton: {
    backgroundColor: '#2e7d32',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  secondaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d32f2f',
  },
  secondaryButtonText: { color: '#d32f2f', fontSize: 14, fontWeight: '600' },
  // 5. Inputs e seletores
  inputField: {
    backgroundColor: '#f1f3f4',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    fontSize: 15,
    color: '#333',
    marginBottom: 10,
  },
  rowSwitch: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
  labelField: { fontSize: 15, color: '#555' },
  // 6. Listas
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 14,
    borderRadius: 10,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#81c784',
  },
  listItemText: { fontSize: 15, color: '#333', fontWeight: '500' },
  listItemBadge: { fontSize: 13, fontWeight: 'bold', color: '#2e7d32' },
});