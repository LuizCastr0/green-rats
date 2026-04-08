import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  console.log("funcionou"); // deve aparecer no console e noexpo
  return (
    <View style={styles.container}>
      <Text style={styles.text}>GreenRats 🌱</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // Fundo branco para garantir que não é a tela preta
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#2e7d32', // Verde
  },
  status: {
    fontSize: 16,
    color: '#333',
    marginTop: 20,
  },
});