// src/services/som.js
import { Audio } from 'expo-av';

const cache = {};

async function tocar(arquivo) {
  try {
    if (cache[arquivo]) {
      await cache[arquivo].replayAsync();
      return;
    }
    const { sound } = await Audio.Sound.createAsync(arquivo);
    cache[arquivo] = sound;
    await sound.playAsync();
  } catch (e) {
    // Som é detalhe — nunca deixar quebrar o app por isso
    console.warn('[som] Erro ao tocar:', e);
  }
}

export const som = {
  clique:    () => tocar(require('../../assets/sons/clique.wav')),
  conquista: () => tocar(require('../../assets/sons/conquista.wav')),
  compra:    () => tocar(require('../../assets/sons/compra.wav')),
};