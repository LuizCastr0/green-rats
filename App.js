import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { UserProvider } from './src/context/UserContext';
import SetupScreen from './src/screens/SetupScreen';
import AppNavigator from './src/navigation';
import { carregarProgresso } from './src/services/Armazenamento';

const Stack = createNativeStackNavigator();

function RootNavigator() {
  const [telaInicial, setTelaInicial] = useState(null);

  useEffect(() => {
    async function verificarSetup() {
      const progresso = await carregarProgresso();
      setTelaInicial(progresso?.nome ? 'Main' : 'Setup');
    }
    verificarSetup();
  }, []);

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
  return (
    <UserProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </UserProvider>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f1f7ed' },
});