/**
 * SERVIÇO: UserContext (Barramento de Dados Global)

 * Provê o estado global da aplicação, conectando a camada de persistência 
 * (AsyncStorage) com a interface (React Native). Gerencia reativamente 
 * Pontuação, Streak, Nível e inventário do boneco.
 * * DESIGN PATTERN: Context API + Custom Hooks (useUser).

* TODO
 * * 1. [Sincronização Cloud]: Implementar fallback para banco de dados remoto 
 * (Firebase/Supabase) para evitar perda de dados em caso de troca de celular.
 * * 2. [Localização & Unidades]: Atualmente utiliza métricas fixas. Para o 
 * mercado europeu (DACH region), implementar i18n para suporte a Alemão 
 * e conversão dinâmica de impacto (ex: gCO2/km vs kgCO2/km).
 * * 3. [Otimização de Render]: À medida que o inventário do boneco crescer, 
 * considerar o uso de useMemo para evitar re-renderizações desnecessárias 
 * em telas que não dependem da pontuação.
 * * 4. [Integração ML]: Adicionar um campo para 'Peso de Preferência' baseado 
 * nas atitudes favoritadas, preparando o terreno para um sistema de 
 * recomendação via regressão simbólica.
 */


import React, { createContext, useState, useEffect, useContext } from 'react';
import { carregarPontuacao, carregarStreak, carregarProgresso } from '../services/Armazenamento';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [pontos, setPontos] = useState(0);
  const [streak, setStreak] = useState(0);
  const [nivel, setNivel] = useState(1);
  const [carregando, setCarregando] = useState(true);

  // Função para atualizar os dados na tela sempre que algo mudar
  const atualizarDadosGlobais = async () => {
    const p = await carregarPontuacao();
    const s = await carregarStreak();
    const prog = await carregarProgresso();

    setPontos(p);
    setStreak(s.contagem);
    setNivel(prog?.nivel || 1);
    setCarregando(false);
  };

  useEffect(() => {
    atualizarDadosGlobais();
  }, []);

  return (
    <UserContext.Provider value={{ pontos, streak, nivel, carregando, atualizarDadosGlobais }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook personalizado para facilitar o uso nas telas
export const useUser = () => useContext(UserContext);