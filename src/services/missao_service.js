// src/services/MissaoService.js

// logica de envio da missão do dia, 
import { missoesGlobais } from '../data/missoes';

export const getMissaoDoDia = () => {
  const hoje = new Date();
  
  // Criamos um número único para o dia (ex: 20240410)
  // Isso garante que a missão mude meia-noite
  const semente = hoje.getFullYear() * 10000 + (hoje.getMonth() + 1) * 100 + hoje.getDate();
  
  // Usamos o resto da divisão pelo tamanho do array para escolher o índice
  const indice = semente % missoesGlobais.length;
  
  return missoesGlobais[indice];
};