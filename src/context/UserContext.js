import React, { createContext, useState, useEffect, useContext } from 'react';
import {
  carregarPontuacao,
  carregarStreak,
  carregarProgresso,
} from '../services/Armazenamento';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [pontos, setPontos] = useState(0);
  const [streak, setStreak] = useState(0);
  const [nivel, setNivel] = useState(1);
  const [nome, setNome] = useState('');
  const [carregando, setCarregando] = useState(true);

  const atualizarDadosGlobais = async () => {
    const p = await carregarPontuacao();
    const s = await carregarStreak();
    const prog = await carregarProgresso();

    setPontos(p);
    setStreak(s.contagem);
    setNivel(prog?.nivel || 1);
    setNome(prog?.nome || '');
    setCarregando(false);
  };

  useEffect(() => {
    atualizarDadosGlobais();
  }, []);

  return (
    <UserContext.Provider value={{ pontos, streak, nivel, nome, carregando, atualizarDadosGlobais }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);