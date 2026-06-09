import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import ConquistasScreen from '../screens/ConquistasScreen';
import PontosHeader from '../components/PontosHeader';
import DevScreen from '../screens/DevScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabIcon({ emoji, focused }) {
  return <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.5 }}>{emoji}</Text>;
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        header: () => <PontosHeader />,
        headerShown: true,
        tabBarActiveTintColor: '#515a47',
        tabBarInactiveTintColor: '#999',
      }}
    >
      <Tab.Screen
        name="Hoje"
        component={HomeScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="🌿" focused={focused} /> }}
      />
      <Tab.Screen
        name="Conquistas"
        component={ConquistasScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="🏆" focused={focused} /> }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="Dev" component={DevScreen} />
    </Stack.Navigator>
  );
}