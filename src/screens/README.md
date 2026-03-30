# screens/

Esta pasta contém **uma tela por arquivo**. Cada tela é o que o usuário vê quando navega para uma parte do app.

---

## O que é uma tela

Uma tela ocupa a tela inteira do celular. Ela é ativada pela navegação (pasta `navigation/`) e combina componentes, dados e lógica para montar o que o usuário vê.

Exemplos de telas:
- A tela inicial com o resumo do dia
- A tela de metas diárias
- A tela de relatório semanal
- A tela de conquistas

---

## Como nomear

Sempre `NomeDaTela` + `Screen` + `.js`:

```
HomeScreen.js
MetasDiariasScreen.js
RelatorioScreen.js
ConquistasScreen.js
PerfilScreen.js
```

---

## Estrutura obrigatória de uma tela

Todo arquivo de tela segue este esqueleto. Copie e adapte — não invente outro formato.

```js
// 1. Imports de bibliotecas (sempre primeiro)
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

// 2. Imports internos do projeto
import { theme } from '../styles/theme';
import { buscarMetasDoDia } from '../services/metasService';
import CartaoMeta from '../components/CartaoMeta';

// 3. O componente da tela
function HomeScreen({ navigation }) {
  // 3a. Estados da tela
  const [metas, setMetas] = useState([]);
  const [pontuacao, setPontuacao] = useState(0);

  // 3b. Efeitos (o que roda quando a tela abre)
  useEffect(() => {
    const dadosDoDia = buscarMetasDoDia();
    setMetas(dadosDoDia);
  }, []);

  // 3c. Funções da tela
  function handleMetaConcluida(id) {
    // lógica aqui
  }

  // 3d. O que aparece na tela (sempre por último)
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.titulo}>Bom dia!</Text>
      {metas.map(meta => (
        <CartaoMeta
          key={meta.id}
          meta={meta}
          onConcluir={handleMetaConcluida}
        />
      ))}
    </ScrollView>
  );
}

// 4. Estilos da tela (sempre no final do arquivo)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.cores.fundo,
    padding: theme.espacamento.md,
  },
  titulo: {
    fontSize: theme.fontes.tamanhos.grande,
    color: theme.cores.texto,
  },
});

// 5. Export (sempre a última linha)
export default HomeScreen;
```

---

## Regras desta pasta

- ✅ Uma tela por arquivo
- ✅ Importar cores e fontes sempre de `../styles/theme`
- ✅ Lógica pesada vai em `../services/`, não dentro da tela
- ✅ Dados do jogo vêm de `../data/`, não escritos diretamente na tela
- ❌ Não criar sub-pastas aqui
- ❌ Não colocar componentes reutilizáveis aqui (vai em `../components/`)
- ❌ Não escrever cores ou fontes diretamente — use sempre `theme`

---

## Telas existentes

> Atualize esta tabela quando criar uma tela nova.

| Arquivo | O que mostra | Quem fez |
|---------|-------------|----------|
| *(vazio por enquanto)* | | |

---

## Como navegar entre telas

A navegação é controlada pela pasta `navigation/`. Para ir de uma tela para outra dentro do seu código, use o objeto `navigation` que chega como prop:

```js
// Ir para outra tela
navigation.navigate('NomeDaTela');

// Ir e passar dados
navigation.navigate('DetalheMeta', { metaId: 123 });

// Voltar para a tela anterior
navigation.goBack();
```

Os nomes das telas são definidos em `../navigation/`. Confirme o nome exato lá antes de usar.
