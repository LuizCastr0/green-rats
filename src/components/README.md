# components/

Esta pasta contém **pedaços reutilizáveis de tela**. Um componente é algo que aparece em mais de um lugar no app — um botão estilizado, um card de meta, uma barra de progresso.

---

## A diferença entre componente e tela

| | Tela (screens/) | Componente (components/) |
|--|----------------|--------------------------|
| Ocupa | A tela inteira | Só um pedaço da tela |
| Aparece | Uma vez por rota | Em vários lugares |
| Exemplos | HomeScreen, RelatorioScreen | CartaoMeta, BotaoPrimario, BarraProgresso |

**Regra prática:** se você vai usar a mesma coisa em duas telas diferentes, é um componente. Se aparece só em uma tela e é simples, pode ficar dentro da própria tela.

---

## Como nomear

Sempre `NomeDescritivo` em PascalCase, sem sufixo:

```
CartaoMeta.js
BotaoPrimario.js
BarraProgresso.js
EtiquetaCategoria.js
IconeConquista.js
TelaCarregando.js
```

---

## Estrutura obrigatória de um componente

```js
// 1. Imports
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { theme } from '../styles/theme';

// 2. O componente
// Props sempre documentadas com comentário acima
/**
 * Exibe um card com as informações de uma meta.
 *
 * @param {object}   meta       - objeto da meta vindo de data/metas.js
 * @param {boolean}  concluida  - se a meta já foi concluída hoje
 * @param {function} onConcluir - função chamada quando usuário marca como feita
 */
function CartaoMeta({ meta, concluida, onConcluir }) {
  return (
    <TouchableOpacity
      style={[styles.cartao, concluida && styles.cartaoConcluido]}
      onPress={() => onConcluir(meta.id)}
    >
      <Text style={styles.titulo}>{meta.titulo}</Text>
      <Text style={styles.pontos}>+{meta.pontos} pts</Text>
    </TouchableOpacity>
  );
}

// 3. Estilos
const styles = StyleSheet.create({
  cartao: {
    backgroundColor: theme.cores.superficie,
    borderRadius: theme.bordas.raio,
    padding: theme.espacamento.md,
    marginBottom: theme.espacamento.sm,
  },
  cartaoConcluido: {
    opacity: 0.5,
  },
  titulo: {
    fontSize: theme.fontes.tamanhos.normal,
    color: theme.cores.texto,
  },
  pontos: {
    fontSize: theme.fontes.tamanhos.pequeno,
    color: theme.cores.destaque,
  },
});

// 4. Export
export default CartaoMeta;
```

---

## Como documentar as props

Todo componente precisa ter o bloco de comentário acima da função explicando o que cada prop faz. Isso é o que permite outra pessoa usar seu componente sem precisar ler o código inteiro.

```js
/**
 * Descrição em uma linha do que o componente faz.
 *
 * @param {tipo}   nomeDaProp  - o que ela representa
 * @param {string} titulo      - texto exibido no topo do card
 * @param {number} pontos      - quantidade de pontos que a meta vale
 * @param {boolean} opcional   - (opcional) descrição do que faz se omitida
 */
```

---

## Regras desta pasta

- ✅ Um componente por arquivo
- ✅ Comentar todas as props com o bloco `@param`
- ✅ Estilos sempre via `theme` — nunca valores soltos como `color: '#fff'`
- ✅ Componente recebe dados por props — não busca dados direto do storage
- ❌ Não usar `navigation` dentro de componentes — quem navega é a tela
- ❌ Não criar sub-pastas aqui
- ❌ Não duplicar um componente para "personalizar" — adicione uma prop nova

---

## Componentes existentes

> Atualize esta tabela quando criar um componente novo.

| Arquivo | O que faz | Props principais | Usado em |
|---------|-----------|-----------------|----------|
| *(vazio por enquanto)* | | | |
