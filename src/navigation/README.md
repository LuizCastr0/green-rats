# navigation/

Esta pasta controla **como o usuário se move entre as telas** — qual tela aparece primeiro, quais telas fazem parte de cada grupo, e como as transições funcionam.

---

## O que é navegação

Navegação é o sistema que decide o que aparece na tela quando o usuário toca em um botão, desliza, ou quando o app abre. No React Native, isso é gerenciado pela biblioteca `react-navigation`.

Pense nesta pasta como o **mapa do app**: ela descreve todas as telas que existem e como elas se conectam, mas não faz parte do visual de nenhuma delas.

---

## Quem mexe nesta pasta

**Normalmente só o líder.** A estrutura de navegação afeta o app inteiro — uma mudança aqui pode quebrar várias telas ao mesmo tempo. Se você acha que precisa adicionar ou reorganizar uma tela no fluxo de navegação, avise o líder antes de mexer.

---

## Tipos de navegação que usaremos

### Stack Navigator
Telas empilhadas — o usuário vai "abrindo" telas e pode voltar. Funciona como as páginas de um browser.

```
Home → Detalhe da Meta → Informação Ecológica
```

### Tab Navigator  
Abas na parte inferior da tela. O usuário muda de seção sem "sair" da tela atual.

```
[Hoje] [Conquistas] [Relatório] [Perfil]
```

---

## Estrutura dos arquivos

```
navigation/
├── README.md          ← este arquivo
├── AppNavigator.js    ← navegador raiz — importado pelo App.js
├── TabNavigator.js    ← as abas principais (se houver)
└── nomes.js           ← constantes com os nomes de todas as telas
```

---

## O arquivo mais importante: nomes.js

Este arquivo exporta uma constante com os nomes de todas as telas do app. **Ninguém escreve o nome de uma tela como string direta no código.** Sempre importa daqui.

```js
// src/navigation/nomes.js

export const TELAS = {
  HOME:              'Home',
  METAS_DIARIAS:     'MetasDiarias',
  DETALHE_META:      'DetalheMeta',
  CONQUISTAS:        'Conquistas',
  RELATORIO:         'Relatorio',
  PERFIL:            'Perfil',
};
```

```js
// ✅ Correto — importar o nome da constante
import { TELAS } from '../navigation/nomes';
navigation.navigate(TELAS.METAS_DIARIAS);

// ❌ Errado — nunca escrever o nome da tela como string direta
navigation.navigate('MetasDiarias');
```

Por quê? Se o nome de uma tela mudar, basta atualizar em `nomes.js`. Sem isso, você teria que procurar em todo o projeto onde aquela string aparece.

---

## Telas registradas no app

> Esta tabela é a fonte da verdade. Atualize quando uma tela for adicionada ou removida.

| Constante em nomes.js | Nome da tela | Arquivo | Parte de qual navigator |
|----------------------|-------------|---------|------------------------|
| *(vazio por enquanto)* | | | |

---

## Regras desta pasta

- ✅ Todo nome de tela definido em `nomes.js` como constante
- ✅ Sempre importar `TELAS` de `nomes.js` ao navegar
- ✅ Qualquer mudança na estrutura: avisar o líder antes
- ❌ Não colocar lógica visual aqui — só configuração de navegação
- ❌ Não criar navigators novos sem combinar com o líder
