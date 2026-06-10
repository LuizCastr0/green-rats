// src/components/PulseView.js
// Envolve qualquer componente e faz um pulso de escala quando `ativo` vira true
import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

export default function PulseView({ ativo, children, style }) {
  const escala = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!ativo) return;
    Animated.sequence([
      Animated.spring(escala, { toValue: 1.15, useNativeDriver: true, speed: 50 }),
      Animated.spring(escala, { toValue: 1,    useNativeDriver: true, speed: 30 }),
    ]).start();
  }, [ativo]);

  return (
    <Animated.View style={[style, { transform: [{ scale: escala }] }]}>
      {children}
    </Animated.View>
  );
}