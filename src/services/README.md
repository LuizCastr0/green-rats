# services/

Esta pasta contém **funções de lógica pura** — coisas que o app faz que não são visuais. Salvar e recuperar o progresso do usuário, calcular pontuação, gerar o relatório, verificar se uma meta foi concluída hoje.

---

## A diferença entre services e o resto

| Pasta | Cuida de |
|-------|----------|
| `screens/` | O que aparece na tela |
| `components/` | Pedaços visuais reutilizáveis |
| `data/` | Conteúdo fixo do jogo |
| **`services/`** | **O que o app faz — a lógica** |

Se você está escrevendo uma função que não retorna JSX (não retorna elementos visuais), ela provavelmente pertence aqui.

---

## Como nomear

Arquivos: `camelCase` + `Service.js` quando for um grupo de funções relacionadas.

```
storageService.js     ← salvar e ler dados do celular
metasService.js       ← lógica das metas (filtrar, marcar, verificar)
pontuacaoService.js   ← calcular pontos, streaks, níveis
relatorioService.js   ← gerar dados do relatório semanal/mensal
```

---

## Estrutura obrigatória de um service

```js
// src/services/storageService.js

import AsyncStorage from '@react-native-async-storage/async-storage';

// Cada função exportada individualmente
// Comentário obrigatório explicando o que faz, o que recebe e o que retorna

/**
 * Salva o progresso do usuário no armazenamento do celular.
 * @param {object} progresso - objeto com os dados a salvar
 * @returns {Promise<void>}
 */
export async function salvarProgresso(progresso) {
  try {
    const json = JSON.stringify(progresso);
    await AsyncStorage.setItem('@ecorank_progresso', json);
  } catch (erro) {
    console.error('Erro ao salvar progresso:', erro);
  }
}

/**
 * Recupera o progresso salvo do usuário.
 * @returns {Promise<object|null>} - o progresso salvo ou null se não houver nada
 */
export async function carregarProgresso() {
  try {
    const json = await AsyncStorage.getItem('@ecorank_progresso');
    return json != null ? JSON.parse(json) : null;
  } catch (erro) {
    console.error('Erro ao carregar progresso:', erro);
    return null;
  }
}
```

---

## Chaves do AsyncStorage — use sempre o prefixo `@ecorank_`

Para não conflitar com outros apps no celular, todas as chaves de armazenamento começam com `@ecorank_`.

| Chave | O que guarda |
|-------|-------------|
| `@ecorank_progresso` | progresso geral do usuário |
| `@ecorank_metasHoje` | quais metas foram concluídas hoje |
| `@ecorank_historico` | histórico dos últimos 30 dias |
| `@ecorank_pontuacao` | pontuação total acumulada |

> Atualize esta tabela quando criar uma chave nova. Nunca use a mesma chave para coisas diferentes.

---

## Regras desta pasta

- ✅ Toda função deve ter comentário `@param` e `@returns`
- ✅ Toda função que usa AsyncStorage é `async` e tem `try/catch`
- ✅ Exportar funções individualmente (`export function`), não objeto default
- ✅ Lógica pura — sem `return <View>`, sem JSX de nenhum tipo
- ❌ Não acessar AsyncStorage direto nas telas — sempre via functions daqui
- ❌ Não importar de `screens/` ou `components/`

---

## Como importar nas telas

```js
// Importar só o que precisar — não importar o arquivo inteiro
import { carregarProgresso, salvarProgresso } from '../services/storageService';
import { buscarMetasDoDia } from '../services/metasService';
```

---

## Serviços existentes

> Atualize quando criar um serviço novo.

| Arquivo | O que faz | Funções principais |
|---------|-----------|-------------------|
| *(vazio por enquanto)* | | |
