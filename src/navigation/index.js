import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text, View, StyleSheet } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import ConquistasScreen from '../screens/ConquistasScreen';
import PontosHeader from '../components/PontosHeader';
import DevScreen from '../screens/DevScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabIcon({ emoji, focused }) {
  return (
    <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.5 }}>{emoji}</Text>
  );
}

function MainTabs() {
  return (
    <View style={{ flex: 1, backgroundColor: '#f1f7ed' }}>
      <PontosHeader />
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarActiveTintColor: '#515a47',
          tabBarInactiveTintColor: '#999',
          tabBarLabelStyle: styles.tabLabel,
        }}
      >
        <Tab.Screen
          name="Hoje"
          component={HomeScreen}
          options={{
            tabBarIcon: ({ focused }) => <TabIcon emoji="🌿" focused={focused} />,
          }}
        />
        <Tab.Screen
          name="Conquistas"
          component={ConquistasScreen}
          options={{
            tabBarIcon: ({ focused }) => <TabIcon emoji="🏆" focused={focused} />,
          }}
        />
      </Tab.Navigator>
    </View>
  );
}

// AppNavigator recebe onResetRef e passa para DevScreen via props de rota
export default function AppNavigator({ onResetRef }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen
        name="Dev"
        options={{ animation: 'slide_from_bottom', gestureEnabled: true }}
      >
        {(props) => <DevScreen {...props} onResetRef={onResetRef} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e0eec6',
    height: 64,
    paddingBottom: 8,
    paddingTop: 6,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
});