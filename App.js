import React, { useEffect, useState, useCallback } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { UserProvider } from './src/context/UserContext';
import SetupScreen from './src/screens/SetupScreen';
import AppNavigator from './src/navigation';
import { carregarProgresso } from './src/services/Armazenamento';

const Stack = createNativeStackNavigator();

function RootNavigator({ onResetRef }) {
  const [telaInicial, setTelaInicial] = useState(null);

  const verificarSetup = useCallback(async () => {
    setTelaInicial(null); // força tela de loading enquanto verifica
    const progresso = await carregarProgresso();
    setTelaInicial(progresso?.nome ? 'Main' : 'Setup');
  }, []);

  useEffect(() => {
    verificarSetup();
  }, []);

  // Expõe a função de reverificação para a DevScreen chamar via ref
  useEffect(() => {
    if (onResetRef) onResetRef.current = verificarSetup;
  }, [verificarSetup]);

  if (telaInicial === null) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#515a47" />
      </View>
    );
  }

  return (
    <Stack.Navigator initialRouteName={telaInicial} screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Setup" component={SetupScreen} />
      <Stack.Screen name="Main" component={AppNavigator} />
    </Stack.Navigator>
  );
}

export default function App() {
  const onResetRef = React.useRef(null);

  return (
    <UserProvider>
      <NavigationContainer>
        <RootNavigator onResetRef={onResetRef} />
      </NavigationContainer>
    </UserProvider>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f1f7ed' },
});